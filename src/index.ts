import * as functions from 'firebase-functions';
import express from 'express';
import nocache from 'nocache';
import compression from 'compression';
import { corsMiddleware } from './config/cors';
import taskRoutes from './routes/taskRoutes';
import userRoutes from './routes/userRoutes';
import dotenv from "dotenv";

/**
 * Configuración principal de la aplicación Express para Firebase Functions
 * 
 * Esta aplicación proporciona una API REST para gestión de tareas y usuarios,
 * diseñada para ejecutarse tanto en entorno local como en Firebase Cloud Functions.
 * 
 * @version 1.0.0
 * @author Gabriel Merino
 */

// Inicialización de la aplicación Express
const app = express();

/**
 * Middleware para prevenir caching en respuestas HTTP
 * @middleware nocache
 * @usage Aplica headers anti-cache a todas las respuestas
 */
app.use(nocache());

/**
 * Middleware de compresión GZIP para optimizar transferencia de datos
 * @middleware compression
 * @usage Comprime respuestas HTTP para reducir ancho de banda
 */
app.use(compression());

/**
 * Middleware CORS para manejo de solicitudes cross-origin
 * @middleware corsMiddleware
 * @usage Habilita CORS para comunicación con frontend en diferentes dominios
 */
app.use(corsMiddleware);
// dotenv.config({path: '././../.env.development'});

/**
 * Configuración del parser para JSON con límite ampliado
 * @middleware express.json
 * @param limit '1gb' - Límite máximo para payloads JSON (útil para archivos grandes)
 */
app.use(express.json({ limit: '1gb' }));

/**
 * Configuración del parser para URL encoded data
 * @middleware express.urlencoded
 * @param extended true - Habilita parsing de objetos anidados
 * @param inflate true - Permite descompresión automática
 * @param limit "1mb" - Límite para datos URL encoded
 * @param parameterLimit 5000 - Máximo número de parámetros permitidos
 * @param type "application/x-www-form-urlencoded" - Content-Type específico
 */
app.use(express.urlencoded({
    extended: true,
    inflate: true,
    limit: "1mb",
    parameterLimit: 5000,
    type: "application/x-www-form-urlencoded",
}));

/**
 * Registro de rutas para gestión de tareas
 * @path /api/tasks
 * @usage Todas las rutas de tasksRoutes serán prefijadas con /api
 */
app.use("/api", taskRoutes);

/**
 * Registro de rutas para gestión de usuarios
 * @path /api/users  
 * @usage Todas las rutas de userRoutes serán prefijadas con /api
 */
app.use("/api", userRoutes);

/**
 * Ruta raíz - Endpoint de salud y verificación del servicio
 * @route GET /
 * @description Proporciona un mensaje básico de verificación del servicio
 * @access Público
 */
app.get('/', function (req, res) {
    res.send('Sistema de gestión de Tareas por Usuario');
});

/**
 * Middleware para manejo de rutas no encontradas (404)
 * @middleware *
 * @description Captura todas las rutas no definidas y retorna error 404
 */
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Ruta no encontrada'
    });
});

/**
 * Middleware global para manejo de errores
 * @middleware errorHandler
 * @description Captura todos los errores no manejados y retorna respuesta estandarizada
 * 
 * @param error - Error capturado
 * @param req - Request object
 * @param res - Response object  
 * @param next - Next function
 */
app.use((error: any, req: any, res: any, next: any) => {
    res.status(500).json({
        success: false,
        error: 'Error',
        message: error.message
    });
});

app.listen(3000, () => {
    console.log('App listening on port 3000!');
});

/**
 * Exportación principal para Firebase Cloud Functions
 * @function api
 * @description Punto de entrada para la función HTTP de Firebase
 * 
 * @type functions.https.onRequest
 */
export const api = functions.https.onRequest(app);
functions.https.onRequest((request, response) => {
    response.send('Hello from Firebase!');
});