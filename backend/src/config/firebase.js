const admin = require('firebase-admin');
const path = require('path');

let firebaseAdmin;

const getFirebaseAdmin = () => {
  if (firebaseAdmin) return firebaseAdmin;

  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (serviceAccountPath) {
    const serviceAccount = require(path.resolve(serviceAccountPath));
    firebaseAdmin = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } else {
    // Use application default credentials (for production environments)
    firebaseAdmin = admin.initializeApp({
      credential: admin.credential.applicationDefault()
    });
  }

  return firebaseAdmin;
};

module.exports = { getFirebaseAdmin, admin };
