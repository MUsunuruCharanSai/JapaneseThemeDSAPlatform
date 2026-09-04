import { firestore } from '../config/firebase';
import * as admin from 'firebase-admin';

// Firestore collection for user premium access
const USER_ACCESS_COLLECTION = 'user-access';

// Get user premium access status
export const getUserPremiumAccess = async (userId: string): Promise<boolean> => {
  try {
    const accessRef = firestore.collection(USER_ACCESS_COLLECTION).doc(userId);
    const doc = await accessRef.get();
    
    if (doc.exists) {
      const data = doc.data();
      return data?.premiumAccess === true;
    }
    
    // Default to false (no access)
    return false;
  } catch (error) {
    return false;
  }
};

// Set user premium access status
export const setUserPremiumAccess = async (userId: string, premiumAccess: boolean): Promise<void> => {
  try {
    const accessRef = firestore.collection(USER_ACCESS_COLLECTION).doc(userId);
    await accessRef.set({
      premiumAccess,
      updatedAt: new Date(),
    }, { merge: true });
  } catch (error) {
    throw new Error('Failed to update premium access');
  }
};

// Get premium access for multiple users
export const getUsersPremiumAccess = async (userIds: string[]): Promise<Record<string, boolean>> => {
  try {
    const accessRef = firestore.collection(USER_ACCESS_COLLECTION);
    const accessMap: Record<string, boolean> = {};
    
    // Initialize all users to false
    userIds.forEach(uid => {
      accessMap[uid] = false;
    });
    
    // Firestore 'in' query limit is 10, so we need to batch if more than 10
    const batchSize = 10;
    for (let i = 0; i < userIds.length; i += batchSize) {
      const batch = userIds.slice(i, i + batchSize);
      const snapshot = await accessRef.where(admin.firestore.FieldPath.documentId(), 'in', batch).get();
      
      snapshot.forEach(doc => {
        const data = doc.data();
        accessMap[doc.id] = data?.premiumAccess === true;
      });
    }
    
    return accessMap;
  } catch (error) {
    // Return all false on error
    const accessMap: Record<string, boolean> = {};
    userIds.forEach(uid => {
      accessMap[uid] = false;
    });
    return accessMap;
  }
};

