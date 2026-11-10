import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import { AppNotification } from '../../types';
import {
  Bell,
  Mail,
  MessageSquare,
  Send,
  Sparkles,
  Smartphone,
  CheckCircle2,
  Clock,
  Radio,
  ExternalLink
} from 'lucide-react';

export const NotificationHub: React.FC = () => {
  const { notifications, sendNotification, markNotificationAsRead, contingents } = useTournament();

  const [testTitle, setTestTitle] = useState('Panggilan Pertandingan: Match 1 MLBB');
  const [testMessage, setTestMessage] = useState('Tim RT 03 dan RT 01 dimohon segera memasuki lobby pertandingan di Balai Warga.');
  const [testType, setTestType] = useState<AppNotification['type']>('match_update');

  // WhatsApp Broadcast state
  const [waTargetRT, setWaTargetRT] = useState(contingents[0]?.id || 'rt-01');
  const [waTemplate, setWaTemplate] = useState('schedule');
  const [waCustomText, setWaCustomText] = useState('');

  const targetContingent = contingents.find(c => c.id === waTargetRT);

  const handleSendPushTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testTitle.trim() || !testMessage.trim()) return;

    sendNotification(testTitle, testMessage, testType, 'all');

    // Browser Notification API simulation
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(testTitle, { body: testMessage });
      } catch {
        // iframe fallback
      }
    }
  };

  const requestBrowserPermission = async () => {
    if ('Notification' in window) {
      await Notification.requestPermission();
    }
  };

  // Generate WhatsApp Message
  const getWaBroadcastContent = () => {
    if (waCustomText.trim()) return waCustomText;
    if (waTemplate === 'schedule') {
      return `*PEMBERITAHUAN JADWAL TANDING - PIALA ANTAR RT 2026*\n\nKepada Yth. Ketua & Atlet ${targetContingent?.name || 'Kontingen RT'},\n\nHarap bersiap! Pertandingan Anda dijadwalkan pada hari ini di Balai Warga RW 08. Dimohon hadir 15 menit sebelum laga dimulai untuk verifikasi roster ID.\n\n_Panitia Pelaksana Turnamen Antar RT_`;
    }
    if (waTemplate === 'score') {
      return `*UPDATE RESMI SKOR PERTANDINGAN*\n\nHasil pertandingan babak 1 & 2 telah tercatat di sistem turnamen. Silakan cek bagan & klasemen perolehan medali terkini di aplikasi turnamen RT.\n\nSalam Sportivitas,\n_Seksi Pertandingan_`;
    }
    return `*UNDANGAN EVALUASI PANITIA & TEKNIKAL MEETING*\n\nSeluruh perwakilan kontingen RT diharapkan menghadiri briefing teknis di Balai Pertemuan RW 08.`;
  };

  const handleOpenWhatsApp = () => {
    const phone = targetContingent?.phone.replace(/[^0-9]/g, '') || '628123456789';
    const text = encodeURIComponent(getWaBroadcastContent());
    window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-500" />
            <span>Pusat Notifikasi Real-Time, WhatsApp & Email</span>
          </h2>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
            <span>Uji Notifikasi Push Web Browser</span>
            <span aria-hidden="true">·</span>
            <span>Broadcast WhatsApp Otomatis ke Kapten RT</span>
            <span aria-hidden="true">·</span>
            <span>Notifikasi Pemain & Panitia</span>
          </div>
        </div>

        <button
          onClick={requestBrowserPermission}
          className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-colors flex items-center gap-1.5 self-start md:self-auto"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Izinkan Push Notifikasi Browser</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Module 1: Test & Trigger Real-Time Push Notification */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
              <span>Simulasi & Uji Push Notifikasi Real-Time</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">Web Push Engine</span>
          </div>

          <form onSubmit={handleSendPushTest} className="space-y-3 text-xs">
            <div>
              <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Tipe Notifikasi
              </label>
              <select
                value={testType}
                onChange={e => setTestType(e.target.value as any)}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="match_update">🔴 Pembaruan Pertandingan & Panggilan Laga</option>
                <option value="score">⚡ Skor Babak Real-Time</option>
                <option value="announcement">📢 Pengumuman Panitia & Hasil Juara</option>
                <option value="finance">💰 Transaksi Keuangan & Kas</option>
              </select>
            </div>

            <div>
              <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Judul Notifikasi
              </label>
              <input
                type="text"
                required
                value={testTitle}
                onChange={e => setTestTitle(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
              />
            </div>

            <div>
              <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Pesan Notifikasi
              </label>
              <textarea
                rows={3}
                required
                value={testMessage}
                onChange={e => setTestMessage(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirimkan Notifikasi Push Real-Time Sekarang</span>
            </button>
          </form>
        </div>

        {/* Module 2: WhatsApp Broadcast Generator */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-500" />
              <span>Modul Broadcast WhatsApp ke Kapten & Pengurus RT</span>
            </h3>
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              API WA Direct
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Pilih Sasaran Kontingen RT
                </label>
                <select
                  value={waTargetRT}
                  onChange={e => setWaTargetRT(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {contingents.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Template Pesan Siap Pakai
                </label>
                <select
                  value={waTemplate}
                  onChange={e => setWaTemplate(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="schedule">Jadwal Tanding & Panggilan Laga</option>
                  <option value="score">Update Skor & Klasemen</option>
                  <option value="meeting">Undangan Rapat Evaluasi</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Tinjauan Redaksi Pesan WhatsApp:
              </label>
              <pre className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 whitespace-pre-wrap font-sans text-xs text-slate-800 dark:text-slate-200 max-h-36 overflow-y-auto">
                {getWaBroadcastContent()}
              </pre>
            </div>

            <button
              onClick={handleOpenWhatsApp}
              className="w-full py-2 font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Buka WhatsApp & Kirim ke {targetContingent?.ketuaRT || 'Ketua RT'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* Historical Notification Feed */}
      <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-sm">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Riwayat Notifikasi Aktif Turnamen ({notifications.length})
          </h3>
          <span className="text-xs font-mono text-slate-400">Pembaruan Real-Time</span>
        </div>

        <div className="space-y-2.5 max-h-72 overflow-y-auto">
          {notifications.map(n => (
            <div
              key={n.id}
              className={`p-3 rounded-lg border transition-colors flex items-start justify-between gap-3 ${
                n.isRead
                  ? 'bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800'
                  : 'bg-indigo-50/30 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900/60'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {n.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                    {n.message}
                  </p>
                  <div className="text-[10px] text-slate-400 font-mono mt-1 flex items-center gap-2">
                    <span>{n.timestamp}</span>
                    <span aria-hidden="true">·</span>
                    <span className="uppercase">Target: {n.targetRole || 'Semua'}</span>
                  </div>
                </div>
              </div>

              {!n.isRead && (
                <button
                  onClick={() => markNotificationAsRead(n.id)}
                  className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 hover:underline shrink-0"
                >
                  Tandai Dibaca
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
