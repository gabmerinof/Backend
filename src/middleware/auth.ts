import { createErrorResponse } from '../models/ApiResponse';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'a1b2c3d4e5f67890abcdef1234567890';
export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.header('authorization');

        if (!authHeader)
            throw new Error('Header de autorización no presente');

        /** 
        * Validar formato del header Authorization
        * Debe comenzar con "Bearer " seguido del token
        */
        if (!authHeader.startsWith('Bearer '))
            throw new Error('Formato de autorización inválido. Use: Bearer <token>');

        const token = authHeader.replace('Bearer ', '');
        if (!token) throw new Error('Token no proporcionado');

        /**
         * Verificar token y decodificar payload
         * Agregar información del usuario al objeto request para uso posterior
         */
        jwt.verify(token, JWT_SECRET);
        next();

    } catch (err) {
        /**
        * Manejo específico de diferentes tipos de errores JWT
        */
        let errorMessage = 'Error de autenticación';

        if (err instanceof jwt.TokenExpiredError) {
            errorMessage = 'Token expirado. Por favor, inicie sesión nuevamente';
        } else if (err instanceof jwt.JsonWebTokenError) {
            errorMessage = 'Token inválido. Verifique sus credenciales';
        } else if (err instanceof Error) {
            errorMessage = err.message;
        }

        res.status(401).json(
            createErrorResponse(
                'TOKEN_ERROR',
                errorMessage
            )
        );
    }
};