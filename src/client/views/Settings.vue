<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { useThemeStore } from '@/store/theme'
import AppHeader from '@/components/AppHeader.vue'
import WallpaperSettings from '@/components/WallpaperSettings.vue'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertCircle, Loader2, Download, Upload, RefreshCw, Sun, Moon, Monitor, MapPin, Map } from 'lucide-vue-next'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { toast } from 'vue-sonner'
import Cookies from 'js-cookie'
import VersionAvatar from '@/components/VersionAvatar.vue'

// 安全的localStorage访问方法
const safeLocalStorage = {
  getItem(key: string, defaultValue: any = null): any {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(key) || defaultValue;
    }
    return defaultValue;
  },
  setItem(key: string, value: any): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, value);
    }
  },
  removeItem(key: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(key);
    }
  }
};

const userStore = useUserStore()
const themeStore = useThemeStore()
const router = useRouter()
const isLoggedIn = computed(() => !!userStore.token)
const canEditProfile = computed(() => !!userStore.token)
const showPasswordDialog = ref(false)
const betamode = 'beta'

const userInfo = ref({
  username: userStore.userInfo?.username || '',
  email: userStore.userInfo?.email || '',
  avatar: userStore.userInfo?.avatar || '',
  qq_num: userStore.userInfo?.qq_num || '',
})

const isAdmin = computed(() => {
  return userStore.userInfo?.is_admin || false
})
// 从Cookie中获取天气设置
const getWeatherSettings = (): { enabled: boolean, unit: string, showHumidity: boolean, showWind: boolean } => {
  const settings = Cookies.get('weatherSettings')
  if (settings) {
    try {
      const parsedSettings = JSON.parse(settings)
      return parsedSettings
    } catch (error) {
      console.error('解析天气设置失败:', error)
    }
  }
  // 默认设置
  return {
    enabled: true,
    unit: 'celsius', // 摄氏度
    showHumidity: true,
    showWind: true
  }
}

// 保存天气设置到Cookie
const saveWeatherSettings = (settings: { enabled: boolean, unit: string, showHumidity: boolean, showWind: boolean }): void => {
  Cookies.set('weatherSettings', JSON.stringify(settings), { expires: 365 }) // 一年有效期
}

// 天气设置
const weatherSettings = ref({
  ...getWeatherSettings(),
  showCitySelector: false,
  selectedCity: safeLocalStorage.getItem('manualCity', '') || '',
  commonCities: [
    { name: '北京', adcode: '110100' }, 
    { name: '上海', adcode: '310100' }, 
    { name: '广州', adcode: '440100' }, 
    { name: '深圳', adcode: '440300' }, 
    { name: '杭州', adcode: '330100' }, 
    { name: '成都', adcode: '510100' }, 
    { name: '武汉', adcode: '420100' }, 
    { name: '西安', adcode: '610100' }, 
    { name: '南京', adcode: '320100' }, 
    { name: '重庆', adcode: '500100' },
    { name: '天津', adcode: '120100' },
    { name: '苏州', adcode: '320500' },
    { name: '厦门', adcode: '350200' },
    { name: '青岛', adcode: '370200' },
    { name: '大连', adcode: '210200' }
  ]
})

// 个性化设置
const themeMode = computed({
  get: () => themeStore.theme,
  set: (value) => themeStore.setTheme(value)
})

// 壁纸设置
const bgType = ref(safeLocalStorage.getItem('bgType', 'none'))
const customBgFile = ref<File | null>(null)
const bgFileInputRef = ref<HTMLInputElement | null>(null)

// 徽章显示设置
const showBadgeInHome = ref(localStorage.getItem('showBadgeInHome') !== 'false')

// 切换徽章显示
const toggleBadgeDisplay = (enabled: boolean) => {
  showBadgeInHome.value = enabled
  localStorage.setItem('showBadgeInHome', enabled.toString())
  
  if (enabled) {
    toast.success('已启用徽章显示', {
      description: '首页将显示PRO徽章'
    })
  } else {
    toast.success('已禁用徽章显示', {
      description: '首页将不再显示PRO徽章'
    })
  }
}

// 数据设置
const showResetConfirm = ref(false)
const isExporting = ref(false)
const isImporting = ref(false)
const isResetting = ref(false)
const importFile = ref<File | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)
const customBgPreview = ref<string | null>(null)

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

// 切换天气功能
const toggleWeatherEnabled = (enabled: boolean) => {
  weatherSettings.value.enabled = enabled
  
  // 保存到Cookie
  const settings = {
    enabled: enabled,
    unit: weatherSettings.value.unit || 'celsius',
    showHumidity: weatherSettings.value.showHumidity !== false,
    showWind: weatherSettings.value.showWind !== false
  }
  
  saveWeatherSettings(settings)
  // 同时保存到localStorage以保持兼容性
  safeLocalStorage.setItem('weatherEnabled', enabled.toString())
  
  if (enabled) {
    toast.success('天气功能已启用', {
      description: '首页将显示天气信息'
    })
  } else {
    toast.success('天气功能已禁用', {
      description: '首页将不再显示天气信息'
    })
  }
}

// 请求位置授权
const requestLocationPermission = () => {
  // 清除之前的位置授权状态
  safeLocalStorage.removeItem('locationAuthorized')
  safeLocalStorage.removeItem('locationMethod')
  
  toast.success('位置授权已重置', {
    description: '下次访问首页时将重新请求位置授权'
  })
}

// 选择城市
const selectCity = (cityName: string, adcode: string) => {
  weatherSettings.value.selectedCity = cityName
  
  // 保存选择的城市
  safeLocalStorage.setItem('manualCity', cityName)
  safeLocalStorage.setItem('manualAdcode', adcode)
  safeLocalStorage.setItem('locationMethod', 'manual')
  toast.success(`已选择城市: ${cityName}`, { description: '首页将显示该城市的天气信息' })
}

// 处理文件选择
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    importFile.value = target.files[0]
  }
}

// 导出数据
const exportData = async () => {
  isExporting.value = true
  try {
    // 收集需要导出的数据 - 只导出设置相关数据，不包含账户信息
    const exportData = {
      userPreferences: {
        theme: themeStore.theme,
        weatherEnabled: weatherSettings.value.enabled
      },
      appSettings: {
        // 应用程序设置
        lastExportDate: new Date().toISOString(),
        version: import.meta.env.VITE_VERSION || '1.0.0',
      }
    }
    
    // 创建JSON文件
    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    
    // 创建下载链接
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `space-tab-settings-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    
    // 清理
    URL.revokeObjectURL(url)
    document.body.removeChild(link)
    
    toast.success('数据导出成功', {
      description: '您的设置数据已成功导出'
    })
  } catch (error) {
    console.error('导出数据失败:', error)
    toast.error('导出失败', {
      description: '导出数据时发生错误'
    })
  } finally {
    isExporting.value = false
  }
}

// 导入数据
const importData = async () => {
  if (!importFile.value) {
    toast.error('请选择文件', {
      description: '请先选择要导入的设置文件'
    })
    return
  }
  
  isImporting.value = true
  try {
    // 读取文件内容
    const fileContent = await importFile.value.text()
    const importedData = JSON.parse(fileContent)
    
    // 验证数据格式
    if (!importedData || !importedData.userPreferences) {
      throw new Error('无效的设置文件格式')
    }
    
    // 应用导入的设置
    if (importedData.userPreferences.theme) {
      themeStore.setTheme(importedData.userPreferences.theme)
    }

    if (importedData.userPreferences.weatherEnabled !== undefined) {
      toggleWeatherEnabled(importedData.userPreferences.weatherEnabled)
    }
    
    // 可以添加更多设置的导入逻辑
    
    toast.success('数据导入成功', {
      description: '您的设置已成功导入并应用'
    })
    
    // 清理
    importFile.value = null
    if (fileInputRef.value) {
      fileInputRef.value.value = ''
    }
  } catch (error) {
    console.error('导入数据失败:', error)
    toast.error('导入失败', {
      description: '导入数据时发生错误，请确保文件格式正确'
    })
  } finally {
    isImporting.value = false
  }
}

// 重置所有设置
const resetAllSettings = () => {
  showResetConfirm.value = true
}

// 确认重置
const confirmReset = async () => {
  isResetting.value = true
  showResetConfirm.value = false
  
  try {
    // 重置天气设置
    const defaultWeatherSettings = {
      enabled: true,
      unit: 'celsius',
      showHumidity: true,
      showWind: true
    }
    
    // 更新本地状态
    weatherSettings.value = {
      ...defaultWeatherSettings,
      showCitySelector: false,
      selectedCity: '',
      commonCities: weatherSettings.value.commonCities
    }
    
    // 保存到Cookie
    saveWeatherSettings(defaultWeatherSettings)
    
    // 重置主题设置
    themeStore.setTheme('auto')
    
    // 重置localStorage中的设置
    safeLocalStorage.removeItem('manualCity')
    safeLocalStorage.removeItem('manualAdcode')
    safeLocalStorage.removeItem('locationMethod')
    safeLocalStorage.setItem('weatherEnabled', 'true')
    
    // 设置setupCompleted为false
    safeLocalStorage.setItem('setupCompleted', 'false')
    
    // 清除所有cookie
    const cookies = Cookies.get()
    for (const cookieName in cookies) {
      Cookies.remove(cookieName)
    }
    
    // 清除用户登录信息
    userStore.$reset()
    
    toast.success('设置已还原并已退出登录', {
      description: '所有设置已恢复为默认值，您已退出登录'
    })
    
    // 延迟跳转到首页
    setTimeout(() => {
      router.push('/')
    }, 1500)
  } catch (error) {
    console.error('重置设置失败:', error)
    toast.error('重置失败', {
      description: '重置设置时发生错误'
    })
  } finally {
    isResetting.value = false
  }
}

// 触发文件选择对话框
const triggerFileInput = () => {
  if (fileInputRef.value) {
    fileInputRef.value.click()
  }
}

// 跳转到登录页面
const goToLogin = () => {
  router.push('/login')
}

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
    // 这里应该是实际的保存逻辑
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('✅ 用户信息更新成功')
    toast.success('用户信息更新成功', {
      description: '您的个人信息已成功更新',
      duration: 3000,
    })
    
    // 更新 store 中的用户信息
    userStore.userInfo.email = userInfo.value.email
    userStore.userInfo.qq_num = userInfo.value.qq_num
    
    isEditing.value = false
  } catch (error) {
    console.error('❌ 用户信息更新异常:', error)
    profileError.value = '网络错误，请稍后重试'
    toast.error('更新失败', {
      description: '网络错误，请稍后重试'
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
    // 这里应该是实际的密码修改逻辑
    await new Promise(resolve => setTimeout(resolve, 1000))
    
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
    // 关闭密码修改对话框
    showPasswordDialog.value = false
  } catch (error) {
    console.error('❌ 密码修改异常:', error)
    passwordError.value = '网络错误，请稍后重试'
    toast.error('密码修改失败', {
      description: '网络错误，请稍后重试'
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

// 刷新天气设置，从cookie中重新读取
const refreshWeatherSettings = () => {
  const settings = getWeatherSettings()
  weatherSettings.value = {
    ...settings,
    showCitySelector: weatherSettings.value.showCitySelector || false,
    selectedCity: safeLocalStorage.getItem('manualCity', '') || '',
    commonCities: weatherSettings.value.commonCities || []
  }
}

// 组件挂载时从cookie中读取最新的天气设置
onMounted(() => {
  refreshWeatherSettings()
  
  // 每次组件激活时重新从cookie读取设置
  window.addEventListener('focus', refreshWeatherSettings)
  
  // 初始化背景预览
  if (safeLocalStorage.getItem('customBgImage')) {
    customBgPreview.value = safeLocalStorage.getItem('customBgImage')
  }
})

onUnmounted(() => {
  window.removeEventListener('focus', refreshWeatherSettings)
})
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader class="fixed top-0 left-0 w-full z-50" />
    
    <main class="flex-1 container mx-auto px-4 pt-24 pb-8">
      <div class="flex flex-1 flex-col gap-8 max-w-3xl mx-auto">
        <div class="space-y-2">
          <h2 class="text-3xl font-medium">设置</h2>
          <p class="text-muted-foreground">
            管理您的账户信息、偏好设置和应用功能
          </p>
        </div>
        
        <!-- 设置内容 -->
        <div class="grid gap-8">
          <!-- 基本信息部分 -->
          <div class="rounded-lg border bg-card shadow-sm overflow-hidden">
            <!-- 未登录遮罩 -->
            <div v-if="!canEditProfile" class="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-lg border border-dashed p-12">
              <div class="text-center space-y-4">
                <h3 class="text-xl font-medium">需要登录</h3>
                <p class="text-muted-foreground">请登录后查看和修改您的个人信息</p>
                <Button @click="goToLogin">前往登录</Button>
              </div>
            </div>
            
            <div class="p-6" :class="{ 'opacity-50 pointer-events-none filter blur-[1px]': !canEditProfile }">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h3 class="text-xl font-medium">基本信息</h3>
                  <p class="text-sm text-muted-foreground">更新您的个人信息和头像</p>
                </div>
              </div>
              
              <div class="space-y-6">
                <!-- 错误提示 -->
                <Alert v-if="profileError" variant="destructive">
                  <AlertCircle class="w-4 h-4" />
                  <AlertTitle>错误</AlertTitle>
                  <AlertDescription>{{ profileError }}</AlertDescription>
                </Alert>

                <div class="flex items-center space-x-4">
                  <Avatar class="h-20 w-20">
                    <AvatarImage v-if="userAvatar" :src="userAvatar" />
                    <AvatarFallback>{{ userInitials }}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="truncate font-semibold">{{ userStore.userInfo?.username || '用户' }}</span>
                      <span
                        v-if="isAdmin"
                        class="inline-flex items-center rounded-full bg-orange-500 px-2 py-0.5 text-xs font-medium text-white"
                      >
                        PRO · 高级账户
                      </span>
                    </div>
                    <p class="text-sm text-muted-foreground">{{ userInfo.email }}</p>
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
                  <Button
                    v-if="!isEditing && canEditProfile"
                    @click="showPasswordDialog = true"
                    variant="outline"
                    :disabled="isChangingPassword"
                  >
                    修改密码
                  </Button>
                  <template v-if="isEditing">
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
              </div>
            </div>
          </div>

          <!-- 天气设置部分 -->
          <div class="rounded-lg border bg-card shadow-sm overflow-hidden">
            <div class="p-6">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h3 class="text-xl font-medium">天气设置</h3>
                  <p class="text-sm text-muted-foreground">配置首页天气功能</p>
                </div>
              </div>
              
              <div class="space-y-6">
                <!-- 天气功能开关 -->
                <div class="flex items-center justify-between">
                  <div class="space-y-0.5">
                    <Label class="text-base">天气功能</Label>
                    <p class="text-sm text-muted-foreground">在首页显示天气信息</p>
                  </div>
                  <div class="flex gap-2 bg-muted rounded-lg p-1">
                    <Button 
                      :class="[weatherSettings.enabled ? 'bg-primary text-primary-foreground' : 'bg-transparent hover:bg-accent hover:text-accent-foreground']"
                      size="sm"
                      variant="ghost"
                      @click="() => {
                        toggleWeatherEnabled(true);
                      }"
                    >
                      启用
                    </Button>
                    <Button 
                      :class="[!weatherSettings.enabled ? 'bg-primary text-primary-foreground' : 'bg-transparent hover:bg-accent hover:text-accent-foreground']"
                      size="sm"
                      variant="ghost"
                      @click="() => {
                        toggleWeatherEnabled(false);
                      }"
                    >
                      禁用
                    </Button>
                  </div>
                </div>
                
                <Separator v-if="weatherSettings.enabled" />
                
                <!-- 温度单位设置 -->
                <div class="space-y-4" v-if="weatherSettings.enabled">
                  <div class="flex items-center justify-between">
                    <div class="space-y-0.5">
                      <Label class="text-base">温度单位</Label>
                      <p class="text-sm text-muted-foreground">选择您偏好的温度显示单位</p>
                    </div>
                    <div class="flex gap-2 bg-muted rounded-lg p-1">
                      <Button 
                        :class="[weatherSettings.unit === 'celsius' ? 'bg-primary text-primary-foreground' : 'bg-transparent hover:bg-accent hover:text-accent-foreground']"
                        size="sm"
                        variant="ghost"
                        @click="() => {
                          weatherSettings.unit = 'celsius';
                          const settings = {
                            enabled: weatherSettings.enabled,
                            unit: weatherSettings.unit || 'celsius',
                            showHumidity: weatherSettings.showHumidity !== false,
                            showWind: weatherSettings.showWind !== false
                          };
                          saveWeatherSettings(settings);
                          toast.success('已切换为摄氏度 (℃)');
                        }"
                      >
                        摄氏度 (℃)
                      </Button>
                      <Button 
                        :class="[weatherSettings.unit === 'fahrenheit' ? 'bg-primary text-primary-foreground' : 'bg-transparent hover:bg-accent hover:text-accent-foreground']"
                        size="sm"
                        variant="ghost"
                        @click="() => {
                          weatherSettings.unit = 'fahrenheit';
                          const settings = {
                            enabled: weatherSettings.enabled,
                            unit: 'fahrenheit',
                            showHumidity: weatherSettings.showHumidity !== false,
                            showWind: weatherSettings.showWind !== false
                          };
                          saveWeatherSettings(settings);
                          toast.success('已切换为华氏度 (℉)');
                        }"
                      >
                        华氏度 (℉)
                      </Button>
                    </div>
                  </div>
                </div>
                
                <Separator v-if="weatherSettings.enabled" />
                
                <!-- 显示选项 -->
                <div class="space-y-4" v-if="weatherSettings.enabled">
                  <div class="flex items-center justify-between">
                    <div class="space-y-0.5">
                      <Label class="text-base">显示湿度</Label>
                      <p class="text-sm text-muted-foreground">是否在天气信息中显示湿度数据</p>
                    </div>
                    <div class="flex gap-2 bg-muted rounded-lg p-1">
                      <Button 
                        :class="[weatherSettings.showHumidity !== false ? 'bg-primary text-primary-foreground' : 'bg-transparent hover:bg-accent hover:text-accent-foreground']"
                        size="sm"
                        variant="ghost"
                        @click="() => {
                          weatherSettings.showHumidity = true;
                          const settings = {
                            enabled: weatherSettings.enabled,
                            unit: weatherSettings.unit || 'celsius',
                            showHumidity: true,
                            showWind: weatherSettings.showWind !== false
                          };
                          saveWeatherSettings(settings);
                          toast.success('已启用湿度显示');
                        }"
                      >
                        显示
                      </Button>
                      <Button 
                        :class="[weatherSettings.showHumidity === false ? 'bg-primary text-primary-foreground' : 'bg-transparent hover:bg-accent hover:text-accent-foreground']"
                        size="sm"
                        variant="ghost"
                        @click="() => {
                          weatherSettings.showHumidity = false;
                          const settings = {
                            enabled: weatherSettings.enabled,
                            unit: weatherSettings.unit || 'celsius',
                            showHumidity: false,
                            showWind: weatherSettings.showWind !== false
                          };
                          saveWeatherSettings(settings);
                          toast.success('已隐藏湿度显示');
                        }"
                      >
                        隐藏
                      </Button>
                    </div>
                  </div>
                  
                  <div class="flex items-center justify-between">
                    <div class="space-y-0.5">
                      <Label class="text-base">显示风向和风力</Label>
                      <p class="text-sm text-muted-foreground">是否在天气信息中显示风向和风力数据</p>
                    </div>
                    <div class="flex gap-2 bg-muted rounded-lg p-1">
                      <Button 
                        :class="[weatherSettings.showWind !== false ? 'bg-primary text-primary-foreground' : 'bg-transparent hover:bg-accent hover:text-accent-foreground']"
                        size="sm"
                        variant="ghost"
                        @click="() => {
                          weatherSettings.showWind = true;
                          const settings = {
                            enabled: weatherSettings.enabled,
                            unit: weatherSettings.unit || 'celsius',
                            showHumidity: weatherSettings.showHumidity !== false,
                            showWind: true
                          };
                          saveWeatherSettings(settings);
                          toast.success('已启用风向和风力显示');
                        }"
                      >
                        显示
                      </Button>
                      <Button 
                        :class="[weatherSettings.showWind === false ? 'bg-primary text-primary-foreground' : 'bg-transparent hover:bg-accent hover:text-accent-foreground']"
                        size="sm"
                        variant="ghost"
                        @click="() => {
                          weatherSettings.showWind = false;
                          const settings = {
                            enabled: weatherSettings.enabled,
                            unit: weatherSettings.unit || 'celsius',
                            showHumidity: weatherSettings.showHumidity !== false,
                            showWind: false
                          };
                          saveWeatherSettings(settings);
                          toast.success('已禁用风向和风力显示');
                        }"
                      >
                        隐藏
                      </Button>
                    </div>
                  </div>
                </div>
                
                <Separator v-if="weatherSettings.enabled" />
                
                <!-- 位置设置 -->
                <div class="space-y-4" v-if="weatherSettings.enabled">
                  <Label class="text-base">位置设置<VersionAvatar :mode="betamode" size="small" /></Label>
                  <p class="text-sm text-muted-foreground">配置天气信息的位置来源</p>
                  
                  <div class="space-y-4">
                    <Button variant="outline" @click="requestLocationPermission">
                      <MapPin class="w-4 h-4 mr-2" />
                      重置位置授权
                    </Button>
                    
                    <div class="space-y-2">
                      <Button variant="outline" @click="weatherSettings.showCitySelector = !weatherSettings.showCitySelector">
                        <Map class="w-4 h-4 mr-2" />
                        {{ weatherSettings.showCitySelector ? '隐藏城市选择' : '手动选择城市' }}
                      </Button>
                      
                      <div v-if="weatherSettings.showCitySelector" class="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                        <Button 
                          v-for="city in weatherSettings.commonCities" 
                          :key="city.name"
                          variant="outline"
                          size="sm"
                          @click="selectCity(city.name, city.adcode)"
                          :class="{ 'bg-primary/10': weatherSettings.selectedCity === city.name }"
                        >
                          {{ city.name }}
                        </Button>
                      </div>
                      
                      <p v-if="weatherSettings.selectedCity" class="text-sm text-muted-foreground">
                        当前选择的城市: {{ weatherSettings.selectedCity }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 个性化设置部分 -->
          <div class="rounded-lg border bg-card shadow-sm overflow-hidden">
            <div class="p-6">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h3 class="text-xl font-medium">个性化设置</h3>
                  <p class="text-sm text-muted-foreground">自定义应用外观和行为</p>
                </div>
              </div>
              
              <div class="space-y-6">
                <div class="flex items-center justify-between">
                  <div class="space-y-0.5">
                    <Label class="text-base">显示模式</Label>
                    <p class="text-sm text-muted-foreground">选择您偏好的显示模式</p>
                  </div>
                  <div class="flex gap-2 bg-muted rounded-lg p-1">
                    <Button 
                      :class="[themeMode === 'auto' ? 'bg-primary text-primary-foreground' : 'bg-transparent hover:bg-accent hover:text-accent-foreground']"
                      size="sm"
                      variant="ghost"
                      @click="() => {
                        themeMode = 'auto';
                        toast.success('已切换为自动主题', {
                          description: '将根据系统设置自动切换明暗主题'
                        });
                      }"
                    >
                      <Monitor class="h-4 w-4 mr-2" />
                      自动
                    </Button>
                    <Button 
                      :class="[themeMode === 'light' ? 'bg-primary text-primary-foreground' : 'bg-transparent hover:bg-accent hover:text-accent-foreground']"
                      size="sm"
                      variant="ghost"
                      @click="() => {
                        themeMode = 'light';
                        toast.success('已切换为明亮主题');
                      }"
                    >
                      <Sun class="h-4 w-4 mr-2" />
                      明亮
                    </Button>
                    <Button 
                      :class="[themeMode === 'dark' ? 'bg-primary text-primary-foreground' : 'bg-transparent hover:bg-accent hover:text-accent-foreground']"
                      size="sm"
                      variant="ghost"
                      @click="() => {
                        themeMode = 'dark';
                        toast.success('已切换为暗黑主题');
                      }"
                    >
                      <Moon class="h-4 w-4 mr-2" />
                      暗黑
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                <!-- 徽章显示设置 -->
                <div class="flex items-center justify-between">
                  <div class="space-y-0.5">
                    <Label class="text-base">首页徽章显示<VersionAvatar :mode="betamode" size="small" /></Label>
                    <p class="text-sm text-muted-foreground">是否在首页显示PRO徽章图标（您需要PRO账户才会显示）</p>
                  </div>
                  <div class="flex gap-2 bg-muted rounded-lg p-1">
                    <Button 
                      :class="[showBadgeInHome ? 'bg-primary text-primary-foreground' : 'bg-transparent hover:bg-accent hover:text-accent-foreground']"
                      size="sm"
                      variant="ghost"
                      @click="() => toggleBadgeDisplay(true)"
                    >
                      显示
                    </Button>
                    <Button 
                      :class="[!showBadgeInHome ? 'bg-primary text-primary-foreground' : 'bg-transparent hover:bg-accent hover:text-accent-foreground']"
                      size="sm"
                      variant="ghost"
                      @click="() => toggleBadgeDisplay(false)"
                    >
                      隐藏
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                <!-- 壁纸设置 -->
                <WallpaperSettings />
              </div>
            </div>
          </div>
          
          <!-- 数据设置部分 -->
          <div class="rounded-lg border bg-card shadow-sm overflow-hidden">
            <div class="p-6">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h3 class="text-xl font-medium">数据设置</h3>
                  <p class="text-sm text-muted-foreground">管理您的应用数据</p>
                </div>
              </div>
              
              <div class="space-y-6">
                <!-- 数据导入导出 -->
                <div>
                  <Label class="text-base">数据导入导出<VersionAvatar :mode="betamode" size="small" /></Label>
                  <p class="text-sm text-muted-foreground mb-4">备份或恢复您的设置数据</p>
                  
                  <div class="flex flex-wrap gap-2">
                    <Button variant="outline" @click="exportData" :disabled="isExporting">
                      <Download v-if="!isExporting" class="w-4 h-4 mr-2" />
                      <Loader2 v-else class="w-4 h-4 mr-2 animate-spin" />
                      {{ isExporting ? '导出中...' : '导出设置' }}
                    </Button>
                    
                    <Button variant="outline" @click="triggerFileInput" :disabled="isImporting">
                      <Upload v-if="!isImporting" class="w-4 h-4 mr-2" />
                      <Loader2 v-else class="w-4 h-4 mr-2 animate-spin" />
                      {{ isImporting ? '导入中...' : '导入设置' }}
                    </Button>
                    
                    <input 
                      ref="fileInputRef"
                      type="file" 
                      accept=".json" 
                      class="hidden"
                      @change="handleFileChange"
                    />
                    
                    <Button v-if="importFile" variant="default" @click="importData" :disabled="isImporting">
                      应用导入
                    </Button>
                  </div>
                  
                  <p v-if="importFile" class="text-sm mt-2">
                    已选择文件: {{ importFile.name }}
                  </p>
                </div>
                
                <Separator />
                
                <!-- 还原设置并退出登录 -->
                <div>
                  <Label class="text-base">还原设置并退出登录</Label>
                  <p class="text-sm text-muted-foreground mb-4">将所有设置恢复为默认值并清除登录信息</p>
                  
                  <Button variant="destructive" @click="resetAllSettings" :disabled="isResetting">
                    <RefreshCw v-if="!isResetting" class="w-4 h-4 mr-2" />
                    <Loader2 v-else class="w-4 h-4 mr-2 animate-spin" />
                    {{ isResetting ? '处理中...' : '还原设置并退出登录' }}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    
    <AppFooter />
    
    <!-- 确认对话框 -->
    <AlertDialog :open="showConfirmDialog">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确认更新个人信息</AlertDialogTitle>
          <AlertDialogDescription>
            您确定要更新个人信息吗？此操作将修改您的账户信息。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel @click="showConfirmDialog = false">取消</AlertDialogCancel>
          <AlertDialogAction @click="confirmSaveProfile">确认</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    
    <!-- 密码修改对话框 -->
    <AlertDialog :open="showPasswordDialog">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>修改密码</AlertDialogTitle>
          <AlertDialogDescription>
            请输入您的当前密码和新密码
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div class="space-y-4 py-4">
          <!-- 错误提示 -->
          <Alert v-if="passwordError" variant="destructive">
            <AlertCircle class="w-4 h-4" />
            <AlertTitle>错误</AlertTitle>
            <AlertDescription>{{ passwordError }}</AlertDescription>
          </Alert>
          
          <div class="space-y-2">
            <Label for="current-password">当前密码</Label>
            <Input
              id="current-password"
              v-model="passwordForm.currentPassword"
              type="password"
              :disabled="isChangingPassword"
              placeholder="请输入当前密码"
            />
          </div>
          
          <div class="space-y-2">
            <Label for="new-password">新密码</Label>
            <Input
              id="new-password"
              v-model="passwordForm.newPassword"
              type="password"
              :disabled="isChangingPassword"
              placeholder="请输入新密码"
            />
          </div>
          
          <div class="space-y-2">
            <Label for="confirm-password">确认新密码</Label>
            <Input
              id="confirm-password"
              v-model="passwordForm.confirmPassword"
              type="password"
              :disabled="isChangingPassword"
              placeholder="请再次输入新密码"
            />
          </div>
        </div>


        
        <AlertDialogFooter>
          <AlertDialogCancel @click="showPasswordDialog = false" :disabled="isChangingPassword">取消</AlertDialogCancel>
          <AlertDialogAction @click="handleChangePassword" :disabled="isChangingPassword">
            <Loader2 v-if="isChangingPassword" class="w-4 h-4 mr-2 animate-spin" />
            {{ isChangingPassword ? '提交中...' : '提交' }}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    
    <!-- 重置确认对话框 -->
    <AlertDialog :open="showResetConfirm">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确认还原设置并退出登录</AlertDialogTitle>
          <AlertDialogDescription>
            此操作将把所有设置恢复为默认值，清除所有Cookie并退出登录。此操作无法撤销。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel @click="showResetConfirm = false">取消</AlertDialogCancel>
          <AlertDialogAction @click="confirmReset">确认操作</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>
