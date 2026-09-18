import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { auth } from '../utils/firebase';
import LoadingSpinner from '../components/LoadingSpinner';

interface PaymentRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  utrNumber: string;
  amount: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: Date;
  updatedAt: Date;
}

const ManagePayments: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [updatingPayments, setUpdatingPayments] = useState<Set<string>>(new Set());
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    loadPaymentRequests();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadPaymentRequests = async () => {
    try {
      setLoading(true);
      const idToken = await auth.currentUser?.getIdToken();
      const response = await axios.get('/api/payment/payment-requests', {
        headers: { 'Authorization': `Bearer ${idToken}` }
      });

      if (response.data.success) {
        setPaymentRequests(response.data.paymentRequests);
      } else {
        setError('Failed to load payment requests');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load payment requests');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (paymentId: string, _userId: string, status: 'Approved' | 'Rejected') => {
    try {
      setUpdatingPayments(prev => new Set(prev).add(paymentId));
      const idToken = await auth.currentUser?.getIdToken();
      const response = await axios.put(
        `/api/payment/payment-requests/${paymentId}/status`,
        { status },
        { headers: { 'Authorization': `Bearer ${idToken}` } }
      );

      if (response.data.success) {
        // Update local state
        setPaymentRequests(prev =>
          prev.map(payment =>
            payment.id === paymentId
              ? { ...payment, status }
              : payment
          )
        );
        // Reload to get updated data
        await loadPaymentRequests();
      } else {
        setError(response.data.message || 'Failed to update payment status');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update payment status');
    } finally {
      setUpdatingPayments(prev => {
        const next = new Set(prev);
        next.delete(paymentId);
        return next;
      });
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return { bg: '#d1fae5', text: '#065f46', border: '#a7f3d0' };
      case 'Rejected':
        return { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' };
      default:
        return { bg: '#fef3c7', text: '#92400e', border: '#fde68a' };
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
    navigate('/admin/upi-settings');
    setSidebarOpen(false);
  };

  const handleManagePaymentsClick = () => {
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
          Loading payments...
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
              background: 'transparent'
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
              background: '#e0e7ff'
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
          maxWidth: '1400px',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          padding: isMobile ? '24px' : '40px',
          margin: 'auto'
        }}>
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '8px'
            }}>
              💰 Manage Payments
            </h1>
            <p style={{
              color: '#6b7280',
              fontSize: '16px'
            }}>
              Review and manage premium payment requests from users
            </p>
          </div>

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

          {paymentRequests.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#6b7280'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>💳</div>
              <h3 style={{ margin: '0 0 10px 0', color: '#374151' }}>No Payment Requests</h3>
              <p>No payment requests have been submitted yet.</p>
            </div>
          ) : (
            <div style={{
              overflowX: 'auto',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              marginTop: '24px'
            }}>
              <table style={{
                width: '100%',
                minWidth: '800px',
                borderCollapse: 'collapse',
                fontSize: '14px'
              }}>
                <thead>
                  <tr style={{
                    background: '#f9fafb',
                    borderBottom: '2px solid #e5e7eb'
                  }}>
                    <th style={{
                      padding: '16px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                      borderRight: '1px solid #e5e7eb'
                    }}>User Name</th>
                    <th style={{
                      padding: '16px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                      borderRight: '1px solid #e5e7eb'
                    }}>Email</th>
                    <th style={{
                      padding: '16px',
                      textAlign: 'center',
                      fontWeight: '600',
                      color: '#374151',
                      borderRight: '1px solid #e5e7eb'
                    }}>Amount (₹)</th>
                    <th style={{
                      padding: '16px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                      borderRight: '1px solid #e5e7eb'
                    }}>UTR Number</th>
                    <th style={{
                      padding: '16px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                      borderRight: '1px solid #e5e7eb'
                    }}>Date & Time</th>
                    <th style={{
                      padding: '16px',
                      textAlign: 'center',
                      fontWeight: '600',
                      color: '#374151',
                      borderRight: '1px solid #e5e7eb'
                    }}>Status</th>
                    <th style={{
                      padding: '16px',
                      textAlign: 'center',
                      fontWeight: '600',
                      color: '#374151'
                    }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentRequests.map((payment, index) => {
                    const statusColors = getStatusColor(payment.status);
                    const isUpdating = updatingPayments.has(payment.id);
                    return (
                      <tr key={payment.id} style={{
                        borderBottom: index < paymentRequests.length - 1 ? '1px solid #e5e7eb' : 'none',
                        background: index % 2 === 0 ? 'white' : '#f9fafb',
                        transition: 'background 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = '#f3f4f6';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = index % 2 === 0 ? 'white' : '#f9fafb';
                      }}>
                        <td style={{
                          padding: '16px',
                          borderRight: '1px solid #e5e7eb',
                          fontWeight: '500'
                        }}>
                          {payment.userName}
                        </td>
                        <td style={{
                          padding: '16px',
                          borderRight: '1px solid #e5e7eb',
                          fontFamily: 'monospace',
                          fontSize: '13px'
                        }}>
                          {payment.userEmail}
                        </td>
                        <td style={{
                          padding: '16px',
                          textAlign: 'center',
                          borderRight: '1px solid #e5e7eb',
                          fontWeight: '600',
                          color: '#059669'
                        }}>
                          ₹{payment.amount}
                        </td>
                        <td style={{
                          padding: '16px',
                          borderRight: '1px solid #e5e7eb',
                          fontFamily: 'monospace',
                          fontSize: '13px'
                        }}>
                          {payment.utrNumber}
                        </td>
                        <td style={{
                          padding: '16px',
                          borderRight: '1px solid #e5e7eb',
                          fontSize: '13px',
                          color: '#6b7280'
                        }}>
                          {formatDate(payment.createdAt)}
                        </td>
                        <td style={{
                          padding: '16px',
                          textAlign: 'center',
                          borderRight: '1px solid #e5e7eb'
                        }}>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '600',
                            background: statusColors.bg,
                            color: statusColors.text,
                            border: `1px solid ${statusColors.border}`
                          }}>
                            {payment.status}
                          </span>
                        </td>
                        <td style={{
                          padding: '16px',
                          textAlign: 'center'
                        }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            {payment.status !== 'Approved' && (
                              <button
                                onClick={() => handleUpdateStatus(payment.id, payment.userId, 'Approved')}
                                disabled={isUpdating}
                                style={{
                                  padding: '6px 16px',
                                  borderRadius: '6px',
                                  border: 'none',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  cursor: isUpdating ? 'not-allowed' : 'pointer',
                                  background: isUpdating ? '#9ca3af' : '#10b981',
                                  color: 'white',
                                  transition: 'all 0.2s ease',
                                  opacity: isUpdating ? 0.6 : 1
                                }}
                                onMouseOver={(e) => {
                                  if (!isUpdating) {
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                  }
                                }}
                                onMouseOut={(e) => {
                                  e.currentTarget.style.transform = 'scale(1)';
                                }}
                              >
                                {isUpdating ? '...' : 'Allow Access'}
                              </button>
                            )}
                            {payment.status !== 'Rejected' && (
                              <button
                                onClick={() => handleUpdateStatus(payment.id, payment.userId, 'Rejected')}
                                disabled={isUpdating}
                                style={{
                                  padding: '6px 16px',
                                  borderRadius: '6px',
                                  border: 'none',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  cursor: isUpdating ? 'not-allowed' : 'pointer',
                                  background: isUpdating ? '#9ca3af' : '#ef4444',
                                  color: 'white',
                                  transition: 'all 0.2s ease',
                                  opacity: isUpdating ? 0.6 : 1
                                }}
                                onMouseOver={(e) => {
                                  if (!isUpdating) {
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                  }
                                }}
                                onMouseOut={(e) => {
                                  e.currentTarget.style.transform = 'scale(1)';
                                }}
                              >
                                {isUpdating ? '...' : 'Stop Access'}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
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

export default ManagePayments;

