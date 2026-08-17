import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { Send, CheckCircle2, XCircle, Clock, Eye, ArrowLeft, X, Filter } from 'lucide-react';

export const ReviewApplicationsPage = () => {
  const { user } = useAuth();
  const [clubId, setClubId] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchApps = async () => {
      try {
        setLoading(true);
        const res = await api.get('/clubs');
        if (res.data.success) {
          const myClub = res.data.data.find(
            (c) => c.clubHead?._id === user._id || c.clubHead === user._id
          );
          if (myClub) {
            setClubId(myClub._id);
            const appRes = await api.get(`/applications/club/${myClub._id}`);
            if (appRes.data.success) setApplications(appRes.data.data);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, [user]);

  const handleReview = async (appId, status) => {
    try {
      setMsg({ type: '', text: '' });
      const res = await api.put(`/applications/${appId}/review`, { status });
      if (res.data.success) {
        setMsg({ type: 'success', text: `Application ${status.toLowerCase()}!` });
        setApplications((prev) =>
          prev.map((a) => (a._id === appId ? { ...a, status } : a))
        );
        if (selectedApp && selectedApp._id === appId) {
          setSelectedApp({ ...selectedApp, status });
        }
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Review action failed.' });
    }
  };

  const filteredApps = applications.filter((a) => {
    if (statusFilter === 'All') return true;
    return a.status === statusFilter;
  });

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-700"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-6 max-w-6xl mx-auto">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link to="/club-dashboard" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-brand-700 mb-1">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <h1 className="font-heading text-2xl font-extrabold text-slate-900">Review Applicant Applications</h1>
          <p className="text-xs text-slate-500">Evaluate responses and accept or reject candidates</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-xs self-start sm:self-auto">
          {['All', 'Pending', 'Accepted', 'Rejected'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                statusFilter === st ? 'bg-brand-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
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

      {/* Applications Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredApps.length === 0 ? (
          <p className="p-12 text-center text-xs text-slate-400">No applications match the selected status.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-heading text-slate-700 uppercase tracking-wider">
                <tr>
                  <th className="p-4">Student Name</th>
                  <th className="p-4">PRN</th>
                  <th className="p-4">Branch & Year</th>
                  <th className="p-4">Submitted Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {filteredApps.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50">
                    <td className="p-4 font-bold text-slate-900">{app.student?.name}</td>
                    <td className="p-4 font-mono">{app.student?.prn}</td>
                    <td className="p-4">{app.student?.branch} • Year {app.student?.year}</td>
                    <td className="p-4 text-slate-500">{new Date(app.submittedAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          app.status === 'Accepted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : app.status === 'Rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-bold inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Answers
                      </button>

                      {app.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleReview(app._id, 'Accepted')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleReview(app._id, 'Rejected')}
                            className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded font-bold"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Answers Preview Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-heading text-base font-bold text-slate-900">Application Details — {selectedApp.student?.name}</h3>
                <p className="text-xs text-slate-500">PRN: {selectedApp.student?.prn} • {selectedApp.student?.email}</p>
              </div>
              <button onClick={() => setSelectedApp(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="font-bold text-slate-700 block">Student Bio & Skills:</span>
                <p className="text-slate-600">{selectedApp.student?.bio || 'No bio provided.'}</p>
                {selectedApp.student?.skills && selectedApp.student.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {selectedApp.student.skills.map((s, i) => (
                      <span key={i} className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-[10px] font-bold">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <span className="font-bold text-slate-900 text-sm block">Question Answers:</span>
                {selectedApp.answers?.map((ans, idx) => (
                  <div key={idx} className="p-3.5 border border-slate-200 rounded-xl space-y-1.5">
                    <p className="font-bold text-slate-800">Q{idx + 1}. {ans.questionText}</p>
                    <p className="text-slate-600 bg-slate-50 p-2.5 rounded-lg whitespace-pre-line leading-relaxed">{ans.answerText}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Status: {selectedApp.status}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleReview(selectedApp._id, 'Accepted')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg"
                >
                  Accept Applicant
                </button>
                <button
                  onClick={() => handleReview(selectedApp._id, 'Rejected')}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg"
                >
                  Reject Applicant
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
