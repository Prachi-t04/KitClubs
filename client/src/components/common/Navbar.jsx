import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import {
  Search,
  Bell,
  User,
  LogOut,
  Compass,
  LayoutDashboard,
  ShieldCheck,
  Award,
  ChevronDown,
  Check,
  CheckCircle,
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/clubs?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/clubs');
    }
  };

  return (
    <nav className="bg-brand-700 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & College Brand */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center font-bold text-xl text-yellow-400 group-hover:scale-105 transition-transform">
              KIT
            </div>
            <div className="hidden md:block">
              <div className="font-heading font-extrabold text-lg tracking-tight text-white leading-tight">
                KIT Club Portal
              </div>
              <div className="text-[11px] text-blue-200 font-medium tracking-wide">
                KIT's College of Engineering, Kolhapur
              </div>
            </div>
          </Link>

          {/* Central Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl mx-4">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search clubs, activities, events..."
                className="w-full bg-blue-900/40 text-white placeholder-blue-200/70 text-sm rounded-full pl-10 pr-4 py-2 border border-blue-400/30 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-blue-900/70 transition-all"
              />
              <Search className="w-4 h-4 text-blue-200 absolute left-3.5 top-2.5" />
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            
            <Link
              to="/clubs"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === '/clubs' ? 'bg-white/20 text-white' : 'text-blue-100 hover:bg-white/10'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span className="hidden sm:inline">Explore Clubs</span>
            </Link>

            {user ? (
              <>
                {/* Notification Bell Link */}
                <Link
                  to="/notifications"
                  className="p-2 rounded-full text-blue-100 hover:bg-white/10 relative transition-colors block"
                  aria-label="Notifications"
                  title="View Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>


                {/* User Menu Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowUserMenu(!showUserMenu);
                      setShowNotifications(false);
                    }}
                    className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-lg text-white hover:bg-white/10 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-brand-900 font-bold flex items-center justify-center text-sm shadow">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="text-sm font-medium hidden md:inline truncate max-w-[120px]">
                      {user.name.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-4 h-4 text-blue-200" />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-200 text-slate-800 py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <p className="text-xs text-slate-500 font-medium">Signed in as</p>
                        <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                        <div className="mt-1 flex items-center gap-1.5">
                          <span
                            className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                              user.role === 'admin'
                                ? 'bg-purple-100 text-purple-800'
                                : user.role === 'clubHead'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {user.role === 'clubHead' ? 'Club Head' : user.role}
                          </span>
                          <span className="text-[11px] text-slate-400">PRN: {user.prn}</span>
                        </div>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/dashboard"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        >
                          <LayoutDashboard className="w-4 h-4 text-brand-700" /> Student Dashboard
                        </Link>

                        {user.role === 'clubHead' && (
                          <Link
                            to="/club-dashboard"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-50"
                          >
                            <Award className="w-4 h-4 text-amber-600" /> Club Head Dashboard
                          </Link>
                        )}

                        {user.role === 'admin' && (
                          <Link
                            to="/admin"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-purple-700 hover:bg-purple-50"
                          >
                            <ShieldCheck className="w-4 h-4 text-purple-600" /> Admin Console
                          </Link>
                        )}

                        <Link
                          to="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        >
                          <User className="w-4 h-4 text-slate-500" /> My Profile
                        </Link>
                      </div>

                      <div className="border-t border-slate-100 pt-1">
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            logout();
                            navigate('/login');
                          }}
                          className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-white hover:bg-white/10 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-amber-400 text-slate-900 hover:bg-amber-300 shadow-sm transition-colors"
                >
                  Register
                </Link>
              </div>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
};
