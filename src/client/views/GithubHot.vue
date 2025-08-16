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
      <h1 class="text-4xl font-bold bg-gradient-to-r from-primary to-green-500 bg-clip-text text-transparent">GitHub 热门榜</h1>
      <p class="text-muted-foreground text-lg mt-2">{{ hotData?.description || '分享 GitHub 上有趣、入门级的开源项目' }}</p>
    </div>
    
    <!-- 分类选择 -->
    <div class="mb-8">
      <div class="flex flex-wrap gap-2 justify-center">
        <Button 
          v-for="(name, value) in categoryTypes" 
          :key="value"
          :variant="selectedSort === value ? 'default' : 'outline'"
          @click="changeSort(value)"
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
      <Button @click="fetchHotData(selectedSort)">重试</Button>
    </div>
    
    <!-- 项目列表 -->
    <div v-else-if="hotData" class="space-y-6">
      <div class="flex justify-between items-center mb-4">
        <div class="flex items-center">
          <h2 class="text-2xl font-semibold">热门项目</h2>
          <Badge variant="outline" class="ml-2">
            更新于 {{ formatUpdateTime(hotData.updateTime) }}
          </Badge>
        </div>
        <Button variant="ghost" size="sm" @click="openGithub">
          前往 GitHub
          <ExternalLink class="h-4 w-4 ml-1" />
        </Button>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card 
          v-for="(item, index) in hotData.data" 
          :key="item.id"
          class="overflow-hidden cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg"
          @click="openProject(item.url)"
        >
          <CardHeader class="p-4 pb-2">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="bg-primary/10 p-2 rounded-full mr-3">
                  <Code class="h-5 w-5 text-primary" />
                </div>
                <h3 class="font-semibold text-lg">{{ item.title }}</h3>
              </div>
              <Badge>No.{{ index + 1 }}</Badge>
            </div>
          </CardHeader>
          <CardContent class="p-4 pt-2">
            <p class="text-muted-foreground line-clamp-3 mb-4 min-h-[4.5rem]">{{ item.desc }}</p>
            <div class="flex justify-between items-center text-sm">
              <div class="flex items-center">
                <User class="h-3 w-3 mr-1" />
                <span class="text-primary font-medium">{{ item.author }}</span>
              </div>
              <div class="flex items-center space-x-4">
                <div class="flex items-center">
                  <Clock class="h-3 w-3 mr-1" />
                  <span>{{ formatTimestamp(item.timestamp) }}</span>
                </div>
                <div class="flex items-center">
                  <Star class="h-3 w-3 mr-1 text-yellow-500" />
                  <span>{{ formatHot(item.hot) }}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    
    <!-- 空状态 -->
    <div v-else class="text-center py-20">
      <div class="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
        <Github class="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 class="text-lg font-medium mb-2">暂无数据</h3>
      <p class="text-muted-foreground mb-4">请点击下方按钮获取最新热门项目</p>
      <Button @click="fetchHotData(selectedSort)">获取热门项目</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useGithubHot } from '../utils/githubHotUtils'
import AppHeader from '@/components/AppHeader.vue'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'vue-sonner'
import { 
  AlertCircle, 
  ExternalLink, 
  User, 
  Clock,
  Star,
  Code,
  Github
} from 'lucide-vue-next'

const { hotData, loading, error, fetchHotData, formatHot, formatTimestamp } = useGithubHot()
const selectedSort = ref('featured')

import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
// 返回上一页
const goBack = () => {
  router.push('/hot')
}

// 分类类型
const categoryTypes = computed(() => {
  return hotData.value?.params?.sort?.type || {
    'featured': '精选',
    'all': '全部'
  }
})

// 切换分类
const changeSort = (sort: string) => {
  selectedSort.value = sort
  fetchHotData(sort)
}

// 格式化更新时间
const formatUpdateTime = (updateTime: string) => {
  const date = new Date(updateTime)
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

// 打开项目链接
const openProject = (url: string) => {
  window.open(url, '_blank')
}

// 打开GitHub首页
const openGithub = () => {
  window.open('https://github.com', '_blank')
}

onMounted(() => {
  fetchHotData()
  
  // 显示欢迎通知
  toast("欢迎来到GitHub热门榜", {
    description: "这里展示了GitHub上最热门的开源项目，点击卡片可直接前往查看",
    duration: 5000,
    icon: "🚀"
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

/* 分类按钮样式 */
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