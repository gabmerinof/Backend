"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const ApiResponse_1 = require("../models/ApiResponse");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = 'a1b2c3d4e5f67890abcdef1234567890';
const auth = async (req, res, next) => {
    try {
        const token = req.header('authorization')?.replace('Bearer ', '');
        if (!token) {
            throw new Error();
        }
        jsonwebtoken_1.default.verify(token, JWT_SECRET);
        next();
    }
    catch (err) {
        res.status(401).json((0, ApiResponse_1.createErrorResponse)('TOKEN_ERROR', 'Error de Autenticación'));
    }
};
exports.auth = auth;
//# sourceMappingURL=auth.js.map