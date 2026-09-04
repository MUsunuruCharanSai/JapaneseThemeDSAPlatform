const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

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

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const firestore = admin.firestore();
const DATA_FILE = path.join(__dirname, 'data', 'dsa-sheet.json');

// Firestore collection names
const HEADINGS_COLLECTION = 'dsa-headings';
const SUBHEADINGS_COLLECTION = 'dsa-subheadings';
const QUESTIONS_COLLECTION = 'dsa-questions';

async function migrateDataToFirestore() {
  try {
    console.log('🚀 Starting migration from JSON to Firestore...');

    // Read existing JSON data
    if (!fs.existsSync(DATA_FILE)) {
      console.log('❌ No existing JSON data file found. Nothing to migrate.');
      return;
    }

    const jsonData = fs.readFileSync(DATA_FILE, 'utf8');
    const data = JSON.parse(jsonData);

    console.log(`📊 Found ${data.headings?.length || 0} headings to migrate`);

    // Clear existing Firestore data (optional - comment out if you want to keep existing data)
    console.log('🧹 Clearing existing Firestore data...');
    await clearExistingData();

    // Migrate headings, subheadings, and questions
    for (const heading of data.headings || []) {
      console.log(`📝 Migrating heading: ${heading.name}`);

      // Create heading document
      const headingRef = firestore.collection(HEADINGS_COLLECTION).doc(heading.id);
      await headingRef.set({
        name: heading.name,
        createdAt: new Date(heading.createdAt),
        updatedAt: new Date(heading.updatedAt),
      });

      // Migrate subheadings
      for (const subheading of heading.subheadings || []) {
        console.log(`  ├── Migrating subheading: ${subheading.name}`);

        // Create subheading document
        const subheadingRef = headingRef.collection(SUBHEADINGS_COLLECTION).doc(subheading.id);
        await subheadingRef.set({
          name: subheading.name,
          createdAt: new Date(subheading.createdAt),
          updatedAt: new Date(subheading.updatedAt),
        });

        // Migrate questions
        for (const question of subheading.questions || []) {
          console.log(`    ├── Migrating question: ${question.name}`);

          // Create question document
          const questionRef = subheadingRef.collection(QUESTIONS_COLLECTION).doc(question.id);
          await questionRef.set({
            name: question.name,
            article: question.article,
            difficulty: question.difficulty,
            youtubeLink: question.youtubeLink,
            createdAt: new Date(question.createdAt),
            updatedAt: new Date(question.updatedAt),
          });
        }

        console.log(`    └── Migrated ${subheading.questions?.length || 0} questions`);
      }

      console.log(`  └── Migrated ${heading.subheadings?.length || 0} subheadings`);
    }

    console.log('✅ Migration completed successfully!');
    console.log('🔄 You can now safely remove the JSON file and restart your server.');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    // Close Firebase connection
    await admin.app().delete();
  }
}

async function clearExistingData() {
  try {
    // Get all headings
    const headingsSnapshot = await firestore.collection(HEADINGS_COLLECTION).get();

    const batch = firestore.batch();

    for (const headingDoc of headingsSnapshot.docs) {
      // Delete heading document
      batch.delete(headingDoc.ref);

      // Get all subheadings for this heading
      const subheadingsSnapshot = await headingDoc.ref.collection(SUBHEADINGS_COLLECTION).get();

      for (const subheadingDoc of subheadingsSnapshot.docs) {
        // Get all questions for this subheading
        const questionsSnapshot = await subheadingDoc.ref.collection(QUESTIONS_COLLECTION).get();

        // Delete all questions
        questionsSnapshot.docs.forEach(questionDoc => {
          batch.delete(questionDoc.ref);
        });

        // Delete subheading
        batch.delete(subheadingDoc.ref);
      }
    }

    await batch.commit();
    console.log('🧹 Cleared existing Firestore data');
  } catch (error) {
    console.error('❌ Error clearing existing data:', error);
    throw error;
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  migrateDataToFirestore()
    .then(() => {
      console.log('🎉 Migration script finished');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration script failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateDataToFirestore };
