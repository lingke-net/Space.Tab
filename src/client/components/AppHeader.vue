<script setup lang="ts">
import 'vue-sonner/style.css'
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
} from '@/components/ui/navigation-menu'
import { useUserStore } from '@/store/user'
import { computed, onMounted, ref, inject, nextTick, onBeforeUnmount } from 'vue'
import { gsap } from 'gsap'
import { useMediaQuery } from '@vueuse/core'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { BadgeCheck, Bell, ChevronsUpDown, LogOut, Menu, LayoutDashboard, User, Settings, Globe } from 'lucide-vue-next'
import { useRouter, useRoute } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Sun, Moon, Monitor } from 'lucide-vue-next'
import { useThemeStore } from '@/store/theme'

const userStore = useUserStore()
const themeStore = useThemeStore()
const isLoggedIn = computed(() => !!userStore.token)
const router = useRouter()
const route = useRoute()

// 使用vueuse的useMediaQuery检测是否为移动设备
const isMobile = useMediaQuery('(max-width: 768px)')

const userAvatar = computed(() => {
  // 优先使用QQ头像
  if (userStore.userInfo?.qq_num && userStore.userInfo.qq_num.trim()) {
    const qqAvatarUrl = `http://q1.qlogo.cn/g?b=qq&nk=${userStore.userInfo.qq_num.trim()}&s=100`
    console.log('AppHeader QQ头像URL:', qqAvatarUrl)
    return qqAvatarUrl
  }
  // 如果没有QQ号，返回空字符串让AvatarFallback显示用户名首字母
  return ''
})

const userInitials = computed(() => {
  return userStore.userInfo?.username?.charAt(0).toUpperCase() || 'U'
})

const isAdmin = computed(() => {
  return userStore.userInfo?.is_admin || false
})

const mode = ref('system')

// 创建一个全局动画ID引用，用于跟踪当前动画状态
const currentAnimationId = ref(0)

// 创建一个函数来执行头部动画
const animateHeader = () => {
  // 创建一个新的动画ID
  const animationId = Date.now()
  // 更新当前动画ID
  currentAnimationId.value = animationId
  
  // 使用双重requestAnimationFrame确保在下一帧渲染前执行动画
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      // 检查当前动画ID是否仍然是最新的
      // 如果不是，说明在此期间发生了新的动画请求，应该放弃当前动画
      if (currentAnimationId.value !== animationId) {
        console.log('头部动画已被更新的请求替代，跳过旧动画')
        return
      }
      
      try {
        // 先完成UI渲染和动画，不等待任何API请求
        // 使用gsap添加简单的渐入动画，确保无论API响应如何，动画都能执行
        const headerElements = document.querySelectorAll('.header-element, nav, .nav-item, .avatar-container, .flex.items-center, .dropdown-menu-trigger, button')
        
        // 先清除可能存在的动画状态 - 使用具体元素而不是字符串选择器
        gsap.killTweensOf(headerElements)
        
        // 强制重置所有元素状态，确保动画可以重新执行
        // 避免使用clearProps，这是导致props.split错误的原因
        gsap.set(headerElements, { 
          opacity: 0, 
          y: -10,
          immediateRender: true // 立即渲染初始状态
        })
        
        // 创建动画时间轴
        const tl = gsap.timeline({
          onComplete: () => {
            console.log('头部动画完成')
          }
        })
        
        // 执行动画 - 使用时间轴统一管理
        tl.to(headerElements, { 
          opacity: 1, 
          y: 0, 
          duration: 0.3, 
          stagger: 0.03, // 使用stagger替代随机延迟，更加可控
          ease: "power2.out",
          overwrite: true // 覆盖任何现有的动画
        })
      } catch (error) {
        console.error('执行头部动画时出错:', error)
      }
    })
  })
}

onMounted(async () => {
  userStore.loadFromCookie()
  
// 简化动画逻辑，只在组件挂载时执行一次
userStore.loadFromCookie()

// 延迟执行动画，确保DOM已完全渲染
setTimeout(() => {
  animateHeader()
}, 100)

// 异步获取用户信息，不阻塞UI渲染
if (userStore.token && userStore.userId) {
  try {
    userStore.getUserInfo()
  } catch (err) {
    console.error('获取用户信息失败:', err)
  }
}
})

function goDashboard() {
  router.push('/dashboard')
}

function logout() {
  userStore.logout()
  router.push('/login')
}

function setMode(val: string) {
  mode.value = val
  if (val === 'light') {
    document.documentElement.classList.remove('dark')
  } else if (val === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    // system: 跟随系统
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
}

defineExpose({ isLoggedIn })
</script>

<template>
  <div class="fixed top-0 left-0 w-full header-container" :class="{ 
    'home-header': $route.path === '/' || $route.path === '/home',
    'bg-card': $route.path === '/login' || $route.path === '/register',
    'page-header': $route.path !== '/' && $route.path !== '/home' && $route.path !== '/login' && $route.path !== '/register'
  }">
    <nav class="container mx-auto flex items-center justify-between h-16 px-4">
      <div class="flex items-center gap-2">
        <router-link to="/" class="flex items-center gap-2">
          <div class="h-8 w-8 text-primary">
            <svg viewBox="0 0 191.908 174" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="32" height="32" fill="none">
              <path id="spacetab" d="M165.949 88.3112L171.779 91.8085C172.457 92.2139 173.017 92.7874 173.406 93.474C173.795 94.1606 174 94.9367 174 95.7256C174 96.5145 173.795 97.2907 173.406 97.9773C173.017 98.663 172.457 99.2373 171.779 99.6428L92.1449 147.423C88.978 149.324 85.0218 149.324 81.8549 147.423L2.22043 99.6428C1.54338 99.2373 0.982929 98.663 0.593775 97.9773C0.20462 97.2907 0 96.5145 0 95.7256C0 94.9367 0.20462 94.1606 0.593775 93.474C0.982929 92.7874 1.54338 92.2139 2.22043 91.8085L8.05093 88.3112C11.2177 86.4117 15.1735 86.412 18.3399 88.3119L81.8548 126.422C85.0217 128.323 88.9781 128.323 92.145 126.422L155.66 88.3119C158.826 86.412 162.782 86.4117 165.949 88.3112ZM160.804 128.14L171.779 134.723C172.457 135.129 173.017 135.702 173.406 136.389C173.795 137.075 174 137.851 174 138.64C174 139.429 173.795 140.205 173.406 140.892C173.017 141.578 172.457 142.152 171.779 142.558L91.7023 190.604C90.2824 191.457 88.6562 191.908 86.9999 191.908C85.3436 191.908 83.7174 191.457 82.2975 190.604L2.22043 142.558C1.54338 142.152 0.982929 141.578 0.593775 140.892C0.20462 140.205 0 139.429 0 138.64C0 137.851 0.20462 137.075 0.593775 136.389C0.982929 135.702 1.54338 135.129 2.22043 134.723L8.05093 131.226C11.2177 129.326 15.1735 129.327 18.3399 131.227L81.8548 169.337C85.0217 171.237 88.9781 171.237 92.145 169.337L160.804 128.14L160.804 128.14ZM91.6931 1.30397L171.779 49.3502C172.457 49.7556 173.017 50.3295 173.406 51.016C173.795 51.7026 174 52.4783 174 53.2673C174 54.0565 173.795 54.8322 173.406 55.5187C173.017 56.2052 172.457 56.7791 171.779 57.1845L92.1449 104.965C88.9781 106.865 85.0218 106.865 81.8549 104.965L2.22043 57.1845C1.54338 56.7791 0.982929 56.2052 0.593775 55.5187C0.20462 54.8322 0 54.0565 0 53.2673C0 52.4783 0.20462 51.7026 0.593775 51.016C0.982929 50.3295 1.54338 49.7556 2.22043 49.3502L82.2975 1.30397C83.7174 0.450787 85.3436 0 86.9999 0C88.6547 0 90.2794 0.449959 91.6984 1.30162L91.7023 1.30397L91.6931 1.30397L91.6931 1.30397Z" fill="currentColor" fill-rule="evenodd" transform="matrix(0,1,-1,0,191.908,0)" />
            </svg>
          </div>
          <!--<div class="font-bold text-xl text-primary hidden md:block">Space Tab</div>-->
        </router-link>
      </div>
      <div class="flex items-center gap-4">
        <!-- 桌面导航菜单 - 在中等屏幕及以上显示-->
        <!-- 移动端导航菜单 - 在小屏幕上显示 <DropdownMenu v-if="isMobile || isLoggedIn" class="md:hidden">-->
        <DropdownMenu class="md:hidden">
          <DropdownMenuTrigger as-child>
            <Button variant="ghost" size="icon" aria-label="导航菜单">
              <Menu class="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" class="w-56">
            <DropdownMenuItem as-child>
              <router-link to="/" class="flex w-full">
                搜索
              </router-link>
            </DropdownMenuItem>
            
            <DropdownMenuItem as-child>
              <router-link to="/quality-content" class="flex w-full">
                Today
              </router-link>
            </DropdownMenuItem>
            
            <DropdownMenuItem as-child>
              <router-link to="/hot" class="flex w-full">
                今日热点
              </router-link>
            </DropdownMenuItem>

            <DropdownMenuItem as-child>
              <router-link to="/settings" class="flex w-full">
                设置
              </router-link>
            </DropdownMenuItem>
            
            
            <template v-if="!isLoggedIn">
              <DropdownMenuSeparator />
              <div class="flex items-center justify-between px-2 py-2">
              <span class="text-xs text-muted-foreground font-medium select-none">显示模式</span>
                <div class="flex gap-1 bg-muted rounded-lg px-1 py-0.5 dark:bg-muted">
                  <button :class="['rounded-md p-1 transition', themeStore.theme === 'auto' ? 'bg-primary text-primary-foreground shadow' : 'hover:bg-accent dark:hover:bg-accent']" @click="themeStore.setTheme('auto')" title="自动跟随系统">
                    <Monitor :class="themeStore.theme === 'auto' ? 'text-primary-foreground' : 'text-muted-foreground'" class="size-4" />
                  </button>
                  <button :class="['rounded-md p-1 transition', themeStore.theme === 'light' ? 'bg-primary text-primary-foreground shadow' : 'hover:bg-accent dark:hover:bg-accent']" @click="themeStore.setTheme('light')" title="明亮模式">
                    <Sun :class="themeStore.theme === 'light' ? 'text-primary-foreground' : 'text-muted-foreground'" class="size-4" />
                  </button>
                  <button :class="['rounded-md p-1 transition', themeStore.theme === 'dark' ? 'bg-primary text-primary-foreground shadow' : 'hover:bg-accent dark:hover:bg-accent']" @click="themeStore.setTheme('dark')" title="黑暗模式">
                  <Moon :class="themeStore.theme === 'dark' ? 'text-primary-foreground' : 'text-muted-foreground'" class="size-4" />
                  </button>
                </div>
              </div>
</template>
            
          </DropdownMenuContent>
        </DropdownMenu>
        
        <!-- 桌面端导航菜单 - 仅在未登录时显示 
        <NavigationMenu v-if="!isLoggedIn && !isMobile" class="hidden md:flex flex-1 justify-end">
          <NavigationMenuList class="flex gap-4">
            <NavigationMenuItem>
              <NavigationMenuLink as-child>
                <router-link to="/" class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4">
                  搜索
                </router-link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
          <NavigationMenuIndicator />
          <NavigationMenuViewport />
        </NavigationMenu>-->

        <!-- 用户头像下拉菜单 - 仅在登录状态下显示 -->
        <template v-if="isLoggedIn">
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <button class="flex items-center gap-2 px-2 py-1 rounded hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent dark:hover:text-accent-foreground transition-colors">
                <Avatar class="h-8 w-8 rounded-full bg-card">
                  <AvatarImage :src="userAvatar" @error="() => console.log('QQ头像加载失败，使用回退头像')" />
                  <AvatarFallback>{{ userInitials }}</AvatarFallback>
                </Avatar>
                <!--<div class="grid flex-1 text-left text-sm leading-tight md:block hidden">
                  <div class="flex items-center gap-2">
                    <span class="truncate font-medium">{{ userStore.userInfo?.username || '用户' }}</span>
                    <span
                      v-if="isAdmin"
                      class="inline-flex items-center rounded-full bg-blue-500 px-2 py-0.5 text-xs font-medium text-white"
                    >
                      管理员
                    </span>
                  </div>
                  <span class="truncate text-xs">{{ userStore.userInfo?.email || '' }}</span>
                </div>-->
                <!--<ChevronsUpDown class="ml-auto size-4" />-->
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-card text-card-foreground dark:bg-card dark:text-card-foreground shadow-lg border border-border"
              align="end"
              :side-offset="4"
            >
              <DropdownMenuLabel class="p-0 font-normal">
                <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar class="h-9 w-9 rounded-full">
                    <AvatarImage :src="userAvatar" @error="() => console.log('QQ头像加载失败，使用回退头像')" />
                    <AvatarFallback>{{ userInitials }}</AvatarFallback>
                  </Avatar>
                  <div class="grid flex-1 text-left text-sm leading-tight">
                    <div class="flex items-center gap-2">
                      <span class="truncate font-semibold">{{ userStore.userInfo?.username || '用户' }}</span>
                      <span
                        v-if="isAdmin"
                        class="inline-flex items-center rounded-full bg-orange-500 px-2 py-0.5 text-xs font-medium text-white"
                      >
                        PRO
                      </span>
                    </div>
                    <span class="truncate text-xs">{{ userStore.userInfo?.email || '' }}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <!-- 仪表盘 - 仅管理员可见 -->
                <DropdownMenuItem 
                  v-if="isAdmin" 
                  as-child 
                  class="hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent dark:hover:text-accent-foreground"
                >
                  <router-link to="/dashboard">
                    <LayoutDashboard class="h-4 w-4 mr-2" />
                    仪表盘
                  </router-link>
                </DropdownMenuItem>
                <DropdownMenuItem as-child class="hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent dark:hover:text-accent-foreground">
                  <router-link to="/quality-content">
                    <Globe class="h-4 w-4 mr-2" />
                    Today At Space
                  </router-link>
                </DropdownMenuItem>
                <DropdownMenuItem as-child class="hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent dark:hover:text-accent-foreground">
                  <router-link to="/settings">
                    <Settings class="h-4 w-4 mr-2" />
                    系统设置
                  </router-link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div class="flex items-center justify-between px-2 py-2">
                  <span class="text-xs text-muted-foreground font-medium select-none">显示模式</span>
                  <div class="flex gap-1 bg-muted rounded-lg px-1 py-0.5 dark:bg-muted">
                    <button :class="['rounded-md p-1 transition', themeStore.theme === 'auto' ? 'bg-primary text-primary-foreground shadow' : 'hover:bg-accent dark:hover:bg-accent']" @click="themeStore.setTheme('auto')" title="自动跟随系统">
                      <Monitor :class="themeStore.theme === 'auto' ? 'text-primary-foreground' : 'text-muted-foreground'" class="size-4" />
                    </button>
                    <button :class="['rounded-md p-1 transition', themeStore.theme === 'light' ? 'bg-primary text-primary-foreground shadow' : 'hover:bg-accent dark:hover:bg-accent']" @click="themeStore.setTheme('light')" title="明亮模式">
                      <Sun :class="themeStore.theme === 'light' ? 'text-primary-foreground' : 'text-muted-foreground'" class="size-4" />
                    </button>
                    <button :class="['rounded-md p-1 transition', themeStore.theme === 'dark' ? 'bg-primary text-primary-foreground shadow' : 'hover:bg-accent dark:hover:bg-accent']" @click="themeStore.setTheme('dark')" title="黑暗模式">
                      <Moon :class="themeStore.theme === 'dark' ? 'text-primary-foreground' : 'text-muted-foreground'" class="size-4" />
                    </button>
                  </div>
                </div>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem @click="logout" class="hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent dark:hover:text-accent-foreground">
                <LogOut class="mr-2 h-4 w-4" />
                退出登录
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </template>
        
        <!-- 登录/注册按钮 - 仅在未登录状态下显示 -->
        <template v-else>
          <router-link to="/login">
            <Button variant="default" size="sm">登录</Button>
          </router-link>
          <!--<router-link to="/register">
            <Button variant="secondary" size="sm">注册</Button>
          </router-link>-->
        </template>
      </div>
    </nav>
    <slot />
    <Toaster />
  </div>
</template>

<style scoped>
/* 头部容器基础样式 */
.header-container {
  z-index: 50;
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
}

/* 首页头部样式 - 透明背景 */
.home-header {
  background: transparent;
  box-shadow: none;
}

/* 登录/注册页面头部样式 - 使用bg-card背景 
.auth-header {
  background: hsl(var(--card));
  border-bottom: 1px solid hsl(var(--border));
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
}*/

/* 其他页面头部样式 - 带背景和阴影 */
.page-header {
  background: hsl(var(--background) / 0.95);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid hsl(var(--border));
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
}

/* 暗色模式下的页面头部 */
.dark .page-header {
  background: hsl(var(--background) / 0.95);
  border-bottom: 1px solid hsl(var(--border));
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.3), 0 1px 2px -1px rgb(0 0 0 / 0.3);
}

/* 暗色模式下的登录/注册页面头部 
.dark .auth-header {
  background: hsl(var(--card));
  border-bottom: 1px solid hsl(var(--border));
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.3), 0 1px 2px -1px rgb(0 0 0 / 0.3);
}*/

/* 确保登录/注册页面头部的文字可读性 
.auth-header nav {
  position: relative;
  z-index: 1;
}*/

/* 确保导航内容在背景上清晰可见 */
.page-header nav {
  position: relative;
  z-index: 1;
}
</style> 