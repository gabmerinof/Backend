"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const router = (0, express_1.Router)();
const userController = new UserController_1.UserController();
router.post('/users/find-or-create', userController.findOrCreateUser);
router.get('/users/check/:email', userController.checkUser);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map