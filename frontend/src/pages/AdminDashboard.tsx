import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import DSAManagement from '../components/DSAManagement';

const AdminDashboard: React.FC = () => {
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch {}
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleDSASheetClick = () => {
    // Handle DSA Sheet navigation for admin
    setSidebarOpen(false);
  };

  const handleUsersClick = () => {
    // Navigate to Users page
    navigate('/admin/users');
    setSidebarOpen(false);
  };

  const handleUPISettingsClick = () => {
    navigate('/admin/upi-settings');
    setSidebarOpen(false);
  };

  const handleManagePaymentsClick = () => {
    navigate('/admin/manage-payments');
    setSidebarOpen(false);
  };

  return (
    <div className="dashboard">
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

      {/* DSA Management Content */}
      <DSAManagement />

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

            .dashboard-header {
              padding-left: '60px !important';
            }

            .dashboard-title {
              font-size: '24px !important';
            }

            .dashboard-subtitle {
              font-size: '14px !important';
            }
          }

          @media (max-width: 480px) {
            .sidebar-toggle {
              top: '10px';
              left: '10px';
              padding: '8px';
              font-size: '14px';
            }

            .dashboard-header {
              padding-left: '50px !important';
              padding-top: '20px !important';
            }

            .dashboard-title {
              font-size: '20px !important';
            }

            .dashboard-subtitle {
              font-size: '12px !important';
            }
          }
        `}
      </style>
    </div>
  );
};

export default AdminDashboard;
