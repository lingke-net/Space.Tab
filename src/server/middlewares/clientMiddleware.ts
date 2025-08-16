import { Request, Response, NextFunction } from 'express'
import ApiResponse from '../utils/apiResp'
import * as crypto from 'crypto';
import * as fs from 'fs';

import { fileURLToPath } from 'node:url'
import path, { dirname } from 'node:path'
const __dirname = dirname(fileURLToPath(import.meta.url))

export const clientMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const encryptedContent = req.header('X-Encrypted-Content');

        if (!encryptedContent) {
            res.status(400).json(ApiResponse.error(400, 'Missing encrypted content'))
            return
        }

        // 验证Base64格式
        if (!/^[A-Za-z0-9+/=]+$/.test(encryptedContent)) {
            console.log('Invalid Base64 format:', encryptedContent);
            res.status(401).json(ApiResponse.error(401, 'Invalid encrypted content format'))
            return
        }

        const privateKeyPath = path.join(__dirname, '../private_key.pem')
        const privateKey = fs.readFileSync(privateKeyPath, 'utf8')

        let decrypted;
        try {
            decrypted = crypto.privateDecrypt(
                {
                    key: privateKey,
                    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                    oaepHash: 'sha256'
                },
                Buffer.from(encryptedContent, 'base64')
            ).toString('utf8');
        } catch (decryptError: any) {
            console.error('Decryption error:', decryptError.message);
            // 区分不同类型的解密错误
            if (decryptError.code === 'ERR_OSSL_RSA_OAEP_DECODING_ERROR') {
                res.status(400).json(ApiResponse.error(400, 'Decryption failed: Invalid ciphertext'))
            } else {
                res.status(500).json(ApiResponse.error(500, 'Internal decryption error'))
            }
            return
        }

        let clientData;
        try {
            clientData = JSON.parse(decrypted);
        } catch (parseError) {
            console.error('JSON parsing error:', parseError);
            res.status(400).json(ApiResponse.error(400, 'Invalid client data format'))
            return
        }

        if (!validateClientData(clientData)) {
            console.log('Invalid client data:', clientData);
            res.status(401).json(ApiResponse.error(401, 'Invalid client data'));
            return
        }

        (req as any).body = clientData;
        console.log('Client data validated successfully');

        next();
    } catch (error) {
        console.error('Error in client middleware:', error);
        res.status(500).json(ApiResponse.error(500, 'Internal server error'))
        return 
    }
};

function validateClientData(data: any): boolean {
    return (
        data &&
        data.timestamp &&
        Math.abs(Date.now() - data.timestamp) < 60000
    );
}    