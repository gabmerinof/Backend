"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const UserRepository_1 = require("../repositories/UserRepository");
class UserService {
    constructor() {
        this.userRepository = new UserRepository_1.UserRepository();
    }
    async findOrCreateUser(email) {
        if (!this.isValidEmail(email))
            throw new Error('formato de correo inválido');
        let user = await this.userRepository.findByEmail(email);
        let exists = true;
        if (!user) {
            const createRequest = { email };
            user = await this.userRepository.create(createRequest);
            exists = false;
        }
        else {
            await this.userRepository.updateLastLogin(user.id);
        }
        return { user, exists };
    }
    async checkUser(email) {
        if (!this.isValidEmail(email))
            throw new Error('formato de correo inválido');
        let user = await this.userRepository.findByEmail(email);
        let exists = user !== null;
        return exists;
    }
    formatUserResponse(user, exists, token) {
        return {
            id: user.id,
            email: user.email,
            createdAt: this.transformDate(user.createdAt),
            exists,
            token
        };
    }
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    transformDate(date) {
        if (isNaN(date))
            return "";
        return date instanceof Date ?
            date.toISOString() :
            new Date(date._seconds * 1000).toISOString();
    }
}
exports.UserService = UserService;
//# sourceMappingURL=UserService.js.map