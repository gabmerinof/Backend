import {Request, Response} from 'express';
import {TaskService} from '../services/TaskService';
import {createSuccessResponse, createErrorResponse} from '../models/ApiResponse';

export class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
  }

  getUserTasks = async (req: Request, res: Response) => {
    try {
      const {userId, skip, top} = req.params;
      if (!userId) throw new Error('Código de usuario no encontrado, favor verificar');

      const tasks = await this.taskService.getUserTasks(userId, skip || '0', top || '20');
      const tasksCount = await this.taskService.getUserTasksCount(userId);
      const tasksResponse = this.taskService.formatTasksResponse(tasks);

      res.status(200).json(
          createSuccessResponse({
            tasks: tasksResponse,
            count: tasksCount,
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

  getTask = async (req: Request, res: Response) => {
    try {
      const {taskId} = req.params;
      if (!taskId) throw new Error('Código de Tarea no encontrado, favor verificar');

      const task = await this.taskService.getTask(taskId);
      if (!task) throw new Error('Tarea no encontrado, favor verificar');

      const taskResponse = this.taskService.formatTaskResponse(task);

      res.status(200).json(
          createSuccessResponse({
            task: taskResponse,
            message: 'Éxito',
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

  createTask = async (req: Request, res: Response) => {
    try {
      const taskData = req.body;
      const newTask = await this.taskService.createTask(taskData);
      const taskResponse = this.taskService.formatTaskResponse(newTask);

      res.status(201).json(
          createSuccessResponse({
            task: taskResponse,
            message: 'Tarea creada correctamente',
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

  updateTask = async (req: Request, res: Response) => {
    try {
      const {taskId} = req.params;
      if (!taskId) throw new Error('No encontré el Id de la tarea, favor verificar');

      const updateData = req.body;
      const updatedTask = await this.taskService.updateTask(taskId, updateData);
      const taskResponse = this.taskService.formatTaskResponse(updatedTask);

      res.status(200).json(
          createSuccessResponse({
            task: taskResponse,
            message: 'Tarea actualizada correctamente',
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

  deleteTask = async (req: Request, res: Response) => {
    try {
      const {taskId} = req.params;
      if (!taskId) throw new Error('No encontré el Id de la tarea, favor verificar');
      await this.taskService.deleteTask(taskId);

      res.status(200).json(
          createSuccessResponse({
            message: 'Tarea eliminada correctamente',
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
