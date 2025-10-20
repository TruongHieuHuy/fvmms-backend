"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const validate = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (err) {
            if (err instanceof zod_1.ZodError) {
                const issues = err.issues;
                const messages = issues.map((e) => e.message).join(', ');
                return res.status(400).json({
                    success: false,
                    error: { code: 'VALIDATION_ERROR', message: messages, details: issues },
                });
            }
            // Pass on other kinds of errors
            next(err);
        }
    };
};
exports.validate = validate;
//# sourceMappingURL=validation.middleware.js.map