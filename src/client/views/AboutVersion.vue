<script setup lang="ts">
import { ref, computed } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import VersionAvatar from '@/components/VersionAvatar.vue'
import { versionHistory } from '@/utils/versionHistory'

// 页面标题
const pageTitle = ref('版本信息')

// 获取环境变量中的版本号
const version = import.meta.env.VITE_VERSON_ABOUT || '未知版本'

// 获取服务器模式
const serverMode = import.meta.env.VITE_ABOUTSERVER || 'none'

// 获取当前年份
const currentYear = computed(() => new Date().getFullYear())
</script>

<template>
  <AppHeader class="fixed top-0 left-0 w-full z-50" />
  <div class="flex flex-col min-h-screen bg-background">
    <div class="container mx-auto px-4 py-20 max-w-3xl">
      <h1 class="text-3xl font-bold mb-6">{{ pageTitle }}</h1>
      
      <!-- 当前版本信息 -->
      <div class="mb-8 p-5 border rounded-lg bg-card">
        <h2 class="text-2xl font-semibold mb-4">当前版本</h2>
        <div class="flex items-center mb-2">
          <div class="flex items-center">
            <VersionAvatar :mode="serverMode" size="medium" />
            <span class="text-xl font-medium mr-2">V{{ version }}</span>
          </div>
          <span class="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">当前版本</span>
        </div>
        <p class="text-muted-foreground">
          Space.Tab 是一个现代化的启航页，致力于提供简洁、高效的用户体验。
        </p>
      </div>
      
      <!-- 版本历史 -->
      <div class="space-y-6">
        <h2 class="text-2xl font-semibold">版本历史</h2>
        
        <div v-for="(item, index) in versionHistory" :key="index" class="p-4 border-l-2 border-primary/50 pl-6">
          <div class="flex items-center mb-2">
            <div class="flex items-center">
              <VersionAvatar :mode="item.mode" size="small" />
              <h3 class="text-lg font-medium">V{{ item.version }}</h3>
            </div>
            <span class="text-sm text-muted-foreground ml-3">{{ item.date }}</span>
          </div>
          <ul class="list-disc list-inside space-y-1 text-muted-foreground">
            <li v-for="(change, changeIndex) in item.changes" :key="changeIndex">
              {{ change }}
            </li>
          </ul>
        </div>
      </div>
      
      <!-- 版权信息 -->
      <div class="mt-12 text-center text-sm text-muted-foreground">
        <p>
          © {{ currentYear }} Lingke Network. 保留所有权利
          <br>
          本站源码暂不开源，后续会发布社区版本供各位魔改
          <br>
          由 dream_pep 设计与开发
        </p>
      </div>
    </div>
  </div>
</template>
