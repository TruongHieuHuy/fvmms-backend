"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const jwt_util_1 = require("../utils/jwt.util");
// Middleware Auth JWT
const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Missing or invalid token',
                },
            });
        }
        const token = authHeader.split(' ')[1];
        const decoded = (0, jwt_util_1.verifyToken)(token);
        req.user = { userId: decoded.userId, role: decoded.role };
        next();
    }
    catch (error) {
        res
            .status(403)
            .json({ success: false, error: { code: 'FORBIDDEN', message: 'Invalid or expired token' } });
    }
};
exports.authenticate = authenticate;
// Middleware check role (Use after Authenticate)
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res
                .status(403)
                .json({ success: false, error: { code: 'FORBIDDEN', message: 'Insufficient permission' } });
        }
        next();
    };
};
exports.authorize = authorize;
//# sourceMappingURL=auth.middleware.js.map