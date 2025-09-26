import * as admin from 'firebase-admin';

try {
  const serviceAccount = require('../service-account-key.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
  });
} catch (error) {
  console.error('Error inicializando Firebase Admin SDK:', error);
  throw error;
}

export const db = admin.firestore();
db.settings({
  ignoreUndefinedProperties: true,
});

export default admin;
