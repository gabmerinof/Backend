import { db } from '../config/firebase';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '../models/Task';

const TASKS_COLLECTION = 'Tasks';

/**
 * Repositorio para operaciones de base de datos relacionadas con tareas
 * 
 * @description
 * Capa de acceso a datos para la entidad Task en Firestore
 * Implementa el patrón Repository para abstraer las operaciones de base de datos
 * 
 * @class TaskRepository
 */
export class TaskRepository {

    /**
     * Valida los parámetros de paginación
     */
    private validatePaginationParams(skip: string, top: string): { skipNum: number, topNum: number } {
        const skipNum = parseInt(skip);
        const topNum = parseInt(top);

        if (isNaN(skipNum) || skipNum < 0) {
            throw new Error('El parámetro skip debe ser un número positivo');
        }

        if (isNaN(topNum) || topNum < 1 || topNum > 100) {
            throw new Error('El parámetro top debe ser un número entre 1 y 100');
        }

        return { skipNum, topNum };
    }

    /**
     * Obtiene el conteo total de tareas de un usuario específico
     * 
     * @param userId - ID del usuario cuyo conteo de tareas se desea obtener
     * @returns Promise<number> - Número total de tareas del usuario
     * 
     * @throws {Error} Si ocurre un error al acceder a la base de datos
     */
    async findByUserIdCount(userId: string): Promise<number> {
        try {
            const tasks = await db.collection(TASKS_COLLECTION)
                .where('userId', '==', userId)
                .count()
                .get();

            return tasks.data().count;
        } catch (error) {
            if (error instanceof Error && !error.message.includes('UserId es requerido')) {
                throw new Error("Ocurrió un error al obtener el conteo de tareas del usuario");
            }

            throw error;
        }
    }

    /**
     * Obtiene las tareas de un usuario específico con paginación
     * 
     * @param userId - ID del usuario cuyas tareas se desean obtener
     * @param skip - Número de tareas a saltar (para paginación)
     * @param top - Número máximo de tareas a retornar (límite de paginación)
     * @returns Promise<Task[]> - Lista de tareas del usuario ordenadas por fecha de creación descendente
     * 
     * @throws {Error} Si ocurre un error al acceder a la base de datos
     */
    async findByUserId(userId: string, skip: string, top: string): Promise<Task[]> {
        try {
            const { skipNum, topNum } = this.validatePaginationParams(skip, top);

            const tasks = await db.collection(TASKS_COLLECTION)
                .where('userId', '==', userId)
                .orderBy('createdAt', 'desc')
                .limit(topNum)
                .offset(skipNum)
                .get();

            return tasks.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Task));
        } catch (error) {
            console.log(error);
            throw new Error("Ocurrió un error al momento de buscar las tareas del usuario");
        }
    }

    /**
     * Busca una tarea específica por su ID
     * 
     * @param taskId - ID único de la tarea a buscar
     * @returns Promise<Task | null> - La tarea encontrada o null si no existe
     * 
     * @throws {Error} Si ocurre un error al acceder a la base de datos
     */
    async findById(taskId: string): Promise<Task | null> {
        try {           
            const doc = await db.collection(TASKS_COLLECTION).doc(taskId).get();
            if (!doc.exists) return null;

            return {
                id: doc.id,
                ...doc.data()
            } as Task;
        } catch (error) {
            throw new Error('Error al buscar la tarea');
        }
    }

    /**
     * Crea una nueva tarea en la base de datos
     * 
     * @param taskData - Datos de la tarea a crear
     * @returns Promise<Task> - La tarea creada con su ID generado
     * 
     * @throws {Error} Si ocurre un error al crear la tarea
     */
    async create(taskData: CreateTaskRequest): Promise<Task> {
        try {
            const today = new Date();
            const taskRecord = {
                ...taskData,
                completed: false,
                createdAt: today,
                updatedAt: today
            };

            const docRef = await db.collection(TASKS_COLLECTION).add(taskRecord);

            return {
                id: docRef.id,
                ...taskRecord
            } as Task;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Actualiza una tarea existente
     * 
     * @param taskId - ID de la tarea a actualizar
     * @param updateData - Datos a actualizar en la tarea
     * @returns Promise<Task> - La tarea actualizada
     * 
     * @throws {Error} Si la tarea no existe o ocurre un error al actualizar
     */
    async update(taskId: string, updateData: UpdateTaskRequest): Promise<Task> {
        try {
            const updateRecord = {
                ...updateData,
                updatedAt: new Date()
            };

            await db.collection(TASKS_COLLECTION).doc(taskId).update(updateRecord);

            const updatedTask = await this.findById(taskId);
            if (!updatedTask) throw new Error('Tarea no encontrada');


            return updatedTask;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Elimina una tarea de la base de datos
     * 
     * @param taskId - ID de la tarea a eliminar
     * @returns Promise<void>
     * 
     * @throws {Error} Si ocurre un error al eliminar la tarea
     */
    async delete(taskId: string): Promise<void> {
        try {
            await db.collection(TASKS_COLLECTION).doc(taskId).delete();
        } catch (error) {
            throw new Error('Ocurrió un error al eliminar la tarea');
        }
    }
}