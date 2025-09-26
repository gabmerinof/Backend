import {TaskRepository} from '../repositories/TaskRepository';
import {Task, CreateTaskRequest, UpdateTaskRequest, TaskResponse, Timestamp} from '../models/Task';

export class TaskService {
  private taskRepository: TaskRepository;

  constructor() {
    this.taskRepository = new TaskRepository();
  }

  async getUserTasks(userId: string, skip: string, top: string ): Promise<Task[]> {
    if (!userId) {
      throw new Error('Código de usuario es requerido');
    }

    return await this.taskRepository.findByUserId(userId, skip, top);
  }

  async getUserTasksCount(userId: string ): Promise<number> {
    if (!userId) {
      throw new Error('Código de usuario es requerido');
    }

    return await this.taskRepository.findByUserIdCount(userId);
  }

  async getTask(taskId: string): Promise<Task | null> {
    if (!taskId) {
      throw new Error('Código de Tarea es requerido');
    }

    return await this.taskRepository.findById(taskId);
  }

  async createTask(taskData: CreateTaskRequest): Promise<Task> {
    if (!taskData.title || !taskData.title.trim()) {
      throw new Error('El título de la tarea es requerido');
    }

    if (!taskData.userId) {
      throw new Error('Código de usuario es requerido');
    }

    const taskRequest: CreateTaskRequest = {
      title: taskData.title.trim(),
      description: taskData.description?.trim() || '',
      userId: taskData.userId,
    };

    return await this.taskRepository.create(taskRequest);
  }

  async updateTask(taskId: string, updateData: UpdateTaskRequest): Promise<Task> {
    const taskRequest: UpdateTaskRequest = {};

    if (updateData?.title) {
      taskRequest.title = updateData.title.trim();
      if (!taskRequest.title) {
        throw new Error('El título de la tarea no puede ir vacío');
      }
    }

    if (updateData.description !== undefined) {
      taskRequest.description = updateData.description.trim();
    }

    if (updateData.completed !== undefined) {
      taskRequest.completed = updateData.completed;
    }

    return await this.taskRepository.update(taskId, taskRequest);
  }

  async deleteTask(taskId: string): Promise<void> {
    await this.taskRepository.delete(taskId);
  }

  formatTasksResponse(tasks: Task[]): TaskResponse[] {
    return tasks.map((task) => this.formatTaskResponse(task));
  }

  formatTaskResponse(task: Task): TaskResponse {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      completed: task.completed,
      createdAt: this.transformDate(task.createdAt),
      updatedAt: this.transformDate(task.updatedAt),
      userId: task.userId,
    };
  }

  private transformDate(date: any): string {
    if (isNaN(date)) return '';

    return date instanceof Date ?
            date.toISOString() :
            new Date((date as unknown as Timestamp)._seconds * 1000).toISOString();
  }
}
