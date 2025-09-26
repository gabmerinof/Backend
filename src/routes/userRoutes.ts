import { Router } from "express";
import { UserController } from '../controllers/UserController';

/**
 * Router para la gestión de usuarios
 * 
 * Este módulo define las rutas relacionadas con operaciones de búsqueda,
 * verificación y creación de usuarios. No requiere autenticación ya que
 * se utiliza durante el proceso de login/registro.
 */
const router = Router();
const userController = new UserController();

/**
 * @route POST /users/find-or-create
 * @description Busca un usuario por email y lo crea si no existe (operación atómica)
 * @access Público (utilizado durante el proceso de autenticación)
 * 
 * @body {FindOrCreateUserRequest} - Objeto con el email del usuario a buscar/crear
 * @returns {User} El usuario existente o recién creado, incluyendo su ID
 */
router.post('/users/find-or-create', userController.findOrCreateUser);

/**
 * @route GET /users/check/:email
 * @description Verifica si un usuario existe en el sistema por su email
 * @access Público (utilizado para validaciones previas al registro)
 * 
 * @param {string} email - Email del usuario a verificar (parámetro de ruta, URL encoded)
 * @returns {CheckUserResponse} Objeto con indicador de existencia y datos básicos del usuario
 */
router.get('/users/check/:email', userController.checkUser);

export default router;