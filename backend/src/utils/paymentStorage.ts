import { firestore } from '../config/firebase';
import { UPISettings, PaymentRequest } from '../types/payment';

// Firestore collection names
const UPI_SETTINGS_COLLECTION = 'upi-settings';
const PAYMENT_REQUESTS_COLLECTION = 'payment-requests';

// UPI Settings (single document)
const UPI_SETTINGS_DOC_ID = 'main';

// Get UPI Settings
export const getUPISettings = async (): Promise<UPISettings | null> => {
  try {
    const docRef = firestore.collection(UPI_SETTINGS_COLLECTION).doc(UPI_SETTINGS_DOC_ID);
    const doc = await docRef.get();
    
    if (doc.exists) {
      const data = doc.data();
      return {
        upiId: data?.upiId || '',
        subscriptionAmount: data?.subscriptionAmount || 0,
        qrCode: data?.qrCode || '',
        updatedAt: data?.updatedAt?.toDate() || new Date(),
      };
    }
    
    return null;
  } catch (error) {
    return null;
  }
};

// Set UPI Settings
export const setUPISettings = async (upiId: string, subscriptionAmount: number, qrCode: string): Promise<void> => {
  try {
    const docRef = firestore.collection(UPI_SETTINGS_COLLECTION).doc(UPI_SETTINGS_DOC_ID);
    await docRef.set({
      upiId,
      subscriptionAmount,
      qrCode,
      updatedAt: new Date(),
    }, { merge: true });
  } catch (error) {
    throw new Error('Failed to update UPI settings');
  }
};

// Generate QR Code data URL from UPI payment string
export const generateUPIQRCode = (upiId: string, amount: number): string => {
  // UPI payment format: upi://pay?pa=<UPI_ID>&am=<AMOUNT>&cu=INR
  const upiString = `upi://pay?pa=${encodeURIComponent(upiId)}&am=${amount}&cu=INR`;
  
  // For now, we'll return the UPI string. Frontend will generate the actual QR code image
  // Using a QR code library like qrcode.js
  return upiString;
};

// Create Payment Request
export const createPaymentRequest = async (paymentRequest: Omit<PaymentRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<PaymentRequest> => {
  try {
    const docRef = firestore.collection(PAYMENT_REQUESTS_COLLECTION);
    const now = new Date();
    
    const newRequest: Omit<PaymentRequest, 'id'> = {
      ...paymentRequest,
      status: 'Pending',
      createdAt: now,
      updatedAt: now,
    };
    
    const doc = await docRef.add(newRequest);
    
    return {
      id: doc.id,
      ...newRequest,
    };
  } catch (error) {
    throw new Error('Failed to create payment request');
  }
};

// Get All Payment Requests
export const getAllPaymentRequests = async (): Promise<PaymentRequest[]> => {
  try {
    const snapshot = await firestore
      .collection(PAYMENT_REQUESTS_COLLECTION)
      .orderBy('createdAt', 'desc')
      .get();
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        userName: data.userName,
        userEmail: data.userEmail,
        utrNumber: data.utrNumber,
        amount: data.amount,
        status: data.status,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      };
    });
  } catch (error) {
    return [];
  }
};

// Get Payment Requests by User
export const getPaymentRequestsByUser = async (userId: string): Promise<PaymentRequest[]> => {
  try {
    const snapshot = await firestore
      .collection(PAYMENT_REQUESTS_COLLECTION)
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        userName: data.userName,
        userEmail: data.userEmail,
        utrNumber: data.utrNumber,
        amount: data.amount,
        status: data.status,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      };
    });
  } catch (error) {
    return [];
  }
};

// Update Payment Request Status
export const updatePaymentRequestStatus = async (
  paymentId: string,
  status: 'Approved' | 'Rejected',
  userId: string
): Promise<void> => {
  try {
    const docRef = firestore.collection(PAYMENT_REQUESTS_COLLECTION).doc(paymentId);
    await docRef.update({
      status,
      updatedAt: new Date(),
    });
    
    // If approved, grant premium access
    if (status === 'Approved') {
      const { setUserPremiumAccess } = await import('./userAccess.js');
      await setUserPremiumAccess(userId, true);
    } else if (status === 'Rejected') {
      // Optionally revoke access on rejection
      const { setUserPremiumAccess } = await import('./userAccess.js');
      await setUserPremiumAccess(userId, false);
    }
  } catch (error) {
    throw new Error('Failed to update payment request status');
  }
};

