import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import {
  Users,
  Send,
  Calendar,
  Bell,
  ArrowRight,
  Clock,
  MapPin,
  Award,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Sparkles,
} from 'lucide-react';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const { notifications, unreadCount } = useNotifications();

  const [memberships, setMemberships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [memRes, appRes, evtRes] = await Promise.all([
          api.get('/memberships/my'),
          api.get('/applications/my'),
          api.get('/event-registrations/my'),
        ]);

        if (memRes.data.success) setMemberships(memRes.data.data);
        if (appRes.data.success) setApplications(appRes.data.data);
        if (evtRes.data.success) setEvents(evtRes.data.data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const openAppsCount = applications.filter((a) => a.status === 'Pending').length;

  return (
    <div className="space-y-8 pb-12">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-800 to-purple-800 text-white rounded-2xl p-6 sm:p-8 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-blue-200">
            {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-xs text-blue-100 mt-1">
            PRN: <span className="font-mono font-bold text-amber-300">{user?.prn}</span> • {user?.branch} (Year {user?.year})
          </p>
        </div>

        <Link
          to="/clubs"
          className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold rounded-xl text-xs shadow-md transition-all shrink-0 flex items-center gap-1.5"
        >
          Explore More Clubs <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 4 Stat Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-brand-700 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold font-heading text-slate-900 block">{memberships.length}</span>
            <span className="text-xs font-semibold text-slate-500">My Clubs</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Send className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold font-heading text-slate-900 block">{openAppsCount}</span>
            <span className="text-xs font-semibold text-slate-500">Open Applications</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold font-heading text-slate-900 block">{events.length}</span>
            <span className="text-xs font-semibold text-slate-500">Upcoming Events</span>
          </div>
        </div>

        <Link to="/notifications" className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4 hover:border-rose-300 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold font-heading text-slate-900 block">{unreadCount}</span>
            <span className="text-xs font-semibold text-slate-500">Notifications</span>
          </div>
        </Link>


      </div>

      {/* 3-Column Dashboard Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1: My Clubs */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-700" /> My Clubs ({memberships.length})
            </h3>
          </div>

          {loading ? (
            <div className="p-6 text-center text-xs text-slate-400">Loading clubs...</div>
          ) : memberships.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400 space-y-2">
              <p>You haven't joined any clubs yet.</p>
              <Link to="/clubs" className="text-brand-700 font-bold hover:underline block">
                Discover Clubs & Apply →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {memberships.map((m) => (
                <div key={m._id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-brand-700 text-white font-bold flex items-center justify-center text-sm shrink-0">
                      {m.club?.name?.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{m.club?.name}</h4>
                      <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100 px-1.5 py-0.2 rounded">Active Member</span>
                    </div>
                  </div>

                  <Link to={`/clubs/${m.club?._id}`} className="text-xs text-brand-700 font-bold hover:underline">
                    View
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Column 2: My Applications */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
              <Send className="w-4 h-4 text-amber-600" /> My Applications
            </h3>
            <Link to="/my-applications" className="text-xs text-brand-700 font-semibold hover:underline">
              View All
            </Link>
          </div>

          {loading ? (
            <div className="p-6 text-center text-xs text-slate-400">Loading applications...</div>
          ) : applications.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">No applications submitted yet.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {applications.slice(0, 4).map((app) => (
                <div key={app._id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-800">{app.club?.name}</p>
                    <p className="text-[10px] text-slate-400">
                      Submitted: {new Date(app.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      app.status === 'Accepted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : app.status === 'Rejected'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Column 3: Upcoming Registered Events */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-600" /> Registered Events
            </h3>
            <Link to="/my-events" className="text-xs text-brand-700 font-semibold hover:underline">
              View All
            </Link>
          </div>

          {loading ? (
            <div className="p-6 text-center text-xs text-slate-400">Loading events...</div>
          ) : events.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">No event registrations found.</div>
          ) : (
            <div className="space-y-3">
              {events.slice(0, 3).map((reg) => (
                <div key={reg._id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{reg.event?.name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                      Confirmed
                    </span>
                  </div>
                  <p className="text-[11px] text-brand-700 font-semibold">{reg.event?.club?.name}</p>
                  <div className="text-[10px] text-slate-500 flex items-center gap-2 pt-0.5">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(reg.event?.date).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {reg.event?.venue}</span>
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
