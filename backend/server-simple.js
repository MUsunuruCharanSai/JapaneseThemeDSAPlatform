require('dotenv').config();
const admin = require('firebase-admin');

console.log('🔧 Firebase Config Check:');
console.log('Project ID:', process.env.FIREBASE_PROJECT_ID);
console.log('Client Email:', process.env.FIREBASE_CLIENT_EMAIL);
console.log('Private Key exists:', !!process.env.FIREBASE_PRIVATE_KEY);

// Firebase Admin SDK configuration
const serviceAccount = {
  type: 'service_account',
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
};

console.log('🔧 Service Account Object:');
console.log('project_id:', serviceAccount.project_id);
console.log('client_email:', serviceAccount.client_email);
console.log('private_key exists:', !!serviceAccount.private_key);

// Initialize Firebase Admin SDK
try {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('✅ Firebase Admin SDK initialized successfully');
  }

  const auth = admin.auth();
  console.log('✅ Firebase Auth initialized successfully');

  console.log('🚀 Server would start here...');

} catch (error) {
  console.error('❌ Firebase Admin SDK initialization failed:', error);
}
