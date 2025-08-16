<template>
  <AppHeader />
  <div v-if="site" class="site-detail-container">
    <!-- 返回按钮 - 使用 shadcn button 样式 -->
    <button 
      class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 mb-6"
      @click="goBack"
    >
      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      返回到 Today
    </button>
    
    <!-- 网站头部信息 - App Store 风格 -->
    <div class="site-header">
      <div class="site-main-info">
        <div class="site-icon-container">
          <img :src="getSiteIcon(site)" :alt="site.title" class="site-icon" />
        </div>
        <div class="site-info">
          <h1 class="site-title">{{ site.title }}</h1>
          <div class="site-subtitle">{{ site.category }}</div>
          <div class="site-rating-container">
            <div class="rating-stars">
              <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= site.rating }">★</span>
            </div>
            <span class="rating-text">{{ site.rating }}</span>
            <span class="rating-separator">•</span>
            <span class="rating-category">{{ site.category }}</span>
          </div>
        </div>
        <div class="site-actions">
          <!-- 主要操作按钮 - shadcn primary button -->
          <a 
            :href="site.url" 
            target="_blank" 
            class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 font-semibold"
          >
            访问网站
          </a>
        </div>
      </div>
      
      <!-- 中国大陆访问提示 -->
      <div v-if="site.unchina" class="access-warning">
        <div class="warning-content">
          <svg class="warning-icon" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          <span>在中国大陆可能无法使用</span>
        </div>
      </div>
    </div>

    <!-- 标签区域 -->
    <div class="tags-section">
      <div class="tags-container">
        <span v-for="tag in site.tags" :key="tag" class="tag-badge">{{ tag }}</span>
      </div>
    </div>
    
    <!-- 详细描述区域 -->
    <div class="description-section">
      <div class="section-header">
        <h2 class="section-title">关于此应用</h2>
      </div>
      <div class="description-content">
        <p class="description-text">{{ site.detailedDescription }}</p>
      </div>
    </div>
    
    <!-- 相关推荐区域 -->
    <div class="related-section">
      <div class="section-header">
        <h2 class="section-title">您可能还喜欢</h2>
        <button 
          v-if="relatedSites.length > 0" 
          class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
          @click="toggleRelevanceDetails"
        >
          {{ showRelevanceDetails ? '隐藏分析信息' : '显示分析信息' }}
        </button>
      </div>
      
      <div v-if="isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p class="loading-text">正在加载推荐内容...</p>
      </div>
      
      <div v-else-if="relatedSites.length > 0" class="related-grid">
        <div 
          v-for="relatedItem in relatedSites" 
          :key="relatedItem.site.id"
          class="related-card"
          @click="goToSiteDetail(relatedItem.site.id)"
        >
          <div class="related-card-content">
            <div class="related-icon-container">
              <img :src="getSiteIcon(relatedItem.site)" :alt="relatedItem.site.title" class="related-icon" />
            </div>
            <div class="related-info">
              <div class="related-header">
                <h3 class="related-title">{{ relatedItem.site.title }}</h3>
                <div v-if="showRelevanceDetails" class="relevance-badge">
                  {{ relatedItem.score }}% 匹配
                </div>
              </div>
              <div class="related-meta">
                <span class="related-category">{{ relatedItem.site.category }}</span>
                <div class="related-rating">
                  <span v-for="i in 5" :key="i" class="star-small" :class="{ filled: i <= relatedItem.site.rating }">★</span>
                  <span class="rating-value-small">{{ relatedItem.site.rating }}</span>
                </div>
              </div>
              <p class="related-description">{{ relatedItem.site.description }}</p>
              <div class="related-tags">
                <span v-for="tag in relatedItem.site.tags.slice(0, 2)" :key="tag" class="related-tag">{{ tag }}</span>
              </div>
              <div v-if="showRelevanceDetails" class="match-details">
                <div class="match-reasons">
                  <div v-for="(reason, index) in relatedItem.matchReasons" :key="index" class="match-reason">
                    {{ reason }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="empty-state">
        <div class="empty-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
          </svg>
        </div>
        <p class="empty-text">暂无相关推荐</p>
      </div>
    </div>
  </div>
  
  <!-- 404 状态 -->
  <div v-else class="not-found-container">
    <div class="not-found-content">
      <div class="not-found-icon">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h1 class="not-found-title">来到了奇怪的地方呢...</h1>
      <p class="not-found-description">抱歉，您请求的网站详情不存在。</p>
      <button 
        class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 mt-4"
        @click="goBack"
      >
        返回 Today
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getSiteById, getRelatedSites, getSiteIcon } from '../utils/featuredSites'
import { safeLocalStorage } from '../utils/storage'
import AppHeader from '@/components/AppHeader.vue'

const router = useRouter()
const route = useRoute()
const siteId = route.params.id
const isLoading = ref(true)
const showRelevanceDetails = ref(false)

// 获取网站详情
const site = ref(getSiteById(siteId))

// 获取相关网站
const relatedSites = ref([])

// 加载数据
onMounted(() => {
  // 模拟加载过程
  setTimeout(() => {
    if (site.value) {
      // 使用新的getRelatedSites函数获取相关推荐
      relatedSites.value = getRelatedSites(siteId, 4)
    }
    isLoading.value = false
  }, 800)
})

// 切换显示相关性详情
const toggleRelevanceDetails = () => {
  showRelevanceDetails.value = !showRelevanceDetails.value
}

// 返回上一页
const goBack = () => {
  router.push('/quality-content')
}

// 跳转到其他网站详情
const goToSiteDetail = (id) => {
  router.push(`/quality-content/${id}`)
}
</script>

<style scoped>
.site-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  margin-top: 4rem;
  background: var(--background);
  min-height: calc(100vh - 4rem);
}

/* 网站头部 - App Store 风格 */
.site-header {
  margin-bottom: 2rem;
}

.site-main-info {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.site-icon-container {
  flex-shrink: 0;
}

.site-icon {
  width: 128px;
  height: 128px;
  border-radius: 22px;
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.site-info {
  flex: 1;
  min-width: 0;
}

.site-title {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 0.5rem;
  color: var(--foreground);
}

.site-subtitle {
  font-size: 1.25rem;
  color: var(--muted-foreground);
  margin-bottom: 1rem;
}

.site-rating-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
}

.rating-stars {
  display: flex;
  gap: 1px;
}

.star {
  color: var(--muted-foreground);
  font-size: 1rem;
  transition: color 0.2s;
}

.star.filled {
  color: #FF9500;
}

.rating-text {
  font-weight: 600;
  color: var(--foreground);
}

.rating-separator {
  color: var(--muted-foreground);
}

.rating-category {
  color: var(--muted-foreground);
}

.site-actions {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* 访问警告 */
.access-warning {
  background: linear-gradient(135deg, #FFF3CD 0%, #FCF4DD 100%);
  border: 1px solid #F0E68C;
  border-radius: 12px;
  padding: 1rem 1.25rem;
  margin-top: 1rem;
}

.warning-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #8B4513;
}

.warning-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

/* 标签区域 */
.tags-section {
  margin-bottom: 2.5rem;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 0.75rem;
  background: var(--accent);
  color: var(--accent-foreground);
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid var(--border);
}

/* 区域标题 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--foreground);
}

/* 描述区域 */
.description-section {
  margin-bottom: 3rem;
}

.description-content {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.5rem;
}

.description-text {
  font-size: 1.1rem;
  line-height: 1.7;
  color: var(--foreground);
  margin: 0;
}

/* 相关推荐区域 */
.related-section {
  margin-bottom: 2rem;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--muted);
  border-top: 3px solid var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.loading-text {
  color: var(--muted-foreground);
  font-size: 0.95rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
}

.related-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.related-card:hover {
  border-color: var(--primary);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.related-card-content {
  display: flex;
  gap: 1rem;
}

.related-icon-container {
  flex-shrink: 0;
}

.related-icon {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  object-fit: cover;
  border: 1px solid var(--border);
}

.related-info {
  flex: 1;
  min-width: 0;
}

.related-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.related-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--foreground);
  line-height: 1.3;
}

.relevance-badge {
  background: var(--primary);
  color: var(--primary-foreground);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.related-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.related-category {
  background: var(--accent);
  color: var(--accent-foreground);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.related-rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.star-small {
  color: var(--muted-foreground);
  font-size: 0.8rem;
}

.star-small.filled {
  color: #FF9500;
}

.rating-value-small {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--muted-foreground);
}

.related-description {
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--muted-foreground);
  margin-bottom: 0.75rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.related-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-bottom: 0.75rem;
}

.related-tag {
  background: var(--muted);
  color: var(--muted-foreground);
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.match-details {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px dashed var(--border);
}

.match-reasons {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.match-reason {
  font-size: 0.8rem;
  color: var(--muted-foreground);
  padding-left: 0.5rem;
  border-left: 2px solid var(--primary);
  line-height: 1.4;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
}

.empty-icon {
  width: 48px;
  height: 48px;
  color: var(--muted-foreground);
  margin-bottom: 1rem;
}

.empty-text {
  color: var(--muted-foreground);
  font-size: 1rem;
}

/* 404 页面 */
.not-found-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 4rem);
  padding: 2rem;
  margin-top: 4rem;
}

.not-found-content {
  text-align: center;
  max-width: 400px;
}

.not-found-icon {
  width: 64px;
  height: 64px;
  color:  #ff5900;
  margin: 0 auto 1.5rem;
}

.not-found-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--foreground);
  margin-bottom: 0.5rem;
}

.not-found-description {
  color: var(--muted-foreground);
  margin-bottom: 1.5rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .site-detail-container {
    padding: 1rem;
  }
  
  .site-main-info {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-areas: 
      "icon info"
      "actions actions";
    gap: 1rem;
    text-align: left;
  }
  
  .site-icon-container {
    grid-area: icon;
  }
  
  .site-info {
    grid-area: info;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  .site-icon {
    width: 80px;
    height: 80px;
  }
  
  .site-title {
    font-size: 1.5rem;
    margin-bottom: 0.25rem;
  }
  
  .site-subtitle {
    margin-bottom: 0.5rem;
    font-size: 1rem;
  }
  
  .site-actions {
    grid-area: actions;
    width: 100%;
  }
  
  .related-grid {
    grid-template-columns: 1fr;
  }
  
  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
}

@media (max-width: 480px) {
  .site-main-info {
    grid-template-columns: 70px 1fr;
    gap: 0.75rem;
  }
  
  .site-icon {
    width: 70px;
    height: 70px;
    border-radius: 14px;
  }
  
  .site-title {
    font-size: 1.25rem;
  }
  
  .site-subtitle {
    font-size: 0.9rem;
  }
  
  .site-rating-container {
    font-size: 0.8rem;
  }
  
  .star {
    font-size: 0.85rem;
  }
  
  .related-card-content {
    display: grid;
    grid-template-columns: 50px 1fr;
    gap: 0.75rem;
    text-align: left;
  }
  
  .related-icon {
    width: 50px;
    height: 50px;
  }
  
  .related-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
  }
  
  .related-meta {
    justify-content: space-between;
    gap: 0.5rem;
  }
}

/* 暗色主题适配 */
@media (prefers-color-scheme: dark) {
  .access-warning {
    background: linear-gradient(135deg, #2D1B00 0%, #3D2A00 100%);
    border-color: #664D03;
  }
  
  .warning-content {
    color: #FFDA6A;
  }
}
</style>