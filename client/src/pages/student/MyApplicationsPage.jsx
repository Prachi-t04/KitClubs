import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { Send, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export const MyApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        setLoading(true);
        const res = await api.get('/applications/my');
        if (res.data.success) {
          setApplications(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch applications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  return (
    <div className="space-y-6 py-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-slate-900">My Club Applications</h1>
          <p className="text-xs text-slate-500">Track the status of your submitted recruitment applications</p>
        </div>
        <Link to="/clubs" className="px-4 py-2 bg-brand-700 text-white rounded-lg text-xs font-semibold hover:bg-brand-800">
          Apply to More Clubs
        </Link>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading your applications...</div>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
          <Send className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-heading text-lg font-bold text-slate-800">No Applications Submitted</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You haven't applied to any club recruitment cycles yet. Browse active clubs to apply!
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="divide-y divide-slate-100">
            {applications.map((app) => (
              <div key={app._id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-700 text-white font-bold flex items-center justify-center text-lg shrink-0">
                    {app.club?.name?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-sm text-slate-900">{app.club?.name}</h3>
                    <p className="text-xs text-slate-600">{app.recruitment?.title}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Submitted on: {new Date(app.submittedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-start sm:self-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                      app.status === 'Accepted'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : app.status === 'Rejected'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {app.status === 'Accepted' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {app.status === 'Rejected' && <XCircle className="w-3.5 h-3.5" />}
                    {app.status === 'Pending' && <Clock className="w-3.5 h-3.5" />}
                    Status: {app.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
