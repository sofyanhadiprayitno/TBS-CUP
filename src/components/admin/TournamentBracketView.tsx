import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import { Match, SportBranch } from '../../types';
import { generateInitialBracketMatches } from '../../utils/bracketGenerator';
import {
  Trophy,
  Medal,
  Play,
  CheckCircle2,
  Calendar,
  Sparkles,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TournamentBracketViewProps {
  onOpenScoreModal?: (matchId: string) => void;
  readOnly?: boolean;
}

export const TournamentBracketView: React.FC<TournamentBracketViewProps> = ({
  onOpenScoreModal,
  readOnly = false
}) => {
  const { sports, contingents, matches, addMatch, updateMatchScore, activeRole } = useTournament();
  const [selectedSportId, setSelectedSportId] = useState<string>(sports[0]?.id || 'sp-mlbb');

  const selectedSport = sports.find(s => s.id === selectedSportId) || sports[0];

  // Filter matches for this sport
  const sportMatches = matches.filter(m => m.sportId === selectedSportId);

  // Partition by stages
  const quarterFinals = sportMatches.filter(m => m.stage === 'quarter_final');
  const semiFinals = sportMatches.filter(m => m.stage === 'semi_final');
  const thirdPlaceMatch = sportMatches.find(m => m.stage === 'third_place');
  const finalMatch = sportMatches.find(m => m.stage === 'final');

  const handleGenerateBracket = () => {
    if (confirm(`Buat bagan pertandingan otomatis untuk cabor ${selectedSport.name}?`)) {
      const generated = generateInitialBracketMatches(selectedSportId, contingents, selectedSport.venue);
      generated.forEach(m => addMatch(m));
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    }
  };

  const getContingent = (rtId: string) => contingents.find(c => c.id === rtId);

  const canEditScore = !readOnly && (activeRole === 'super_admin' || activeRole === 'ketua_panitia' || activeRole === 'wasit');

  const renderMatchCard = (match: Match, label: string) => {
    const contingentA = getContingent(match.teamA.rtId);
    const contingentB = getContingent(match.teamB.rtId);

    const isLive = match.status === 'live';
    const isCompleted = match.status === 'completed';
    const isWinnerA = isCompleted && match.winnerRtId === match.teamA.rtId;
    const isWinnerB = isCompleted && match.winnerRtId === match.teamB.rtId;

    return (
      <div
        key={match.id}
        className={`w-72 rounded-xl border transition-all shadow-sm overflow-hidden flex flex-col ${
          isLive
            ? 'border-rose-500/70 bg-white dark:bg-slate-900 shadow-rose-500/10 shadow-md ring-1 ring-rose-500/30'
            : isCompleted
            ? 'border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900'
            : 'border-slate-200 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/60'
        }`}
      >
        {/* Card Header */}
        <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800/70 flex items-center justify-between text-xs bg-slate-50/80 dark:bg-slate-900/80">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono text-[11px]">
              {label}
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-500 dark:text-slate-400 text-[11px] font-mono">
              {match.scheduledTime.split(' ')[1] || 'TBA'}
            </span>
          </div>

          <div>
            {isLive ? (
              <span className="text-[10px] font-bold text-rose-500 tracking-wider uppercase font-mono">
                LIVE B{match.currentRound}
              </span>
            ) : isCompleted ? (
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-3 h-3" /> SELESAI
              </span>
            ) : (
              <span className="text-[10px] text-slate-400 font-mono">JADWAL</span>
            )}
          </div>
        </div>

        {/* Teams & Scores */}
        <div className="p-3 flex flex-col gap-2">
          {/* Team A */}
          <div
            className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
              isWinnerA
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0 pr-2">
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: contingentA?.color || '#94a3b8' }}
              />
              <span className="text-xs truncate">
                {match.teamA.label || 'TBD (Menunggu)'}
              </span>
            </div>

            <div className="flex items-center gap-2 font-mono tabular-nums shrink-0">
              <span className="text-[11px] text-slate-400">
                (B1: {match.round1.teamAScore} | B2: {match.round2.teamAScore})
              </span>
              <span className="w-6 text-center text-xs font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white">
                {match.totalScoreA}
              </span>
              {isWinnerA && <Trophy className="w-3.5 h-3.5 text-amber-500" />}
            </div>
          </div>

          {/* Team B */}
          <div
            className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
              isWinnerB
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0 pr-2">
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: contingentB?.color || '#94a3b8' }}
              />
              <span className="text-xs truncate">
                {match.teamB.label || 'TBD (Menunggu)'}
              </span>
            </div>

            <div className="flex items-center gap-2 font-mono tabular-nums shrink-0">
              <span className="text-[11px] text-slate-400">
                (B1: {match.round1.teamBScore} | B2: {match.round2.teamBScore})
              </span>
              <span className="w-6 text-center text-xs font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white">
                {match.totalScoreB}
              </span>
              {isWinnerB && <Trophy className="w-3.5 h-3.5 text-amber-500" />}
            </div>
          </div>
        </div>

        {/* Card Footer / Action */}
        <div className="px-3.5 py-2 border-t border-slate-100 dark:border-slate-800/70 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-400 truncate max-w-[130px]">
            📍 {match.venue}
          </span>

          {canEditScore && onOpenScoreModal && (
            <button
              onClick={() => onOpenScoreModal(match.id)}
              className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1 font-mono"
            >
              <span>Input Skor</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Cabor Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-indigo-500" />
            <span>Bagan Turnamen Otomatis (Bracket Tree)</span>
          </h2>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
            <span>Sistem Gugur Tunggal</span>
            <span aria-hidden="true">·</span>
            <span>Penyisihan 8 Besar → 4 Besar → Juara 3 & 4 → Grand Final 1 & 2</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-indigo-500">Pemenang otomatis maju babak berikutnya</span>
          </div>
        </div>

        {/* Action button if admin */}
        {canEditScore && (
          <button
            onClick={handleGenerateBracket}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow-sm flex items-center gap-1.5 self-start md:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Regenerasi Bagan Cabor Ini</span>
          </button>
        )}
      </div>

      {/* Sport Branch Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        {sports.map(s => {
          const isSelected = s.id === selectedSportId;
          return (
            <button
              key={s.id}
              onClick={() => setSelectedSportId(s.id)}
              className={`px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors flex items-center gap-2 ${
                isSelected
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
              <span>{s.name}</span>
              <span className="text-[10px] opacity-75 font-mono">({s.format})</span>
            </button>
          );
        })}
      </div>

      {/* Empty State when no matches */}
      {sportMatches.length === 0 ? (
        <div className="p-12 text-center rounded-xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
          <Trophy className="w-12 h-12 mx-auto text-slate-400 mb-3" />
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Belum Ada Bagan Pertandingan untuk {selectedSport.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            Bagan dapat dibuat secara otomatis mengelompokkan 8 kontingen RT dalam bagan single elimination dari 8 besar hingga final.
          </p>
          {canEditScore && (
            <button
              onClick={handleGenerateBracket}
              className="mt-4 px-4 py-2 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors shadow-sm inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Bagan Otomatis Sekarang</span>
            </button>
          )}
        </div>
      ) : (
        /* The Bracket Tree Layout */
        <div className="overflow-x-auto pb-8 pt-2">
          <div className="min-w-[1080px] grid grid-cols-4 gap-8 relative items-start">
            
            {/* Column 1: Delapan Besar (Quarter Finals - 8 Besar) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 font-mono">
                  01. Delapan Besar (8 Besar)
                </span>
                <span className="text-[11px] font-mono text-slate-400">4 Match</span>
              </div>
              <div className="space-y-6">
                {quarterFinals.length > 0 ? (
                  quarterFinals.map((m, idx) => renderMatchCard(m, `Match 8B-${idx + 1}`))
                ) : (
                  <div className="p-4 text-xs text-slate-400 border border-dashed rounded-lg">
                    Belum dijadwalkan
                  </div>
                )}
              </div>
            </div>

            {/* Column 2: Empat Besar (Semi Finals - 4 Besar) */}
            <div className="space-y-4 pt-12">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 font-mono">
                  02. Semifinal (4 Besar)
                </span>
                <span className="text-[11px] font-mono text-slate-400">2 Match</span>
              </div>
              <div className="space-y-16">
                {semiFinals.length > 0 ? (
                  semiFinals.map((m, idx) => renderMatchCard(m, `Semifinal ${idx + 1}`))
                ) : (
                  <div className="p-4 text-xs text-slate-400 border border-dashed rounded-lg">
                    Menunggu pemenang 8 besar
                  </div>
                )}
              </div>
            </div>

            {/* Column 3: Perebutan Juara 3 & 4 (Bronze Match) */}
            <div className="space-y-4 pt-28">
              <div className="flex items-center justify-between pb-2 border-b border-amber-500/30">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 font-mono flex items-center gap-1.5">
                  <Medal className="w-3.5 h-3.5" />
                  <span>03. Juara 3 & 4</span>
                </span>
                <span className="text-[11px] font-mono text-amber-500">Perunggu</span>
              </div>
              {thirdPlaceMatch ? (
                renderMatchCard(thirdPlaceMatch, 'Perebutan Juara 3 & 4')
              ) : (
                <div className="p-4 text-xs text-slate-400 border border-dashed rounded-lg">
                  Menunggu babak semifinal selesai
                </div>
              )}
            </div>

            {/* Column 4: Grand Final (Juara 1 & 2 - Gold Match) */}
            <div className="space-y-4 pt-8">
              <div className="flex items-center justify-between pb-2 border-b border-indigo-500/40">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-mono flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span>04. Grand Final</span>
                </span>
                <span className="text-[11px] font-mono text-amber-400 font-bold">Emas & Perak</span>
              </div>
              {finalMatch ? (
                <div className="relative">
                  <div className="absolute -top-3 right-3 z-10 px-2 py-0.5 rounded bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-bold uppercase tracking-wider shadow">
                    Perebutan Juara 1
                  </div>
                  {renderMatchCard(finalMatch, 'Grand Final Championship')}
                </div>
              ) : (
                <div className="p-4 text-xs text-slate-400 border border-dashed rounded-lg">
                  Menunggu finalis
                </div>
              )}

              {/* Champion Podium Preview */}
              {finalMatch && finalMatch.winnerRtId && (
                <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 text-center space-y-2 mt-6">
                  <Trophy className="w-8 h-8 text-amber-500 mx-auto animate-bounce" />
                  <div className="text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold">
                    Juara 1 Cabor {selectedSport.name}
                  </div>
                  <div className="text-base font-bold text-slate-900 dark:text-white">
                    {getContingent(finalMatch.winnerRtId)?.name || finalMatch.winnerRtId}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Selamat atas gelar Medali Emas & Piala Kehormatan!
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
