import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import { Match, StageType, MatchStatus } from '../../types';
import { ScoreModal } from './ScoreModal';
import { OfficialMatchReportModal } from '../common/OfficialMatchReportModal';
import { exportMatchesToCSV } from '../../utils/exportUtils';
import {
  Calendar,
  Clock,
  Plus,
  Search,
  Filter,
  Download,
  Edit3,
  Trash2,
  Radio,
  CheckCircle2,
  AlertCircle,
  FileText
} from 'lucide-react';

export const MatchManager: React.FC = () => {
  const {
    matches,
    sports,
    contingents,
    referees,
    athletes,
    identity,
    addMatch,
    deleteMatch,
    activeRole
  } = useTournament();

  const [activeScoreMatchId, setActiveScoreMatchId] = useState<string | null>(null);
  const [viewingReportMatch, setViewingReportMatch] = useState<Match | null>(null);
  const [filterSport, setFilterSport] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New Match Form State
  const [newSportId, setNewSportId] = useState<string>(sports[0]?.id || 'sp-mlbb');
  const [newStage, setNewStage] = useState<StageType>('quarter_final');
  const [newTeamA, setNewTeamA] = useState<string>(contingents[0]?.id || 'rt-01');
  const [newTeamB, setNewTeamB] = useState<string>(contingents[1]?.id || 'rt-02');
  const [newTime, setNewTime] = useState<string>('2026-08-16 14:00');
  const [newVenue, setNewVenue] = useState<string>('Main Stage Balai Warga RW 08');
  const [newReferee, setNewReferee] = useState<string>(referees[0]?.id || 'ref-01');

  const filteredMatches = matches.filter(m => {
    if (filterSport !== 'all' && m.sportId !== filterSport) return false;
    if (filterStatus !== 'all' && m.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = `${m.teamA.label} ${m.teamB.label} ${m.venue} ${m.id}`.toLowerCase();
      if (!matchText.includes(q)) return false;
    }
    return true;
  });

  const sportsMap: Record<string, string> = {};
  sports.forEach(s => { sportsMap[s.id] = s.name; });

  const contingentsMap: Record<string, string> = {};
  contingents.forEach(c => { contingentsMap[c.id] = c.name; });

  const handleExportCSV = () => {
    exportMatchesToCSV(filteredMatches, sportsMap, contingentsMap);
  };

  const handleCreateMatch = (e: React.FormEvent) => {
    e.preventDefault();
    const rtA = contingents.find(c => c.id === newTeamA);
    const rtB = contingents.find(c => c.id === newTeamB);

    const match: Match = {
      id: `match-${Date.now()}`,
      sportId: newSportId,
      stage: newStage,
      bracketIndex: Math.floor(Math.random() * 4),
      scheduledTime: newTime,
      venue: newVenue,
      refereeId: newReferee,
      teamA: { rtId: newTeamA, label: rtA?.name || 'RT A' },
      teamB: { rtId: newTeamB, label: rtB?.name || 'RT B' },
      status: 'scheduled',
      currentRound: 1,
      round1: { teamAScore: 0, teamBScore: 0 },
      round2: { teamAScore: 0, teamBScore: 0 },
      totalScoreA: 0,
      totalScoreB: 0,
      timeline: []
    };

    addMatch(match);
    setShowAddModal(false);
  };

  const canManage = activeRole === 'super_admin' || activeRole === 'ketua_panitia' || activeRole === 'wasit';

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Radio className="w-5 h-5 text-indigo-500" />
            <span>Manajemen Pertandingan & Skor Real-Time</span>
          </h2>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
            <span>Babak 1, Babak 2 & Babak Penentu</span>
            <span aria-hidden="true">·</span>
            <span>Sinkronisasi Google Sheets Terpadu</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">{matches.length} Total Laga Terjadwal</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor Excel (.CSV)</span>
          </button>

          {canManage && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Jadwalkan Laga Baru</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Cari tim, RT, ID laga atau arena pertandingan..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <select
          value={filterSport}
          onChange={e => setFilterSport(e.target.value)}
          className="text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
        >
          <option value="all">Semua Cabang Olahraga</option>
          {sports.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
        >
          <option value="all">Semua Status</option>
          <option value="live">🔴 Sedang Berlangsung (LIVE)</option>
          <option value="scheduled">⏳ Terjadwal / Mendatang</option>
          <option value="completed">✅ Selesai</option>
        </select>
      </div>

      {/* Match Table */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-mono">
              <tr>
                <th className="py-3 px-4 font-semibold">Cabor & Babak</th>
                <th className="py-3 px-4 font-semibold">Pertandingan (Tim A vs Tim B)</th>
                <th className="py-3 px-4 font-semibold text-center">Skor Babak 1</th>
                <th className="py-3 px-4 font-semibold text-center">Skor Babak 2</th>
                <th className="py-3 px-4 font-semibold text-center">Skor Total</th>
                <th className="py-3 px-4 font-semibold">Waktu & Arena</th>
                <th className="py-3 px-4 font-semibold text-center">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredMatches.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Tidak ada jadwal pertandingan yang sesuai filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredMatches.map(m => {
                  const sport = sports.find(s => s.id === m.sportId);
                  const isLive = m.status === 'live';
                  const isCompleted = m.status === 'completed';

                  return (
                    <tr
                      key={m.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Cabor & Stage */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: sport?.color || '#94a3b8' }}
                          />
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {sport?.name || m.sportId}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          {m.stage.replace('_', ' ').toUpperCase()}
                        </div>
                      </td>

                      {/* Teams */}
                      <td className="py-3 px-4 max-w-[240px]">
                        <div className="font-medium text-slate-900 dark:text-slate-100 truncate">
                          {m.teamA.label}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">vs</div>
                        <div className="font-medium text-slate-900 dark:text-slate-100 truncate">
                          {m.teamB.label}
                        </div>
                      </td>

                      {/* Babak 1 */}
                      <td className="py-3 px-4 text-center font-mono font-bold tabular-nums text-slate-700 dark:text-slate-300">
                        {m.round1.teamAScore} - {m.round1.teamBScore}
                      </td>

                      {/* Babak 2 */}
                      <td className="py-3 px-4 text-center font-mono font-bold tabular-nums text-slate-700 dark:text-slate-300">
                        {m.round2.teamAScore} - {m.round2.teamBScore}
                      </td>

                      {/* Total Score */}
                      <td className="py-3 px-4 text-center font-mono font-bold text-sm text-indigo-600 dark:text-indigo-400 tabular-nums">
                        {m.totalScoreA} - {m.totalScoreB}
                      </td>

                      {/* Waktu & Venue */}
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                        <div className="flex items-center gap-1 font-mono text-[11px]">
                          <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{m.scheduledTime}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[150px] mt-0.5">
                          📍 {m.venue}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center font-mono">
                        {isLive ? (
                          <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider animate-pulse flex items-center justify-center gap-1">
                            <Radio className="w-3 h-3" /> LIVE B{m.currentRound}
                          </span>
                        ) : isCompleted ? (
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center justify-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> SELESAI
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">
                            TERJADWAL
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Berita Acara (BAHP) Official Report */}
                          <button
                            onClick={() => setViewingReportMatch(m)}
                            className="px-2 py-1 text-xs font-semibold rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors flex items-center gap-1"
                            title="Cetak Berita Acara Hasil Pertandingan (BAHP)"
                          >
                            <FileText className="w-3 h-3" />
                            <span className="hidden sm:inline">Berita Acara</span>
                          </button>

                          {canManage && (
                            <button
                              onClick={() => setActiveScoreMatchId(m.id)}
                              className="px-2.5 py-1 text-xs font-medium rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors flex items-center gap-1"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Skor</span>
                            </button>
                          )}
                          {activeRole === 'super_admin' && (
                            <button
                              onClick={() => {
                                if (confirm(`Hapus pertandingan ${m.teamA.label} vs ${m.teamB.label}?`)) {
                                  deleteMatch(m.id);
                                }
                              }}
                              className="p-1 text-slate-400 hover:text-rose-500 transition-colors rounded"
                              title="Hapus Pertandingan"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Match Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-500" />
              <span>Jadwalkan Pertandingan Baru</span>
            </h3>

            <form onSubmit={handleCreateMatch} className="space-y-4 text-xs">
              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Cabang Olahraga / E-Sports
                </label>
                <select
                  value={newSportId}
                  onChange={e => setNewSportId(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {sports.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.format})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                    Kontingen Tim A
                  </label>
                  <select
                    value={newTeamA}
                    onChange={e => setNewTeamA(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    {contingents.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                    Kontingen Tim B
                  </label>
                  <select
                    value={newTeamB}
                    onChange={e => setNewTeamB(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    {contingents.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                    Babak / Fase
                  </label>
                  <select
                    value={newStage}
                    onChange={e => setNewStage(e.target.value as StageType)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="round_of_16">Penyisihan 16 Besar</option>
                    <option value="quarter_final">Delapan Besar (Perempat Final)</option>
                    <option value="semi_final">Empat Besar (Semifinal)</option>
                    <option value="third_place">Perebutan Juara 3 & 4</option>
                    <option value="final">Grand Final Juara 1 & 2</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                    Jadwal Waktu
                  </label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={e => setNewTime(e.target.value)}
                    placeholder="YYYY-MM-DD HH:mm"
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Arena / Lokasi Pertandingan
                </label>
                <input
                  type="text"
                  value={newVenue}
                  onChange={e => setNewVenue(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Wasit / Match Official
                </label>
                <select
                  value={newReferee}
                  onChange={e => setNewReferee(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {referees.map(r => (
                    <option key={r.id} value={r.id}>{r.fullName} ({r.license})</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm"
                >
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Score Keeper Modal */}
      {activeScoreMatchId && (
        <ScoreModal
          matchId={activeScoreMatchId}
          onClose={() => setActiveScoreMatchId(null)}
        />
      )}

      {/* Official Match Report Modal (BAHP) */}
      {viewingReportMatch && (
        <OfficialMatchReportModal
          match={viewingReportMatch}
          sport={sports.find(s => s.id === viewingReportMatch.sportId)}
          teamA={contingents.find(c => c.id === viewingReportMatch.teamA.rtId)}
          teamB={contingents.find(c => c.id === viewingReportMatch.teamB.rtId)}
          refereeName={referees.find(r => r.id === viewingReportMatch.refereeId)?.fullName}
          mvpName={athletes.find(a => a.id === viewingReportMatch.mvpAthleteId)?.fullName}
          eventTitle={identity.name}
          seasonYear={`${identity.season} (${identity.year})`}
          onClose={() => setViewingReportMatch(null)}
        />
      )}

    </div>
  );
};
