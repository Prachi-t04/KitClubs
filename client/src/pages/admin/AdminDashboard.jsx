import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { ShieldCheck, Plus, UserPlus, Trash2, RotateCcw, CheckCircle2, AlertCircle, Building } from 'lucide-react';

export const AdminDashboard = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const fetchClubs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/clubs/admin/all');
      if (res.data.success) {
        setClubs(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  const handleSoftDelete = async (clubId, clubName) => {
    if (!window.confirm(`Are you sure you want to remove '${clubName}'? It will be soft-deleted and can be restored anytime.`)) {
      return;
    }
    try {
      setMsg({ type: '', text: '' });
      const res = await api.delete(`/clubs/${clubId}`);
      if (res.data.success) {
        setMsg({ type: 'success', text: `Club '${clubName}' removed (soft deleted).` });
        fetchClubs();
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Soft delete failed.' });
    }
  };

  const handleRestore = async (clubId, clubName) => {
    try {
      setMsg({ type: '', text: '' });
      const res = await api.put(`/clubs/${clubId}/restore`);
      if (res.data.success) {
        setMsg({ type: 'success', text: `Club '${clubName}' restored successfully!` });
        fetchClubs();
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Restore failed.' });
    }
  };

  const activeClubs = clubs.filter((c) => c.isActive);
  const removedClubs = clubs.filter((c) => !c.isActive);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-700"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-6 max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-300 text-xs font-extrabold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-purple-400" /> College Administrator Console
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">KIT Club Directory Management</h1>
          <p className="text-xs text-purple-100 mt-1">Total Active Clubs: <span className="font-bold text-amber-300">{activeClubs.length}</span></p>
        </div>

        <Link
          to="/admin/clubs/new"
          className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold rounded-xl text-xs shadow-md transition-all shrink-0 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add New Club
        </Link>
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

      {/* Active Clubs Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h2 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
          <Building className="w-5 h-5 text-purple-600" /> Active College Clubs ({activeClubs.length})
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 font-heading text-slate-700 uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Club Name</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Current Club Head</th>
                <th className="p-3.5">Faculty Coordinator</th>
                <th className="p-3.5 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {activeClubs.map((c) => (
                <tr key={c._id} className="hover:bg-slate-50">
                  <td className="p-3.5 font-bold text-slate-900">{c.name}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                      {c.category}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className="font-bold text-slate-900 block">{c.clubHead?.name}</span>
                    <span className="text-[10px] text-slate-400">{c.clubHead?.email}</span>
                  </td>
                  <td className="p-3.5 text-slate-600">{c.facultyCoordinator || 'N/A'}</td>
                  <td className="p-3.5 text-right space-x-2">
                    <Link
                      to={`/admin/clubs/${c._id}/assign-head`}
                      className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 rounded font-bold inline-flex items-center gap-1"
                    >
                      <UserPlus className="w-3.5 h-3.5" /> Reassign Head
                    </Link>

                    <button
                      onClick={() => handleSoftDelete(c._id, c.name)}
                      className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded font-bold inline-flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Removed / Soft-Deleted Clubs Section */}
      {removedClubs.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 className="font-heading font-bold text-base text-rose-700 flex items-center gap-2">
            <Trash2 className="w-5 h-5" /> Soft-Deleted / Removed Clubs ({removedClubs.length})
          </h2>

          <div className="divide-y divide-slate-100">
            {removedClubs.map((rc) => (
              <div key={rc._id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-800">{rc.name} ({rc.category})</p>
                  <p className="text-[10px] text-slate-400">
                    Removed At: {rc.removedAt ? new Date(rc.removedAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <button
                  onClick={() => handleRestore(rc._id, rc.name)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg inline-flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Restore Club
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
