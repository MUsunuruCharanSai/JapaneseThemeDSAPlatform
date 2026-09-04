import { Request, Response } from 'express';
import {
  getUPISettings,
  setUPISettings,
  generateUPIQRCode,
  createPaymentRequest,
  getAllPaymentRequests,
  getPaymentRequestsByUser,
  updatePaymentRequestStatus,
} from '../utils/paymentStorage';
import { CreatePaymentRequest, UpdatePaymentStatusRequest } from '../types/payment';

// Get UPI Settings
export const getUPISettingsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const settings = await getUPISettings();
    
    // If settings exist but QR code is missing, generate it
    if (settings && settings.upiId && settings.subscriptionAmount > 0 && !settings.qrCode) {
      settings.qrCode = generateUPIQRCode(settings.upiId, settings.subscriptionAmount);
    }
    
    res.status(200).json({
      success: true,
      settings: settings || {
        upiId: '',
        subscriptionAmount: 0,
        qrCode: '',
        updatedAt: new Date(),
      },
      message: 'UPI settings retrieved successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve UPI settings'
    });
  }
};

// Update UPI Settings
export const updateUPISettingsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { upiId, subscriptionAmount } = req.body;

    if (!upiId || typeof subscriptionAmount !== 'number' || subscriptionAmount <= 0) {
      res.status(400).json({
        success: false,
        message: 'Valid UPI ID and subscription amount are required'
      });
      return;
    }

    // Generate QR code string
    const qrCodeString = generateUPIQRCode(upiId, subscriptionAmount);
    
    await setUPISettings(upiId, subscriptionAmount, qrCodeString);

    res.status(200).json({
      success: true,
      message: 'UPI settings updated successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update UPI settings'
    });
  }
};

// Create Payment Request
export const createPaymentRequestController = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.uid;
    const { utrNumber, fullName, email }: CreatePaymentRequest = req.body;

    if (!utrNumber || !fullName || !email) {
      res.status(400).json({
        success: false,
        message: 'UTR Number, Full Name, and Email are required'
      });
      return;
    }

    // Get UPI settings to get the amount
    const upiSettings = await getUPISettings();
    if (!upiSettings) {
      res.status(400).json({
        success: false,
        message: 'UPI settings not configured. Please contact administrator.'
      });
      return;
    }

    const paymentRequest = await createPaymentRequest({
      userId,
      userName: fullName,
      userEmail: email,
      utrNumber: utrNumber.trim(),
      amount: upiSettings.subscriptionAmount,
    });

    res.status(201).json({
      success: true,
      paymentRequest,
      message: 'Payment request submitted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to create payment request'
    });
  }
};

// Get All Payment Requests (Admin)
export const getAllPaymentRequestsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const paymentRequests = await getAllPaymentRequests();

    res.status(200).json({
      success: true,
      paymentRequests,
      message: 'Payment requests retrieved successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve payment requests'
    });
  }
};

// Get User Payment Requests
export const getUserPaymentRequestsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.uid;
    const paymentRequests = await getPaymentRequestsByUser(userId);

    res.status(200).json({
      success: true,
      paymentRequests,
      message: 'Payment requests retrieved successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve payment requests'
    });
  }
};

// Update Payment Request Status
export const updatePaymentRequestStatusController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { paymentId } = req.params;
    const { status }: UpdatePaymentStatusRequest = req.body;

    if (!status || (status !== 'Approved' && status !== 'Rejected')) {
      res.status(400).json({
        success: false,
        message: 'Valid status (Approved or Rejected) is required'
      });
      return;
    }

    // Get payment request to get userId
    const allRequests = await getAllPaymentRequests();
    const paymentRequest = allRequests.find(p => p.id === paymentId);

    if (!paymentRequest) {
      res.status(404).json({
        success: false,
        message: 'Payment request not found'
      });
      return;
    }

    await updatePaymentRequestStatus(paymentId, status, paymentRequest.userId);

    res.status(200).json({
      success: true,
      message: `Payment request ${status.toLowerCase()} successfully`
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update payment request status'
    });
  }
};

