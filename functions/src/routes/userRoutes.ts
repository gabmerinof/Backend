import {Router} from 'express';
import {UserController} from '../controllers/UserController';

const router = Router();
const userController = new UserController();

router.post('/users/find-or-create', userController.findOrCreateUser);
router.get('/users/check/:email', userController.checkUser);

export default router;
