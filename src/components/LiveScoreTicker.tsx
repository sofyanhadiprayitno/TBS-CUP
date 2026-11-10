import React from 'react';
import { useTournament } from '../context/TournamentContext';
import { Radio, Calendar, CheckCircle2 } from 'lucide-react';

interface LiveScoreTickerProps {
  onSelectMatch: (matchId: string) => void;
}

export const LiveScoreTicker: React.FC<LiveScoreTickerProps> = ({ onSelectMatch }) => {
  const { matches, sports } = useTournament();

  const getSport = (id: string) => sports.find(s => s.id === id);

  const activeOrRecent = matches
    .filter(m => m.status === 'live' || m.status === 'completed' || m.status === 'scheduled')
    .slice(0, 6);

  if (activeOrRecent.length === 0) return null;

  return (
    <div className="w-full bg-slate-900 border-b border-slate-800 text-white overflow-hidden py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center gap-4">
        {/* Ticker Lead */}
        <div className="flex items-center gap-1.5 shrink-0 text-xs font-semibold text-rose-400">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span className="uppercase tracking-wider font-mono text-[11px]">Match Feed</span>
        </div>

        {/* Scrollable match ticker strip */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar scroll-smooth">
          {activeOrRecent.map(m => {
            const sport = getSport(m.sportId);
            const isLive = m.status === 'live';
            const isCompleted = m.status === 'completed';

            return (
              <button
                key={m.id}
                onClick={() => onSelectMatch(m.id)}
                className={`flex items-center gap-3 py-1 px-3 rounded-md text-xs font-medium border whitespace-nowrap transition-colors shrink-0 ${
                  isLive
                    ? 'bg-rose-950/40 border-rose-800/80 text-rose-200 hover:bg-rose-900/60'
                    : isCompleted
                    ? 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800/50'
                }`}
              >
                <span className="text-[11px] font-mono text-slate-400 truncate max-w-[90px]">
                  {sport?.name.split(' ')[0] || 'Game'}
                </span>

                <span className="text-slate-500">·</span>

                <span className="font-semibold text-slate-100">
                  {m.teamA.label.split(' - ')[0]}
                </span>

                <div className="font-mono font-bold px-1.5 py-0.5 rounded bg-black/40 text-amber-300 tabular-nums">
                  {isLive || isCompleted ? (
                    `${m.round1.teamAScore + m.round2.teamAScore} - ${m.round1.teamBScore + m.round2.teamBScore}`
                  ) : (
                    'VS'
                  )}
                </div>

                <span className="font-semibold text-slate-100">
                  {m.teamB.label.split(' - ')[0]}
                </span>

                {isLive && (
                  <span className="text-[10px] font-mono text-rose-400 uppercase tracking-wider animate-pulse">
                    LIVE B{m.currentRound}
                  </span>
                )}
                {isCompleted && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
