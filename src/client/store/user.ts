import { defineStore } from 'pinia'
import Cookies from 'js-cookie'
import request from '@/lib/axiosConfig'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    userId: '',
    userInfo: { 
      id: '',
      username: '', 
      email: '', 
      avatar: '',
      is_banned: false,
      ban_reason: '',
      ban_expiration: '',
      is_admin: false,
      qq_num: ''
    },
  }),
  actions: {
    setUser(token: string, userId: string, userInfo?: { 
      id: string,
      username: string, 
      email: string, 
      avatar?: string,
      is_banned?: boolean,
      ban_reason?: string,
      ban_expiration?: string,
      is_admin?: boolean,
      qq_num?: string
    }) {
      console.log('👤 设置用户数据:', { 
        hasToken: !!token, 
        userId, 
        username: userInfo?.username 
      })
      
      this.token = token
      this.userId = userId
      if (userInfo) this.userInfo = {
        id: userInfo.id,
        username: userInfo.username,
        email: userInfo.email,
        avatar: userInfo.avatar || '',
        is_banned: userInfo.is_banned || false,
        ban_reason: userInfo.ban_reason || '',
        ban_expiration: userInfo.ban_expiration || '',
        is_admin: userInfo.is_admin || false,
        qq_num: userInfo.qq_num || ''
      }
      // 存储到 cookie，设置72小时过期时间
      Cookies.set('token', token, { expires: 3 }) // 3天 = 72小时
      Cookies.set('userId', userId, { expires: 3 })
      Cookies.set('userInfo', JSON.stringify(this.userInfo), { expires: 3 })
      
      console.log('✅ 用户数据设置成功')
    },
    logout() {
      console.log('🚪 用户登出')
      this.token = ''
      this.userId = ''
      this.userInfo = {
        id: '',
        username: '',
        email: '',
        avatar: '',
        is_banned: false,
        ban_reason: '',
        ban_expiration: '',
        is_admin: false,
        qq_num: ''
      }
      // 清除 cookie
      Cookies.remove('token')
      Cookies.remove('userId')
      Cookies.remove('userInfo')
      
      console.log('✅ 用户登出完成')
    },
    loadFromCookie() {
      console.log('🍪 从 cookie 加载用户数据...')
      const token = Cookies.get('token')
      const userId = Cookies.get('userId')
      const userInfoStr = Cookies.get('userInfo')
      
      if (token && userId && userInfoStr) {
        try {
          const userInfo = JSON.parse(userInfoStr)
          this.token = token
          this.userId = userId
          this.userInfo = userInfo
          console.log('✅ 从 cookie 加载用户数据:', { 
            username: userInfo.username, 
            is_admin: userInfo.is_admin 
          })
        } catch (error) {
          console.error('❌ 从 cookie 解析用户信息失败:', error)
          this.logout()
        }
      } else {
        console.log('ℹ️ 没有找到用户数据')
      }
    },
    async getUserInfo() {
      if (!this.token || !this.userId) {
        console.warn('⚠️ 无法获取用户信息: 缺少 token 或 userId')
        return
      }
      
      console.log('🔄 从服务器获取用户信息...')
      try {
        const res = await request.get(`/user/info/${this.userId}`)
        console.log('✅ 用户信息响应接收:', { 
          code: res.data?.code, 
          hasData: !!res.data?.data 
        })
        
        if (res.data && res.data.code === 200 && res.data.data) {
          const userData = res.data.data
          console.log('📊 用户数据接收:', { 
            username: userData.username, 
            is_admin: userData.is_admin,
            is_banned: userData.is_banned 
          })
          
          this.userInfo = {
            id: userData.id,
            username: userData.username,
            email: userData.email,
            avatar: userData.avatar || '',
            is_banned: userData.is_banned || false,
            ban_reason: userData.ban_reason || '',
            ban_expiration: userData.ban_expiration || '',
            is_admin: userData.is_admin || false,
            qq_num: userData.qq_num || ''
          }
          Cookies.set('userInfo', JSON.stringify(this.userInfo), { expires: 3 })
          console.log('✅ 用户信息更新成功')
        } else {
          console.error('❌ 获取用户信息失败:', res.data)
        }
      } catch (e) {
        console.error('❌ 获取用户信息异常:', e)
        // 可选：处理错误
      }
    }
  }
})