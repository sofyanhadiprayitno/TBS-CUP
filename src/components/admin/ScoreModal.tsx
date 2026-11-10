import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import { Match, MatchTimelineItem, RoundScore } from '../../types';
import {
  Trophy,
  X,
  Plus,
  Minus,
  Save,
  CheckCircle2,
  Clock,
  Radio,
  Sparkles,
  ShieldAlert,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ScoreModalProps {
  matchId: string;
  onClose: () => void;
}

export const ScoreModal: React.FC<ScoreModalProps> = ({ matchId, onClose }) => {
  const { matches, sports, contingents, athletes, updateMatchScore } = useTournament();

  const match = matches.find(m => m.id === matchId);
  if (!match) return null;

  const sport = sports.find(s => s.id === match.sportId);
  const contingentA = contingents.find(c => c.id === match.teamA.rtId);
  const contingentB = contingents.find(c => c.id === match.teamB.rtId);

  // Filter athletes of Team A and Team B for MVP selector
  const athletesA = athletes.filter(a => a.rtId === match.teamA.rtId && a.sportId === match.sportId);
  const athletesB = athletes.filter(a => a.rtId === match.teamB.rtId && a.sportId === match.sportId);
  const availableAthletes = [...athletesA, ...athletesB];

  // Local state for editing
  const [currentRound, setCurrentRound] = useState<1 | 2 | 3>(match.currentRound || 1);
  const [round1A, setRound1A] = useState<number>(match.round1.teamAScore);
  const [round1B, setRound1B] = useState<number>(match.round1.teamBScore);
  const [round2A, setRound2A] = useState<number>(match.round2.teamAScore);
  const [round2B, setRound2B] = useState<number>(match.round2.teamBScore);
  const [round3A, setRound3A] = useState<number>(match.round3 ? match.round3.teamAScore : 0);
  const [round3B, setRound3B] = useState<number>(match.round3 ? match.round3.teamBScore : 0);
  const [hasRound3, setHasRound3] = useState<boolean>(!!match.round3);

  const [winnerRtId, setWinnerRtId] = useState<string>(match.winnerRtId || '');
  const [mvpAthleteId, setMvpAthleteId] = useState<string>(match.mvpAthleteId || '');
  const [notes, setNotes] = useState<string>(match.notes || '');

  // Quick Timeline Event Entry
  const [timelineText, setTimelineText] = useState<string>('');
  const [timelineType, setTimelineType] = useState<MatchTimelineItem['type']>('score');
  const [timelineTeam, setTimelineTeam] = useState<MatchTimelineItem['team']>('A');

  const handleSave = (finalize = false) => {
    const r1: RoundScore = {
      teamAScore: round1A,
      teamBScore: round1B,
      notes: `Skor Babak 1: ${round1A} - ${round1B}`
    };

    const r2: RoundScore = {
      teamAScore: round2A,
      teamBScore: round2B,
      notes: `Skor Babak 2: ${round2A} - ${round2B}`
    };

    const r3: RoundScore | undefined = hasRound3
      ? {
          teamAScore: round3A,
          teamBScore: round3B,
          notes: `Skor Babak 3: ${round3A} - ${round3B}`
        }
      : undefined;

    let finalWinner = winnerRtId;
    if (finalize && !finalWinner) {
      // Determine winner automatically based on aggregate or round wins
      const totalA = round1A + round2A + (r3 ? round3A : 0);
      const totalB = round1B + round2B + (r3 ? round3B : 0);
      if (totalA > totalB) finalWinner = match.teamA.rtId;
      else if (totalB > totalA) finalWinner = match.teamB.rtId;
    }

    let timelineEvent: Omit<MatchTimelineItem, 'id'> | undefined = undefined;
    if (timelineText.trim()) {
      timelineEvent = {
        time: `B${currentRound} ${new Date().toLocaleTimeString('id-ID', { minute: '2-digit', second: '2-digit' })}`,
        roundNumber: currentRound,
        text: timelineText.trim(),
        team: timelineTeam,
        type: timelineType
      };
    }

    updateMatchScore(
      match.id,
      r1,
      r2,
      r3,
      finalWinner,
      mvpAthleteId,
      timelineEvent,
      notes
    );

    if (finalize) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.5 } });
    }

    onClose();
  };

  const getRoundLabel = (r: 1 | 2 | 3) => {
    if (r === 1) return sport?.roundLabels.round1 || 'Babak Pertama';
    if (r === 2) return sport?.roundLabels.round2 || 'Babak Kedua';
    return sport?.roundLabels.round3 || 'Babak Ketiga (Penentu)';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
              <Radio className="w-5 h-5 animate-pulse text-rose-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Scorekeeper & Pengelola Babak Real-Time
                </h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {sport?.name}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {match.stage.replace('_', ' ').toUpperCase()} · Lokasi: {match.venue}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Match Scoreboard Head-to-Head Banner */}
          <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
            <div className="grid grid-cols-5 items-center text-center">
              
              {/* Team A */}
              <div className="col-span-2 space-y-1">
                <div
                  className="w-4 h-4 rounded-full mx-auto"
                  style={{ backgroundColor: contingentA?.color || '#94a3b8' }}
                />
                <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {match.teamA.label}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {contingentA?.code || 'RT A'}
                </div>
              </div>

              {/* Score Display */}
              <div className="col-span-1 space-y-1">
                <div className="text-2xl font-black font-mono tracking-tight text-indigo-600 dark:text-indigo-400">
                  {round1A + round2A + (hasRound3 ? round3A : 0)} - {round1B + round2B + (hasRound3 ? round3B : 0)}
                </div>
                <div className="text-[10px] uppercase font-mono text-slate-400 tracking-wider">
                  Total Agregat
                </div>
              </div>

              {/* Team B */}
              <div className="col-span-2 space-y-1">
                <div
                  className="w-4 h-4 rounded-full mx-auto"
                  style={{ backgroundColor: contingentB?.color || '#94a3b8' }}
                />
                <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {match.teamB.label}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {contingentB?.code || 'RT B'}
                </div>
              </div>

            </div>
          </div>

          {/* Section: Scoring Per Babak (Babak 1 & Babak 2) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 font-mono">
                Detail Skor Babak Pertandingan ({sport?.scoreType})
              </h4>
              <button
                type="button"
                onClick={() => setHasRound3(prev => !prev)}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-mono"
              >
                {hasRound3 ? '- Hapus Babak 3' : '+ Tambah Babak 3 (Decider/OT)'}
              </button>
            </div>

            {/* Babak 1 */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                  01. {getRoundLabel(1)}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Skor: {round1A} - {round1B}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Team A Babak 1 */}
                <div className="space-y-1">
                  <label className="text-xs text-slate-600 dark:text-slate-400 truncate block">
                    {match.teamA.label.split(' - ')[0]}
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setRound1A(Math.max(0, round1A - 1))}
                      className="p-2 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="number"
                      min={0}
                      value={round1A}
                      onChange={e => setRound1A(Number(e.target.value) || 0)}
                      className="w-full text-center py-1.5 px-2 font-mono font-bold text-sm rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setRound1A(round1A + 1)}
                      className="p-2 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Team B Babak 1 */}
                <div className="space-y-1">
                  <label className="text-xs text-slate-600 dark:text-slate-400 truncate block">
                    {match.teamB.label.split(' - ')[0]}
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setRound1B(Math.max(0, round1B - 1))}
                      className="p-2 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="number"
                      min={0}
                      value={round1B}
                      onChange={e => setRound1B(Number(e.target.value) || 0)}
                      className="w-full text-center py-1.5 px-2 font-mono font-bold text-sm rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setRound1B(round1B + 1)}
                      className="p-2 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Babak 2 */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                  02. {getRoundLabel(2)}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Skor: {round2A} - {round2B}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Team A Babak 2 */}
                <div className="space-y-1">
                  <label className="text-xs text-slate-600 dark:text-slate-400 truncate block">
                    {match.teamA.label.split(' - ')[0]}
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setRound2A(Math.max(0, round2A - 1))}
                      className="p-2 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="number"
                      min={0}
                      value={round2A}
                      onChange={e => setRound2A(Number(e.target.value) || 0)}
                      className="w-full text-center py-1.5 px-2 font-mono font-bold text-sm rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setRound2A(round2A + 1)}
                      className="p-2 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Team B Babak 2 */}
                <div className="space-y-1">
                  <label className="text-xs text-slate-600 dark:text-slate-400 truncate block">
                    {match.teamB.label.split(' - ')[0]}
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setRound2B(Math.max(0, round2B - 1))}
                      className="p-2 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="number"
                      min={0}
                      value={round2B}
                      onChange={e => setRound2B(Number(e.target.value) || 0)}
                      className="w-full text-center py-1.5 px-2 font-mono font-bold text-sm rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setRound2B(round2B + 1)}
                      className="p-2 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Babak 3 (If Decider) */}
            {hasRound3 && (
              <div className="p-4 rounded-xl border border-amber-300 dark:border-amber-900/60 bg-amber-50/30 dark:bg-amber-950/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 font-mono">
                    03. {getRoundLabel(3)}
                  </span>
                  <span className="text-xs text-amber-600 dark:text-amber-400 font-mono">
                    Skor: {round3A} - {round3B}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Team A Babak 3 */}
                  <div className="space-y-1">
                    <label className="text-xs text-slate-600 dark:text-slate-400 truncate block">
                      {match.teamA.label.split(' - ')[0]}
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setRound3A(Math.max(0, round3A - 1))}
                        className="p-2 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="number"
                        min={0}
                        value={round3A}
                        onChange={e => setRound3A(Number(e.target.value) || 0)}
                        className="w-full text-center py-1.5 px-2 font-mono font-bold text-sm rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setRound3A(round3A + 1)}
                        className="p-2 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Team B Babak 3 */}
                  <div className="space-y-1">
                    <label className="text-xs text-slate-600 dark:text-slate-400 truncate block">
                      {match.teamB.label.split(' - ')[0]}
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setRound3B(Math.max(0, round3B - 1))}
                        className="p-2 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="number"
                        min={0}
                        value={round3B}
                        onChange={e => setRound3B(Number(e.target.value) || 0)}
                        className="w-full text-center py-1.5 px-2 font-mono font-bold text-sm rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setRound3B(round3B + 1)}
                        className="p-2 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Timeline Event Logger */}
          <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 font-mono">
              Tambah Catatan Peristiwa Real-Time (Timeline Feed)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <select
                value={timelineTeam}
                onChange={e => setTimelineTeam(e.target.value as any)}
                className="text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="A">{match.teamA.label.split(' - ')[0]}</option>
                <option value="B">{match.teamB.label.split(' - ')[0]}</option>
                <option value="neutral">Netral / Wasit</option>
              </select>

              <select
                value={timelineType}
                onChange={e => setTimelineType(e.target.value as any)}
                className="text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="score">Skor / Poin / Gol</option>
                <option value="kill">Kill / Eliminasi</option>
                <option value="tower">Objektif (Tower / Lord)</option>
                <option value="penalty">Pelanggaran / Kartu</option>
                <option value="pause">Jeda Waktu / Timeout</option>
              </select>

              <input
                type="text"
                placeholder="Contoh: Triple Kill oleh Ling menit 12'"
                value={timelineText}
                onChange={e => setTimelineText(e.target.value)}
                className="sm:col-span-2 text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Winner & MVP Athlete Designation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span>Pemenang Pertandingan (Lolos Babak)</span>
              </label>
              <select
                value={winnerRtId}
                onChange={e => setWinnerRtId(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
              >
                <option value="">-- Masih Berlangsung / Belum Ada --</option>
                <option value={match.teamA.rtId}>Pemenang: {match.teamA.label}</option>
                <option value={match.teamB.rtId}>Pemenang: {match.teamB.label}</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-indigo-500" />
                <span>Pemain Terbaik (MVP Match)</span>
              </label>
              <select
                value={mvpAthleteId}
                onChange={e => setMvpAthleteId(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
              >
                <option value="">-- Pilih Atlet MVP --</option>
                {availableAthletes.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.fullName} ({a.nickname}) · {a.rtId.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes by Referee */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Catatan Resmi Wasit / Panitia Pertandingan
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Catatan tambahan teknis, sanksi, atau kondisi arena..."
              className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            Tutup
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleSave(false)}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-800 transition-colors flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Status Live</span>
            </button>

            <button
              type="button"
              onClick={() => handleSave(true)}
              className="px-4 py-2 text-xs font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Finalisasi & Loloskan Pemenang</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
