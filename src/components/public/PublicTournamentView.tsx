import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import { Match, SportBranch } from '../../types';
import {
  Trophy,
  Radio,
  Calendar,
  Clock,
  CheckCircle2,
  Users,
  Award,
  BookOpen,
  ArrowRight,
  Shield,
  UserPlus,
  Flame,
  Search,
  Sparkles,
  ChevronRight,
  Target,
  FileSpreadsheet
} from 'lucide-react';

interface PublicTournamentViewProps {
  onOpenRegisterModal: () => void;
  onOpenScoreModal: (matchId: string) => void;
}

export const PublicTournamentView: React.FC<PublicTournamentViewProps> = ({
  onOpenRegisterModal,
  onOpenScoreModal
}) => {
  const { identity, matches, sports, contingents, athletes, activeRole } = useTournament();

  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCaborForRules, setSelectedCaborForRules] = useState<SportBranch | null>(null);

  const liveMatches = matches.filter(m => m.status === 'live');

  const filteredMatches = matches.filter(m => {
    if (selectedSport !== 'all' && m.sportId !== selectedSport) return false;
    if (selectedStatus !== 'all' && m.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const txt = `${m.teamA.label} ${m.teamB.label} ${m.venue} ${m.stage}`.toLowerCase();
      if (!txt.includes(q)) return false;
    }
    return true;
  });

  const getSport = (id: string) => sports.find(s => s.id === id);
  const getContingent = (id: string) => contingents.find(c => c.id === id);

  const canScore = activeRole === 'super_admin' || activeRole === 'wasit';

  // Fallback hero and trophy images
  const heroImage = identity.bannerUrl || '/src/assets/images/hero_esports_championship_1794294147972.jpg';
  const trophyImage = identity.trophyImageUrl || '/src/assets/images/trophy_gold_cup_1794294149443.jpg';

  return (
    <div className="space-y-10">
      {/* Hero Tournament Section - Prestigious & Cinematic with Real Image */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
        {/* Background Image with Dark Vignette / Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Tournament Arena"
            className="w-full h-full object-cover object-center opacity-35 filter brightness-75 contrast-125"
            onError={e => {
              // Graceful fallback to dark gradient if image fails
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 p-6 sm:p-10 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl space-y-5 text-white">
            {/* Meta Tags */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                {identity.season}
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-300 font-semibold">{identity.organizer}</span>
              <span className="text-slate-500">·</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Google Sheets Sync Aktif
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-[1.15]">
              {identity.name}
            </h1>

            {/* Slogan */}
            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
              {identity.slogan}. Saksikan perebutan supremasi e-sports dan olahraga antar-RT secara langsung dengan update skor babak 1 dan 2 instan, bagan otomatis, dan registrasi atlet online.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenRegisterModal}
                className="px-6 py-3 text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-lg hover:shadow-amber-400/20 transition-all flex items-center gap-2 transform active:scale-95"
              >
                <UserPlus className="w-4 h-4 text-slate-950" />
                <span>Daftar Atlet Mandiri</span>
              </button>
              <a
                href="#live-center"
                className="px-5 py-3 text-xs sm:text-sm font-semibold text-slate-100 bg-slate-900/80 hover:bg-slate-800 rounded-xl border border-slate-700/80 transition-all flex items-center gap-2 backdrop-blur-xs"
              >
                <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
                <span>Pantau Skor Live ({liveMatches.length})</span>
              </a>
            </div>

            {/* Quick Metrics Bar */}
            <div className="pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div>
                <span className="text-slate-400 block text-[11px]">KONTINGEN RT</span>
                <span className="text-lg font-bold text-white tabular-nums">{contingents.length} RT</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">CABANG OLAHRAGA</span>
                <span className="text-lg font-bold text-amber-400 tabular-nums">{sports.length} Cabor</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">TOTAL ATLET</span>
                <span className="text-lg font-bold text-indigo-400 tabular-nums">{athletes.length} Atlet</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">TOTAL LAGA</span>
                <span className="text-lg font-bold text-emerald-400 tabular-nums">{matches.length} Match</span>
              </div>
            </div>
          </div>

          {/* Trophy Showcase Card */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-amber-500/30 backdrop-blur-md shadow-2xl relative group hover:border-amber-500/50 transition-all">
              <div className="relative h-48 w-full rounded-xl overflow-hidden bg-slate-950 mb-4 border border-amber-500/20">
                <img
                  src={trophyImage}
                  alt="Piala Bergilir"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-amber-300 font-bold">
                  <span className="flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" /> PIALA BERGILIR
                  </span>
                  <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/40">
                    RW 08
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-center">
                <h4 className="text-sm font-bold text-white tracking-wide">
                  Piala Bergilir Juara Umum
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Diberikan kepada RT dengan perolehan medali emas terbanyak di akhir musim {identity.season}.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section: Showcase Cabang Olahraga dengan Foto & Aturan */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Cabang Olahraga & E-Sports Resmi</span>
            </h2>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Pilihan turnamen, sistem babak 1 & 2, serta ketentuan resmi pertandingan
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sports.map(sport => {
            const sportMatches = matches.filter(m => m.sportId === sport.id);
            const sportAthletes = athletes.filter(a => a.sportId === sport.id);
            const fallbackSportImg =
              sport.category === 'esports'
                ? '/src/assets/images/cabor_esports_gaming_1794294148716.jpg'
                : '/src/assets/images/cabor_badminton_sports_1794294148699.jpg';
            const displayImg = sport.imageUrl || fallbackSportImg;

            return (
              <div
                key={sport.id}
                className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Sport Image Banner */}
                  <div className="relative h-40 w-full bg-slate-950 overflow-hidden">
                    <img
                      src={displayImg}
                      alt={sport.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                      onError={e => {
                        (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    
                    {/* Badge top */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span
                        className="w-3 h-3 rounded-full border border-white/40"
                        style={{ backgroundColor: sport.color }}
                      />
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-white px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-xs border border-white/20">
                        {sport.category === 'esports' ? 'E-SPORTS' : 'OLAHRAGA FISIK'}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 text-xs font-mono font-bold text-amber-400 bg-slate-900/80 px-2 py-0.5 rounded-full border border-amber-400/30">
                      {sport.format.replace('_', ' ').toUpperCase()}
                    </div>

                    {/* Name on image */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="text-base font-bold tracking-tight drop-shadow-sm">
                        {sport.name}
                      </h3>
                      <div className="text-[11px] text-slate-300 font-mono flex items-center gap-2 mt-0.5">
                        <span>{sport.roundLabels.round1}</span>
                        <span>&</span>
                        <span>{sport.roundLabels.round2}</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-3 text-xs">
                    <p className="text-slate-600 dark:text-slate-400 text-xs line-clamp-2">
                      {sport.rulesSummary || 'Turnamen resmi dengan format gugur dan babak akumulasi skor.'}
                    </p>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                      <span>{sportAthletes.length} Atlet Terdaftar</span>
                      <span>·</span>
                      <span>{sportMatches.length} Pertandingan</span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-3 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedCaborForRules(sport)}
                    className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-500 flex items-center gap-1 transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Lihat Aturan Lengkap</span>
                  </button>
                  <button
                    onClick={onOpenRegisterModal}
                    className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
                  >
                    <span>Daftar Cabor Ini</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 1: Live Match Showcase (Babak 1, Babak 2 & Timeline) */}
      <div id="live-center" className="space-y-4 scroll-mt-20">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <Radio className="w-5 h-5 text-rose-500 animate-pulse" />
              <span>Panggung Pertandingan LIVE Real-Time</span>
            </h2>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Skor langsung babak pertama, babak kedua, serta catatan wasit di lapangan
            </div>
          </div>

          <span className="text-xs font-mono text-rose-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            {liveMatches.length} Laga Aktif
          </span>
        </div>

        {liveMatches.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <Radio className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Belum ada pertandingan yang sedang LIVE saat ini.
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Silakan cek jadwal pertandingan di bawah untuk mengetahui jam tanding berikutnya.
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {liveMatches.map(m => {
              const sport = getSport(m.sportId);
              const contingentA = getContingent(m.teamA.rtId);
              const contingentB = getContingent(m.teamB.rtId);

              return (
                <div
                  key={m.id}
                  className="rounded-2xl border-2 border-rose-500/70 bg-white dark:bg-slate-900 shadow-xl overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="px-6 py-3.5 bg-slate-950 text-white flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: sport?.color || '#94a3b8' }}
                      />
                      <span className="font-bold text-slate-100">{sport?.name}</span>
                      <span className="text-slate-500">·</span>
                      <span className="font-mono text-slate-300 uppercase">{m.stage.replace('_', ' ')}</span>
                      <span className="text-slate-500">·</span>
                      <span className="text-slate-400">📍 {m.venue}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-full bg-rose-600 text-white font-mono font-bold text-[10px] uppercase tracking-wider animate-pulse flex items-center gap-1">
                        <Radio className="w-3 h-3" /> LIVE BABAK {m.currentRound}
                      </span>
                      {canScore && (
                        <button
                          onClick={() => onOpenScoreModal(m.id)}
                          className="px-3 py-1 text-xs font-bold rounded-lg bg-white text-slate-900 hover:bg-slate-200 transition-colors font-mono"
                        >
                          Edit Skor
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Main Scoreboard Layout */}
                  <div className="p-6">
                    <div className="grid grid-cols-5 items-center text-center">
                      {/* Team A */}
                      <div className="col-span-2 space-y-2">
                        <div
                          className="w-10 h-10 rounded-full mx-auto shadow-md flex items-center justify-center font-bold text-white text-xs border-2 border-white/20"
                          style={{ backgroundColor: contingentA?.color || '#ef4444' }}
                        >
                          {contingentA?.code || 'RT A'}
                        </div>
                        <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                          {m.teamA.label}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                          Maskot: {contingentA?.mascotName || 'RT Warga'}
                        </div>
                      </div>

                      {/* Aggregate Score & Rounds */}
                      <div className="col-span-1 space-y-1">
                        <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-amber-500 dark:text-amber-400 tabular-nums">
                          {m.totalScoreA} : {m.totalScoreB}
                        </div>
                        <div className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                          Skor Agregat
                        </div>
                      </div>

                      {/* Team B */}
                      <div className="col-span-2 space-y-2">
                        <div
                          className="w-10 h-10 rounded-full mx-auto shadow-md flex items-center justify-center font-bold text-white text-xs border-2 border-white/20"
                          style={{ backgroundColor: contingentB?.color || '#3b82f6' }}
                        >
                          {contingentB?.code || 'RT B'}
                        </div>
                        <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                          {m.teamB.label}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                          Maskot: {contingentB?.mascotName || 'RT Warga'}
                        </div>
                      </div>
                    </div>

                    {/* Breakdown Babak 1 and Babak 2 */}
                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-4">
                      {/* Box Babak 1 */}
                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-center space-y-1">
                        <div className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">
                          {sport?.roundLabels.round1 || 'Babak 1'}
                        </div>
                        <div className="text-xl font-black font-mono text-slate-900 dark:text-white tabular-nums">
                          {m.round1.teamAScore} - {m.round1.teamBScore}
                        </div>
                        <div className="text-[11px] text-slate-400 italic">
                          {m.round1.notes || 'Hasil resmi babak 1'}
                        </div>
                      </div>

                      {/* Box Babak 2 */}
                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-center space-y-1">
                        <div className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">
                          {sport?.roundLabels.round2 || 'Babak 2'}
                        </div>
                        <div className="text-xl font-black font-mono text-slate-900 dark:text-white tabular-nums">
                          {m.round2.teamAScore} - {m.round2.teamBScore}
                        </div>
                        <div className="text-[11px] text-slate-400 italic">
                          {m.round2.notes || 'Sedang berjalan...'}
                        </div>
                      </div>
                    </div>

                    {/* Live Timeline Feed */}
                    {m.timeline.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold block">
                          Catatan Peristiwa Terkini di Arena:
                        </span>
                        <div className="space-y-1.5 max-h-36 overflow-y-auto">
                          {m.timeline.map((item, idx) => (
                            <div
                              key={idx}
                              className="text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between"
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[11px] text-rose-500 font-bold">
                                  [{item.time}]
                                </span>
                                <span className="text-slate-800 dark:text-slate-200">
                                  {item.text}
                                </span>
                              </div>
                              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                {item.type}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Section 2: Jadwal & Rekap Seluruh Pertandingan */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-500" />
              <span>Jadwal & Hasil Lengkap Pertandingan</span>
            </h2>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Filter berdasarkan cabang olahraga, status laga, atau cari tim
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari tim..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 w-32 sm:w-44 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <select
              value={selectedSport}
              onChange={e => setSelectedSport(e.target.value)}
              className="text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium"
            >
              <option value="all">Semua Cabor</option>
              {sports.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium"
            >
              <option value="all">Semua Status</option>
              <option value="live">🔴 Sedang Live</option>
              <option value="scheduled">⏳ Terjadwal</option>
              <option value="completed">✅ Selesai</option>
            </select>
          </div>
        </div>

        {/* Matches Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMatches.map(m => {
            const sport = getSport(m.sportId);
            const isCompleted = m.status === 'completed';
            const isLive = m.status === 'live';

            return (
              <div
                key={m.id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: sport?.color || '#cbd5e1' }}
                      />
                      {sport?.name}
                    </span>
                    <span className="font-mono text-[11px] text-slate-400">
                      {m.scheduledTime.split(' ')[1] || '14:00'} WIB
                    </span>
                  </div>

                  {/* Teams and score */}
                  <div className="py-3 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 dark:text-white truncate max-w-[170px]">
                        {m.teamA.label}
                      </span>
                      <span className="font-mono font-bold text-sm text-slate-800 dark:text-slate-200 tabular-nums">
                        {isCompleted || isLive ? m.totalScoreA : '-'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 dark:text-white truncate max-w-[170px]">
                        {m.teamB.label}
                      </span>
                      <span className="font-mono font-bold text-sm text-slate-800 dark:text-slate-200 tabular-nums">
                        {isCompleted || isLive ? m.totalScoreB : '-'}
                      </span>
                    </div>
                  </div>

                  {/* Round 1 & Round 2 score badge */}
                  {(isCompleted || isLive) && (
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 flex justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
                      <span>B1: {m.round1.teamAScore} - {m.round1.teamBScore}</span>
                      <span>·</span>
                      <span>B2: {m.round2.teamAScore} - {m.round2.teamBScore}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400 truncate max-w-[160px]">
                    📍 {m.venue}
                  </span>

                  {isCompleted ? (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold font-mono flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> SELESAI
                    </span>
                  ) : isLive ? (
                    <span className="text-[10px] text-rose-500 font-bold font-mono animate-pulse">
                      🔴 LIVE B{m.currentRound}
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-mono">
                      TERJADWAL
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal View Rules Cabor */}
      {selectedCaborForRules && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 animate-fadeIn text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span
                  className="w-3.5 h-3.5 rounded-full"
                  style={{ backgroundColor: selectedCaborForRules.color }}
                />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Aturan & Ketentuan: {selectedCaborForRules.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCaborForRules(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold text-base"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-slate-700 dark:text-slate-300">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block font-mono">
                  Format Pertandingan & Babak:
                </span>
                <p>
                  Sistem: <strong>{selectedCaborForRules.format.replace('_', ' ').toUpperCase()}</strong> ({selectedCaborForRules.roundLabels.round1} dan {selectedCaborForRules.roundLabels.round2}).
                </p>
                <p className="text-[11px] text-slate-500">
                  Tipe Penilaian: Skor <strong>{selectedCaborForRules.scoreType.toUpperCase()}</strong> per babak (Maks {selectedCaborForRules.maxTeamMembers} pemain per tim).
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-900 dark:text-white block mb-1">
                  Syarat & Ketentuan Pemain:
                </span>
                <p className="whitespace-pre-line leading-relaxed text-slate-600 dark:text-slate-400">
                  {selectedCaborForRules.rulesDetail?.length
                    ? selectedCaborForRules.rulesDetail.join('\n')
                    : selectedCaborForRules.rulesSummary}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedCaborForRules(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
