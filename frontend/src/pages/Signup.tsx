import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { SignupCredentials } from '../types/auth';
import LoadingSpinner from '../components/LoadingSpinner';
import './Auth.css';

const Signup: React.FC = () => {
  const { signup, loginWithGoogle, loading, error } = useAuth();
  const [credentials, setCredentials] = useState<SignupCredentials>({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState<Partial<SignupCredentials>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const errors: Partial<SignupCredentials> = {};

    if (!credentials.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!credentials.password.trim()) {
      errors.password = 'Password is required';
    } else if (credentials.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    if (!credentials.confirmPassword.trim()) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (credentials.password !== credentials.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear field-specific error when user starts typing
    if (formErrors[name as keyof SignupCredentials]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleFocus = (field: string) => {
    setFocusedField(field);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await signup(credentials);
    } catch {
      // Error is handled by the AuthContext
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await loginWithGoogle();
    } catch {
      // Error is handled by the AuthContext
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="auth-wrapper">
      {/* Japanese-Themed Background Elements */}
      <div className="auth-bg-elements">
        <div className="bg-japanese-element bg-element-1">桜</div>
        <div className="bg-japanese-element bg-element-2">竹</div>
        <div className="bg-japanese-element bg-element-3">松</div>
        <div className="bg-meditation-icon">🧘</div>
        <div className="floating-particles">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${20 + i * 15}%`,
              animationDelay: `${i * 0.5}s`
            }}></div>
          ))}
        </div>
      </div>

      {/* Main Auth Container */}
      <div className="auth-main-container">
        <div className="auth-card">
          {/* Header Section */}
          <div className="auth-header">
            <div className="brand-logo">
              <h1 className="brand-title">コードアリーナ</h1>
            </div>
            <h2 className="auth-title">
              Join the <span className="highlight">Coding Community</span>
            </h2>
            <p className="auth-subtitle">
              Start your competitive programming journey today
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <div className="error-icon">⚠️</div>
              <span>{error}</span>
            </div>
          )}

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <svg className="field-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="currentColor"/>
                </svg>
                Email Address
              </label>
              <div className={`input-wrapper ${focusedField === 'email' ? 'focused' : ''} ${formErrors.email ? 'error' : ''}`}>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus('email')}
                  onBlur={handleBlur}
                  className="form-input"
                  placeholder="your.email@example.com"
                  disabled={loading}
                  autoComplete="email"
                />
                <div className="input-glow"></div>
              </div>
              {formErrors.email && (
                <span className="field-error">{formErrors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <svg className="field-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 8H17V6C17 3.24 14.76 1 12 1S7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15S10.9 13 12 13 14 13.9 14 15 13.1 17 12 17ZM9 8V6C9 4.34 10.34 3 12 3S15 4.34 15 6V8H9Z" fill="currentColor"/>
                </svg>
                Password
              </label>
              <div className={`input-wrapper ${focusedField === 'password' ? 'focused' : ''} ${formErrors.password ? 'error' : ''}`}>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus('password')}
                  onBlur={handleBlur}
                  className="form-input"
                  placeholder="Create a strong password"
                  disabled={loading}
                  autoComplete="new-password"
                />
                <div className="input-glow"></div>
              </div>
              {formErrors.password && (
                <span className="field-error">{formErrors.password}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                <svg className="field-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 8H17V6C17 3.24 14.76 1 12 1S7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15S10.9 13 12 13 14 13.9 14 15 13.1 17 12 17ZM9 8V6C9 4.34 10.34 3 12 3S15 4.34 15 6V8H9Z" fill="currentColor"/>
                </svg>
                Confirm Password
              </label>
              <div className={`input-wrapper ${focusedField === 'confirmPassword' ? 'focused' : ''} ${formErrors.confirmPassword ? 'error' : ''}`}>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={credentials.confirmPassword}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus('confirmPassword')}
                  onBlur={handleBlur}
                  className="form-input"
                  placeholder="Confirm your password"
                  disabled={loading}
                  autoComplete="new-password"
                />
                <div className="input-glow"></div>
              </div>
              {formErrors.confirmPassword && (
                <span className="field-error">{formErrors.confirmPassword}</span>
              )}
            </div>

            <button
              type="submit"
              className="auth-button primary-button"
              disabled={loading}
            >
              <span className="button-text">
                {loading ? 'Creating Account...' : 'Create Account'}
              </span>
              <div className="button-glow"></div>
            </button>
          </form>

          {/* Divider */}
          <div className="auth-divider">
            <div className="divider-line"></div>
            <span className="divider-text">or continue with</span>
            <div className="divider-line"></div>
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignup}
            className="auth-button google-button"
            disabled={loading}
          >
            <svg className="google-icon" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Auth Links */}
          <div className="auth-links">
            <span>Already have an account?</span>
            <Link to="/login" className="auth-link">
              Sign in to your account
              <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill="currentColor"/>
              </svg>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Signup;
