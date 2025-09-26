"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const firebase_1 = require("../config/firebase");
const USERS_COLLECTION = 'Users';
class UserRepository {
    async findByEmail(email) {
        try {
            const user = await firebase_1.db.collection(USERS_COLLECTION)
                .where('email', '==', email.toLowerCase()).limit(1)
                .get();
            if (user.empty)
                return null;
            const doc = user.docs[0];
            if (!doc)
                return null;
            return {
                id: doc.id,
                ...doc.data()
            };
        }
        catch (error) {
            console.log(error);
            throw new Error('Error al buscar el usuario por medio de su correo electrónico');
        }
    }
    async create(userData) {
        try {
            const userRecord = {
                email: userData.email.toLowerCase(),
                createdAt: new Date(),
                lastLogin: new Date()
            };
            const docRef = await firebase_1.db.collection(USERS_COLLECTION).add(userRecord);
            return {
                id: docRef.id,
                ...userRecord
            };
        }
        catch (error) {
            throw new Error('Error al crear el usuario');
        }
    }
    async updateLastLogin(userId) {
        try {
            await firebase_1.db.collection(USERS_COLLECTION).doc(userId).update({
                lastLogin: new Date()
            });
        }
        catch (error) {
            throw new Error('Error al actualizar el usuario');
        }
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=UserRepository.js.map