import { ref, computed } from 'vue'

// 定义搜索引擎接口类型
export interface SearchEngine {
  id: string;
  name: string;
  svg: string;
  url: string;
}

// 搜索引擎配置
export const searchEngines: SearchEngine[] = [
  { 
    id: 'bing', 
    name: '必应', 
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="-4 -2 24 24"><path fill="currentColor" d="M15.973 8.57a.48.48 0 0 0-.317-.434L6.273 5.23c-.175-.054-.255.039-.178.206L7.84 9.269c.077.168.276.367.442.443l2.394 1.096c.166.076.17.209.008.295L.47 16.535c-.161.086-.182.056-.046-.067l3.924-3.534a.86.86 0 0 0 .248-.558L4.6 1.664a.48.48 0 0 0-.318-.435L.355.014C.18-.04.037.067.037.252v16.25c0 .185.122.423.272.529l3.99 2.827c.15.106.4.115.557.02l10.832-6.523a.66.66 0 0 0 .286-.507V8.57z"/></svg>',
    url: 'https://www.bing.com/search?q=' 
  },
  { 
    id: 'bilibili', 
    name: '哔哩哔哩', 
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24"><path fill="currentColor" d="M18.223 3.086a1.25 1.25 0 0 1 0 1.768L17.08 5.996h1.17A3.75 3.75 0 0 1 22 9.747v7.5a3.75 3.75 0 0 1-3.75 3.75H5.75A3.75 3.75 0 0 1 2 17.247v-7.5a3.75 3.75 0 0 1 3.75-3.75h1.166L5.775 4.855a1.25 1.25 0 0 1 1.767-1.768l2.652 2.652q.119.119.198.257h3.213q.08-.14.199-.258l2.651-2.652a1.25 1.25 0 0 1 1.768 0m.027 5.42H5.75a1.25 1.25 0 0 0-1.247 1.157l-.003.094v7.5c0 .659.51 1.198 1.157 1.246l.093.004h12.5a1.25 1.25 0 0 0 1.247-1.157l.003-.093v-7.5c0-.69-.56-1.25-1.25-1.25m-10 2.5c.69 0 1.25.56 1.25 1.25v1.25a1.25 1.25 0 1 1-2.5 0v-1.25c0-.69.56-1.25 1.25-1.25m7.5 0c.69 0 1.25.56 1.25 1.25v1.25a1.25 1.25 0 1 1-2.5 0v-1.25c0-.69.56-1.25 1.25-1.25"/></svg>',
    url: 'https://search.bilibili.com/all?keyword=' 
  },
  { 
    id: 'google', 
    name: '谷歌', 
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 1536 1536"><path fill="currentColor" d="M768 658h725q12 67 12 128q0 217-91 387.5T1154.5 1440T768 1536q-157 0-299-60.5T224 1312T60.5 1067T0 768t60.5-299T224 224T469 60.5T768 0q300 0 515 201l-209 201Q951 283 768 283q-129 0-238.5 65T356 524.5T292 768t64 243.5T529.5 1188t238.5 65q87 0 160-24t120-60t82-82t51.5-87t22.5-78H768z"/></svg>',
    url: 'https://www.google.com/search?q=' 
  },
  { 
    id: 'zhihu', 
    name: '知乎', 
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24"><path fill="currentColor" d="m12.345 17.963l-1.688 1.074l-2.132-3.35c-.44 1.402-1.171 2.665-2.138 3.825c-.402.483-.82.918-1.301 1.376c-.155.146-.775.716-.878.82l-1.414-1.415c.139-.139.787-.735.914-.856c.43-.408.796-.79 1.143-1.205C6.117 16.712 6.88 15.02 6.988 13H3v-2h4V7h-.868c-.689 1.266-1.558 2.222-2.618 2.858L2.486 8.143c1.396-.838 2.426-2.603 3.039-5.36l1.952.434q-.21.95-.489 1.783h4.513v2H9v4h2.5v2H9.186zm3.838-.07L17.3 17h1.702V7h-4v10h.736zM13.001 5h8v14h-3l-2.5 2l-1-2H13z"/></svg>',
    url: 'https://www.zhihu.com/search?type=content&q=' 
  }
]

export const useSearchEngine = () => {
  const inputValue = ref('')
  const selectedEngine = ref('bing') // 默认搜索引擎为Bing

  // 切换搜索引擎
  const switchEngine = (engineId: string): void => {
    selectedEngine.value = engineId
  }

  // 获取当前选中的搜索引擎
  const currentEngine = computed(() => {
    return searchEngines.find(engine => engine.id === selectedEngine.value) || searchEngines[0]
  })

  const handleSubmit = (): void => {
    if (!inputValue.value.trim()) return
    
    // 获取当前搜索引擎的URL
    const engine = currentEngine.value
    const searchUrl = engine.url + encodeURIComponent(inputValue.value)
    
    // 在新标签页中打开搜索结果
    window.open(searchUrl, '_blank')
    
    console.log(`使用 ${engine.name} 搜索:`, inputValue.value)
  }

  // 处理回车键提交，但允许Shift+Enter换行
  const handleKeydown = (e: KeyboardEvent): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return {
    inputValue,
    selectedEngine,
    searchEngines,
    currentEngine,
    switchEngine,
    handleSubmit,
    handleKeydown
  }
}