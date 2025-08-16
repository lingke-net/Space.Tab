<script setup lang="ts">
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
  Users,
  UserCheck,
  Shield,
  Info,
  Database,
  Download,
  Server,
} from 'lucide-vue-next'

import NavMain from '@/components/NavMain.vue'
import NavSecondary from '@/components/NavSecondary.vue'
import NavUser from '@/components/NavUser.vue'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  type SidebarProps,
} from '@/components/ui/sidebar'
import { useUserStore } from '@/store/user'
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const props = withDefaults(defineProps<SidebarProps>(), {
  variant: 'inset',
})

const userStore = useUserStore()
const route = useRoute()
const isLoggedIn = computed(() => !!userStore.token)
const isAdmin = computed(() => userStore.userInfo?.is_admin || false)

const navMain = computed(() => [
  {
    title: '仪表盘',
    url: '/dashboard',
    icon: SquareTerminal,
    isActive: route.path === '/dashboard',
  },
  {
    title: '用户设置',
    url: '/dashboard/profile',
    icon: BookOpen,
    isActive: route.path === '/dashboard/profile',
  },
])

const navAdmin = computed(() => [
  {
    title: '用户管理',
    url: '/dashboard/users',
    icon: Users,
    isActive: route.path === '/dashboard/users',
  },
  {
    title: '权限管理',
    url: '/dashboard/permissions',
    icon: Shield,
    isActive: route.path === '/dashboard/permissions',
  },
  {
    title: '审核管理',
    url: '/dashboard/audit',
    icon: UserCheck,
    isActive: route.path === '/dashboard/audit',
  },
])


const data = {
  navSecondary: [
    {
      title: '关于',
      url: '/dashboard/about',
      icon: Info,
    },
    {
      title: '反馈',
      url: '#',
      icon: Send,
    },
  ],
}

onMounted(() => {
  userStore.loadFromCookie()
})
</script>

<template>
  <Sidebar v-bind="props" collapsible="icon">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" as-child>
            <a href="/" class="h-15 w-auto group-data-[collapsible=icon]:hidden">
              <h3 class="scroll-m-20 text-2xl font-semibold tracking-tight">
                Space.Tab
              </h3>
            </a>
            <a href="/" class="h-8 w-8 hidden group-data-[collapsible=icon]:block">
              <img 
                src="https://lunova.studio/wp-content/uploads/2025/03/lunova_icon_bold_black@svg.svg" 
                alt="Lunova Studio" 
              />
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarContent>
      <NavMain :items="navMain" />
      
      <!-- 管理员分组 -->
      <SidebarGroup v-if="isAdmin">
        <SidebarGroupLabel>管理</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem v-for="item in navAdmin" :key="item.title">
            <SidebarMenuButton as-child :tooltip="item.title" :data-active="item.isActive">
              <router-link :to="item.url" :class="{ 'data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground': item.isActive }">
                <component :is="item.icon" />
                <span>{{ item.title }}</span>
              </router-link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>

      
      <NavSecondary :items="data.navSecondary" class="mt-auto" />
    </SidebarContent>
    <SidebarFooter>
      <template v-if="isLoggedIn">
        <NavUser />
      </template>
      <template v-else>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton as-child>
              <a href="/login">登录</a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton as-child>
              <a href="/register">注册</a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </template>
    </SidebarFooter>
  </Sidebar>
</template>