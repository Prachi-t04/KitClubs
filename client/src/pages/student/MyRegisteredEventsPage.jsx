import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Calendar, Clock, MapPin, CheckCircle2 } from 'lucide-react';

export const MyRegisteredEventsPage = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        setLoading(true);
        const res = await api.get('/event-registrations/my');
        if (res.data.success) {
          setRegistrations(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch event registrations:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRegistrations();
  }, []);

  return (
    <div className="space-y-6 py-6 max-w-4xl mx-auto">
      <div>
        <h1 className="font-heading text-2xl font-extrabold text-slate-900">My Registered Events</h1>
        <p className="text-xs text-slate-500">Track all workshops, competitions, and seminars you are participating in</p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading registrations...</div>
      ) : registrations.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-2">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-heading text-lg font-bold text-slate-800">No Event Registrations</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You haven't registered for any events yet. Explore clubs to find upcoming workshops and seminars!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {registrations.map((reg) => (
            <div key={reg._id} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                  {reg.event?.eventType || 'Event'}
                </span>
                <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" /> Confirmed
                </span>
              </div>

              <div>
                <h3 className="font-heading font-bold text-base text-slate-900">{reg.event?.name}</h3>
                <p className="text-xs text-brand-700 font-semibold mt-0.5">{reg.event?.club?.name}</p>
              </div>

              <div className="space-y-1 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                  <span>{new Date(reg.event?.date).toLocaleDateString()} • {reg.event?.startTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span className="truncate">{reg.event?.venue}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
