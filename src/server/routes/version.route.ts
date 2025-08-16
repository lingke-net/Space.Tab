import { Router } from "express"
import {
    findAllGithubMirror,
    findGithubMirrorById,
    findVersionByMirror,
    addGithubMirror
} from '../models/version.model'
import ApiResponse from "../utils/apiResp"

import { tokenMiddleware } from "../middlewares/tokenMiddleware"
import { adminMiddleware } from "../middlewares/adminMiddleware"
import { clientMiddleware } from "../middlewares/clientMiddleware"

export const router = Router()

/**
 * @swagger
 * /version/github/mirror:
 *   get:
 *     summary: 获取单个GitHub镜像
 *     description: 通过镜像ID获取GitHub镜像详情，需要管理员权限
 *     tags:
 *       - 版本管理
 *     # 移除安全要求，公开API
 *     parameters:
 *       - name: id
 *         in: query
 *         description: 镜像ID
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
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
 *                   example: Get mirror info successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: GitHub Mirror
 *                     url:
 *                       type: string
 *                       example: https://api.github.com
 *                     description:
 *                       type: string
 *                       example: A mirror of GitHub repository
 *                     created_at:
 *                       type: string
 *                       example: 2021-01-01T00:00:00.000Z
 * 
 *       400:
 *         description: 缺少必要的字段或参数格式错误
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
 *                   example: Missing required fields
 *       404:
 *         description: 用户不存在
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
 *                   example: User not found
 *       500:
 *         description: 服务器内部错误
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
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal Server Error, Please contact support
 */
router.get('/github/mirror', adminMiddleware, async (req, res) => {
    try {
        const { id } = req.query

        if (!id) {
            res.status(400).json(ApiResponse.error(400, 'id is required'))
            return
        }

        const mirror = await findGithubMirrorById(Number(id))

        if (!mirror) {
            res.status(404).json(ApiResponse.error(404, 'Mirror not found'))
            return
        }

        res.status(200).json(ApiResponse.success(200, 'Get mirror success', mirror))
        return
    } catch (err) {
        res.status(500).json(ApiResponse.error(500, 'Internal Server Error: Please contact support'))
        console.log(err)
    }
})

/**
 * @swagger
 * /version/github/mirror/list:
 *   get:
 *     summary: 获取GitHub镜像列表
 *     description: 获取所有GitHub镜像列表，需要管理员权限
 *     tags:
 *       - 版本管理
 *     # 公开API，无需认证
 *     responses:
 *       200:
 *         description: 获取镜像列表成功
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
 *                   example: Get mirror list success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: GitHub Mirror
 *                       url:
 *                         type: string
 *                         example: https://api.github.com
 *                       created_at:
 *                         type: string
 *                         example: 2021-01-01T00:00:00.000Z
 *       500:
 *         description: 服务器内部错误
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
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal Server Error, Please contact support
 */
router.get('/github/mirror/list', adminMiddleware, async (req, res) => {
    try {
        const mirrorList = await findAllGithubMirror()
        if (!mirrorList) {
            res.status(500).json(ApiResponse.error(500, 'Internal Server Error: Please contact support'))
            return
        }
        res.status(200).json(ApiResponse.success(200, 'Get mirror list success', mirrorList))
    } catch (err) {
        res.status(500).json(ApiResponse.error(500, 'Internal Server Error: Please contact support'))
        console.log(err)
    }
})

/**
 * @swagger
 * /version/github/mirror:
 *   post:
 *     summary: 添加GitHub镜像
 *     description: 添加新的GitHub镜像，需要管理员权限
 *     tags:
 *       - 版本管理
 *     # 公开API，无需认证
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: 镜像名称
 *                 example: "GitHub Public Mirror"
 *               url:
 *                 type: string
 *                 description: 镜像URL
 *                 example: "https://github.com/mirror"
 *             required:
 *               - name
 *               - url
 *     responses:
 *       200:
 *         description: 添加镜像成功
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
 *                   example: Add mirror success
 *       404:
 *         description: 用户不存在
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
 *                   example: User not found
 *       500:
 *         description: 服务器内部错误
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
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal Server Error, Please contact support
 */
router.post('/github/mirror', adminMiddleware, async (req, res) => {
    try {
        const { name, url } = req.body
        if (!name || !url) {
            res.status(400).json(ApiResponse.error(400, 'name and url are required'))
            return
        }
        const result = await addGithubMirror(name, url)
        if (!result) {
            res.status(500).json(ApiResponse.error(500, 'Internal Server Error: Please contact support'))
            return
        }
        res.status(200).json(ApiResponse.success(200, 'Add mirror success'))
    } catch (err) {
        res.status(500).json(ApiResponse.error(500, 'Internal Server Error: Please contact support'))
        console.log(err)
    }
})

/**
 * @swagger
 * /version/getLatestList:
 *   get:
 *     summary: 获取发行版最新列表
 *     description: 根据镜像ID分页获取最新发行版列表，公开API无需认证
 *     tags:
 *       - 版本管理
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: mirrorId
 *         in: query
 *         description: 镜像ID
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *       - name: pageNum
 *         in: query
 *         description: 页码
 *         required: true
 *         schema:
 *           type: integer
 *           format: int32
 *           minimum: 1
 *           default: 1
 *       - name: pageSize
 *         in: query
 *         description: 每页数量
 *         required: true
 *         schema:
 *           type: integer
 *           format: int32
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *     responses:
 *       200:
 *         description: 获取版本列表成功
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
 *                   example: Get version list success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       tag_name:
 *                         type: string
 *                         example: 2.5.0
 *                       prerelease:
 *                         type: boolean
 *                         example: false
 *                       created_at:
 *                         type: string
 *                         example: 2023-01-01T00:00:00Z
 *                       assets:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             name:
 *                               type: string
 *                               example: 2.5.0-linux-x64.tar.gz
 *                             size:
 *                               type: integer
 *                               example: 1024
 *                             download_count:
 *                               type: integer
 *                               example: 1024
 *                             digest:
 *                               type: string
 *                               example: sha256:1234567890
 *                             browser_download_url:
 *                               type: string
 *                               example: https://github.com/WonderLab/WonderLab/releases/download/2.5.0/2.5.0-linux-x64.tar.gz

 *       404:
 *         description: 用户不存在
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
 *                   example: User not found
 *       500:
 *         description: 服务器内部错误
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
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal Server Error, Please contact support
 */
router.get('/getLatestList', async (req, res) => {
    try {
        const { mirrorId, pageNum, pageSize } = req.query;

        if (!mirrorId || !pageNum || !pageSize) {
            res.status(400).json(ApiResponse.error(400, 'mirrorId, pageNum, pageSize are required'))
            return
        }

        const parsedMirrorId = Number(mirrorId);
        const parsedPageNum = Number(pageNum);
        const parsedPageSize = Number(pageSize);

        if (isNaN(parsedMirrorId) || isNaN(parsedPageNum) || isNaN(parsedPageSize)) {
            res.status(400).json(ApiResponse.error(400, 'mirrorId, pageNum, pageSize must be number'))
            return
        }

        const versions = await findVersionByMirror(parsedMirrorId, parsedPageNum, parsedPageSize);

        if (!versions || versions.length === 0) {
            res.status(404).json(ApiResponse.error(404, 'Not found version'))
            return
        }

        res.status(200).json(ApiResponse.success(200, 'Get version list success', versions));
    } catch (err: any) {
        console.error('Interface processing exception:', err.stack || err);

        res.status(500).json(ApiResponse.error(500, 'Internal Server Error: ' + err.message))
        return

    }
})

router.post('/getLatest', clientMiddleware, async (req, res) => {
    try {
        console.log(req.body);

        console.log();
        const resp = {
            latest: '2.5.0',
            downloadUrl: 'https://github.com/WonderLab/WonderLab/releases/download/2.5.0/WonderLab-2.5.0.exe',
        }
        res.status(200).json(ApiResponse.success(200, 'This is a test response: Get latest version success', resp))
        console.log(resp);

    } catch (err) {
        res.status(500).json(ApiResponse.error(500, 'Internal Server Error: Please contact support'))
        console.log(err)
    }
})

export default router;