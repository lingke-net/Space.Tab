import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from "vite"
import vue from "@vitejs/plugin-vue"
import { resolve } from 'path'
import { copyFileSync, mkdirSync, existsSync } from 'fs'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [
      vue({
        template: {
          compilerOptions: {
            // 将 spline-viewer 标记为自定义元素，避免 Vue 尝试解析它
            isCustomElement: (tag) => tag === 'spline-viewer'
          }
        }
      }), 
      tailwindcss(),
      // 自定义插件，用于复制扩展必要文件到构建目录
      {
        name: 'copy-extension-files',
        buildEnd() {
          // 复制 manifest.json
          copyFileSync('src/manifest.json', 'dist/manifest.json');
          console.log('Manifest file copied to dist folder');
          
          // 复制 background.js
          copyFileSync('src/background.js', 'dist/background.js');
          console.log('Background script copied to dist folder');
          
          // 创建图标目录
          if (!fs.existsSync('dist/icons')) {
            fs.mkdirSync('dist/icons', { recursive: true });
          }
          
          // 复制图标文件（如果存在）
          const iconSizes = [16, 32, 48, 128];
          iconSizes.forEach(size => {
            const iconPath = `src/icons/icon${size}.png`;
            if (fs.existsSync(iconPath)) {
              copyFileSync(iconPath, `dist/icons/icon${size}.png`);
              console.log(`Icon ${size}px copied to dist folder`);
            }
          });
        }
      }
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src/client"),
      },
    },
    server: {
      port: 5173,
      proxy: {
        // 代理所有 /api 请求到后端
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
        },
        // 代理高德地图API请求
        '/amap-api': {
          target: 'https://restapi.amap.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/amap-api/, ''),
          secure: false,
        },
      },
      allowedHosts: ['space.lingke.ink'],
    },
    build: {
      // 浏览器扩展特定配置
      outDir: 'dist',
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html')
        },
        output: {
          entryFileNames: 'assets/[name].js',
          chunkFileNames: 'assets/[name].js',
          assetFileNames: 'assets/[name].[ext]'
        }
      }
    },
    define: {
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
      // 确保环境变量可用于客户端
      'import.meta.env.NEXT_PUBLIC_SUPABASE_URL': JSON.stringify(env.NEXT_PUBLIC_SUPABASE_URL),
      'import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    }
  }
});
