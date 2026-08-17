import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import { Building, ArrowLeft, CheckCircle2, AlertCircle, Plus, User } from 'lucide-react';

export const AddClubPage = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Technical');
  const [shortDescription, setShortDescription] = useState('');
  const [detailedDescription, setDetailedDescription] = useState('');
  const [facultyCoordinator, setFacultyCoordinator] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [clubHeadId, setClubHeadId] = useState('');
  
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await api.get('/users');
        if (res.data.success) {
          setUsersList(res.data.data);
          if (res.data.data.length > 0) {
            setClubHeadId(res.data.data[0]._id);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !category || !shortDescription || !clubHeadId) {
      setError('Club name, category, short description, and Club Head selection are required.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post('/clubs', {
        name,
        category,
        shortDescription,
        detailedDescription,
        facultyCoordinator,
        contactEmail,
        clubHeadId,
      });

      if (res.data.success) {
        navigate('/admin');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create club.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-6">
      <Link to="/admin" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-purple-700">
        <ArrowLeft className="w-4 h-4" /> Back to Admin Console
      </Link>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h1 className="font-heading text-xl font-bold text-slate-900">Add New College Club</h1>
          <p className="text-xs text-slate-500">Only Admin can create new official clubs for KIT College</p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-800 text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Club Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Artificial Intelligence Association"
              required
              className="w-full px-3 py-2 rounded-lg border border-slate-300"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-2.5 py-2 rounded-lg border border-slate-300 bg-white"
              >
                <option value="Technical">Technical</option>
                <option value="Cultural">Cultural</option>
                <option value="Sports">Sports</option>
                <option value="Social">Social</option>
                <option value="Entrepreneurship">Entrepreneurship</option>
                <option value="Literary">Literary</option>
                <option value="Arts">Arts</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Assigned Club Head Student *</label>
              {loading ? (
                <div className="p-2 text-slate-400 text-xs">Loading registered students...</div>
              ) : (
                <select
                  value={clubHeadId}
                  onChange={(e) => setClubHeadId(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-lg border border-slate-300 bg-white font-medium text-slate-900"
                  required
                >
                  <option value="">-- Select Registered Student --</option>
                  {usersList.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name} (PRN: {u.prn} • {u.email})
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Short Description *</label>
            <textarea
              rows={2}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Brief overview shown on discovery cards..."
              required
              className="w-full p-2.5 rounded-lg border border-slate-300"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Faculty Coordinator Name</label>
              <input
                type="text"
                value={facultyCoordinator}
                onChange={(e) => setFacultyCoordinator(e.target.value)}
                placeholder="Prof. A. B. Patil"
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Official Contact Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="ai@kitkop.edu.in"
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? 'Creating Club...' : 'Create & Publish Club'}
          </button>
        </form>
      </div>
    </div>
  );
};
