import { fileURLToPath } from 'node:url'
import path, { dirname } from 'node:path'
import swaggerJsdoc from 'swagger-jsdoc'

const __dirname = dirname(fileURLToPath(import.meta.url))

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'WonderLab Server Developer API Docs',
            version: '1.0.0',
            description: '前端开发请参照此文档'
        },
        servers: [
            {
                url: 'http://localhost:3000/api',
                description: 'Development server',
            },
        ],
        components: {
            schemas: {
                SuccessResponse: {
                    type: Object,
                    properties: {
                        status: { type: 'string', example: 'success' },
                        code: { type: 'integer', example: 200 },
                        message: { type: 'string', example: 'Operation successful' },
                        data: { type: 'object', nullable: true }
                    }
                },
                ErrorResponse: {
                    type: Object,
                    properties: {
                        status: { type: 'string', example: 'error' },
                        code: { type: 'integer', example: 400 },
                        message: { type: 'string', example: 'Error message' },
                        data: { type: 'object', nullable: true }
                    }
                },
                EquipmentInfo: {
                    type: Object,
                    properties: {
                        info_uuid: { type: 'string' },
                        bios_id: { type: 'string' },
                        country: { type: 'string' },
                        user_id: { type: 'integer' },
                        date: { type: 'string', format: 'date-time' }
                    }
                },
                EquipmentDisposition: {
                    type: Object,
                    properties: {
                        info_uuid: { type: 'string' },
                        equipment_uuid: { type: 'string' },
                        system_architecture: { type: 'string' },
                        system: { type: 'string' },
                        system_id: { type: 'string' },
                        ram_info: { type: 'string' },
                        date: { type: 'string', format: 'date-time' },
                        wonderlab_run_file: { type: 'string' },
                        wonderlab_v: { type: 'string' }
                    }
                }
            }
        }
    },
    apis: [path.join(__dirname, '../routes/*.ts')],
}

const swaggerSpec = swaggerJsdoc(options);


export default swaggerSpec;