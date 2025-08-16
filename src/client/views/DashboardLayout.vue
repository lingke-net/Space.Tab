<script setup lang="ts">
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import AppSidebar from '@/components/AppSidebar.vue'
import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted, watch } from 'vue'
import { useUserStore } from '@/store/user'
import { toast } from 'vue-sonner'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const pageTitle = computed(() => {
  switch (route.name) {
    case 'Dashboard':
      return '管理仪表盘'
    case 'DashboardSettings':
      return '设置'
    case 'UserProfile':
      return '用户设置'
    case 'UserManagement':
      return '用户管理'
    case 'PermissionManagement':
      return '权限管理'
    case 'AuditManagement':
      return '审核管理'
    case 'AboutIndex':
      return '关于'
    case 'GithubReleasesIndex':
      return 'GitHub 版本'
    case 'EquipmentManagement':
      return '设备管理'
    default:
      return '管理仪表盘'
  }
})

// 检查用户登录状态
const checkAuth = () => {
  if (!userStore.token) {
    // 显示破坏性 toast 提示
    toast.error('访问被拒绝', {
      description: "请先登录后再访问此页面"
    })
    // 重定向到登录页面
    router.push('/login')
    return false
  }
  return true
}

onMounted(() => {
  // 组件挂载时检查登录状态
  checkAuth()
})

// 监听路由变化，确保每次进入仪表盘都检查登录状态
watch(() => route.path, (newPath) => {
  if (newPath.startsWith('/dashboard')) {
    checkAuth()
  }
})
</script>
<template class="bg-card">
  <div class="flex min-h-screen bg-card" vaul-drawer-wrapper id="app">
    <SidebarProvider>
      <AppSidebar />
      <div class="flex-1 flex flex-col min-h-screen">
        <header class="w-full flex h-16 shrink-0 items-center gap-2 border-b px-8 bg-card">
          <SidebarTrigger class="-ml-1" />
          <!--<Separator orientation="vertical" class="mr-2 h-4" />-->
          <span class="font-bold text-lg">{{ pageTitle }}</span>
        </header>
        <main class="flex-1 bg-card">
          <router-view />
        </main>
      </div>
    </SidebarProvider>
  </div>
</template> 