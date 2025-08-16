import mysql, { Pool } from 'mysql2/promise'
import { Redis } from 'ioredis'
import ConsoleLog from '../utils/consoleLog'
import 'dotenv/config'

export const mysqlConnection : Pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

export const redisClient : Redis = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
    db: Number(process.env.REDIS_DATABASE || 0)
})

export async function connectToDatabases() {
    try {
        const mysqlConnectionTest = await mysqlConnection.getConnection()
        ConsoleLog.log('✅ MySQL链接成功')
        mysqlConnectionTest.release()

        redisClient.on('error', (err: Error) => {
            ConsoleLog.error(`❌ Redis连接错误:`, err)
        })

        await redisClient.ping()
        ConsoleLog.log('✅ Redis链接成功')
    } catch (error) {
        ConsoleLog.error(`❌ 数据库连接错误:`, error)
        throw error
    }
}