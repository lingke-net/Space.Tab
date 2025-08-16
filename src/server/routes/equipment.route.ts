import { Router } from 'express';
import { adminMiddleware } from '../middlewares/adminMiddleware';
import { clientMiddleware } from '../middlewares/clientMiddleware';
import * as equipmentController from '../controllers/equipmentController';

const router = Router();

/**
 * @swagger
 * /equipment/info:
 *   get:
 *     summary: 查询设备信息
 *     tags: [设备模块]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 页码
 *         example: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 每页数量
 *         example: 10
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *         description: 按用户ID筛选
 *         example: 10001
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         description: 按地区筛选
 *         example: "china"
 *     responses:
 *       200:
 *         description: 查询成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/EquipmentInfo'
 *                 total:
 *                   type: integer
 *                   example: 1
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 pageSize:
 *                   type: integer
 *                   example: 10
 */
router.get('/equipment/info', adminMiddleware, equipmentController.getEquipmentInfo);

/**
 * @swagger
 * /equipment/disposition:
 *   get:
 *     summary: 查询设备配置记录
 *     tags: [设备模块]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 页码
 *         example: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 每页数量
 *         example: 10
 *       - in: query
 *         name: equipment_uuid
 *         schema:
 *           type: string
 *         description: 按设备ID筛选
 *         example: "b7e23ec2-8d5c-4c7a-8e7a-1b2c3d4e5f6a"
 *     responses:
 *       200:
 *         description: 查询成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/EquipmentDisposition'
 *                 total:
 *                   type: integer
 *                   example: 1
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 pageSize:
 *                   type: integer
 *                   example: 10
 */
router.get('/equipment/disposition', adminMiddleware, equipmentController.getEquipmentDisposition);

/**
 * @swagger
 * /equipment/info:
 *   post:
 *     summary: 管理员添加设备信息
 *     tags: [设备模块]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bios_id
 *               - country
 *               - user_id
 *             properties:
 *               bios_id:
 *                 type: string
 *                 example: "ABC123XYZ"
 *               country:
 *                 type: string
 *                 example: "china"
 *               user_id:
 *                 type: integer
 *                 example: 10001
 *           example:
 *             bios_id: "ABC123XYZ"
 *             country: "china"
 *             user_id: 10001
 *     responses:
 *       200:
 *         description: 添加成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: add ok
 *                 info_uuid:
 *                   type: string
 *                   example: "b7e23ec2-8d5c-4c7a-8e7a-1b2c3d4e5f6a"
 */
router.post('/equipment/info', adminMiddleware, equipmentController.addEquipmentInfo);

/**
 * @swagger
 * /equipment/disposition:
 *   post:
 *     summary: 管理员添加设备配置记录
 *     tags: [设备模块]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - equipment_uuid
 *               - system_architecture
 *               - system
 *               - system_id
 *               - ram_info
 *               - date
 *               - wonderlab_run_file
 *               - wonderlab_v
 *             properties:
 *               equipment_uuid:
 *                 type: string
 *                 example: "b7e23ec2-8d5c-4c7a-8e7a-1b2c3d4e5f6a"
 *               system_architecture:
 *                 type: string
 *                 example: "x64"
 *               system:
 *                 type: string
 *                 example: "windows"
 *               system_id:
 *                 type: string
 *                 example: "10.0.19045"
 *               ram_info:
 *                 type: string
 *                 example: "16GB"
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-07-05 18:05:40"
 *               wonderlab_run_file:
 *                 type: string
 *                 example: "C:/Program Files/WonderLab"
 *               wonderlab_v:
 *                 type: string
 *                 example: "1.0.0"
 *           example:
 *             equipment_uuid: "b7e23ec2-8d5c-4c7a-8e7a-1b2c3d4e5f6a"
 *             system_architecture: "x64"
 *             system: "windows"
 *             system_id: "10.0.19045"
 *             ram_info: "16GB"
 *             date: "2025-07-05 18:05:40"
 *             wonderlab_run_file: "C:/Program Files/WonderLab"
 *             wonderlab_v: "1.0.0"
 *     responses:
 *       200:
 *         description: 添加成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: add ok
 *                 info_uuid:
 *                   type: string
 *                   example: "b7e23ec2-8d5c-4c7a-8e7a-1b2c3d4e5f6a"
 */
router.post('/equipment/disposition', adminMiddleware, equipmentController.addEquipmentDisposition);

/**
 * @swagger
 * /equipment/disposition/{info_uuid}:
 *   put:
 *     summary: 管理员编辑设备配置记录
 *     tags: [设备模块]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: info_uuid
 *         required: true
 *         schema:
 *           type: string
 *         description: 设备配置记录ID
 *         example: "b7e23ec2-8d5c-4c7a-8e7a-1b2c3d4e5f6a"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - system_architecture
 *               - system
 *               - system_id
 *               - ram_info
 *               - date
 *               - wonderlab_run_file
 *               - wonderlab_v
 *             properties:
 *               system_architecture:
 *                 type: string
 *                 example: "x64"
 *               system:
 *                 type: string
 *                 example: "windows"
 *               system_id:
 *                 type: string
 *                 example: "10.0.19045"
 *               ram_info:
 *                 type: string
 *                 example: "16GB"
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-07-05 18:05:40"
 *               wonderlab_run_file:
 *                 type: string
 *                 example: "C:/Program Files/WonderLab"
 *               wonderlab_v:
 *                 type: string
 *                 example: "1.0.0"
 *           example:
 *             system_architecture: "x64"
 *             system: "windows"
 *             system_id: "10.0.19045"
 *             ram_info: "16GB"
 *             date: "2025-07-05 18:05:40"
 *             wonderlab_run_file: "C:/Program Files/WonderLab"
 *             wonderlab_v: "1.0.0"
 *     responses:
 *       200:
 *         description: 编辑成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: update ok
 */
router.put('/equipment/disposition/:info_uuid', adminMiddleware, equipmentController.updateEquipmentDisposition);

/**
 * @swagger
 * /equipment/register:
 *   post:
 *     summary: 管理员注册设备
 *     tags: [设备模块]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bios_id
 *               - country
 *               - user_id
 *             properties:
 *               bios_id:
 *                 type: string
 *                 description: 主板BIOS-ID
 *                 example: "ABC123XYZ"
 *               country:
 *                 type: string
 *                 description: 设备地区
 *                 example: "china"
 *               user_id:
 *                 type: integer
 *                 description: 关联用户id
 *                 example: 10001
 *               info_uuid:
 *                 type: string
 *                 description: 可选，自定义设备信息记录ID（UUID）
 *                 example: "b7e23ec2-8d5c-4c7a-8e7a-1b2c3d4e5f6a"
 *           example:
 *             bios_id: "ABC123XYZ"
 *             country: "china"
 *             user_id: 10001
 *             info_uuid: "b7e23ec2-8d5c-4c7a-8e7a-1b2c3d4e5f6a"
 *     responses:
 *       200:
 *         description: 注册成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: register is ok
 *                 info_uuid:
 *                   type: string
 *                   example: "b7e23ec2-8d5c-4c7a-8e7a-1b2c3d4e5f6a"
 *       201:
 *         description: 设备已存在
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: this info_uuid is on the detabest
 */
router.post('/equipment/register', adminMiddleware, equipmentController.registerEquipmentAdmin);

/**
 * @swagger
 * /system/register:
 *   post:
 *     summary: 客户端注册设备
 *     tags: [设备模块]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bios_id
 *               - country
 *               - user_id
 *             properties:
 *               bios_id:
 *                 type: string
 *                 description: 主板BIOS-ID
 *                 example: "ABC123XYZ"
 *               country:
 *                 type: string
 *                 description: 设备地区
 *                 example: "china"
 *               user_id:
 *                 type: integer
 *                 description: 关联用户id
 *                 example: 10001
 *           example:
 *             bios_id: "ABC123XYZ"
 *             country: "china"
 *             user_id: 10001
 *     responses:
 *       200:
 *         description: 注册成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: register is ok
 *                 info_uuid:
 *                   type: string
 *                   example: "b7e23ec2-8d5c-4c7a-8e7a-1b2c3d4e5f6a"
 *       201:
 *         description: 设备已存在
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: this info_uuid is on the detabest
 */
router.post('/system/register', clientMiddleware, equipmentController.registerEquipment);

export default router; 