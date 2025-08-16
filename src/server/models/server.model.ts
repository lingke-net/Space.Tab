import { mysqlConnection } from "../config/database"

type AuditStatus = 'yes' | 'no' | 'lock'
type ServerType = '原版服务器' | '插件服务器' | 'MOD服务器' | '插件MOD混合服务器'
type ServerOAuth = 'mojang' | 'none' | 'yggdrasil'

/**
 * 服务器信息表接口
 * 存储服务器的基本信息
 */
export interface ServerInfo { 
    // 服务器记录ID（UUID）
    id: string;
    // 服务器名称
    name: string;
    // 服务器图标URL
    server_icon_url: string;
    // 服务器数据 ID
    server_about_id?: string;
    // 设备地区（例如china）
    country: string;
    // 关联用户id（例如10001），默认为发起请求的用户
    user_id: string;
    // 服务器登记日期（UTC+8）
    date: string;
    // 服务器被访问数
    todo: number;
    // 审核状态（yes/no/lock），默认no
    audit_status: AuditStatus;
    // 审核原因（非必须）
    audit_reason?: string;
    // 服务器关于数量
    aboutTotalCount?: number;
}

/**
 * 服务器数据表接口
 * 用于记录服务器的详细数据，允许服务器同时存在多个记录
 */
export interface ServerAbout {
    // 记录ID（UUID）
    id: string;
    // 服务器描述（支持markdown内容）
    about: string;
    // 服务器文档（只能写一个链接，可以为空）
    docs_url?: string;
    // 关联服务器ID，与服务器信息表的服务器记录ID关联
    info_id: string;
    // 服务器地址（允许多个IP记录）
    ip: Record<string, string>;
    // 服务器类型
    server_type: ServerType;
    // 验证类型
    server_oauth: ServerOAuth;
    // 服务器群（允许记录多个群）
    qq_group: Record<string, string>;
    // 信息记录日期
    date: string;
    // 审核状态（yes/no/lock），默认no
    audit_status: AuditStatus;
    // 审核原因（非必须）
    audit_reason?: string;
}
 
// 根据服务器ID获取单个服务器的信息，包括服务器信息表和当前服务器数据表的内容
export const findServerById = async (id: string) => {
    const [info] = await mysqlConnection.query(
        'SELECT * FROM server_info WHERE id = ?',
        [id]
    )
    const serverAboutId = (info as ServerInfo[])[0].server_about_id

    const [about] = await mysqlConnection.query(
        'SELECT * FROM server_about WHERE id = ?',
        [serverAboutId]
    )
    return {
        info: (info as ServerInfo[])[0],
        about: (about as ServerAbout[])[0]
    }
}

export const adminFindServerById = async (id: string) => {
    const [info] = await mysqlConnection.query(
        'SELECT * FROM server_info WHERE id = ?',
        [id]
    )

    const [about] = await mysqlConnection.query(
        'SELECT * FROM server_about WHERE info_id = ?',
        [id]
    )
    return {
        info: (info as ServerInfo[])[0],
        about
    }
}

export const findServerList = async (offset: number, limit: number) => {
    const [total] = await mysqlConnection.query(
        'SELECT COUNT(*) as total FROM server_info'
    )
    const totalCount = (total as { total: number }[])[0].total

    // 移除audit_status为lock和no的服务器
    const [servers] = await mysqlConnection.query(
        'SELECT * FROM server_info WHERE audit_status != "lock" AND audit_status != "no" LIMIT ? OFFSET ?',
        [limit, offset]
    )
    return {
        total: totalCount,
        servers
    }
}

export const adminFindServerList = async (offset: number, limit: number) => {
    // 获取服务器总数
    const [total] = await mysqlConnection.query(
        'SELECT COUNT(*) as total FROM server_info'
    )
    const totalCount = (total as { total: number }[])[0].total

    // 获取服务器列表
    const [servers] = await mysqlConnection.query(
        'SELECT * FROM server_info LIMIT ? OFFSET ?',
        [limit, offset]
    )

    // 通过for循环，获取每个server的about数量，并设置aboutTotalCount
    for (const server of servers as ServerInfo[]) {
        const [about] = await mysqlConnection.query(
            'SELECT COUNT(*) as total FROM server_about WHERE info_id = ?',
            [server.id]
        )
        server.aboutTotalCount = (about as { total: number }[])[0].total
    }

    return {
        total: totalCount,
        servers
    }
}

export const findServerAboutListByServerId = async (id: string, offset: number, limit: number) => {
    const [total] = await mysqlConnection.query(
        'SELECT COUNT(*) as total FROM server_about WHERE info_id = ?',
        [id]
    )
    const totalCount = (total as { total: number }[])[0].total
    const [about] = await mysqlConnection.query(
        'SELECT * FROM server_about WHERE info_id = ? LIMIT ? OFFSET ?',
        [id, limit, offset]
    )
    return {
        total: totalCount,
        about
    }
}

export const addServerInfo = async (info: ServerInfo) => {
    const [result] = await mysqlConnection.query(
        'INSERT INTO server_info (id, name, server_icon_url, server_about_id, country, user_id, date, todo, audit_status, audit_reason) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
            info.id,
            info.name, 
            info.server_icon_url, 
            null, 
            info.country, 
            info.user_id, 
            info.date ?? new Date().toISOString(), 
            0, 
            'lock', 
            info.audit_reason
        ]
    )
    return result
}

export const addServerAbout = async (about: ServerAbout) => {
    const [result] = await mysqlConnection.query(
        'INSERT INTO server_about (id, about, docs_url, info_id, ip, server_type, server_oauth, qq_group, date, audit_status, audit_reason) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
            about.id,
            about.about, 
            about.docs_url, 
            about.info_id, 
            about.ip, 
            about.server_type, 
            about.server_oauth, 
            about.qq_group, 
            about.date ?? new Date().toISOString(), 
            'lock', 
            about.audit_reason
        ]
    )
    return result
}

export const delServerById = async (id: string) => {
    const [result] = await mysqlConnection.query(
        'DELETE FROM server_info WHERE id = ?',
        [id]
    )
    const [result2] = await mysqlConnection.query(
        'DELETE FROM server_about WHERE info_id = ?',
        [id]
    )
    return result
}

export const delServerByIds = async (ids: string[]) => {
    const [result] = await mysqlConnection.query(
        'DELETE FROM server_info WHERE id IN (?)',
        [ids]
    )
    const [result2] = await mysqlConnection.query(
        'DELETE FROM server_about WHERE info_id IN (?)',
        [ids]
    )
    return result
}

export const updateServerInfo = async (id: string, info: ServerInfo) => {
    const [result] = await mysqlConnection.query(
        'UPDATE server_info SET name = ?, server_icon_url = ?, country = ?, user_id = ?, date = ?, todo = ?, audit_status = ?, audit_reason = ? WHERE id = ?',
        [
            info.name,
            info.server_icon_url,
            info.country,
            info.user_id,
            info.date ?? new Date().toISOString(),
            info.todo,
            'lock',
            info.audit_reason
        ]
    )
    return result
}

// 审核Server info
export const updateServerInfoAudit = async (id: string, info: ServerInfo) => {
    const [result] = await mysqlConnection.query(
        'UPDATE server_info SET audit_status = ?, audit_reason = ? WHERE id = ?',
        [
            info.audit_status,
            info.audit_reason,
            id
        ]
    )
    return result
}

// 审核Server about
export const updateServerAboutAudit = async (id: string, about: ServerAbout) => {
    const [result] = await mysqlConnection.query(
        'UPDATE server_about SET audit_status = ?, audit_reason = ? WHERE id = ?',
        [
            about.audit_status,
            about.audit_reason,
            id
        ]
    )
    return result
}
