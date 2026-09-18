import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { auth } from '../utils/firebase';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';

interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  emailVerified: boolean;
  role: string;
  premiumAccess?: boolean;
  createdAt: Date;
  lastLoginAt: Date;
}

const Users: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [updatingUsers, setUpdatingUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const idToken = await auth.currentUser?.getIdToken();
      const response = await axios.get('/api/auth/admin/users', {
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      });

      if (response.data.success) {
        setUsers(response.data.users);
      } else {
        setError(response.data.message || 'Failed to fetch users');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleBackToDashboard = () => {
    navigate('/admin');
  };

  const handleDSASheetClick = () => {
    navigate('/admin');
    setSidebarOpen(false);
  };

  const handleUsersClick = () => {
    setSidebarOpen(false);
    // Already on users page
  };

  const handleUPISettingsClick = () => {
    navigate('/admin/upi-settings');
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

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  const handleTogglePremiumAccess = async (userId: string, currentAccess: boolean) => {
    try {
      setUpdatingUsers(prev => new Set(prev).add(userId));
      const idToken = await auth.currentUser?.getIdToken();
      const response = await axios.put(
        `/api/auth/admin/users/${userId}/premium`,
        { premiumAccess: !currentAccess },
        {
          headers: {
            'Authorization': `Bearer ${idToken}`,
          },
        }
      );

      if (response.data.success) {
        // Update local state
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user.uid === userId
              ? { ...user, premiumAccess: !currentAccess }
              : user
          )
        );
      } else {
        setError(response.data.message || 'Failed to update premium access');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update premium access');
    } finally {
      setUpdatingUsers(prev => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    }
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
          Loading users...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column'
      }}>
        <div style={{ color: 'red', marginBottom: '20px' }}>Error: {error}</div>
        <button
          onClick={fetchUsers}
          style={{
            padding: '10px 20px',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
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
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.45)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 14px rgba(102, 126, 234, 0.35)';
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
        {/* Menu Items */}
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
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#f8fafc';
              e.currentTarget.style.transform = 'translateX(5px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            ← Back to Dashboard
          </div>

          <div
            className="sidebar-item"
            onClick={handleDSASheetClick}
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
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#f8fafc';
              e.currentTarget.style.transform = 'translateX(5px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.transform = 'translateX(0)';
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
              color: '#667eea',
              transition: 'all 0.3s ease',
              background: '#f0f4ff',
              border: '1px solid #e0e7ff'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#e8f0ff';
              e.currentTarget.style.transform = 'translateX(5px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#f0f4ff';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            👥 Users
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
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#f8fafc';
              e.currentTarget.style.transform = 'translateX(5px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.transform = 'translateX(0)';
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
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#f8fafc';
              e.currentTarget.style.transform = 'translateX(5px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            💰 Manage Payments
          </div>
        </div>

        {/* Logout Button at Bottom */}
        <div style={{ padding: '0 20px' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '16px 20px',
              background: '#f3f4f6',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#e5e7eb';
              e.currentTarget.style.borderColor = '#9ca3af';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#f3f4f6';
              e.currentTarget.style.borderColor = '#d1d5db';
            }}
          >
            🚪 Logout
          </button>
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
            background: 'rgba(0, 0, 0, 0.3)',
            zIndex: '999',
            backdropFilter: 'blur(2px)'
          }}
        />
      )}

      {/* Main Content */}
      <div style={{
        width: '100vw',
        height: '100vh',
        background: '#f8fafc',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        overflow: 'auto'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '1400px',
          margin: '20px'
        }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '30px',
            borderBottom: '1px solid #e5e7eb',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}>
            <h1 style={{
              margin: '0 0 10px 0',
              fontSize: '28px',
              fontWeight: '700'
            }}>
              User Management
            </h1>
            <p style={{
              margin: '0',
              opacity: '0.9',
              fontSize: '16px'
            }}>
              Manage all registered users ({users.length} total)
            </p>
          </div>

          <div style={{ padding: '30px' }}>
            <div style={{
              overflowX: 'auto',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <table style={{
                width: '100%',
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
                    }}>Avatar</th>
                    <th style={{
                      padding: '16px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                      borderRight: '1px solid #e5e7eb'
                    }}>Name</th>
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
                    }}>Verified</th>
                    <th style={{
                      padding: '16px',
                      textAlign: 'center',
                      fontWeight: '600',
                      color: '#374151',
                      borderRight: '1px solid #e5e7eb'
                    }}>Role</th>
                    <th style={{
                      padding: '16px',
                      textAlign: 'center',
                      fontWeight: '600',
                      color: '#374151',
                      borderRight: '1px solid #e5e7eb'
                    }}>Premium Access</th>
                    <th style={{
                      padding: '16px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                      borderRight: '1px solid #e5e7eb'
                    }}>Created</th>
                    <th style={{
                      padding: '16px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151'
                    }}>Last Login</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user.uid} style={{
                      borderBottom: index < users.length - 1 ? '1px solid #e5e7eb' : 'none',
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
                        borderRight: '1px solid #e5e7eb'
                      }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: user.photoURL
                            ? `url(${user.photoURL})`
                            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '16px'
                        }}>
                          {!user.photoURL && (user.displayName ? user.displayName[0].toUpperCase() : user.email[0].toUpperCase())}
                        </div>
                      </td>
                      <td style={{
                        padding: '16px',
                        borderRight: '1px solid #e5e7eb',
                        fontWeight: '500'
                      }}>
                        {user.displayName || 'N/A'}
                      </td>
                      <td style={{
                        padding: '16px',
                        borderRight: '1px solid #e5e7eb',
                        fontFamily: 'monospace',
                        fontSize: '13px'
                      }}>
                        {user.email}
                      </td>
                      <td style={{
                        padding: '16px',
                        textAlign: 'center',
                        borderRight: '1px solid #e5e7eb'
                      }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          background: user.emailVerified ? '#d1fae5' : '#fee2e2',
                          color: user.emailVerified ? '#065f46' : '#991b1b'
                        }}>
                          {user.emailVerified ? '✓ Yes' : '✗ No'}
                        </span>
                      </td>
                      <td style={{
                        padding: '16px',
                        textAlign: 'center',
                        borderRight: '1px solid #e5e7eb'
                      }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          background: user.role === 'admin' ? '#fef3c7' : '#e0f2fe',
                          color: user.role === 'admin' ? '#92400e' : '#0369a1',
                          textTransform: 'capitalize'
                        }}>
                          {user.role}
                        </span>
                      </td>
                      <td style={{
                        padding: '16px',
                        textAlign: 'center',
                        borderRight: '1px solid #e5e7eb'
                      }}>
                        <button
                          onClick={() => handleTogglePremiumAccess(user.uid, user.premiumAccess || false)}
                          disabled={updatingUsers.has(user.uid)}
                          style={{
                            padding: '6px 16px',
                            borderRadius: '6px',
                            border: 'none',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: updatingUsers.has(user.uid) ? 'not-allowed' : 'pointer',
                            background: user.premiumAccess ? '#10b981' : '#ef4444',
                            color: 'white',
                            transition: 'all 0.2s ease',
                            opacity: updatingUsers.has(user.uid) ? 0.6 : 1
                          }}
                          onMouseOver={(e) => {
                            if (!updatingUsers.has(user.uid)) {
                              e.currentTarget.style.transform = 'scale(1.05)';
                            }
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        >
                          {updatingUsers.has(user.uid) ? '...' : (user.premiumAccess ? 'Allow Access' : 'Stop Access')}
                        </button>
                      </td>
                      <td style={{
                        padding: '16px',
                        borderRight: '1px solid #e5e7eb',
                        fontSize: '13px',
                        color: '#6b7280'
                      }}>
                        {formatDate(user.createdAt)}
                      </td>
                      <td style={{
                        padding: '16px',
                        fontSize: '13px',
                        color: '#6b7280'
                      }}>
                        {formatDate(user.lastLoginAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {users.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                color: '#6b7280'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>👥</div>
                <h3 style={{ margin: '0 0 10px 0', color: '#374151' }}>No Users Found</h3>
                <p>No users have been registered yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>
        {`
          .sidebar-toggle {
            animation: pulse 2s infinite;
          }

          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }

          .sidebar {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          }

          .sidebar-item {
            user-select: none;
          }

          /* Responsive adjustments for mobile */
          @media (max-width: 768px) {
            .sidebar-toggle {
              top: '15px';
              left: '15px';
              padding: '10px';
              font-size: '16px';
            }
          }

          @media (max-width: 480px) {
            .sidebar-toggle {
              top: '10px';
              left: '10px';
              padding: '8px';
              font-size: '14px';
            }
          }
        `}
      </style>
        </div>
    </div>
  );
};

export default Users;
