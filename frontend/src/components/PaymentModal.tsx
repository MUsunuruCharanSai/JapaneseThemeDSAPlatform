import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../utils/firebase';

interface PaymentModalProps {
  upiSettings: { upiId: string; subscriptionAmount: number; qrCode: string } | null;
  userEmail: string;
  onClose: () => void;
  onSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ upiSettings, userEmail, onClose, onSuccess }) => {
  const [utrNumber, setUtrNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [qrCodeImage, setQrCodeImage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Generate QR code from UPI settings
    if (upiSettings) {
      setLoading(false);
      let qrCodeString = upiSettings.qrCode;
      
      // If QR code string is missing, generate it from UPI ID and amount
      if (!qrCodeString && upiSettings.upiId && upiSettings.subscriptionAmount > 0) {
        qrCodeString = `upi://pay?pa=${encodeURIComponent(upiSettings.upiId)}&am=${upiSettings.subscriptionAmount}&cu=INR`;
      }
      
      if (qrCodeString) {
        // Generate QR code image from UPI string using external API
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(qrCodeString)}`;
        setQrCodeImage(qrUrl);
      }
    } else {
      // If settings are null, wait a bit before showing unavailable (in case they're still loading)
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [upiSettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!utrNumber.trim()) {
      setError('UTR Number is required');
      return;
    }

    if (!fullName.trim()) {
      setError('Full Name is required');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const idToken = await auth.currentUser?.getIdToken();
      const response = await axios.post(
        '/api/payment/payment-requests',
        {
          utrNumber: utrNumber.trim(),
          fullName: fullName.trim(),
          email: userEmail,
        },
        { headers: { 'Authorization': `Bearer ${idToken}` } }
      );

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
        }, 3000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit payment request');
    } finally {
      setSubmitting(false);
    }
  };

  // Show loading state while settings are being fetched
  if (loading) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--gray-900)', margin: 0 }}>
              💳 Buy Premium
            </h2>
            <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: 'var(--gray-400)', cursor: 'pointer' }}>
              ×
            </button>
          </div>
          <div className="modal-body" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⏳</div>
            <p style={{ color: 'var(--gray-700)' }}>Loading payment details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Only show unavailable if settings are truly not configured (after loading)
  if (!upiSettings || !upiSettings.upiId || !upiSettings.subscriptionAmount) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--gray-900)', margin: 0 }}>
              Payment Unavailable
            </h2>
            <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: 'var(--gray-400)', cursor: 'pointer' }}>
              ×
            </button>
          </div>
          <div className="modal-body">
            <p style={{ color: 'var(--gray-700)' }}>
              UPI settings are not configured. Please contact administrator.
            </p>
            <button
              onClick={onClose}
              style={{
                width: '100%',
                padding: '12px',
                marginTop: '20px',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--gray-900)', margin: 0 }}>
              ✅ Payment Submitted
            </h2>
            <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: 'var(--gray-400)', cursor: 'pointer' }}>
              ×
            </button>
          </div>
          <div className="modal-body">
            <div style={{
              padding: '24px',
              background: '#d1fae5',
              borderRadius: '12px',
              border: '1px solid #a7f3d0',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '1rem', color: '#065f46', margin: 0, lineHeight: '1.6' }}>
                Admin will review your payment within 24 hours and will give you access to Premium.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--gray-900)', margin: 0 }}>
            💳 Buy Premium
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: 'var(--gray-400)', cursor: 'pointer' }}>
            ×
          </button>
        </div>

        <div className="modal-body">
          {/* Amount Display - Always show if settings exist */}
          {upiSettings.subscriptionAmount > 0 && (
            <div style={{
              padding: '20px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '12px',
              color: 'white',
              textAlign: 'center',
              marginBottom: '24px'
            }}>
              <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>Subscription Amount</p>
              <h3 style={{ margin: '8px 0 0 0', fontSize: '2rem', fontWeight: '700' }}>
                ₹{upiSettings.subscriptionAmount}
              </h3>
            </div>
          )}

          {/* QR Code - Always show if UPI ID exists */}
          {qrCodeImage && upiSettings.upiId && (
            <div style={{
              textAlign: 'center',
              marginBottom: '24px',
              padding: '20px',
              background: '#f9fafb',
              borderRadius: '12px'
            }}>
              <p style={{ margin: '0 0 16px 0', fontSize: '0.9rem', color: 'var(--gray-600)', fontWeight: '600' }}>
                Scan QR Code to Pay
              </p>
              <div style={{
                display: 'inline-block',
                padding: '16px',
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}>
                <img src={qrCodeImage} alt="Payment QR Code" style={{ width: '200px', height: '200px' }} />
              </div>
              <p style={{ margin: '16px 0 0 0', fontSize: '0.85rem', color: 'var(--gray-500)' }}>
                UPI ID: {upiSettings.upiId}
              </p>
            </div>
          )}

          {error && (
            <div style={{
              padding: '12px 16px',
              background: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              color: '#991b1b',
              marginBottom: '20px',
              fontSize: '0.9rem'
            }}>
              {error}
            </div>
          )}

          {/* Payment Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                UTR Number <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                placeholder="Enter UTR Number"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Full Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Email ID
              </label>
              <input
                type="email"
                value={userEmail}
                disabled
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  background: '#f3f4f6',
                  color: '#6b7280',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: '100%',
                padding: '14px 24px',
                background: submitting ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: submitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {submitting ? 'Submitting...' : 'Submit Payment Request'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;

