import axios from 'axios';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from './firebase';
import { DSAHeading, DSAQuestion, DSASheetData, DSASubheading } from '../types/dsa';

const toDate = (value: unknown): Date => {
  if (value && typeof value === 'object' && 'toDate' in value && typeof (value as { toDate: () => Date }).toDate === 'function') {
    return (value as { toDate: () => Date }).toDate();
  }
  if (value instanceof Date) return value;
  return new Date((value as string) || Date.now());
};

export const loadDSASheetFromFirestore = async (): Promise<DSASheetData> => {
  const headingsSnap = await getDocs(query(collection(db, 'dsa-headings'), orderBy('createdAt', 'asc')));

  const headings = await Promise.all(headingsSnap.docs.map(async (headingDoc) => {
    const headingData = headingDoc.data();
    const subSnap = await getDocs(
      query(collection(db, 'dsa-headings', headingDoc.id, 'dsa-subheadings'), orderBy('createdAt', 'asc'))
    );

    const subheadings = await Promise.all(subSnap.docs.map(async (subDoc) => {
      const subData = subDoc.data();
      const questionsSnap = await getDocs(
        query(
          collection(db, 'dsa-headings', headingDoc.id, 'dsa-subheadings', subDoc.id, 'dsa-questions'),
          orderBy('createdAt', 'asc')
        )
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
        }),
      } as DSASubheading;
    }));

    return {
      id: headingDoc.id,
      name: headingData.name,
      createdAt: toDate(headingData.createdAt),
      updatedAt: toDate(headingData.updatedAt),
      subheadings,
    } as DSAHeading;
  }));

  const lastUpdated = headings.length > 0
    ? headings.reduce((latest, heading) => (heading.updatedAt > latest ? heading.updatedAt : latest), new Date(0))
    : new Date();

  return { headings, lastUpdated };
};

export const fetchDSASheet = async (): Promise<DSASheetData> => {
  try {
    const response = await axios.get('/api/dsa/sheet', { timeout: 15000 });
    if (response.data.success && response.data.data?.headings) {
      return response.data.data;
    }
  } catch {
    // Fall through to the client Firestore read
  }

  return loadDSASheetFromFirestore();
};
