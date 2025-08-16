import "./style.css";

import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { useUserStore } from './store/user'
import { useThemeStore } from './store/theme'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const isLoggedIn = !!userStore.token
  const isAdmin = !!userStore.userInfo?.is_admin
  
  // 如果用户已登录且被封禁，且不在封禁页面，则跳转到封禁页面
  if (isLoggedIn && userStore.userInfo?.is_banned && to.path !== '/banned') {
    const banReason = userStore.userInfo?.ban_reason || '违反社区规定'
    const banExpiration = userStore.userInfo?.ban_expiration || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    
    next({
      path: '/banned',
      query: {
        banReason: banReason,
        banExpiration: banExpiration
      }
    })
    return
  }
  
  // 管理员权限校验
  if (to.meta.requiresAdmin && !isAdmin) {
    // 可自定义跳转页面或弹窗提示
    next({ path: '/' }) // 跳转到首页
    return
  }
  // 需要登录的页面，未登录则跳转到登录页
  if (to.meta.requiresAuth && !isLoggedIn) {
    next({ path: '/login' })
  // 已登录访问登录/注册页，自动跳转到仪表盘
  } else if ((to.path === '/login' || to.path === '/register') && isLoggedIn) {
    next({ path: '/dashboard' }) // 或 '/dashboard'，根据你的仪表盘路由
  } else {
    next()
  }
})

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)

// 初始化主题
const themeStore = useThemeStore(pinia)
themeStore.initTheme()


router.afterEach((to) => {
  // 首页特殊标题
  if (to.path === '/' || to.name === 'Home') {
    document.title = 'Space | 搜索'
  } else {
    // 取 meta.title 或 name 或自定义标题
    const pageTitle = to.meta?.title || to.meta?.pageTitle || to.name || '页面';
    document.title = `${pageTitle} | Space`
  }
})

app.mount('#app')
