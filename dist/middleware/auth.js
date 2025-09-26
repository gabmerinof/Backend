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
        const authHeader = req.header('authorization');
        if (!authHeader)
            throw new Error('Header de autorización no presente');
        if (!authHeader.startsWith('Bearer '))
            throw new Error('Formato de autorización inválido. Use: Bearer <token>');
        const token = authHeader.replace('Bearer ', '');
        if (!token)
            throw new Error('Token no proporcionado');
        jsonwebtoken_1.default.verify(token, JWT_SECRET);
        next();
    }
    catch (err) {
        let errorMessage = 'Error de autenticación';
        if (err instanceof jsonwebtoken_1.default.TokenExpiredError) {
            errorMessage = 'Token expirado. Por favor, inicie sesión nuevamente';
        }
        else if (err instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            errorMessage = 'Token inválido. Verifique sus credenciales';
        }
        else if (err instanceof Error) {
            errorMessage = err.message;
        }
        res.status(401).json((0, ApiResponse_1.createErrorResponse)('TOKEN_ERROR', errorMessage));
    }
};
exports.auth = auth;
//# sourceMappingURL=auth.js.map