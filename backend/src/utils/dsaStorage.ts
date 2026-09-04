import { firestore } from '../config/firebase';
import { DSASheetData, DSAHeading, DSASubheading, DSAQuestion, UserProgress } from '../types/dsa';

// Firestore collection names
const HEADINGS_COLLECTION = 'dsa-headings';
const SUBHEADINGS_COLLECTION = 'dsa-subheadings';
const QUESTIONS_COLLECTION = 'dsa-questions';

// Load DSA sheet data from Firestore
export const loadDSASheetData = async (): Promise<DSASheetData> => {
  try {
    const headingsRef = firestore.collection(HEADINGS_COLLECTION);
    const headingsSnapshot = await headingsRef.orderBy('createdAt', 'asc').get();

    const headings: DSAHeading[] = [];

    for (const headingDoc of headingsSnapshot.docs) {
      const headingData = headingDoc.data();
      const heading: DSAHeading = {
        id: headingDoc.id,
        name: headingData.name,
        createdAt: headingData.createdAt.toDate(),
        updatedAt: headingData.updatedAt.toDate(),
        subheadings: []
      };

      // Load subheadings for this heading
      const subheadingsRef = headingsRef.doc(headingDoc.id).collection(SUBHEADINGS_COLLECTION);
      const subheadingsSnapshot = await subheadingsRef.orderBy('createdAt', 'asc').get();

      for (const subheadingDoc of subheadingsSnapshot.docs) {
        const subheadingData = subheadingDoc.data();
        const subheading: DSASubheading = {
          id: subheadingDoc.id,
          name: subheadingData.name,
          createdAt: subheadingData.createdAt.toDate(),
          updatedAt: subheadingData.updatedAt.toDate(),
          questions: []
        };

        // Load questions for this subheading
        const questionsRef = subheadingsRef.doc(subheadingDoc.id).collection(QUESTIONS_COLLECTION);
        const questionsSnapshot = await questionsRef.orderBy('createdAt', 'asc').get();

        subheading.questions = questionsSnapshot.docs.map(questionDoc => {
          const questionData = questionDoc.data();
          return {
            id: questionDoc.id,
            name: questionData.name,
            article: questionData.article,
            difficulty: questionData.difficulty,
            youtubeLink: questionData.youtubeLink,
            questionLink: questionData.questionLink,
            createdAt: questionData.createdAt.toDate(),
            updatedAt: questionData.updatedAt.toDate(),
          } as DSAQuestion;
        });

        heading.subheadings.push(subheading);
      }

      headings.push(heading);
    }

    // Get the most recent update timestamp
    const lastUpdated = headings.length > 0
      ? headings.reduce((latest, heading) =>
          heading.updatedAt > latest ? heading.updatedAt : latest,
          new Date(0)
        )
      : new Date();

    return { headings, lastUpdated };
  } catch (error) {
    throw new Error('Failed to load DSA sheet data from Firestore');
  }
};

// Save DSA sheet data (this method is now mainly for compatibility - individual operations handle persistence)
export const saveDSASheetData = async (_data: DSASheetData): Promise<void> => {
  // This method is kept for backward compatibility but is no longer used
  // All CRUD operations now happen individually through Firestore
};

// User progress collection
const USER_PROGRESS_COLLECTION = 'user-progress';

// Get user progress
export const getUserProgressFromDB = async (userId: string): Promise<UserProgress[]> => {
  try {
    const progressRef = firestore.collection(USER_PROGRESS_COLLECTION);
    const snapshot = await progressRef.where('userId', '==', userId).get();

    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        userId: data.userId,
        questionId: data.questionId,
        completed: data.completed,
        completedAt: data.completedAt?.toDate(),
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      };
    });
  } catch (error) {
    return [];
  }
};

// Update user progress
export const updateUserProgressInDB = async (userId: string, questionId: string, completed: boolean): Promise<void> => {
  try {
    const progressRef = firestore.collection(USER_PROGRESS_COLLECTION);
    const existingProgress = await progressRef
      .where('userId', '==', userId)
      .where('questionId', '==', questionId)
      .limit(1)
      .get();

    const now = new Date();

    if (!existingProgress.empty) {
      // Update existing progress
      const docRef = existingProgress.docs[0].ref;
      await docRef.update({
        completed,
        completedAt: completed ? now : null,
        updatedAt: now,
      });
    } else {
      // Create new progress record
      await progressRef.add({
        userId,
        questionId,
        completed,
        completedAt: completed ? now : null,
        createdAt: now,
        updatedAt: now,
      });
    }
  } catch (error) {
    throw new Error('Failed to update user progress in Firestore');
  }
};

// Generate unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Heading operations
export const createHeading = async (heading: Omit<DSAHeading, 'id'>): Promise<DSAHeading> => {
  try {
    const headingsRef = firestore.collection(HEADINGS_COLLECTION);
    const docRef = await headingsRef.add({
      name: heading.name,
      createdAt: heading.createdAt,
      updatedAt: heading.updatedAt,
    });

    return {
      ...heading,
      id: docRef.id,
    };
  } catch (error) {
    throw new Error('Failed to create heading in Firestore');
  }
};

export const updateHeading = async (headingId: string, updates: Partial<Pick<DSAHeading, 'name'>>): Promise<void> => {
  try {
    const headingRef = firestore.collection(HEADINGS_COLLECTION).doc(headingId);
    await headingRef.update({
      ...updates,
      updatedAt: new Date(),
    });
  } catch (error) {
    throw new Error('Failed to update heading in Firestore');
  }
};

export const deleteHeading = async (headingId: string): Promise<void> => {
  try {
    const batch = firestore.batch();

    // Delete heading document
    const headingRef = firestore.collection(HEADINGS_COLLECTION).doc(headingId);
    batch.delete(headingRef);

    // Get all subheadings and their questions for deletion
    const subheadingsRef = headingRef.collection(SUBHEADINGS_COLLECTION);
    const subheadingsSnapshot = await subheadingsRef.get();

    for (const subheadingDoc of subheadingsSnapshot.docs) {
      // Delete all questions in this subheading
      const questionsRef = subheadingDoc.ref.collection(QUESTIONS_COLLECTION);
      const questionsSnapshot = await questionsRef.get();
      questionsSnapshot.docs.forEach(questionDoc => {
        batch.delete(questionDoc.ref);
      });

      // Delete subheading
      batch.delete(subheadingDoc.ref);
    }

    await batch.commit();
  } catch (error) {
    throw new Error('Failed to delete heading in Firestore');
  }
};

// Subheading operations
export const createSubheading = async (headingId: string, subheading: Omit<DSASubheading, 'id'>): Promise<DSASubheading> => {
  try {
    const subheadingsRef = firestore.collection(HEADINGS_COLLECTION).doc(headingId).collection(SUBHEADINGS_COLLECTION);
    const docRef = await subheadingsRef.add({
      name: subheading.name,
      createdAt: subheading.createdAt,
      updatedAt: subheading.updatedAt,
    });

    // Update heading's updatedAt timestamp
    await firestore.collection(HEADINGS_COLLECTION).doc(headingId).update({
      updatedAt: new Date(),
    });

    return {
      ...subheading,
      id: docRef.id,
    };
  } catch (error) {
    throw new Error('Failed to create subheading in Firestore');
  }
};

export const updateSubheading = async (headingId: string, subheadingId: string, updates: Partial<Pick<DSASubheading, 'name'>>): Promise<void> => {
  try {
    const subheadingRef = firestore.collection(HEADINGS_COLLECTION).doc(headingId).collection(SUBHEADINGS_COLLECTION).doc(subheadingId);
    await subheadingRef.update({
      ...updates,
      updatedAt: new Date(),
    });

    // Update heading's updatedAt timestamp
    await firestore.collection(HEADINGS_COLLECTION).doc(headingId).update({
      updatedAt: new Date(),
    });
  } catch (error) {
    throw new Error('Failed to update subheading in Firestore');
  }
};

export const deleteSubheading = async (headingId: string, subheadingId: string): Promise<void> => {
  try {
    const batch = firestore.batch();

    // Delete subheading document
    const subheadingRef = firestore.collection(HEADINGS_COLLECTION).doc(headingId).collection(SUBHEADINGS_COLLECTION).doc(subheadingId);

    // Delete all questions in this subheading
    const questionsRef = subheadingRef.collection(QUESTIONS_COLLECTION);
    const questionsSnapshot = await questionsRef.get();
    questionsSnapshot.docs.forEach(questionDoc => {
      batch.delete(questionDoc.ref);
    });

    // Delete subheading
    batch.delete(subheadingRef);

    // Update heading's updatedAt timestamp
    const headingRef = firestore.collection(HEADINGS_COLLECTION).doc(headingId);
    batch.update(headingRef, { updatedAt: new Date() });

    await batch.commit();
  } catch (error) {
    throw new Error('Failed to delete subheading in Firestore');
  }
};

// Question operations
export const createQuestion = async (headingId: string, subheadingId: string, question: Omit<DSAQuestion, 'id'>): Promise<DSAQuestion> => {
  try {
    const questionsRef = firestore.collection(HEADINGS_COLLECTION).doc(headingId).collection(SUBHEADINGS_COLLECTION).doc(subheadingId).collection(QUESTIONS_COLLECTION);
    
    // Build data object, only including non-empty links
    const questionData: any = {
      name: question.name,
      article: question.article,
      difficulty: question.difficulty,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    };
    
    // Only add youtubeLink if it has a value
    if (question.youtubeLink) {
      questionData.youtubeLink = question.youtubeLink;
    }
    
    // Only add questionLink if it has a value
    if (question.questionLink) {
      questionData.questionLink = question.questionLink;
    }
    
    const docRef = await questionsRef.add(questionData);

    // Update subheading's updatedAt timestamp
    await firestore.collection(HEADINGS_COLLECTION).doc(headingId).collection(SUBHEADINGS_COLLECTION).doc(subheadingId).update({
      updatedAt: new Date(),
    });

    // Update heading's updatedAt timestamp
    await firestore.collection(HEADINGS_COLLECTION).doc(headingId).update({
      updatedAt: new Date(),
    });

    return {
      ...question,
      id: docRef.id,
    };
  } catch (error) {
    throw new Error('Failed to create question in Firestore');
  }
};

export const updateQuestion = async (headingId: string, subheadingId: string, questionId: string, updates: Partial<Pick<DSAQuestion, 'name' | 'article' | 'difficulty' | 'youtubeLink' | 'questionLink'>>): Promise<void> => {
  try {
    const questionRef = firestore.collection(HEADINGS_COLLECTION).doc(headingId).collection(SUBHEADINGS_COLLECTION).doc(subheadingId).collection(QUESTIONS_COLLECTION).doc(questionId);
    
    // Build update object, excluding empty string values
    const updateData: any = {
      updatedAt: new Date(),
    };
    
    // Only include fields that have actual values
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.article !== undefined) updateData.article = updates.article;
    if (updates.difficulty !== undefined) updateData.difficulty = updates.difficulty;
    if (updates.youtubeLink !== undefined && updates.youtubeLink) updateData.youtubeLink = updates.youtubeLink;
    if (updates.questionLink !== undefined && updates.questionLink) updateData.questionLink = updates.questionLink;
    
    await questionRef.update(updateData);

    // Update subheading's updatedAt timestamp
    await firestore.collection(HEADINGS_COLLECTION).doc(headingId).collection(SUBHEADINGS_COLLECTION).doc(subheadingId).update({
      updatedAt: new Date(),
    });

    // Update heading's updatedAt timestamp
    await firestore.collection(HEADINGS_COLLECTION).doc(headingId).update({
      updatedAt: new Date(),
    });
  } catch (error) {
    throw new Error('Failed to update question in Firestore');
  }
};

export const deleteQuestion = async (headingId: string, subheadingId: string, questionId: string): Promise<void> => {
  try {
    const questionRef = firestore.collection(HEADINGS_COLLECTION).doc(headingId).collection(SUBHEADINGS_COLLECTION).doc(subheadingId).collection(QUESTIONS_COLLECTION).doc(questionId);
    await questionRef.delete();

    // Update subheading's updatedAt timestamp
    await firestore.collection(HEADINGS_COLLECTION).doc(headingId).collection(SUBHEADINGS_COLLECTION).doc(subheadingId).update({
      updatedAt: new Date(),
    });

    // Update heading's updatedAt timestamp
    await firestore.collection(HEADINGS_COLLECTION).doc(headingId).update({
      updatedAt: new Date(),
    });
  } catch (error) {
    throw new Error('Failed to delete question in Firestore');
  }
};
