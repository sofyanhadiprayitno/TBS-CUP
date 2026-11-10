import React from 'react';
import { useTournament } from '../../context/TournamentContext';
import { exportStandingsToCSV, printOfficialReport } from '../../utils/exportUtils';
import {
  Trophy,
  Medal,
  Award,
  Download,
  Printer,
  TrendingUp,
  Sparkles
} from 'lucide-react';

export const StandingsManager: React.FC = () => {
  const { contingents, identity } = useTournament();

  const sortedContingents = [...contingents].sort((a, b) => {
    if (b.gold !== a.gold) return b.gold - a.gold;
    if (b.silver !== a.silver) return b.silver - a.silver;
    if (b.bronze !== a.bronze) return b.bronze - a.bronze;
    return b.points - a.points;
  });

  const handlePrintPDF = () => {
    const tableRows = sortedContingents.map((c, idx) => `
      <tr>
        <td style="text-align: center; font-weight: bold;">${idx + 1}</td>
        <td><strong>${c.code}</strong> - ${c.name}</td>
        <td>${c.ketuaRT}</td>
        <td style="text-align: center; font-weight: bold; color: #b45309;">${c.gold}</td>
        <td style="text-align: center; font-weight: bold; color: #64748b;">${c.silver}</td>
        <td style="text-align: center; font-weight: bold; color: #b45309;">${c.bronze}</td>
        <td style="text-align: center; font-weight: bold;">${c.points}</td>
      </tr>
    `).join('');

    const html = `
      <p>Klasemen resmi perolehan medali dan total poin Turnamen Antar RT RW 08 Cempaka Indah musim ${identity.season}.</p>
      <table>
        <thead>
          <tr>
            <th style="width: 40px; text-align: center;">Rank</th>
            <th>Kontingen RT</th>
            <th>Ketua RT</th>
            <th style="text-align: center;">Emas (🥇)</th>
            <th style="text-align: center;">Perak (🥈)</th>
            <th style="text-align: center;">Perunggu (🥉)</th>
            <th style="text-align: center;">Poin Agregat</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
      <p style="font-size: 11px; margin-top: 15px;">
        *Catatan Perhitungan Poin: Medali Emas = 5 Poin, Perak = 3 Poin, Perunggu = 1 Poin, Menang Laga Penyisihan = 1 Poin.
      </p>
    `;

    printOfficialReport(`TABEL KLASEMEN & PEROLEHAN MEDALI - ${identity.name}`, html);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span>Klasemen Kontingen RT & Perolehan Medali</span>
          </h2>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
            <span>Perhitungan Medali Emas, Perak, Perunggu & Poin Agregat</span>
            <span aria-hidden="true">·</span>
            <span>Update Real-Time Otomatis</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportStandingsToCSV(contingents)}
            className="px-3.5 py-2 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor Excel (.CSV)</span>
          </button>
          <button
            onClick={handlePrintPDF}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Laporan PDF</span>
          </button>
        </div>
      </div>

      {/* Podium Top 3 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Rank 2 */}
        {sortedContingents[1] && (
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between order-2 md:order-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center font-mono">
                  2
                </div>
                <span className="text-xs uppercase font-mono text-slate-400 font-semibold">Peringkat 2</span>
              </div>
              <Medal className="w-5 h-5 text-slate-400" />
            </div>

            <div className="my-3">
              <div className="text-base font-bold text-slate-900 dark:text-white">
                {sortedContingents[1].name}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Ketua RT: {sortedContingents[1].ketuaRT}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100 dark:border-slate-800 font-mono">
              <span className="text-amber-500 font-bold">{sortedContingents[1].gold} Emas</span>
              <span className="text-slate-400 font-bold">{sortedContingents[1].silver} Perak</span>
              <span className="text-amber-700 font-bold">{sortedContingents[1].bronze} Perunggu</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">{sortedContingents[1].points} Pts</span>
            </div>
          </div>
        )}

        {/* Rank 1 - Champion */}
        {sortedContingents[0] && (
          <div className="p-4 rounded-xl border-2 border-amber-500/60 bg-gradient-to-b from-amber-500/10 to-transparent dark:bg-slate-900 flex flex-col justify-between order-1 md:order-2 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-amber-500 text-white font-bold text-sm flex items-center justify-center font-mono shadow">
                  1
                </div>
                <span className="text-xs uppercase font-mono text-amber-600 dark:text-amber-400 font-bold">
                  Pimpinan Klasemen
                </span>
              </div>
              <Trophy className="w-6 h-6 text-amber-500" />
            </div>

            <div className="my-3">
              <div className="text-lg font-black text-slate-900 dark:text-white">
                {sortedContingents[0].name}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Ketua RT: {sortedContingents[0].ketuaRT}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-3 border-t border-amber-500/20 font-mono">
              <span className="text-amber-500 font-bold text-sm">{sortedContingents[0].gold} 🥇</span>
              <span className="text-slate-400 font-bold text-sm">{sortedContingents[0].silver} 🥈</span>
              <span className="text-amber-700 font-bold text-sm">{sortedContingents[0].bronze} 🥉</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">{sortedContingents[0].points} Pts</span>
            </div>
          </div>
        )}

        {/* Rank 3 */}
        {sortedContingents[2] && (
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between order-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-amber-800/20 text-amber-700 dark:text-amber-400 font-bold text-xs flex items-center justify-center font-mono">
                  3
                </div>
                <span className="text-xs uppercase font-mono text-slate-400 font-semibold">Peringkat 3</span>
              </div>
              <Medal className="w-5 h-5 text-amber-700" />
            </div>

            <div className="my-3">
              <div className="text-base font-bold text-slate-900 dark:text-white">
                {sortedContingents[2].name}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Ketua RT: {sortedContingents[2].ketuaRT}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100 dark:border-slate-800 font-mono">
              <span className="text-amber-500 font-bold">{sortedContingents[2].gold} Emas</span>
              <span className="text-slate-400 font-bold">{sortedContingents[2].silver} Perak</span>
              <span className="text-amber-700 font-bold">{sortedContingents[2].bronze} Perunggu</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">{sortedContingents[2].points} Pts</span>
            </div>
          </div>
        )}
      </div>

      {/* Full Standings Table */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-mono">
              <tr>
                <th className="py-3 px-4 w-14 text-center font-semibold">Pos</th>
                <th className="py-3 px-4 font-semibold">Kontingen Rukun Tetangga (RT)</th>
                <th className="py-3 px-4 font-semibold">Ketua Kontingen</th>
                <th className="py-3 px-4 font-semibold text-center">🥇 Emas</th>
                <th className="py-3 px-4 font-semibold text-center">🥈 Perak</th>
                <th className="py-3 px-4 font-semibold text-center">🥉 Perunggu</th>
                <th className="py-3 px-4 font-semibold text-center">Total Medali</th>
                <th className="py-3 px-4 font-semibold text-right">Total Poin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {sortedContingents.map((c, idx) => {
                const totalMedals = c.gold + c.silver + c.bronze;
                return (
                  <tr
                    key={c.id}
                    className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors ${
                      idx === 0 ? 'bg-amber-500/5 font-medium' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-700 dark:text-slate-300">
                      {idx + 1}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-3.5 h-3.5 rounded-full shrink-0"
                          style={{ backgroundColor: c.color }}
                        />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">
                            {c.name}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            Maskot: {c.mascotName} · {c.code}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                      <div>{c.ketuaRT}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{c.phone}</div>
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono font-bold text-amber-500 tabular-nums text-sm">
                      {c.gold}
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-400 tabular-nums text-sm">
                      {c.silver}
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono font-bold text-amber-700 tabular-nums text-sm">
                      {c.bronze}
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-700 dark:text-slate-300 tabular-nums">
                      {totalMedals}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-indigo-600 dark:text-indigo-400 tabular-nums text-sm">
                      {c.points} Pts
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
