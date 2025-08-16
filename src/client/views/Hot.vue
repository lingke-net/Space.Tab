<template>
  <AppHeader class="fixed top-0 left-0 w-full z-50" />
  <div class="container mx-auto px-4 py-8 mt-16">
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">热门榜单</h1>
      <p class="text-muted-foreground text-lg mt-2">发现互联网上最热门的内容</p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      <!-- Bilibili 热门榜 -->
      <Card 
        class="overflow-hidden cursor-pointer transition-all hover:-translate-y-2 hover:shadow-lg"
        @click="router.push('/bilibili-hot')"
      >
        <div class="bg-black p-6">
          <div class="flex items-center justify-between">
            <div class="bg-white/20 p-3 rounded-full">
              <div class="text-white h-8 w-8 flex items-center justify-center">
                <span class="text-2xl">B</span>
              </div>
            </div>
            <Badge class="bg-white/30 text-white hover:bg-white/40">热门</Badge>
          </div>
          <h2 class="text-2xl font-bold text-white mt-4">哔哩哔哩热门榜</h2>
          <p class="text-white/80 mt-2">你所热爱的，就是你的生活</p>
        </div>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <Avatar class="h-8 w-8 mr-2">
                <AvatarImage src="https://www.bilibili.com/favicon.ico" alt="Bilibili" />
                <AvatarFallback>B</AvatarFallback>
              </Avatar>
              <div>
                <p class="font-medium">Bilibili</p>
                <p class="text-xs text-muted-foreground">视频平台</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              查看榜单
              <ChevronRight class="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div class="mt-4">
            <p class="text-sm text-muted-foreground">实时更新B站最热门的视频内容，包括全站、动画、音乐、游戏等多个分区的热门视频。</p>
          </div>
          <div class="mt-4 flex items-center text-sm text-muted-foreground">
            <Clock class="h-3 w-3 mr-1" />
            <span>实时更新</span>
          </div>
        </CardContent>
      </Card>
      
      <!-- GitHub 热门榜 -->
      <Card 
        class="overflow-hidden cursor-pointer transition-all hover:-translate-y-2 hover:shadow-lg"
        @click="router.push('/github-hot')"
      >
        <div class="bg-black p-6">
          <div class="flex items-center justify-between">
            <div class="bg-white/20 p-3 rounded-full">
              <div class="text-white h-8 w-8 flex items-center justify-center">
                <span class="text-2xl">G</span>
              </div>
            </div>
            <Badge class="bg-white/30 text-white hover:bg-white/40">开源</Badge>
          </div>
          <h2 class="text-2xl font-bold text-white mt-4">GitHub 热门榜</h2>
          <p class="text-white/80 mt-2">分享 GitHub 上有趣、入门级的开源项目</p>
        </div>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <Avatar class="h-8 w-8 mr-2">
                <AvatarImage src="https://github.com/favicon.ico" alt="GitHub" />
                <AvatarFallback>G</AvatarFallback>
              </Avatar>
              <div>
                <p class="font-medium">GitHub</p>
                <p class="text-xs text-muted-foreground">代码托管平台</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              查看榜单
              <ChevronRight class="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div class="mt-4">
            <p class="text-sm text-muted-foreground">展示 GitHub 上最热门的开源项目，包括精选和全部两种分类，帮助你发现优质开源资源。</p>
          </div>
          <div class="mt-4 flex items-center text-sm text-muted-foreground">
            <Clock class="h-3 w-3 mr-1" />
            <span>实时更新</span>
          </div>
        </CardContent>
      </Card>
    </div>
    
    <!-- 更多热门榜单提示 -->
    <div class="text-center mt-12">
      <p class="text-muted-foreground">更多热门榜单正在开发中，敬请期待...</p>
      <p class="text-muted-foreground">热门信息获取自 Real-Hot Lingke™</p>
      <p class="text-muted-foreground">注意：本服务仍在测试，可能会有BUG与错误，遇到请及时反馈</p> 
      <Button variant="outline" class="mt-4" @click="goBack">
        <ArrowLeft class="h-4 w-4 mr-2" />
        返回首页
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { toast } from 'vue-sonner'
import { 
  Clock,
  ChevronRight,
  ArrowLeft
} from 'lucide-vue-next'

const router = useRouter()

const goBack = () => {
  router.push('/')
}

onMounted(() => {
  // 显示欢迎通知
  toast("热门榜单中心", {
    description: "在这里你可以查看各大平台的热门内容，点击卡片进入对应榜单",
    duration: 5000,
    icon: "🔥"
  })
})
</script>

<style scoped>
/* 自定义样式 */
.container {
  max-width: 1200px;
}

/* 卡片悬停效果 */
.card {
  transition: all 0.3s ease;
  border-width: 1px;
}

.card:hover {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border-color: var(--primary);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>