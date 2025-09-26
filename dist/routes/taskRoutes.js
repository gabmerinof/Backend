"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TaskController_1 = require("../controllers/TaskController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const taskController = new TaskController_1.TaskController();
router.get('/tasks/task/:taskId', auth_1.auth, taskController.getTask);
router.get('/tasks/user/:userId/:skip/:top', auth_1.auth, taskController.getUserTasks);
router.post('/tasks', auth_1.auth, taskController.createTask);
router.put('/tasks/:taskId', auth_1.auth, taskController.updateTask);
router.delete('/tasks/:taskId', auth_1.auth, taskController.deleteTask);
exports.default = router;
//# sourceMappingURL=taskRoutes.js.map