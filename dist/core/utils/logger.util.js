"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logInfo = exports.logError = void 0;
const logError = (message, error) => {
    console.error(`[ERROR] ${message}`, error);
};
exports.logError = logError;
const logInfo = (message) => {
    console.log(`[INFO] ${message}`);
};
exports.logInfo = logInfo;
//# sourceMappingURL=logger.util.js.map