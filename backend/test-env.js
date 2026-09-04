require('dotenv').config();

console.log('Environment Variables Check:');
console.log('PORT:', process.env.PORT);
console.log('FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID);
console.log('FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL);
console.log('FIREBASE_PRIVATE_KEY exists:', !!process.env.FIREBASE_PRIVATE_KEY);
console.log('FIREBASE_PRIVATE_KEY length:', process.env.FIREBASE_PRIVATE_KEY?.length);

if (process.env.FIREBASE_PRIVATE_KEY) {
  console.log('FIREBASE_PRIVATE_KEY starts with:', process.env.FIREBASE_PRIVATE_KEY.substring(0, 50));
  console.log('FIREBASE_PRIVATE_KEY ends with:', process.env.FIREBASE_PRIVATE_KEY.substring(process.env.FIREBASE_PRIVATE_KEY.length - 50));
}
