"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'FVMMS API Documentation',
            version: '1.0.0',
            description: 'API documentation for the Fishing Vessel Monitoring Management System.',
        },
        servers: [
            {
                url: 'http://localhost:3000', // URL server
                description: 'Development server',
            },
        ],
    },
    // Đường dẫn đến các file chứa chú thích OpenAPI
    apis: ['./src/features/**/*.route.ts'],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
exports.default = swaggerSpec;
//# sourceMappingURL=swagger.js.map