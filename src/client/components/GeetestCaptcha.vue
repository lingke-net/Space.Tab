<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { debounce } from 'lodash-es'

interface Props {
  captchaId?: string
  width?: string
  onSuccess?: (result: any) => void
  onError?: (error: any) => void
  onClose?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  captchaId: '',
  width: '310px'
})

const emit = defineEmits<{
  success: [result: any]
  error: [error: any]
  close: []
}>()

const captchaContainer = ref<HTMLElement>()
const captchaInstance = ref<any>(null)
const loading = ref(false)
const error = ref('')

// 声明全局类型
declare global {
  interface Window {
    initGeetest4: (config: any, callback: (captcha: any) => void) => void
  }
}

// 使用单例模式跟踪全局实例状态
let isInitializing = false;
let globalCaptchaInstance: any = null;

const initCaptcha = async () => {
  // 如果已经有实例，先销毁
  if (captchaInstance.value) {
    destroy()
  }

  if (!props.captchaId) {
    error.value = '缺少验证码配置，请联系管理员'
    console.error('极验captchaId未配置:', props.captchaId)
    return
  }

  // 如果全局已经有实例或正在初始化中，等待一下
  if (isInitializing) {
    console.log('极验验证码正在初始化中，等待...')
    await new Promise(resolve => setTimeout(resolve, 500))
    if (globalCaptchaInstance) {
      console.log('使用已存在的全局实例')
      captchaInstance.value = globalCaptchaInstance
      
      // 重新绑定事件
      captchaInstance.value.onSuccess((result: any) => {
        console.log('极验验证成功:', result)
        emit('success', result)
        props.onSuccess?.(result)
      })
      
      captchaInstance.value.onError((error: any) => {
        console.error('极验验证失败:', error)
        emit('error', error)
        props.onError?.(error)
      })
      
      captchaInstance.value.onClose(() => {
        console.log('极验验证关闭')
        emit('close')
        props.onClose?.()
      })
      
      // 将验证码插入到容器中
      if (captchaContainer.value) {
        console.log('将验证码插入到容器:', captchaContainer.value)
        captchaContainer.value.innerHTML = ''
        captchaInstance.value.appendTo(captchaContainer.value)
      }
      
      loading.value = false
      return
    }
  }

  console.log('开始初始化极验验证码，captchaId:', props.captchaId)
  loading.value = true
  error.value = ''
  isInitializing = true

  try {
    // 动态加载极验JS
    console.log('等待极验脚本加载...')
    await loadGeetestScript()
    console.log('极验脚本加载完成')
    
    // 初始化极验验证码
    console.log('开始初始化极验验证码实例...')
    window.initGeetest4({
      captchaId: props.captchaId,
      language: 'zh-cn',
      https: true, // 强制使用HTTPS
      width: props.width // 设置宽度
    }, (captcha: any) => {
      console.log('极验验证码实例创建成功:', captcha)
      captchaInstance.value = captcha
      globalCaptchaInstance = captcha
      
      // 监听验证成功事件
      captcha.onSuccess((result: any) => {
        console.log('极验验证成功:', result)
        emit('success', result)
        props.onSuccess?.(result)
      })
      
      // 监听验证失败事件
      captcha.onError((error: any) => {
        console.error('极验验证失败:', error)
        emit('error', error)
        props.onError?.(error)
      })
      
      // 监听关闭事件
      captcha.onClose(() => {
        console.log('极验验证关闭')
        emit('close')
        props.onClose?.()
      })
      
      // 将验证码插入到容器中
      if (captchaContainer.value) {
        console.log('将验证码插入到容器:', captchaContainer.value)
        // 确保容器是空的
        captchaContainer.value.innerHTML = ''
        captcha.appendTo(captchaContainer.value)
      } else {
        console.error('验证码容器未找到')
      }
      
      loading.value = false
      isInitializing = false
    })
  } catch (err: any) {
    console.error('极验初始化失败:', err)
    
    // 提供更友好的错误信息
    if (err.message.includes('CSP')) {
      error.value = '验证码加载被安全策略阻止，请联系管理员'
    } else if (err.message.includes('超时')) {
      error.value = '验证码加载超时，请检查网络连接或刷新页面'
    } else if (err.message.includes('网络')) {
      error.value = '网络连接异常，请检查网络设置或稍后重试'
    } else {
      error.value = err.message || '验证码加载失败，请刷新页面重试'
    }
    
    loading.value = false
    isInitializing = false
    emit('error', err)
    props.onError?.(err)
  }
}

// 使用单例模式确保脚本只加载一次
let scriptLoadPromise: Promise<void> | null = null;

const loadGeetestScript = (): Promise<void> => {
  // 如果已经有加载中的Promise，直接返回
  if (scriptLoadPromise) {
    return scriptLoadPromise;
  }
  
  scriptLoadPromise = new Promise((resolve, reject) => {
    console.log('开始检查极验脚本...')
    
    // 检查是否已经加载
    if (typeof window.initGeetest4 === 'function') {
      console.log('极验脚本已加载')
      resolve()
      return
    }

    console.log('极验脚本未加载，开始等待...')

    // 脚本已经在HTML中预加载，等待加载完成
    const checkScript = () => {
      if (typeof window.initGeetest4 === 'function') {
        console.log('极验脚本加载完成')
        resolve()
      } else {
        // 如果还没加载完成，继续等待
        setTimeout(checkScript, 200)
      }
    }

    // 设置更长的超时时间
    const timeout = setTimeout(() => {
      console.error('极验脚本加载超时')
      scriptLoadPromise = null; // 重置Promise以便下次重试
      reject(new Error('极验脚本加载超时，请刷新页面重试'))
    }, 20000) // 增加到20秒

    // 开始检查
    checkScript()

    // 清理超时
    const originalResolve = resolve
    resolve = () => {
      clearTimeout(timeout)
      originalResolve()
    }
  });
  
  return scriptLoadPromise;
}

const reset = () => {
  if (captchaInstance.value) {
    captchaInstance.value.reset()
  }
}

const destroy = () => {
  if (captchaInstance.value) {
    try {
      captchaInstance.value.destroy()
    } catch (err) {
      console.error('销毁验证码实例失败:', err)
    }
    captchaInstance.value = null
    
    // 如果是全局实例，也需要清理
    if (globalCaptchaInstance === captchaInstance.value) {
      globalCaptchaInstance = null
    }
  }
  if (captchaContainer.value) {
    captchaContainer.value.innerHTML = ''
  }
}

// 暴露方法给父组件
defineExpose({
  reset,
  destroy
})

onMounted(() => {
  initCaptcha()
})

onUnmounted(() => {
  destroy()
})

const debouncedReinit = debounce(() => {
  destroy()
  initCaptcha()
}, 300)

watch(
  () => props.width,
  (newWidth, oldWidth) => {
    if (newWidth !== oldWidth) {
      debouncedReinit()
    }
  }
)
</script>

<template>
  <div class="geetest-captcha" :style="{ width: props.width }">
    <div v-if="loading" class="flex items-center justify-center py-4">
      <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      <span class="ml-2 text-sm text-muted-foreground">加载验证码中...</span>
    </div>
    
    <div v-if="error" class="text-center py-4">
      <div class="text-red-500 text-sm mb-2">{{ error }}</div>
      <button 
        @click="initCaptcha" 
        class="text-sm text-primary hover:text-primary/80 underline"
        :disabled="loading"
      >
        {{ loading ? '重试中...' : '点击重试' }}
      </button>
    </div>
    
    <!-- 始终保持容器存在，但通过CSS控制显示/隐藏 -->
    <div 
      ref="captchaContainer" 
      class="captcha-container"
      :class="{ 'hidden': loading || error }"
      :style="{ width: props.width }"
    ></div>
  </div>
</template>

<style scoped>
.geetest-captcha {
  width: 100%;
  position: relative;
  min-height: 44px; /* 设置最小高度，防止抖动 */
  margin: 10px 0; /* 添加上下间距 */
  z-index: 20; /* 确保验证码在上层 */
}
.captcha-container {
  min-height: 44px;
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 20; /* 确保验证码在上层 */
  /* 不强制拉伸，内容自然宽度，居中显示 */
}
.hidden {
  display: none;
}

/* 确保极验验证码弹窗显示在最上层 */
:deep(.geetest_popup_wrap) {
  z-index: 9999 !important;
}

:deep(.geetest_box_wrap) {
  z-index: 9999 !important;
}
</style> 
