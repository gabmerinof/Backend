import {Router} from 'express';
import {TaskController} from '../controllers/TaskController';
import {auth} from '../middleware/auth';

const router = Router();
const taskController = new TaskController();

router.get('/tasks/task/:taskId', auth, taskController.getTask);
router.get('/tasks/user/:userId/:skip/:top', auth, taskController.getUserTasks);
router.post('/tasks', auth, taskController.createTask);
router.put('/tasks/:taskId', auth, taskController.updateTask);
router.delete('/tasks/:taskId', auth, taskController.deleteTask);

export default router;
