<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Button } from '@/components/ui/button'
import { toast } from 'vue-sonner'
import Cookies from 'js-cookie'

// 导入模块化的工具
import { useWeather, getWeatherIcon, loadWeatherSettings, weatherIcons } from '../utils/weather'
import { useLocation, commonCities } from '../utils/location'

// 高德地图API密钥
const AMAP_KEY = import.meta.env.VITE_MAMP_KEY

// 使用位置服务
const location = useLocation(AMAP_KEY)

// 使用天气功能
const weather = useWeather(AMAP_KEY)

// 定义props
const props = defineProps({
  size: {
    type: String,
    default: 'medium' // small, medium, large
  }
})

// 从localStorage中获取城市设置
const loadCitySettings = () => {
  const cityAdcode = localStorage.getItem('weatherLocation')
  const cityName = localStorage.getItem('weatherLocationName')
  
  if (cityAdcode && cityName) {
    return {
      adcode: cityAdcode,
      city: cityName
    }
  }
  
  return null
}

// 初始化
onMounted(() => {
  console.log('WeatherWidget 组件已挂载')
  
  // 检查是否已完成初始化设置
  const setupCompleted = localStorage.getItem('setupCompleted')
  if (setupCompleted !== 'true') {
    console.log('未完成初始化设置，不加载天气数据')
    return
  }
  
  // 检查位置授权状态
  if (weather.locationAuthorized.value) {
    console.log('位置已授权')
    
    // 首先尝试从Setup.vue中设置的城市获取位置数据
    const citySettings = loadCitySettings()
    if (citySettings) {
      console.log('使用Setup中设置的城市数据:', citySettings)
      weather.locationData.value = {
        latitude: 0,
        longitude: 0,
        city: citySettings.city,
        adcode: citySettings.adcode
      }
      // 确保位置数据加载后再获取天气
      setTimeout(() => {
        weather.fetchWeather()
      }, 100)
    }
    // 如果没有Setup设置的城市，尝试从Cookie中获取位置数据
    else {
      const locationDataCookie = Cookies.get('locationData')
      if (locationDataCookie) {
        try {
          weather.locationData.value = JSON.parse(locationDataCookie)
          console.log('使用Cookie中的位置数据:', weather.locationData.value)
          // 确保位置数据加载后再获取天气
          setTimeout(() => {
            weather.fetchWeather()
          }, 100)
        } catch (error) {
          console.error('解析位置数据失败:', error)
          // 解析失败时重置授权状态
          weather.locationAuthorized.value = false
        }
      } else {
        console.log('未找到位置数据Cookie')
        weather.locationAuthorized.value = false
      }
    }
  } else {
    console.log('位置未授权')
    // 未授权状态下，关闭天气功能并显示提示
    const currentSettings = { ...weather.weatherSettings.value, enabled: false }
    Cookies.set('weatherSettings', JSON.stringify(currentSettings), { expires: 30 })
    weather.weatherSettings.value = currentSettings
    
    /*toast.error('无法使用天气组件', {
      description: "禁止了定位将无法使用天气组件",
      action: {
        label: "前往设置",
        onClick: () => {
          // 跳转到设置页面
          window.location.href = '/settings'
        }
      }
    })*/
  }
})
</script>

<template>
  <div class="weather-widget" :class="`weather-widget-${size}`">
    <!-- 未授权状态 - 不显示任何内容 -->
    <div v-if="!weather.locationAuthorized" class="hidden">
      <!-- 当组件挂载时不显示任何内容 -->
    </div>
    
    <!-- 已授权状态 -->
    <div v-else-if="weather.weatherSettings.enabled" class="authorized-state">
      <!-- 加载状态 -->
      <div v-if="weather.weatherData.loading" class="loading-state">
        <div class="skeleton-temp"></div>
        <div class="skeleton-info"></div>
      </div>
      
      <!-- 错误状态 -->
      <div v-else-if="weather.weatherData.error" class="error-state">
        <div class="error-message">{{ weather.weatherData.error }}</div>
        <Button variant="outline" size="sm" @click="weather.fetchWeather">重试</Button>
      </div>
      
      <!-- 天气数据 -->
      <div v-else class="weather-data">
        <transition name="fade">
          <div v-if="!weather.weatherData.loading && !weather.weatherData.error && weather.weatherSettings.enabled && weather.weatherData.temperature" 
               class="flex flex-col items-end p-2">
            <div class="flex items-center">
              <span class="text-2xl font-medium mr-2 weather-temp">
                {{ weather.weatherData.temperature }}{{ weather.weatherSettings.unit === 'celsius' ? '℃' : '℉' }}
              </span>
              <span class="text-primary weather-icon" v-html="getWeatherIcon(weather.weatherData.weather)"></span>
            </div>
            <div class="text-xs weather-city">{{ weather.weatherData.city }} · {{ weather.weatherData.weather }}</div>
            <div v-if="weather.weatherSettings.showHumidity || weather.weatherSettings.showWind" class="text-xs weather-details">
              <template v-if="weather.weatherSettings.showHumidity">湿度: {{ weather.weatherData.humidity }}%</template>
              <template v-if="weather.weatherSettings.showHumidity && weather.weatherSettings.showWind"> · </template>
              <template v-if="weather.weatherSettings.showWind">{{ weather.weatherData.windDirection }}风 {{ weather.weatherData.windPower }}级</template>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
.weather-widget {
  border-radius: 0.75rem;
  overflow: hidden;
  transition: all 0.3s ease;
  max-width: 180px; /* 限制最大宽度 */
  background-color: transparent;
  border: none;
  box-shadow: none;
}

.weather-widget-small {
  padding: 0.4rem;
  min-height: 50px;
}

.weather-widget-medium {
  padding: 0.5rem;
  min-height: 60px;
}

.weather-widget-large {
  padding: 0.6rem;
  min-height: 70px;
}

.unauthorized-state,
.authorized-state {
  width: 100%;
  height: 100%;
}

.unauthorized-state {
  position: relative;
  background-color: transparent;
  border-radius: 0.5rem;
}

.skeleton-temp {
  height: 1.2rem;
  width: 2.5rem;
  margin-bottom: 0.3rem;
  border-radius: 0.25rem;
  background-color: rgba(var(--muted-rgb), 0.7);
}

.skeleton-info {
  height: 0.8rem;
  width: 70%;
  border-radius: 0.25rem;
  margin-bottom: 0.3rem;
  background-color: rgba(var(--muted-rgb), 0.7);
}

.hidden {
  display: none;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  background-color: transparent;
  border-radius: 0.5rem;
  padding: 0.4rem;
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  height: 100%;
}

.error-message {
  color: var(--destructive);
  font-size: 0.75rem;
  font-weight: 500;
}

.weather-data {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.weather-content {
  width: 100%;
}

/* 天气数据样式 */
.weather-temp {
  color: var(--foreground);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.weather-icon {
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.1));
}

.weather-city {
  color: var(--foreground);
  font-weight: 500;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}

.weather-details {
  color: var(--foreground);
  opacity: 0.9;
  font-weight: 400;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}

/* 淡入淡出动画 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* 提高文字对比度，适配暗色模式 */
:root.dark .weather-city,
:root.dark .weather-details {
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

:root.dark .weather-temp {
  color: rgba(255, 255, 255, 1);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

@media (max-width: 640px) {
  .weather-widget {
    width: 100%;
    max-width: 150px;
  }
}
</style>