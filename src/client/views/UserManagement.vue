<script setup lang="ts">
import { SidebarInset } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { ref, onMounted, computed } from 'vue'
import { toast } from 'vue-sonner'
import request from '@/lib/axiosConfig'
import { Users, Shield, UserCheck, Ban, ChevronLeft, ChevronRight, RefreshCw, Info, User } from 'lucide-vue-next'

interface User {
  id: string
  username: string
  email: string
  is_banned: boolean
  ban_reason?: string
  ban_expiration?: string
  is_admin: boolean
  created_at: string
  updated_at: string
  last_login?: string
  avatar?: string
  qq_num?: string
  email_verified?: boolean
}

const users = ref<User[]>([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const totalUsers = ref(0)

// 封禁对话框相关
const showBanDialog = ref(false)
const selectedUser = ref<User | null>(null)
const banReason = ref('')
const banDuration = ref(7)

// 解封确认对话框相关
const showUnbanDialog = ref(false)
const unbanUserInfo = ref<User | null>(null)

// 封禁原因抽屉相关
const showBanReasonSheet = ref(false)
const selectedUserForDetails = ref<User | null>(null)

// 编辑用户对话框相关
const showEditDialog = ref(false)
const editUser = ref<User | null>(null)
const editLoading = ref(false)

// 创建用户对话框相关
const showCreateDialog = ref(false)
const createUser = ref({ username: '', email: '', password: '', qq_num: '' })
const createLoading = ref(false)

// 删除用户对话框相关
const showDeleteDialog = ref(false)
const deleteUserInfo = ref<User | null>(null)
const deleteLoading = ref(false)

// 设置选中的用户详情
const setSelectedUserForDetails = (user: User) => {
  selectedUserForDetails.value = user
}

// 获取用户列表
const fetchUsers = async () => {
  loading.value = true
  try {
    const response = await request.get('/user/list', {
      params: {
        page: currentPage.value,
        size: pageSize.value
      }
    })
    if (response.data && response.data.code === 200) {
      users.value = response.data.data.data || []
      totalUsers.value = response.data.data.total || 0
    }
  } catch (error) {
    console.error('获取用户列表失败:', error)
    toast.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

// 打开封禁对话框
const openBanDialog = (user: User) => {
  selectedUser.value = user
  banReason.value = ''
  banDuration.value = 7
  showBanDialog.value = true
}

// 关闭封禁对话框
const closeBanDialog = () => {
  showBanDialog.value = false
  selectedUser.value = null
  banReason.value = ''
  banDuration.value = 7
}

// 封禁用户
const banUser = async () => {
  if (!selectedUser.value || !banReason.value.trim()) {
    toast.error('请填写封禁原因')
    return
  }

  try {
    const response = await request.post('/user/ban', {
      userId: selectedUser.value.id,
      reason: banReason.value.trim(),
      duration: banDuration.value
    })
    if (response.data && response.data.code === 200) {
      toast.success(`用户 ${selectedUser.value.username} 已封禁`, {
        description: `封禁原因: ${banReason.value.trim()}, 封禁天数: ${banDuration.value}天`
      })
      closeBanDialog()
      // 自动刷新对应用户数据
      await refreshUser(selectedUser.value.id)
    }
    if (response.data && response.data.code === 400) {
      toast.success(`发生错误`, {
        description: `参数输入错误`
      })
      closeBanDialog()
      // 自动刷新对应用户数据
      await refreshUser(selectedUser.value.id)
    }
    if (response.data && response.data.code === 404) {
      toast.success(`发生错误`, {
        description: `用户不存在`
      })
      closeBanDialog()
      // 自动刷新对应用户数据
      await refreshUser(selectedUser.value.id)
    }
    if (response.data && response.data.code === 500) {
      toast.success(`发生错误`, {
        description: `请检查网络连接`
      })
      closeBanDialog()
      // 自动刷新对应用户数据
      await refreshUser(selectedUser.value.id)
    }
  }
  catch (error) {
    console.error('封禁用户失败:', error)
    toast.error('封禁用户失败', {
      description: '请检查网络连接或联系管理员'
    })
  }
}

// 解封用户
const unbanUser = async () => {
  if (!unbanUserInfo.value) return
  
  try {
    const response = await request.post('/user/unBan', {
      userId: unbanUserInfo.value.id
    })
    if (response.data && response.data.code === 200) {
      toast.success(`用户 ${unbanUserInfo.value.username} 已解封`, {
        description: '用户现在可以正常使用系统了'
      })
      closeUnbanDialog()
      // 自动刷新对应用户数据
      await refreshUser(unbanUserInfo.value.id)
    }
    
  }
  catch (error) {
    console.error('解封用户失败:', error)
    toast.error('解封用户失败', {
      description: '请检查网络连接或联系管理员'
    })
  }
}

// 切换用户封禁状态
const toggleBanStatus = async (userId: string, currentStatus: boolean, user?: User) => {
  if (currentStatus) {
    if (user) {
      openUnbanDialog(user)
    }
  } else {
    if (user) {
      openBanDialog(user)
    }
  }
}

// 分页导航
const goToPage = (page: number) => {
  currentPage.value = page
  fetchUsers()
}

const prevPage = () => {
  if (currentPage.value > 1) {
    goToPage(currentPage.value - 1)
  }
}

const nextPage = () => {
  const maxPage = Math.ceil(totalUsers.value / pageSize.value)
  if (currentPage.value < maxPage) {
    goToPage(currentPage.value + 1)
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString('zh-CN')
}

const getUserAvatar = (user: User) => {
  if (user.qq_num && user.qq_num.trim()) {
    return `https://q1.qlogo.cn/g?b=qq&nk=${user.qq_num.trim()}&s=100`
  }
  return ''
}

const getUserInitials = (user: User) => {
  return user.username?.charAt(0).toUpperCase() || 'U'
}

// 计算封禁剩余时间
const getBanRemainingTime = (banExpiration: string) => {
  if (!banExpiration) return '永久封禁'
  
  const expirationDate = new Date(banExpiration)
  const now = new Date()
  const diff = expirationDate.getTime() - now.getTime()
  
  if (diff <= 0) return '已过期'
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  if (days > 0) {
    return `${days}天${hours}小时`
  } else if (hours > 0) {
    return `${hours}小时${minutes}分钟`
  } else {
    return `${minutes}分钟`
  }
}

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(totalUsers.value / pageSize.value)
})

// 生成页码数组
const pageNumbers = computed(() => {
  const pages = []
  const maxPage = totalPages.value
  const current = currentPage.value
  
  let start = Math.max(1, current - 2)
  let end = Math.min(maxPage, current + 2)
  
  if (end - start < 4) {
    if (start === 1) {
      end = Math.min(maxPage, start + 4)
    } else {
      start = Math.max(1, end - 4)
    }
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// 打开解封确认对话框
const openUnbanDialog = (user: User) => {
  unbanUserInfo.value = user
  showUnbanDialog.value = true
}

// 关闭解封确认对话框
const closeUnbanDialog = () => {
  showUnbanDialog.value = false
  unbanUserInfo.value = null
}

// 刷新单个用户数据
const refreshUser = async (userId: string) => {
  try {
    const response = await request.get(`/user/info/${userId}`)
    if (response.data && response.data.code === 200) {
      const updatedUser = response.data.data
      // 更新本地用户数据
      const userIndex = users.value.findIndex(u => u.id === userId)
      if (userIndex !== -1) {
        users.value[userIndex] = {
          ...users.value[userIndex],
          ...updatedUser
        }
        toast.success('用户信息已更新')
      }
    }
  } catch (error) {
    console.error('刷新用户信息失败:', error)
    toast.error('刷新用户信息失败', {
      description: '请检查网络连接'
    })
  }
}

// 刷新所有用户数据
const refreshAllUsers = async () => {
  await fetchUsers()
  toast.success('用户列表已刷新')
}

// 打开编辑用户对话框
const openEditDialog = (user: User) => {
  // 只拷贝允许编辑的字段
  editUser.value = {
    ...user,
    // 防止直接修改原数据
  }
  showEditDialog.value = true
}

// 关闭编辑用户对话框
const closeEditDialog = () => {
  showEditDialog.value = false
  editUser.value = null
}

// 提交编辑用户信息
const submitEditUser = async () => {
  if (!editUser.value) return
  editLoading.value = true
  try {
    const payload = {
      username: String(editUser.value.username || ''),
      email: String(editUser.value.email || ''),
      avatar: String(editUser.value.avatar || ''),
      is_admin: !!editUser.value.is_admin,
      qq_num: editUser.value.qq_num ? String(editUser.value.qq_num) : '',
      email_verified: !!editUser.value.email_verified,
    }
    const { data } = await request.post('/user/admin/update', payload)
    if (data.code === 200) {
      toast.success('用户信息已更新')
      closeEditDialog()
      fetchUsers()
    } else {
      toast.error('更新失败', { description: data.message })
    }
  } catch (e: any) {
    toast.error('请求异常', { description: e?.response?.data?.message || '未知错误' })
  } finally {
    editLoading.value = false
  }
}

function openCreateDialog() {
  createUser.value = { username: '', email: '', password: '', qq_num: '' }
  showCreateDialog.value = true
}

function closeCreateDialog() {
  showCreateDialog.value = false
}

async function submitCreateUser() {
  createLoading.value = true
  try {
    const { data } = await request.post('/user/register', {
      username: createUser.value.username,
      email: createUser.value.email,
      password: createUser.value.password,
      qq_num: createUser.value.qq_num,
    })
    if (data.code === 200) {
      toast.success('用户创建成功')
      closeCreateDialog()
      fetchUsers()
    } else {
      toast.error('创建失败', { description: data.message })
    }
  } catch (e: any) {
    toast.error('请求异常', { description: e?.response?.data?.message || '未知错误' })
  } finally {
    createLoading.value = false
  }
}

function openDeleteDialog(user: User) {
  deleteUserInfo.value = user
  showDeleteDialog.value = true
}

function closeDeleteDialog() {
  showDeleteDialog.value = false
  deleteUserInfo.value = null
}

async function submitDeleteUser() {
  if (!deleteUserInfo.value) return
  deleteLoading.value = true
  try {
    const { data } = await request.post('/user/delete', { userId: deleteUserInfo.value.id })
    if (data.code === 200) {
      toast.success('用户已删除')
      closeDeleteDialog()
      fetchUsers()
    } else {
      toast.error('删除失败', { description: data.message })
    }
  } catch (e: any) {
    toast.error('请求异常', { description: e?.response?.data?.message || '未知错误' })
  } finally {
    deleteLoading.value = false
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<template>
  <SidebarInset>
    <div class="flex flex-1 flex-col gap-6 p-8">
      <div class="flex items-center gap-2">
        <Users class="h-6 w-6" />
        <h1 class="text-2xl font-bold">用户管理</h1>
      </div>

      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">总用户数</CardTitle>
            <Users class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{{ totalUsers }}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">管理员</CardTitle>
            <Shield class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{{ users.filter(u => u.is_admin).length }}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">已封禁</CardTitle>
            <Ban class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{{ users.filter(u => u.is_banned).length }}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">活跃用户</CardTitle>
            <UserCheck class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{{ users.filter(u => !u.is_banned).length }}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle>用户列表</CardTitle>
              <CardDescription>管理系统中的所有用户账户</CardDescription>
            </div>
            <div class="flex items-center gap-2">
              <Button variant="default" @click="openCreateDialog">
                创建用户
              </Button>
              <Button
                variant="outline"
                size="sm"
                @click="refreshAllUsers"
                :disabled="loading"
                title="刷新用户列表"
              >
                <RefreshCw class="h-4 w-4 mr-2" :class="{ 'animate-spin': loading }" />
                刷新列表
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div class="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>用户</TableHead>
                  <TableHead>邮箱</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>注册时间</TableHead>
                  <TableHead>最后登录</TableHead>
                  <TableHead class="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-if="loading">
                  <TableCell colspan="6" class="text-center py-8">
                    <div class="flex items-center justify-center gap-2">
                      <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      加载中...
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow v-else-if="users.length === 0">
                  <TableCell colspan="6" class="text-center py-8 text-muted-foreground">
                    暂无用户数据
                  </TableCell>
                </TableRow>
                <TableRow v-else v-for="user in users" :key="user.id">
                  <TableCell>
                    <div class="flex items-center gap-3">
                      <Avatar class="h-8 w-8">
                        <AvatarImage :src="getUserAvatar(user)" />
                        <AvatarFallback>{{ getUserInitials(user) }}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div class="font-medium">{{ user.username }}</div>
                        <div class="text-sm text-muted-foreground">ID: {{ user.id }}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{{ user.email }}</TableCell>
                  <TableCell>
                    <div class="flex flex-wrap gap-1">
                      <Badge v-if="user.is_admin" variant="default">管理员</Badge>
                      <Badge v-if="user.is_banned" variant="destructive">已封禁</Badge>
                      <Badge v-if="!user.is_banned && !user.is_admin" variant="secondary">普通用户</Badge>
                    </div>
                  </TableCell>
                  <TableCell>{{ formatDate(user.created_at) }}</TableCell>
                  <TableCell>{{ formatDate(user.last_login || '') }}</TableCell>
                  <TableCell class="text-right">
                    <div class="flex items-center justify-end gap-2">
                      <Button
                        v-if="!user.is_banned"
                        size="sm"
                        variant="destructive"
                        @click="toggleBanStatus(user.id, user.is_banned, user)"
                      >
                        <Ban class="h-4 w-4" />
                        封禁
                      </Button>
                      <div v-else class="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          title="查看封禁详情"
                          @click="setSelectedUserForDetails(user); showBanReasonSheet = true"
                        >
                          <Info class="h-4 w-4" />
                          封禁原因
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          @click="toggleBanStatus(user.id, user.is_banned, user)"
                        >
                          <UserCheck class="h-4 w-4" />
                          解封
                        </Button>
                      </div>
                      <Button
                        v-if="!user.is_admin"
                        size="sm"
                        variant="destructive"
                        @click="openDeleteDialog(user)"
                      >
                        删除
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        @click="openEditDialog(user)"
                      >
                        编辑
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          
          <!-- 分页控件 -->
          <div v-if="totalPages > 1" class="flex items-center justify-between px-2 py-4">
            <div class="text-sm text-muted-foreground">
              显示第 {{ (currentPage - 1) * pageSize + 1 }} 到 {{ Math.min(currentPage * pageSize, totalUsers) }} 条，共 {{ totalUsers }} 条
            </div>
            <div class="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                :disabled="currentPage === 1"
                @click="prevPage"
              >
                <ChevronLeft class="h-4 w-4" />
                上一页
              </Button>
              
              <div class="flex items-center space-x-1">
                <Button
                  v-for="page in pageNumbers"
                  :key="page"
                  variant="outline"
                  size="sm"
                  :class="{ 'bg-primary text-primary-foreground': page === currentPage }"
                  @click="goToPage(page)"
                >
                  {{ page }}
                </Button>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                :disabled="currentPage === totalPages"
                @click="nextPage"
              >
                下一页
                <ChevronRight class="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </SidebarInset>

  <!-- 封禁对话框 -->
  <AlertDialog :open="showBanDialog" @update:open="showBanDialog = $event">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>封禁用户</AlertDialogTitle>
        <AlertDialogDescription>
          请填写封禁原因和封禁天数
        </AlertDialogDescription>
      </AlertDialogHeader>
      
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="reason" class="text-right">
            封禁原因
          </Label>
          <Input
            id="reason"
            v-model="banReason"
            placeholder="请输入封禁原因"
            class="col-span-3"
          />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="duration" class="text-right">
            封禁天数
          </Label>
          <Input
            id="duration"
            v-model="banDuration"
            type="number"
            min="1"
            max="365"
            placeholder="7"
            class="col-span-3"
          />
        </div>
      </div>
      
      <AlertDialogFooter>
        <AlertDialogCancel @click="closeBanDialog">取消</AlertDialogCancel>
        <AlertDialogAction @click="banUser">确认封禁</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>

  <!-- 解封确认对话框 -->
  <AlertDialog :open="showUnbanDialog" @update:open="showUnbanDialog = $event">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>确认解封用户</AlertDialogTitle>
        <AlertDialogDescription>
          您确定要解封该用户吗？解封后用户将可以正常使用系统。
        </AlertDialogDescription>
      </AlertDialogHeader>
      
      <div v-if="unbanUserInfo" class="space-y-4 py-4">
        <!-- 用户信息 -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <User class="h-5 w-5" />
              用户信息
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="flex items-center gap-3">
              <Avatar class="h-8 w-8">
                <AvatarImage :src="getUserAvatar(unbanUserInfo)" />
                <AvatarFallback>{{ getUserInitials(unbanUserInfo) }}</AvatarFallback>
              </Avatar>
              <div>
                <div class="font-medium">{{ unbanUserInfo.username }}</div>
                <div class="text-sm text-muted-foreground">{{ unbanUserInfo.email }}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <!-- 封禁信息 -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <Shield class="h-5 w-5" />
              封禁信息
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-3">
            <div class="bg-red-50 rounded-lg p-3 border border-red-200">
              <h4 class="font-semibold text-red-800 mb-1">封禁原因</h4>
              <p class="text-red-700 text-sm">{{ unbanUserInfo.ban_reason || '未提供封禁原因' }}</p>
            </div>
            
            <div class="bg-orange-50 rounded-lg p-3 border border-orange-200">
              <h4 class="font-semibold text-orange-800 mb-1">封禁时间</h4>
              <p class="text-orange-700 text-sm">
                {{ unbanUserInfo.ban_expiration ? formatDate(unbanUserInfo.ban_expiration) : '未设置解封时间' }}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <AlertDialogFooter>
        <AlertDialogCancel @click="closeUnbanDialog">取消</AlertDialogCancel>
        <AlertDialogAction @click="unbanUser" class="bg-green-600 hover:bg-green-700">
          确认解封
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>

  <!-- 封禁原因抽屉 -->
  <Drawer :open="showBanReasonSheet" @update:open="showBanReasonSheet = $event">
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>封禁详情</DrawerTitle>
        <DrawerDescription>
          查看用户的封禁信息和账户详情
        </DrawerDescription>
      </DrawerHeader>
      
      <div v-if="selectedUserForDetails" class="space-y-6 px-4 max-h-[80vh] overflow-y-auto">
        <!-- 用户基本信息 -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <User class="h-5 w-5" />
              用户信息
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="flex items-center gap-4">
              <Avatar class="h-12 w-12">
                <AvatarImage :src="getUserAvatar(selectedUserForDetails)" />
                <AvatarFallback>{{ getUserInitials(selectedUserForDetails) }}</AvatarFallback>
              </Avatar>
              <div class="flex-1">
                <div class="font-medium text-lg">{{ selectedUserForDetails.username }}</div>
                <div class="text-sm text-muted-foreground">{{ selectedUserForDetails.email }}</div>
                <div class="text-xs text-muted-foreground">ID: {{ selectedUserForDetails.id }}</div>
              </div>
              <div class="text-right">
                <Badge v-if="selectedUserForDetails.is_admin" variant="default">管理员</Badge>
                <Badge v-else variant="secondary">普通用户</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- 封禁信息 -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <Shield class="h-5 w-5" />
              封禁信息
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <!-- 封禁原因 -->
            <div class="space-y-2">
              <Label class="text-sm font-medium">封禁原因</Label>
              <div class="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p class="text-red-800 text-sm">
                  {{ selectedUserForDetails.ban_reason || '未提供封禁原因' }}
                </p>
              </div>
            </div>

            <!-- 封禁时间 -->
            <div class="space-y-2">
              <Label class="text-sm font-medium">封禁结束时间</Label>
              <div class="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p class="text-orange-800 text-sm">
                  {{ selectedUserForDetails.ban_expiration ? formatDate(selectedUserForDetails.ban_expiration) : '永久封禁' }}
                </p>
              </div>
            </div>

            <!-- 剩余时间 -->
            <div class="space-y-2">
              <Label class="text-sm font-medium">剩余封禁时间</Label>
              <div class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p class="text-blue-800 text-sm font-medium">
                  {{ getBanRemainingTime(selectedUserForDetails.ban_expiration || '') }}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- 账户详情 -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <Info class="h-5 w-5" />
              账户详情
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label class="text-sm font-medium">注册时间</Label>
                <div class="p-2 bg-muted rounded text-sm">
                  {{ formatDate(selectedUserForDetails.created_at) }}
                </div>
              </div>
              
              <div class="space-y-2">
                <Label class="text-sm font-medium">最后登录</Label>
                <div class="p-2 bg-muted rounded text-sm">
                  {{ formatDate(selectedUserForDetails.last_login || '') }}
                </div>
              </div>
              
              <div class="space-y-2">
                <Label class="text-sm font-medium">QQ号码</Label>
                <div class="p-2 bg-muted rounded text-sm">
                  {{ selectedUserForDetails.qq_num || '未设置' }}
                </div>
              </div>
              
              <div class="space-y-2">
                <Label class="text-sm font-medium">账户状态</Label>
                <div class="p-2 bg-muted rounded text-sm">
                  <Badge v-if="selectedUserForDetails.is_banned" variant="destructive">已封禁</Badge>
                  <Badge v-else variant="secondary">正常</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <DrawerFooter>
        <Button
          variant="outline"
          @click="() => { 
            if (selectedUserForDetails) {
              showBanReasonSheet = false;
              toggleBanStatus(selectedUserForDetails.id, selectedUserForDetails.is_banned, selectedUserForDetails); 
            }
          }"
          class="w-full"
        >
          <UserCheck class="h-4 w-4 mr-2" />
          解封用户
        </Button>
        <DrawerClose asChild>
          <Button variant="outline" class="w-full">
            关闭
          </Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>

  <!-- 编辑用户信息对话框 -->
  <AlertDialog :open="showEditDialog" @update:open="showEditDialog = $event">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>编辑用户信息</AlertDialogTitle>
        <AlertDialogDescription>管理员可编辑部分用户信息</AlertDialogDescription>
      </AlertDialogHeader>
      <form v-if="editUser" @submit.prevent="submitEditUser" class="space-y-4 py-2">
        <div>
          <Label>用户名</Label>
          <Input v-model="editUser.username" disabled />
        </div>
        <div>
          <Label>邮箱</Label>
          <Input v-model="editUser.email" type="email" required />
        </div>
        <div>
          <Label>QQ号</Label>
          <Input v-model="editUser.qq_num" />
        </div>
        <div>
          <Label>头像链接</Label>
          <Input v-model="editUser.avatar" />
        </div>
        <div class="flex items-center gap-2">
          <input type="checkbox" id="email_verified" v-model="editUser.email_verified" />
          <Label for="email_verified">邮箱已验证</Label>
        </div>
        <div class="flex items-center gap-2">
          <input type="checkbox" id="is_admin" v-model="editUser.is_admin" />
          <Label for="is_admin">管理员</Label>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel @click="closeEditDialog">取消</AlertDialogCancel>
          <AlertDialogAction :disabled="editLoading" type="submit">
            {{ editLoading ? '保存中...' : '保存' }}
          </AlertDialogAction>
        </AlertDialogFooter>
      </form>
    </AlertDialogContent>
  </AlertDialog>

  <!-- 创建用户对话框 -->
  <AlertDialog :open="showCreateDialog" @update:open="showCreateDialog = $event">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>创建新用户</AlertDialogTitle>
        <AlertDialogDescription>请填写新用户信息</AlertDialogDescription>
      </AlertDialogHeader>
      <form @submit.prevent="submitCreateUser" class="space-y-4 py-2">
        <div>
          <Label>用户名</Label>
          <Input v-model="createUser.username" required />
        </div>
        <div>
          <Label>邮箱</Label>
          <Input v-model="createUser.email" type="email" required />
        </div>
        <div>
          <Label>密码</Label>
          <Input v-model="createUser.password" type="password" required />
        </div>
        <div>
          <Label>QQ号</Label>
          <Input v-model="createUser.qq_num" />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel @click="closeCreateDialog">取消</AlertDialogCancel>
          <AlertDialogAction :disabled="createLoading" type="submit">
            {{ createLoading ? '创建中...' : '创建' }}
          </AlertDialogAction>
        </AlertDialogFooter>
      </form>
    </AlertDialogContent>
  </AlertDialog>

  <!-- 删除用户确认对话框 -->
  <AlertDialog :open="showDeleteDialog" @update:open="showDeleteDialog = $event">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>确认删除用户</AlertDialogTitle>
        <AlertDialogDescription>此操作不可撤销，确定要删除该用户吗？</AlertDialogDescription>
      </AlertDialogHeader>
      <div v-if="deleteUserInfo" class="space-y-2 py-2">
        <div class="font-medium">{{ deleteUserInfo.username }}</div>
        <div class="text-sm text-muted-foreground">{{ deleteUserInfo.email }}</div>
      </div>
      <AlertDialogFooter>
        <AlertDialogCancel @click="closeDeleteDialog">取消</AlertDialogCancel>
        <AlertDialogAction :disabled="deleteLoading" @click="submitDeleteUser">
          {{ deleteLoading ? '删除中...' : '确认删除' }}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template> 