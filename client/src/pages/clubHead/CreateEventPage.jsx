import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Plus, ArrowLeft, CheckCircle2, AlertCircle, MapPin, Clock, Users } from 'lucide-react';

export const CreateEventPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [clubId, setClubId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    banner: '',
    date: '',
    startTime: '04:30 PM',
    endTime: '06:30 PM',
    venue: '',
    registrationDeadline: '',
    eventType: 'Workshop',
    eligibility: 'All KIT Students',
    capacity: 'Unlimited',
    maxParticipants: 50,
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClub = async () => {
      try {
        setLoading(true);
        const res = await api.get('/clubs');
        if (res.data.success) {
          const myClub = res.data.data.find(
            (c) => c.clubHead?._id === user._id || c.clubHead === user._id
          );
          if (myClub) setClubId(myClub._id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchClub();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.description || !formData.date || !formData.venue || !formData.registrationDeadline) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post('/events', {
        ...formData,
        clubId,
        maxParticipants: Number(formData.maxParticipants),
      });

      if (res.data.success) {
        navigate('/club-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event.');
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

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6">
      <Link to="/club-dashboard" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-brand-700">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h1 className="font-heading text-xl font-bold text-slate-900">Create New Club Event</h1>
          <p className="text-xs text-slate-500">Configure eligibility, registration capacity limits, date, and venue</p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-800 text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div>
            <label className="block font-bold text-slate-700 mb-1">Event Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Autonomous Robotics Workshop 2026"
              required
              className="w-full px-3 py-2 rounded-lg border border-slate-300"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Event Description *</label>
            <textarea
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the agenda, prerequisites, and learning outcomes..."
              required
              className="w-full p-2.5 rounded-lg border border-slate-300"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Event Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Start Time *</label>
              <input
                type="text"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                placeholder="04:30 PM"
                required
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">End Time *</label>
              <input
                type="text"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                placeholder="06:30 PM"
                required
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Venue / Location *</label>
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                placeholder="e.g. Central Auditorium / Lab 3"
                required
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Registration Deadline *</label>
              <input
                type="date"
                name="registrationDeadline"
                value={formData.registrationDeadline}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Event Type</label>
              <select
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
                className="w-full px-2.5 py-2 rounded-lg border border-slate-300 bg-white"
              >
                <option value="Workshop">Workshop</option>
                <option value="Competition">Competition</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Seminar">Seminar</option>
                <option value="Cultural Performance">Cultural Performance</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Eligibility Rule</label>
              <select
                name="eligibility"
                value={formData.eligibility}
                onChange={handleChange}
                className="w-full px-2.5 py-2 rounded-lg border border-slate-300 bg-white"
              >
                <option value="All KIT Students">All KIT Students</option>
                <option value="Club Members Only">Club Members Only</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Registration Capacity</label>
              <select
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                className="w-full px-2.5 py-2 rounded-lg border border-slate-300 bg-white"
              >
                <option value="Unlimited">Unlimited</option>
                <option value="Limited">Limited</option>
              </select>
            </div>
          </div>

          {formData.capacity === 'Limited' && (
            <div>
              <label className="block font-bold text-slate-700 mb-1">Maximum Participants Limit</label>
              <input
                type="number"
                name="maxParticipants"
                value={formData.maxParticipants}
                onChange={handleChange}
                min={1}
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? 'Creating Event...' : 'Publish Event'}
          </button>

        </form>
      </div>
    </div>
  );
};
