import React from 'react';
import { useTournament } from '../context/TournamentContext';
import { Bell, X, CheckCheck, Radio, Calendar, DollarSign, Trophy } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationAsRead } = useTournament();

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'match_update': return <Radio className="w-4 h-4 text-rose-500 animate-pulse" />;
      case 'score': return <Trophy className="w-4 h-4 text-amber-500" />;
      case 'finance': return <DollarSign className="w-4 h-4 text-emerald-500" />;
      default: return <Bell className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-sm h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Notifikasi Turnamen ({notifications.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-400">
              Tidak ada notifikasi baru saat ini.
            </div>
          ) : (
            notifications.map(n => (
              <div
                key={n.id}
                onClick={() => markNotificationAsRead(n.id)}
                className={`p-3 rounded-xl border transition-colors cursor-pointer space-y-1 ${
                  n.isRead
                    ? 'bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800'
                    : 'bg-indigo-50/30 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  {getIcon(n.type)}
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {n.title}
                  </h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {n.message}
                </p>
                <div className="text-[10px] text-slate-400 font-mono pt-1 flex justify-between">
                  <span>{n.timestamp}</span>
                  {!n.isRead && <span className="text-indigo-600 dark:text-indigo-400 font-bold">Baru</span>}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
          Sinkronisasi Real-Time dengan Cloud Google Sheets
        </div>

      </div>
    </div>
  );
};
