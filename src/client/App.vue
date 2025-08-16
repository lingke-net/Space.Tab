<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css'
import AdminPermissionCheck from '@/components/AdminPermissionCheck.vue'
import { ref, computed, onMounted, nextTick, onBeforeUnmount, watch, onBeforeMount } from 'vue'
import Cookies from 'js-cookie'
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
} from '@/components/ui/navigation-menu'
import { useUserStore } from '@/store/user'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ChevronsUpDown } from 'lucide-vue-next'
import { useRouter, useRoute } from 'vue-router'
import Watermark from '@/components/Watermark.vue'
import { useThemeStore } from '@/store/theme'
import gsap from 'gsap'
import AppFooter from '@/components/AppFooter.vue'

const userStore = useUserStore()
const isLoggedIn = computed(() => !!userStore.token)
const user = computed(() => ({
  username: userStore.userInfo.username || '未登录',
  email: userStore.userInfo.email || '',
  avatar: userStore.userInfo.avatar || '/avatars/default.jpg',
}))
const router = useRouter()
const route = useRoute()
const themeStore = useThemeStore()
const isLoading = ref(false)
const initialPageLoad = ref(true)
const pageTransition = ref(false)

const showWatermark = import.meta.env.VITE_DEV_WHATER === 'true'
const version = '0.1.0' // 可替换为动态读取

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

// 移除全局壁纸相关变量和函数

const fillMode = computed(() => {
  const path = route.path
  const themeValue = themeStore.getCurrentTheme()
  if (path === '/login' || path === '/register') {
    if (themeValue === 'dark') {
      return 'dark'
    }
    return 'light'
  }
  return 'auto'
})

// 使用 GSAP 为页面元素添加动画效果，分批次加载
function animatePageElements() {
  nextTick(() => {
    // 获取主内容区域（排除顶栏）
    const mainContent = document.querySelector('main') || document.querySelector('.main-content') || document.querySelector('.page-content')
    
    // 如果找到主内容区域，则只在主内容区域内查找元素
    const contentScope = mainContent || document
    
    // 获取顶栏元素，以便后续排除
    const headerElements = document.querySelectorAll('header, nav, .navbar, .nav-bar, .top-bar, .header')
    
    // 分类获取不同类型的元素
    const headings = contentScope.querySelectorAll('h1, h2, h3, h4')
    const cards = contentScope.querySelectorAll('.card')
    const buttons = contentScope.querySelectorAll('.btn, button:not([type="hidden"])')
    const paragraphs = contentScope.querySelectorAll('p:not(:empty)')
    const sections = contentScope.querySelectorAll('section > *, article > *')
    const otherElements = contentScope.querySelectorAll('.grid > *, .container > *:not(h1):not(h2):not(h3):not(p):not(.card):not(.btn)')
    
// 将NodeList转换为数组，以便过滤
const filterFromHeader = (elements: NodeListOf<Element>) => {
  const elementsArray = Array.from(elements)
  return elementsArray.filter(el => {
    // 检查元素是否在顶栏内
    for (const header of headerElements) {
      if (header.contains(el)) {
        return false
      }
    }
    return true
  })
}
    
    // 过滤掉顶栏中的元素
    const filteredHeadings = filterFromHeader(headings)
    const filteredCards = filterFromHeader(cards)
    const filteredButtons = filterFromHeader(buttons)
    const filteredParagraphs = filterFromHeader(paragraphs)
    const filteredSections = filterFromHeader(sections)
    const filteredOtherElements = filterFromHeader(otherElements)
    
    // 检查是否有元素需要动画
    if (filteredHeadings.length === 0 && filteredCards.length === 0 && filteredParagraphs.length === 0 && 
        filteredButtons.length === 0 && filteredSections.length === 0 && filteredOtherElements.length === 0) {
      return; // 如果没有元素，直接返回
    }
    
    // 创建动画时间轴
    const tl = gsap.timeline();
    
    // 第一批：标题元素（最先显示）
    if (filteredHeadings.length > 0) {
      gsap.set(filteredHeadings, { opacity: 0, y: 15 })
      tl.to(filteredHeadings, {
        opacity: 1,
        y: 0,
        duration: 0.25,
        stagger: 0.03,
        ease: 'power1.out'
      }, 0); // 0表示动画开始时间
    }
    
    // 第二批：卡片元素（重点元素）
    if (filteredCards.length > 0) {
      gsap.set(filteredCards, { opacity: 0, y: 20, scale: 0.98 })
      tl.to(filteredCards, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.35,
        stagger: {
          each: 0.05,
          from: "start", // 从第一个元素开始
          grid: "auto" // 自动检测网格布局
        },
        ease: 'back.out(1.02)' // 使用弹性效果，让卡片有轻微的弹跳感
      }, 0.1); // 延迟0.1秒开始
    }
    
    // 第三批：段落文本
    if (filteredParagraphs.length > 0) {
      gsap.set(filteredParagraphs, { opacity: 0, y: 15 })
      tl.to(filteredParagraphs, {
        opacity: 1,
        y: 0,
        duration: 0.3,
        stagger: 0.02,
        ease: 'power1.out'
      }, 0.15); // 延迟0.15秒开始
    }
    
    // 第四批：按钮元素
    if (filteredButtons.length > 0) {
      gsap.set(filteredButtons, { opacity: 0, y: 10, scale: 0.95 })
      tl.to(filteredButtons, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.25,
        stagger: 0.03,
        ease: 'power2.out'
      }, 0.2); // 延迟0.2秒开始
    }
    
    // 第五批：其他区块元素
    if (filteredSections.length > 0 || filteredOtherElements.length > 0) {
      const remainingElements = [...filteredSections, ...filteredOtherElements];
      gsap.set(remainingElements, { opacity: 0, y: 15 })
      tl.to(remainingElements, {
        opacity: 1,
        y: 0,
        duration: 0.3,
        stagger: 0.02,
        ease: 'power1.out'
      }, 0.25); // 延迟0.25秒开始
    }
  })
}

// 计算壁纸样式（已移除实际使用，保留接口兼容性）
const wallpaperStyle = computed(() => {
  return {
    opacity: 0.8, // 默认值替代 wallpaperOpacity.value / 100
    filter: `blur(0px)` // 默认值替代 wallpaperBlur.value
  }
})

// 移除全局壁纸更新函数，壁纸将只在首页处理

// 移除全局壁纸监听器

// 检查是否需要进行初始化设置
const checkSetupRequired = () => {
  // 检查是否已完成初始化设置（同时检查localStorage和Cookie）
  const setupCompletedLocal = safeLocalStorage.getItem('setupCompleted', 'false')
  const setupCompletedCookie = Cookies.get('setupCompleted')
  const setupCompleted = setupCompletedLocal === 'true' || setupCompletedCookie === 'true'
  
  // 如果未完成初始化设置且当前不在setup页面，则重定向到setup页面
  /*if (!setupCompleted && route.path !== '/setup') {
    router.push('/setup')
    return true
  }
  return false*/
}

onMounted(async () => {
  userStore.loadFromCookie()
  // 如果用户已登录，获取最新的用户信息
  if (userStore.token && userStore.userId) {
    await userStore.getUserInfo()
  }
  
  // 检查是否需要初始化设置
  checkSetupRequired()
  
  // 移除壁纸相关初始化代码
  
  // 初始页面加载动画 - 减少延迟时间
  setTimeout(() => {
    initialPageLoad.value = false
    // 初始页面加载完成后立即执行动画
    animatePageElements()
  }, 300) // 减少延迟时间
  
  // 添加路由切换时的加载状态控制
  router.beforeEach((to, from, next) => {
    // 只有在实际路由变化时才显示加载
    if (to.path !== from.path) {
      // 开始页面过渡
      pageTransition.value = true
      isLoading.value = true
      
      // 预先清除可能存在的动画，确保新页面动画能正确执行
      gsap.killTweensOf("*") // 清除所有GSAP动画
      
  // 检查是否需要初始化设置（同时检查localStorage和Cookie）
  const setupCompletedLocal = safeLocalStorage.getItem('setupCompleted', 'false')
  const setupCompletedCookie = Cookies.get('setupCompleted')
  const setupCompleted = setupCompletedLocal === 'true' || setupCompletedCookie === 'true'
  
  if (!setupCompleted && to.path !== '/setup' && to.path !== '/terms-of-service' && to.path !== '/privacy-policy') {
    next('/setup')
    return
  }
    }
    next()
  })
  
  router.afterEach((to) => {
    // 立即隐藏加载遮罩，不等待API请求完成
    isLoading.value = false
    
    // 如果是访问首页，重新从cookie加载用户信息
    if (to.path === '/' || to.path === '/home') {
      userStore.loadFromCookie()
      // 如果用户已登录，获取最新的用户信息
      if (userStore.token && userStore.userId) {
        userStore.getUserInfo()
      }
    }
    
    // 创建一个独立的过渡动画控制流程，完全与API请求分离
    // 这确保了即使API请求延迟，页面过渡动画也能流畅完成
    
    // 第一步：立即开始隐藏过渡遮罩的动画
    const transitionOverlay = document.querySelector('.page-transition-overlay')
    if (transitionOverlay) {
      transitionOverlay.classList.add('fade-out')
    }
    
    // 第二步：使用双重requestAnimationFrame确保在下一帧渲染前执行动画
    // 这比setTimeout更可靠，因为它会在浏览器准备好渲染时执行
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // 立即执行页面元素动画，不等待API请求
        // 这样可以确保页面过渡动画不受API延迟影响
        animatePageElements()
        
        // 触发一个自定义事件，通知页面组件路由切换已完成
        // 这样各个页面组件可以在自己的时机重新触发动画
        document.dispatchEvent(new CustomEvent('route-transition-complete'))
        
        // 第三步：在动画完成后完全移除过渡遮罩
        // 使用与CSS动画相匹配的时间（200ms）
        setTimeout(() => {
          pageTransition.value = false
        }, 200)
      })
    })
  })
})

// 移除壁纸相关清理代码

function goDashboard() {
  router.push('/dashboard')
}
function logout() {
  userStore.logout()
  router.push('/login')
}

// 需要暴露给模板
defineExpose({ isLoggedIn, user })
</script>

<template>
  <!-- 背景图片容器 -->
<!-- 移除全局背景图片容器，壁纸将只在首页显示 -->

  <!-- 初始页面加载动画 -->
  <div v-if="initialPageLoad" class="initial-page-load">
    <div class="page-loading-spinner"></div>
  </div>
  
  <!-- 页面切换加载过渡效果 -->
  <div v-if="isLoading" class="page-loading-overlay">
    <div class="page-loading-spinner"></div>
  </div>
  
  <!-- 页面过渡遮罩层 -->
  <div v-if="pageTransition" class="page-transition-overlay" :class="{ 'fade-out': !isLoading }"></div>
  
  <transition name="app-fade" appear>
    <div v-show="!initialPageLoad" class="app-container">
      <router-view v-slot="{ Component }">
        <div :key="route.fullPath">
          <component :is="Component" />
        </div>
      </router-view>
      
      <AdminPermissionCheck />
      <Toaster />
      <AppFooter 
        v-if="!route.path.startsWith('/dashboard') && route.path !== '/setup'" 
        :sticky="route.path === '/' || route.path === '/home'" 
      />
      <!--<Watermark v-if="showWatermark" :version="version" :fillMode="fillMode" :user="user" :isLoggedIn="isLoggedIn" />-->
    </div>
  </transition>
</template>

<style scoped>
/* 定义CSS变量 */
:root {
  --background-rgb: 255, 255, 255;
  --card-rgb: 255, 255, 255;
  --border-rgb: 0, 0, 0;
}

:root.dark {
  --background-rgb: 10, 10, 10;
  --card-rgb: 20, 20, 20;
  --border-rgb: 255, 255, 255;
}
/* 移除全局背景图片样式 */

.background-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.8; /* 调整透明度 */
  transition: opacity 0.5s ease;
}

/* 当有壁纸时，为顶栏和底栏添加模糊效果 
:root[data-has-wallpaper="true"] header,
:root[data-has-wallpaper="true"] footer {
  background-color: rgba(var(--background-rgb), 0.7) !important;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(var(--border-rgb), 0.1);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
}*/

/* 当有壁纸时，为内容区域添加模糊背景 */
:root[data-has-wallpaper="true"] .card,
:root[data-has-wallpaper="true"] .content-card,
:root[data-has-wallpaper="true"] .glass-card {
  background-color: rgba(var(--card-rgb), 0.7) !important;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(var(--border-rgb), 0.2);
}

/* 渐变模糊效果 - 顶部和底部的渐变过渡 
:root[data-has-wallpaper="true"] header::after,
:root[data-has-wallpaper="true"] footer::before {
  content: "";
  position: absolute;
  left: 0;
  width: 100%;
  height: 20px;
  pointer-events: none;
}*/

:root[data-has-wallpaper="true"] header::after {
  bottom: -20px;
  background: linear-gradient(to bottom, rgba(var(--background-rgb), 0.7), transparent);
}

:root[data-has-wallpaper="true"] footer::before {
  top: -20px;
  background: linear-gradient(to top, rgba(var(--background-rgb), 0.7), transparent);
}

/* 页面过渡遮罩层 */
.page-transition-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--background, #ffffff);
  opacity: 0;
  z-index: 9998;
  animation: fade-in-overlay 0.15s forwards; /* 快速淡入 */
  pointer-events: none; /* 确保不阻止用户交互 */
  will-change: opacity, transform; /* 优化动画性能 */
  transform: translateZ(0); /* 启用GPU加速 */
  backface-visibility: hidden; /* 防止闪烁 */
  -webkit-font-smoothing: antialiased; /* 文字渲染优化 */
}

.page-transition-overlay.fade-out {
  animation: fade-out-overlay 0.2s forwards; /* 平滑淡出 */
}

@keyframes fade-in-overlay {
  from { opacity: 0; }
  to { opacity: 0.7; } /* 适中的不透明度 */
}

@keyframes fade-out-overlay {
  from { opacity: 0.7; }
  to { opacity: 0; }
}

/* 暗色模式适配 */
:root.dark .page-transition-overlay {
  background-color: #000;
}

/* 初始页面加载动画 */
.initial-page-load {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--background, #ffffff);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}

.app-container {
  min-height: 100vh;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}

/* 整个应用的渐入效果 */
.app-fade-enter-active {
  transition: opacity 0.4s ease; /* 减少过渡时间 */
}

.app-fade-enter-from {
  opacity: 0;
}


/* 页面过渡效果 */
.page-transition-enter-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.page-transition-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.page-transition-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-transition-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 加载遮罩层 */
.page-loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(3px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  pointer-events: none; /* 允许点击穿透 */
}

.page-loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #000000;
  animation: spin 1s ease-in-out infinite;
  display: block; /* 确保显示 */
  visibility: visible; /* 确保可见 */
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 暗色模式适配 */
:root.dark .page-loading-overlay {
  background-color: rgba(0, 0, 0, 0.7);
}

:root.dark .page-loading-spinner {
  border-color: rgba(255, 255, 255, 0.1);
  border-top-color: #3498db;
}
</style>