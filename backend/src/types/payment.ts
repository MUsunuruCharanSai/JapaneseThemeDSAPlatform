export interface UPISettings {
  upiId: string;
  subscriptionAmount: number;
  qrCode: string;
  updatedAt: Date;
}

export interface PaymentRequest {
  id?: string;
  userId: string;
  userName: string;
  userEmail: string;
  utrNumber: string;
  amount: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePaymentRequest {
  utrNumber: string;
  fullName: string;
  email: string;
}

export interface UpdatePaymentStatusRequest {
  status: 'Approved' | 'Rejected';
}

