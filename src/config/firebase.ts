import * as admin from 'firebase-admin';

/**
 * Módulo de inicialización y configuración de Firebase Admin SDK
 * 
 * @description
 * Configura y exporta las instancias de Firebase Admin para su uso en la aplicación
 * Incluye manejo de errores durante la inicialización y configuración de Firestore
 * 
 * @throws {Error} Si falla la inicialización de Firebase Admin SDK
 */

try {
    const serviceAccount = require('../service-account-key.json');

    /**
 * Inicializa la aplicación de Firebase Admin con las credenciales
 * 
 * @configuration
 * - credential: Certificado de servicio para autenticación
 * - databaseURL: URL de la base de datos Firestore automáticamente generada
 */
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
    });
} catch (error) {
    console.error('Error inicializando Firebase Admin SDK:', error);
    throw error;
}

/**
 * Instancia de Firestore configurada y lista para usar
 * 
 * @description
 * Exporta la instancia de Firestore con configuraciones personalizadas
 * Se aplica ignoreUndefinedProperties para mejor manejo de datos
 */
export const db = admin.firestore();
db.settings({
    ignoreUndefinedProperties: true
});

export default admin;