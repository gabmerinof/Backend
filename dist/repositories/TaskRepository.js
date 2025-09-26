"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskRepository = void 0;
const firebase_1 = require("../config/firebase");
const TASKS_COLLECTION = 'Tasks';
class TaskRepository {
    validatePaginationParams(skip, top) {
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
    async findByUserIdCount(userId) {
        try {
            const tasks = await firebase_1.db.collection(TASKS_COLLECTION)
                .where('userId', '==', userId)
                .count()
                .get();
            return tasks.data().count;
        }
        catch (error) {
            if (error instanceof Error && !error.message.includes('UserId es requerido')) {
                throw new Error("Ocurrió un error al obtener el conteo de tareas del usuario");
            }
            throw error;
        }
    }
    async findByUserId(userId, skip, top) {
        try {
            const { skipNum, topNum } = this.validatePaginationParams(skip, top);
            const tasks = await firebase_1.db.collection(TASKS_COLLECTION)
                .where('userId', '==', userId)
                .orderBy('createdAt', 'desc')
                .limit(topNum)
                .offset(skipNum)
                .get();
            return tasks.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        }
        catch (error) {
            console.log(error);
            throw new Error("Ocurrió un error al momento de buscar las tareas del usuario");
        }
    }
    async findById(taskId) {
        try {
            const doc = await firebase_1.db.collection(TASKS_COLLECTION).doc(taskId).get();
            if (!doc.exists)
                return null;
            return {
                id: doc.id,
                ...doc.data()
            };
        }
        catch (error) {
            throw new Error('Error al buscar la tarea');
        }
    }
    async create(taskData) {
        try {
            const today = new Date();
            const taskRecord = {
                ...taskData,
                completed: false,
                createdAt: today,
                updatedAt: today
            };
            const docRef = await firebase_1.db.collection(TASKS_COLLECTION).add(taskRecord);
            return {
                id: docRef.id,
                ...taskRecord
            };
        }
        catch (error) {
            throw error;
        }
    }
    async update(taskId, updateData) {
        try {
            const updateRecord = {
                ...updateData,
                updatedAt: new Date()
            };
            await firebase_1.db.collection(TASKS_COLLECTION).doc(taskId).update(updateRecord);
            const updatedTask = await this.findById(taskId);
            if (!updatedTask)
                throw new Error('Tarea no encontrada');
            return updatedTask;
        }
        catch (error) {
            throw error;
        }
    }
    async delete(taskId) {
        try {
            await firebase_1.db.collection(TASKS_COLLECTION).doc(taskId).delete();
        }
        catch (error) {
            throw new Error('Ocurrió un error al eliminar la tarea');
        }
    }
}
exports.TaskRepository = TaskRepository;
//# sourceMappingURL=TaskRepository.js.map