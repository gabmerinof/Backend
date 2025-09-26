"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createErrorResponse = exports.createSuccessResponse = void 0;
const createSuccessResponse = (data) => ({
    success: true,
    data
});
exports.createSuccessResponse = createSuccessResponse;
const createErrorResponse = (error, message) => ({
    success: false,
    error,
    message: message || undefined
});
exports.createErrorResponse = createErrorResponse;
//# sourceMappingURL=ApiResponse.js.map