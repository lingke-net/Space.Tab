import { Router } from "express"
import {
    User,
    findUserById,
    findUserByEmail,
    createUser,
    updateUser,
    deleteUserById,
    findUserByPage,
    getUserCount,
    updateUserPassword,
    updateLastLogin
} from "../models/user.model"
import bcrypt from 'bcryptjs'
import jwt, { SignOptions } from 'jsonwebtoken'
import { redisClient } from '../config/database'
import ApiResponse from "../utils/apiResp"
import { tokenMiddleware } from "../middlewares/tokenMiddleware"
import { adminMiddleware } from "../middlewares/adminMiddleware"

export const router = Router()

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: 创建新用户
 *     description: 通过提供用户名、邮箱和密码注册新用户
 *     tags:
 *       - 用户模块
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: 用户显示名称
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 format: email
 *                 description: 用户邮箱地址
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: 用户密码（至少8个字符）
 *                 example: Password123!
 *               qq_num:
 *                 type: string
 *                 description: qq 账号
 *                 example: 123456789
 *     responses:
 *       200:
 *         description: 用户创建成功
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
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: User created successfully
 *                 data:
 *                   type: object
 *                   example: null
 *       400:
 *         description: 缺少必要的字段
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
 *       409:
 *         description: 邮箱已被注册
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
 *                   example: 409
 *                 message:
 *                   type: string
 *                   example: Email already registered
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
router.post('/register', async (req, res) => {
    try {
        const body = req.body

        if (!body || !body.username || !body.email || !body.password) {
            res.status(400).json(ApiResponse.error(400, 'Bad Request: Missing required fields'))
            return
        }

        const { username, email, password } = req.body

        if (!req.body.username || !req.body.email || !req.body.password) {
            res.status(400).json(ApiResponse.error(400, 'Bad Request: Missing required fields'))
            return
        }

        const existingUser = await findUserByEmail(email)
        if (existingUser) {
            res.status(409).json(ApiResponse.error(409, 'Conflict: User already exists'))
            return
        }

        const hashedPassword = await bcrypt.hash(password, 12)
        const newUser = await createUser(
            {
                username,
                email,
                password: hashedPassword,
                qq_num: body.qq_num || '',
                is_banned: false,
                is_admin: false
            } as User)

        if (!newUser) {
            res.status(500).json(ApiResponse.error(500, 'Internal Server Error: Please contact support'))
            return
        }

        res.status(200).json(ApiResponse.success(200, 'User created successfully', null))
        return
    } catch (err) {
        console.error(err)
        res.status(500).json(ApiResponse.error(500, 'Internal Server Error: Please contact support'))
        return
    }
})

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: 用户登录认证
 *     description: 通过ID/邮箱和密码获取访问令牌
 *     tags:
 *       - 用户模块
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - account
 *               - password
 *             properties:
 *               account:
 *                 type: string
 *                 description: ID/邮箱地址
 *                 example: 10000 或 john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: 用户密码
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: 登录成功
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
 *                   example: Login successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: JWT访问令牌
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     userId:
 *                       type: string
 *                       description: 用户唯一标识
 *                       example: 10000
 *       400:
 *         description: 缺少必要的字段
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
 *       401:
 *         description: 认证失败（用户未注册）
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
 *                   example: User or Email not registered
  *       402:
 *         description: 认证失败（无效的账号或密码）
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
 *                   example: 402
 *                 message:
 *                   type: string
 *                   example: User or Email not registered
 *       403:
 *         description: 用户被封禁
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
 *                   example: User is banned
 *                 details:
 *                   type: object
 *                   properties:
 *                     banReason:
 *                       type: string
 *                       description: 封禁原因
 *                       example: Violation of terms
 *                     banExpiration:
 *                       type: string
 *                       description: 封禁到期时间
 *                       example: 2023-12-31T23:59:59Z
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
router.post('/login', async (req, res) => {
    try {
        const body = req.body

        if (!body || !body.account || !body.password) {
            res.status(400).json(ApiResponse.error(400, 'Bad Request: Missing required fields'))
            return
        }

        if (!req.body || !req.body.account || !req.body.password) {
            res.status(400).json(ApiResponse.error(400, 'Bad Request: Account and password are required'))
            return
        }

        const { account, password } = req.body

        const isEmail = account.includes('@');
        let user: any = undefined;
        if (isEmail) {
            user = await findUserByEmail(account);
            if (!user) {
                res.status(401).json(ApiResponse.error(401, 'User or Email not registered'))
                return;
            }
        } else {
            user = await findUserById(account);
            if (!user) {
                res.status(401).json(ApiResponse.error(401, ' User or Email not registered'))
                return;
            }
        }

        console.log(user);
        

        if (user.is_banned) {
            res.status(403).json(ApiResponse.error(403, 'Forbidden: User is banned', {
                banReason: user.ban_reason || 'No reason provided',
                banExpiration: user.ban_expiration || 'No expiration date'
            }));
            return;
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            res.status(402).json(ApiResponse.error(402, 'Invalid account or password'))
            return;
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET!,
            {
                expiresIn: process.env.JWT_EXPIRES_IN as string,
            } as SignOptions
        );

        await redisClient.set(`user:${user.id}`, JSON.stringify(user), 'EX', 72 * 60 * 60);

        await updateLastLogin(user.id);

        res.status(200).json(ApiResponse.success(200, 'Login successful', {
            token: token,
            userId: user.id
        }));
        return;
    } catch (err) {
        res.status(500).json(ApiResponse.error(500, 'Internal Server Error: Please contact support'))
        console.log(err);
        
    }
});

/**
 * @swagger
 * /user/info/{id}:
 *   get:
 *     summary: 获取用户信息
 *     description: 通过token获取当前登录用户的详细信息
 *     tags:
 *       - 用户模块
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 10000
 *         description: The user ID
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
 *                   example: Success
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: 用户唯一标识
 *                       example: 10000
 *                     username:
 *                       type: string
 *                       description: 用户名
 *                       example: johndoe
 *                     email:
 *                       type: string
 *                       description: 邮箱地址
 *                       example: john@example.com
 *                     is_banned:
 *                       type: boolean
 *                       description: 用户是否被封禁
 *                       example: false
 *                     ban_reason:
 *                       type: string
 *                       description: 封禁原因
 *                       example: Violation of terms
 *                     ban_expiration:
 *                       type: string
 *                       description: 封禁到期时间
 *                       example: 2023-12-31T23:59:59Z
 *                     is_admin:
 *                       type: boolean
 *                       description: 用户是否为管理员
 *                       example: false
 *                     avatar:
 *                       type: string
 *                       description: 用户头像
 *                       example: https://example.com/avatar.jpg
 *                     last_login:
 *                       type: string
 *                       description: 上次登录时间
 *                       example: 2023-12-31T23:59:59Z
 *                     qq_num:
 *                       type: string
 *                       description: QQ 号
 *                       example: 123456789
 *       400:
 *         description: 缺少必要的字段
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
 *       401:
 *         description: Token 失效或未提供
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
 *                   example: Missing token
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
router.get('/info/:id', tokenMiddleware, async (req, res) => {
    try {
        const userId = Number(req.params.id);
        if(isNaN(userId)) {
            res.status(400).json(ApiResponse.error(400, 'Invalid user ID'));
            return;
        }

        const user = await findUserById(userId);
        if (!user) {
            res.status(404).json(ApiResponse.error(404, 'User not found'));
            return;
        }
        res.status(200).json(ApiResponse.success(200, 'Query user info successfully', {
            id: user.id,
            username: user.username,
            email: user.email,
            is_banned: user.is_banned,
            ban_reason: user.ban_reason,
            ban_expiration: user.ban_expiration,
            is_admin: user.is_admin,
            avatar: user.avatar,
            qq_num: user.qq_num,
            last_login: user.last_login,
        }));
    } catch (err) {
        res.status(500).json(ApiResponse.error(500, 'Internal Server Error: Please contact support'))
        console.log(err);
    }
})

/**
 * @swagger
 * /user/update:
 *   post:
 *     summary: 更新用户信息
 *     description: 通过token获取当前登录用户并更新其信息，用户只能更新自己的信息，且无法更新敏感字段如封禁状态、管理员权限等
 *     tags:
 *       - 用户模块
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: 新用户名（选填）
 *                 example: johndoe_new
 *               email:
 *                 type: string
 *                 description: 新邮箱地址（选填）
 *                 example: john_new@example.com
 *               qq_num:
 *                 type: string
 *                 description: qq 号
 *                 example: 123456789
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
 *                   example: Update user info successfully
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
 *       401:
 *         description: Token 失效或未提供
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
 *                   example: Missing token
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
router.post('/update', tokenMiddleware, async (req, res) => {
    try {
        const oldInfo = req.body.user as User;

        const newInfo = req.body;
        newInfo.id = oldInfo.id
        delete newInfo.password;
        delete newInfo.is_banned;
        delete newInfo.is_admin;
        delete newInfo.ban_reason;
        delete newInfo.ban_expiration;
        delete newInfo.created_at;
        delete newInfo.updated_at;
        delete newInfo.last_login;
        delete newInfo.avatar;
        delete newInfo.email_verified;

        const userInfo = { ...oldInfo, ...newInfo };
        delete userInfo.user;

        userInfo.updated_at = new Date();

        const result: any = await updateUser(userInfo);
        console.log('result', result);
        
        if(result.affectedRows === 0) {
            res.status(500).json(ApiResponse.error(500, 'Update user info failed'));
            return;
        }

        res.status(200).json(ApiResponse.success(200, 'Update user info successfully'));
        
        
    } catch (err) {
        res.status(500).json(ApiResponse.error(500, 'Internal Server Error: Please contact support'))
        console.log(err);
    }
})

/**
 * @swagger
 * /user/update/password:
 *   post:
 *     summary: 更新用户密码
 *     description: 通过token获取当前登录用户并更新其密码
 *     tags:
 *       - 用户模块
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPw:
 *                 type: string
 *                 description: 旧密码
 *                 example: oldpassword123
 *               newPw:
 *                 type: string
 *                 description: 新密码（不能与旧密码相同）
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: 密码更新成功
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
 *                   example: Update user password successfully
 *       400:
 *         description: 缺少必要的字段、旧密码错误或新旧密码相同
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
 *                   example: Old password is incorrect
 *       401:
 *         description: Token 失效或未提供
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
 *                   example: Missing token
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
router.post('/update/password', tokenMiddleware, async (req, res) => {
    try {
        const { oldPw, newPw } = req.body

        if(!oldPw || !newPw) {
            res.status(400).json(ApiResponse.error(400, 'Missing required fields'));
            return;
        }

        const { id } = req.body.user;
        
        //判断旧密码是否正确
        const user = await findUserById(id);
        if (!user) {
            res.status(404).json(ApiResponse.error(404, 'User not found'));
            return;
        }
        const isValidPassword = await bcrypt.compare(oldPw, user.password);
        if (!isValidPassword) {
            res.status(400).json(ApiResponse.error(400, 'Old password is incorrect'));
            return;
        }

        // 判断旧密码和新密码是否相同
        if(oldPw === newPw) {
            res.status(400).json(ApiResponse.error(400, 'New password cannot be the same as the old password'));
            return;
        }

        const result: any = await updateUserPassword(id, await bcrypt.hash(newPw, 12));

        if(result.affectedRows === 0) {
            res.status(500).json(ApiResponse.error(500, 'Update user password failed'));
            return;
        }

        redisClient.del(`user:${id}`);
        res.status(200).json(ApiResponse.success(200, 'Update user password successfully'));
        return
    }catch (err) {
        res.status(500).json(ApiResponse.error(500, 'Internal Server Error: Please contact support'))
        console.log(err);
    }
})

/**
 * @swagger
 * /user/list:
 *   get:
 *     summary: 分页获取用户列表
 *     description: 管理员权限获取用户列表
 *     tags:
 *       - 用户模块
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: 分页页码
 *       - in: query
 *         name: size
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: 分页大小
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
 *                   example: Get user list successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       description: 用户总数
 *                     data:
 *                       type: array
 *                       description: 用户列表
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             description: 用户唯一标识
 *                             example: 10000
 *                           username:
 *                             type: string
 *                             description: 用户名
 *                             example: johndoe
 *                           email:
 *                             type: string
 *                             description: 邮箱地址
 *                             example: john@example.com
 *                           is_banned:
 *                             type: boolean
 *                             description: 用户是否被封禁
 *                             example: false
 *                           ban_reason:
 *                             type: string
 *                             description: 封禁原因
 *                             example: Violation of terms
 *                           ban_expiration:
 *                             type: string
 *                             description: 封禁到期时间
 *                             example: 2023-12-31
 *                           is_admin:
 *                             type: boolean
 *                             description: 用户是否为管理员
 *                             example: false
 *                           created_at:
 *                             type: string
 *                             description: 用户创建时间
 *                             example: 2023-01-01 00:00:00
 *                           updated_at:
 *                             type: string
 *                             description: 用户更新时间
 *                             example: 2023-01-01 00:00:00
 *                           last_login:
 *                             type: string
 *                             description: 用户上次登录时间
 *                             example: 2023-01-01 00:00:00
 *                           avatar:
 *                             type: string
 *                             description: 用户头像
 *                             example: https://example.com/avatar.jpg
 *                           qq_num:
 *                             type: string
 *                             description: 用户 QQ 号
 *                             example: 123456789
 *                           email_verified:
 *                             type: boolean
 *                             description: 邮箱是否已验证
 *                             example: true
 *       400:
 *         description: 缺少必要的字段
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
router.get('/list', adminMiddleware, async (req, res) => {
    try {
        const { page, size } = req.query;

        if (!page || !size) {
            res.status(400).json(ApiResponse.error(400, 'Missing required fields'));
            return;
        }

        const pageNum = parseInt(page as string);
        const pageSize = parseInt(size as string);
        const [users, total] = await Promise.all([
            findUserByPage(pageNum, pageSize),
            getUserCount()
        ]);
        
        res.status(200).json(ApiResponse.success(200, 'Get user list successfully', {
            data: users,
            total: total
        }));
    } catch (err) {
        res.status(500).json(ApiResponse.error(500, 'Internal Server Error: Please contact support'))
        console.log(err);
    }
})

/**
 * @swagger
 * /user/ban:
 *   post:
 *     summary: 封禁用户
 *     description: 管理员封禁指定用户，设置封禁原因和期限
 *     tags:
 *       - 用户模块
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: 被封禁用户的ID
 *                 example: "10001"
 *               reason:
 *                 type: string
 *                 description: 封禁原因
 *                 example: "违反社区规定"
 *               duration:
 *                 type: integer
 *                 description: 封禁天数
 *                 example: 7
 *     responses:
 *       200:
 *         description: 封禁成功
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
 *                   example: "Ban user successfully"
 *       400:
 *         description: 参数错误
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
 *                   example: "Missing required fields"
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
 *                   example: "User not found"
 *       500:
 *         description: 服务器错误
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
 *                   example: "Internal Server Error"
 */
router.post('/ban', adminMiddleware, async (req, res) => {
    try {
        const { userId, reason, duration } = req.body;

        if (!userId || !reason || !duration) {
            res.status(400).json(ApiResponse.error(400, 'Missing required fields'));
            return;
        }

        const user = await findUserById(userId);
        if (!user) {
            res.status(404).json(ApiResponse.error(404, 'User not found'));
            return;
        }
        if (user.is_banned) {
            res.status(400).json(ApiResponse.error(400, 'User is already banned'));
            return;
        }
        const banExpiration = new Date(Date.now() + duration * 24 * 60 * 60 * 1000);
        const result: any = await updateUser({
            ...user,
            is_banned: true,
            ban_reason: reason,
            ban_expiration: banExpiration,
            updated_at: new Date(),
        });
        if (result.affectedRows === 0) {
            res.status(500).json(ApiResponse.error(500, 'Internal Server Error: Please contact support'));
            return;
        }
        res.status(200).json(ApiResponse.success(200, 'Ban user successfully'));
    } catch (err) {
        res.status(500).json(ApiResponse.error(500, 'Internal Server Error: Please contact support'));
        console.log(err);
    }
})

/**
 * @swagger
 * /user/unBan:
 *   post:
 *     summary: 解封用户
 *     description: 管理员解除对指定用户的封禁
 *     tags:
 *       - 用户模块
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: 被解封用户的ID
 *                 example: "10001"
 *     responses:
 *       200:
 *         description: 解封成功
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
 *                   example: "Unban user successfully"
 *       400:
 *         description: 参数错误
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
 *                   example: "Missing required fields"
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
 *                   example: "User not found"
 *       500:
 *         description: 服务器错误
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
 *                   example: "Internal Server Error"
 */
router.post('/unBan', adminMiddleware, async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            res.status(400).json(ApiResponse.error(400, 'Missing required fields'));
            return;
        }
        const user = await findUserById(userId);
        if (!user) {
            res.status(404).json(ApiResponse.error(404, 'User not found'));
            return;
        }
        if (!user.is_banned) {
            res.status(400).json(ApiResponse.error(400, 'User is not banned'));
            return;
        }
        const result: any = await updateUser({
            ...user,
            is_banned: false,
            ban_reason: null,
            ban_expiration: null,
            updated_at: new Date(),
        });
        if (result.affectedRows === 0) {
            res.status(500).json(ApiResponse.error(500, 'Internal Server Error: Please contact support'));
            return;
        }
        res.status(200).json(ApiResponse.success(200, 'Unban user successfully'));
    } catch (err) {
        res.status(500).json(ApiResponse.error(500, 'Internal Server Error: Please contact support'));
        console.log(err);
    }
})

/**
 * @swagger
 * /user/admin/update:
 *   post:
 *     summary: 更新用户信息(管理员)
 *     description: 通过token获取当前登录用户并更新其信息，管理员只能更新用户的部分信息，且无法更新敏感字段如id, password, created_at, updated_at, last_login等
 *     tags:
 *       - 用户模块
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: 新用户名（选填）
 *                 example: johndoe_new
 *               email:
 *                 type: string
 *                 description: 新邮箱地址（选填）
 *                 example: john_new@example.com
 *               avatar:
 *                 type: string
 *                 description: 新头像地址（选填）
 *                 example: https://example.com/avatar.jpg
 *               is_admin:
 *                 type: boolean
 *                 description: 是否为管理员（选填）
 *                 example: true
 *               qq_num:
 *                 type: string
 *                 description: qq 号（选填）
 *                 example: 123456789
 *               email_verified:
 *                 type: boolean
 *                 description: 邮箱是否已验证（选填）
 *                 example: true
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
 *                   example: Update user info successfully
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
 *       401:
 *         description: Token 失效或未提供
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
 *                   example: Missing token
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
router.post('/admin/update', adminMiddleware, async (req, res) => {
    try {
        const newInfo = req.body;

        if (!newInfo.id) {
            res.status(400).json(ApiResponse.error(400, 'Missing required fields'));
            return;
        }

        const user = await findUserById(newInfo.id);
        if (!user) {
            res.status(404).json(ApiResponse.error(404, 'User not found'));
            return;
        }

        newInfo.password = user.password;
        newInfo.created_at = user.created_at;
        newInfo.updated_at = user.updated_at;
        newInfo.last_login = user.last_login;
        newInfo.is_banned = user.is_banned;
        newInfo.ban_reason = user.ban_reason;
        newInfo.ban_expiration = user.ban_expiration;
        delete newInfo.user;

        newInfo.updated_at = new Date();

        const result: any = await updateUser(newInfo);
        console.log('result', result);
        if (result.affectedRows === 0) {
            res.status(500).json(ApiResponse.error(500, 'Update user info failed'));
            return;
        }

        res.status(200).json(ApiResponse.success(200, 'Update user info successfully'));
    } catch (err) {
        res.status(500).json(ApiResponse.error(500, 'Internal Server Error: Please contact support'));
        console.log(err);
    }
})

/**
 * @swagger
 * /user/delete:
 *   post:
 *     summary: 删除用户
 *     description: 通过token获取当前登录用户并删除其信息，管理员只能删除普通用户，且无法删除管理员
 *     tags:
 *       - 用户模块
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: 用户id
 *                 example: 1
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
 *                   example: Delete user successfully
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
 *       501:
 *         description: 管理员权限不足，无法删除管理员
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
 *                   example: 501
 *                 message:
 *                   type: string
 *                   example: Admin permission is required
 */
router.post('/delete', adminMiddleware, async (req, res) => {
    try {
        const userId = req.body.userId;
        if (!userId) {
            res.status(400).json(ApiResponse.error(400, 'Missing required fields'));
            return;
        }
        const user = await findUserById(userId);
        if (!user) {
            res.status(404).json(ApiResponse.error(404, 'User not found'));
            return;
        }
        if (user.is_admin) {
            res.status(501).json(ApiResponse.error(501, 'Admin permission is required'));
            return;
        }
        const result: any = await deleteUserById(userId);
        if (result.affectedRows === 0) {
            res.status(500).json(ApiResponse.error(500, 'Delete user failed'));
            return;
        }
        res.status(200).json(ApiResponse.success(200, 'Delete user successfully'));
        return;
    } catch (err) {
        res.status(500).json(ApiResponse.error(500, 'Internal Server Error: Please contact support'));
        console.log(err);
    }
})

export default router;