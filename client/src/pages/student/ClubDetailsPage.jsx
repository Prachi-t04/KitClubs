import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import {
  Calendar,
  UserCheck,
  Mail,
  Instagram,
  Linkedin,
  Globe,
  Award,
  Users,
  CheckCircle2,
  Clock,
  MapPin,
  Send,
  AlertCircle,
  Sparkles,
  Ban,
  ShieldCheck,
  Image as ImageIcon,
} from 'lucide-react';


export const ClubDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('about');
  const [registeringEventId, setRegisteringEventId] = useState(null);
  const [registerMsg, setRegisterMsg] = useState({ type: '', text: '' });
  const [registeredEventIds, setRegisteredEventIds] = useState([]);
  const [confirmingEvent, setConfirmingEvent] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/clubs/${id}`);
        if (res.data.success) {
          setClub(res.data.data);
        }

        if (user) {
          const regRes = await api.get('/event-registrations/my');
          if (regRes.data.success) {
            const ids = regRes.data.data.map((r) => r.event?._id || r.event);
            setRegisteredEventIds(ids);
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load club details');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, user]);

  const initiateRegistration = (evt) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setConfirmingEvent(evt);
  };

  const handleRegisterEvent = async (eventId) => {
    try {
      setRegisteringEventId(eventId);
      setRegisterMsg({ type: '', text: '' });
      const res = await api.post(`/event-registrations/${eventId}`);
      if (res.data.success) {
        setRegisterMsg({ type: 'success', text: res.data.message });
        setRegisteredEventIds((prev) => [...prev, eventId]);
        // Refresh club details to update registeredCount
        const refRes = await api.get(`/clubs/${id}`);
        if (refRes.data.success) setClub(refRes.data.data);
      }
    } catch (err) {
      setRegisterMsg({
        type: 'error',
        text: err.response?.data?.message || 'Event registration failed.',
      });
    } finally {
      setRegisteringEventId(null);
    }
  };



  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-700"></div>
      </div>
    );
  }

  if (error || !club) {
    return (
      <div className="max-w-xl mx-auto my-12 bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="font-heading text-lg font-bold text-slate-800">Club Not Found</h3>
        <p className="text-xs text-slate-500">{error || 'The requested club is not available.'}</p>
        <Link to="/clubs" className="inline-block px-4 py-2 bg-brand-700 text-white text-xs font-semibold rounded-lg">
          Back to Club Discovery
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      
      {/* Club Header Banner */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-purple-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white text-brand-900 font-extrabold text-3xl flex items-center justify-center shadow-lg shrink-0 border-2 border-white/20">
              {club.logo ? (
                <img src={club.logo} alt={club.name} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                club.name.charAt(0)
              )}
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-3 py-0.5 rounded-full text-xs font-extrabold bg-amber-400 text-slate-900 uppercase">
                  {club.category}
                </span>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    club.recruitmentStatus === 'Open' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' : 'bg-white/10 text-slate-300'
                  }`}
                >
                  Recruitment: {club.recruitmentStatus}
                </span>
              </div>
              <h1 className="font-heading text-2xl sm:text-4xl font-extrabold text-white">{club.name}</h1>
              <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">{club.shortDescription}</p>
            </div>
          </div>

          {/* Recruitment CTA Button */}
          {club.activeRecruitment ? (
            <Link
              to={`/clubs/${club._id}/apply`}
              className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold rounded-xl text-sm shadow-lg hover:shadow-xl transition-all shrink-0 flex items-center gap-2"
            >
              <Send className="w-4 h-4" /> Apply for Recruitment
            </Link>
          ) : (
            <button
              disabled
              className="px-5 py-2.5 bg-white/10 text-slate-300 font-medium rounded-xl text-xs shrink-0 cursor-not-allowed border border-white/10"
            >
              Recruitment Closed
            </button>
          )}

        </div>
      </div>

      {registerMsg.text && (
        <div
          className={`p-4 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
            registerMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{registerMsg.text}</span>
        </div>
      )}

      {/* Main Grid: Left Tabs / Content & Right Sidebar Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 cols): Details Tabs */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 bg-white rounded-xl p-1 shadow-xs">
            <button
              onClick={() => setActiveTab('about')}
              className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-colors ${
                activeTab === 'about' ? 'bg-brand-700 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              About & Activities
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-colors ${
                activeTab === 'events' ? 'bg-brand-700 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Events ({club.upcomingEvents?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-colors ${
                activeTab === 'members' ? 'bg-brand-700 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Core Members ({club.coreMembers?.length || 0})
            </button>
          </div>

          {/* TAB 1: ABOUT & ACTIVITIES */}
          {activeTab === 'about' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-6 shadow-sm">
              <div>
                <h3 className="font-heading font-bold text-base text-slate-900 mb-2">Detailed Overview</h3>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                  {club.detailedDescription || club.shortDescription}
                </p>
              </div>

              {club.activities && club.activities.length > 0 && (
                <div>
                  <h3 className="font-heading font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" /> Key Activities & Domains
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {club.activities.map((act, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-brand-600" />
                        {act}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {club.achievements && club.achievements.length > 0 && (
                <div>
                  <h3 className="font-heading font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4 text-purple-600" /> Achievements & Recognitions
                  </h3>
                  <ul className="space-y-2">
                    {club.achievements.map((ach, idx) => (
                      <li key={idx} className="p-3 bg-purple-50/50 border border-purple-100 rounded-xl text-xs text-purple-900 font-medium flex items-center gap-2.5">
                        <Award className="w-4 h-4 text-purple-600 shrink-0" />
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Event Photo Gallery */}
              {club.eventGallery && club.eventGallery.length > 0 && (
                <div>
                  <h3 className="font-heading font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-brand-700" /> Previous Event Photo Gallery
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {club.eventGallery.map((photo, idx) => (
                      <div key={idx} className="group relative rounded-xl overflow-hidden shadow-xs border border-slate-200 aspect-video bg-slate-100">
                        <img src={photo} alt={`Event Photo ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}


          {/* TAB 2: EVENTS (Upcoming + Past + Cancelled) */}
          {activeTab === 'events' && (
            <div className="space-y-6">
              
              {/* Upcoming Events */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4 shadow-sm">
                <h3 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-brand-700" /> Upcoming Events
                </h3>

                {(!club.upcomingEvents || club.upcomingEvents.length === 0) ? (
                  <p className="text-xs text-slate-400 italic py-4">No upcoming events scheduled right now.</p>
                ) : (
                  <div className="space-y-4">
                    {club.upcomingEvents.map((evt) => (
                      <div key={evt._id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <h4 className="font-heading font-bold text-sm text-slate-900">{evt.name}</h4>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 self-start sm:self-auto">
                            {evt.eventType}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">{evt.description}</p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-500 pt-1">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-brand-600" />
                            <span>{new Date(evt.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} • {evt.startTime}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-rose-600" />
                            <span className="truncate">{evt.venue}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-purple-600" />
                            <span>
                              {evt.capacity === 'Limited' ? `Capacity: ${evt.registeredCount}/${evt.maxParticipants}` : 'Unlimited Seats'}
                            </span>
                          </div>
                        </div>

                        {/* Registration Button */}
                        <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                          <div className="text-[10px] font-medium text-slate-500">
                            Eligibility: <span className="font-bold text-slate-700">{evt.eligibility}</span>
                          </div>
                          {registeredEventIds.includes(evt._id) ? (
                            <button
                              disabled
                              className="px-4 py-1.5 bg-white text-emerald-600 border border-emerald-300 font-bold rounded-lg text-xs shadow-2xs inline-flex items-center gap-1.5 cursor-default"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Registered
                            </button>
                          ) : (
                            <button
                              onClick={() => initiateRegistration(evt)}
                              disabled={registeringEventId === evt._id || (evt.capacity === 'Limited' && evt.registeredCount >= evt.maxParticipants)}
                              className="px-4 py-1.5 bg-brand-700 hover:bg-brand-800 text-white rounded-lg text-xs font-semibold shadow-xs disabled:opacity-50 transition-all"
                            >
                              {registeringEventId === evt._id ? 'Registering...' : (evt.capacity === 'Limited' && evt.registeredCount >= evt.maxParticipants) ? 'Full' : 'Register Now'}
                            </button>
                          )}

                        </div>


                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Past Events */}
              {club.pastEvents && club.pastEvents.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-3 shadow-sm">
                  <h3 className="font-heading font-bold text-sm text-slate-700">Past Events History</h3>
                  <div className="divide-y divide-slate-100">
                    {club.pastEvents.map((pe) => (
                      <div key={pe._id} className="py-2.5 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-semibold text-slate-800">{pe.name}</p>
                          <p className="text-[10px] text-slate-400">{new Date(pe.date).toLocaleDateString()} • {pe.venue}</p>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                          Completed
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cancelled Events */}
              {club.cancelledEvents && club.cancelledEvents.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-3 shadow-sm">
                  <h3 className="font-heading font-bold text-sm text-rose-700 flex items-center gap-1.5">
                    <Ban className="w-4 h-4" /> Cancelled Events
                  </h3>
                  <div className="divide-y divide-slate-100">
                    {club.cancelledEvents.map((ce) => (
                      <div key={ce._id} className="py-2 flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-600">{ce.name}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                          Cancelled
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 3: CORE MEMBERS */}
          {activeTab === 'members' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4 shadow-sm">
              <h3 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-brand-700" /> Club Leadership & Core Members
              </h3>

              {/* Club Head Card */}
              {club.clubHead && (
                <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-500 text-white font-bold text-lg flex items-center justify-center shadow-xs">
                    {club.clubHead.name.charAt(0)}
                  </div>
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-200 text-amber-900 uppercase">
                      Club Head
                    </span>
                    <h4 className="font-heading font-bold text-sm text-slate-900 mt-0.5">{club.clubHead.name}</h4>
                    <p className="text-xs text-slate-600">{club.clubHead.branch} • Year {club.clubHead.year} • {club.clubHead.email}</p>
                  </div>
                </div>
              )}

              {/* Core Members List */}
              {(!club.coreMembers || club.coreMembers.length === 0) ? (
                <p className="text-xs text-slate-400 italic py-2">No additional core members listed.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {club.coreMembers.map((cm, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-0.5">
                      <p className="font-bold text-slate-800">{cm.name}</p>
                      <p className="text-brand-700 font-semibold text-[11px]">{cm.role}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Right Sidebar Info */}
        <div className="space-y-6">
          
          {/* Active Recruitment Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-heading font-bold text-sm text-slate-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-600" /> Recruitment Status
            </h3>

            {club.activeRecruitment ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-600 text-white uppercase">
                    Applications Open
                  </span>
                </div>
                <h4 className="font-heading font-bold text-xs text-emerald-900">{club.activeRecruitment.title}</h4>
                <p className="text-[11px] text-emerald-800 leading-snug">{club.activeRecruitment.description}</p>
                <div className="text-[11px] font-semibold text-emerald-900 pt-1">
                  Deadline: {new Date(club.activeRecruitment.applicationDeadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                <Link
                  to={`/clubs/${club._id}/apply`}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors text-center block"
                >
                  Fill Application Form →
                </Link>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-500 space-y-1">
                <p className="font-semibold text-slate-700">No Active Recruitment</p>
                <p className="text-[11px]">Recruitment is currently closed for this club. Check back later!</p>
              </div>
            )}
          </div>

          {/* Faculty & Contact Details */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 text-xs">
            <h3 className="font-heading font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
              Club Administration & Contact
            </h3>

            {club.facultyCoordinator && (
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Faculty Coordinator</span>
                <p className="font-semibold text-slate-800">{club.facultyCoordinator}</p>
              </div>
            )}

            {club.contactEmail && (
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Contact Email</span>
                <p className="font-medium text-brand-700 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> {club.contactEmail}
                </p>
              </div>
            )}

            {/* Social Links */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Social Handles</span>
              <div className="flex items-center gap-3 text-slate-600">
                {club.instagram && (
                  <a href={club.instagram} target="_blank" rel="noreferrer" className="hover:text-pink-600 transition-colors">
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {club.linkedin && (
                  <a href={club.linkedin} target="_blank" rel="noreferrer" className="hover:text-blue-600 transition-colors">
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {club.website && (
                  <a href={club.website} target="_blank" rel="noreferrer" className="hover:text-brand-700 transition-colors">
                    <Globe className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Event Registration Confirmation Modal */}

      {confirmingEvent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-slate-900">Confirm Event Registration</h3>
                <p className="text-xs text-slate-500">Please confirm your participation</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <p className="font-bold text-sm text-slate-900">{confirmingEvent.name}</p>
              <div className="text-slate-600 space-y-1">
                <p className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-brand-700" /> {new Date(confirmingEvent.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} at {confirmingEvent.startTime}</p>
                <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-rose-600" /> {confirmingEvent.venue}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 font-medium">Are you sure you want to register for this event?</p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setConfirmingEvent(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const eventId = confirmingEvent._id;
                  setConfirmingEvent(null);
                  handleRegisterEvent(eventId);
                }}
                disabled={registeringEventId === confirmingEvent._id}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                {registeringEventId === confirmingEvent._id ? 'Registering...' : 'Yes, Confirm Registration'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

