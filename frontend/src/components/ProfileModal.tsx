import React, { useState, useEffect } from 'react';
import { User } from '../types/auth';
import { getAuth } from 'firebase/auth';
import { useAuth } from '../contexts/AuthContext';

// --- Interfaces ---
interface ProfileModalProps {
  user: User | null;
  onClose: () => void;
}

interface ProfileData {
  displayName: string;
  email: string;
  collegeName: string;
  skills: string;
  premiumStatus: string;
  lastLogin: string;
}

// --- Dark Mode & Compact Styles ---
const styles = {
  overlay: {
    position: 'fixed' as 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '16px',
    animation: 'fadeIn 0.2s ease-out'
  },
  modal: {
    backgroundColor: '#1f2937', 
    borderRadius: '16px',
    width: '100%',
    maxWidth: '420px',
    maxHeight: '90vh',
    overflowY: 'auto' as 'auto',
    position: 'relative' as 'relative',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    display: 'flex',
    flexDirection: 'column' as 'column',
    color: '#f3f4f6',
    border: '1px solid #374151'
  },
  headerBanner: {
    height: '100px',
    background: 'linear-gradient(120deg, #6366f1 0%, #a855f7 100%)',
    position: 'relative' as 'relative',
    zIndex: 1, // Lower z-index for the banner
  },
  closeButton: {
    position: 'absolute' as 'absolute',
    top: '12px',
    right: '12px',
    background: 'rgba(0, 0, 0, 0.3)',
    border: 'none',
    color: '#e5e7eb',
    fontSize: '18px',
    cursor: 'pointer',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(4px)',
    transition: 'background 0.2s',
    zIndex: 20 // Ensure close button is clickable
  },
  avatarContainer: {
    marginTop: '-45px',
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
    padding: '0 24px',
    position: 'relative' as 'relative', // Essential for z-index to work
    zIndex: 10, // Higher z-index to sit ON TOP of the banner
  },
  avatar: {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    border: '4px solid #1f2937', // Matches modal bg to create "cutout" look
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px',
    backgroundColor: '#374151',
    color: '#9ca3af',
  },
  content: {
    padding: '16px 24px 24px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#f9fafb',
    marginBottom: '2px',
    marginTop: '12px',
    textAlign: 'center' as 'center',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginBottom: '20px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    gap: '4px',
  },
  label: {
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase' as 'uppercase',
    letterSpacing: '0.05em',
    color: '#9ca3af',
  },
  input: {
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #4b5563',
    backgroundColor: '#374151',
    color: '#f3f4f6',
    fontSize: '13px',
    fontWeight: '500',
    outline: 'none',
    transition: 'all 0.2s',
    width: '100%',
    boxSizing: 'border-box' as 'border-box',
  },
  readOnlyField: {
    padding: '8px 12px',
    borderRadius: '8px',
    backgroundColor: 'rgba(55, 65, 81, 0.5)',
    border: '1px solid #374151',
    fontSize: '13px',
    color: '#e5e7eb',
    fontWeight: '500',
    whiteSpace: 'nowrap' as 'nowrap',
    overflow: 'hidden' as 'hidden',
    textOverflow: 'ellipsis' as 'ellipsis'
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: '1px solid #374151',
  },
  primaryBtn: {
    padding: '8px 16px',
    background: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    transition: 'transform 0.1s',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  secondaryBtn: {
    padding: '8px 16px',
    background: '#374151',
    color: '#e5e7eb',
    border: '1px solid #4b5563',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    transition: 'background 0.1s',
  }
};

const ProfileModal: React.FC<ProfileModalProps> = ({ user, onClose }) => {
  const { user: authUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    displayName: '',
    email: '',
    collegeName: '',
    skills: '',
    premiumStatus: '',
    lastLogin: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (user) {
      const storedProfile = localStorage.getItem(`userProfile_${user.uid}`);
      const parsedProfile = storedProfile ? JSON.parse(storedProfile) : {};

      setProfileData({
        displayName: user.displayName || parsedProfile.displayName || '',
        email: user.email || parsedProfile.email || '',
        collegeName: parsedProfile.collegeName || '',
        skills: parsedProfile.skills || '',
        premiumStatus: authUser?.role === 'admin' ? 'Premium' : (parsedProfile.premiumStatus || 'Free'),
        lastLogin: parsedProfile.lastLogin || new Date().toLocaleString()
      });
    }
  }, [user, authUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!user) return;
    setIsLoading(true);
    setMessage(null);

    try {
      if (!profileData.displayName.trim()) throw new Error('Display name is required');
      if (!profileData.email.trim()) throw new Error('Email is required');
      if (profileData.email !== user.email) throw new Error('Email cannot be changed.');

      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('User not authenticated');

      const idToken = await currentUser.getIdToken();

      const profileToSave = {
        displayName: profileData.displayName.trim(),
        email: profileData.email.trim(),
        collegeName: profileData.collegeName.trim(),
        skills: profileData.skills.trim(),
        premiumStatus: profileData.premiumStatus,
        lastLogin: new Date().toLocaleString()
      };

      localStorage.setItem(`userProfile_${user.uid}`, JSON.stringify(profileToSave));

      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({ displayName: profileData.displayName.trim() }),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      setMessage({ type: 'success', text: 'Saved!' });
      setIsEditing(false);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Error updating' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      const storedProfile = localStorage.getItem(`userProfile_${user.uid}`);
      const parsedProfile = storedProfile ? JSON.parse(storedProfile) : {};
      setProfileData({
        displayName: user.displayName || parsedProfile.displayName || '',
        email: user.email || parsedProfile.email || '',
        collegeName: parsedProfile.collegeName || '',
        skills: parsedProfile.skills || '',
        premiumStatus: authUser?.role === 'admin' ? 'Premium' : (parsedProfile.premiumStatus || 'Free'),
        lastLogin: parsedProfile.lastLogin || new Date().toLocaleString()
      });
    }
    setIsEditing(false);
    setMessage(null);
  };

  if (!user) return null;

  return (
    <div style={styles.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        
        {/* Header Banner */}
        <div style={styles.headerBanner}>
          <button style={styles.closeButton} onClick={onClose} aria-label="Close">×</button>
        </div>

        {/* Avatar Section */}
        <div style={styles.avatarContainer}>
          <div 
            style={{
              ...styles.avatar,
              backgroundImage: user.photoURL ? `url(${user.photoURL})` : undefined
            }}
          >
            {!user.photoURL && (user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U')}
          </div>
          <h2 style={styles.sectionTitle}>
            {profileData.displayName || 'User'}
          </h2>
          <div style={{ marginTop: '4px' }}>
             {/* Hardcoded Verified Badge */}
             <span style={{ 
               color: '#34d399', 
               fontSize: '11px', 
               fontWeight: '600', 
               display: 'inline-flex', 
               alignItems: 'center', 
               gap: '3px',
               background: 'rgba(6, 95, 70, 0.3)',
               padding: '2px 8px',
               borderRadius: '12px',
               border: '1px solid rgba(52, 211, 153, 0.2)'
             }}>
               <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
               </svg>
               Verified
             </span>
          </div>
        </div>

        <div style={styles.content}>
          {message && (
            <div style={{
              padding: '8px',
              marginBottom: '16px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '500',
              textAlign: 'center',
              backgroundColor: message.type === 'success' ? 'rgba(6, 78, 59, 0.5)' : 'rgba(127, 29, 29, 0.5)',
              color: message.type === 'success' ? '#6ee7b7' : '#fca5a5',
              border: `1px solid ${message.type === 'success' ? '#065f46' : '#7f1d1d'}`
            }}>
              {message.text}
            </div>
          )}

          {/* Compact Form Grid */}
          <div style={styles.grid}>
            {/* Display Name */}
            <div style={{ ...styles.fieldGroup, gridColumn: '1 / -1' }}>
              <label style={styles.label}>Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="displayName"
                  value={profileData.displayName}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="Name"
                />
              ) : (
                <div style={styles.readOnlyField}>{profileData.displayName}</div>
              )}
            </div>

            {/* Email */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Email</label>
              <div style={styles.readOnlyField} title={profileData.email}>
                {profileData.email}
              </div>
            </div>

             {/* Verified Status (Hardcoded) */}
            <div style={styles.fieldGroup}>
               <label style={styles.label}>Status</label>
               <div style={{
                 ...styles.readOnlyField,
                 backgroundColor: 'rgba(6, 78, 59, 0.4)', // Dark green bg
                 color: '#34d399', // Bright green text
                 borderColor: '#064e3b',
                 display: 'flex',
                 alignItems: 'center',
                 gap: '4px'
               }}>
                 ✓ Verified
               </div>
            </div>

            {/* College */}
            <div style={{ ...styles.fieldGroup, gridColumn: '1 / -1' }}>
              <label style={styles.label}>Organization</label>
              {isEditing ? (
                <input
                  type="text"
                  name="collegeName"
                  value={profileData.collegeName}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="e.g. University"
                />
              ) : (
                <div style={styles.readOnlyField}>{profileData.collegeName || '-'}</div>
              )}
            </div>

            {/* Skills */}
            <div style={{ ...styles.fieldGroup, gridColumn: '1 / -1' }}>
              <label style={styles.label}>Skills</label>
              {isEditing ? (
                <input
                  type="text"
                  name="skills"
                  value={profileData.skills}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="e.g. React, Node"
                />
              ) : (
                <div style={styles.readOnlyField}>{profileData.skills || '-'}</div>
              )}
            </div>

            {/* Premium Badge */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Plan</label>
              <div style={{
                ...styles.readOnlyField,
                background: profileData.premiumStatus === 'Premium' ? 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)' : 'rgba(55, 65, 81, 0.5)',
                color: profileData.premiumStatus === 'Premium' ? '#fff' : '#e5e7eb',
                fontWeight: profileData.premiumStatus === 'Premium' ? '600' : '500',
                border: profileData.premiumStatus === 'Premium' ? 'none' : '1px solid #374151',
                textShadow: profileData.premiumStatus === 'Premium' ? '0 1px 2px rgba(0,0,0,0.2)' : 'none'
              }}>
                {profileData.premiumStatus === 'Premium' ? '★ Premium' : 'Free Plan'}
              </div>
            </div>

             {/* Last Login */}
             <div style={styles.fieldGroup}>
              <label style={styles.label}>Seen</label>
              <div style={styles.readOnlyField}>
                {profileData.lastLogin.split(',')[0]}
              </div>
            </div>
          </div>

          {/* Compact Actions */}
          <div style={styles.actions}>
            {isEditing ? (
              <>
                <button onClick={handleCancel} disabled={isLoading} style={styles.secondaryBtn}>
                  Cancel
                </button>
                <button 
                  onClick={handleSave} 
                  disabled={isLoading} 
                  style={{...styles.primaryBtn, opacity: isLoading ? 0.7 : 1}}
                >
                   {isLoading ? '...' : 'Save'}
                </button>
              </>
            ) : (
              <>
                <button onClick={onClose} style={styles.secondaryBtn}>
                  Close
                </button>
                <button onClick={() => setIsEditing(true)} style={styles.primaryBtn}>
                  Edit
                </button>
              </>
            )}
          </div>

        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        /* Custom Dark Scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #1f2937;
        }
        ::-webkit-scrollbar-thumb {
          background: #4b5563; 
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #6b7280; 
        }
        input:focus {
          border-color: #6366f1 !important;
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
        }
      `}</style>
    </div>
  );
};

export default ProfileModal;