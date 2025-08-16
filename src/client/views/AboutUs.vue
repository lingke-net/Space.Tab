<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import { Button } from '@/components/ui/button'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader class="fixed top-0 left-0 w-full z-50" />
    
    <main class="flex-1 container mx-auto px-4 pt-24 pb-8">
      <div class="flex flex-1 flex-col gap-8 max-w-3xl mx-auto">
        <div class="space-y-2">
          <h1 class="text-3xl font-medium">关于我们</h1>
          <p class="text-muted-foreground">
            了解 Space.Tab 背后的团队
          </p>
        </div>
        
        <div class="bg-card rounded-lg p-6 shadow-sm border">
          <h2 class="text-xl font-medium mb-4">开发与设计</h2>
          <p class="mb-2">Space.Tab 由 dream_pep 开发与设计</p>
          <p class="mb-6">感谢 Lingke Network 提供云服务计算支持</p>
          
          <div class="space-y-4">
            <Button variant="default" class="w-full sm:w-auto">
              <a href="https://afdian.com/a/dream_pep" target="_blank" rel="noopener noreferrer" class="flex justify-center">
                赞助我们
              </a>
            </Button>
            <br>
            <Button variant="default" class="w-full sm:w-auto">
              <a href="https://qm.qq.com/q/3qL2id2zN6" target="_blank" rel="noopener noreferrer" class="flex justify-center">
                加入用户群
              </a>
            </Button>
            <p class="text-sm text-muted-foreground mt-2">
              由于云计算与天气API还有域名都是运营成本，如果您认为我们做的还不错，可以赞助一下我们哦~
            </p>
          </div>
        </div>
        
        <div class="bg-card rounded-lg p-6 shadow-sm border">
          <h2 class="text-xl font-medium mb-4">我们的使命</h2>
          <p>
            Space.Tab 致力于提供简洁、高效的浏览体验，让用户能够更便捷地获取信息。
          <br>
            我们相信技术应该为人所用，而不是让人被技术所困扰。
          </p>
        </div>
      </div>
    </main>
    
    <AppFooter />
  </div>
</template>

<style scoped>
/* 可以添加特定于此页面的样式 */
</style>