<script setup lang="ts">
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
  Sun,
  Moon,
  Monitor,
  Settings,
  User,
  LayoutDashboard,
} from 'lucide-vue-next'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { useUserStore } from '@/store/user'
import { useThemeStore } from '@/store/theme'
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const { isMobile } = useSidebar()
const userStore = useUserStore()
const themeStore = useThemeStore()
const router = useRouter()

const userAvatar = computed(() => {
  // 优先使用QQ头像
  if (userStore.userInfo?.qq_num && userStore.userInfo.qq_num.trim()) {
    // 添加时间戳参数以防止缓存
    const timestamp = new Date().getTime()
    // 尝试使用更可靠的QQ头像API格式
    const qqAvatarUrl = `https://q1.qlogo.cn/g?b=qq&nk=${userStore.userInfo.qq_num.trim()}&s=100&t=${timestamp}`
    console.log('QQ头像URL:', qqAvatarUrl)
    return qqAvatarUrl
  }
  // 如果没有QQ号，返回空字符串让AvatarFallback显示用户名首字母
  return ''
})

const fallbackAvatar = computed(() => {
  // 当QQ头像加载失败时的回退头像
  return userStore.userInfo?.username?.charAt(0).toUpperCase() || 'U'
})

const userInitials = computed(() => {
  return userStore.userInfo?.username?.charAt(0).toUpperCase() || 'U'
})

const isAdmin = computed(() => {
  return userStore.userInfo?.is_admin || false
})

// 主题相关计算属性
const themeIcon = computed(() => {
  switch (themeStore.theme) {
    case 'light':
      return Sun
    case 'dark':
      return Moon
    case 'auto':
      return Monitor
    default:
      return Monitor
  }
})

const themeLabel = computed(() => {
  switch (themeStore.theme) {
    case 'light':
      return '明亮模式'
    case 'dark':
      return '黑暗模式'
    case 'auto':
      return '自动模式'
    default:
      return '自动模式'
  }
})

// 在组件挂载时获取用户信息
onMounted(async () => {
  if (userStore.token && userStore.userId) {
    await userStore.getUserInfo()
  }
})

// 退出登录
function logout() {
  userStore.logout()
  router.push('/login')
}

// 切换主题
function toggleTheme() {
  themeStore.toggleTheme()
}
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <Avatar class="h-8 w-8 rounded-full bg-card">
              <AvatarImage :src="userAvatar" @error="() => console.log('QQ头像加载失败，使用回退头像')" />
              <AvatarFallback>{{ fallbackAvatar || userInitials }}</AvatarFallback>
            </Avatar>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <div class="flex items-center gap-2">
                <span class="truncate font-medium">{{ userStore.userInfo?.username || '用户' }}</span>
                <span
                  v-if="isAdmin"
                  class="inline-flex items-center rounded-full bg-orange-500 px-2 py-0.5 text-xs font-medium text-white"
                >
                  PRO
                </span>
              </div>
              <span class="truncate text-xs">{{ userStore.userInfo?.email || '' }}</span>
            </div>
            <ChevronsUpDown class="ml-auto size-4" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-card text-card-foreground dark:bg-card dark:text-card-foreground shadow-lg border border-border"
          :side="isMobile ? 'bottom' : 'right'"
          align="end"
          :side-offset="4"
        >
          <DropdownMenuLabel class="p-0 font-normal">
            <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar class="h-9 w-9 rounded-full">
                <AvatarImage :src="userAvatar" @error="() => console.log('QQ头像加载失败，使用回退头像')" />
                <AvatarFallback>{{ fallbackAvatar || userInitials }}</AvatarFallback>
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
            <LogOut class="h-4 w-4 mr-2" />
            退出登录
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
