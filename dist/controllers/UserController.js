"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const UserService_1 = require("../services/UserService");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ApiResponse_1 = require("../models/ApiResponse");
class UserController {
    constructor() {
        this.findOrCreateUser = async (req, res) => {
            try {
                const { email } = req.body;
                const { user, exists } = await this.userService.findOrCreateUser(email);
                const token = jsonwebtoken_1.default.sign(user, "a1b2c3d4e5f67890abcdef1234567890", { expiresIn: "1d" });
                const userResponse = this.userService.formatUserResponse(user, exists, token);
                res.status(exists ? 200 : 201).json((0, ApiResponse_1.createSuccessResponse)({
                    user: userResponse,
                    message: exists ? '' : 'Usuario Creado'
                }));
            }
            catch (error) {
                res.status(400).json((0, ApiResponse_1.createErrorResponse)('USER_ERROR', error instanceof Error ? error.message : 'Ha ocurrido un error'));
            }
        };
        this.checkUser = async (req, res) => {
            try {
                const { email } = req.params;
                if (!email)
                    throw new Error('Correo electrónico no encontrado, favor verificar');
                const exists = await this.userService.checkUser(email);
                res.status(exists ? 200 : 201).json((0, ApiResponse_1.createSuccessResponse)({
                    exists: exists,
                    message: exists ? 'Usuario encontrado' : 'Usuario no encontrado'
                }));
            }
            catch (error) {
                res.status(400).json((0, ApiResponse_1.createErrorResponse)('USER_ERROR', error instanceof Error ? error.message : 'Ha ocurrido un error'));
            }
        };
        this.userService = new UserService_1.UserService();
    }
}
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map