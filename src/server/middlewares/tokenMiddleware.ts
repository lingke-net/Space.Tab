import jwt from 'jsonwebtoken'
import { redisClient } from '../config/database'
import { Request, Response, NextFunction } from 'express'
import ApiResponse from '../utils/apiResp'

export const tokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    const token = req.headers.authorization;
    if (!token) {
        res.status(401).json(ApiResponse.error(401, 'Unauthorized: Missing token'))
        return
    }
    let decoded = {};
    try {
        decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET!) as any;
    } catch (err) {
        res.status(401).json(ApiResponse.error(401, 'Unauthorized: Invalid token'))
        return
    }
    try {
        const redisKey = `user:${(decoded as any).userId}`;
        const cachedUser = await redisClient.get(redisKey);

        if (!cachedUser) {
            res.status(401).json(ApiResponse.error(401, 'Unauthorized: Session expired'))
            return
        }

        const sensitiveFields = ['password']
        if (cachedUser) {
            const user = JSON.parse(cachedUser);
            sensitiveFields.forEach(field => delete user[field])
            // 判断是get请求，就不设置user
            if (req.method === 'GET' || req.method === 'DELETE') {
                req.query.user = user
            } else {
                if (req.body === undefined) {
                    req.body = {}
                }
                req.body.user = user
            }
        }
        next();
    } catch (err) {
        res.status(500).json(ApiResponse.error(500, 'Internal Server Error: Please contact support'))
        console.log(err)
    }
};
