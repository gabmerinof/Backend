import {Request, Response} from 'express';
import {UserService} from '../services/UserService';
import jwt from 'jsonwebtoken';
import {createSuccessResponse, createErrorResponse} from '../models/ApiResponse';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  findOrCreateUser = async (req: Request, res: Response) => {
    try {
      const {email} = req.body;
      const {user, exists} = await this.userService.findOrCreateUser(email);

      const token = jwt.sign(user, 'a1b2c3d4e5f67890abcdef1234567890', {expiresIn: '1d'});
      const userResponse = this.userService.formatUserResponse(user, exists, token);

      res.status(exists ? 200 : 201).json(
          createSuccessResponse({
            user: userResponse,
            message: exists ? '' : 'Usuario Creado',
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

  checkUser = async (req: Request, res: Response) => {
    try {
      const {email} = req.params;
      if (!email) throw new Error('Correo electrónico no encontrado, favor verificar');
      const exists = await this.userService.checkUser(email);

      res.status(exists ? 200 : 201).json(
          createSuccessResponse({
            exists: exists,
            message: exists ? 'Usuario encontrado' : 'Usuario no encontrado',
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
