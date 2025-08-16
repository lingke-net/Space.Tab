<script setup lang="ts">
import { SidebarInset } from '@/components/ui/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UserCheck } from 'lucide-vue-next'

</script>

<template>
  <SidebarInset>
    <div class="flex flex-1 flex-col gap-6 p-8">
      <div class="flex items-center gap-2">
        <UserCheck class="h-6 w-6" />
        <h1 class="text-2xl font-bold">审核管理</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>审核管理</CardTitle>
          <CardDescription>管理系统审核流程</CardDescription>
        </CardHeader>
        <CardContent>
          <p class="text-muted-foreground">审核管理功能正在开发中...</p>
        </CardContent>
      </Card>
    </div>
  </SidebarInset>
</template> 