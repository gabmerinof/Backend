import { Router } from "express";
import { TaskController } from '../controllers/TaskController';
import { auth } from "../middleware/auth";

/**
 * Router para la gestión de tareas
 * 
 * Este módulo define todas las rutas relacionadas con operaciones CRUD de tareas.
 * Todas las rutas están protegidas por el middleware de autenticación.
 */
const router = Router();
const taskController = new TaskController();

/**
 * @route GET /tasks/task/:taskId
 * @description Obtiene una tarea específica por su ID
 * @access Privado (requiere autenticación)
 * 
 * @param {string} taskId - ID único de la tarea a consultar (parámetro de ruta)
 * @returns {Task} Objeto completo de la tarea solicitada
 */
router.get('/tasks/task/:taskId', auth, taskController.getTask);

/**
 * @route GET /tasks/user/:userId/:skip/:top
 * @description Obtiene una lista paginada de tareas de un usuario específico
 * @access Privado (requiere autenticación)
 * 
 * @param {string} userId - ID del usuario cuyas tareas se quieren consultar
 * @param {number} skip - Número de tareas a saltar (para paginación)
 * @param {number} top - Número máximo de tareas a retornar (límite de página)
 * @returns {Task[]} Array de tareas del usuario, paginado según los parámetros
 */
router.get('/tasks/user/:userId/:skip/:top', auth, taskController.getUserTasks);

/**
 * @route POST /tasks
 * @description Crea una nueva tarea en el sistema
 * @access Privado (requiere autenticación)
 * 
 * @body {CreateTaskRequest} - Datos requeridos para crear la tarea
 * @returns {Task} La tarea recién creada incluyendo su ID generado
 */
router.post('/tasks', auth, taskController.createTask);

/**
 * @route PUT /tasks/:taskId
 * @description Actualiza una tarea existente
 * @access Privado (requiere autenticación)
 * 
 * @param {string} taskId - ID de la tarea a actualizar (parámetro de ruta)
 * @body {UpdateTaskRequest} - Campos a actualizar en la tarea
 * @returns {Task} La tarea actualizada
 */
router.put('/tasks/:taskId', auth, taskController.updateTask);

/**
 * @route DELETE /tasks/:taskId
 * @description Elimina una tarea del sistema
 * @access Privado (requiere autenticación)
 * 
 * @param {string} taskId - ID de la tarea a eliminar (parámetro de ruta)
 * @returns {void} No retorna contenido, solo código de estado
 */
router.delete('/tasks/:taskId', auth, taskController.deleteTask);

export default router;