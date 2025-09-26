import { UserRepository } from '../repositories/UserRepository';
import { User, CreateUserRequest, UserResponse } from '../models/User';
import { Timestamp } from '../models/Task';

export class UserService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    /**
     * Busca un usuario por email y lo crea si no existe (operación atómica)
     * @param email - Email del usuario a buscar o crear
     * @returns Promise<{ user: User; exists: boolean }> - Objeto con el usuario y indicador de existencia
     * @throws Error - Si el formato de email es inválido
     */
    async findOrCreateUser(email: string): Promise<{ user: User; exists: boolean }> {
        if (!this.isValidEmail(email))
            throw new Error('formato de correo inválido');

        let user = await this.userRepository.findByEmail(email);
        let exists = true;

        if (!user) {
            const createRequest: CreateUserRequest = { email };
            user = await this.userRepository.create(createRequest);
            exists = false;
        } else {
            await this.userRepository.updateLastLogin(user.id);
        }

        return { user, exists };
    }

    /**
     * Verifica si un usuario existe en el sistema por su email
     * @param email - Email del usuario a verificar
     * @returns Promise<boolean> - true si el usuario existe, false si no existe
     * @throws Error - Si el formato de email es inválido
     */
    async checkUser(email: string): Promise<boolean> {
        if (!this.isValidEmail(email))
            throw new Error('formato de correo inválido');

        let user = await this.userRepository.findByEmail(email);
        let exists = user !== null;

        return exists;
    }

    /**
     * Formatea la respuesta del usuario para la API
     * @param user - Objeto User a formatear
     * @param exists - Indicador de si el usuario existía previamente
     * @param token - Token de autenticación JWT
     * @returns UserResponse - Objeto formateado para respuesta API
     */
    formatUserResponse(user: User, exists: boolean, token: string): UserResponse {
        return {
            id: user.id,
            email: user.email,
            createdAt: this.transformDate(user.createdAt),
            exists,
            token
        };
    }

    /**
     * Valida el formato de una dirección de correo electrónico
     * @param email - Email a validar
     * @returns boolean - true si el formato es válido, false si es inválido
     */
    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return emailRegex.test(email);
    }

    /**
     * Transforma diferentes formatos de fecha a string ISO
     * @param date - Fecha en formato Date, Timestamp de Firestore, o otro
     * @returns string - Fecha en formato ISO string, o string vacío si es inválida
     */    
    private transformDate(date: any): string {
        if (isNaN(date)) return "";

        return date instanceof Date ?
            date.toISOString() :
            new Date((date as unknown as Timestamp)._seconds * 1000).toISOString();
    }
}