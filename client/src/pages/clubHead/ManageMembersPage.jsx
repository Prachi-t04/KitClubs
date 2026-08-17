import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { Users, UserMinus, ArrowLeft, CheckCircle2, AlertCircle, Search } from 'lucide-react';

export const ManageMembersPage = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);
  const [reason, setReason] = useState('');
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const res = await api.get('/clubs');
        if (res.data.success) {
          const myClub = res.data.data.find(
            (c) => c.clubHead?._id === user._id || c.clubHead === user._id
          );
          if (myClub) {
            const memRes = await api.get(`/memberships/club/${myClub._id}`);
            if (memRes.data.success) setMembers(memRes.data.data);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, [user]);

  const handleRemoveMember = async () => {
    if (!selectedMember) return;
    try {
      setMsg({ type: '', text: '' });
      const res = await api.delete(`/memberships/${selectedMember._id}`, {
        data: { removalReason: reason },
      });
      if (res.data.success) {
        setMsg({ type: 'success', text: 'Member removed. Membership record preserved as Removed.' });
        setMembers((prev) =>
          prev.map((m) => (m._id === selectedMember._id ? { ...m, status: 'Removed' } : m))
        );
        setSelectedMember(null);
        setReason('');
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Removal failed.' });
    }
  };

  const filteredMembers = members.filter((m) => {
    const term = searchTerm.toLowerCase();
    return (
      m.student?.name?.toLowerCase().includes(term) ||
      m.student?.prn?.toLowerCase().includes(term) ||
      m.student?.branch?.toLowerCase().includes(term)
    );
  });

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-700"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-6 max-w-5xl mx-auto">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link to="/club-dashboard" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-brand-700 mb-1">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <h1 className="font-heading text-2xl font-extrabold text-slate-900">Manage Club Members</h1>
          <p className="text-xs text-slate-500">View active member directory and handle member removals</p>
        </div>

        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search member name or PRN..."
            className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
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

      {/* Members Directory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredMembers.length === 0 ? (
          <p className="p-12 text-center text-xs text-slate-400">No members found in directory.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-heading text-slate-700 uppercase tracking-wider">
                <tr>
                  <th className="p-4">Student Name</th>
                  <th className="p-4">PRN</th>
                  <th className="p-4">Branch & Year</th>
                  <th className="p-4">Joined Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {filteredMembers.map((m) => (
                  <tr key={m._id} className="hover:bg-slate-50">
                    <td className="p-4 font-bold text-slate-900">{m.student?.name}</td>
                    <td className="p-4 font-mono">{m.student?.prn}</td>
                    <td className="p-4">{m.student?.branch} • Year {m.student?.year}</td>
                    <td className="p-4 text-slate-500">{new Date(m.joinedAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          m.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {m.status === 'Active' && (
                        <button
                          onClick={() => setSelectedMember(m)}
                          className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded border border-rose-200 inline-flex items-center gap-1"
                        >
                          <UserMinus className="w-3.5 h-3.5" /> Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Member Removal Modal */}
      {selectedMember && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="font-heading text-base font-bold text-slate-900">
              Remove {selectedMember.student?.name} from Club?
            </h3>
            <p className="text-xs text-slate-500">
              This will update membership status to 'Removed' and preserve historical logs. The student will be eligible to reapply in future recruitment cycles.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Removal</label>
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Inactivity, requested departure..."
                className="w-full p-2.5 text-xs rounded-xl border border-slate-300"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedMember(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold text-xs rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleRemoveMember}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg"
              >
                Confirm Removal
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
