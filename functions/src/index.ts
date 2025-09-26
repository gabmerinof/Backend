/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {setGlobalOptions} from 'firebase-functions';
// import {onRequest} from "firebase-functions/https";
// import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({maxInstances: 10});

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

import * as functions from 'firebase-functions';
import express from 'express';
import nocache from 'nocache';
import compression from 'compression';
import {corsMiddleware} from './config/cors';
import taskRoutes from './routes/taskRoutes';
import userRoutes from './routes/userRoutes';
// import dotenv from "dotenv";

const app = express();
app.use(nocache());
app.use(compression());
app.use(corsMiddleware);
// dotenv.config({path: '././../.env.development'});
app.use(express.json({limit: '1gb'}));
app.use(express.urlencoded({
  extended: true,
  inflate: true,
  limit: '1mb',
  parameterLimit: 5000,
  type: 'application/x-www-form-urlencoded',
}));

app.use('/api', taskRoutes);
app.use('/api', userRoutes);

app.get('/', function(req, res) {
  res.send('Sistema de gestión de Tareas por Usuario');
});

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada',
  });
});

app.use((error: any, req: any, res: any, next: any) => {
  res.status(500).json({
    success: false,
    error: 'Error',
    message: error.message,
  });
});

// app.listen(3000, () => {
//   console.log('App listening on port 3000!');
// });

export const api = functions.https.onRequest(app);
