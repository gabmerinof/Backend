import cors from 'cors';

export const corsMiddleware = cors({
  origin: function(origin, callback) {
    // Permitir peticiones sin origin (como mobile apps o curl)
    if (!origin) return callback(null, true);

    // Lista de dominios permitidos
    const allowedOrigins = [
      'http://localhost:4200',
      'https://challengetask-bdfd6.firebaseio.com',
      'https://front-end-git-master-gabriel-merinos-projects.vercel.app',
      'https://front-2z51x8znj-gabriel-merinos-projects.vercel.app',
    ];

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por políticas de CORS 123' + origin));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'user-id'],
});
