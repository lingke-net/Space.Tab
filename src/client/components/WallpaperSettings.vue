<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { toast } from 'vue-sonner'
import { useThemeStore } from '@/store/theme'
import { Slider } from '@/components/ui/slider'
import { RefreshCw, Image, Check } from 'lucide-vue-next'
import { AlertCircle } from "lucide-vue-next"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import VersionAvatar from './VersionAvatar.vue'

const themeStore = useThemeStore()

// 壁纸类型选项
const wallpaperTypes = [
  { id: 'pure', name: '纯净模式', description: '无背景壁纸' },
  { id: 'bing-daily', name: '每日推荐', description: 'Bing今日壁纸' },
  { id: 'bing-random', name: 'Bing随机壁纸', description: '随机获取Bing历史壁纸' },
  { id: 'custom', name: '自定义图片', description: '选择本地图片作为壁纸' }
]

// 当前选择的壁纸类型
const selectedWallpaperType = ref('pure')

// 壁纸设置
const wallpaperOpacity = ref(80) // 默认80%透明度
const wallpaperBlur = ref(0) // 默认不模糊
const showPreview = ref(false) // 预览控制

// 自定义壁纸预览
const customBgPreview = ref('')
const fileInputRef = ref<HTMLInputElement | null>(null)

// 计算当前壁纸URL
const currentWallpaperUrl = computed(() => {
  if (selectedWallpaperType.value === 'bing-daily') {
    return "https://bing.img.run/uhd.php"
  } else if (selectedWallpaperType.value === 'bing-random') {
    return "https://bing.img.run/rand_uhd.php"
  } else if (selectedWallpaperType.value === 'custom' && customBgPreview.value) {
    return customBgPreview.value
  }
  return ''
})

// 预览样式
const previewStyle = computed(() => {
  return {
    opacity: wallpaperOpacity.value / 100,
    filter: `blur(${wallpaperBlur.value}px)`
  }
})

// 安全的localStorage访问方法
const safeLocalStorage = {
  getItem(key: string, defaultValue: any = null): any {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(key) || defaultValue;
    }
    return defaultValue;
  },
  setItem(key: string, value: any): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, value);
    }
  },
  removeItem(key: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(key);
    }
  }
};

// 初始化设置
onMounted(() => {
  // 加载保存的壁纸类型
  const savedType = safeLocalStorage.getItem('wallpaperType', 'pure')
  if (savedType) {
    selectedWallpaperType.value = savedType
  }
  
  // 加载自定义壁纸预览
  if (safeLocalStorage.getItem('customBgImage')) {
    customBgPreview.value = safeLocalStorage.getItem('customBgImage')
  }
})

// 选择壁纸类型
const selectWallpaperType = (typeId: string) => {
  selectedWallpaperType.value = typeId
  safeLocalStorage.setItem('wallpaperType', typeId)
  
  // 触发全局事件，通知App.vue更新壁纸
  window.dispatchEvent(new CustomEvent('wallpaper-changed'))
  
  // 显示提示
  toast.success('壁纸设置已更新')
}

// 选择自定义壁纸
function selectCustomWallpaper() {
  if (fileInputRef.value) {
    fileInputRef.value.click()
  }
}

// 处理文件选择
function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    
    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      toast.error('请选择图片文件')
      return
    }
    
    // 检查文件大小（限制为5MB）
    if (file.size > 5 * 1024 * 1024) {
      toast.error('图片大小不能超过5MB')
      return
    }
    
    // 读取文件并转换为Data URL
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === 'string') {
        customBgPreview.value = e.target.result
        safeLocalStorage.setItem('customBgImage', e.target.result)
        selectedWallpaperType.value = 'custom'
        safeLocalStorage.setItem('wallpaperType', 'custom')
        
        // 触发全局事件，通知App.vue更新壁纸
        window.dispatchEvent(new CustomEvent('wallpaper-changed'))
        
        toast.success('自定义壁纸已设置')
      }
    }
    reader.readAsDataURL(file)
  }
}

const betamode = 'beta'
</script>

<template>
    <div class="flex items-center justify-between mb-4">
        <div>
            <h3 class="text-xl font-medium">壁纸设置</h3>
            <p class="text-sm text-muted-foreground">个性化您的首页背景</p>
        </div>
    </div>
    <div class="flex flex-col gap-4 py-4">
        <Alert variant="destructive">
            <AlertCircle class="w-4 h-4" />
            <AlertTitle class="font-bold">功能正在调试</AlertTitle>
            <AlertDescription>
            此功能仍然在测试，我们正在优化体验，在后续版本可能会有更多改动！如有问题请多多包涵
            </AlertDescription>
        </Alert>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card 
        v-for="type in wallpaperTypes" 
        :key="type.id" 
        :class="[
            'cursor-pointer transition-all hover:shadow-md',
            selectedWallpaperType === type.id ? 'ring-2 ring-primary' : ''
        ]"
        @click="selectWallpaperType(type.id)"
        >
        <CardContent class="p-4">
            <div class="flex flex-col gap-1">
            <h4 class="font-medium">{{ type.name }}</h4>
            <p class="text-sm text-muted-foreground">{{ type.description }}</p>
            </div>
        </CardContent>
        </Card>
    </div>

    <!-- 自定义壁纸上传 -->
    <div class="mt-6" v-if="selectedWallpaperType === 'custom'">
        <Button @click="selectCustomWallpaper" variant="outline" class="mb-4">
        选择图片
        </Button>
        <input
        ref="fileInputRef"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleFileSelect"
        />
        
        <!-- 自定义壁纸预览 -->
        <div v-if="customBgPreview" class="mt-4">
        <p class="text-sm mb-2">预览：</p>
        <div class="wallpaper-preview">
            <img :src="customBgPreview" alt="自定义壁纸预览" class="max-w-full h-auto rounded-md" />
        </div>
        </div>
    </div>
</template>

<style scoped>
.wallpaper-settings {
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: var(--background);
}

.wallpaper-preview {
  max-width: 300px;
  max-height: 200px;
  overflow: hidden;
  border-radius: 0.5rem;
  border: 1px solid var(--border);
}

.wallpaper-preview img {
  width: 100%;
  height: auto;
  object-fit: cover;
}
</style>