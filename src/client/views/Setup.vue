<template>
  <div class="ios-setup-container">
    <!-- 背景层 -->
    <div class="background-layer"></div>
    
    <!-- 内容层 -->
    <div class="content-layer">
      <!-- 顶部进度指示器 -->
      <div class="progress-bar">
        <div 
          v-for="(step, index) in steps" 
          :key="index" 
          class="progress-dot"
          :class="{ 
            'active': currentStep >= index,
            'current': currentStep === index
          }"
        ></div>
      </div>
      
      <!-- 步骤内容 -->
      <div class="step-content">
        <!-- 欢迎页面 -->
        <transition name="slide-fade" mode="out-in">
          <div v-if="currentStep === 0" class="step step-welcome" key="welcome">
            <div class="logo-container">
              <img src="http://lunova.studio/wp-content/uploads/2025/08/space.png" alt="Space.Tab Logo" class="logo" />
            </div>
            
            <h1>欢迎使用 Space.Tab</h1>
            <p>您的个性化浏览体验从这里开始</p>
            
            <div class="login-options">
              <Button @click="nextStep" variant="default" size="lg" class="primary-button">开始设置</Button>
            </div>
          </div>
          
          <!-- 版本信息 -->
          <div v-else-if="currentStep === 1" class="step step-version" key="version">
            <h2>当前版本 V{{ currentVersion.version }}</h2>
            <p>了解最新版本的更新内容</p>
            
            <!-- 版本提示 -->
            <div class="version-info">
              <div class="version-badge">
                <VersionAvatar :mode="currentVersion.mode" size="medium" />
                <span class="version-number">V{{ currentVersion.version }}</span>
              </div>
              <div class="version-date">{{ currentVersion.date }}</div>
            </div>
            
            <!-- 版本更新内容 -->
            <div class="version-changes">
              <div class="changes-title">新版本更新内容：</div>
              <ul class="changes-list">
                <li v-for="(change, index) in currentVersion.changes" :key="index">
                  {{ change }}
                </li>
              </ul>
            </div>
            
            <div class="action-buttons">
              <Button @click="prevStep" variant="outline" class="secondary-button">上一步</Button>
              <Button @click="nextStep" variant="default" class="primary-button">下一步</Button>
            </div>
          </div>
          
          <!-- 用户协议 -->
          <div v-else-if="currentStep === 2" class="step step-agreement" key="agreement">
            <h2>用户协议</h2>
            <p>请阅读以下协议</p>
            
            <div class="agreement-cards">
              <router-link to="/privacy-policy" class="agreement-card" target="_blank">
                <div class="agreement-title">隐私策略</div>
                <div class="agreement-desc">Lingke Network 隐私策略</div>
              </router-link>
              
              <router-link to="/terms-of-service" class="agreement-card" target="_blank">
                <div class="agreement-title">使用条款</div>
                <div class="agreement-desc">Lingke Network 产品使用条款</div>
              </router-link>
            </div>
            
            <div class="agreement-text">
              点击"同意并继续"，表示您同意并遵守 Lingke Network 隐私策略和产品使用条款。
            </div>
            
            <div class="action-buttons">
              <Button @click="prevStep" variant="outline" class="secondary-button">上一步</Button>
              <Button @click="nextStep" variant="default" class="primary-button">同意并继续</Button>
            </div>
          </div>
          
          <!-- 设置城市 -->
          <div v-else-if="currentStep === 3" class="step step-city" key="city">
            <h2>选择您的城市</h2>
            <p>选择您所在的城市以获得更准确的天气信息</p>
            
            <div class="city-grid">
              <div 
                v-for="city in commonCities" 
                :key="city.adcode"
                class="city-card"
                :class="{ 'selected': selectedCity.adcode === city.adcode }"
                @click="selectCity(city)"
              >
                <div class="city-name">{{ city.name }}</div>
              </div>
            </div>
            
            <div class="action-buttons">
              <Button @click="prevStep" variant="outline" class="secondary-button">上一步</Button>
              <Button @click="nextStep" variant="default" class="primary-button">下一步</Button>
            </div>
          </div>
          
          <!-- 设置语言 -->
          <div v-else-if="currentStep === 4" class="step step-language" key="language">
            <h2>选择您的语言</h2>
            <p>其实你不论怎么设置都只有中文( ͡• ͜ʖ ͡• )</p>
            
            <div class="options-container">
              <div 
                v-for="lang in languages" 
                :key="lang.code"
                class="option-card"
                :class="{ 'selected': selectedLanguage === lang.code }"
                @click="selectLanguage(lang.code)"
              >
                <div class="option-content">
                  <span class="option-name">{{ lang.name }}</span>
                  <span class="option-check" v-if="selectedLanguage === lang.code">✓</span>
                </div>
              </div>
            </div>
            
            <div class="action-buttons">
              <Button @click="prevStep" variant="outline" class="secondary-button">上一步</Button>
              <Button @click="nextStep" variant="default" class="primary-button">下一步</Button>
            </div>
          </div>
          
          <!-- 设置主题 -->
          <div v-else-if="currentStep === 5" class="step step-theme" key="theme">
            <h2>选择您喜欢的主题</h2>
            <p>选择一个适合您的显示模式</p>
            
            <div class="theme-options">
              <div 
                class="theme-option"
                :class="{ 'selected': themeMode === 'auto' }"
                @click="selectThemeMode('auto')"
              >
                <div class="theme-icon">
                  <Monitor class="icon" />
                </div>
                <div class="theme-label">自动</div>
                <div class="theme-description">根据系统设置自动切换</div>
              </div>
              
              <div 
                class="theme-option"
                :class="{ 'selected': themeMode === 'light' }"
                @click="selectThemeMode('light')"
              >
                <div class="theme-icon">
                  <Sun class="icon" />
                </div>
                <div class="theme-label">明亮</div>
                <div class="theme-description">始终使用明亮模式</div>
              </div>
              
              <div 
                class="theme-option"
                :class="{ 'selected': themeMode === 'dark' }"
                @click="selectThemeMode('dark')"
              >
                <div class="theme-icon">
                  <Moon class="icon" />
                </div>
                <div class="theme-label">暗黑</div>
                <div class="theme-description">始终使用暗黑模式</div>
              </div>
            </div>
            
            <div class="action-buttons">
              <Button @click="prevStep" variant="outline" class="secondary-button">上一步</Button>
              <Button @click="nextStep" variant="default" class="primary-button">下一步</Button>
            </div>
          </div>
          
          <!-- 设置壁纸 -->
          <div v-else-if="currentStep === 6" class="step step-wallpaper" key="wallpaper">
            <h2>选择您的壁纸</h2>
            <p>个性化您的起始页背景</p>
            
            <div class="options-container">
              <div 
                class="option-card"
                :class="{ 'selected': selectedWallpaper === 'pure' }"
                @click="selectWallpaper('pure')"
              >
                <div class="option-content">
                  <span class="option-name">纯净模式</span>
                  <span class="option-check" v-if="selectedWallpaper === 'pure'">✓</span>
                </div>
              </div>
              
              <div 
                class="option-card"
                :class="{ 'selected': selectedWallpaper === 'bing-daily' }"
                @click="selectWallpaper('bing-daily')"
              >
                <div class="option-content">
                  <span class="option-name">每日壁纸</span>
                  <span class="option-check" v-if="selectedWallpaper === 'bing-daily'">✓</span>
                </div>
              </div>
              
              <div 
                class="option-card"
                :class="{ 'selected': selectedWallpaper === 'bing-random' }"
                @click="selectWallpaper('bing-random')"
              >
                <div class="option-content">
                  <span class="option-name">随机壁纸</span>
                  <span class="option-check" v-if="selectedWallpaper === 'bing-random'">✓</span>
                </div>
              </div>
            </div>
            
            <p class="text-sm text-muted-foreground mt-4">完成初始化后可以前往设置自定义壁纸</p>
            
            <div class="action-buttons">
              <Button @click="prevStep" variant="outline" class="secondary-button">上一步</Button>
              <Button @click="nextStep" variant="default" class="primary-button">下一步</Button>
            </div>
          </div>
          
          
          <!-- 用户群页面 -->
          <div v-else-if="currentStep === 7" class="step step-user-group" key="user-group">
            <h2>加入用户群</h2>
            <p>获取最新消息与提出意见建议</p>
            
            <div class="user-group-container">
              <div class="user-group-info">
                <p class="group-title">Space.Tab 用户交流群</p>
                <p class="group-desc">点击下方按钮加入</p>
              </div>
            </div>
            
            <div class="user-group-options">
              <Button @click="openUserGroup" variant="default" class="join-group-button">立即加入</Button>
              <Button @click="nextStep" variant="ghost" class="skip-group-button">暂不加入</Button>
            </div>
          </div>
          
          <!-- 完成设置 -->
          <div v-else-if="currentStep === 8" class="step step-complete" key="complete">
            <div class="completion-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h2>设置完成</h2>
            <p>您的 Space.Tab 已准备就绪</p>
            
            <div class="login-options">
              <Button @click="finishSetup" variant="default" class="primary-button" size="lg">开始使用</Button>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { safeLocalStorage } from '../utils/storage'
import Cookies from 'js-cookie'
import { Button } from '@/components/ui/button'
import { Sun, Moon, Monitor } from 'lucide-vue-next'
import { versionHistory } from '@/utils/versionHistory'
import VersionAvatar from '@/components/VersionAvatar.vue'
import confetti from 'canvas-confetti'

const router = useRouter()
const currentStep = ref(0)
const isDarkMode = ref(false)
const selectedWallpaper = ref('pure')
const themeMode = ref('auto')
const selectedCity = ref({ name: '北京', adcode: '110100' })
const selectedLanguage = ref('zh-CN')
const confettiContainer = ref(null)

// 获取当前版本信息（最新的非未来版本）
const currentVersion = versionHistory.find(v => v.date !== '即将到来') || versionHistory[1]

// 定义所有步骤
const steps = [
  { name: '欢迎' },
  { name: '版本' },
  { name: '协议' },
  { name: '城市' },
  { name: '语言' },
  { name: '主题' },
  { name: '壁纸' },
  { name: '用户群' },
  { name: '完成' }
]

// 定义常用城市选项
const commonCities = [
  { name: '北京', adcode: '110100' },
  { name: '上海', adcode: '310100' },
  { name: '广州', adcode: '440100' },
  { name: '深圳', adcode: '440300' },
  { name: '杭州', adcode: '330100' },
  { name: '成都', adcode: '510100' },
  { name: '武汉', adcode: '420100' },
  { name: '西安', adcode: '610100' },
  { name: '南京', adcode: '320100' },
  { name: '重庆', adcode: '500100' },
  { name: '天津', adcode: '120100' },
  { name: '苏州', adcode: '320500' },
  { name: '厦门', adcode: '350200' },
  { name: '青岛', adcode: '370200' },
  { name: '大连', adcode: '210200' },
  { name: '郑州', adcode: '410100' },
  { name: '长沙', adcode: '430100' },
  { name: '东莞', adcode: '441900' },
  { name: '佛山', adcode: '440600' },
  { name: '宁波', adcode: '330200' },
  { name: '合肥', adcode: '340100' },
  { name: '济南', adcode: '370100' },
  { name: '福州', adcode: '350100' },
  { name: '沈阳', adcode: '210100' },
  { name: '昆明', adcode: '530100' }
]

// 定义语言选项
const languages = [
  { code: 'zh-CN', name: '简体中文' }/*,
  { code: 'en-US', name: 'English (US)' },
  { code: 'ja-JP', name: '日本語' },
  { code: 'ko-KR', name: '한국어' }*/
]

// 检查当前系统主题偏好
onMounted(() => {
  // 检查系统是否偏好深色模式
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
  isDarkMode.value = prefersDarkMode
  
  // 检查localStorage中是否已有设置
  const storedTheme = safeLocalStorage.getItem('theme')
  if (storedTheme) {
    if (storedTheme === 'dark' || storedTheme === 'light') {
      themeMode.value = storedTheme
      isDarkMode.value = storedTheme === 'dark'
    } else if (storedTheme === 'auto') {
      themeMode.value = 'auto'
      isDarkMode.value = prefersDarkMode
    }
  }
  
  // 检查壁纸设置
  const storedWallpaper = safeLocalStorage.getItem('wallpaperType')
  if (storedWallpaper) {
    selectedWallpaper.value = storedWallpaper
  }
  
  // 检查天气定位设置
  const storedWeatherLocation = safeLocalStorage.getItem('weatherLocation')
  if (storedWeatherLocation) {
    try {
      selectedCity.value = JSON.parse(storedWeatherLocation)
    } catch (e) {
      console.error('解析天气定位设置失败', e)
    }
  }
  
  // 检查语言设置
  const storedLanguage = safeLocalStorage.getItem('language')
  if (storedLanguage) {
    selectedLanguage.value = storedLanguage
  }
  
  // 应用当前主题
  applyTheme()
})

// 下一步
const nextStep = () => {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
  }
}

// 上一步
const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

// 选择城市
const selectCity = (city) => {
  selectedCity.value = city
  // 保存设置到天气定位
  safeLocalStorage.setItem('weatherLocation', JSON.stringify(city))
}

// 选择语言
const selectLanguage = (langCode) => {
  selectedLanguage.value = langCode
  // 保存设置
  safeLocalStorage.setItem('language', langCode)
}

// 选择主题模式
const selectThemeMode = (mode) => {
  themeMode.value = mode
  
  // 保存设置
  safeLocalStorage.setItem('theme', mode)
  
  // 应用主题
  applyTheme()
}

// 应用主题
const applyTheme = () => {
  if (themeMode.value === 'auto') {
    // 检查系统是否偏好深色模式
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
    isDarkMode.value = prefersDarkMode
    document.documentElement.classList.toggle('dark', prefersDarkMode)
  } else if (themeMode.value === 'light') {
    isDarkMode.value = false
    document.documentElement.classList.remove('dark')
  } else if (themeMode.value === 'dark') {
    isDarkMode.value = true
    document.documentElement.classList.add('dark')
  }
}

// 选择壁纸
const selectWallpaper = (type) => {
  selectedWallpaper.value = type
  // 保存设置
  safeLocalStorage.setItem('wallpaperType', type)
}


// 完成设置
const finishSetup = () => {
  // 保存设置完成标记到 localStorage 和 Cookie
  safeLocalStorage.setItem('setupCompleted', 'true')
  Cookies.set('setupCompleted', 'true', { expires: 365 }) // 一年有效期
  
  // 保存天气设置到Cookie
  const weatherSettings = {
    enabled: true,
    unit: 'celsius',
    showHumidity: true,
    showWind: true
  }
  Cookies.set('weatherSettings', JSON.stringify(weatherSettings), { expires: 365 }) // 一年有效期
  
  // 保存位置数据到Cookie
  const locationDataForCookie = {
    adcode: selectedCity.value.adcode,
    city: selectedCity.value.name,
    district: '',
    province: ''
  }
  Cookies.set('locationData', JSON.stringify(locationDataForCookie), { expires: 30 })
  
  // 保存主题设置到Cookie
  Cookies.set('theme', themeMode.value, { expires: 365 })
  
  // 保存壁纸设置到Cookie
  Cookies.set('wallpaperType', selectedWallpaper.value, { expires: 365 })
  
  // 保存语言设置到Cookie
  Cookies.set('language', selectedLanguage.value, { expires: 365 })
  
  // 保存徽章显示设置到Cookie
  Cookies.set('showBadgeInHome', 'true', { expires: 365 })
  
  // 同时保存到localStorage以保持兼容性
  safeLocalStorage.setItem('theme', themeMode.value)
  safeLocalStorage.setItem('wallpaperType', selectedWallpaper.value)
  safeLocalStorage.setItem('language', selectedLanguage.value)
  safeLocalStorage.setItem('weatherEnabled', 'true')
  safeLocalStorage.setItem('weatherLocation', JSON.stringify(selectedCity.value))
  
  // 打印日志确认设置已保存
  console.log('初始化设置已完成并保存', {
    setupCompleted: true,
    theme: themeMode.value,
    wallpaper: selectedWallpaper.value,
    language: selectedLanguage.value,
    city: selectedCity.value.name
  })
  
  router.push('/')
}

// 监听步骤变化，在到达版本信息页面和完成页面时触发礼花效果
watch(currentStep, (newStep) => {
  if (newStep === 1) {
    // 版本信息页面 - 延迟一点时间，等待页面过渡完成后再触发礼花
    setTimeout(() => {
      fireVersionConfetti();
    }, 300);
  } else if (newStep === 8) {
    // 完成设置页面 - 延迟一点时间，等待页面过渡完成后再触发礼花
    setTimeout(() => {
      fireVersionConfetti();
    }, 300);
  }
});

// 打开用户群链接
const openUserGroup = () => {
  window.open('https://qm.qq.com/q/3qL2id2zN6', '_blank');
  // 可选：延迟后自动进入下一步
  setTimeout(() => {
    nextStep();
  }, 500);
}

// 版本信息页面的礼花效果 - 从中间向上发射
const fireVersionConfetti = () => {
  const colors = ['#84cc16', '#3b82f6', '#ef4444', '#f59e0b', '#8b5cf6'];
  
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }, // 从页面中间偏下位置发射
    colors: colors,
    startVelocity: 30,
    gravity: 0.8, // 降低重力，让礼花飞得更高
    shapes: ['circle', 'square'],
    ticks: 200
  });
}

// 完成设置页面的礼花效果 - 更华丽的从中间向上发射
const fireCompletionConfetti = () => {
  const duration = 3000; // 持续3秒
  const animationEnd = Date.now() + duration;
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
  
  // 创建间隔函数，每隔50ms发射一次礼花
  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    
    // 当时间结束时停止发射
    if (timeLeft <= 0) {
      return clearInterval(interval);
    }
    
    // 随机角度，但主要向上发射
    const particleCount = 50;
    
    // 从中间向上发射
    confetti({
      particleCount,
      angle: 270, // 向上
      spread: 70,
      origin: { x: 0.5, y: 0.6 }, // 从页面中间偏下位置发射
      colors: colors,
      startVelocity: 30,
      gravity: 0.8, // 降低重力，让礼花飞得更高
      shapes: ['circle', 'square'],
      ticks: 200
    });
    
  }, 250); // 每250ms发射一次
}
</script>

<style scoped>
.ios-setup-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
}

.background-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.1;
  z-index: 0;
}

.content-layer {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  padding: 2rem;
}

.progress-bar {
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
  padding-top: 1rem;
  width: 100%;
  max-width: 300px;
}

.progress-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--muted-foreground);
  margin: 0 4px;
  transition: all 0.3s ease;
}

.progress-dot.active {
  background-color: var(--primary);
}

.progress-dot.current {
  transform: scale(1.5);
}

.step-content {
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
}

.step {
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo-container {
  margin-bottom: 1rem;
}

.logo {
  width: 120px;
  height: 120px;
  object-fit: contain;
}

/* 版本信息样式 */
.version-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
}

.version-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  background-color: var(--primary-foreground);
  border-radius: 1rem;
  margin-bottom: 0.25rem;
}

.version-number {
  font-weight: 600;
  font-size: 1rem;
}

.version-date {
  font-size: 0.8rem;
  color: var(--muted-foreground);
}

/* 版本更新内容样式 */
.version-changes {
  width: 100%;
  max-width: 400px;
  margin: 0.5rem 0 1.5rem;
  padding: 1rem;
  background-color: var(--card);
  border-radius: 0.75rem;
  border: 1px solid var(--border);
}

.changes-title {
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  text-align: left;
}

.changes-list {
  list-style-type: disc;
  padding-left: 1.5rem;
  text-align: left;
}

.changes-list li {
  font-size: 0.85rem;
  margin-bottom: 0.25rem;
  color: var(--muted-foreground);
}

h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

h2 {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

p {
  font-size: 1.1rem;
  color: var(--muted-foreground);
  margin-bottom: 2rem;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 2rem;
}

.primary-button {
  min-width: 120px;
  font-weight: 500;
}

.secondary-button {
  min-width: 120px;
}

/* 用户协议样式 */
.agreement-cards {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 1.7rem;
}

.agreement-card {
  flex: 1;
  margin: 0 0.5rem;
  padding: 1.5rem;
  border-radius: 12px;
  background-color: var(--card);
  border: 2px solid var(--border);
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  color: inherit;
}

.agreement-card:hover {
  border-color: var(--primary);
  background-color: var(--accent);
  transform: translateY(-2px);
}

.agreement-title {
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.agreement-desc {
  font-size: 0.9rem;
  color: var(--muted-foreground);
}

.agreement-text {
  font-size: 0.9rem;
  color: var(--muted-foreground);
  margin-bottom: 2rem;
  text-align: center;
  max-width: 400px;
}

/* 城市选择样式 */
.city-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
  width: 100%;
  margin-bottom: 1rem;
  max-height: 300px;
  overflow-y: auto;
  padding: 0.5rem;
}

.city-card {
  padding: 0.75rem 0.5rem;
  border-radius: 8px;
  background-color: var(--card);
  border: 1px solid var(--border);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  position: relative;
}

.city-card:hover {
  border-color: var(--primary);
  background-color: var(--accent);
}

.city-card.selected {
  border-color: var(--primary);
  border-width: 2px;
  background-color: var(--primary-foreground);
}

.city-name {
  font-size: 0.9rem;
  font-weight: 500;
}

/* 语言选择样式 */
.options-container {
  width: 100%;
}

.option-card {
  padding: 1rem;
  margin-bottom: 0.5rem;
  border-radius: 12px;
  background-color: var(--card);
  border: 2px solid var(--border);
  cursor: pointer;
  transition: all 0.2s ease;
}

.option-card:hover {
  border-color: var(--primary);
  background-color: var(--accent);
}

.option-card.selected {
  border-color: var(--primary);
  background-color: var(--primary-foreground);
}

.option-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.option-name {
  font-size: 1.1rem;
  font-weight: 500;
}

.option-check {
  color: var(--primary);
  font-weight: bold;
}

/* 主题选择样式 */
.theme-options {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 1rem;
}

.theme-option {
  flex: 1;
  margin: 0 0.5rem;
  padding: 1.5rem 1rem;
  border-radius: 12px;
  background-color: var(--card);
  border: 2px solid var(--border);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.theme-option:hover {
  border-color: var(--primary);
  background-color: var(--accent);
}

.theme-option.selected {
  border-color: var(--primary);
  background-color: var(--primary-foreground);
}

.theme-icon {
  margin-bottom: 1rem;
}

.icon {
  width: 24px;
  height: 24px;
  color: var(--primary);
}

.theme-label {
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.theme-description {
  font-size: 0.8rem;
  color: var(--muted-foreground);
  text-align: center;
}

/* 壁纸选择样式 */
.wallpaper-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  width: 100%;
}

.wallpaper-option {
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid var(--border);
  transition: all 0.2s ease;
}

.wallpaper-option:hover {
  border-color: var(--primary);
}

.wallpaper-option.selected {
  border-color: var(--primary);
  box-shadow: 0 0 0 2px var(--primary);
}

.wallpaper-preview {
  height: 120px;
  background-size: cover;
  background-position: center;
}

.pure-preview {
  background-color: var(--background);
}

.wallpaper-name {
  padding: 0.5rem;
  text-align: center;
  font-size: 0.9rem;
  background-color: var(--card);
}

/* 用户群页面样式 */
.user-group-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  width: 100%;
  max-width: 400px;
  background-color: var(--card);
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid var(--border);
}

.user-group-info {
  text-align: center;
}

.group-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--foreground);
}

.group-desc {
  font-size: 0.9rem;
  color: var(--muted-foreground);
  margin-bottom: 1rem;
}

.group-link {
  font-size: 0.9rem;
  color: var(--primary);
  padding: 0.5rem;
  background-color: var(--accent);
  border-radius: 0.5rem;
  margin-bottom: 0;
}

.user-group-options {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 300px;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.join-group-button {
  width: 100%;
  font-weight: 500;
}

.skip-group-button {
  width: 100%;
  color: var(--muted-foreground);
}

/* 登录选项样式 */
.login-options {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 300px;
  gap: 1rem;
}

.login-button, .skip-button {
  width: 100%;
  padding: 1rem;
}

/* 完成页面样式 */
.completion-icon {
  margin-bottom: 2rem;
  color: var(--primary);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

/* 过渡动画 */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* 礼花效果 */
.confetti-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  top: -10px;
  border-radius: 50%;
  opacity: 0.7;
  animation: confetti-fall linear forwards;
}

@keyframes confetti-fall {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .theme-options {
    flex-direction: column;
  }
  
  .theme-option {
    margin: 0.5rem 0;
  }
  
  .wallpaper-options {
    grid-template-columns: 1fr;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  h2 {
    font-size: 1.5rem;
  }
}
</style>