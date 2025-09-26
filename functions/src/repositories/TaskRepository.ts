import {db} from '../config/firebase';
import {Task, CreateTaskRequest, UpdateTaskRequest} from '../models/Task';

const TASKS_COLLECTION = 'Tasks';

export class TaskRepository {
  async findByUserIdCount(userId: string): Promise<number> {
    try {
      const tasks = await db.collection(TASKS_COLLECTION)
          .where('userId', '==', userId)
          .count()
          .get();

      return tasks.data().count;
    } catch (error) {
      console.log(error);
      throw new Error('Ocurrió un error al momento de buscar las tareas del usuario');
    }
  }

  async findByUserId(userId: string, skip: string, top: string): Promise<Task[]> {
    try {
      const tasks = await db.collection(TASKS_COLLECTION)
          .where('userId', '==', userId).orderBy('createdAt', 'desc')
          .limit(parseInt(top))
          .offset(parseInt(skip))
          .get();

      return tasks.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Task));
    } catch (error) {
      console.log(error);
      throw new Error('Ocurrió un error al momento de buscar las tareas del usuario');
    }
  }

  async findById(taskId: string): Promise<Task | null> {
    try {
      const doc = await db.collection(TASKS_COLLECTION).doc(taskId).get();
      if (!doc.exists) return null;

      return {
        id: doc.id,
        ...doc.data(),
      } as Task;
    } catch (error) {
      throw new Error('Error al buscar la tarea');
    }
  }

  async create(taskData: CreateTaskRequest): Promise<Task> {
    try {
      const today = new Date();
      const taskRecord = {
        ...taskData,
        completed: false,
        createdAt: today,
        updatedAt: today,
      };

      const docRef = await db.collection(TASKS_COLLECTION).add(taskRecord);

      return {
        id: docRef.id,
        ...taskRecord,
      } as Task;
    } catch (error) {
      throw error;
    }
  }

  async update(taskId: string, updateData: UpdateTaskRequest): Promise<Task> {
    try {
      const updateRecord = {
        ...updateData,
        updatedAt: new Date(),
      };

      await db.collection(TASKS_COLLECTION).doc(taskId).update(updateRecord);

      const updatedTask = await this.findById(taskId);
      if (!updatedTask) throw new Error('Tarea no encontrada');


      return updatedTask;
    } catch (error) {
      throw error;
    }
  }

  async delete(taskId: string): Promise<void> {
    try {
      await db.collection(TASKS_COLLECTION).doc(taskId).delete();
    } catch (error) {
      throw new Error('Ocurrió un error al eliminar la tarea');
    }
  }
}
