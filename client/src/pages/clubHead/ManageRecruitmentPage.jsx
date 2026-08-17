import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { UserCheck, Plus, Trash2, ArrowLeft, CheckCircle2, AlertCircle, Edit3, HelpCircle, Save, X, ArrowUp, ArrowDown } from 'lucide-react';

export const ManageRecruitmentPage = () => {
  const { user } = useAuth();
  const [clubId, setClubId] = useState(null);
  const [recruitments, setRecruitments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Create / Edit modal states
  const [showForm, setShowForm] = useState(false);
  const [editingCycleId, setEditingCycleId] = useState(null);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [questions, setQuestions] = useState([
    { questionText: 'Why do you want to join this club?', isRequired: true, order: 1 },
    { questionText: 'What skills or past projects can you showcase?', isRequired: true, order: 2 },
  ]);

  const [msg, setMsg] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchRecruitments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/clubs');
      if (res.data.success) {
        const myClub = res.data.data.find(
          (c) => c.clubHead?._id === user._id || c.clubHead === user._id
        );
        if (myClub) {
          setClubId(myClub._id);
          const recRes = await api.get(`/recruitment/club/${myClub._id}`);
          if (recRes.data.success) setRecruitments(recRes.data.data);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruitments();
  }, [user]);

  const openCreateForm = () => {
    setEditingCycleId(null);
    setTitle('');
    setDescription('');
    setDeadline('');
    setQuestions([
      { questionText: 'Why do you want to join this club?', isRequired: true, order: 1 },
      { questionText: 'What relevant skills or past experience do you possess?', isRequired: true, order: 2 },
    ]);
    setShowForm(true);
  };

  const openEditForm = (rec) => {
    setEditingCycleId(rec._id);
    setTitle(rec.title || '');
    setDescription(rec.description || '');
    setDeadline(rec.applicationDeadline ? new Date(rec.applicationDeadline).toISOString().split('T')[0] : '');
    setQuestions(
      rec.questions && rec.questions.length > 0
        ? rec.questions.map((q, idx) => ({
            questionText: q.questionText || '',
            isRequired: q.isRequired !== undefined ? q.isRequired : true,
            order: q.order || idx + 1,
          }))
        : [
            { questionText: 'Why do you want to join this club?', isRequired: true, order: 1 },
          ]
    );
    setShowForm(true);
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: '', isRequired: true, order: questions.length + 1 },
    ]);
  };

  const handleQuestionTextChange = (idx, text) => {
    const updated = [...questions];
    updated[idx].questionText = text;
    setQuestions(updated);
  };

  const handleQuestionRequiredChange = (idx, isReq) => {
    const updated = [...questions];
    updated[idx].isRequired = isReq;
    setQuestions(updated);
  };

  const handleRemoveQuestion = (idx) => {
    if (questions.length === 1) {
      alert('Recruitment cycle must have at least 1 question for applicants.');
      return;
    }
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handleMoveQuestion = (idx, direction) => {
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= questions.length) return;
    const updated = [...questions];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });

    if (!title || !deadline) {
      setMsg({ type: 'error', text: 'Title and application deadline are required.' });
      return;
    }

    const validQuestions = questions
      .filter((q) => q.questionText.trim() !== '')
      .map((q, idx) => ({
        questionText: q.questionText.trim(),
        isRequired: q.isRequired,
        order: idx + 1,
      }));

    if (validQuestions.length === 0) {
      setMsg({ type: 'error', text: 'Please provide at least one non-empty application question.' });
      return;
    }

    try {
      setSubmitting(true);

      if (editingCycleId) {
        // Update existing recruitment cycle
        const res = await api.put(`/recruitment/${editingCycleId}`, {
          title,
          description,
          applicationDeadline: deadline,
          questions: validQuestions,
        });

        if (res.data.success) {
          setMsg({ type: 'success', text: 'Recruitment questions & details updated successfully!' });
          setShowForm(false);
          fetchRecruitments();
        }
      } else {
        // Create new recruitment cycle
        const res = await api.post('/recruitment', {
          clubId,
          title,
          description,
          applicationDeadline: deadline,
          questions: validQuestions,
        });

        if (res.data.success) {
          setMsg({ type: 'success', text: 'Recruitment cycle created & opened!' });
          setShowForm(false);
          fetchRecruitments();
        }
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Action failed.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      setMsg({ type: '', text: '' });
      const res = await api.put(`/recruitment/${id}`, { status });
      if (res.data.success) {
        setMsg({ type: 'success', text: `Recruitment status updated to '${status}'` });
        setRecruitments((prev) =>
          prev.map((r) => (r._id === id ? { ...r, status } : r))
        );
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Status update failed.' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-700"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      
      <div className="flex items-center justify-between">
        <Link to="/club-dashboard" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-brand-700">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <button
          onClick={openCreateForm}
          className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Start New Recruitment Cycle
        </button>
      </div>

      {msg.text && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
            msg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{msg.text}</span>
        </div>
      )}

      {/* Create / Edit Form Modal */}
      {showForm && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xl space-y-5 animate-in fade-in relative">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="font-heading text-lg font-bold text-slate-900">
                {editingCycleId ? 'Edit Recruitment Cycle & Questions' : 'Start New Recruitment Cycle'}
              </h2>
              <p className="text-xs text-slate-500">Customize the application form prompts that candidates must answer</p>
            </div>
            <button onClick={() => setShowForm(false)} className="p-1 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Recruitment Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Autumn Recruitment 2026 — Core Team"
                required
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Description</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Details about available roles, domains, and selection criteria..."
                className="w-full p-2.5 rounded-lg border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Application Deadline *</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>

            {/* Custom Questions Builder */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-brand-700" /> Club-Specific Application Questions ({questions.length})
                  </h3>
                  <p className="text-[11px] text-slate-500">Add, edit, reorder, or delete custom questions for applicants</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 rounded-lg text-xs font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Question
                </button>
              </div>

              <div className="space-y-3 pt-1">
                {questions.map((q, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-slate-700 text-xs">Question #{idx + 1}</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveQuestion(idx, -1)}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === questions.length - 1}
                          onClick={() => handleMoveQuestion(idx, 1)}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(idx)}
                          className="p-1 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded"
                          title="Delete Question"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={q.questionText}
                        onChange={(e) => handleQuestionTextChange(idx, e.target.value)}
                        placeholder={`Question ${idx + 1} prompt...`}
                        required
                        className="flex-1 px-3 py-2 rounded-lg border border-slate-300 bg-white"
                      />
                      <label className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg cursor-pointer shrink-0 text-slate-700">
                        <input
                          type="checkbox"
                          checked={q.isRequired}
                          onChange={(e) => handleQuestionRequiredChange(idx, e.target.checked)}
                          className="rounded text-brand-700"
                        />
                        <span className="text-xs font-semibold">Required</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-lg font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" /> {editingCycleId ? 'Save Question Changes' : 'Open Recruitment Cycle'}
              </button>
            </div>

          </form>
        </div>
      )}

      {/* Recruitment Cycles List */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
        <h2 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-brand-700" /> Recruitment Cycles & Questions Directory
        </h2>

        {recruitments.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-6 text-center">No recruitment cycles created yet.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {recruitments.map((r) => (
              <div key={r._id} className="py-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{r.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{r.description || 'No description provided.'}</p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                      onClick={() => openEditForm(r)}
                      className="px-3 py-1 bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 rounded-lg text-xs font-bold flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit Questions
                    </button>

                    <select
                      value={r.status}
                      onChange={(e) => handleUpdateStatus(r._id, e.target.value)}
                      className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="Open">Open</option>
                      <option value="Closed">Closed</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>

                {/* Display Current Questions Preview */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5 text-xs">
                  <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">
                    Application Questions ({r.questions?.length || 0}):
                  </span>
                  <div className="space-y-1">
                    {r.questions?.map((q, qIdx) => (
                      <div key={qIdx} className="text-slate-700 flex items-start gap-1.5">
                        <span className="font-bold text-slate-500 shrink-0">Q{qIdx + 1}.</span>
                        <span>{q.questionText}</span>
                        {q.isRequired && <span className="text-rose-600 font-bold text-[10px]">*Required</span>}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center gap-4 pt-1">
                  <span>Deadline: {new Date(r.applicationDeadline).toLocaleDateString()}</span>
                  <span>Status: <strong className="text-slate-700">{r.status}</strong></span>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
