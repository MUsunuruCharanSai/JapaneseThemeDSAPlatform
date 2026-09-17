import React, { useState, useEffect } from 'react';
import { auth } from '../utils/firebase';
import axios from 'axios';

// --- PROFESSIONAL DESIGN SYSTEM ---
const styles = `
  :root {
    /* Brand Colors - Royal Indigo */
    --brand-50: #eef2ff;
    --brand-100: #e0e7ff;
    --brand-500: #6366f1;
    --brand-600: #4f46e5;
    --brand-700: #4338ca;
    
    /* Neutral Slate - High Contrast Text */
    --slate-50: #f8fafc;
    --slate-100: #f1f5f9;
    --slate-200: #e2e8f0;
    --slate-300: #cbd5e1;
    --slate-400: #94a3b8;
    --slate-500: #64748b;
    --slate-600: #475569;
    --slate-700: #334155;
    --slate-800: #1e293b;
    --slate-900: #0f172a;

    /* Semantic Colors */
    --success-bg: #dcfce7;
    --success-text: #166534;
    --warning-bg: #fef9c3;
    --warning-text: #854d0e;
    --danger-bg: #fee2e2;
    --danger-text: #991b1b;

    /* Metrics */
    --radius-sm: 6px;
    --radius-md: 8px;
    --radius-lg: 12px;
    --shadow-subtle: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    --shadow-card: 0 4px 6px -1px rgb(0 0 0 / 0.02), 0 2px 4px -2px rgb(0 0 0 / 0.02);
    --shadow-popover: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  }

  * { box-sizing: border-box; }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    -webkit-font-smoothing: antialiased;
    background-color: var(--slate-50);
    color: var(--slate-800);
  }

  /* Layout Shell */
  .dashboard-shell {
    display: flex;
    min-height: 100vh;
    background-color: var(--slate-50);
  }

  /* Sidebar Navigation */
  .sidebar {
    width: 280px;
    background: #ffffff;
    border-right: 1px solid var(--slate-200);
    display: flex;
    flex-direction: column;
    padding: 24px 16px;
    position: sticky;
    top: 0;
    height: 100vh;
  }

  .brand-header {
    margin-bottom: 32px;
    padding: 0 12px;
  }

  .brand-title {
    font-size: 1.25rem;
    font-weight: 800;
    color: var(--slate-900);
    letter-spacing: -0.025em;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .brand-icon {
    width: 24px; 
    height: 24px; 
    background: var(--brand-600); 
    border-radius: 6px;
  }

  .nav-menu {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border-radius: var(--radius-md);
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--slate-500);
    cursor: pointer;
    border: none;
    background: transparent;
    transition: all 0.2s ease;
    text-align: left;
  }

  .nav-item:hover {
    background-color: var(--slate-50);
    color: var(--slate-900);
  }

  .nav-item.active {
    background-color: var(--brand-50);
    color: var(--brand-700);
    font-weight: 600;
  }

  /* Main Content Area */
  .main-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0; /* Prevents overflow */
  }

  .top-bar {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(8px);
    border-bottom: 1px solid var(--slate-200);
    padding: 20px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .page-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--slate-900);
  }

  .stat-badge {
    display: inline-flex;
    flex-direction: column;
    align-items: flex-end;
  }
  .stat-number { font-weight: 700; color: var(--brand-600); font-size: 1.1rem; }
  .stat-label { font-size: 0.7rem; color: var(--slate-500); text-transform: uppercase; font-weight: 600; }

  .content-canvas {
    padding: 32px;
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
  }

  /* Components: Cards */
  .card {
    background: #ffffff;
    border: 1px solid var(--slate-200);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-card);
    overflow: hidden;
    margin-bottom: 24px;
    transition: box-shadow 0.2s;
  }
  
  .card:hover {
    box-shadow: var(--shadow-popover);
    border-color: var(--brand-100);
  }

  .card-header {
    padding: 20px 24px;
    border-bottom: 1px solid var(--slate-100);
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #ffffff;
  }

  .card-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--slate-800);
  }

  .card-body {
    padding: 24px;
  }

  /* Components: Buttons */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 8px 16px;
    font-size: 0.875rem;
    font-weight: 500;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all 0.2s;
    border: 1px solid transparent;
  }
  
  .btn:active { transform: scale(0.98); }

  .btn-primary {
    background: var(--brand-600);
    color: white;
    box-shadow: 0 1px 2px rgba(79, 70, 229, 0.3);
  }
  .btn-primary:hover { background: var(--brand-700); }
  .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

  .btn-outline {
    background: #ffffff;
    border-color: var(--slate-300);
    color: var(--slate-700);
  }
  .btn-outline:hover { background: var(--slate-50); border-color: var(--slate-400); }

  .btn-ghost {
    background: transparent;
    color: var(--slate-500);
  }
  .btn-ghost:hover { background: var(--slate-100); color: var(--slate-900); }
  .btn-ghost.danger:hover { background: var(--danger-bg); color: var(--danger-text); }

  .btn-sm { padding: 6px 12px; font-size: 0.8rem; }

  /* Components: Inputs */
  .form-group { margin-bottom: 16px; }
  .form-label {
    display: block;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--slate-700);
    margin-bottom: 6px;
  }
  .form-control {
    width: 100%;
    padding: 10px 12px;
    font-size: 0.95rem;
    border: 1px solid var(--slate-300);
    border-radius: var(--radius-md);
    transition: all 0.2s;
    color: var(--slate-900);
  }
  .form-control:focus {
    outline: none;
    border-color: var(--brand-500);
    box-shadow: 0 0 0 3px var(--brand-100);
  }
  textarea.form-control { min-height: 100px; resize: vertical; }

  /* Specific Views */
  .grid-3 {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 24px;
  }

  .stat-card {
    background: white;
    padding: 24px;
    border-radius: var(--radius-lg);
    border: 1px solid var(--slate-200);
    text-align: center;
  }
  .stat-card-value { font-size: 2.5rem; font-weight: 800; color: var(--slate-900); line-height: 1; margin-bottom: 8px; }
  .stat-card-label { color: var(--slate-500); font-size: 0.9rem; font-weight: 500; }

  .topic-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    background: var(--slate-100);
    border: 1px solid var(--slate-200);
    border-radius: 20px;
    font-size: 0.85rem;
    color: var(--slate-700);
    font-weight: 500;
  }
  .topic-tag:hover { background: #ffffff; border-color: var(--brand-300); color: var(--brand-700); }

  .question-row {
    display: flex;
    justify-content: space-between;
    padding: 16px 0;
    border-bottom: 1px solid var(--slate-100);
  }
  .question-row:last-child { border-bottom: none; }
  
  .badge {
    padding: 2px 10px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .badge-easy { background: var(--success-bg); color: var(--success-text); }
  .badge-medium { background: var(--warning-bg); color: var(--warning-text); }
  .badge-hard { background: var(--danger-bg); color: var(--danger-text); }

  /* Modal */
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.5);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
    animation: fadeIn 0.2s ease-out;
  }
  
  .modal-panel {
    background: white;
    width: 100%;
    max-width: 500px;
    border-radius: var(--radius-lg);
    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
    display: flex;
    flex-direction: column;
    animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

  .modal-header { padding: 20px 24px; border-bottom: 1px solid var(--slate-100); display: flex; justify-content: space-between; align-items: center; }
  .modal-title { font-size: 1.15rem; font-weight: 700; color: var(--slate-900); }
  .modal-body { padding: 24px; overflow-y: auto; max-height: 70vh; }
  .modal-footer { padding: 16px 24px; background: var(--slate-50); border-top: 1px solid var(--slate-200); display: flex; justify-content: flex-end; gap: 12px; border-radius: 0 0 var(--radius-lg) var(--radius-lg); }

  .empty-state {
    padding: 48px;
    text-align: center;
    color: var(--slate-500);
  }
  .loading-spinner {
    width: 24px; height: 24px;
    border: 3px solid var(--slate-200);
    border-top-color: var(--brand-600);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

// --- TYPES ---
interface DSAQuestion {
  id: string;
  name: string;
  article: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  youtubeLink?: string;
  questionLink?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface DSASubheading {
  id: string;
  name: string;
  questions: DSAQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

interface DSAHeading {
  id: string;
  name: string;
  subheadings: DSASubheading[];
  createdAt: Date;
  updatedAt: Date;
}

interface DSASheetData {
  headings: DSAHeading[];
  lastUpdated: Date;
}

const DSAManagement: React.FC = () => {
  // State
  const [data, setData] = useState<DSASheetData>({ headings: [], lastUpdated: new Date() });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI State
  const [activeView, setActiveView] = useState<'overview' | 'headings' | 'questions'>('overview');
  
  // Modals & Forms
  const [modalType, setModalType] = useState<'createHeading' | 'createTopic' | 'createQuestion' | 'editHeading' | 'editTopic' | 'editQuestion' | null>(null);
  
  // Form Data
  const [formHeading, setFormHeading] = useState('');
  const [formTopic, setFormTopic] = useState('');
  const [selectedHeadingId, setSelectedHeadingId] = useState('');
  
  // Question Form
  const [qForm, setQForm] = useState({
    headingId: '',
    subheadingId: '',
    name: '',
    article: '',
    difficulty: 'Easy' as 'Easy' | 'Medium' | 'Hard',
    youtubeLink: '',
    questionLink: ''
  });

  // Editing References
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/dsa/sheet');
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch {
      setError('Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  };

  // --- ACTIONS ---

  const handleCreateHeading = async () => {
    if (!formHeading.trim()) return;
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await axios.post('/api/dsa/headings', { name: formHeading }, { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.data.success) {
        setData(prev => ({ ...prev, headings: [...prev.headings, res.data.heading] }));
        closeModal();
      }
    } catch {}
  };

  const handleCreateTopic = async () => {
    if (!selectedHeadingId || !formTopic.trim()) return;
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await axios.post('/api/dsa/subheadings', { headingId: selectedHeadingId, name: formTopic }, { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.data.success) {
        setData(prev => ({
          ...prev,
          headings: prev.headings.map(h => h.id === selectedHeadingId ? { ...h, subheadings: [...h.subheadings, res.data.subheading] } : h)
        }));
        closeModal();
      }
    } catch {}
  };

  const handleCreateQuestion = async () => {
    if (!qForm.name.trim()) return;
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await axios.post('/api/dsa/questions', qForm, { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.data.success) {
        // Optimistic update logic simplified for brevity
        loadData(); 
        closeModal();
      }
    } catch {}
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    const token = await auth.currentUser?.getIdToken();
    try {
      if (modalType === 'editHeading') {
        await axios.put(`/api/dsa/headings/${editingId}`, { name: formHeading }, { headers: { 'Authorization': `Bearer ${token}` } });
      } else if (modalType === 'editTopic') {
        await axios.put(`/api/dsa/subheadings/${editingId}`, { name: formTopic }, { headers: { 'Authorization': `Bearer ${token}` } });
      } else if (modalType === 'editQuestion') {
        await axios.put(`/api/dsa/questions/${editingId}`, qForm, { headers: { 'Authorization': `Bearer ${token}` } });
      }
      loadData(); // Reload for simplicity
      closeModal();
    } catch {}
  };

  const handleDelete = async (type: 'heading' | 'question', id: string) => {
    if (!confirm('Are you sure? This cannot be undone.')) return;
    try {
      const token = await auth.currentUser?.getIdToken();
      const endpoint = type === 'heading' ? `/api/dsa/headings/${id}` : `/api/dsa/questions/${id}`;
      await axios.delete(endpoint, { headers: { 'Authorization': `Bearer ${token}` } });
      loadData();
    } catch {}
  };

  // --- HELPERS ---

  const openCreateModal = (type: 'createHeading' | 'createTopic' | 'createQuestion', preSelectHeadingId?: string) => {
    resetForms();
    if (preSelectHeadingId) setSelectedHeadingId(preSelectHeadingId);
    setModalType(type);
  };

  const openEditModal = (type: 'editHeading' | 'editTopic' | 'editQuestion', item: any) => {
    resetForms();
    setEditingId(item.id);
    setModalType(type);
    if (type === 'editHeading') setFormHeading(item.name);
    if (type === 'editTopic') setFormTopic(item.name);
    if (type === 'editQuestion') {
      setQForm({
        headingId: item.headingId,
        subheadingId: item.subheadingId,
        name: item.name,
        article: item.article,
        difficulty: item.difficulty,
        youtubeLink: item.youtubeLink || '',
        questionLink: item.questionLink || ''
      });
    }
  };

  const closeModal = () => {
    setModalType(null);
    setEditingId(null);
  };

  const resetForms = () => {
    setFormHeading('');
    setFormTopic('');
    setSelectedHeadingId('');
    setQForm({ headingId: '', subheadingId: '', name: '', article: '', difficulty: 'Easy', youtubeLink: '', questionLink: '' });
  };

  // --- RENDERERS ---

  const renderOverview = () => (
    <>
      <div className="grid-3">
        <div className="stat-card">
          <div className="stat-card-value">{data.headings.length}</div>
          <div className="stat-card-label">Modules / Headings</div>
      </div>
        <div className="stat-card">
          <div className="stat-card-value">{data.headings.reduce((acc, h) => acc + h.subheadings.length, 0)}</div>
          <div className="stat-card-label">Topics</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-value">{data.headings.reduce((acc, h) => acc + h.subheadings.reduce((a, s) => a + s.questions.length, 0), 0)}</div>
          <div className="stat-card-label">Total Questions</div>
          </div>
        </div>

      <div className="card" style={{ marginTop: '32px' }}>
        <div className="card-header">
          <div className="card-title">Quick Actions</div>
          </div>
        <div className="card-body" style={{ display: 'flex', gap: '16px' }}>
          <button className="btn btn-primary" onClick={() => openCreateModal('createHeading')}>+ New Heading</button>
          <button className="btn btn-outline" onClick={() => openCreateModal('createTopic')}>+ New Topic</button>
          <button className="btn btn-outline" onClick={() => openCreateModal('createQuestion')}>+ New Question</button>
          </div>
        </div>
    </>
  );

  const renderHeadings = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h2 className="card-title" style={{ fontSize: '1.25rem' }}>Structure Management</h2>
        <button className="btn btn-primary" onClick={() => openCreateModal('createHeading')}>+ Add Heading</button>
      </div>
      
              {data.headings.map(heading => (
        <div key={heading.id} className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: '700' }}>{heading.name}</span>
              <span className="badge" style={{ background: 'var(--slate-100)', color: 'var(--slate-600)' }}>{heading.subheadings.length} Topics</span>
          </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-ghost btn-sm" onClick={() => openEditModal('editHeading', heading)}>Edit</button>
              <button className="btn btn-ghost btn-sm danger" onClick={() => handleDelete('heading', heading.id)}>Delete</button>
            </div>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {heading.subheadings.map(sub => (
                <div key={sub.id} className="topic-tag">
                  {sub.name}
          <button
                    style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0, color: 'inherit', opacity: 0.5 }}
                    onClick={() => openEditModal('editTopic', sub)}
                  >✎</button>
        </div>
              ))}
              <button className="btn btn-ghost btn-sm" onClick={() => openCreateModal('createTopic', heading.id)}>+ Add Topic</button>
            </div>
          </div>
        </div>
      ))}
      {data.headings.length === 0 && <div className="empty-state">No content found. Start by creating a Heading.</div>}
    </div>
  );

  const renderQuestions = () => {
    // Flatten data for the table view
    const flatQuestions = data.headings.flatMap(h => 
      h.subheadings.flatMap(s => 
        s.questions.map(q => ({ ...q, headingName: h.name, topicName: s.name, headingId: h.id, subheadingId: s.id }))
      )
    );

    return (
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Question Bank</h2>
          <button className="btn btn-primary" onClick={() => openCreateModal('createQuestion')}>+ Add Question</button>
            </div>
        <div className="card-body">
          {flatQuestions.length === 0 ? (
            <div className="empty-state">No questions available.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {flatQuestions.map(q => (
                <div key={q.id} className="question-row">
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '4px' }}>{q.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                      {q.headingName} <span style={{ margin: '0 4px' }}>/</span> {q.topicName}
                    </div>
                      </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span className={`badge badge-${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
                    <button className="btn btn-ghost btn-sm" onClick={() => openEditModal('editQuestion', q)}>Edit</button>
                    <button className="btn btn-ghost btn-sm danger" onClick={() => handleDelete('question', q.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
                  )}
                </div>
      </div>
    );
  };

  // --- MODAL CONTENT RENDERER ---
  const renderModalContent = () => {
    if (!modalType) return null;
    const isEditing = modalType.startsWith('edit');
    const title = modalType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

    return (
      <div className="modal-backdrop" onClick={closeModal}>
        <div className="modal-panel" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <div className="modal-title">{title}</div>
            <button className="btn btn-ghost" onClick={closeModal} style={{ fontSize: '1.2rem', padding: '4px 10px' }}>×</button>
                    </div>
          <div className="modal-body">
            
            {/* HEADING FORM */}
            {(modalType === 'createHeading' || modalType === 'editHeading') && (
              <div className="form-group">
                <label className="form-label">Module Name</label>
                <input className="form-control" autoFocus value={formHeading} onChange={e => setFormHeading(e.target.value)} placeholder="e.g. Arrays & Hashing" />
                            </div>
            )}

            {/* TOPIC FORM */}
            {(modalType === 'createTopic' || modalType === 'editTopic') && (
              <>
                {!isEditing && (
                  <div className="form-group">
                    <label className="form-label">Parent Module</label>
                    <select className="form-control" value={selectedHeadingId} onChange={e => setSelectedHeadingId(e.target.value)}>
                      <option value="">Select a Module...</option>
                      {data.headings.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                    </select>
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label">Topic Name</label>
                  <input className="form-control" value={formTopic} onChange={e => setFormTopic(e.target.value)} placeholder="e.g. Sliding Window" />
                              </div>
                            </>
                          )}

            {/* QUESTION FORM */}
            {(modalType === 'createQuestion' || modalType === 'editQuestion') && (
              <>
                <div className="form-group">
                  <label className="form-label">Question Title</label>
                  <input className="form-control" value={qForm.name} onChange={e => setQForm({...qForm, name: e.target.value})} placeholder="e.g. Two Sum" />
                        </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Module</label>
                    <select className="form-control" value={qForm.headingId} onChange={e => setQForm({...qForm, headingId: e.target.value, subheadingId: ''})}>
                      <option value="">Select...</option>
                      {data.headings.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                    </select>
                            </div>
                  <div className="form-group">
                    <label className="form-label">Topic</label>
                    <select className="form-control" value={qForm.subheadingId} onChange={e => setQForm({...qForm, subheadingId: e.target.value})} disabled={!qForm.headingId}>
                      <option value="">Select...</option>
                      {data.headings.find(h => h.id === qForm.headingId)?.subheadings.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                                      </select>
                                    </div>
                                    </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" value={qForm.article} onChange={e => setQForm({...qForm, article: e.target.value})} placeholder="Problem description..." />
                                  </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Difficulty</label>
                    <select className="form-control" value={qForm.difficulty} onChange={e => setQForm({...qForm, difficulty: e.target.value as any})}>
                      <option>Easy</option><option>Medium</option><option>Hard</option>
                    </select>
                                      </div>
                  <div className="form-group">
                    <label className="form-label">YouTube Link</label>
                    <input className="form-control" value={qForm.youtubeLink} onChange={e => setQForm({...qForm, youtubeLink: e.target.value})} placeholder="https://..." />
                                    </div>
                                    </div>

                <div className="form-group">
                  <label className="form-label">Question Link</label>
                  <input className="form-control" value={qForm.questionLink || ''} onChange={e => setQForm({...qForm, questionLink: e.target.value})} placeholder="https://leetcode.com/problems/... (optional)" />
                                      </div>
              </>
                                    )}

                                  </div>
          <div className="modal-footer">
            <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
            <button className="btn btn-primary" onClick={isEditing ? handleUpdate : (
              modalType === 'createHeading' ? handleCreateHeading : 
              modalType === 'createTopic' ? handleCreateTopic : 
              handleCreateQuestion
            )}>
              {isEditing ? 'Save Changes' : 'Create'}
            </button>
                              </div>
                        </div>
                      </div>
    );
  };

  // --- MAIN RENDER ---
  return (
    <>
      <style>{styles}</style>
      <div className="dashboard-shell">
        
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="brand-header">
            <div className="brand-title">
              <div className="brand-icon"></div>
              <span>AdminConsole</span>
                </div>
              </div>
          <nav className="nav-menu">
            <button className={`nav-item ${activeView === 'overview' ? 'active' : ''}`} onClick={() => setActiveView('overview')}>
              📊 Overview
            </button>
            <button className={`nav-item ${activeView === 'headings' ? 'active' : ''}`} onClick={() => setActiveView('headings')}>
              📂 Modules & Topics
            </button>
            <button className={`nav-item ${activeView === 'questions' ? 'active' : ''}`} onClick={() => setActiveView('questions')}>
              🧩 Question Bank
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="main-wrapper">
          <header className="top-bar">
            <h1 className="page-title">
              {activeView === 'overview' ? 'Dashboard' : 
               activeView === 'headings' ? 'Content Structure' : 'Question Bank'}
            </h1>
            <div className="header-stats">
              <div className="stat-badge">
                <span className="stat-number">{data.headings.length}</span>
                <span className="stat-label">Modules</span>
        </div>
              <div className="stat-badge" style={{ marginLeft: '24px' }}>
                <span className="stat-number">{data.headings.reduce((acc, h) => acc + h.subheadings.length, 0)}</span>
                <span className="stat-label">Topics</span>
      </div>
    </div>
          </header>

          <main className="content-canvas">
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
                <div className="loading-spinner"></div>
              </div>
            ) : error ? (
              <div className="empty-state" style={{ color: 'var(--danger-text)' }}>{error}</div>
            ) : (
              <>
                {activeView === 'overview' && renderOverview()}
                {activeView === 'headings' && renderHeadings()}
                {activeView === 'questions' && renderQuestions()}
              </>
            )}
          </main>
        </div>
      </div>

      {renderModalContent()}
    </>
  );
};

export default DSAManagement;
