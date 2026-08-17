import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs py-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-brand-700 text-white font-bold flex items-center justify-center text-sm">
                KIT
              </div>
              <span className="font-heading font-bold text-base text-white">KIT Club Portal</span>
            </div>
            <p className="text-slate-400 max-w-md leading-relaxed">
              Centralized platform for club discovery, recruitment cycles, memberships, and event participation at KIT's College of Engineering, Kolhapur.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-slate-200 mb-3 text-sm">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/clubs" className="hover:text-white transition-colors">Discover Clubs</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Student Registration</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Portal Login</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Student Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-slate-200 mb-3 text-sm">College Contact</h4>
            <p className="text-slate-400 leading-relaxed">
              KIT's College of Engineering (Autonomous), Kolhapur<br />
              Gokul Shirgaon, Kolhapur, Maharashtra 416234<br />
              Email: info@kitkop.edu.in
            </p>
          </div>

        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <p>© {new Date().getFullYear()} KIT's College of Engineering, Kolhapur. All rights reserved.</p>
          <p className="text-[11px]">KIT Club Portal v1.0 — Production Baseline</p>
        </div>
      </div>
    </footer>
  );
};
