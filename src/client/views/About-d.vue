<script setup lang="ts">
import { SidebarInset } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Heart, 
  Users, 
  Globe, 
  Shield, 
  Zap, 
  Code, 
  Mail, 
  Github,
  ExternalLink,
  Calendar,
  MapPin
} from 'lucide-vue-next'
import { computed } from 'vue'
const version = import.meta.env.VITE_VERSON_ABOUT

const buildDate = '2025'

// 计算环境信息
const environment = computed(() => {
  return import.meta.env.MODE === 'development' ? '开发' : '生产'
})

const features = [
  {
    icon: Zap,
    title: '极速分发',
    description: '高效的文件与信息分发，支持多平台多终端，助力你的项目快速触达用户。'
  },
  {
    icon: Users,
    title: '免费宣传',
    description: '为服务器主、团队、开源项目免费提供宣传推广，吸引更多用户和玩家。'
  },
  {
    icon: Globe,
    title: '服务推送',
    description: '为推送更新服务与资讯服务，保持用户信息同步。'
  },
  {
    icon: Shield,
    title: '安全可靠',
    description: '采用先进的安全技术，保护用户数据和隐私，确保平台稳定运行。'
  }
]

const team = [
  {
    name: 'dream_pep',
    role: '前端逻辑/UI编辑/后端开发',
    avatar: 'https://q1.qlogo.cn/g?b=qq&nk=109554382&s=100'
  }
]

const technologies = [
  'Vue 3', 'Shadcn/Vue', 'TypeScript', 'Node.js', 'Express', 'MySQL', 'Redis', 'Tailwind CSS'
]
</script>

<template>
  <SidebarInset>
    <div class="flex flex-1 flex-col gap-6 p-8">
      <!-- 页面标题 -->
      <div class="space-y-2">
        <h1 class="text-3xl font-bold tracking-tight">关于 Space.Tab</h1>
        <p class="text-muted-foreground">
          了解 Space.Tab 的出现与技术栈
        </p>
      </div>

      <!-- 主要信息卡片 -->
      <div class="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <Heart class="h-5 w-5 text-red-500" />
              我们的使命
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-muted-foreground leading-relaxed">
              Space.Tab 致力于提供简洁、高效的浏览体验，让用户能够更便捷地获取信息。
            <br>
              我们相信技术应该为人所用，而不是让人被技术所困扰。
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <Code class="h-5 w-5 text-blue-500" />
              技术信息
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm text-muted-foreground">版本</span>
              <Badge variant="secondary">{{ version }}</Badge>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-muted-foreground">构建日期</span>
              <span class="text-sm">{{ buildDate }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-muted-foreground">环境</span>
              <Badge variant="outline">{{ environment }}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- 核心功能 -->
      <Card>
        <CardHeader>
          <CardTitle>核心功能</CardTitle>
          <CardDescription>
            我们提供的核心服务和技术特性
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div v-for="feature in features" :key="feature.title" class="space-y-3">
              <div class="flex items-center gap-3">
                <component :is="feature.icon" class="h-6 w-6 text-primary" />
                <h3 class="font-semibold">{{ feature.title }}</h3>
              </div>
              <p class="text-sm text-muted-foreground">{{ feature.description }}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- 技术栈 -->
      <Card>
        <CardHeader>
          <CardTitle>技术栈</CardTitle>
          <CardDescription>
            我们使用的最新技术和工具
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="flex flex-wrap gap-2">
            <Badge v-for="tech in technologies" :key="tech" variant="outline">
              {{ tech }}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <!-- 团队 -->
      <Card>
        <CardHeader>
          <CardTitle>团队</CardTitle>
          <CardDescription>
            感谢所有为项目做出贡献的团队成员
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid gap-4 md:grid-cols-2">
            <div v-for="member in team" :key="member.name" class="flex items-center gap-4 p-4 border rounded-lg">
              <img :src="member.avatar" :alt="member.name" class="w-12 h-12 rounded-full" />
              <div>
                <h4 class="font-semibold">{{ member.name }}</h4>
                <p class="text-sm text-muted-foreground">{{ member.role }}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- 联系信息 -->
      <Card>
        <CardHeader>
          <CardTitle>联系我们</CardTitle>
          <CardDescription>
            有任何问题或建议，欢迎联系我们
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid gap-4 md:grid-cols-2">
            <div class="flex items-center gap-3">
              <Mail class="h-5 w-5 text-muted-foreground" />
              <div>
                <p class="font-medium">邮箱</p>
                <p class="text-sm text-muted-foreground">dream_pep@mail.lingke.ink</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <Github class="h-5 w-5 text-muted-foreground" />
              <div>
                <p class="font-medium">GitHub</p>
                <a href="https://github.com/Lingke-Net" target="_blank" class="text-sm text-muted-foreground hover:text-primary flex items-center gap-1">
                  Lingke Network
                  <ExternalLink class="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- 版权信息 -->
      <div class="text-center text-sm text-muted-foreground border-t pt-6">
        <p>&copy; 2025 Lingke Network. All rights reserved.</p>
        <p class="mt-1">Made with <Heart class="h-4 w-4 inline text-red-500" /> for the community</p>
      </div>
    </div>
  </SidebarInset>
</template> 