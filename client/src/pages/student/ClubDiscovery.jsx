import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import {
  Search,
  Filter,
  Calendar,
  UserCheck,
  ArrowRight,
  Sparkles,
  Bot,
  Music,
  Trophy,
  HeartHandshake,
  Lightbulb,
  BookOpen,
  Palette,
  Layers,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Technical',
  'Cultural',
  'Sports',
  'Social',
  'Entrepreneurship',
  'Literary',
  'Arts',
  'Other',
];

const getCategoryIcon = (category) => {
  switch (category) {
    case 'Technical': return <Bot className="w-5 h-5 text-blue-600" />;
    case 'Cultural': return <Music className="w-5 h-5 text-purple-600" />;
    case 'Sports': return <Trophy className="w-5 h-5 text-amber-600" />;
    case 'Social': return <HeartHandshake className="w-5 h-5 text-rose-600" />;
    case 'Entrepreneurship': return <Lightbulb className="w-5 h-5 text-yellow-600" />;
    case 'Literary': return <BookOpen className="w-5 h-5 text-emerald-600" />;
    case 'Arts': return <Palette className="w-5 h-5 text-pink-600" />;
    default: return <Layers className="w-5 h-5 text-slate-600" />;
  }
};

export const ClubDiscovery = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchFromUrl = searchParams.get('search') || '';

  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [hasUpcomingEventsOnly, setHasUpcomingEventsOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchFromUrl);

  useEffect(() => {
    setSearchQuery(searchFromUrl);
  }, [searchFromUrl]);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (selectedCategory !== 'All') params.append('category', selectedCategory);
        if (hasUpcomingEventsOnly) params.append('hasUpcomingEvents', 'true');

        const res = await api.get(`/clubs?${params.toString()}`);
        if (res.data.success) {
          setClubs(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch clubs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, [searchQuery, selectedCategory, hasUpcomingEventsOnly]);

  return (
    <div className="space-y-8 pb-12">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-brand-800 via-brand-700 to-purple-800 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-xs font-semibold text-amber-300">
            <Sparkles className="w-3.5 h-3.5" /> KIT's Official Student Organizations Portal
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Discover Your Tribe at KIT
          </h1>
          <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed">
            Explore 15+ student clubs spanning Technical, Cultural, Sports, Social Service, Entrepreneurship, and Creative Arts. Join recruitment cycles and register for upcoming events.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-blue-200">
            <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Single College Portal</div>
            <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Direct Recruitment</div>
            <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Event Registration</div>
          </div>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          
          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none flex-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-brand-700 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Toggle for Has Upcoming Events */}
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 shrink-0">
            <input
              type="checkbox"
              checked={hasUpcomingEventsOnly}
              onChange={(e) => setHasUpcomingEventsOnly(e.target.checked)}
              className="w-4 h-4 rounded text-brand-700 focus:ring-brand-700"
            />
            <Calendar className="w-4 h-4 text-sky-500" />
            <span>Has Upcoming Events</span>
          </label>

        </div>
      </section>

      {/* Club Grid */}
      <section>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 h-64 animate-pulse space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-slate-200" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-200 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-12 bg-slate-100 rounded" />
              </div>
            ))}
          </div>
        ) : clubs.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
            <Filter className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-heading text-lg font-bold text-slate-800">No Clubs Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No clubs match your current search or category filter. Try selecting 'All' or clearing your search term.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setHasUpcomingEventsOnly(false);
                setSearchParams({});
              }}
              className="px-4 py-2 bg-brand-700 text-white rounded-lg text-xs font-semibold hover:bg-brand-800"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clubs.map((club) => (
              <div
                key={club._id}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between card-hover shadow-sm hover:border-brand-200"
              >
                <div className="space-y-4">
                  
                  {/* Top Bar: Icon + Category Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 shadow-xs">
                      {getCategoryIcon(club.category)}
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                      {club.category}
                    </span>
                  </div>

                  {/* Title & Short Description */}
                  <div>
                    <h3 className="font-heading text-lg font-bold text-slate-900 group-hover:text-brand-700 transition-colors">
                      {club.name}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed line-clamp-2">
                      {club.shortDescription}
                    </p>
                  </div>

                  {/* Activities Chips */}
                  {club.activities && club.activities.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {club.activities.slice(0, 3).map((act, i) => (
                        <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                          • {act}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Upcoming Event snippet if present */}
                  {club.upcomingEvent && (
                    <div className="p-2.5 bg-blue-50/60 border border-blue-100 rounded-xl text-xs space-y-1">
                      <div className="text-[10px] font-bold text-brand-700 uppercase tracking-wide flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Upcoming Event
                      </div>
                      <p className="font-semibold text-slate-800 truncate">{club.upcomingEvent.name}</p>
                      <p className="text-[11px] text-slate-500">
                        {new Date(club.upcomingEvent.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} • {club.upcomingEvent.startTime}
                      </p>
                    </div>
                  )}

                </div>

                {/* Footer: Recruitment Status + CTA */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        club.recruitmentStatus === 'Open' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'
                      }`}
                    />
                    <span
                      className={`text-xs font-bold ${
                        club.recruitmentStatus === 'Open' ? 'text-emerald-700' : 'text-slate-500'
                      }`}
                    >
                      Recruitment: {club.recruitmentStatus}
                    </span>
                  </div>

                  <Link
                    to={`/clubs/${club._id}`}
                    className="px-3.5 py-1.5 bg-brand-700 hover:bg-brand-800 text-white rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-1 shadow-sm"
                  >
                    View Club <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
};
