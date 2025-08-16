import { Router } from "express"
import { tokenMiddleware } from "../middlewares/tokenMiddleware"
import { adminMiddleware } from "../middlewares/adminMiddleware"
import { clientMiddleware } from "../middlewares/clientMiddleware"
import { 
    adminGetServerInfo, 
    getServerInfo, 
    getServerList,
    clientGetServerInfo,
    clientGetServerList,
    adminGetServerList,
    getServerAboutListByServerId,
    adminAuditServerAbout,
    adminAuditServerInfo,
    updateServer,
    delServer,
    delServers,
    createServer
 } from "../controllers/server.controller"

export const router = Router()

const TempFunc = () => {
    throw new Error('NotImplementedError')
}

/**
 * @swagger
 * tags:
 *   name: 服务器模块
 *   description: 服务器信息管理相关接口（包含用户、管理员、客户端三种权限）
 */

/**
 * 用户权限 API 路由
 */

/**
 * @swagger
 * /server/list:
 *   get:
 *     summary: 获取服务器列表
 *     description: 分页获取当前用户有权访问的服务器列表，需传入分页参数
 *     tags: [服务器模块]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: pageSize
 *         required: true
 *         schema:
 *           type: integer
 *           example: 10
 *         description: 每页条数（必须为数字）
 *       - in: query
 *         name: pageNum
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: 页码（必须为数字，从1开始）
 *     responses:
 *       200:
 *         description: 获取成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Get server list success
 *                 data:
 *                   type: object
 *                   properties:
 *                     list:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "srv_123456"
 *                           name:
 *                             type: string
 *                             example: "生存服务器"
 *                           server_icon_url:
 *                             type: string
 *                             example: "https://example.com/icon.png"
 *                           country:
 *                             type: string
 *                             example: "CN"
 *                           audit_status:
 *                             type: string
 *                             example: "approved"
 *                     total:
 *                       type: integer
 *                       example: 50
 *       400:
 *         description: 参数错误（页码或每页条数不是数字）
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Page size and page num must be numbers
 *       401:
 *         description: 未授权（token无效或缺失）
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: 未授权访问
 *       404:
 *         description: 服务器列表不存在
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: Servers list not found
 */
// 获取服务器列表
router.get('/list', tokenMiddleware, getServerList)

/**
 * @swagger
 * /server:
 *   post:
 *     summary: 创建服务器
 *     description: 创建新的服务器记录，返回服务器ID
 *     tags: [服务器模块]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: 服务器名称
 *                 example: "新生存服务器"
 *               server_icon_url:
 *                 type: string
 *                 description: 服务器图标URL
 *                 example: "https://example.com/new-icon.png"
 *               country:
 *                 type: string
 *                 description: 服务器所在国家（ISO代码）
 *                 example: "CN"
 *               user_id:
 *                 type: string
 *                 description: 服务器负责人ID
 *                 example: "user_789"
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: 创建时间
 *                 example: "2023-08-01T12:00:00Z"
 *               todo:
 *                 type: string
 *                 description: 待办事项
 *                 example: "配置服务器插件"
 *               audit_status:
 *                 type: string
 *                 description: 审核状态
 *                 example: "pending"
 *               audit_reason:
 *                 type: string
 *                 description: 审核原因（未审核时可为空）
 *                 example: ""
 *     responses:
 *       200:
 *         description: 创建成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Create server success
 *                 data:
 *                   type: string
 *                   example: "srv_789012"
 *       400:
 *         description: 创建失败（参数错误）
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Create server failed
 *       401:
 *         description: 未授权
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: 未授权访问
 */
// 创建服务器
router.post('/', tokenMiddleware, createServer)

/**
 * @swagger
 * /server/about/multi/{serverId}:
 *   get:
 *     summary: 获取单个服务器的多个详细信息
 *     description: 分页获取指定服务器的详细信息列表
 *     tags: [服务器模块]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serverId
 *         required: true
 *         schema:
 *           type: string
 *         description: 服务器ID
 *         example: "srv_123456"
 *       - in: query
 *         name: pageSize
 *         required: true
 *         schema:
 *           type: integer
 *           example: 10
 *         description: 每页条数（必须为数字）
 *       - in: query
 *         name: pageNum
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: 页码（必须为数字，从1开始）
 *     responses:
 *       200:
 *         description: 获取成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Get server about list success
 *                 data:
 *                   type: object
 *                   properties:
 *                     list:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "about_123"
 *                           about:
 *                             type: string
 *                             example: "服务器详细介绍"
 *                           docs_url:
 *                             type: string
 *                             example: "https://example.com/docs"
 *                           ip:
 *                             type: object
 *                             properties:
 *                               ip:
 *                                 type: string
 *                                 example: "192.168.1.100"
 *                           server_type:
 *                             type: string
 *                             example: "原版服务器"
 *                           audit_status:
 *                             type: string
 *                             example: "approved"
 *       400:
 *         description: 参数错误（页码或每页条数不是数字）
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Page size and page num must be numbers
 *       401:
 *         description: 未授权
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: 未授权访问
 *       404:
 *         description: 详细信息不存在
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: Server about list not found
 */
// 获取单个服务器的多个详细信息
router.get('/about/multi/:serverId', tokenMiddleware, getServerAboutListByServerId)

/**
 * @swagger
 * /server/{serverId}:
 *   get:
 *     summary: 获取单个服务器信息
 *     description: 根据服务器ID获取服务器基本信息
 *     tags: [服务器模块]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serverId
 *         required: true
 *         schema:
 *           type: string
 *         description: 服务器ID
 *         example: "srv_123456"
 *     responses:
 *       200:
 *         description: 获取成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Get server info success
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "srv_123456"
 *                     name:
 *                       type: string
 *                       example: "生存服务器"
 *                     server_icon_url:
 *                       type: string
 *                       example: "https://example.com/icon.png"
 *                     country:
 *                       type: string
 *                       example: "CN"
 *                     user_id:
 *                       type: string
 *                       example: "user_789"
 *                     date:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-07-01T12:00:00Z"
 *                     todo:
 *                       type: string
 *                       example: "配置服务器插件"
 *                     audit_status:
 *                       type: string
 *                       example: "approved"
 *       400:
 *         description: 缺少服务器ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Server ID is required
 *       401:
 *         description: 未授权
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: 未授权访问
 *       404:
 *         description: 服务器不存在
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: Server not found
 */
// 获取单个服务器信息
router.get('/:serverId', tokenMiddleware, getServerInfo)

/**
 * @swagger
 * /server/{serverId}:
 *   delete:
 *     summary: 删除服务器
 *     description: 根据服务器ID删除指定服务器
 *     tags: [服务器模块]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serverId
 *         required: true
 *         schema:
 *           type: string
 *         description: 服务器ID
 *         example: "srv_123456"
 *     responses:
 *       200:
 *         description: 删除成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Delete server success
 *       400:
 *         description: 缺少服务器ID或删除失败
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Server ID is required
 *       401:
 *         description: 未授权
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: 未授权访问
 */
// 删除服务器
router.delete('/:serverId', tokenMiddleware, delServer)

/**
 * @swagger
 * /server/{serverId}:
 *   put:
 *     summary: 更新服务器信息
 *     description: 根据服务器ID更新服务器信息
 *     tags: [服务器模块]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serverId
 *         required: true
 *         schema:
 *           type: string
 *         description: 服务器ID
 *         example: "srv_123456"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: 服务器名称
 *                 example: "生存服务器-更新"
 *               server_icon_url:
 *                 type: string
 *                 description: 服务器图标URL
 *                 example: "https://example.com/update-icon.png"
 *               country:
 *                 type: string
 *                 description: 服务器所在国家
 *                 example: "CN"
 *               user_id:
 *                 type: string
 *                 description: 服务器负责人ID
 *                 example: "user_789"
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: 更新时间
 *                 example: "2023-08-02T12:00:00Z"
 *               todo:
 *                 type: string
 *                 description: 待办事项
 *                 example: "更新服务器插件"
 *               audit_status:
 *                 type: string
 *                 description: 审核状态
 *                 example: "pending"
 *               audit_reason:
 *                 type: string
 *                 description: 审核原因
 *                 example: "信息更新需重新审核"
 *     responses:
 *       200:
 *         description: 更新成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Update server success
 *       400:
 *         description: 缺少服务器ID或更新失败
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Server ID is required
 *       401:
 *         description: 未授权
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: 未授权访问
 */
// 更新服务器
router.put('/:serverId', tokenMiddleware, updateServer)

/**
 * 管理员权限 API 路由
 */

/**
 * @swagger
 * /server/admin/list:
 *   get:
 *     summary: 管理员获取所有服务器信息
 *     description: 管理员分页获取系统中所有服务器的列表
 *     tags: [服务器模块]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: pageSize
 *         required: true
 *         schema:
 *           type: integer
 *           example: 10
 *         description: 每页条数（必须为数字）
 *       - in: query
 *         name: pageNum
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: 页码（必须为数字，从1开始）
 *     responses:
 *       200:
 *         description: 获取成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Get server list success
 *                 data:
 *                   type: object
 *                   properties:
 *                     list:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "srv_123456"
 *                           name:
 *                             type: string
 *                             example: "生存服务器"
 *                           server_icon_url:
 *                             type: string
 *                             example: "https://example.com/icon.png"
 *                           country:
 *                             type: string
 *                             example: "CN"
 *                           user_id:
 *                             type: string
 *                             example: "user_789"
 *                           audit_status:
 *                             type: string
 *                             example: "approved"
 *                     total:
 *                       type: integer
 *                       example: 100
 *       400:
 *         description: 参数错误（页码或每页条数不是数字）
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Page size and page num must be numbers
 *       401:
 *         description: 未授权
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: 未授权访问
 *       403:
 *         description: 没有管理员权限
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: integer
 *                   example: 403
 *                 message:
 *                   type: string
 *                   example: 没有管理员权限
 *       404:
 *         description: 服务器列表不存在
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: Servers list not found
 */
// 获取所有服务器信息
router.get('/admin/list', adminMiddleware, adminGetServerList)

/**
 * @swagger
 * /server/admin/audit/{serverId}:
 *   post:
 *     summary: 管理员审核服务器
 *     description: 管理员审核指定服务器的信息，更新审核状态和原因
 *     tags: [服务器模块]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serverId
 *         required: true
 *         schema:
 *           type: string
 *         description: 服务器ID
 *         example: "srv_123456"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - audit_status
 *             properties:
 *               audit_status:
 *                 type: string
 *                 description: 审核状态（approved/rejected/pending）
 *                 example: "approved"
 *               audit_reason:
 *                 type: string
 *                 description: 审核原因
 *                 example: "信息完整，符合要求"
 *     responses:
 *       200:
 *         description: 审核成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Audit server success
 *       400:
 *         description: 缺少服务器ID或审核失败
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Server ID is required
 *       401:
 *         description: 未授权
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: 未授权访问
 *       403:
 *         description: 没有管理员权限
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: integer
 *                   example: 403
 *                 message:
 *                   type: string
 *                   example: 没有管理员权限
 */
// 审核服务器
router.post('/admin/audit/:serverId', adminMiddleware, adminAuditServerInfo)

/**
 * @swagger
 * /server/admin/audit/about/{serverId}:
 *   post:
 *     summary: 管理员审核服务器关于信息
 *     description: 管理员审核指定服务器的详细信息，更新审核状态和原因
 *     tags: [服务器模块]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serverId
 *         required: true
 *         schema:
 *           type: string
 *         description: 服务器ID
 *         example: "srv_123456"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - audit_status
 *             properties:
 *               audit_status:
 *                 type: string
 *                 description: 审核状态（approved/rejected/pending）
 *                 example: "approved"
 *               audit_reason:
 *                 type: string
 *                 description: 审核原因
 *                 example: "详细信息完整，符合要求"
 *     responses:
 *       200:
 *         description: 审核成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Audit server about success
 *       400:
 *         description: 缺少服务器ID或审核失败
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Server ID is required
 *       401:
 *         description: 未授权
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: 未授权访问
 *       403:
 *         description: 没有管理员权限
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: integer
 *                   example: 403
 *                 message:
 *                   type: string
 *                   example: 没有管理员权限
 */
// 审核服务器关于信息
router.post('/admin/audit/about/:serverId', adminMiddleware, adminAuditServerAbout)

/**
 * @swagger
 * /server/admin/{serverId}:
 *   get:
 *     summary: 管理员获取单个服务器信息
 *     description: 管理员获取指定服务器的详细信息（包含完整字段）
 *     tags: [服务器模块]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serverId
 *         required: true
 *         schema:
 *           type: string
 *         description: 服务器ID
 *         example: "srv_123456"
 *     responses:
 *       200:
 *         description: 获取成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Get server info success
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "srv_123456"
 *                     name:
 *                       type: string
 *                       example: "生存服务器"
 *                     server_icon_url:
 *                       type: string
 *                       example: "https://example.com/icon.png"
 *                     country:
 *                       type: string
 *                       example: "CN"
 *                     user_id:
 *                       type: string
 *                       example: "user_789"
 *                     date:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-07-01T12:00:00Z"
 *                     todo:
 *                       type: string
 *                       example: "配置服务器插件"
 *                     audit_status:
 *                       type: string
 *                       example: "approved"
 *                     audit_reason:
 *                       type: string
 *                       example: "信息完整，符合要求"
 *       400:
 *         description: 缺少服务器ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Server ID is required
 *       401:
 *         description: 未授权
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: 未授权访问
 *       403:
 *         description: 没有管理员权限
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: integer
 *                   example: 403
 *                 message:
 *                   type: string
 *                   example: 没有管理员权限
 *       404:
 *         description: 服务器不存在
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: Server not found
 */
// 获取单个服务器信息
router.get('/admin/:serverId', adminMiddleware, adminGetServerInfo)

/**
 * @swagger
 * /server/admin/{serverId}:
 *   delete:
 *     summary: 管理员删除多个服务器
 *     description: 管理员批量删除服务器，通过请求体传入服务器ID数组
 *     tags: [服务器模块]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serverId
 *         required: true
 *         schema:
 *           type: string
 *         description: 占位参数（实际通过请求体传入ID列表）
 *         example: "placeholder"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - serverIds
 *             properties:
 *               serverIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: 服务器ID数组
 *                 example: ["srv_123456", "srv_789012"]
 *     responses:
 *       200:
 *         description: 删除成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Delete servers success
 *       400:
 *         description: 缺少服务器ID列表或删除失败
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Server IDs are required
 *       401:
 *         description: 未授权
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: 未授权访问
 *       403:
 *         description: 没有管理员权限
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: integer
 *                   example: 403
 *                 message:
 *                   type: string
 *                   example: 没有管理员权限
 */
// 删除服务器
router.delete('/admin/:serverId', adminMiddleware, delServers)

/**
 * @swagger
 * /server/admin/{serverId}:
 *   put:
 *     summary: 管理员更新服务器
 *     description: 管理员更新指定服务器的信息（拥有全部字段更新权限）
 *     tags: [服务器模块]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serverId
 *         required: true
 *         schema:
 *           type: string
 *         description: 服务器ID
 *         example: "srv_123456"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: 服务器名称
 *                 example: "生存服务器-管理员更新"
 *               server_icon_url:
 *                 type: string
 *                 description: 服务器图标URL
 *                 example: "https://example.com/admin-update-icon.png"
 *               country:
 *                 type: string
 *                 description: 服务器所在国家
 *                 example: "CN"
 *               user_id:
 *                 type: string
 *                 description: 服务器负责人ID（可变更）
 *                 example: "user_456"
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: 更新时间
 *                 example: "2023-08-03T12:00:00Z"
 *               todo:
 *                 type: string
 *                 description: 待办事项
 *                 example: "完成服务器安全加固"
 *               audit_status:
 *                 type: string
 *                 description: 审核状态（管理员可直接变更）
 *                 example: "approved"
 *               audit_reason:
 *                 type: string
 *                 description: 审核原因
 *                 example: "管理员更新，保持通过状态"
 *     responses:
 *       200:
 *         description: 更新成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Update server success
 *       400:
 *         description: 缺少服务器ID或更新失败
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Server ID is required
 *       401:
 *         description: 未授权
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: 未授权访问
 *       403:
 *         description: 没有管理员权限
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: integer
 *                   example: 403
 *                 message:
 *                   type: string
 *                   example: 没有管理员权限
 */
// 更新服务器
router.put('/admin/:serverId', adminMiddleware, updateServer)

/**
 * 客户端权限 API 路由
 */

/**
 * @swagger
 * /server/client/list:
 *   get:
 *     summary: 客户端获取服务器列表
 *     description: 客户端分页获取可访问的服务器列表
 *     tags: [服务器模块]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pageSize
 *               - pageNum
 *             properties:
 *               pageSize:
 *                 type: integer
 *                 example: 10
 *                 description: 每页条数（必须为数字）
 *               pageNum:
 *                 type: integer
 *                 example: 1
 *                 description: 页码（必须为数字，从1开始）
 *     responses:
 *       200:
 *         description: 获取成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Get server list success
 *                 data:
 *                   type: object
 *                   properties:
 *                     list:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "srv_123456"
 *                           name:
 *                             type: string
 *                             example: "客户端可访问服务器"
 *                           server_icon_url:
 *                             type: string
 *                             example: "https://example.com/client-icon.png"
 *                           country:
 *                             type: string
 *                             example: "CN"
 *                           audit_status:
 *                             type: string
 *                             example: "approved"
 *                     total:
 *                       type: integer
 *                       example: 30
 *       400:
 *         description: 参数错误（页码或每页条数不是数字）
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Page size and page num must be numbers
 *       401:
 *         description: 未授权
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: 未授权访问
 *       403:
 *         description: 没有客户端权限
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: integer
 *                   example: 403
 *                 message:
 *                   type: string
 *                   example: 没有客户端权限
 *       404:
 *         description: 服务器列表不存在
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: Servers list not found
 */
// 客户端获取服务器列表
router.get('/client/list', clientMiddleware, clientGetServerList)

/**
 * @swagger
 * /server/client/{serverId}:
 *   get:
 *     summary: 客户端获取单个服务器信息
 *     description: 客户端获取指定服务器的信息
 *     tags: [服务器模块]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serverId
 *         required: true
 *         schema:
 *           type: string
 *         description: 服务器ID
 *         example: "srv_123456"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - serverId
 *             properties:
 *               serverId:
 *                 type: string
 *                 description: 服务器ID
 *                 example: "srv_123456"
 *     responses:
 *       200:
 *         description: 获取成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Get server info success
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "srv_123456"
 *                     name:
 *                       type: string
 *                       example: "客户端可访问服务器"
 *                     server_icon_url:
 *                       type: string
 *                       example: "https://example.com/client-icon.png"
 *                     country:
 *                       type: string
 *                       example: "CN"
 *                     audit_status:
 *                       type: string
 *                       example: "approved"
 *       400:
 *         description: 缺少服务器ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Server ID is required
 *       401:
 *         description: 未授权
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: 未授权访问
 *       403:
 *         description: 没有客户端权限或无权访问
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: integer
 *                   example: 403
 *                 message:
 *                   type: string
 *                   example: 没有权限访问该服务器
 *       404:
 *         description: 服务器不存在
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: Server not found
 */
// 客户端获取单个服务器信息
router.get('/client/:serverId', clientMiddleware, clientGetServerInfo)

export default router
    