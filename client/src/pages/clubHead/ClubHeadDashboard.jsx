import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import {
  Award,
  Users,
  Send,
  Calendar,
  UserCheck,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Edit,
  Ban,
  Settings,
  HelpCircle,
} from 'lucide-react';

export const ClubHeadDashboard = () => {
  const { user } = useAuth();
  const [clubs, setClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);
  const [applications, setApplications] = useState([]);
  const [events, setEvents] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchHeadData = async () => {
      try {
        setLoading(true);
        // Find club where user is Club Head
        const res = await api.get('/clubs');
        if (res.data.success) {
          const myClub = res.data.data.find(
            (c) => c.clubHead?._id === user._id || c.clubHead === user._id
          );
          if (myClub) {
            setSelectedClub(myClub);

            const [appRes, evtRes, memRes] = await Promise.all([
              api.get(`/applications/club/${myClub._id}`),
              api.get(`/events/club/${myClub._id}`),
              api.get(`/memberships/club/${myClub._id}`),
            ]);

            if (appRes.data.success) setApplications(appRes.data.data);
            if (evtRes.data.success) setEvents(evtRes.data.data.upcomingEvents || []);
            if (memRes.data.success) setMembers(memRes.data.data.filter((m) => m.status === 'Active'));
          }
        }
      } catch (err) {
        console.error("Club Head Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHeadData();
  }, [user]);

  const handleReviewApp = async (appId, status) => {
    try {
      setActionMsg({ type: '', text: '' });
      const res = await api.put(`/applications/${appId}/review`, { status });
      if (res.data.success) {
        setActionMsg({ type: 'success', text: `Application ${status.toLowerCase()} successfully!` });
        // Refresh apps & members
        setApplications((prev) =>
          prev.map((a) => (a._id === appId ? { ...a, status } : a))
        );
        if (status === 'Accepted' && selectedClub) {
          const memRes = await api.get(`/memberships/club/${selectedClub._id}`);
          if (memRes.data.success) setMembers(memRes.data.data.filter((m) => m.status === 'Active'));
        }
      }
    } catch (err) {
      setActionMsg({ type: 'error', text: err.response?.data?.message || 'Review action failed.' });
    }
  };

  const handleCancelEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to cancel this event? All registered students will receive an in-app notification.")) {
      return;
    }
    try {
      setActionMsg({ type: '', text: '' });
      const res = await api.put(`/events/${eventId}/cancel`);
      if (res.data.success) {
        setActionMsg({ type: 'success', text: 'Event cancelled. Registrants notified.' });
        setEvents((prev) => prev.map((e) => (e._id === eventId ? { ...e, status: 'Cancelled' } : e)));
      }
    } catch (err) {
      setActionMsg({ type: 'error', text: err.response?.data?.message || 'Cancel failed.' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (!selectedClub) {
    return (
      <div className="max-w-xl mx-auto my-12 bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-4">
        <Award className="w-12 h-12 text-amber-500 mx-auto" />
        <h3 className="font-heading text-lg font-bold text-slate-800">No Assigned Club</h3>
        <p className="text-xs text-slate-500">You are currently logged in as a Club Head, but no active club is assigned to your account.</p>
        <Link to="/dashboard" className="inline-block px-4 py-2 bg-brand-700 text-white text-xs font-semibold rounded-lg">
          Go to Student Dashboard
        </Link>
      </div>
    );
  }

  const pendingApps = applications.filter((a) => a.status === 'Pending');

  return (
    <div className="space-y-8 pb-12">
      
      {/* Club Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-brand-900 to-amber-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-400 text-slate-900 font-extrabold text-2xl flex items-center justify-center shadow-md shrink-0">
              {selectedClub.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-amber-400 text-slate-900 uppercase">
                  {selectedClub.category}
                </span>
                <span className="text-xs text-slate-300">Club Head Console</span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white mt-1">{selectedClub.name}</h1>
              <p className="text-xs text-slate-300">Head: <span className="font-bold text-amber-300">{user?.name}</span> ({user?.email})</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/club-dashboard/profile"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-xs backdrop-blur border border-white/10 flex items-center gap-1.5"
            >
              <Settings className="w-4 h-4" /> Edit Club Profile
            </Link>
          </div>

        </div>
      </div>

      {actionMsg.text && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
            actionMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{actionMsg.text}</span>
        </div>
      )}

      {/* 4 Large Action Hub Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <Link
          to="/club-dashboard/recruitment"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm card-hover flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500">Recruitment</span>
            <h4 className="font-heading font-bold text-sm text-slate-900 group-hover:text-brand-700">Manage Cycle</h4>
            <p className="text-[11px] text-slate-400">Status: {selectedClub.recruitmentStatus}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
        </Link>

        <Link
          to="/club-dashboard/applications"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm card-hover flex items-center justify-between group"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Applications</span>
              {pendingApps.length > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full animate-pulse">
                  {pendingApps.length} pending
                </span>
              )}
            </div>
            <h4 className="font-heading font-bold text-sm text-slate-900 group-hover:text-brand-700">Review Applicants</h4>
            <p className="text-[11px] text-slate-400">{applications.length} total received</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <Send className="w-5 h-5" />
          </div>
        </Link>

        <Link
          to="/club-dashboard/members"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm card-hover flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500">Membership</span>
            <h4 className="font-heading font-bold text-sm text-slate-900 group-hover:text-brand-700">Manage Members</h4>
            <p className="text-[11px] text-slate-400">{members.length} active members</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-700 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </Link>

        <Link
          to="/club-dashboard/events/new"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm card-hover flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500">Events</span>
            <h4 className="font-heading font-bold text-sm text-slate-900 group-hover:text-brand-700">+ Create Event</h4>
            <p className="text-[11px] text-slate-400">{events.length} upcoming events</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
        </Link>

      </div>

      {/* 2-Column Dashboard Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Recent Applications */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
              <Send className="w-4 h-4 text-brand-700" /> Recent Applications ({applications.length})
            </h3>
            <Link to="/club-dashboard/applications" className="text-xs text-brand-700 font-semibold hover:underline">
              View All Table
            </Link>
          </div>

          {applications.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-6 text-center">No applications received yet for this club.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {applications.slice(0, 5).map((app) => (
                <div key={app._id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <p className="font-bold text-slate-900">{app.student?.name}</p>
                    <p className="text-[11px] text-slate-500">
                      PRN: {app.student?.prn} • {app.student?.branch} (Year {app.student?.year})
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {app.status === 'Pending' ? (
                      <>
                        <button
                          onClick={() => handleReviewApp(app._id, 'Accepted')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold shadow-2xs"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleReviewApp(app._id, 'Rejected')}
                          className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-[11px] font-bold shadow-2xs"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          app.status === 'Accepted' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {app.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Upcoming Events Management */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-600" /> Club Events Management
            </h3>
            <Link to="/club-dashboard/events/new" className="text-xs text-brand-700 font-bold hover:underline flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> Add New Event
            </Link>
          </div>

          {events.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-6 text-center">No upcoming events created.</p>
          ) : (
            <div className="space-y-3">
              {events.map((evt) => (
                <div key={evt._id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900">{evt.name}</h4>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        evt.status === 'Cancelled' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {evt.status}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 flex items-center gap-3">
                    <span>{new Date(evt.date).toLocaleDateString()} • {evt.startTime}</span>
                    <span>Venue: {evt.venue}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-[11px]">
                    <span className="font-medium text-purple-700">
                      Registrations: {evt.registeredCount} {evt.capacity === 'Limited' ? `/ ${evt.maxParticipants}` : ''}
                    </span>

                    {evt.status !== 'Cancelled' && (
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/club-dashboard/events/${evt._id}/edit`}
                          className="text-brand-700 hover:underline flex items-center gap-0.5 font-bold"
                        >
                          <Edit className="w-3 h-3" /> Edit
                        </Link>
                        <button
                          onClick={() => handleCancelEvent(evt._id)}
                          className="text-rose-600 hover:underline flex items-center gap-0.5 font-bold"
                        >
                          <Ban className="w-3 h-3" /> Cancel Event
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
