import React from 'react';
import { useTournament } from '../../context/TournamentContext';
import {
  Trophy,
  Radio,
  Users,
  Wallet,
  Calendar,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Medal,
  Play
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigateTab: (tab: string) => void;
  onOpenScoreModal: (matchId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigateTab,
  onOpenScoreModal
}) => {
  const {
    identity,
    matches,
    contingents,
    athletes,
    expenses,
    incomes,
    googleSheetsConfig,
    sports,
    activeRole,
    currentUser
  } = useTournament();

  const liveMatches = matches.filter(m => m.status === 'live');
  const completedMatches = matches.filter(m => m.status === 'completed');
  const scheduledMatches = matches.filter(m => m.status === 'scheduled');

  const totalIncomes = incomes.reduce((acc, i) => acc + i.amount, 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
  const netBalance = totalIncomes - totalExpenses;

  const topContingents = [...contingents].sort((a, b) => b.points - a.points).slice(0, 4);

  const getSport = (id: string) => sports.find(s => s.id === id);

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900/90 via-slate-900 to-indigo-950 border border-indigo-800/50 text-white relative overflow-hidden shadow-lg">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-300">
            <span className="px-2 py-0.5 rounded bg-indigo-500/20 border border-indigo-400/30 uppercase">
              {identity.season}
            </span>
            <span>·</span>
            <span>{identity.organizer}</span>
          </div>

          <h1 className="text-2xl font-black tracking-tight text-white">
            {identity.name}
          </h1>

          <p className="text-xs text-slate-300 leading-relaxed">
            {identity.slogan} · Sistem manajemen pertandingan antar-RT terintegrasi dengan Google Sheets sebagai basis data cloud real-time.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('admin-matches')}
              className="px-4 py-2 text-xs font-bold bg-indigo-500 hover:bg-indigo-400 text-white rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
            >
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>Kelola Skor Babak 1 & 2</span>
            </button>
            <button
              onClick={() => onNavigateTab('admin-bracket')}
              className="px-4 py-2 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/20 flex items-center gap-1.5"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Bagan Turnamen Otomatis</span>
            </button>
          </div>
        </div>

        {/* Decorative background trophy watermark effect */}
        <Trophy className="absolute -right-6 -bottom-8 w-64 h-64 text-indigo-500/10 pointer-events-none" />
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Matches */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span>Total Pertandingan</span>
            <Calendar className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1">
            {matches.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono flex items-center gap-1.5">
            <span className="text-emerald-500 font-bold">{completedMatches.length} Selesai</span>
            <span>·</span>
            <span className="text-rose-500 font-bold">{liveMatches.length} Live</span>
          </div>
        </div>

        {/* Total Athletes */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span>Atlet Terdaftar</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1">
            {athletes.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">
            Dari {contingents.length} Kontingen RT
          </div>
        </div>

        {/* Net Cash */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span>Kas Bersih Turnamen</span>
            <Wallet className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400 mt-1">
            Rp {netBalance.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono truncate">
            Surplus Kas Realistis
          </div>
        </div>

        {/* Google Sheets Sync Status */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span>Status Google Sheets</span>
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Aktif & Sinkron</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">
            AppScript Web App
          </div>
        </div>

      </div>

      {/* Main Grid: Live Match Center & Standings Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Live Matches & Score Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
              <span>Pertandingan Sedang Berlangsung & Sorotan Skor</span>
            </h3>
            <button
              onClick={() => onNavigateTab('admin-matches')}
              className="text-xs font-mono text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Lihat Semua Jadwal</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {liveMatches.length === 0 ? (
              <div className="p-6 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
                Tidak ada laga yang berstatus LIVE saat ini. Laga berikutnya dapat Anda buka melalui menu Kelola Skor.
              </div>
            ) : (
              liveMatches.map(m => {
                const sport = getSport(m.sportId);
                return (
                  <div
                    key={m.id}
                    className="p-5 rounded-xl border-2 border-rose-500/50 bg-white dark:bg-slate-900 shadow-sm space-y-4"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {sport?.name}
                        </span>
                        <span className="text-slate-400">·</span>
                        <span className="font-mono text-slate-500">{m.stage.replace('_', ' ').toUpperCase()}</span>
                      </div>
                      <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-rose-500 text-white uppercase animate-pulse">
                        LIVE BABAK {m.currentRound}
                      </span>
                    </div>

                    {/* Scoreboard visual */}
                    <div className="grid grid-cols-5 items-center text-center py-2 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-100 dark:border-slate-800">
                      <div className="col-span-2 px-2">
                        <div className="font-bold text-slate-900 dark:text-white text-sm truncate">
                          {m.teamA.label}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          Babak 1: {m.round1.teamAScore} | Babak 2: {m.round2.teamAScore}
                        </div>
                      </div>

                      <div className="col-span-1">
                        <div className="text-2xl font-black font-mono tracking-tight text-indigo-600 dark:text-indigo-400 tabular-nums">
                          {m.totalScoreA} - {m.totalScoreB}
                        </div>
                        <div className="text-[10px] font-mono uppercase text-slate-400">Skor Game</div>
                      </div>

                      <div className="col-span-2 px-2">
                        <div className="font-bold text-slate-900 dark:text-white text-sm truncate">
                          {m.teamB.label}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          Babak 1: {m.round1.teamBScore} | Babak 2: {m.round2.teamBScore}
                        </div>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-400 font-mono">
                        📍 {m.venue}
                      </span>
                      <button
                        onClick={() => onOpenScoreModal(m.id)}
                        className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm flex items-center gap-1.5 font-mono"
                      >
                        <Radio className="w-3 h-3" />
                        <span>Update Skor Sekarang</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}

            {/* Upcoming Next Matches List */}
            <div className="pt-3">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono uppercase tracking-wider mb-2">
                Pertandingan Terjadwal Berikutnya
              </h4>
              <div className="space-y-2">
                {scheduledMatches.slice(0, 3).map(m => {
                  const sport = getSport(m.sportId);
                  return (
                    <div
                      key={m.id}
                      className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: sport?.color || '#94a3b8' }}
                        />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">
                            {m.teamA.label} vs {m.teamB.label}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {sport?.name} · {m.scheduledTime}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => onOpenScoreModal(m.id)}
                        className="px-2.5 py-1 text-xs font-medium rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-mono"
                      >
                        Mulai Laga
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Mini Leaderboard & Quick Short-cuts */}
        <div className="space-y-6">
          
          {/* Top 4 Standings Card */}
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>Klasemen Teratas RT</span>
              </h3>
              <button
                onClick={() => onNavigateTab('public-standings')}
                className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Lengkap →
              </button>
            </div>

            <div className="space-y-2.5">
              {topContingents.map((c, idx) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-950/60"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold w-4 text-center text-slate-400">
                      #{idx + 1}
                    </span>
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: c.color }}
                    />
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[120px]">
                      {c.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="text-amber-500 font-bold">{c.gold}🥇</span>
                    <span className="text-slate-400 font-bold">{c.silver}🥈</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{c.points} Pts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 font-mono">
              Pintasan Menu Pengurus
            </h4>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => onNavigateTab('admin-athletes')}
                className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors font-medium text-slate-800 dark:text-slate-200"
              >
                👥 Verifikasi Atlet
              </button>
              <button
                onClick={() => onNavigateTab('admin-finance')}
                className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors font-medium text-slate-800 dark:text-slate-200"
              >
                💰 SPJ & Kas
              </button>
              <button
                onClick={() => onNavigateTab('admin-sheets')}
                className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors font-medium text-slate-800 dark:text-slate-200"
              >
                📊 Google Sheets
              </button>
              <button
                onClick={() => onNavigateTab('admin-notifs')}
                className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors font-medium text-slate-800 dark:text-slate-200"
              >
                📢 Broadcast WA
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
