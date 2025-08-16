import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { safeLocalStorage } from '../utils/safeStorage'

export function useWallpaper() {
  // 壁纸相关状态
  const wallpaperLoaded = ref(false)
  const wallpaperError = ref(false)
  const customBgImage = ref(safeLocalStorage.getItem('customBgImage', null))
  const wallpaperOpacity = ref(parseInt(safeLocalStorage.getItem('wallpaperOpacity', '80')))
  const wallpaperBlur = ref(parseInt(safeLocalStorage.getItem('wallpaperBlur', '0')))
  const bingDailyWallpaperUrl = ref("https://bing.img.run/uhd.php")
  const bingRandomWallpaperUrl = ref("https://bing.img.run/rand_uhd.php")

  // 确保壁纸类型已设置，首次访问时默认为纯净模式
  const ensureWallpaperType = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (!localStorage.getItem('wallpaperType')) {
        localStorage.setItem('wallpaperType', 'pure')
        console.log('首次访问，壁纸类型设置为纯净模式')
      }
    }
  }

  // 当前壁纸URL的计算属性
  const currentWallpaperUrl = computed(() => {
    // 确保壁纸类型已设置
    ensureWallpaperType()
    
    const wallpaperType = safeLocalStorage.getItem('wallpaperType', 'pure')
    
    if (wallpaperType === 'bing-daily') {
      return bingDailyWallpaperUrl.value
    } else if (wallpaperType === 'bing-random') {
      return bingRandomWallpaperUrl.value
    } else if (wallpaperType === 'custom' && customBgImage.value) {
      return customBgImage.value
    }

    return ''
  })

  // 壁纸加载处理函数
  const handleWallpaperLoaded = () => {
    wallpaperLoaded.value = true
    wallpaperError.value = false
    console.log('壁纸加载成功')
  }

  // 壁纸加载错误处理函数
  const handleWallpaperError = () => {
    wallpaperError.value = true
    console.error('壁纸加载失败')
  }

  // 计算壁纸样式
  const wallpaperStyle = computed(() => {
    return {
      opacity: wallpaperOpacity.value / 100,
      filter: `blur(${wallpaperBlur.value}px)`
    }
  })

  // 设置壁纸变化监听器
  const setupWallpaperListener = () => {
    // 监听壁纸设置变化事件
    window.addEventListener('wallpaper-settings-changed', (event: CustomEvent) => {
      const { type, value } = event.detail
      if (type === 'opacity') {
        wallpaperOpacity.value = value
      } else if (type === 'blur') {
        wallpaperBlur.value = value
      }
    })

    // 监听壁纸刷新事件
    window.addEventListener('wallpaper-refresh', (event: CustomEvent) => {
      const { timestamp } = event.detail
      // 添加时间戳参数以强制刷新缓存
      if (bingDailyWallpaperUrl.value.includes('?')) {
        bingDailyWallpaperUrl.value = bingDailyWallpaperUrl.value.split('?')[0] + '?t=' + timestamp
      } else {
        bingDailyWallpaperUrl.value = bingDailyWallpaperUrl.value + '?t=' + timestamp
      }
      
      if (bingRandomWallpaperUrl.value.includes('?')) {
        bingRandomWallpaperUrl.value = bingRandomWallpaperUrl.value.split('?')[0] + '?t=' + timestamp
      } else {
        bingRandomWallpaperUrl.value = bingRandomWallpaperUrl.value + '?t=' + timestamp
      }
    })
  }

  // 移除壁纸变化监听器
  const removeWallpaperListener = () => {
    window.removeEventListener('wallpaper-settings-changed', (event: CustomEvent) => {
      const { type, value } = event.detail
    })
    
    window.removeEventListener('wallpaper-changed', () => {})
    
    window.removeEventListener('wallpaper-refresh', (event: CustomEvent) => {
      const { timestamp } = event.detail
    })
  }

  onMounted(() => {
    // 确保壁纸类型已设置
    ensureWallpaperType()
    
    // 设置壁纸变化监听器
    setupWallpaperListener()
  })

  onBeforeUnmount(() => {
    // 移除壁纸变化监听器
    removeWallpaperListener()
  })

  return {
    wallpaperLoaded,
    wallpaperError,
    customBgImage,
    wallpaperOpacity,
    wallpaperBlur,
    currentWallpaperUrl,
    wallpaperStyle,
    handleWallpaperLoaded,
    handleWallpaperError,
    ensureWallpaperType
  }
}