import { ref } from 'vue'
import axios from 'axios'
import Cookies from 'js-cookie'
import { LocationData } from './weather'

// 高德地图API相关函数
export const useLocation = (AMAP_KEY: string) => {
  // 位置数据
  const locationData = ref<LocationData>({
    latitude: 0,
    longitude: 0,
    city: '深圳',
    adcode: '440304' // 默认深圳市福田区
  })

  // 获取用户位置
  const getUserLocation = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('您的浏览器不支持地理定位'))
        return
      }

      console.log('请求浏览器地理定位...')
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('浏览器地理定位成功:', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          })
          resolve(position)
        },
        (error) => {
          console.error('浏览器地理定位失败:', {
            code: error.code,
            message: error.message
          })
          reject(error)
        },
        { 
          enableHighAccuracy: true, // 尝试获取最精确的位置
          timeout: 10000,           // 10秒超时
          maximumAge: 0             // 不使用缓存的位置
        }
      )
    })
  }

  // 通过经纬度获取城市信息（逆地理编码）
  const getCityByLocation = async (latitude: number, longitude: number): Promise<{ city: string, adcode: string }> => {
    try {
      // 使用高德地图逆地理编码API获取位置信息
      const location = `${longitude},${latitude}`
      console.log('开始逆地理编码请求，坐标:', location)
      
      const response = await axios.get('/amap-api/v3/geocode/regeo', {
        params: {
          key: AMAP_KEY,
          location: location,
          extensions: 'base', // 返回基本地址信息
          radius: 1000, // 搜索半径
          output: 'JSON'
        }
      })
      
      console.log('逆地理编码响应:', response.data)
      
      if (response.data.status === '1' && response.data.regeocode && response.data.regeocode.addressComponent) {
        const addressComponent = response.data.regeocode.addressComponent
        console.log('获取到地址组件:', addressComponent)
        
        // 从addressComponent中获取城市和adcode
        return {
          city: addressComponent.city || addressComponent.province, // 如果city为空（直辖市），则使用province
          adcode: addressComponent.adcode // 行政区编码
        }
      } else {
        console.error('逆地理编码返回无效数据:', response.data)
        throw new Error('获取城市信息失败')
      }
    } catch (error) {
      console.error('逆地理编码失败:', error)
      // 使用IP定位作为备选方案
      try {
        console.log('尝试使用IP定位作为备选方案')
        const ipResponse = await axios.get('/amap-api/v3/ip', {
          params: {
            key: AMAP_KEY,
            output: 'JSON'
          }
        })
        
        console.log('IP定位响应:', ipResponse.data)
        
        if (ipResponse.data.status === '1' && ipResponse.data.city) {
          return {
            city: ipResponse.data.city,
            adcode: ipResponse.data.adcode // 使用IP定位返回的adcode
          }
        } else {
          console.error('IP定位返回无效数据:', ipResponse.data)
          throw new Error('IP定位失败')
        }
      } catch (ipError) {
        console.error('IP定位失败:', ipError)
        // 使用默认位置
        return { city: '北京', adcode: '110101' }
      }
    }
  }

  // IP定位作为备选方案
  const getLocationByIp = async (): Promise<{ city: string, adcode: string }> => {
    try {
      const response = await axios.get('/amap-api/v3/ip', {
        params: {
          key: AMAP_KEY,
          output: 'JSON'
        }
      })
      
      console.log('IP定位响应:', response.data)
      
      if (response.data.status === '1' && response.data.city) {
        return {
          city: response.data.city,
          adcode: response.data.adcode || '110101' // 如果没有adcode，使用默认值
        }
      } else {
        console.error('IP定位返回无效数据:', response.data)
        throw new Error('IP定位失败')
      }
    } catch (error) {
      console.error('IP定位请求失败:', error)
      throw error
    }
  }

  // 保存位置信息到Cookie和localStorage
  const saveLocationData = (data: LocationData): void => {
    Cookies.set('locationData', JSON.stringify(data), { expires: 30 }) // 30天有效期
    localStorage.setItem('locationData', JSON.stringify(data))
  }

  // 从Cookie或localStorage获取位置信息
  const loadLocationData = (): LocationData | null => {
    const cookieData = Cookies.get('locationData')
    if (cookieData) {
      try {
        return JSON.parse(cookieData)
      } catch (error) {
        console.error('解析位置数据失败:', error)
      }
    }
    
    const localData = localStorage.getItem('locationData')
    if (localData) {
      try {
        return JSON.parse(localData)
      } catch (error) {
        console.error('解析位置数据失败:', error)
      }
    }
    
    return null
  }

  return {
    locationData,
    getUserLocation,
    getCityByLocation,
    getLocationByIp,
    saveLocationData,
    loadLocationData
  }
}

// 常用城市列表
export const commonCities = [
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
  { name: '大连', adcode: '210200' },
  { name: '郑州', adcode: '410100' },
  { name: '长沙', adcode: '430100' },
  { name: '东莞', adcode: '441900' },
  { name: '佛山', adcode: '440600' },
  { name: '宁波', adcode: '330200' },
  { name: '合肥', adcode: '340100' },
  { name: '济南', adcode: '370100' },
  { name: '福州', adcode: '350100' },
  { name: '沈阳', adcode: '210100' },
  { name: '昆明', adcode: '530100' }
]