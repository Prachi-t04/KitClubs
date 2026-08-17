import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import { UserPlus, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';

export const AssignClubHeadPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [club, setClub] = useState(null);
  const [newClubHeadId, setNewClubHeadId] = useState('');
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [clubRes, usersRes] = await Promise.all([
          api.get(`/clubs/${id}`),
          api.get('/users'),
        ]);

        if (clubRes.data.success) setClub(clubRes.data.data);
        if (usersRes.data.success) setUsersList(usersRes.data.data);
      } catch (err) {
        setError('Failed to load details.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!newClubHeadId) {
      setError('Please select a student from the dropdown.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.put(`/clubs/${id}/head`, { newClubHeadId });
      if (res.data.success) {
        navigate('/admin');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Reassignment failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-700"></div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-6 space-y-6">
      <Link to="/admin" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-purple-700">
        <ArrowLeft className="w-4 h-4" /> Back to Admin Console
      </Link>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h1 className="font-heading text-xl font-bold text-slate-900">Reassign Club Head — {club?.name}</h1>
          <p className="text-xs text-slate-500">
            Current Head: <span className="font-bold text-slate-800">{club?.clubHead?.name}</span> ({club?.clubHead?.email})
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-800 text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Select New Club Head Student *</label>
            <select
              value={newClubHeadId}
              onChange={(e) => setNewClubHeadId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium text-slate-900"
              required
            >
              <option value="">-- Choose Registered Student --</option>
              {usersList.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} (PRN: {u.prn} • {u.email})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400 mt-1">
              Note: The selected student will automatically be granted 'clubHead' permissions for this club.
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? 'Reassigning...' : 'Confirm Reassignment'}
          </button>
        </form>
      </div>
    </div>
  );
};
