import {createErrorResponse} from '../models/ApiResponse';
import {NextFunction, Request, Response} from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'a1b2c3d4e5f67890abcdef1234567890';
export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new Error();
    }

    jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json(
        createErrorResponse(
            'TOKEN_ERROR',
            'Error de Autenticación'
        )
    );
  }
};
