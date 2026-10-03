import axios from 'axios';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from './firebase';
import { DSAHeading, DSAQuestion, DSASheetData, DSASubheading } from '../types/dsa';

const toDate = (value: unknown): Date => {
  if (value && typeof value === 'object' && 'toDate' in value && typeof (value as { toDate: () => Date }).toDate === 'function') {
    return (value as { toDate: () => Date }).toDate();
  }
  if (value instanceof Date) return value;
  return new Date((value as string) || Date.now());
};

const byCreatedAt = <T extends { createdAt: Date }>(a: T, b: T) =>
  a.createdAt.getTime() - b.createdAt.getTime();

const parseRestFields = (fields: Record<string, any> = {}) => {
  const data: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(fields)) {
    if (value.stringValue !== undefined) data[key] = value.stringValue;
    else if (value.integerValue !== undefined) data[key] = Number(value.integerValue);
    else if (value.doubleValue !== undefined) data[key] = value.doubleValue;
    else if (value.timestampValue) data[key] = new Date(value.timestampValue);
    else if (value.booleanValue !== undefined) data[key] = value.booleanValue;
  }
  return data;
};

const restDocId = (name: string) => name.split('/').pop() || name;

const listRestDocuments = async (docPath: string, token?: string) => {
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${docPath}?key=${apiKey}`;
  const response = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!response.ok) {
    throw new Error(`Firestore REST ${response.status}`);
  }
  const payload = await response.json();
  return (payload.documents || []) as Array<{ name: string; fields?: Record<string, any> }>;
};

export const loadDSASheetFromFirestore = async (): Promise<DSASheetData> => {
  const headingsSnap = await getDocs(collection(db, 'dsa-headings'));

  const headings = await Promise.all(headingsSnap.docs.map(async (headingDoc) => {
    const headingData = headingDoc.data();
    const subSnap = await getDocs(collection(db, 'dsa-headings', headingDoc.id, 'dsa-subheadings'));

    const subheadings = await Promise.all(subSnap.docs.map(async (subDoc) => {
      const subData = subDoc.data();
      const questionsSnap = await getDocs(
        collection(db, 'dsa-headings', headingDoc.id, 'dsa-subheadings', subDoc.id, 'dsa-questions')
      );

      return {
        id: subDoc.id,
        name: subData.name,
        createdAt: toDate(subData.createdAt),
        updatedAt: toDate(subData.updatedAt),
        questions: questionsSnap.docs.map((questionDoc) => {
          const questionData = questionDoc.data();
          return {
            id: questionDoc.id,
            name: questionData.name,
            article: questionData.article,
            difficulty: questionData.difficulty,
            youtubeLink: questionData.youtubeLink,
            questionLink: questionData.questionLink,
            createdAt: toDate(questionData.createdAt),
            updatedAt: toDate(questionData.updatedAt),
          } as DSAQuestion;
        }).sort(byCreatedAt),
      } as DSASubheading;
    }));

    return {
      id: headingDoc.id,
      name: headingData.name,
      createdAt: toDate(headingData.createdAt),
      updatedAt: toDate(headingData.updatedAt),
      subheadings: subheadings.sort(byCreatedAt),
    } as DSAHeading;
  }));

  const lastUpdated = headings.length > 0
    ? headings.reduce((latest, heading) => (heading.updatedAt > latest ? heading.updatedAt : latest), new Date(0))
    : new Date();

  return { headings: headings.sort(byCreatedAt), lastUpdated };
};

const loadDSASheetFromRest = async (): Promise<DSASheetData> => {
  const token = await auth.currentUser?.getIdToken();
  const headingDocs = await listRestDocuments('dsa-headings', token);

  const headings = await Promise.all(headingDocs.map(async (headingDoc) => {
    const headingId = restDocId(headingDoc.name);
    const headingData = parseRestFields(headingDoc.fields);
    const subDocs = await listRestDocuments(`dsa-headings/${headingId}/dsa-subheadings`, token);

    const subheadings = await Promise.all(subDocs.map(async (subDoc) => {
      const subId = restDocId(subDoc.name);
      const subData = parseRestFields(subDoc.fields);
      const questionDocs = await listRestDocuments(
        `dsa-headings/${headingId}/dsa-subheadings/${subId}/dsa-questions`,
        token
      );

      return {
        id: subId,
        name: subData.name,
        createdAt: toDate(subData.createdAt),
        updatedAt: toDate(subData.updatedAt),
        questions: questionDocs.map((questionDoc) => {
          const questionData = parseRestFields(questionDoc.fields);
          return {
            id: restDocId(questionDoc.name),
            name: questionData.name,
            article: questionData.article,
            difficulty: questionData.difficulty,
            youtubeLink: questionData.youtubeLink,
            questionLink: questionData.questionLink,
            createdAt: toDate(questionData.createdAt),
            updatedAt: toDate(questionData.updatedAt),
          } as DSAQuestion;
        }).sort(byCreatedAt),
      } as DSASubheading;
    }));

    return {
      id: headingId,
      name: headingData.name,
      createdAt: toDate(headingData.createdAt),
      updatedAt: toDate(headingData.updatedAt),
      subheadings: subheadings.sort(byCreatedAt),
    } as DSAHeading;
  }));

  const lastUpdated = headings.length > 0
    ? headings.reduce((latest, heading) => (heading.updatedAt > latest ? heading.updatedAt : latest), new Date(0))
    : new Date();

  return { headings: headings.sort(byCreatedAt), lastUpdated };
};

export const fetchDSASheet = async (): Promise<DSASheetData> => {
  const errors: string[] = [];

  try {
    const response = await axios.get('/api/dsa/sheet', { timeout: 20000 });
    if (response.data.success && Array.isArray(response.data.data?.headings)) {
      return response.data.data;
    }
    errors.push(response.data.message || 'API returned no headings');
  } catch (error: any) {
    errors.push(error.response?.data?.message || error.message || 'API request failed');
  }

  try {
    return await loadDSASheetFromFirestore();
  } catch (error: any) {
    errors.push(error.message || 'Client Firestore read failed');
  }

  try {
    return await loadDSASheetFromRest();
  } catch (error: any) {
    errors.push(error.message || 'Firestore REST read failed');
  }

  throw new Error(errors.filter(Boolean).join(' | '));
};
