import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { Send, AlertCircle, CheckCircle2, ArrowLeft, HelpCircle } from 'lucide-react';

export const ApplicationFormPage = () => {
  const { id: clubId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [club, setClub] = useState(null);
  const [recruitment, setRecruitment] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const clubRes = await api.get(`/clubs/${clubId}`);
        if (clubRes.data.success) {
          const clubData = clubRes.data.data;
          setClub(clubData);

          if (clubData.activeRecruitment) {
            setRecruitment(clubData.activeRecruitment);
            // Initialize answer dictionary
            const initial = {};
            clubData.activeRecruitment.questions?.forEach((q) => {
              initial[q.questionText] = '';
            });
            setAnswers(initial);
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load recruitment form');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [clubId]);

  const handleAnswerChange = (qText, val) => {
    setAnswers({ ...answers, [qText]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Format answers array
    const formattedAnswers = Object.entries(answers).map(([qText, aText]) => ({
      questionText: qText,
      answerText: aText.trim(),
    }));

    // Check required answers
    for (const a of formattedAnswers) {
      if (!a.answerText) {
        setError(`Please answer all questions before submitting.`);
        return;
      }
    }

    try {
      setSubmitting(true);
      const res = await api.post('/applications', {
        recruitmentId: recruitment._id,
        answers: formattedAnswers,
      });

      if (res.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/my-applications');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-700"></div>
      </div>
    );
  }

  if (!recruitment || !club) {
    return (
      <div className="max-w-xl mx-auto my-12 bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
        <h3 className="font-heading text-lg font-bold text-slate-800">Recruitment Closed</h3>
        <p className="text-xs text-slate-500">There is no active recruitment cycle for this club at the moment.</p>
        <Link to={`/clubs/${clubId}`} className="inline-block px-4 py-2 bg-brand-700 text-white text-xs font-semibold rounded-lg">
          Back to Club Profile
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      
      <Link to={`/clubs/${clubId}`} className="inline-flex items-center gap-1.5 text-xs text-slate-600 font-semibold hover:text-brand-700">
        <ArrowLeft className="w-4 h-4" /> Back to {club.name}
      </Link>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="border-b border-slate-100 pb-4 flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-brand-700 text-white font-extrabold text-2xl flex items-center justify-center shrink-0">
            {club.name.charAt(0)}
          </div>
          <div>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800 uppercase">
              Recruitment Application
            </span>
            <h1 className="font-heading text-xl font-bold text-slate-900 mt-1">{recruitment.title}</h1>
            <p className="text-xs text-slate-500">{club.name} • Application Form</p>
          </div>
        </div>

        {/* User Info Bar */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Applicant</span>
            <span className="font-bold text-slate-800">{user?.name}</span> ({user?.branch} • Year {user?.year})
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">PRN</span>
            <span className="font-mono font-semibold text-slate-700">{user?.prn}</span>
          </div>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-800 text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
            <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />
            <h3 className="font-heading text-xl font-bold text-emerald-900">Application Submitted!</h3>
            <p className="text-xs text-emerald-800">
              Your application has been received by the Club Head of {club.name}. Redirecting to your applications dashboard...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-5">
              <h3 className="font-heading font-bold text-sm text-slate-800 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-brand-700" /> Club Specific Questions
              </h3>

              {recruitment.questions?.map((q, idx) => (
                <div key={idx} className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    Q{idx + 1}. {q.questionText} {q.isRequired && <span className="text-rose-500">*</span>}
                  </label>
                  <textarea
                    rows={3}
                    value={answers[q.questionText] || ''}
                    onChange={(e) => handleAnswerChange(q.questionText, e.target.value)}
                    placeholder="Write your answer here..."
                    required={q.isRequired}
                    className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-700 focus:border-transparent"
                  />
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Application Now'} <Send className="w-4 h-4" />
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
