import { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import ApiResponse from '../utils/apiResp'
import { 
    findServerById,
    adminFindServerById,
    findServerList,
    adminFindServerList,
    findServerAboutListByServerId,
    addServerInfo,
    addServerAbout,
    delServerById,
    delServerByIds,
    updateServerInfo,
    updateServerInfoAudit,
    updateServerAboutAudit
 } from '../models/server.model'

// 获取单个服务器信息
export const getServerInfo = async (req: Request, res: Response): Promise<void> => {
    const serverId = req.params.serverId

    if (!serverId) {
        res.status(400).json(ApiResponse.error(400, 'Server ID is required'))
        return 
    }

    const server = await findServerById(serverId)
    if (!server) {
        res.status(404).json(ApiResponse.error(404, 'Server not found'))
        return 
    }
    res.status(200).json(ApiResponse.success(200, 'Get server info success', server))
    return 
}

// 管理员获取单个服务器信息
export const adminGetServerInfo = async (req: Request, res: Response): Promise<void> => {
    const serverId = req.params.serverId

    if (!serverId) {
        res.status(400).json(ApiResponse.error(400, 'Server ID is required'))
        return 
    }

    const server = await adminFindServerById(serverId)
    if (!server) {
        res.status(404).json(ApiResponse.error(404, 'Server not found'))
        return 
    }

    res.status(200).json(ApiResponse.success(200, 'Get server info success', server))
    return 
}

// 获取服务器列表
export const getServerList = async (req: Request, res: Response): Promise<void> => {
    const { pageSize, pageNum } = req.query

    const pageSizeNum = Number(pageSize)
    const pageNumNum = Number(pageNum)

    if (isNaN(pageSizeNum) || isNaN(pageNumNum)) {
        res.status(400).json(ApiResponse.error(400, 'Page size and page num must be numbers'))
        return
    }

    const offset = (pageNumNum - 1) * pageSizeNum

    const servers = await findServerList(offset, pageSizeNum)
    if (!servers) {
        res.status(404).json(ApiResponse.error(404, 'Servers list not found'))
        return
    }

    res.status(200).json(ApiResponse.success(200, 'Get server list success', servers))
    return
}

// 管理员获取服务器列表
export const adminGetServerList = async (req: Request, res: Response): Promise<void> => {
    const { pageSize, pageNum } = req.query
    const pageSizeNum = Number(pageSize)
    const pageNumNum = Number(pageNum)

    if (isNaN(pageSizeNum) || isNaN(pageNumNum)) {
        res.status(400).json(ApiResponse.error(400, 'Page size and page num must be numbers'))
        return
    }

    const offset = (pageNumNum - 1) * pageSizeNum

    const servers = await adminFindServerList(offset, pageSizeNum)
    if (!servers) {
        res.status(404).json(ApiResponse.error(404, 'Servers list not found'))
        return
    }
    res.status(200).json(ApiResponse.success(200, 'Get server list success', servers))
    return
}

// 获取单个服务器的多个详细信息
export const getServerAboutListByServerId = async (req: Request, res: Response): Promise<void> => {
    const serverId = req.params.serverId
    const { pageSize, pageNum } = req.query
    const pageSizeNum = Number(pageSize)
    const pageNumNum = Number(pageNum)

    if (isNaN(pageSizeNum) || isNaN(pageNumNum)) {
        res.status(400).json(ApiResponse.error(400, 'Page size and page num must be numbers'))
        return
    }

    const offset = (pageNumNum - 1) * pageSizeNum
    const aboutList = await findServerAboutListByServerId(serverId, offset, pageSizeNum)
    if (!aboutList) {
        res.status(404).json(ApiResponse.error(404, 'Server about list not found'))
        return
    }
    res.status(200).json(ApiResponse.success(200, 'Get server about list success', aboutList))
    return
}

// 创建服务器
export const createServer = async (req: Request, res: Response): Promise<void> => {
    const { name, server_icon_url, country, user_id, date, todo, audit_status, audit_reason } = req.body
    const serverId = uuidv4()
    const result = await addServerInfo({
        id: serverId,
        name,
        server_icon_url,
        country,
        user_id,
        date,
        todo,
        audit_status,
        audit_reason
    })
    if (!result) {
        res.status(400).json(ApiResponse.error(400, 'Create server failed'))
        return
    }
    res.status(200).json(ApiResponse.success(200, 'Create server success', serverId))
    return
}

// 创建服务器详细信息
export const createServerAbout = async (req: Request, res: Response): Promise<void> => {
    const { about, docs_url, info_id, ip, server_type, server_oauth, qq_group } = req.body
    const aboutId = uuidv4()
    const result = await addServerAbout({
        id: aboutId,
        about,
        docs_url,
        info_id,
        ip,
        server_type,
        server_oauth,
        qq_group,
        date: new Date().toISOString(),
        audit_status: 'no',
    })
    if (!result) {
        res.status(400).json(ApiResponse.error(400, 'Create server about failed'))
        return
    }
    res.status(200).json(ApiResponse.success(200, 'Create server about success', aboutId))
    return
}

// 删除服务器
export const delServer = async (req: Request, res: Response): Promise<void> => {
    const serverId = req.params.serverId
    if (!serverId) {
        res.status(400).json(ApiResponse.error(400, 'Server ID is required'))
        return
    }
    const result = await delServerById(serverId)
    if (!result) {
        res.status(400).json(ApiResponse.error(400, 'Delete server failed'))
        return
    }
    res.status(200).json(ApiResponse.success(200, 'Delete server success'))
    return
}

// 删除多个服务器
export const delServers = async (req: Request, res: Response): Promise<void> => {
    const serverIds = req.body.serverIds
    if (!serverIds || serverIds.length === 0) {
        res.status(400).json(ApiResponse.error(400, 'Server IDs are required'))
        return
    }
    const result = await delServerByIds(serverIds)
    if (!result) {
        res.status(400).json(ApiResponse.error(400, 'Delete servers failed'))
        return
    }
    res.status(200).json(ApiResponse.success(200, 'Delete servers success'))
    return
}

// 更新服务器
export const updateServer = async (req: Request, res: Response): Promise<void> => {
    const serverId = req.params.serverId
    const { name, server_icon_url, country, user_id, date, todo, audit_status, audit_reason } = req.body
    if (!serverId) {
        res.status(400).json(ApiResponse.error(400, 'Server ID is required'))
        return
    }
    const result = await updateServerInfo(serverId, {
        id: serverId,
        name,
        server_icon_url,
        country,
        user_id,
        date,
        todo,
        audit_status,
        audit_reason
    })
    if (!result) {
        res.status(400).json(ApiResponse.error(400, 'Update server failed'))
        return
    }
    res.status(200).json(ApiResponse.success(200, 'Update server success'))
    return
}

// 客户端获取单个服务器信息
export const clientGetServerInfo = async (req: Request, res: Response): Promise<void> => {
    const { serverId } = req.body
    if (!serverId) {
        res.status(400).json(ApiResponse.error(400, 'Server ID is required'))
        return
    }
    const server = await findServerById(serverId)
    if (!server) {
        res.status(404).json(ApiResponse.error(404, 'Server not found'))
        return
    }
    res.status(200).json(ApiResponse.success(200, 'Get server info success', server))
    return
}

// 客户端获取服务器列表
export const clientGetServerList = async (req: Request, res: Response): Promise<void> => {
    const { pageSize, pageNum } = req.body
    const pageSizeNum = Number(pageSize)
    const pageNumNum = Number(pageNum)

    if (isNaN(pageSizeNum) || isNaN(pageNumNum)) {
        res.status(400).json(ApiResponse.error(400, 'Page size and page num must be numbers'))
        return
    }

    const offset = (pageNumNum - 1) * pageSizeNum
    const servers = await findServerList(offset, pageSizeNum)
    if (!servers) {
        res.status(404).json(ApiResponse.error(404, 'Servers list not found'))
        return
    }
    res.status(200).json(ApiResponse.success(200, 'Get server list success', servers))
    return
}

// 管理员审核Server info
export const adminAuditServerInfo = async (req: Request, res: Response): Promise<void> => {
    const { serverId, audit_status, audit_reason } = req.body
    if (!serverId) {
        res.status(400).json(ApiResponse.error(400, 'Server ID is required'))
        return
    }
    const result = await updateServerInfoAudit(serverId, {
        id: serverId,
        name: '',
        server_icon_url: '',
        country: '',
        user_id: '',
        date: new Date().toISOString(),
        todo: 0,
        audit_status,
        audit_reason
    })
    if (!result) {
        res.status(400).json(ApiResponse.error(400, 'Audit server failed'))
        return
    }
    res.status(200).json(ApiResponse.success(200, 'Audit server success'))
    return
}

// 管理员审核Server about
export const adminAuditServerAbout = async (req: Request, res: Response): Promise<void> => {
    const { serverId, audit_status, audit_reason } = req.body
    if (!serverId) {
        res.status(400).json(ApiResponse.error(400, 'Server ID is required'))
        return
    }
    const result = await updateServerAboutAudit(serverId, {
        id: serverId,
        about: '',
        info_id: '',
        ip: {
            ip: '',
        },
        server_type: '原版服务器',
        server_oauth: 'mojang',
        qq_group: {
            qq: '',
        },
        date: new Date().toISOString(),
        audit_status,
        audit_reason
    })
    if (!result) {
        res.status(400).json(ApiResponse.error(400, 'Audit server about failed'))
        return
    }
    res.status(200).json(ApiResponse.success(200, 'Audit server about success'))
    return
}
