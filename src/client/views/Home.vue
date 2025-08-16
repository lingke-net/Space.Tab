<script setup lang="ts">
import { SidebarInset } from '@/components/ui/sidebar'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { Textarea } from '@/components/ui/textarea'
import AppHeader from '@/components/AppHeader.vue'
import WeatherWidget from '@/components/WeatherWidget.vue'
import { useUserStore } from '@/store/user'
import { toast } from 'vue-sonner'
import Cookies from 'js-cookie'
import { AlertTitle } from "@/components/ui/alert"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { safeLocalStorage } from '../utils/storage'
import AppFooter from '@/components/AppFooter.vue'

// 导入模块化的功能
import { useWallpaper } from '../utils/wallpaper'
import { useSearchEngine } from '../utils/searchEngines'
import { useWeather, loadWeatherSettings } from '../utils/weather'
import { useLocation, commonCities } from '../utils/location'

// 高德地图API密钥
const AMAP_KEY = import.meta.env.VITE_MAMP_KEY

// 使用壁纸功能
const { 
  currentWallpaperUrl, 
  wallpaperLoaded, 
  wallpaperError, 
  wallpaperStyle, 
  handleWallpaperLoaded, 
  handleWallpaperError 
} = useWallpaper()

// 使用搜索引擎功能
const { 
  inputValue, 
  selectedEngine, 
  searchEngines, 
  currentEngine, 
  switchEngine, 
  handleSubmit, 
  handleKeydown 
} = useSearchEngine()

// 使用位置服务
const location = useLocation(AMAP_KEY)

// 使用天气功能
const weather = useWeather(AMAP_KEY)

const userStore = useUserStore()
const username = computed(() => userStore.userInfo?.username || '')

const isAdmin = computed(() => {
  return userStore.userInfo?.is_admin || false
})

// 控制是否显示PRO徽章
const showBadgeInHome = computed(() => {
  // 从localStorage获取设置，默认为true（显示）
  return localStorage.getItem('showBadgeInHome') !== 'false'
})

const router = useRouter()
const showSetupDialog = ref(false)

// 跳转到精选内容页面
const goToQualityContent = () => {
  router.push('/quality-content')
}

// 跳转到精选内容页面
const goToHot = () => {
  router.push('/hot')
}

// 跳转到初始化页面
const goToSetup = () => {
  router.push('/setup')
}

// 组件挂载时检查初始化状态
onMounted(() => {
  // 检查是否完成了初始化设置（同时检查localStorage和Cookie）
  const setupCompletedLocal = safeLocalStorage.getItem('setupCompleted')
  const setupCompletedCookie = Cookies.get('setupCompleted')
  const setupCompleted = setupCompletedLocal === 'true' || setupCompletedCookie === 'true'
  
  if (!setupCompleted) {
    // 如果没有完成初始化设置，显示对话框询问用户是否要初始化
    showSetupDialog.value = true
    return
  }
  
  // 检查是否设置了天气定位
  const weatherLocation = safeLocalStorage.getItem('weatherLocation')
  const weatherLocationName = safeLocalStorage.getItem('weatherLocationName')
  
  // 同时检查localStorage和Cookie中的天气定位信息
  const weatherLocationCookie = Cookies.get('locationData');
  const hasWeatherLocation = weatherLocation || (weatherLocationCookie && JSON.parse(weatherLocationCookie).adcode);
  
  if (!hasWeatherLocation) {
    // 如果没有设置天气定位，显示对话框询问用户是否要初始化
    showSetupDialog.value = true
  }
})
</script>

<template>
  <AppHeader class="fixed top-0 left-0 w-full z-50" />
  <!-- 首页壁纸背景 -->
  <div class="home-wallpaper" :class="{ 'has-wallpaper': safeLocalStorage.getItem('wallpaperType') !== 'pure' }">
    <transition name="fade">
      <img 
        v-if="safeLocalStorage.getItem('wallpaperType') !== 'pure'" 
        class="background-image" 
        :src="currentWallpaperUrl" 
        alt="壁纸"
        :style="wallpaperStyle"
        @load="handleWallpaperLoaded"
        @error="handleWallpaperError"
      />
    </transition>
  </div>

  <div class="flex flex-col items-center justify-center min-h-screen home-page">
    <div class="w-full max-w-3xl mx-auto px-4 glass-container">
      <div class="mb-2 flex justify-between items-center glass-text">
        <!-- 欢迎信息 -->
        <div class="text-left welcome-text">
          <h1 class="text-3xl font-medium relative">
            你好，{{ username }}
            <span
              v-if="isAdmin && showBadgeInHome"
              class="inline-flex items-center rounded-full bg-orange-500 px-2 py-0.5 text-xs font-medium text-white absolute -top-2 -right-12"
            >
              PRO
            </span>
          </h1>
          <p class="text-muted-foreground">你有什么想搜的吗？</p>
        </div>
        
        <!-- 天气组件 - 使用新的 WeatherWidget 组件 -->
        <div class="text-right weather-component">
          <WeatherWidget />
        </div>
      </div>
      
      <form @submit.prevent="handleSubmit" class="w-full">
        <Textarea
          v-model="inputValue"
          placeholder="从这里输入搜索内容..." 
          class="w-full min-h-[120px] p-4 rounded-xl text-lg resize-none glass-input focus-blur"
          @keydown="handleKeydown" 
          autofocus />
        
        <!-- 搜索引擎选择器 -->
        <div class="flex items-center justify-start gap-4 mt-4 engine-selector">
            <div 
              v-for="engine in searchEngines" 
              :key="engine.id"
              @click="switchEngine(engine.id)"
              :class="[
                'w-10 h-10 rounded-full flex items-center justify-center border cursor-pointer transition-transform',
                selectedEngine === engine.id ? 'border-primary ring-1 ring-primary scale-105' : 'border-muted-foreground/30 hover:border-muted-foreground'
              ]"
              :title="engine.name"
            >
            <span class="w-6 h-6 flex items-center justify-center" v-html="engine.svg"></span>
          </div>
          
          <!-- Today 按钮 - 使用与引擎选择器相同的样式 -->
          <div 
            @click="goToQualityContent"
            class="flex items-center gap-2 px-3 py-2 rounded-full border cursor-pointer transition-transform border-muted-foreground/30 hover:border-muted-foreground"
            title="Today - 发现精选内容"
          >
            <!--<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>-->
            <span class="text-sm font-medium">Today</span>
          </div>
          <div 
            @click="goToHot"
            class="flex items-center gap-2 px-3 py-2 rounded-full border cursor-pointer transition-transform border-muted-foreground/30 hover:border-muted-foreground"
            title="Today - 发现精选内容"
          >
            <!--<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>-->
            <span class="text-sm font-medium">今日热点</span>
          </div>
        </div>
      </form>
    </div>
  </div>

  <AppFooter/>
  
  <!-- 初始化设置对话框 -->
  <AlertDialog :open="showSetupDialog">
    <AlertDialogContent class="sm:max-w-md">
      <AlertDialogHeader>
        <AlertDialogTitle>欢迎使用 Space.Tab</AlertDialogTitle>
        <AlertDialogDescription>
          看起来您还没有完成初始化设置。初始化设置可以帮助您个性化您的浏览体验，包括主题、壁纸和天气设置等。
        </AlertDialogDescription>
      </AlertDialogHeader>
      
      <div class="flex flex-col gap-4 py-4">
        <p class="text-sm text-muted-foreground">
          您可以现在完成初始化设置，也可以稍后在设置中进行配置。
        </p>
      </div>
      <AlertDialogFooter class="flex justify-between sm:justify-between">
        <AlertDialogAction @click="goToSetup">
          立即设置
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<style scoped>
/* 首页壁纸样式 */
.home-wallpaper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
}

.background-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.5s ease;
}

/* 玻璃效果容器 */
.glass-container {
  /* 根据壁纸类型决定是否应用背景色 */
  background-color: v-bind("safeLocalStorage.getItem('wallpaperType') === 'pure' ? 'transparent' : 'rgba(255, 255, 255, 0.7)'");
  backdrop-filter: v-bind("safeLocalStorage.getItem('wallpaperType') === 'pure' ? 'none' : 'blur(0)'");
  -webkit-backdrop-filter: v-bind("safeLocalStorage.getItem('wallpaperType') === 'pure' ? 'none' : 'blur(0)'");
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 20px;
  border-radius:10px;
  margin-top: 20px;
  margin-bottom: 20px;
}

/* 暗色模式适配 */
:root.dark .glass-container {
  /* 暗色模式下根据壁纸类型决定是否应用背景色 */
  background-color: v-bind("safeLocalStorage.getItem('wallpaperType') === 'pure' ? 'transparent' : 'rgba(20, 20, 20, 0.75)'");
}

/* 输入框聚焦时的模糊效果 */
.glass-input {
  transition: all 0.3s ease;
}

.glass-input:focus-within {
  backdrop-filter: v-bind("safeLocalStorage.getItem('wallpaperType') === 'pure' ? 'none' : 'blur(10px)'");
  -webkit-backdrop-filter: v-bind("safeLocalStorage.getItem('wallpaperType') === 'pure' ? 'none' : 'blur(10px)'");
  background-color: v-bind("safeLocalStorage.getItem('wallpaperType') === 'pure' ? 'transparent' : 'rgba(var(--background-rgb), 0.6)'");
  border: 1px solid v-bind("safeLocalStorage.getItem('wallpaperType') === 'pure' ? 'rgba(var(--border-rgb), 0.1)' : 'rgba(var(--border-rgb), 0.2)'");
}

/* 暗色模式下输入框聚焦时的样式 */
:root.dark .glass-input:focus-within {
  background-color: v-bind("safeLocalStorage.getItem('wallpaperType') === 'pure' ? 'transparent' : 'rgba(30, 30, 30, 0.7)'");
  border: 1px solid rgba(255, 255, 255, 0.15);
}

/* 搜索引擎选择器样式 */
.engine-selector {
  display: flex;
  gap: 1rem;
}

/* 搜索引擎按钮样式 */
.engine-selector button {
  background-color: transparent;
  transition: all 0.3s ease;
  border-radius: 50%;
}

/* 搜索引擎按钮悬停效果 */
.engine-selector button:hover {
  backdrop-filter: v-bind("safeLocalStorage.getItem('wallpaperType') === 'pure' ? 'none' : 'blur(10px)'");
  -webkit-backdrop-filter: v-bind("safeLocalStorage.getItem('wallpaperType') === 'pure' ? 'none' : 'blur(10px)'");
  background-color: v-bind("safeLocalStorage.getItem('wallpaperType') === 'pure' ? 'rgba(var(--background-rgb), 0.1)' : 'rgba(var(--background-rgb), 0.6)'");
  border-color: rgba(var(--border-rgb), 0.3) !important;
}

/* 搜索引擎按钮选中效果 */
.engine-selector button[class*="border-primary"] {
  backdrop-filter: v-bind("safeLocalStorage.getItem('wallpaperType') === 'pure' ? 'none' : 'blur(10px)'");
  -webkit-backdrop-filter: v-bind("safeLocalStorage.getItem('wallpaperType') === 'pure' ? 'none' : 'blur(10px)'");
  background-color: v-bind("safeLocalStorage.getItem('wallpaperType') === 'pure' ? 'rgba(var(--background-rgb), 0.1)' : 'rgba(var(--background-rgb), 0.6)'");
}

/* 暗色模式下搜索引擎按钮悬停效果 */
:root.dark .engine-selector button:hover {
  background-color: v-bind("safeLocalStorage.getItem('wallpaperType') === 'pure' ? 'rgba(40, 40, 40, 0.2)' : 'rgba(40, 40, 40, 0.7)'");
  border-color: rgba(255, 255, 255, 0.2) !important;
}

/* 暗色模式下搜索引擎按钮选中效果 */
:root.dark .engine-selector button[class*="border-primary"] {
  background-color: v-bind("safeLocalStorage.getItem('wallpaperType') === 'pure' ? 'rgba(40, 40, 40, 0.2)' : 'rgba(40, 40, 40, 0.7)'");
}

/* 添加一些动画效果 */
.rounded-full {
  transition: all 0.2s ease;
}

/* 天气组件淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 确保天气组件有固定高度，避免加载时布局跳动 */
.weather-component {
  min-height: 60px;
  position: relative;
}

/* 确保天气图标平滑过渡 */
.text-primary svg {
  transition: all 0.3s ease;
}
</style>