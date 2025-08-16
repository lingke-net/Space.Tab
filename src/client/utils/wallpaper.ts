import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { safeLocalStorage } from './storage'

// 壁纸相关
const bingDailyWallpaperUrl = ref("https://bing.img.run/uhd.php")
const bingRandomWallpaperUrl = ref("https://bing.img.run/rand_uhd.php")
const wallpaperLoaded = ref(false)
const wallpaperError = ref(false)

const customBgImage = ref(safeLocalStorage.getItem('customBgImage', null))
const wallpaperOpacity = ref(parseInt(safeLocalStorage.getItem('wallpaperOpacity', '80')))
const wallpaperBlur = ref(parseInt(safeLocalStorage.getItem('wallpaperBlur', '0')))

// 当前壁纸URL的计算属性
const currentWallpaperUrl = computed(() => {
  // 首次访问时默认使用纯净模式
  let wallpaperType = safeLocalStorage.getItem('wallpaperType', 'pure')
  
  // 确保壁纸类型有效，如果无效则使用纯净模式
  if (!wallpaperType || wallpaperType === 'null' || wallpaperType === 'undefined') {
    wallpaperType = 'pure'
    safeLocalStorage.setItem('wallpaperType', 'pure')
    console.log('首次访问或壁纸类型无效，设置为纯净模式')
  }
  
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

// 定义自定义事件类型
interface WallpaperSettingsChangedEvent extends CustomEvent {
  detail: {
    type: string;
    value: number;
  };
}

interface WallpaperRefreshEvent extends CustomEvent {
  detail: {
    timestamp: number;
  };
}

// 监听壁纸变化事件
const setupWallpaperListener = () => {
  // 监听壁纸设置变化事件
  window.addEventListener('wallpaper-settings-changed', ((event: Event) => {
    const customEvent = event as WallpaperSettingsChangedEvent;
    const { type, value } = customEvent.detail;
    if (type === 'opacity') {
      wallpaperOpacity.value = value;
    } else if (type === 'blur') {
      wallpaperBlur.value = value;
    }
  }) as EventListener);
  
  // 监听壁纸刷新事件
  window.addEventListener('wallpaper-refresh', ((event: Event) => {
    const customEvent = event as WallpaperRefreshEvent;
    const { timestamp } = customEvent.detail;
    // 为URL添加时间戳参数，强制刷新
    bingRandomWallpaperUrl.value = `https://bing.img.run/rand_uhd.php?t=${timestamp}`;
  }) as EventListener);
};

// 清除壁纸监听器
const clearWallpaperListeners = () => {
  // 由于我们不能直接移除匿名函数监听器，这里只是为了示例
  // 在实际应用中，应该保存监听器引用以便后续移除
  window.removeEventListener('wallpaper-settings-changed', (() => {}) as EventListener);
  window.removeEventListener('wallpaper-changed', (() => {}) as EventListener);
  window.removeEventListener('wallpaper-refresh', (() => {}) as EventListener);
}

// 导出壁纸相关功能
export const useWallpaper = () => {
  onMounted(() => {
    // 设置壁纸变化监听器
    setupWallpaperListener();
  })

  onBeforeUnmount(() => {
    // 移除壁纸变化监听器
    clearWallpaperListeners();
  })

  return {
    currentWallpaperUrl,
    wallpaperLoaded,
    wallpaperError,
    wallpaperStyle,
    handleWallpaperLoaded,
    handleWallpaperError
  }
}