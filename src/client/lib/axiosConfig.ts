import axios from 'axios'
import { toast } from 'vue-sonner'
import Cookies from 'js-cookie'

const service = axios.create({
    baseURL: '/api',
    timeout: 10000,
})

// 创建非响应式的 toast 配置
const createToastConfig = (title: string, description: string, variant: 'destructive' | 'default' = 'destructive', duration?: number) => {
    return {
        variant,
        title,
        description,
        ...(duration && { duration })
    }
}

// 请求拦截器 - 添加日志
service.interceptors.request.use(
    config => {
        const token = Cookies.get('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        // 记录请求日志
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
            params: config.params,
            data: config.data,
            headers: {
                'Content-Type': config.headers['Content-Type'],
                'Authorization': config.headers['Authorization'] ? 'Bearer ***' : 'None'
            }
        });

        return config;
    },
    error => {
        console.error('❌ 请求错误:', error);
        toast.error('请求发送失败', {
            description: error.message || "网络连接异常，请检查网络设置"
        });
        return Promise.reject(error);
    }
);

// 响应拦截器 - 添加日志和错误处理
service.interceptors.response.use(
    response => {
        // 记录成功响应日志
        console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
            status: response.status,
            statusText: response.statusText,
            data: response.data
        });

        // 检查业务逻辑错误
        if (response.data && response.data.status === 'error') {
            console.error(`❌ Business Error: ${response.config.url}`, response.data);
            toast.error('操作失败', {
                description: response.data.message || "服务器返回错误"
            });
        }

        return response;
    },
    error => {
        // 记录错误响应日志
        console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message
        });

        let errorMessage = '网络连接失败';
        let errorTitle = '请求失败';

        if (error.response) {
            const status = error.response.status;
            const data = error.response.data;

            switch (status) {
                case 400:
                    errorTitle = '请求参数错误';
                    errorMessage = data?.message || '请求参数不完整或格式错误';
                    break;
                case 401:
                    errorTitle = '身份验证失败';
                    errorMessage = data?.message || '请重新登录';
                    // 清除用户信息并跳转到登录页
                    Cookies.remove('token');
                    Cookies.remove('userId');
                    Cookies.remove('userInfo');
                    window.location.href = '/login';
                    break;
                case 403:
                    errorTitle = '访问被拒绝';
                    errorMessage = data?.message || '您没有权限执行此操作';
                    break;
                case 404:
                    errorTitle = '资源不存在';
                    errorMessage = data?.message || '请求的资源不存在';
                    break;
                case 429:
                    errorTitle = '请求过于频繁';
                    errorMessage = data?.message || '请稍后再试';
                    break;
                case 500:
                    errorTitle = '服务器内部错误';
                    errorMessage = data?.message || '服务器出现异常，请联系管理员';
                    break;
                case 502:
                    errorTitle = '网关错误';
                    errorMessage = data?.message || '服务器网关异常';
                    break;
                case 503:
                    errorTitle = '服务不可用';
                    errorMessage = data?.message || '服务暂时不可用，请稍后重试';
                    break;
                default:
                    errorTitle = '请求失败';
                    errorMessage = data?.message || `HTTP ${status} 错误`;
            }
        } else if (error.code === 'ECONNABORTED') {
            errorTitle = '请求超时';
            errorMessage = '请求超时，请检查网络连接';
        } else if (error.code === 'NETWORK_ERROR') {
            errorTitle = '网络错误';
            errorMessage = '网络连接异常，请检查网络设置';
        }

        // 显示破坏性 toast
        toast.error(errorTitle, {
            description: errorMessage,
            duration: 5000
        });

        return {
            status: error.response?.status || 500,
            data: error.response?.data || { message: errorMessage },
            headers: error.response?.headers,
            config: error.config,
            request: error.request,
        };
    }
);

export default service