import { createClient } from '@supabase/supabase-js'

// 从环境变量中获取Supabase配置
// 支持 NEXT_PUBLIC_ 和 VITE_ 前缀的环境变量
const supabaseUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 
                   import.meta.env.VITE_SUPABASE_URL || 
                   process.env.NEXT_PUBLIC_SUPABASE_URL || 
                   process.env.VITE_SUPABASE_URL

const supabaseAnonKey = import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
                       import.meta.env.VITE_SUPABASE_ANON_KEY || 
                       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
                       process.env.VITE_SUPABASE_ANON_KEY

// 确保配置存在
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('缺少Supabase配置。请确保环境变量已正确设置。')
  console.log('当前环境变量:', import.meta.env)
}

// 调试信息
console.log('Supabase URL:', supabaseUrl)

// 创建Supabase客户端
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'Content-Type': 'application/json'
    },
    fetch: (...args) => {
      // 添加自定义的fetch处理，增加重试机制
      return new Promise((resolve, reject) => {
        const maxRetries = 3;
        let retries = 0;
        
        const attemptFetch = () => {
          retries++;
          console.log(`Supabase API 请求尝试 ${retries}/${maxRetries}`);
          
          fetch(...args)
            .then(resolve)
            .catch((error) => {
              console.error(`Supabase API 请求失败 (${retries}/${maxRetries}):`, error);
              
              if (retries < maxRetries) {
                console.log(`${500 * retries}ms 后重试...`);
                setTimeout(attemptFetch, 500 * retries); // 指数退避
              } else {
                console.error('Supabase API 请求失败，已达到最大重试次数');
                reject(error);
              }
            });
        };
        
        attemptFetch();
      });
    }
  }
})

// 添加错误处理
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Supabase 认证状态变更:', event)
  if (event === 'SIGNED_OUT') {
    console.log('用户已登出')
  } else if (event === 'SIGNED_IN') {
    console.log('用户已登录')
  } else if (event === 'TOKEN_REFRESHED') {
    console.log('令牌已刷新')
  } else if (event === 'USER_UPDATED') {
    console.log('用户信息已更新')
  }
})

// 身份验证相关方法
export const auth = {
  // 使用邮箱和密码注册
  signUp: async (email: string, password: string) => {
    return await supabase.auth.signUp({
      email,
      password,
    })
  },

  // 使用邮箱和密码登录
  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    })
  },

  // 退出登录
  signOut: async () => {
    return await supabase.auth.signOut()
  },

  // 获取当前用户
  getUser: async () => {
    return await supabase.auth.getUser()
  },

  // 获取会话
  getSession: async () => {
    return await supabase.auth.getSession()
  },
}

// 数据库操作方法
export const db = {
  // 从表中获取数据
  select: async (table: string, options?: any) => {
    return await supabase.from(table).select(options?.columns || '*')
  },

  // 插入数据到表中
  insert: async (table: string, data: any) => {
    return await supabase.from(table).insert(data)
  },

  // 更新表中的数据
  update: async (table: string, data: any, match: any) => {
    return await supabase.from(table).update(data).match(match)
  },

  // 删除表中的数据
  delete: async (table: string, match: any) => {
    return await supabase.from(table).delete().match(match)
  },
}

// 存储操作方法
export const storage = {
  // 上传文件
  upload: async (bucket: string, path: string, file: File) => {
    return await supabase.storage.from(bucket).upload(path, file)
  },

  // 下载文件
  download: async (bucket: string, path: string) => {
    return await supabase.storage.from(bucket).download(path)
  },

  // 获取文件公共URL
  getPublicUrl: (bucket: string, path: string) => {
    return supabase.storage.from(bucket).getPublicUrl(path)
  },

  // 删除文件
  remove: async (bucket: string, paths: string[]) => {
    return await supabase.storage.from(bucket).remove(paths)
  },
}

export default {
  client: supabase,
  auth,
  db,
  storage,
}