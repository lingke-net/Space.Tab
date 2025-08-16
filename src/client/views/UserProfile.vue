<script setup lang="ts">
import { SidebarInset } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { useUserStore } from '@/store/user'
import { ref, computed } from 'vue'
import { AlertCircle, Loader2 } from 'lucide-vue-next'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import request from '@/lib/axiosConfig'
import { toast } from 'vue-sonner'

const userStore = useUserStore()

const userInfo = ref({
  username: userStore.userInfo?.username || '',
  email: userStore.userInfo?.email || '',
  avatar: userStore.userInfo?.avatar || '',
  qq_num: userStore.userInfo?.qq_num || '',
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const isEditing = ref(false)
const isUpdating = ref(false)
const isChangingPassword = ref(false)
const profileError = ref('')
const passwordError = ref('')
const showConfirmDialog = ref(false)

const handleSaveProfile = async () => {
  console.log('📝 Profile update attempt:', { 
    email: userInfo.value.email, 
    qq_num: userInfo.value.qq_num 
  })
  
  if (!userInfo.value.username.trim() || !userInfo.value.email.trim()) {
    profileError.value = '用户名和邮箱不能为空'
    console.warn('⚠️ 用户名和邮箱不能为空')
    return
  }

  // 验证邮箱格式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(userInfo.value.email)) {
    profileError.value = '请输入有效的邮箱地址'
    console.warn('⚠️ 请输入有效的邮箱地址')
    return
  }

  console.log('✅ 用户信息验证通过, 显示确认对话框')
  // 显示确认对话框
  showConfirmDialog.value = true
}

const confirmSaveProfile = async () => {
  isUpdating.value = true
  profileError.value = ''
  showConfirmDialog.value = false

  console.log('🔄 更新用户信息...')

  try {
    const response = await request.post('/user/update', {
      email: userInfo.value.email.trim(),
      qq_num: userInfo.value.qq_num.trim()
    })

    console.log('✅ 用户信息更新响应:', { code: response.data.code, message: response.data.message })

    if (response.data && response.data.code === 200) {
      console.log('🎉 用户信息更新成功')
      toast.success('用户信息更新成功', {
        description: '您的个人信息已成功更新',
        duration: 3000,
      })
      // 更新 store 中的用户信息
      userStore.userInfo.email = userInfo.value.email
      userStore.userInfo.qq_num = userInfo.value.qq_num
      // 更新 cookie
      userStore.setUser(userStore.token, userStore.userId, userStore.userInfo)
      
      // 重新获取用户信息以确保数据同步
      await userStore.getUserInfo()
      
      isEditing.value = false
    } else {
      console.error('❌ 用户信息更新失败:', response.data)
      profileError.value = response.data?.message || '更新失败'
      toast.error('更新失败', {
        description: response.data?.message || '请稍后重试'
      })
    }
  } catch (error: any) {
    console.error('❌ 用户信息更新异常:', error)
    const errorMessage = error.data?.message || '网络错误，请稍后重试'
    profileError.value = errorMessage
    toast.error('更新失败', {
      description: errorMessage
    })
  } finally {
    isUpdating.value = false
  }
}

const handleChangePassword = async () => {
  console.log('🔐 密码修改尝试')
  
  if (!passwordForm.value.currentPassword || !passwordForm.value.newPassword || !passwordForm.value.confirmPassword) {
    passwordError.value = '请填写所有密码字段'
    console.warn('⚠️ 请填写所有密码字段')
    return
  }

  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordError.value = '新密码与确认密码不匹配'
    console.warn('⚠️ 密码验证失败: 密码不匹配')
    return
  }

  if (passwordForm.value.newPassword.length < 6) {
    passwordError.value = '新密码长度至少为6位'
    console.warn('⚠️ 密码验证失败: 密码太短')
    return
  }

  console.log('✅ 密码验证通过')
  isChangingPassword.value = true
  passwordError.value = ''

  try {
    console.log('🔄 修改密码...')
    const response = await request.post('/user/update/password', {
      oldPw: passwordForm.value.currentPassword,
      newPw: passwordForm.value.newPassword
    })

    console.log('✅ 密码修改响应:', { code: response.data.code, message: response.data.message })

    if (response.data && response.data.code === 200) {
      console.log('🎉 密码修改成功')
      toast.success('密码修改成功', {
        description: '您的密码已成功更新',
        duration: 3000,
      })
      passwordForm.value = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }
    } else {
      console.error('❌ 密码修改失败:', response.data)
      passwordError.value = response.data?.message || '密码修改失败'
      toast.error('密码修改失败', {
        description: response.data?.message || '请稍后重试'
      })
    }
  } catch (error: any) {
    console.error('❌ 密码修改异常:', error)
    const errorMessage = error.data?.message || '网络错误，请稍后重试'
    passwordError.value = errorMessage
    toast.error('密码修改失败', {
      description: errorMessage
    })
  } finally {
    isChangingPassword.value = false
  }
}

const cancelEdit = () => {
  // 重置为原始值
  userInfo.value = {
    username: userStore.userInfo?.username || '',
    email: userStore.userInfo?.email || '',
    avatar: userStore.userInfo?.avatar || '',
    qq_num: userStore.userInfo?.qq_num || '',
  }
  profileError.value = ''
  isEditing.value = false
}

// 计算QQ头像URL
const userAvatar = computed(() => {
  if (userInfo.value.qq_num && userInfo.value.qq_num.trim()) {
    // 优先使用QQ头像
    const qqNum = userInfo.value.qq_num.trim()
    const avatarUrl = `https://q1.qlogo.cn/g?b=qq&nk=${qqNum}&s=200`
    console.log('QQ头像URL:', avatarUrl)
    return avatarUrl
  }
  // 如果没有QQ号，返回空字符串让AvatarFallback显示用户名首字母
  return ''
})

const userInitials = computed(() => {
  return userStore.userInfo?.username?.charAt(0).toUpperCase() || 'U'
})
</script>

<template>
  <SidebarInset v-if="userStore.userInfo.is_admin">
    <div class="flex flex-1 flex-col gap-6 p-8">
      <div class="space-y-2">
        <h2 class="text-3xl font-bold tracking-tight">用户设置</h2>
        <p class="text-muted-foreground">
          管理您的账户信息和偏好设置
        </p>
      </div>
      
      <div class="grid gap-6">
        <!-- 基本信息卡片 -->
        <Card>
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
            <CardDescription>
              更新您的个人信息和头像
            </CardDescription>
          </CardHeader>
          
          <CardContent class="space-y-6">
            <!-- 错误提示 -->
            <Alert v-if="profileError" variant="destructive">
              <AlertCircle class="w-4 h-4" />
              <AlertTitle>错误</AlertTitle>
              <AlertDescription>{{ profileError }}</AlertDescription>
            </Alert>

            <div class="flex items-center space-x-4">
              <Avatar class="h-20 w-20">
                <AvatarImage :src="userAvatar" @error="() => console.log('QQ头像加载失败，使用回退头像')" />
                <AvatarFallback>{{ userInitials }}</AvatarFallback>
              </Avatar>
              <div class="space-y-2">
                <Button variant="outline" size="sm" disabled>更换头像</Button>
                <p class="text-sm text-muted-foreground">
                  <span v-if="userInfo.qq_num">头像将自动获取QQ头像的图片</span>
                  <span v-else>填写QQ号后，头像将自动使用QQ头像</span>
                </p>
              </div>
            </div>

            <Separator />

            <div class="grid gap-4 md:grid-cols-2">
              <div class="space-y-2">
                <Label for="username">用户名</Label>
                <Input
                  id="username"
                  v-model="userInfo.username"
                  :disabled="true"
                  placeholder="用户名不可修改"
                />
              </div>
              <div class="space-y-2">
                <Label for="email">邮箱</Label>
                <Input
                  id="email"
                  v-model="userInfo.email"
                  type="email"
                  :disabled="!isEditing || isUpdating"
                  placeholder="请输入邮箱"
                />
              </div>
              <div class="space-y-2">
                <Label for="qq_num">QQ号</Label>
                <Input
                  id="qq_num"
                  v-model="userInfo.qq_num"
                  type="text"
                  :disabled="!isEditing || isUpdating"
                  placeholder="请输入QQ号（可选）"
                />
                <p class="text-xs text-muted-foreground">
                  填写QQ号后，头像将自动使用QQ头像
                </p>
              </div>
            </div>

            <div class="flex justify-end space-x-2">
              <Button
                v-if="!isEditing"
                @click="isEditing = true"
                variant="outline"
                :disabled="isUpdating"
              >
                编辑信息
              </Button>
              <template v-else>
                <Button
                  @click="cancelEdit"
                  variant="outline"
                  :disabled="isUpdating"
                >
                  取消
                </Button>
                <Button @click="handleSaveProfile" :disabled="isUpdating">
                  <Loader2 v-if="isUpdating" class="w-4 h-4 mr-2 animate-spin" />
                  {{ isUpdating ? '保存中...' : '保存' }}
                </Button>
              </template>
            </div>
          </CardContent>
        </Card>

        <!-- 密码修改卡片 -->
        <Card>
          <CardHeader>
            <CardTitle>修改密码</CardTitle>
            <CardDescription>
              定期更新密码以确保账户安全
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <!-- 错误提示 -->
            <Alert v-if="passwordError" variant="destructive">
              <AlertCircle class="w-4 h-4" />
              <AlertTitle>错误</AlertTitle>
              <AlertDescription>{{ passwordError }}</AlertDescription>
            </Alert>

            <div class="space-y-2">
              <Label for="currentPassword">当前密码</Label>
              <Input
                id="currentPassword"
                v-model="passwordForm.currentPassword"
                type="password"
                :disabled="isChangingPassword"
                placeholder="请输入当前密码"
              />
            </div>
            <div class="space-y-2">
              <Label for="newPassword">新密码</Label>
              <Input
                id="newPassword"
                v-model="passwordForm.newPassword"
                type="password"
                :disabled="isChangingPassword"
                placeholder="请输入新密码"
              />
            </div>
            <div class="space-y-2">
              <Label for="confirmPassword">确认新密码</Label>
              <Input
                id="confirmPassword"
                v-model="passwordForm.confirmPassword"
                type="password"
                :disabled="isChangingPassword"
                placeholder="请再次输入新密码"
              />
            </div>
            <div class="flex justify-end">
              <Button @click="handleChangePassword" :disabled="isChangingPassword">
                <Loader2 v-if="isChangingPassword" class="w-4 h-4 mr-2 animate-spin" />
                {{ isChangingPassword ? '修改中...' : '修改密码' }}
              </Button>
            </div>
          </CardContent>
        </Card>

        <!-- 确认对话框 -->
        <AlertDialog v-model:open="showConfirmDialog">
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>确认修改</AlertDialogTitle>
              <AlertDialogDescription>
                您确定要更新以下信息吗？
                <div class="mt-2 space-y-1 text-sm">
                  <div>邮箱: {{ userInfo.email }}</div>
                  <div v-if="userInfo.qq_num">QQ号: {{ userInfo.qq_num }}</div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction @click="confirmSaveProfile">
                确认修改
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  </SidebarInset>
  <div v-else>
    <div class="flex flex-1 flex-col gap-6 p-8">
      <div class="space-y-2">
        <h2 class="text-3xl font-bold tracking-tight">用户设置</h2>
        <p class="text-muted-foreground">
          管理您的账户信息和偏好设置
        </p>
      </div>
      
      <div class="grid gap-6">
        <!-- 基本信息卡片 -->
        <Card>
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
            <CardDescription>
              更新您的个人信息和头像
            </CardDescription>
          </CardHeader>
          
          <CardContent class="space-y-6">
            <!-- 错误提示 -->
            <Alert v-if="profileError" variant="destructive">
              <AlertCircle class="w-4 h-4" />
              <AlertTitle>错误</AlertTitle>
              <AlertDescription>{{ profileError }}</AlertDescription>
            </Alert>

            <div class="flex items-center space-x-4">
              <Avatar class="h-20 w-20">
                <AvatarImage :src="userAvatar" @error="() => console.log('QQ头像加载失败，使用回退头像')" />
                <AvatarFallback>{{ userInitials }}</AvatarFallback>
              </Avatar>
              <div class="space-y-2">
                <Button variant="outline" size="sm" disabled>更换头像</Button>
                <p class="text-sm text-muted-foreground">
                  <span v-if="userInfo.qq_num">头像将自动获取QQ头像的图片</span>
                  <span v-else>填写QQ号后，头像将自动使用QQ头像</span>
                </p>
              </div>
            </div>

            <Separator />

            <div class="grid gap-4 md:grid-cols-2">
              <div class="space-y-2">
                <Label for="username">用户名</Label>
                <Input
                  id="username"
                  v-model="userInfo.username"
                  :disabled="true"
                  placeholder="用户名不可修改"
                />
              </div>
              <div class="space-y-2">
                <Label for="email">邮箱</Label>
                <Input
                  id="email"
                  v-model="userInfo.email"
                  type="email"
                  :disabled="!isEditing || isUpdating"
                  placeholder="请输入邮箱"
                />
              </div>
              <div class="space-y-2">
                <Label for="qq_num">QQ号</Label>
                <Input
                  id="qq_num"
                  v-model="userInfo.qq_num"
                  type="text"
                  :disabled="!isEditing || isUpdating"
                  placeholder="请输入QQ号（可选）"
                />
                <p class="text-xs text-muted-foreground">
                  填写QQ号后，头像将自动使用QQ头像
                </p>
              </div>
            </div>

            <div class="flex justify-end space-x-2">
              <Button
                v-if="!isEditing"
                @click="isEditing = true"
                variant="outline"
                :disabled="isUpdating"
              >
                编辑信息
              </Button>
              <template v-else>
                <Button
                  @click="cancelEdit"
                  variant="outline"
                  :disabled="isUpdating"
                >
                  取消
                </Button>
                <Button @click="handleSaveProfile" :disabled="isUpdating">
                  <Loader2 v-if="isUpdating" class="w-4 h-4 mr-2 animate-spin" />
                  {{ isUpdating ? '保存中...' : '保存' }}
                </Button>
              </template>
            </div>
          </CardContent>
        </Card>

        <!-- 密码修改卡片 -->
        <Card>
          <CardHeader>
            <CardTitle>修改密码</CardTitle>
            <CardDescription>
              定期更新密码以确保账户安全
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <!-- 错误提示 -->
            <Alert v-if="passwordError" variant="destructive">
              <AlertCircle class="w-4 h-4" />
              <AlertTitle>错误</AlertTitle>
              <AlertDescription>{{ passwordError }}</AlertDescription>
            </Alert>

            <div class="space-y-2">
              <Label for="currentPassword">当前密码</Label>
              <Input
                id="currentPassword"
                v-model="passwordForm.currentPassword"
                type="password"
                :disabled="isChangingPassword"
                placeholder="请输入当前密码"
              />
            </div>
            <div class="space-y-2">
              <Label for="newPassword">新密码</Label>
              <Input
                id="newPassword"
                v-model="passwordForm.newPassword"
                type="password"
                :disabled="isChangingPassword"
                placeholder="请输入新密码"
              />
            </div>
            <div class="space-y-2">
              <Label for="confirmPassword">确认新密码</Label>
              <Input
                id="confirmPassword"
                v-model="passwordForm.confirmPassword"
                type="password"
                :disabled="isChangingPassword"
                placeholder="请再次输入新密码"
              />
            </div>
            <div class="flex justify-end">
              <Button @click="handleChangePassword" :disabled="isChangingPassword">
                <Loader2 v-if="isChangingPassword" class="w-4 h-4 mr-2 animate-spin" />
                {{ isChangingPassword ? '修改中...' : '修改密码' }}
              </Button>
            </div>
          </CardContent>
        </Card>

        <!-- 确认对话框 -->
        <AlertDialog v-model:open="showConfirmDialog">
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>确认修改</AlertDialogTitle>
              <AlertDialogDescription>
                您确定要更新以下信息吗？
                <div class="mt-2 space-y-1 text-sm">
                  <div>邮箱: {{ userInfo.email }}</div>
                  <div v-if="userInfo.qq_num">QQ号: {{ userInfo.qq_num }}</div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction @click="confirmSaveProfile">
                确认修改
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  </div>
</template> 