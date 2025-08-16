import { ref, Ref } from 'vue'

export interface BilibiliHotItem {
  id: string
  title: string
  desc: string
  cover: string
  author: string
  timestamp: number
  hot: number
  url: string
  mobileUrl: string
}

export interface BilibiliHotResponse {
  code: number
  name: string
  title: string
  type: string
  description: string
  params: {
    type: {
      name: string
      type: Record<string, string>
    }
  }
  link: string
  total: number
  updateTime: string
  fromCache: boolean
  data: BilibiliHotItem[]
}

const hotData: Ref<BilibiliHotResponse | null> = ref(null)
const loading = ref(false)
const error = ref<string | null>(null)

export const useBilibiliHot = () => {
  const fetchHotData = async (type: string = '0') => {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(`https://real-hot.lingke.ink/bilibili?type=${type}`)
      if (!response.ok) {
        throw new Error(`请求失败: ${response.status}`)
      }
      
      const data = await response.json()
      hotData.value = data
    } catch (err) {
      console.error('获取B站热门数据失败:', err)
      error.value = err instanceof Error ? err.message : '获取数据失败'
    } finally {
      loading.value = false
    }
  }
  
  // 格式化热度数字
  const formatHot = (hot: number): string => {
    if (hot >= 10000) {
      return (hot / 10000).toFixed(1) + '万'
    }
    return hot.toString()
  }
  
  // 格式化时间戳
  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp)
    return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  }
  
  return {
    hotData,
    loading,
    error,
    fetchHotData,
    formatHot,
    formatTimestamp
  }
}