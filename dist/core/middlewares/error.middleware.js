"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const logger_util_1 = require("../utils/logger.util");
// Middleware xử lý lỗi chung
const errorMiddleware = (err, req, res, next) => {
    (0, logger_util_1.logError)(`Error on ${req.method} ${req.path}:`, err);
    const isDev = process.env.NODE_ENV === 'development';
    res.status(err.status || 500).json({
        success: false,
        error: Object.assign({ code: err.code || 'INTERNAL_ERROR', message: err.message || 'Internal server error' }, (isDev && { stack: err.stack })),
    });
};
exports.errorMiddleware = errorMiddleware;
//# sourceMappingURL=error.middleware.js.map