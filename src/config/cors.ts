import cors from 'cors';

/**
 * Middleware de configuración CORS para Express.js
 * Controla el acceso cross-origin a la API basado en dominios permitidos
 * 
 * @description
 * Implementa políticas de seguridad para restringir qué dominios pueden acceder a la API
 * Incluye soporte para credenciales y headers personalizados
 */

export const corsMiddleware = cors({
     /**
     * Función personalizada para validación de origen
     * Determina qué dominios tienen permitido acceder a los recursos
     * 
     * @param origin - Dominio de origen de la petición (puede ser undefined)
     * @param callback - Función callback para indicar si el origen es permitido
     */

    origin: function (origin, callback) {
        // Permitir peticiones sin origin (como mobile apps o curl)
        if (!origin) return callback(null, true);

        // Lista de dominios permitidos
        const allowedOrigins = [
            'http://localhost:4200',
            'https://challengetask-bdfd6.firebaseio.com',
            'https://front-end-git-master-gabriel-merinos-projects.vercel.app',
            'https://front-2z51x8znj-gabriel-merinos-projects.vercel.app'
        ];

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por políticas de CORS 123'+ origin));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'user-id']
});