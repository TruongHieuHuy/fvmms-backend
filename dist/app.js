"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_route_1 = __importDefault(require("./api/auth/auth.route"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = __importDefault(require("./swagger"));
const error_middleware_1 = require("./core/middlewares/error.middleware");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Mount routes
app.use('/api/auth', auth_route_1.default);
const port = process.env.PORT ? Number(process.env.PORT) : 4000;
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
// Global error handler (đặt cuối cùng)
app.use(error_middleware_1.errorMiddleware);
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`API docs available at http://localhost:${port}/api-docs`);
});
//# sourceMappingURL=app.js.map