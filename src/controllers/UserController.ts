import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import jwt from 'jsonwebtoken';
import { createSuccessResponse, createErrorResponse } from '../models/ApiResponse';

/**
 * Controlador para manejar operaciones de usuarios
 * 
 * @description
 * Gestiona las peticiones HTTP relacionadas con usuarios, incluyendo creación, búsqueda y verificación
 * Maneja autenticación JWT y respuestas consistentes para operaciones de usuario
 * 
 * @class UserController
 */
export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    /**
  * Busca un usuario por email y lo crea si no existe (patrón findOrCreate)
  * Genera un token JWT para autenticación y retorna el usuario formateado
  * 
  * @route POST /users/find-or-create
  * @param req - Request de Express con email en el body
  * @param res - Response de Express para enviar la respuesta
  * 
  * @param req.body.email - Email del usuario a buscar o crear
  * 
  * @returns {Object} Respuesta con el usuario formateado, token JWT y mensaje apropiado
  * 
  * @throws {Error} Si ocurre un error durante la búsqueda o creación
  * 
  * @example
  */
    findOrCreateUser = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;
            const { user, exists } = await this.userService.findOrCreateUser(email);

            const token = jwt.sign(user, "a1b2c3d4e5f67890abcdef1234567890", { expiresIn: "1d" });
            const userResponse = this.userService.formatUserResponse(user, exists, token);

            res.status(exists ? 200 : 201).json(
                createSuccessResponse({
                    user: userResponse,
                    message: exists ? '' : 'Usuario Creado'
                })
            );
        } catch (error) {
            res.status(400).json(
                createErrorResponse(
                    'USER_ERROR',
                    error instanceof Error ? error.message : 'Ha ocurrido un error'
                )
            );
        }
    };

    /**
   * Verifica si un usuario existe en el sistema por su email
   * 
   * @route GET /users/check/:email
   * @param req - Request de Express con email como parámetro de ruta
   * @param res - Response de Express para enviar la respuesta
   * 
   * @param req.params.email - Email del usuario a verificar
   * 
   * @returns {Object} Respuesta indicando si el usuario existe o no
   * 
   * @throws {Error} Si no se proporciona el email
   */
    checkUser = async (req: Request, res: Response) => {
        try {
            const { email } = req.params;
            if (!email) throw new Error('Correo electrónico no encontrado, favor verificar');
            const exists = await this.userService.checkUser(email);

            res.status(exists ? 200 : 201).json(
                createSuccessResponse({
                    exists: exists,
                    message: exists ? 'Usuario encontrado' : 'Usuario no encontrado'
                })
            );
        } catch (error) {
            res.status(400).json(
                createErrorResponse(
                    'USER_ERROR',
                    error instanceof Error ? error.message : 'Ha ocurrido un error'
                )
            );
        }
    };
}