import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import Cookies from 'js-cookie'
import { toast } from 'vue-sonner'

// 定义天气接口类型
export interface WeatherData {
  temperature: string;
  weather: string;
  city: string;
  humidity: string;
  windDirection: string;
  windPower: string;
  loading: boolean;
  error: string | null;
}

// 定义位置接口类型
export interface LocationData {
  latitude: number;
  longitude: number;
  city: string;
  adcode: string;
}

// 天气设置默认值
const defaultWeatherSettings = {
  enabled: true,
  unit: 'celsius', // 摄氏度
  showHumidity: true,
  showWind: true
}

// 天气图标映射
export const weatherIcons: Record<string, string> = {
  // 晴
  '晴': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>',
  // 多云
  '多云': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>',
  // 阴
  '阴': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>',
  // 小雨
  '小雨': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/></svg>',
  // 中雨
  '中雨': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/></svg>',
  // 大雨
  '大雨': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/></svg>',
  // 雷阵雨
  '雷阵雨': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="m13 12-3 5h4l-3 5"/></svg>',
  // 默认图标
  'default': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>'
}

// 从Cookie中获取天气设置 - 优化加载过程
export const loadWeatherSettings = (): { enabled: boolean, unit: string, showHumidity: boolean, showWind: boolean } => {
  // 直接从cookie读取，确保每次都获取最新设置
  const settings = Cookies.get('weatherSettings')
  if (settings) {
    try {
      const parsedSettings = JSON.parse(settings)
      console.log('从cookie中读取到天气设置:', parsedSettings)
      // 更新本地缓存
      localStorage.setItem('weatherSettingsCache', settings)
      return parsedSettings
    } catch (error) {
      console.error('解析天气设置失败:', error)
    }
  }

  // 默认设置
  console.log('未找到天气设置cookie或解析失败，使用默认设置')
  return { ...defaultWeatherSettings }
}

// 更新天气设置到Cookie
export const updateWeatherSettings = (settings: { enabled: boolean, unit: string, showHumidity: boolean, showWind: boolean }): void => {
  // 同时更新cookie和本地缓存
  Cookies.set('weatherSettings', JSON.stringify(settings), { expires: 365 }) // 一年有效期
  localStorage.setItem('weatherSettingsCache', JSON.stringify(settings))
  console.log('天气设置已保存到cookie和本地缓存:', settings)
}

// 获取天气图标
export const getWeatherIcon = (weatherDesc: string): string => {
  return weatherIcons[weatherDesc] || weatherIcons['default']
}

// 摄氏度转华氏度
export const convertCelsiusToFahrenheit = (celsius: number): number => {
  return celsius * 9/5 + 32
}

// 华氏度转摄氏度
export const convertFahrenheitToCelsius = (fahrenheit: number): number => {
  return (fahrenheit - 32) * 5/9
}

export const useWeather = (AMAP_KEY: string) => {
  // 天气设置 - 使用ref包装以实现响应式
  const weatherSettings = ref(loadWeatherSettings())
  
  // 天气数据 - 初始状态设为非加载状态，避免一开始就显示加载动画
  const weatherData = ref<WeatherData>({
    temperature: '',
    weather: '',
    city: '深圳',
    humidity: '',
    windDirection: '',
    windPower: '',
    loading: false, // 初始设为false，等待实际请求时再设为true
    error: null
  })
  
  // 位置数据
  const locationData = ref<LocationData>({
    latitude: 0,
    longitude: 0,
    city: '深圳',
    adcode: '440304' // 默认深圳市福田区
  })
  
  // 位置授权对话框
  const showLocationDialog = ref(false)
  const locationAuthorized = ref(false)
  const locationLoading = ref(false)
  const locationError = ref<string | null>(null)
  const showCitySelector = ref(false)
  const selectedCity = ref('')
  const commonCities = [
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
  
  // 监听cookie变化的函数
  const checkCookieChanges = () => {
    const newSettings = loadWeatherSettings()
    const currentSettings = weatherSettings.value
    
    // 检查设置是否有变化
    if (newSettings.enabled !== currentSettings.enabled ||
        newSettings.unit !== currentSettings.unit ||
        newSettings.showHumidity !== currentSettings.showHumidity ||
        newSettings.showWind !== currentSettings.showWind) {
      
      console.log('检测到天气设置变化，更新设置:', newSettings)
      weatherSettings.value = newSettings
      
      // 如果温度单位发生变化，需要重新格式化温度显示
      if (newSettings.unit !== currentSettings.unit && weatherData.value.temperature) {
        const tempValue = parseFloat(weatherData.value.temperature)
        if (!isNaN(tempValue)) {
          if (newSettings.unit === 'celsius' && currentSettings.unit === 'fahrenheit') {
            // 华氏度转摄氏度
            weatherData.value.temperature = convertFahrenheitToCelsius(tempValue).toFixed(1)
          } else if (newSettings.unit === 'fahrenheit' && currentSettings.unit === 'celsius') {
            // 摄氏度转华氏度
            weatherData.value.temperature = convertCelsiusToFahrenheit(tempValue).toFixed(1)
          }
        }
      }
      
      // 如果天气功能被禁用，不需要重新获取天气数据
      if (newSettings.enabled && currentSettings.enabled) {
        // 如果只是显示选项变化，不需要重新获取天气数据
        console.log('天气设置已更新，但不需要重新获取天气数据')
      } else if (newSettings.enabled && !currentSettings.enabled) {
        // 如果天气功能从禁用变为启用，需要重新获取天气数据
        console.log('天气功能已启用，重新获取天气数据')
        fetchWeather()
      }
    }
  }
  
  // 设置定时器，定期检查cookie变化
  let cookieCheckInterval: number | null = null
  
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
  
  // 请求位置授权
  const requestLocationPermission = async (): Promise<void> => {
    locationLoading.value = true
    locationError.value = null
    
    // 首先检查天气功能是否启用
    const currentSettings = loadWeatherSettings()
    if (!currentSettings.enabled) {
      toast.error('天气功能未启用', {
        description: '请先在设置中启用天气功能'
      })
      locationLoading.value = false
      return
    }

    try {
      const position = await getUserLocation()

      // 获取城市信息
      const cityInfo = await getCityByLocation(position.coords.latitude, position.coords.longitude)

      // 更新位置数据
      locationData.value = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        city: cityInfo.city,
        adcode: cityInfo.adcode
      }

      // 保存授权状态和位置方法到Cookie和localStorage
      Cookies.set('locationAuthorized', 'true', { expires: 30 }) // 30天有效期
      Cookies.set('locationData', JSON.stringify(locationData.value), { expires: 30 })
      localStorage.setItem('locationAuthorized', 'true')
      localStorage.setItem('locationMethod', 'auto')
      locationAuthorized.value = true
      
      // 使用获取到的位置获取天气数据
      await fetchWeather()
      
      console.log('位置授权成功:', locationData.value)
      
      // 关闭对话框
      showLocationDialog.value = false
    } catch (error) {
      console.error('获取位置失败:', error)
      locationError.value = error instanceof Error ? error.message : '获取位置失败，请检查浏览器权限设置'
      
      // 尝试使用IP定位
      try {
        const ipResponse = await axios.get('/amap-api/v3/ip', {
          params: {
            key: AMAP_KEY,
            output: 'JSON'
          }
        })
        
        if (ipResponse.data.status === '1' && ipResponse.data.city) {
          locationData.value = {
            latitude: 0,
            longitude: 0,
            city: ipResponse.data.city,
            adcode: ipResponse.data.adcode
          }
          
          // 使用IP定位获取天气数据
          await fetchWeather()
          
          // 关闭对话框
          showLocationDialog.value = false
        } else {
          // 使用默认位置获取天气数据
          await fetchWeather()
        }
      } catch (ipError) {
        console.error('IP定位失败:', ipError)
        // 使用默认位置获取天气数据
        await fetchWeather()
      }
    } finally {
      locationLoading.value = false
    }
  }

  // 拒绝位置授权
  const denyLocationPermission = async (): Promise<void> => {
    // 保存拒绝状态到Cookie
    Cookies.set('locationAuthorized', 'false', { expires: 30 }) // 30天有效期
    locationAuthorized.value = false
    showLocationDialog.value = false
    
    // 尝试使用IP定位
    try {
      const ipResponse = await axios.get('/amap-api/v3/ip', {
        params: {
          key: AMAP_KEY,
          output: 'JSON'
        }
      })
      
      if (ipResponse.data.status === '1' && ipResponse.data.city) {
        locationData.value = {
          latitude: 0,
          longitude: 0,
          city: ipResponse.data.city,
          adcode: ipResponse.data.adcode
        }
      }
    } catch (error) {
      console.error('IP定位失败:', error)
    }
    
    // 使用当前位置获取天气数据
    await fetchWeather()
  }

  // 选择城市
  const selectCity = (cityName: string, adcode: string): void => {
    selectedCity.value = cityName
    console.log('选择城市:', cityName, adcode)
  }

  // 确认城市选择
  const confirmCitySelection = async (): Promise<void> => {
    if (!selectedCity.value) return
    
    // 找到选中的城市
    const city = commonCities.find(c => c.name === selectedCity.value)
    if (!city) return
    
    console.log('确认选择城市:', city)
    
    // 更新位置数据
    locationData.value = {
      latitude: 0,
      longitude: 0,
      city: city.name,
      adcode: city.adcode
    }
    
    // 保存到Cookie
    Cookies.set('locationAuthorized', 'true', { expires: 30 })
    Cookies.set('locationData', JSON.stringify(locationData.value), { expires: 30 })
    locationAuthorized.value = true
    
    // 关闭对话框
    showCitySelector.value = false
    
    // 获取天气数据
    await fetchWeather()
  }

  // 检查是否有缓存的天气数据
  const checkCachedWeather = (): boolean => {
    // 如果是首次加载或强制刷新，不使用缓存
    if (window.performance) {
      const navEntry = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navEntry && navEntry.type === 'reload') {
        console.log('页面被刷新，不使用天气缓存');
        localStorage.removeItem('weatherDataCache');
        localStorage.removeItem('weatherCacheTimestamp');
        return false;
      }
    }

    const cachedWeather = localStorage.getItem('weatherDataCache')
    const cachedTimestamp = localStorage.getItem('weatherCacheTimestamp')

    if (cachedWeather && cachedTimestamp) {
      try {
        // 检查缓存是否在15分钟内（减少缓存时间）
        const timestamp = parseInt(cachedTimestamp)
        const now = Date.now()
        const fifteenMinutesInMs = 15 * 60 * 1000

        if (now - timestamp < fifteenMinutesInMs) {
          // 缓存有效，使用缓存数据
          const parsedData = JSON.parse(cachedWeather)
          console.log('使用缓存的天气数据:',parsedData)

          // 更新天气数据但保持loading为false
          weatherData.value = {
            ...parsedData,
            loading: false,
            error: null
          }
          
          return true
        } else {
          console.log('天气数据缓存已过期，需要重新获取')
        }
      } catch (error) {
        console.error('解析缓存天气数据失败:', error)
      }
    }
    
    return false
  }

  // 获取天气数据
  const fetchWeather = async (): Promise<void> => {
    // 首先检查天气功能是否启用
    const currentSettings = loadWeatherSettings()
    if (!currentSettings.enabled) {
      console.log('天气功能已禁用，不获取天气数据')
      weatherData.value.loading = false
      return
    }
    
    // 检查是否有有效的缓存数据
    if (checkCachedWeather()) {
      console.log('使用缓存的天气数据，不发起新请求')
      return
    }
    
    // 设置加载状态
    weatherData.value.loading = true
    weatherData.value.error = null
    
    try {
      // 确保有有效的adcode
      if (!locationData.value.adcode) {
        console.warn('没有有效的adcode，使用默认值110101')
        locationData.value.adcode = '110101' // 北京市东城区
      }
      
      console.log('开始获取天气数据，使用区域编码:', locationData.value.adcode)
      
      // 使用代理请求高德天气API获取天气数据
      const response = await axios.get('/amap-api/v3/weather/weatherInfo', {
        params: {
          key: AMAP_KEY,
          city: locationData.value.adcode, // 高德天气API使用adcode作为city参数
          extensions: 'base',
          output: 'JSON'
        }
      })
      
      // 解析天气数据
      const data = response.data
      console.log('天气API响应:', data)
      
      if (data.status === '1' && data.lives && data.lives.length > 0) {
        const live = data.lives[0]
        // 重新获取最新的天气设置
        weatherSettings.value = loadWeatherSettings()
        // 根据设置的温度单位转换温度值
        const tempInCelsius = parseFloat(live.temperature)
        
        // 更新天气数据
        const updatedWeatherData = {
          temperature: weatherSettings.value.unit === 'celsius' 
            ? live.temperature 
            : convertCelsiusToFahrenheit(tempInCelsius).toFixed(1),
          weather: live.weather,
          city: live.city,
          humidity: live.humidity,
          windDirection: live.winddirection,
          windPower: live.windpower,
          loading: false,
          error: null
        }
        
        // 更新响应式数据
        weatherData.value = updatedWeatherData
        
        // 缓存天气数据和时间戳
        localStorage.setItem('weatherDataCache', JSON.stringify(updatedWeatherData))
        localStorage.setItem('weatherCacheTimestamp', Date.now().toString())
        
        console.log('天气数据获取成功并已缓存:', updatedWeatherData)
      } else {
        weatherData.value.error = '无法获取天气数据'
        console.error('天气数据格式错误:', data)
        
        // 尝试使用IP定位作为备选方案
        await useIpLocationFallback()
      }
    } catch (error) {
      weatherData.value.error = '获取天气数据失败'
      console.error('获取天气数据失败:', error)
      
      // 尝试使用IP定位作为备选方案
      await useIpLocationFallback()
    } finally {
      weatherData.value.loading = false
    }
  }

  // IP定位作为备选方案
  const useIpLocationFallback = async (): Promise<void> => {
    console.log('使用IP定位作为备选方案')
    try {
      const response = await axios.get('/amap-api/v3/ip', {
        params: {
          key: AMAP_KEY,
          output: 'JSON'
        }
      })
      
      console.log('IP定位响应:', response.data)
      
      // 检查是否返回了香港，如果是，可能是代理问题
      if (response.data.status === '1' && response.data.city === '香港') {
        console.warn('检测到IP定位返回香港，可能是代理问题，使用默认位置')
        // 使用默认位置（北京）
        await useDefaultLocation()
        return
      }
      
      if (response.data.status === '1' && response.data.city) {
        // 获取adcode
        let adcode = response.data.adcode
        
        // 如果没有adcode，尝试使用citycode
        if (!adcode && response.data.citycode) {
          adcode = response.data.citycode
        }
        
        // 如果还是没有，尝试通过城市名称获取adcode
        if (!adcode && response.data.city) {
          try {
            // 使用地理编码API通过城市名称获取adcode
            const geocodeResponse = await axios.get('/amap-api/v3/geocode/geo', {
              params: {
                key: AMAP_KEY,
                address: response.data.city,
                output: 'JSON'
              }
            })
            
            console.log('地理编码响应:', geocodeResponse.data)
            
            if (geocodeResponse.data.status === '1' && 
                geocodeResponse.data.geocodes && 
                geocodeResponse.data.geocodes.length > 0) {
              adcode = geocodeResponse.data.geocodes[0].adcode
            }
          } catch (geocodeError) {
            console.error('地理编码请求失败:', geocodeError)
          }
        }
        
        // 如果还是没有adcode，使用默认值
        if (!adcode) {
          adcode = '110101' // 北京市东城区
        }
        
        locationData.value = {
          latitude: 0,
          longitude: 0,
          city: response.data.city,
          adcode: adcode
        }
        
        console.log('IP定位成功，使用adcode:', adcode)
        
      // 使用IP定位获取天气数据
      const weatherResponse = await axios.get('/amap-api/v3/weather/weatherInfo', {
        params: {
          key: AMAP_KEY,
          city: adcode, // 使用城市代码获取天气
          extensions: 'base',
          output: 'JSON'
        }
      })
      
      if (weatherResponse.data.status === '1' && weatherResponse.data.lives && weatherResponse.data.lives.length > 0) {
        const live = weatherResponse.data.lives[0]
        // 重新获取最新的天气设置
        weatherSettings.value = loadWeatherSettings()
        // 根据设置的温度单位转换温度值
        const tempInCelsius = parseFloat(live.temperature)
        
        // 更新天气数据
        weatherData.value = {
          temperature: weatherSettings.value.unit === 'celsius' 
            ? live.temperature 
            : convertCelsiusToFahrenheit(tempInCelsius).toFixed(1),
          weather: live.weather,
          city: live.city,
          humidity: live.humidity,
          windDirection: live.winddirection,
          windPower: live.windpower,
          loading: false,
          error: null
        }
        
        // 缓存天气数据和时间戳
        localStorage.setItem('weatherDataCache', JSON.stringify(weatherData.value))
        localStorage.setItem('weatherCacheTimestamp', Date.now().toString())
        
        console.log('IP定位天气数据获取成功:', weatherData.value)
      } else {
        console.error('IP定位天气数据获取失败:', weatherResponse.data)
        await useDefaultLocation()
      }
    } else {
      console.error('IP定位返回无效数据:', response.data)
      // 使用默认位置
      await useDefaultLocation()
    }
  } catch (error) {
    console.error('IP定位请求失败:', error)
    // 使用默认位置
    await useDefaultLocation()
  }
}

  // 使用默认位置（北京）
  const useDefaultLocation = async (): Promise<void> => {
    console.log('使用默认位置（北京）')
    locationData.value = {
      latitude: 39.9042,
      longitude: 116.4074,
      city: '北京市',
      adcode: '110100' // 北京市
    }
    
    try {
      // 使用默认位置获取天气数据
      const response = await axios.get('/amap-api/v3/weather/weatherInfo', {
        params: {
          key: AMAP_KEY,
          city: '110100', // 北京市
          extensions: 'base',
          output: 'JSON'
        }
      })
      
      if (response.data.status === '1' && response.data.lives && response.data.lives.length > 0) {
        const live = response.data.lives[0]
        // 重新获取最新的天气设置
        weatherSettings.value = loadWeatherSettings()
        // 根据设置的温度单位转换温度值
        const tempInCelsius = parseFloat(live.temperature)
        
        // 更新天气数据
        weatherData.value = {
          temperature: weatherSettings.value.unit === 'celsius' 
            ? live.temperature 
            : convertCelsiusToFahrenheit(tempInCelsius).toFixed(1),
          weather: live.weather,
          city: live.city,
          humidity: live.humidity,
          windDirection: live.winddirection,
          windPower: live.windpower,
          loading: false,
          error: null
        }
        
        // 缓存天气数据和时间戳
        localStorage.setItem('weatherDataCache', JSON.stringify(weatherData.value))
        localStorage.setItem('weatherCacheTimestamp', Date.now().toString())
        
        console.log('默认位置天气数据获取成功:', weatherData.value)
      } else {
        console.error('默认位置天气数据获取失败:', response.data)
        weatherData.value.error = '无法获取天气数据'
      }
    } catch (error) {
      console.error('默认位置天气数据获取失败:', error)
      weatherData.value.error = '获取天气数据失败'
    } finally {
      weatherData.value.loading = false
    }
  }

  // 预加载天气数据
  const preloadWeatherData = (): void => {
    // 尝试从缓存加载天气数据，提供即时显示
    if (checkCachedWeather()) {
      console.log('组件挂载时已从缓存加载天气数据')
    } else {
      console.log('没有可用的天气数据缓存，将通过位置权限检查流程获取')
    }
  }

  // 检查位置授权状态
  const checkLocationPermission = async (): Promise<void> => {
    console.log('检查位置授权状态')
    const authorized = Cookies.get('locationAuthorized')

    if (authorized === 'true') {
      console.log('用户已授权位置')
      // 用户已授权，尝试从Cookie获取位置数据
      locationAuthorized.value = true
      const savedLocationData = Cookies.get('locationData')
      
      if (savedLocationData) {
        try {
          console.log('从Cookie获取位置数据')
          const parsedData = JSON.parse(savedLocationData)
          
          // 检查Cookie中的位置数据是否为香港，如果是，可能是之前的代理问题
          if (parsedData.city === '香港') {
            console.warn('检测到Cookie中的位置是香港，可能是之前的代理问题，尝试重新获取位置')
            throw new Error('位置数据可能不准确')
          }
          
          locationData.value = parsedData
          console.log('使用Cookie中的位置数据:', locationData.value)
          await fetchWeather()
        } catch (error) {
          console.error('解析位置数据失败或位置数据不准确:', error)
          // 尝试重新获取位置
          try {
            console.log('尝试重新获取位置')
            const position = await getUserLocation()
            const cityInfo = await getCityByLocation(position.coords.latitude, position.coords.longitude)
            
            // 检查获取到的位置是否为香港，如果是，可能是代理问题
            if (cityInfo.city === '香港') {
              console.warn('检测到获取的位置是香港，可能是代理问题，使用默认位置')
              await useDefaultLocation()
              return
            }
            
            locationData.value = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              city: cityInfo.city,
              adcode: cityInfo.adcode
            }
            console.log('重新获取位置成功:', locationData.value)
            Cookies.set('locationData', JSON.stringify(locationData.value), { expires: 30 })
            await fetchWeather()
          } catch (error) {
            console.error('重新获取位置失败:', error)
            // 尝试使用IP定位
            await useIpLocationFallback()
          }
        }
      } else {
        // Cookie中没有位置数据，尝试重新获取
        try {
          console.log('Cookie中没有位置数据，尝试获取位置')
          const position = await getUserLocation()
          const cityInfo = await getCityByLocation(position.coords.latitude, position.coords.longitude)
          
          // 检查获取到的位置是否为香港，如果是，可能是代理问题
          if (cityInfo.city === '香港') {
            console.warn('检测到获取的位置是香港，可能是代理问题，使用默认位置')
            await useDefaultLocation()
            return
          }
          
          locationData.value = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            city: cityInfo.city,
            adcode: cityInfo.adcode
          }
          console.log('获取位置成功:', locationData.value)
          Cookies.set('locationData', JSON.stringify(locationData.value), { expires: 30 })
          await fetchWeather()
        } catch (error) {
          console.error('获取位置失败:', error)
          // 尝试使用IP定位
          await useIpLocationFallback()
        }
      }
    } else if (authorized === 'false') {
      // 用户已拒绝，使用IP定位
      console.log('用户已拒绝位置授权，使用IP定位')
      locationAuthorized.value = false
      await useIpLocationFallback()
    } else {
      // 首次访问，显示授权对话框
      console.log('首次访问，显示授权对话框')
      showLocationDialog.value = true
      
      // 同时尝试使用IP定位作为备选
      await useIpLocationFallback()
    }
  }

  // 初始化
  const initWeather = () => {
    // 确保使用最新的天气设置 - 强制从cookie重新读取
    weatherSettings.value = loadWeatherSettings()

    // 首先尝试预加载天气数据，避免空白加载状态
    preloadWeatherData()

    // 然后异步检查位置授权并获取最新天气
    setTimeout(() => {
      checkLocationPermission()
    }, 100)

    // 设置定时器，定期检查cookie变化
    cookieCheckInterval = window.setInterval(() => {
      checkCookieChanges()
    }, 10000)
  }

  // 组件挂载时初始化
  onMounted(() => {
    initWeather()
  })

  // 组件卸载时清除定时器
  onUnmounted(() => {
    if (cookieCheckInterval !== null) {
      clearInterval(cookieCheckInterval)
      cookieCheckInterval = null
    }
  })

  // 重置位置信息
  const resetLocation = async (): Promise<void> => {
    console.log('重置位置信息')
    // 清除位置相关的cookie
    Cookies.remove('locationAuthorized')
    Cookies.remove('locationData')
    locationAuthorized.value = false
    
    // 重新请求位置权限
    await requestLocationPermission()
    
    // 重新获取天气数据
    await fetchWeather()
  }

  return {
    weatherData,
    weatherSettings,
    locationData,
    showLocationDialog,
    locationAuthorized,
    locationLoading,
    locationError,
    showCitySelector,
    selectedCity,
    commonCities,
    fetchWeather,
    requestLocationPermission,
    denyLocationPermission,
    selectCity,
    confirmCitySelection,
    resetLocation,
    getWeatherIcon,
    loadWeatherSettings,
    updateWeatherSettings
  }
}
