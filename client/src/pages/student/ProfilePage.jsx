import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { User, Phone, BookOpen, Hash, Mail, FileText, Sparkles, CheckCircle2, AlertCircle, Save, ShieldCheck } from 'lucide-react';

export const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    branch: user?.branch || 'CSE',
    year: user?.year || 1,
    division: user?.division || 'A',
    bio: user?.bio || '',
    skills: Array.isArray(user?.skills) ? user.skills.join(', ') : '',
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });

    try {
      setLoading(true);
      const res = await api.put('/users/profile', {
        name: formData.name,
        phone: formData.phone,
        branch: formData.branch,
        year: Number(formData.year),
        division: formData.division,
        bio: formData.bio,
        skills: formData.skills ? formData.skills.split(',').map((s) => s.trim()) : [],
      });

      if (res.data.success) {
        updateUser(res.data.data);
        setMsg({ type: 'success', text: 'Profile updated successfully! Redirecting...' });
        setTimeout(() => {
          if (user?.role === 'admin') {
            navigate('/admin');
          } else if (user?.role === 'clubHead') {
            navigate('/club-dashboard');
          } else {
            navigate('/dashboard');
          }
        }, 1500);
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8 space-y-6">
        
        <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-700 to-purple-700 text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
            {user?.name?.charAt(0)}
          </div>
          <div>
            <h1 className="font-heading text-xl font-bold text-slate-900">{user?.name}</h1>
            <p className="text-xs text-slate-500">Student Profile Management</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-100 text-blue-800 uppercase">
                {user?.role}
              </span>
              {user?.isEmailVerified && (
                <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Email Verified
                </span>
              )}
            </div>
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

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Protected Fields Disclaimer */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
            <span className="font-bold text-slate-700 block">Protected Academic Credentials (Non-Editable):</span>
            <div className="grid grid-cols-2 gap-4 text-slate-600">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase">PRN</span>
                <span className="font-mono font-bold text-slate-800">{user?.prn}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Verified Email</span>
                <span className="font-medium text-slate-800">{user?.email}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Branch</label>
              <select
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                className="w-full px-2.5 py-2 text-xs rounded-lg border border-slate-300 bg-white"
              >
                <option value="CSE">CSE</option>
                <option value="ENTC">ENTC</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Civil">Civil</option>
                <option value="Electrical">Electrical</option>
                <option value="Biotech">Biotech</option>
                <option value="AIDS">AIDS</option>
                <option value="AIML">AIML</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Year</label>
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full px-2.5 py-2 text-xs rounded-lg border border-slate-300 bg-white"
              >
                <option value={1}>1st Year</option>
                <option value={2}>2nd Year</option>
                <option value={3}>3rd Year</option>
                <option value={4}>4th Year</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Division</label>
              <input
                type="text"
                name="division"
                value={formData.division}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Bio / About Me</label>
            <textarea
              rows={3}
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell clubs about your interests, passions, and goals..."
              className="w-full p-3 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Skills (Comma Separated)</label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="Python, Public Speaking, Graphic Design, Web Development"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-700"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="py-2.5 px-6 bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs rounded-lg shadow-md transition-all inline-flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> Save Profile Changes
          </button>

        </form>

      </div>
    </div>
  );
};
