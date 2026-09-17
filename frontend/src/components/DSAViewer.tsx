import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../utils/firebase';
import { DSAQuestion, DSASheetData, DSAHeading, DSASubheading } from '../types/dsa';
import DSAHeader from './DSAHeader';
import DSAHeadingCard from './DSAHeadingCard';
import PremiumModal from './PremiumModal';
import PaymentModal from './PaymentModal';
import QuestionDescriptionModal from './QuestionDescriptionModal';

// --- PROFESSIONAL DESIGN SYSTEM (Clean Neutral) ---
const styles = `
  :root {
    /* Brand Colors (Indigo) */
    --brand-50: #eef2ff;
    --brand-100: #e0e7ff;
    --brand-300: #a5b4fc;
    --brand-400: #818cf8;
    --brand-500: #6366f1;
    --brand-600: #4f46e5;
    --brand-700: #4338ca;
    
    /* Neutral Gray Palette */
    --gray-50: #f9fafb;
    --gray-100: #f3f4f6;
    --gray-200: #e5e7eb;
    --gray-300: #d1d5db;
    --gray-400: #9ca3af;
    --gray-500: #6b7280;
    --gray-600: #4b5563;
    --gray-700: #374151;
    --gray-800: #1f2937;
    --gray-900: #111827;

    /* Semantic */
    --success-bg: #ecfdf5;
    --success-text: #047857;
    --warning-bg: #fffbeb;
    --warning-text: #b45309;
    --danger-bg: #fef2f2;
    --danger-text: #b91c1c;

    /* Metrics */
    --radius-md: 8px;
    --radius-lg: 12px;
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.06);
  }

  body {
    background-color: var(--gray-100);
    color: var(--gray-800);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }

  /* Full-Page Background Container */
  .dsa-viewer-wrapper {
    position: relative;
    min-height: 100vh;
    overflow-x: hidden;
  }

  .background-image-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    overflow: hidden;
    will-change: transform;
  }

  .background-image-dsa {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
    transform: translateZ(0);
    will-change: transform;
  }

  .background-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(15, 23, 42, 0.3) 0%, rgba(30, 41, 59, 0.4) 100%);
    backdrop-filter: blur(0.5px);
  }

  .viewer-container {
    position: relative;
    z-index: 1;
    max-width: 1280px;
    margin: 0 auto;
    padding: 40px 20px;
    animation: fadeInUp 0.8s ease-out;
  }

  /* --- HEADER & PROGRESS --- */
  .page-header {
    margin-bottom: 40px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    flex-wrap: wrap;
    gap: 24px;
  }
  
  .header-text { flex: 1; }
  
  .page-title {
    font-size: 2.25rem;
    font-weight: 800;
    color: #ffffff;
    margin-bottom: 8px;
    letter-spacing: -0.025em;
    text-shadow: 0 2px 20px rgba(0, 0, 0, 0.5);
    animation: fadeInUp 0.8s ease-out 0.2s both;
  }
  
  .page-subtitle { 
    color: rgba(255, 255, 255, 0.9); 
    font-size: 1.125rem;
    text-shadow: 0 1px 10px rgba(0, 0, 0, 0.4);
    animation: fadeInUp 0.8s ease-out 0.4s both;
  }

  .progress-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    padding: 24px;
    border-radius: var(--radius-lg);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(102, 126, 234, 0.2);
    min-width: 320px;
    animation: fadeInUp 0.8s ease-out 0.6s both;
    transition: all 0.3s ease;
  }

  .progress-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35), 0 4px 12px rgba(102, 126, 234, 0.3);
  }
  
  .progress-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--gray-800);
  }
  
  .progress-bar-bg {
    height: 10px;
    background: var(--gray-100);
    border-radius: 5px;
    overflow: hidden;
  }
  
  .progress-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--brand-500), var(--brand-600));
    border-radius: 5px;
    transition: width 0.5s ease-out;
  }

  /* --- LEVEL 1: HEADINGS --- */
  .heading-card {
    background: linear-gradient(135deg, rgba(248, 250, 252, 0.95) 0%, rgba(241, 245, 249, 0.92) 100%);
    backdrop-filter: blur(20px);
    border-radius: var(--radius-lg);
    border: 1px solid rgba(226, 232, 240, 0.5);
    margin-bottom: 24px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25), 0 2px 8px rgba(148, 163, 184, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8);
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    animation: fadeInUp 0.6s ease-out both;
    position: relative;
  }

  .heading-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--gray-300), var(--gray-400), var(--gray-300));
    opacity: 0.6;
    transition: opacity 0.3s ease;
  }

  .heading-card:nth-child(1) { animation-delay: 0.1s; }
  .heading-card:nth-child(2) { animation-delay: 0.2s; }
  .heading-card:nth-child(3) { animation-delay: 0.3s; }
  .heading-card:nth-child(4) { animation-delay: 0.4s; }
  .heading-card:nth-child(5) { animation-delay: 0.5s; }
  
  .heading-card:hover {
    border-color: rgba(148, 163, 184, 0.6);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35), 0 4px 16px rgba(148, 163, 184, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.9);
    transform: translateY(-4px);
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.97) 0%, rgba(248, 250, 252, 0.95) 100%);
  }

  .heading-card:hover::before {
    opacity: 1;
  }

  .heading-header {
    padding: 24px 28px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%);
    backdrop-filter: blur(12px);
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(226, 232, 240, 0.3);
    transition: all 0.3s ease;
    position: relative;
  }
  
  .heading-header:hover {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%);
    transform: translateX(4px);
    border-bottom-color: rgba(148, 163, 184, 0.4);
  }

  .heading-header.expanded {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.12) 100%);
    border-bottom-color: rgba(148, 163, 184, 0.35);
  }

  .heading-title {
    font-size: 1.3rem;
    font-weight: 800;
    color: var(--gray-900);
    display: flex;
    align-items: center;
    gap: 16px;
    transition: all 0.2s;
  }

  .heading-title .chevron {
    color: var(--brand-500);
    font-size: 0.9rem;
    transition: all 0.3s ease;
  }

  .heading-header:hover .heading-title {
    color: var(--gray-800);
  }

  .heading-header:hover .heading-title .chevron {
    color: var(--brand-600);
    transform: scale(1.1);
  }
  
  .progress-ring {
    position: relative;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--brand-700);
  }
  .progress-ring svg {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    transform: rotate(-90deg);
  }
  .progress-ring circle {
    fill: none;
    stroke-width: 3;
    stroke-linecap: round;
  }
  .ring-bg { stroke: var(--gray-200); }
  .ring-progress { stroke: var(--brand-500); transition: stroke-dashoffset 0.3s; }

  /* --- LEVEL 2: TOPICS --- */
  .heading-body {
    background: linear-gradient(180deg, rgba(248, 250, 252, 0.8) 0%, rgba(241, 245, 249, 0.6) 100%);
    backdrop-filter: blur(10px);
    animation: slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    border-top: 1px solid rgba(226, 232, 240, 0.4);
  }
  
  .topic-wrapper { 
    border-bottom: 1px solid rgba(226, 232, 240, 0.3); 
  }
  .topic-wrapper:last-child { border-bottom: none; }

  .topic-header {
    padding: 18px 24px;
    padding-left: 54px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(255, 255, 255, 0.5);
    transition: all 0.3s ease;
  }
  
  .topic-header:hover { 
    background: rgba(255, 255, 255, 0.75);
    transform: translateX(4px);
  }
  
  .topic-header.expanded {
    background: rgba(255, 255, 255, 0.8);
    border-bottom: 1px solid rgba(226, 232, 240, 0.4);
  }

  .topic-info { display: flex; align-items: center; gap: 14px; }
  
  .topic-bar {
    width: 4px; 
    height: 18px; 
    background: var(--gray-300); 
    border-radius: 2px; 
    transition: all 0.2s;
  }
  
  .topic-header:hover .topic-bar,
  .topic-header.expanded .topic-bar { 
    background: var(--brand-600); 
    height: 22px; 
  }
  
  .topic-title { 
    font-size: 1rem; 
    font-weight: 600; 
    color: var(--gray-800); 
    transition: color 0.2s;
  }

  .topic-header:hover .topic-title {
    color: var(--brand-700);
  }

  /* --- LEVEL 3: QUESTIONS TABLE --- */
  .topic-content {
    padding: 24px;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(10px);
    animation: slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .dsa-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: var(--radius-md);
    overflow: hidden;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  }

  .dsa-table th {
    background: rgba(248, 250, 252, 0.9);
    backdrop-filter: blur(10px);
    padding: 14px 20px;
    text-align: left;
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--gray-700);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 1px solid rgba(226, 232, 240, 0.5);
  }

  .dsa-table td {
    padding: 16px 20px;
    border-bottom: 1px solid rgba(241, 245, 249, 0.5);
    font-size: 0.95rem;
    color: var(--gray-800);
    vertical-align: middle;
    transition: background 0.2s ease;
  }
  .dsa-table tr:last-child td { border-bottom: none; }
  
  .dsa-table tr:hover td {
    background: rgba(102, 126, 234, 0.05);
  }
  
  .dsa-table tr.completed-row { 
    background-color: rgba(236, 253, 245, 0.6);
  }
  .dsa-table tr.completed-row .q-name { 
    color: var(--gray-600); 
    text-decoration: line-through; 
  }

  /* Checkbox */
  .checkbox-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .custom-checkbox {
    width: 20px;
    height: 20px;
    border: 2px solid var(--gray-300);
    border-radius: 6px;
    cursor: pointer;
    appearance: none;
    position: relative;
    transition: all 0.2s;
    background: white;
  }
  .custom-checkbox:checked {
    background: var(--success-text);
    border-color: var(--success-text);
  }
  .custom-checkbox:checked::after {
    content: '✓';
    position: absolute;
    color: white;
    font-size: 14px;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    font-weight: 800;
  }

  .col-desc { cursor: pointer; max-width: 350px; }
  .desc-text { display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--gray-500); font-size: 0.85rem; }
  .desc-action { font-size: 0.75rem; color: var(--brand-600); font-weight: 600; margin-top: 4px; opacity: 0; transition: opacity 0.2s; }
  .dsa-table tr:hover .desc-action { opacity: 1; }

  .chevron { transition: transform 0.2s; font-size: 0.8rem; color: var(--gray-400); }
  .expanded .chevron { transform: rotate(90deg); color: var(--brand-600); }

  .badge { padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; white-space: nowrap; }
  .badge-easy { background: var(--success-bg); color: var(--success-text); border: 1px solid #a7f3d0; }
  .badge-medium { background: var(--warning-bg); color: var(--warning-text); border: 1px solid #fde68a; }
  .badge-hard { background: var(--danger-bg); color: var(--danger-text); border: 1px solid #fecaca; }

  .icon-btn {
    display: inline-flex; 
    align-items: center; 
    gap: 8px; 
    padding: 8px 16px; 
    border-radius: 8px; 
    font-size: 0.85rem; 
    font-weight: 600; 
    text-decoration: none; 
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
    background: rgba(255, 255, 255, 0.9); 
    backdrop-filter: blur(10px);
    border: 1px solid rgba(226, 232, 240, 0.5); 
    color: var(--gray-700); 
    width: 100%; 
    justify-content: center; 
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  .icon-btn:hover { 
    transform: translateY(-2px) scale(1.02); 
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  .icon-btn.youtube:hover { 
    background: rgba(254, 242, 242, 0.95); 
    border-color: rgba(254, 226, 226, 0.8); 
    color: #ef4444; 
  }
  .icon-btn.link:hover { 
    background: rgba(239, 246, 255, 0.95); 
    border-color: rgba(219, 234, 254, 0.8); 
    color: #3b82f6; 
  }
  .icon-btn.disabled { 
    background: rgba(248, 250, 252, 0.6); 
    color: var(--gray-400); 
    cursor: not-allowed; 
    border-color: rgba(241, 245, 249, 0.5); 
    box-shadow: none; 
    opacity: 0.6;
  }

  /* Modal */
  .modal-overlay { position: fixed; inset: 0; background: rgba(17, 24, 39, 0.7); backdrop-filter: blur(4px); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 20px; }
  .modal-content { background: white; width: 100%; max-width: 650px; max-height: 85vh; border-radius: 16px; overflow-y: auto; box-shadow: var(--shadow-lg); animation: modalPop 0.2s ease-out; }
  .modal-header { padding: 24px 32px; border-bottom: 1px solid var(--gray-100); display: flex; justify-content: space-between; align-items: flex-start; background: #fff; }
  .modal-body { padding: 32px; }
  
  @keyframes slideDown { 
    from { opacity: 0; transform: translateY(-8px); } 
    to { opacity: 1; transform: translateY(0); } 
  }
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes modalPop { 
    from { opacity: 0; transform: scale(0.95); } 
    to { opacity: 1; transform: scale(1); } 
  }
  .loading-spinner { 
    width: 40px; 
    height: 40px; 
    border: 3px solid var(--gray-200); 
    border-top-color: var(--brand-600); 
    border-radius: 50%; 
    animation: spin 1s linear infinite; 
  }
  @keyframes spin { 
    to { transform: rotate(360deg); } 
  }

  /* Parallax Effect on Scroll */
  @media (prefers-reduced-motion: no-preference) {
    .background-image-container {
      transition: transform 0.1s ease-out;
    }
  }

  /* Reduce Motion for Accessibility */
  @media (prefers-reduced-motion: reduce) {
    .background-image-container {
      transform: none !important;
    }
    
    .heading-card,
    .viewer-container,
    .page-title,
    .page-subtitle,
    .progress-card {
      animation: none !important;
      opacity: 1 !important;
      transform: none !important;
    }
  }
`;

// Types are now imported from '../types/dsa'

const DSAViewer: React.FC = () => {
  const [data, setData] = useState<DSASheetData>({ headings: [], lastUpdated: new Date() });
  const [loading, setLoading] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState<DSAQuestion | null>(null);
  
  // Accordion State
  const [expandedHeadings, setExpandedHeadings] = useState<Set<string>>(new Set());
  const [expandedSubheadings, setExpandedSubheadings] = useState<Set<string>>(new Set());

  // Progress State (Using Set for O(1) lookup in render)
  const [completedQuestions, setCompletedQuestions] = useState<Set<string>>(new Set());
  const [totalQuestionsCount, setTotalQuestionsCount] = useState(0);

  // Premium Access State
  const [premiumAccess, setPremiumAccess] = useState<boolean>(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [upiSettings, setUpiSettings] = useState<{ upiId: string; subscriptionAmount: number; qrCode: string } | null>(null);

  useEffect(() => {
    loadDSASheetData();
    loadUserProgress();
    loadPremiumAccess();
  }, []);

  // Parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      const parallaxElement = document.querySelector('.background-image-container') as HTMLElement;
      if (parallaxElement) {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.2; // Gentle parallax speed
        parallaxElement.style.transform = `translate3d(0, ${rate}px, 0)`;
      }
    };

    // Throttle scroll events for performance
    let ticking = false;
    const optimizedScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', optimizedScroll, { passive: true });
    return () => window.removeEventListener('scroll', optimizedScroll);
  }, []);

  const loadPremiumAccess = async () => {
    try {
      const idToken = await auth.currentUser?.getIdToken();
      if (!idToken) return;

      const response = await axios.get('/api/auth/premium-access', {
        headers: { 'Authorization': `Bearer ${idToken}` }
      });

      if (response.data.success) {
        setPremiumAccess(response.data.premiumAccess || false);
      }
    } catch {
      setPremiumAccess(false);
    }
  };

  const loadUPISettings = async () => {
    try {
      const idToken = await auth.currentUser?.getIdToken();
      if (!idToken) {
        return;
      }

      const response = await axios.get('/api/payment/upi-settings', {
        headers: { 'Authorization': `Bearer ${idToken}` }
      });

      if (response.data.success && response.data.settings) {
        setUpiSettings(response.data.settings);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const handleBuyPremium = async () => {
    setShowPremiumModal(false);
    // Load UPI settings before showing payment modal
    const loaded = await loadUPISettings();
    if (loaded) {
      setShowPaymentModal(true);
    } else {
      // If settings failed to load, still show modal but it will handle the error state
      setShowPaymentModal(true);
    }
  };

  const loadDSASheetData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/dsa/sheet');
      if (response.data.success) {
        const sheetData = response.data.data;
        setData(sheetData);
        
        // Calculate Total Questions
        const total = sheetData.headings.reduce((acc: number, h: DSAHeading) => 
          acc + h.subheadings.reduce((subAcc: number, s: DSASubheading) => subAcc + s.questions.length, 0), 0
        );
        setTotalQuestionsCount(total);

        // All headings start closed by default
        // Removed: Default expand first heading
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const loadUserProgress = async () => {
    try {
      const idToken = await auth.currentUser?.getIdToken();
      if (!idToken) return;
      
      const response = await axios.get('/api/dsa/progress', {
        headers: { 'Authorization': `Bearer ${idToken}` }
      });
      
      if (response.data.success) {
        // FIXED LOGIC: Handle response as array of objects { questionId, completed }
        const progressList = response.data.progress || [];
        const completedIds = progressList
          .filter((p: any) => p.completed)
          .map((p: any) => p.questionId);
          
        setCompletedQuestions(new Set(completedIds));
      }
    } catch {}
  };

  const toggleProgress = async (questionId: string) => {
    // Check premium access
    if (!premiumAccess) {
      setShowPremiumModal(true);
      return;
    }

    // Optimistic Update
    const isCompleted = completedQuestions.has(questionId);
    const newSet = new Set(completedQuestions);
    if (isCompleted) newSet.delete(questionId);
    else newSet.add(questionId);
    setCompletedQuestions(newSet);

    try {
      const idToken = await auth.currentUser?.getIdToken();
      // FIXED LOGIC: Reverted to PUT and original body structure
      await axios.put('/api/dsa/progress', 
        { questionId, completed: !isCompleted },
        { headers: { 'Authorization': `Bearer ${idToken}` } }
      );
    } catch {
      setCompletedQuestions(completedQuestions); 
    }
  };

  const toggleHeading = (id: string) => {
    setExpandedHeadings(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSubheading = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); 
    setExpandedSubheadings(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const closeQuestionModal = () => {
    setSelectedQuestion(null);
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6' }}>
      <style>{styles}</style>
      <div className="loading-spinner"></div>
      </div>
    );

  return (
    <div className="dsa-viewer-wrapper">
      <style>{styles}</style>
      
      {/* Full-Page Background with Parallax */}
      <div className="background-image-container">
        <img 
          src="/images/Japan 2.avif" 
          alt="Japanese Temple Background"
          className="background-image-dsa"
        />
        {/* Dark Overlay for Readability */}
        <div className="background-overlay"></div>
        </div>

      {/* Content Container */}
      <div className="viewer-container">
        {/* Header & Overall Progress */}
        <DSAHeader 
          completedCount={completedQuestions.size}
          totalCount={totalQuestionsCount}
        />

        {/* Main Content */}
        <div className="hierarchy-list">
            {data.headings.map((heading, index) => (
            <DSAHeadingCard
              key={heading.id}
              heading={heading}
              isExpanded={expandedHeadings.has(heading.id)}
              expandedSubheadings={expandedSubheadings}
              completedQuestions={completedQuestions}
              premiumAccess={premiumAccess}
              isFirstHeading={index === 0}
              onToggleHeading={toggleHeading}
              onToggleSubheading={toggleSubheading}
              onToggleProgress={toggleProgress}
              onShowPremiumModal={() => setShowPremiumModal(true)}
              onSelectQuestion={setSelectedQuestion}
            />
          ))}
                  </div>
                </div>

      {/* Description Modal */}
      {selectedQuestion && (
        <QuestionDescriptionModal
          question={selectedQuestion}
          premiumAccess={premiumAccess}
          onClose={closeQuestionModal}
          onShowPremiumModal={() => setShowPremiumModal(true)}
        />
      )}

      {/* Premium Access Modal */}
      {showPremiumModal && (
        <PremiumModal
          onClose={() => setShowPremiumModal(false)}
          onBuyPremium={handleBuyPremium}
        />
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          upiSettings={upiSettings}
          userEmail={auth.currentUser?.email || ''}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => {
            setShowPaymentModal(false);
            setShowPremiumModal(false);
          }}
        />
      )}
    </div>
  );
};

export default DSAViewer;
