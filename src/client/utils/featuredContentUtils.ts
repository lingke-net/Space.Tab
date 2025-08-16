import { featuredSites, getSiteIcon } from './featuredSites'

// 获取推荐网站
export const getRecommendedSites = () => {
  const recommendedIds = ['steam', 'docker', 'github']
  return featuredSites
    .filter(site => recommendedIds.includes(site.id))
    .sort((a, b) => b.rating - a.rating)
}

// 根据搜索和分类过滤网站
export const getFilteredSites = (selectedCategory: string, searchQuery: string) => {
  let sites = [...featuredSites]
  
  // 按分类过滤
  if (selectedCategory !== 'all') {
    sites = sites.filter(site => site.category === selectedCategory)
  }
  
  // 按搜索关键词过滤
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase()
    sites = sites.filter(site => 
      site.title.toLowerCase().includes(query) || 
      site.description.toLowerCase().includes(query) ||
      site.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }
  
  // 优先显示可在中国大陆访问的网站
  const chinaAccessible = sites.filter(site => !site.unchina)
  const chinaRestricted = sites.filter(site => site.unchina)
  
  return [...chinaAccessible, ...chinaRestricted]
}

// 获取网站图标
export { getSiteIcon }

// 导出原始数据以供参考
export { featuredSites }