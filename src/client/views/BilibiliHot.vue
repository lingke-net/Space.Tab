<template>
  <AppHeader class="fixed top-0 left-0 w-full z-50" />
  <div class="container mx-auto px-4 py-8 mt-16">
    <!-- 返回按钮 - 使用 shadcn button 样式 -->
    <button 
      class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 mb-6"
      @click="goBack"
    >
      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      返回到 HotDay
    </button>
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">哔哩哔哩热门榜</h1>
      <p class="text-muted-foreground text-lg mt-2">{{ hotData?.description || '你所热爱的，就是你的生活' }}</p>
    </div>
    
    <!-- 分区选择 -->
    <div class="mb-8">
      <div class="flex flex-wrap gap-2 justify-center">
        <Button 
          v-for="(name, value) in categoryTypes" 
          :key="value"
          :variant="selectedType === value ? 'default' : 'outline'"
          @click="changeType(value)"
          class="min-w-[80px]"
        >
          {{ name }}
        </Button>
      </div>
    </div>
    
    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
    
    <!-- 错误提示 -->
    <div v-else-if="error" class="text-center py-20">
      <AlertCircle class="h-12 w-12 mx-auto text-destructive mb-4" />
      <h3 class="text-lg font-medium mb-2">获取数据失败</h3>
      <p class="text-muted-foreground mb-4">{{ error }}</p>
      <Button @click="fetchHotData(selectedType)">重试</Button>
    </div>
    
    <!-- 视频列表 -->
    <div v-else-if="hotData" class="space-y-6">
      <div class="flex justify-between items-center mb-4">
        <div class="flex items-center">
          <h2 class="text-2xl font-semibold">热门视频</h2>
          <Badge variant="outline" class="ml-2">
            更新于 {{ formatUpdateTime(hotData.updateTime) }}
          </Badge>
        </div>
        <Button variant="ghost" size="sm" @click="openBilibili">
          前往B站
          <ExternalLink class="h-4 w-4 ml-1" />
        </Button>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card 
          v-for="(item, index) in hotData.data" 
          :key="item.id"
          class="overflow-hidden cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg"
          @click="openVideo(item.url)"
        >
          <div class="relative">
            <img :src="item.cover" :alt="item.title" class="w-full aspect-video object-cover" />
            <div class="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
              No.{{ index + 1 }}
            </div>
            <div class="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm flex items-center">
              <Flame class="h-3 w-3 mr-1 text-red-500" />
              {{ formatHot(item.hot) }}
            </div>
          </div>
          <CardContent class="p-4">
            <h3 class="font-semibold text-lg line-clamp-2 mb-2">{{ item.title }}</h3>
            <div class="flex justify-between items-center text-sm text-muted-foreground">
              <div class="flex items-center">
                <User class="h-3 w-3 mr-1" />
                <span>{{ item.author }}</span>
              </div>
              <div class="flex items-center">
                <Clock class="h-3 w-3 mr-1" />
                <span>{{ formatTimestamp(item.timestamp) }}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    
    <!-- 空状态 -->
    <div v-else class="text-center py-20">
      <div class="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
        <VideoOff class="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 class="text-lg font-medium mb-2">暂无数据</h3>
      <p class="text-muted-foreground mb-4">请点击下方按钮获取最新热门视频</p>
      <Button @click="fetchHotData(selectedType)">获取热门视频</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useBilibiliHot } from '../utils/bilibiliHotUtils'
import AppHeader from '@/components/AppHeader.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'vue-sonner'
import { 
  AlertCircle, 
  ExternalLink, 
  Flame, 
  User, 
  Clock,
  VideoOff
} from 'lucide-vue-next'

const { hotData, loading, error, fetchHotData, formatHot, formatTimestamp } = useBilibiliHot()
const selectedType = ref('0')

import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
// 返回上一页
const goBack = () => {
  router.push('/hot')
}

// 分区类型
const categoryTypes = computed(() => {
  return hotData.value?.params?.type?.type || {
    '0': '全站',
    '1': '动画',
    '3': '音乐',
    '4': '游戏',
    '5': '娱乐',
    '36': '科技',
    '119': '鬼畜',
    '129': '舞蹈',
    '155': '时尚',
    '160': '生活',
    '168': '国创相关',
    '181': '影视',
    '188': '数码'
  }
})

// 切换分区
const changeType = (type: string) => {
  selectedType.value = type
  fetchHotData(type)
}

// 格式化更新时间
const formatUpdateTime = (updateTime: string) => {
  const date = new Date(updateTime)
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

// 打开视频链接
const openVideo = (url: string) => {
  window.open(url, '_blank')
}

// 打开B站首页
const openBilibili = () => {
  window.open('https://www.bilibili.com', '_blank')
}

onMounted(() => {
  fetchHotData()
  
  // 显示欢迎通知
  toast("欢迎来到B站热门榜", {
    description: "这里展示了B站当前最热门的视频内容，点击视频卡片可直接前往观看",
    duration: 5000,
    icon: "🎬"
  })
})
</script>

<style scoped>
/* 自定义样式 */
.container {
  max-width: 1200px;
}

/* 卡片悬停效果 */
.card:hover {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border-color: var(--primary);
}

/* 分区按钮样式 */
.category-button {
  min-width: 80px;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.category-button:hover {
  transform: translateY(-2px);
}

.category-button.active {
  background-color: var(--primary);
  color: white;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>