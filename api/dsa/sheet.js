const Module = require('module');
const path = require('path');

const backendModules = path.join(__dirname, '..', '..', 'backend', 'node_modules');
process.env.NODE_PATH = [backendModules, process.env.NODE_PATH].filter(Boolean).join(path.delimiter);
Module._initPaths();

const admin = require('firebase-admin');

const getDb = () => {
  if (!admin.apps.length) {
    const privateKey = (process.env.FIREBASE_PRIVATE_KEY || '')
      .trim()
      .replace(/^["']|["']$/g, '')
      .replace(/\\n/g, '\n');

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey,
      }),
    });
  }

  return admin.firestore();
};

const toDate = (value) => {
  if (value && typeof value.toDate === 'function') return value.toDate();
  if (value instanceof Date) return value;
  return new Date(value || Date.now());
};

const loadSheet = async () => {
  const db = getDb();
  const headingsSnap = await db.collection('dsa-headings').get();

  const headings = await Promise.all(headingsSnap.docs.map(async (headingDoc) => {
    const heading = headingDoc.data();
    const subSnap = await headingDoc.ref.collection('dsa-subheadings').get();

    const subheadings = await Promise.all(subSnap.docs.map(async (subDoc) => {
      const sub = subDoc.data();
      const questionSnap = await subDoc.ref.collection('dsa-questions').get();

      return {
        id: subDoc.id,
        name: sub.name,
        createdAt: toDate(sub.createdAt),
        updatedAt: toDate(sub.updatedAt),
        questions: questionSnap.docs.map((questionDoc) => {
          const question = questionDoc.data();
          return {
            id: questionDoc.id,
            name: question.name,
            article: question.article,
            difficulty: question.difficulty,
            youtubeLink: question.youtubeLink,
            questionLink: question.questionLink,
            createdAt: toDate(question.createdAt),
            updatedAt: toDate(question.updatedAt),
          };
        }).sort((a, b) => a.createdAt - b.createdAt),
      };
    }));

    subheadings.sort((a, b) => a.createdAt - b.createdAt);

    return {
      id: headingDoc.id,
      name: heading.name,
      createdAt: toDate(heading.createdAt),
      updatedAt: toDate(heading.updatedAt),
      subheadings,
    };
  }));

  headings.sort((a, b) => a.createdAt - b.createdAt);

  const lastUpdated = headings.reduce(
    (latest, heading) => (heading.updatedAt > latest ? heading.updatedAt : latest),
    new Date(0)
  );

  return { headings, lastUpdated: headings.length ? lastUpdated : new Date() };
};

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ success: false, message: 'Method not allowed' });
    return;
  }

  try {
    const data = await loadSheet();
    res.status(200).json({
      success: true,
      data,
      message: 'DSA sheet data retrieved successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve DSA sheet data',
    });
  }
};
