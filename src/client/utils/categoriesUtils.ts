import { 
  Search, 
  Home, 
  Gamepad2,
  Bot,
  Star,
  Wrench,
  Code
} from 'lucide-vue-next'

// 分类数据
export const categories = [
  { value: '搜索', label: '搜索', icon: Search },
  { value: '娱乐', label: '娱乐', icon: Gamepad2 },
  { value: 'AI', label: 'AI', icon: Bot },
  { value: '评价', label: '评价', icon: Star },
  { value: '工具', label: '工具', icon: Wrench },
  { value: '开发', label: '开发', icon: Code }
]

// 获取当前分类标题
export const getCategoryTitle = (selectedCategory: string, searchQuery: string) => {
  if (searchQuery) {
    return `搜索结果: "${searchQuery}"`
  }
  
  if (selectedCategory === 'all') {
    return '所有内容'
  }
  
  return selectedCategory
}