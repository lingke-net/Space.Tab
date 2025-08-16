import { Request, Response } from 'express';
import { mysqlConnection } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

// 简单参数校验函数
function isNonEmptyString(val: any): boolean {
  return typeof val === 'string' && val.trim().length > 0;
}
function isPositiveInt(val: any): boolean {
  return Number.isInteger(Number(val)) && Number(val) > 0;
}

// 注册设备（客户端权限）
export async function registerEquipment(req: Request, res: Response): Promise<void> {
  const { bios_id, country, user_id } = req.body;
  if (!isNonEmptyString(bios_id) || !isNonEmptyString(country) || !isPositiveInt(user_id)) {
    res.status(400).json({ code: 400, message: 'Missing or invalid required fields' }); return;
  }
  const [rows]: any = await mysqlConnection.query(
    'SELECT * FROM equipment_info WHERE bios_id = ? AND user_id = ?',
    [bios_id, user_id]
  );
  if (rows.length > 0) {
    res.status(201).json({ code: 201, message: 'this info_uuid is on the detabest' }); return;
  }
  const info_uuid = uuidv4();
  const date = new Date();
  await mysqlConnection.query(
    'INSERT INTO equipment_info (info_uuid, bios_id, country, user_id, date) VALUES (?, ?, ?, ?, ?)',
    [info_uuid, bios_id, country, user_id, date]
  );
  res.status(200).json({ code: 200, message: 'register is ok', info_uuid });
}

// 查询设备信息（管理员权限）
export async function getEquipmentInfo(req: Request, res: Response): Promise<void> {
  let { page = 1, pageSize = 10, user_id, country } = req.query;
  page = Number(page);
  pageSize = Number(pageSize);
  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(pageSize) || pageSize < 1 || pageSize > 100) pageSize = 10;
  let where = 'WHERE 1=1';
  const params: any[] = [];
  if (user_id && isPositiveInt(user_id)) {
    where += ' AND user_id = ?';
    params.push(user_id);
  }
  if (country && isNonEmptyString(country)) {
    where += ' AND country = ?';
    params.push(country);
  }
  const [countRows]: any = await mysqlConnection.query(
    `SELECT COUNT(*) as total FROM equipment_info ${where}`, params
  );
  const total = countRows[0]?.total || 0;
  const [rows]: any = await mysqlConnection.query(
    `SELECT * FROM equipment_info ${where} ORDER BY date DESC LIMIT ? OFFSET ?`,
    [...params, pageSize, (page - 1) * pageSize]
  );
  res.json({ code: 200, data: rows, total, page, pageSize });
}

// 查询设备配置记录（管理员权限）
export async function getEquipmentDisposition(req: Request, res: Response): Promise<void> {
  let { page = 1, pageSize = 10, equipment_uuid } = req.query;
  page = Number(page);
  pageSize = Number(pageSize);
  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(pageSize) || pageSize < 1 || pageSize > 100) pageSize = 10;
  let where = 'WHERE 1=1';
  const params: any[] = [];
  if (equipment_uuid && isNonEmptyString(equipment_uuid)) {
    where += ' AND equipment_uuid = ?';
    params.push(equipment_uuid);
  }
  const [countRows]: any = await mysqlConnection.query(
    `SELECT COUNT(*) as total FROM equipment_disposition ${where}`, params
  );
  const total = countRows[0]?.total || 0;
  const [rows]: any = await mysqlConnection.query(
    `SELECT * FROM equipment_disposition ${where} ORDER BY date DESC LIMIT ? OFFSET ?`,
    [...params, pageSize, (page - 1) * pageSize]
  );
  res.json({ code: 200, data: rows, total, page, pageSize });
}

// 添加设备信息（管理员权限）
export async function addEquipmentInfo(req: Request, res: Response): Promise<void> {
  const { bios_id, country, user_id } = req.body;
  if (!isNonEmptyString(bios_id) || !isNonEmptyString(country) || !isPositiveInt(user_id)) {
    res.status(400).json({ code: 400, message: 'Missing or invalid required fields' }); return;
  }
  const info_uuid = uuidv4();
  const date = new Date();
  await mysqlConnection.query(
    'INSERT INTO equipment_info (info_uuid, bios_id, country, user_id, date) VALUES (?, ?, ?, ?, ?)',
    [info_uuid, bios_id, country, user_id, date]
  );
  res.json({ code: 200, message: 'add ok', info_uuid });
}

// 添加设备配置记录（管理员权限）
export async function addEquipmentDisposition(req: Request, res: Response): Promise<void> {
  const {
    equipment_uuid, system_architecture, system, system_id,
    ram_info, date, wonderlab_run_file, wonderlab_v
  } = req.body;
  if (!isNonEmptyString(equipment_uuid) || !isNonEmptyString(system_architecture) || !isNonEmptyString(system) || !isNonEmptyString(system_id) || !isNonEmptyString(ram_info) || !isNonEmptyString(date) || !isNonEmptyString(wonderlab_run_file) || !isNonEmptyString(wonderlab_v)) {
    res.status(400).json({ code: 400, message: 'Missing or invalid required fields' }); return;
  }
  const info_uuid = uuidv4();
  await mysqlConnection.query(
    `INSERT INTO equipment_disposition
    (info_uuid, equipment_uuid, system_architecture, system, system_id, ram_info, date, wonderlab_run_file, wonderlab_v)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [info_uuid, equipment_uuid, system_architecture, system, system_id, ram_info, date, wonderlab_run_file, wonderlab_v]
  );
  res.json({ code: 200, message: 'add ok', info_uuid });
}

// 编辑设备配置记录（管理员权限）
export async function updateEquipmentDisposition(req: Request, res: Response): Promise<void> {
  const { info_uuid } = req.params;
  const {
    system_architecture, system, system_id,
    ram_info, date, wonderlab_run_file, wonderlab_v
  } = req.body;
  if (!isNonEmptyString(info_uuid)) {
    res.status(400).json({ code: 400, message: 'Missing info_uuid' }); return;
  }
  await mysqlConnection.query(
    `UPDATE equipment_disposition SET
      system_architecture = ?, system = ?, system_id = ?, ram_info = ?, date = ?, wonderlab_run_file = ?, wonderlab_v = ?
      WHERE info_uuid = ?`,
    [system_architecture, system, system_id, ram_info, date, wonderlab_run_file, wonderlab_v, info_uuid]
  );
  res.json({ code: 200, message: 'update ok' });
}

// 管理员注册设备
export async function registerEquipmentAdmin(req: Request, res: Response): Promise<void> {
  const { bios_id, country, user_id, info_uuid: customInfoUuid } = req.body;
  if (!isNonEmptyString(bios_id) || !isNonEmptyString(country) || !isPositiveInt(user_id)) {
    res.status(400).json({ code: 400, message: 'Missing or invalid required fields' }); return;
  }
  const [rows]: any = await mysqlConnection.query(
    'SELECT * FROM equipment_info WHERE bios_id = ? AND user_id = ?',
    [bios_id, user_id]
  );
  if (rows.length > 0) {
    res.status(201).json({ code: 201, message: 'this info_uuid is on the detabest' }); return;
  }
  const info_uuid = isNonEmptyString(customInfoUuid) ? customInfoUuid : uuidv4();
  const date = new Date();
  await mysqlConnection.query(
    'INSERT INTO equipment_info (info_uuid, bios_id, country, user_id, date) VALUES (?, ?, ?, ?, ?)',
    [info_uuid, bios_id, country, user_id, date]
  );
  res.status(200).json({ code: 200, message: 'register is ok', info_uuid });
} 