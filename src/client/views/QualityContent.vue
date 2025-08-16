<template>
  <AppHeader class="fixed top-0 left-0 w-full z-50" />
  <div class="container mx-auto px-4 py-8 mt-16">
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold bg-gradient-to-r from-primary to-indigo-500 bg-clip-text">Today At Space</h1>
      <p class="text-muted-foreground text-lg mt-2">发现高质量的网站和工具，提升您的网络体验</p>
    </div>
    
    <!-- 搜索框 -->
    <div class="max-w-md mx-auto mb-8 relative">
      <Input 
        v-model="searchQuery" 
        placeholder="搜索精选内容..."
        class="pl-10"
        @input="filterSites"
      />
      <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
    </div>
    
    <!-- 分类导航 -->
    <div class="mb-8 overflow-hidden category-nav">
      <div class="category-scroll-container">
        <div class="flex space-x-2 p-1 min-w-max category-scroll">
          <Button 
            variant="ghost"
            :class="{ 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground': selectedCategory === 'all' }"
            @click="selectedCategory = 'all'"
            class="flex-shrink-0"
          >
            <Home class="h-4 w-4 mr-2" />
            全部
          </Button>
          <Button 
            v-for="category in categories" 
            :key="category.value"
            variant="ghost"
            :class="{ 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground': selectedCategory === category.value }"
            @click="selectedCategory = category.value"
            class="flex-shrink-0"
          >
            <component :is="category.icon" class="h-4 w-4 mr-2" />
            {{ category.label }}
          </Button>
        </div>
      </div>
    </div>
    
    <!-- 精选内容展示 -->
    <div class="space-y-8">
      <!-- 精选推荐 -->
      <div v-if="selectedCategory === 'all' && !searchQuery">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl font-semibold">精选推荐</h2>
          <Button variant="ghost" size="sm">
            查看全部
            <ChevronRight class="h-2 w-4 ml-1" />
          </Button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card 
            v-for="site in recommendedSites" 
            :key="site.id"
            class="overflow-hidden cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg"
            @click="goToSiteDetail(site.id)"
          >
            <div class="p-4 flex items-center">
              <div class="relative mr-4">
                <div class="h-16 w-16 rounded-xl overflow-hidden bg-background/50">
                  <img :src="getSiteIcon(site)" :alt="site.title" class="h-full w-full object-cover" />
                </div>
                <Badge v-if="site.unchina" variant="destructive" class="absolute -top-2 -right-2">
                  <Globe class="h-3 w-3 mr-1" />
                  境外
                </Badge>
              </div>
              <div>
                <h3 class="font-semibold text-lg text-foreground">{{ site.title }}</h3>
                <p class="text-sm text-muted-foreground">{{ site.category }}</p>
              </div>
            </div>
            <CardContent class="p-4">
              <p class="text-muted-foreground text-sm line-clamp-2">{{ site.description }}</p>
              <div class="flex items-center justify-between mt-3">
                <div class="flex">
                  <Star v-for="i in 5" :key="i" :class="[
                    'h-4 w-4', 
                    i <= site.rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'
                  ]" />
                </div>
                <div class="flex gap-1">
                  <Badge v-for="(tag, idx) in site.tags.slice(0, 2)" :key="idx" variant="outline" class="text-xs">
                    {{ tag }}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <!-- 分类内容 -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl font-semibold">{{ getCategoryTitle(selectedCategory, searchQuery) }}</h2>
          <div class="flex items-center space-x-2">
            <Button 
              :variant="viewMode === 'grid' ? 'default' : 'outline'"
              size="icon"
              @click="setGridView"
            >
              <LayoutGrid class="h-4 w-4" />
            </Button>
            <Button 
              :variant="viewMode === 'list' ? 'default' : 'outline'"
              size="icon"
              @click="setListView"
            >
              <List class="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <!-- 网格视图 -->
        <div v-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <Card 
            v-for="site in filteredSites" 
            :key="site.id"
            class="overflow-hidden cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md"
            @click="goToSiteDetail(site.id)"
          >
            <CardHeader class="p-4 pb-2 flex items-center space-x-3">
              <div class="relative">
                <div class="h-16 w-16 rounded-xl overflow-hidden bg-background/50">
                  <img :src="getSiteIcon(site)" :alt="site.title" class="h-full w-full object-cover" />
                </div>
                <Badge v-if="site.unchina" variant="destructive" class="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center">
                  <Globe class="h-3 w-3" />
                </Badge>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-medium text-base truncate">{{ site.title }}</h3>
                <p class="text-xs text-muted-foreground">{{ site.category }}</p>
              </div>
            </CardHeader>
            <CardContent class="p-4 pt-2">
              <p class="text-sm text-muted-foreground line-clamp-2 h-10">{{ site.description }}</p>
              <div class="flex items-center justify-between mt-3">
                <div class="flex">
                  <Star v-for="i in 5" :key="i" :class="[
                    'h-3 w-3', 
                    i <= site.rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'
                  ]" />
                </div>
                <div class="flex gap-1">
                  <Badge v-for="(tag, idx) in site.tags.slice(0, 1)" :key="idx" variant="outline" class="text-xs">
                    {{ tag }}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <!-- 列表视图 -->
        <div v-else class="space-y-3">
          <Card 
            v-for="site in filteredSites" 
            :key="site.id"
            class="cursor-pointer transition-all hover:shadow-md"
            @click="goToSiteDetail(site.id)"
          >
            <CardContent class="p-4 flex items-center">
              <div class="relative mr-4">
                <Avatar class="h-12 w-12">
                  <AvatarImage :src="getSiteIcon(site)" :alt="site.title" />
                  <AvatarFallback>{{ site.title.charAt(0) }}</AvatarFallback>
                </Avatar>
                <Badge v-if="site.unchina" variant="destructive" class="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center">
                  <Globe class="h-3 w-3" />
                </Badge>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <h3 class="font-medium">{{ site.title }}</h3>
                  <div class="flex">
                    <Star v-for="i in 5" :key="i" :class="[
                      'h-3 w-3', 
                      i <= site.rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'
                    ]" />
                  </div>
                </div>
                <p class="text-sm text-muted-foreground line-clamp-1">{{ site.description }}</p>
                <div class="flex items-center justify-between mt-1">
                  <p class="text-xs text-muted-foreground">{{ site.category }}</p>
                  <div class="flex gap-1">
                    <Badge v-for="(tag, idx) in site.tags.slice(0, 2)" :key="idx" variant="outline" class="text-xs">
                      {{ tag }}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    
    <!-- 空状态 -->
    <div v-if="filteredSites.length === 0" class="text-center py-16">
      <div class="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
        <Search class="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 class="text-lg font-medium mb-2">没有找到匹配的内容</h3>
      <p class="text-muted-foreground mb-4">尝试使用不同的关键词或筛选条件</p>
      <Button @click="resetFilters">重置筛选条件</Button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getSiteIcon, getRecommendedSites, getFilteredSites } from '../utils/featuredContentUtils'
import { categories, getCategoryTitle } from '../utils/categoriesUtils'
import { useViewMode, useContentFilters, enhanceTouchScrolling } from '../utils/contentViewUtils'
import AppHeader from '@/components/AppHeader.vue'
import { Button } from '@/components/ui/button'
import { toast } from 'vue-sonner'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Search, 
  Home, 
  LayoutGrid, 
  List, 
  Star, 
  Globe, 
  ChevronRight
} from 'lucide-vue-next'

const router = useRouter()
const { viewMode, setGridView, setListView } = useViewMode()
const { selectedCategory, searchQuery, filterSites, resetFilters } = useContentFilters()
const { setupTouchScrolling } = enhanceTouchScrolling()

// 精选推荐网站
const recommendedSites = computed(() => getRecommendedSites())

// 根据搜索和分类过滤网站
const filteredSites = computed(() => getFilteredSites(selectedCategory.value, searchQuery.value))

// 跳转到网站详情页
const goToSiteDetail = (siteId) => {
  router.push(`/quality-content/${siteId}`)
}

// 页面加载时滚动到顶部
onMounted(() => {
  window.scrollTo(0, 0)
  setupTouchScrolling()
  
  // 显示警告通知
  setTimeout(() => {
    toast("我们在此版本遇到了问题....", {
      description: "我们近期更新了推荐网站的信息数据，但由于操作失误导致部分网站被重复导入，我们将会在下个版本修复此问题！",
      duration: 10000,
      important: true,
      style: {
        background: 'var(--warning)',
        color: 'var(--warning-foreground)',
        border: '1px solid var(--warning-border)'
      },
      icon: "⚠️"
    })
  }, 500)
})
</script>

<style scoped>
.quality-content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.header-section {
  text-align: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(to right, var(--primary), #6366f1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.page-description {
  font-size: 1.1rem;
  color: var(--muted-foreground);
}

.search-box {
  position: relative;
  max-width: 600px;
  margin: 0 auto 2rem;
}

.search-input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  font-size: 1.1rem;
  border-radius: 12px;
  border: 1px solid var(--border);
  background-color: var(--card);
  color: var(--text-color);
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 2px var(--primary-light);
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
  color: var(--muted-foreground);
}

.category-nav {
  margin-bottom: 2rem;
  overflow: hidden;
}

.category-scroll {
  display: flex;
  gap: 1rem;
  padding: 0.5rem;
  overflow-x: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.category-scroll::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

/* 分类滚动容器 */
.category-scroll-container {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  position: relative;
  /* 确保触摸滚动在移动端正常工作 */
  touch-action: pan-x;
  /* 防止文本选择干扰触摸 */
  user-select: none;
  -webkit-user-select: none;
  /* 确保层级不会覆盖顶栏 */
  z-index: 1;
}

.category-scroll-container::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

/* 确保内容不会被压缩 */
.category-scroll {
  display: flex;
  flex-wrap: nowrap;
  width: max-content;
  min-width: 100%;
}

/* 内容卡片层级设置 */
.container {
  position: relative;
  z-index: 1;
}

/* 确保卡片不会覆盖顶栏和页脚 */
.card, .overflow-hidden {
  position: relative;
  z-index: 1;
}

/* 页面整体层级管理 */
.quality-content-container {
  position: relative;
  z-index: 1;
}

/* 搜索框层级 */
.max-w-md {
  position: relative;
  z-index: 1;
}

/* 分类导航层级 */
.category-nav {
  position: relative;
  z-index: 1;
}

/* 内容展示区域层级 */
.space-y-8 {
  position: relative;
  z-index: 1;
}

/* 开发时显示滚动指示器（可选） 
.category-scroll-container::after {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 20px;
  background: linear-gradient(to right, transparent, rgba(0,0,0,0.1));
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s;
}*/

.category-scroll-container:hover::after {
  opacity: 1;
}

/* 移动端滑动优化 */
@media (max-width: 768px) {
  .category-nav {
    margin-bottom: 1.5rem;
  }
  
  .category-scroll {
    gap: 0.5rem;
    padding: 0.25rem;
  }
  
  .category-scroll-container {
    -webkit-overflow-scrolling: touch; /* iOS 平滑滚动 */
    touch-action: pan-x; /* 只允许水平滑动 */
  }
  
  /* 确保分类按钮在移动端有足够的触摸区域 */
  .category-nav button {
    min-height: 44px; /* iOS 推荐的最小触摸区域 */
    touch-action: manipulation; /* 优化触摸响应 */
    white-space: nowrap;
  }
}

.category-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80px;
  padding: 1rem 0.5rem;
  border-radius: 12px;
  background-color: var(--card);
  border: 1px solid var(--border);
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.category-button.active {
  background-color: var(--primary);
  color: white;
  border-color: var(--primary);
}

.category-icon {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.content-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--border);
}

.featured-section {
  margin-bottom: 3rem;
}

.featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.featured-card {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  aspect-ratio: 16/9;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.featured-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.featured-image {
  width: 100%;
  height: 100%;
}

.featured-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.featured-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  color: white;
}

.featured-icon {
  position: absolute;
  top: -24px;
  left: 1.5rem;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.featured-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.featured-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.25rem;
}

.featured-category {
  font-size: 0.9rem;
  opacity: 0.8;
}

.sites-section {
  margin-bottom: 2rem;
}

.sites-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.view-options {
  display: flex;
  gap: 0.5rem;
}

.view-button {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background-color: var(--card);
  border: 1px solid var(--border);
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-button:hover {
  background-color: var(--accent);
}

.view-button.active {
  background-color: var(--primary);
  color: white;
  border-color: var(--primary);
}

.view-icon {
  font-size: 1.2rem;
}

.sites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.site-card {
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--border);
  background-color: var(--card);
  transition: all 0.3s ease;
  cursor: pointer;
  height: 100%;
}

.site-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  border-color: var(--primary);
}

.site-icon {
  position: relative;
  padding: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--accent);
}

.site-icon img {
  width: 64px;
  height: 64px;
  object-fit: contain;
  border-radius: 12px;
}

.unchina-badge {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: var(--destructive);
  color: white;
  font-size: 0.8rem;
}

.site-info {
  padding: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.site-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.site-description {
  font-size: 0.9rem;
  color: var(--muted-foreground);
  margin-bottom: 1rem;
  flex-grow: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.site-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.site-rating {
  display: flex;
}

.star {
  color: var(--muted-foreground);
  margin-right: 2px;
}

.star.filled {
  color: #FFD700;
}

.site-tags {
  display: flex;
  gap: 0.5rem;
}

.tag {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background-color: var(--accent);
  border-radius: 4px;
}

.sites-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.site-list-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid var(--border);
  background-color: var(--card);
  transition: all 0.2s ease;
  cursor: pointer;
}

.site-list-item:hover {
  transform: translateX(5px);
  border-color: var(--primary);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.site-list-icon {
  position: relative;
  margin-right: 1rem;
}

.site-list-icon img {
  width: 48px;
  height: 48px;
  object-fit: contain;
  border-radius: 10px;
}

.unchina-badge-small {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: var(--destructive);
  color: white;
  font-size: 0.7rem;
}

.site-list-info {
  flex: 1;
}

.site-list-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.site-list-description {
  font-size: 0.9rem;
  color: var(--muted-foreground);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.site-list-rating {
  margin-left: 1rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 0;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.reset-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background-color: var(--primary);
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.reset-button:hover {
  background-color: var(--primary-dark);
}

@media (max-width: 768px) {
  .quality-content-container {
    padding: 1rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .featured-grid {
    grid-template-columns: 1fr;
  }
  
  .sites-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
  
  .site-list-description {
    -webkit-line-clamp: 1;
  }
}


</style>