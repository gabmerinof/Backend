import { Request, Response } from 'express';
import { TaskService } from '../services/TaskService';
import { createSuccessResponse, createErrorResponse } from '../models/ApiResponse';

/**
 * Controlador para manejar las operaciones CRUD de tareas
 * 
 * @description
 * Gestiona las peticiones HTTP relacionadas con tareas y delega la lógica de negocio al TaskService
 * Se encarga de la validación de entrada, formateo de respuestas y manejo de errores
 */
export class TaskController {
    private taskService: TaskService;

    constructor() {
        this.taskService = new TaskService();
    }

    /**
    * Obtiene las tareas de un usuario específico con paginación
    * 
    * @route GET /users/:userId/:skip/:top
    * @param req - Request de Express con parámetros de usuario y paginación
    * @param res - Response de Express para enviar la respuesta
    * 
    * @param req.params.userId - ID del usuario cuyas tareas se quieren obtener
    * @param req.params.skip - Número de tareas a saltar (para paginación)
    * @param req.params.top - Número máximo de tareas a retornar (límite de paginación)
    * 
    * @returns {Object} Respuesta con lista de tareas formateadas y conteo total
    * 
    * @throws {Error} Si no se proporciona el userId
    */
    getUserTasks = async (req: Request, res: Response) => {
        try {
            const { userId, skip, top } = req.params;
            if (!userId) throw new Error('Código de usuario no encontrado, favor verificar');

            const tasks = await this.taskService.getUserTasks(userId, skip || '0', top || '20');
            const tasksCount = await this.taskService.getUserTasksCount(userId);
            const tasksResponse = this.taskService.formatTasksResponse(tasks);

            res.status(200).json(
                createSuccessResponse({
                    tasks: tasksResponse,
                    count: tasksCount
                })
            );
        } catch (error) {
            res.status(400).json(
                createErrorResponse(
                    'TASKS_ERROR',
                    error instanceof Error ? error.message : 'Ha ocurrido un error'
                )
            );
        }
    };

    /**
 * Obtiene una tarea específica por su ID
 * 
 * @route GET /tasks/:taskId
 * @param req - Request de Express con el ID de la tarea
 * @param res - Response de Express para enviar la respuesta
 * 
 * @param req.params.taskId - ID de la tarea a obtener
 * 
 * @returns {Object} Respuesta con la tarea formateada
 * 
 * @throws {Error} Si no se proporciona taskId o si la tarea no existe
 */
    getTask = async (req: Request, res: Response) => {
        try {
            const { taskId } = req.params;
            if (!taskId) throw new Error('Código de Tarea no encontrado, favor verificar');

            const task = await this.taskService.getTask(taskId);
            if (!task) throw new Error('Tarea no encontrado, favor verificar');

            const taskResponse = this.taskService.formatTaskResponse(task);

            res.status(200).json(
                createSuccessResponse({
                    task: taskResponse,
                    message: 'Éxito'
                })
            );
        } catch (error) {
            res.status(400).json(
                createErrorResponse(
                    'TASKS_ERROR',
                    error instanceof Error ? error.message : 'Ha ocurrido un error'
                )
            );
        }
    };

    /**
 * Crea una nueva tarea
 * 
 * @route POST /tasks
 * @param req - Request de Express con los datos de la tarea en el body
 * @param res - Response de Express para enviar la respuesta
 * 
 * @param req.body - Datos de la tarea a crear (title, description, userId, etc.)
 * 
 * @returns {Object} Respuesta con la tarea creada y formateada
 */
    createTask = async (req: Request, res: Response) => {
        try {
            const taskData = req.body;
            const newTask = await this.taskService.createTask(taskData);
            const taskResponse = this.taskService.formatTaskResponse(newTask);

            res.status(201).json(
                createSuccessResponse({
                    task: taskResponse,
                    message: 'Tarea creada correctamente'
                })
            );
        } catch (error) {
            res.status(400).json(
                createErrorResponse(
                    'TASK_ERROR',
                    error instanceof Error ? error.message : 'Ha ocurrido un error'
                )
            );
        }
    };


    /**
     * Actualiza una tarea existente
     * 
     * @route PUT /tasks/:taskId
     * @param req - Request de Express con el ID de la tarea y datos a actualizar
     * @param res - Response de Express para enviar la respuesta
     * 
     * @param req.params.taskId - ID de la tarea a actualizar
     * @param req.body - Datos a actualizar (title, description, completed, etc.)
     * 
     * @returns {Object} Respuesta con la tarea actualizada y formateada
     * 
     * @throws {Error} Si no se proporciona taskId
     */
    updateTask = async (req: Request, res: Response) => {
        try {
            const { taskId } = req.params;
            if (!taskId) throw new Error('No encontré el Id de la tarea, favor verificar');

            const updateData = req.body;
            const updatedTask = await this.taskService.updateTask(taskId, updateData);
            const taskResponse = this.taskService.formatTaskResponse(updatedTask);

            res.status(200).json(
                createSuccessResponse({
                    task: taskResponse,
                    message: 'Tarea actualizada correctamente'
                })
            );
        } catch (error) {
            res.status(400).json(
                createErrorResponse(
                    'TASK_ERROR',
                    error instanceof Error ? error.message : 'Ha ocurrido un error'
                )
            );
        }
    };

    /**
 * Elimina una tarea existente
 * 
 * @route DELETE /tasks/:taskId
 * @param req - Request de Express con el ID de la tarea a eliminar
 * @param res - Response de Express para enviar la respuesta
 * 
 * @param req.params.taskId - ID de la tarea a eliminar
 * 
 * @returns {Object} Respuesta de confirmación de eliminación
 * 
 * @throws {Error} Si no se proporciona taskId
 */
    deleteTask = async (req: Request, res: Response) => {
        try {
            const { taskId } = req.params;
            if (!taskId) throw new Error('No encontré el Id de la tarea, favor verificar');
            await this.taskService.deleteTask(taskId);

            res.status(200).json(
                createSuccessResponse({
                    message: 'Tarea eliminada correctamente'
                })
            );
        } catch (error) {
            res.status(400).json(
                createErrorResponse(
                    'TASK_ERROR',
                    error instanceof Error ? error.message : 'Ha ocurrido un error'
                )
            );
        }
    };
}