"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const TaskRepository_1 = require("../repositories/TaskRepository");
class TaskService {
    constructor() {
        this.taskRepository = new TaskRepository_1.TaskRepository();
    }
    async getUserTasks(userId, skip, top) {
        if (!userId)
            throw new Error('Código de usuario es requerido');
        return await this.taskRepository.findByUserId(userId, skip, top);
    }
    async getUserTasksCount(userId) {
        if (!userId)
            throw new Error('Código de usuario es requerido');
        return await this.taskRepository.findByUserIdCount(userId);
    }
    async getTask(taskId) {
        if (!taskId)
            throw new Error('Código de Tarea es requerido');
        return await this.taskRepository.findById(taskId);
    }
    async createTask(taskData) {
        if (!taskData.title || !taskData.title.trim())
            throw new Error('El título de la tarea es requerido');
        if (!taskData.description || !taskData.description.trim())
            throw new Error('La descripción de la tarea es requerido');
        if (!taskData.userId)
            throw new Error('Código de usuario es requerido');
        const taskRequest = {
            title: taskData.title.trim(),
            description: taskData.description.trim() || '',
            userId: taskData.userId
        };
        return await this.taskRepository.create(taskRequest);
    }
    async updateTask(taskId, updateData) {
        const taskRequest = {};
        if (updateData?.title) {
            taskRequest.title = updateData.title.trim();
            if (!taskRequest.title)
                throw new Error('El título de la tarea no puede ir vacío');
        }
        if (updateData?.description) {
            taskRequest.description = updateData.description.trim();
            if (!taskRequest.description)
                throw new Error('La descripción de la tarea no puede ir vacío');
        }
        if (updateData.completed !== undefined)
            taskRequest.completed = updateData.completed;
        return await this.taskRepository.update(taskId, taskRequest);
    }
    async deleteTask(taskId) {
        await this.taskRepository.delete(taskId);
    }
    formatTasksResponse(tasks) {
        return tasks.map(task => this.formatTaskResponse(task));
    }
    formatTaskResponse(task) {
        return {
            id: task.id,
            title: task.title,
            description: task.description,
            completed: task.completed,
            createdAt: this.transformDate(task.createdAt),
            updatedAt: this.transformDate(task.updatedAt),
            userId: task.userId
        };
    }
    transformDate(date) {
        if (isNaN(date))
            return "";
        return date instanceof Date ?
            date.toISOString() :
            new Date(date._seconds * 1000).toISOString();
    }
}
exports.TaskService = TaskService;
//# sourceMappingURL=TaskService.js.map