import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { auth } from '../utils/firebase';
import LoadingSpinner from '../components/LoadingSpinner';

const UPISettings: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [upiId, setUpiId] = useState('');
  const [subscriptionAmount, setSubscriptionAmount] = useState('');
  const [qrCodeImage, setQrCodeImage] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    loadUPISettings();
  }, []);

  const loadUPISettings = async () => {
    try {
      setLoading(true);
      const idToken = await auth.currentUser?.getIdToken();
      const response = await axios.get('/api/payment/upi-settings', {
        headers: { 'Authorization': `Bearer ${idToken}` }
      });

      if (response.data.success) {
        const settings = response.data.settings;
        setUpiId(settings.upiId || '');
        setSubscriptionAmount(settings.subscriptionAmount?.toString() || '');
        if (settings.qrCode) {
          // Generate QR code image from data using external API
          const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(settings.qrCode)}`;
          setQrCodeImage(qrUrl);
        }
      }
    } catch (err: any) {
      setError('Failed to load UPI settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!upiId.trim()) {
      setError('UPI ID is required');
      return;
    }

    const amount = parseFloat(subscriptionAmount);
    if (isNaN(amount) || amount <= 0) {
      setError('Valid subscription amount is required');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const idToken = await auth.currentUser?.getIdToken();
      const response = await axios.put(
        '/api/payment/upi-settings',
        { upiId: upiId.trim(), subscriptionAmount: amount },
        { headers: { 'Authorization': `Bearer ${idToken}` } }
      );

      if (response.data.success) {
        setSuccess('UPI settings saved successfully!');
        // Generate QR code data
        const qrData = `upi://pay?pa=${encodeURIComponent(upiId.trim())}&am=${amount}&cu=INR`;
        // Generate QR code image using external API
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(qrData)}`;
        setQrCodeImage(qrUrl);
        // Reload to get updated settings
        await loadUPISettings();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save UPI settings');
    } finally {
      setSaving(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleBackToDashboard = () => {
    navigate('/admin');
  };

  const handleUsersClick = () => {
    navigate('/admin/users');
    setSidebarOpen(false);
  };

  const handleUPISettingsClick = () => {
    setSidebarOpen(false);
  };

  const handleManagePaymentsClick = () => {
    navigate('/admin/manage-payments');
    setSidebarOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {}
  };

  if (loading) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}>
        <LoadingSpinner />
        <p style={{
          marginTop: '20px',
          color: 'white',
          fontSize: '18px',
          fontWeight: '500',
          letterSpacing: '0.5px'
        }}>
          Loading UPI settings...
        </p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="sidebar-toggle"
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          zIndex: '1001',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          padding: '12px',
          cursor: 'pointer',
          fontSize: '18px',
          boxShadow: '0 4px 14px rgba(102, 126, 234, 0.35)',
          transition: 'all 0.3s ease'
        }}
      >
        ☰
      </button>

      {/* Sidebar */}
      <div
        className={`sidebar ${sidebarOpen ? 'open' : ''}`}
        style={{
          position: 'fixed',
          top: '0',
          left: '0',
          width: '280px',
          height: '100vh',
          background: 'white',
          boxShadow: '2px 0 20px rgba(0, 0, 0, 0.1)',
          zIndex: '1000',
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          padding: '80px 0 20px 0'
        }}
      >
        <div style={{ flex: '1', padding: '0 20px' }}>
          <div
            className="sidebar-item"
            onClick={handleBackToDashboard}
            style={{
              padding: '16px 20px',
              margin: '10px 0',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '16px',
              fontWeight: '500',
              color: '#333',
              transition: 'all 0.3s ease',
              background: 'transparent'
            }}
          >
            📋 DSA SHEET
          </div>

          <div
            className="sidebar-item"
            onClick={handleUsersClick}
            style={{
              padding: '16px 20px',
              margin: '10px 0',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '16px',
              fontWeight: '500',
              color: '#333',
              transition: 'all 0.3s ease',
              background: 'transparent'
            }}
          >
            👥 USERS
          </div>

          <div
            className="sidebar-item"
            onClick={handleUPISettingsClick}
            style={{
              padding: '16px 20px',
              margin: '10px 0',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '16px',
              fontWeight: '500',
              color: '#333',
              transition: 'all 0.3s ease',
              background: '#e0e7ff'
            }}
          >
            💳 UPI ID
          </div>

          <div
            className="sidebar-item"
            onClick={handleManagePaymentsClick}
            style={{
              padding: '16px 20px',
              margin: '10px 0',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '16px',
              fontWeight: '500',
              color: '#333',
              transition: 'all 0.3s ease',
              background: 'transparent'
            }}
          >
            💰 MANAGE PAYMENTS
          </div>
        </div>

        <div style={{ padding: '0 20px', borderTop: '1px solid #e5e7eb' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '12px',
              marginTop: '20px',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        overflowY: 'auto',
        zIndex: 1
      }}>
        <div style={{
          width: '100%',
          maxWidth: '900px',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          padding: isMobile ? '24px' : '40px',
          margin: 'auto'
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '8px'
          }}>
            💳 UPI Settings
          </h1>
          <p style={{
            color: '#6b7280',
            marginBottom: '32px',
            fontSize: '16px'
          }}>
            Configure UPI payment details for premium subscriptions
          </p>

          {error && (
            <div style={{
              padding: '12px 16px',
              background: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              color: '#991b1b',
              marginBottom: '24px'
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              padding: '12px 16px',
              background: '#d1fae5',
              border: '1px solid #a7f3d0',
              borderRadius: '8px',
              color: '#065f46',
              marginBottom: '24px'
            }}>
              {success}
            </div>
          )}

          <div style={{
            display: 'grid',
            gap: '24px',
            gridTemplateColumns: '1fr'
          }}>
            {/* UPI ID Input */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                UPI ID <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="yourname@paytm"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
              <p style={{
                fontSize: '12px',
                color: '#6b7280',
                marginTop: '4px'
              }}>
                Format: yourname@paytm, yourname@ybl, etc.
              </p>
            </div>

            {/* Subscription Amount Input */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Subscription Amount (₹) <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="number"
                value={subscriptionAmount}
                onChange={(e) => setSubscriptionAmount(e.target.value)}
                placeholder="500"
                min="1"
                step="0.01"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: '14px 24px',
                background: saving ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: saving ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                width: '100%'
              }}
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>

            {/* QR Code Display */}
            {qrCodeImage && upiId && subscriptionAmount && (
              <div style={{
                marginTop: '32px',
                padding: '32px',
                background: '#f9fafb',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                textAlign: 'center'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '20px'
                }}>
                  Payment QR Code
                </h3>
                <div style={{
                  display: 'inline-block',
                  padding: '20px',
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}>
                  <img src={qrCodeImage} alt="Payment QR Code" style={{ width: '256px', height: '256px' }} />
                </div>
                <p style={{
                  marginTop: '20px',
                  fontSize: '14px',
                  color: '#6b7280'
                }}>
                  Users can scan this QR code to make payment
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          onClick={toggleSidebar}
          style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: '999'
          }}
        />
      )}
    </div>
  );
};

export default UPISettings;

