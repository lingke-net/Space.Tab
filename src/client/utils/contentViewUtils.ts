import { ref } from 'vue'

// 视图模式
export const useViewMode = () => {
  const viewMode = ref('grid')
  
  const setGridView = () => {
    viewMode.value = 'grid'
  }
  
  const setListView = () => {
    viewMode.value = 'list'
  }
  
  return {
    viewMode,
    setGridView,
    setListView
  }
}

// 搜索和过滤
export const useContentFilters = () => {
  const selectedCategory = ref('all')
  const searchQuery = ref('')
  
  // 搜索过滤
  const filterSites = () => {
    // 如果搜索框有内容，自动切换到"全部"分类以显示所有匹配结果
    if (searchQuery.value.trim()) {
      selectedCategory.value = 'all'
    }
  }
  
  // 重置筛选条件
  const resetFilters = () => {
    searchQuery.value = ''
    selectedCategory.value = 'all'
  }
  
  return {
    selectedCategory,
    searchQuery,
    filterSites,
    resetFilters
  }
}

// 移动端触摸滚动增强
export const enhanceTouchScrolling = () => {
  // 增强移动端触摸滚动体验
  const setupTouchScrolling = () => {
    const scrollContainer = document.querySelector('.category-scroll-container')
    if (scrollContainer) {
      // 防止触摸事件冲突
      scrollContainer.addEventListener('touchstart', (e) => {
        e.stopPropagation()
      }, { passive: true })
      
      // 确保触摸滚动正常工作
      scrollContainer.addEventListener('touchmove', (e) => {
        e.stopPropagation()
      }, { passive: true })
    }
  }
  
  return {
    setupTouchScrolling
  }
}