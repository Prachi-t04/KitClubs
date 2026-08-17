import React from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { Bell, CheckCircle, CheckCircle2 } from 'lucide-react';

export const NotificationsPage = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, loading } = useNotifications();

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-slate-900">Notifications</h1>
          <p className="text-xs text-slate-500">In-app notifications for applications, events, and memberships</p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-3.5 py-1.5 bg-brand-50 text-brand-700 font-semibold text-xs rounded-lg hover:bg-brand-100 flex items-center gap-1.5"
          >
            <CheckCircle className="w-4 h-4" /> Mark All as Read
          </button>
        )}
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading notifications...</div>
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-2">
          <Bell className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-heading text-lg font-bold text-slate-800">No Notifications</h3>
          <p className="text-xs text-slate-500">You're all caught up!</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm divide-y divide-slate-100">
          {notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => markAsRead(n._id)}
              className={`p-4 flex items-start gap-4 cursor-pointer transition-colors ${
                !n.isRead ? 'bg-blue-50/50' : 'hover:bg-slate-50'
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full mt-1 shrink-0 ${
                  !n.isRead ? 'bg-amber-500' : 'bg-slate-300'
                }`}
              />
              <div className="flex-1 space-y-1">
                <p className="text-xs text-slate-800 font-medium leading-relaxed">{n.message}</p>
                <p className="text-[10px] text-slate-400">
                  {new Date(n.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
