import express, { Express } from "express"
import dotenv from "dotenv"
import cors from 'cors'
import ViteExpress from "vite-express"
import { connectToDatabases, redisClient } from './config/database'
import morgan from 'morgan'
import { Server } from "http"
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './utils/swagger'
import helmet from 'helmet'

import userRoute from './routes/user.route'
import versionRoute from './routes/version.route'
import equipmentRoute from './routes/equipment.route'
import serverRoute from './routes/server.route'
import ApiResponse from "./utils/apiResp"
import ConsoleLog from "./utils/consoleLog"

dotenv.config()

const app: Express = express()

const isDev : boolean = process.env.NODE_ENV !== 'production'

if (isDev) {
  app.use(
    morgan('dev', {
      skip: function (req, res) {
        const apiPathRegex = /^\/api(\/|$)/;
        return !apiPathRegex.test(req.originalUrl);
      }
    })
  )
} else { 
  app.use(
    morgan('combined', {
      skip: function (req, res) {
        const apiPathRegex = /^\/api(\/|$)/;
        return !apiPathRegex.test(req.originalUrl);
      }
    })
  )
}

app.use(helmet({
  contentSecurityPolicy: false // 禁用 CSP 安全策略，放行所有资源
}))
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://dream-pep.niho.dpdns.org'
  ],
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.set('etag', false);

app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  next();
});

app.use('/api/hello', (req, res) => {
  res.status(200).json(ApiResponse.success(200, 'If you see this, the server is working.'))
})

app.use('/api/user', userRoute)
app.use('/api/version', versionRoute)
app.use('/api/equipment', equipmentRoute)
app.use('/api/server', serverRoute)
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ 未处理的错误:', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    error: {
      message: err.message,
      stack: err.stack,
      name: err.name
    },
    timestamp: new Date().toISOString()
  })
  
  res.status(500).json({ 
    code: 500, 
    status: 'error',
    message: '内部服务器错误', 
    data: null,
    timestamp: new Date().toISOString()
  })
})

let server : Server
const PORT = Number(process.env.PORT) || 3000

async function startServer() : Promise<void> {
  ConsoleLog.log('🚀 启动 Spacen.Tab 服务器...')
  try {
    ConsoleLog.log('🔌 连接到数据库...')
    await connectToDatabases()
    
    server = ViteExpress.listen(app, PORT, () => {
      ConsoleLog.log(`🎉 Spacen.Tab 服务器启动成功!`)
      ConsoleLog.log(`📍 开发服务器运行在: http://localhost:${PORT}`)
      /*ConsoleLog.log(`📚 API 文档可用在: http://localhost:${PORT}/api/docs`)*/
      ConsoleLog.log(`🌐 运行环境: ${isDev ? '开发环境' : '生产环境'}`)
    })

    process.on('SIGTERM', shutdown)
    process.on('SIGINT', shutdown)
    
  } catch (error) {
    ConsoleLog.error(`❌ 服务器启动失败:`, error)
    process.exit(1)
  }
}

async function shutdown() {
  ConsoleLog.log('🛑 收到关闭信号. 优雅关闭...')

  if (server) {
    server.close(async (err?: Error) => {
      if (err) {
        ConsoleLog.error(`❌ 服务器关闭时发生错误:`, err)
        process.exit(1)
      }

      try {
        ConsoleLog.log('🔌 关闭 Redis 连接...')
        await redisClient.ping()
        await redisClient.quit()
        ConsoleLog.log('✅ Redis 连接关闭') 

        ConsoleLog.log('✅ 服务器关闭成功')
        process.exit(0)
      } catch (error) {
        ConsoleLog.error(`❌ 关闭 Redis 连接时发生错误:`, error)
        process.exit(1)
      }
    })
  }

  setTimeout(() => {
    ConsoleLog.log('⏰ 关闭超时. 强制退出.')
    process.exit(1)
  }, 10000).unref()
}

startServer()