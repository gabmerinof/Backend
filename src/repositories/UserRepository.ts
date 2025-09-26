import { db } from '../config/firebase';
import { User, CreateUserRequest } from '../models/User';

const USERS_COLLECTION = 'Users';

/**
 * Repositorio para operaciones de base de datos relacionadas a usuarios
 * 
 * @description
 * Capa de acceso a datos para la entidad User en Firestore
 * Implementa el patrón Repository para abstraer las operaciones de base de datos
 * 
 * @class UserRepository
 */
export class UserRepository {

    /**
     * Busca un usuario en la base de datos por su dirección de correo electrónico.
     * 
     * Este método realiza una consulta case-insensitive (convirtiendo el email a minúsculas)
     * y retorna el primer usuario que coincida con el email proporcionado.
     * 
     * @param email - Dirección de correo electrónico a buscar (case-insensitive)
     * @returns Promise<User | null> - El objeto User si se encuentra, null si no existe
     * @throws Error - Si ocurre un error en la consulta a la base de datos
     * }
     */
    async findByEmail(email: string): Promise<User | null> {
        try {
            const user = await db.collection(USERS_COLLECTION)
                .where('email', '==', email.toLowerCase()).limit(1)
                .get();

            if (user.empty) return null;

            const doc = user.docs[0];
            if (!doc) return null;

            return {
                id: doc.id,
                ...doc.data()
            } as User;
        } catch (error) {
            console.log(error);
            throw new Error('Error al buscar el usuario por medio de su correo electrónico');
        }
    }

    /**
     * Crea un nuevo usuario en la base de datos.
     * 
     * Este método normaliza el email a minúsculas, establece automáticamente
     * las fechas de creación y último login, y genera un ID único para el usuario.
     * 
     * @param userData - Datos requeridos para crear el usuario (interfaz CreateUserRequest)
     * @returns Promise<User> - El objeto User creado, incluyendo el ID generado
     * @throws Error - Si ocurre un error al crear el usuario en la base de datos
     */
    async create(userData: CreateUserRequest): Promise<User> {
        try {
            const userRecord = {
                email: userData.email.toLowerCase(),
                createdAt: new Date(),
                lastLogin: new Date()
            };

            const docRef = await db.collection(USERS_COLLECTION).add(userRecord);

            return {
                id: docRef.id,
                ...userRecord
            } as User;
        } catch (error) {
            throw new Error('Error al crear el usuario');
        }
    }

    /**
     * Actualiza la fecha de último login de un usuario existente.
     * 
     * Este método actualiza exclusivamente el campo 'lastLogin' del usuario
     * con la fecha y hora actual del sistema.
     * 
     * @param userId - ID único del usuario a actualizar
     * @returns Promise<void> - No retorna datos, solo confirma la operación
     * @throws Error - Si ocurre un error al actualizar el usuario
     */
    async updateLastLogin(userId: string): Promise<void> {
        try {
            await db.collection(USERS_COLLECTION).doc(userId).update({
                lastLogin: new Date()
            });
        } catch (error) {
            throw new Error('Error al actualizar el usuario');
        }
    }
}