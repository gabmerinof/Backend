import { TaskRepository } from '../repositories/TaskRepository';
import { Task, CreateTaskRequest, UpdateTaskRequest, TaskResponse, Timestamp } from '../models/Task';

export class TaskService {
    private taskRepository: TaskRepository;

    constructor() {
        this.taskRepository = new TaskRepository();
    }

    /**
     * Obtiene las tareas de un usuario con paginación
     * @param userId - ID único del usuario
     * @param skip - Número de tareas a saltar (para paginación)
     * @param top - Número máximo de tareas a retornar
     * @returns Promise<Task[]> - Lista de tareas del usuario
     * @throws Error - Si el userId no es proporcionado
     */
    async getUserTasks(userId: string, skip: string, top: string): Promise<Task[]> {
        if (!userId)
            throw new Error('Código de usuario es requerido');

        return await this.taskRepository.findByUserId(userId, skip, top);
    }

    /**
     * Obtiene el conteo total de tareas de un usuario
     * @param userId - ID único del usuario
     * @returns Promise<number> - Número total de tareas del usuario
     * @throws Error - Si el userId no es proporcionado
     */
    async getUserTasksCount(userId: string): Promise<number> {
        if (!userId)
            throw new Error('Código de usuario es requerido');

        return await this.taskRepository.findByUserIdCount(userId);
    }

    /**
     * Obtiene una tarea específica por su ID
     * @param taskId - ID único de la tarea
     * @returns Promise<Task | null> - La tarea encontrada o null si no existe
     * @throws Error - Si el taskId no es proporcionado
     */
    async getTask(taskId: string): Promise<Task | null> {
        if (!taskId)
            throw new Error('Código de Tarea es requerido');

        return await this.taskRepository.findById(taskId);
    }

    /**
     * Crea una nueva tarea en el sistema
     * @param taskData - Datos requeridos para crear la tarea
     * @returns Promise<Task> - La tarea recién creada con ID generado
     * @throws Error - Si faltan campos requeridos o son inválidos
     */
    async createTask(taskData: CreateTaskRequest): Promise<Task> {
        if (!taskData.title || !taskData.title.trim())
            throw new Error('El título de la tarea es requerido');

        if (!taskData.description || !taskData.description.trim())
            throw new Error('La descripción de la tarea es requerido');

        if (!taskData.userId)
            throw new Error('Código de usuario es requerido');

        const taskRequest: CreateTaskRequest = {
            title: taskData.title.trim(),
            description: taskData.description.trim() || '',
            userId: taskData.userId
        };

        return await this.taskRepository.create(taskRequest);
    }

    /**
     * Actualiza una tarea existente
     * @param taskId - ID de la tarea a actualizar
     * @param updateData - Campos a actualizar (parcialmente)
     * @returns Promise<Task> - La tarea actualizada
     * @throws Error - Si los datos de actualización son inválidos
     */
    async updateTask(taskId: string, updateData: UpdateTaskRequest): Promise<Task> {
        const taskRequest: UpdateTaskRequest = {};

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

    /**
     * Elimina una tarea del sistema
     * @param taskId - ID de la tarea a eliminar
     * @returns Promise<void>
     */
    async deleteTask(taskId: string): Promise<void> {

        await this.taskRepository.delete(taskId);
    }

    /**
     * Transforma un array de tareas al formato de respuesta estándar
     * @param tasks - Array de tareas a formatear
     * @returns TaskResponse[] - Array de tareas formateadas
     */
    formatTasksResponse(tasks: Task[]): TaskResponse[] {
        return tasks.map(task => this.formatTaskResponse(task));
    }

    /**
     * Transforma una tarea individual al formato de respuesta estándar
     * @param task - Tarea a formatear
     * @returns TaskResponse - Tarea formateada con fechas normalizadas
     */
    formatTaskResponse(task: Task): TaskResponse {
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