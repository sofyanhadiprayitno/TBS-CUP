import React, { useRef } from 'react';
import { Match, SportBranch, RTContingent } from '../../types';
import { Printer, X, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface OfficialMatchReportModalProps {
  match: Match | null;
  sport: SportBranch | undefined;
  teamA: RTContingent | undefined;
  teamB: RTContingent | undefined;
  refereeName?: string;
  mvpName?: string;
  onClose: () => void;
  eventTitle?: string;
  seasonYear?: string;
}

export const OfficialMatchReportModal: React.FC<OfficialMatchReportModalProps> = ({
  match,
  sport,
  teamA,
  teamB,
  refereeName,
  mvpName,
  onClose,
  eventTitle = 'TURNAMEN E-SPORTS & OLAHRAGA ANTAR RT RW 08',
  seasonYear = 'Musim 2025 / 2026',
}) => {
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!match) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(match.scheduledTime).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const formattedTime = new Date(match.scheduledTime).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const scoreA = match.totalScoreA ?? (match as any).scoreA ?? 0;
  const scoreB = match.totalScoreB ?? (match as any).scoreB ?? 0;
  const r1A = match.round1?.teamAScore ?? (match as any).round1ScoreA ?? 0;
  const r1B = match.round1?.teamBScore ?? (match as any).round1ScoreB ?? 0;
  const r2A = match.round2?.teamAScore ?? (match as any).round2ScoreA ?? 0;
  const r2B = match.round2?.teamBScore ?? (match as any).round2ScoreB ?? 0;
  const winnerId = match.winnerRtId ?? (match as any).winnerId;
  const winner = winnerId === teamA?.id ? teamA : winnerId === teamB?.id ? teamB : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white print:fixed print:inset-0">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-8 print:border-none print:shadow-none print:bg-white print:text-black print:my-0 print:max-w-none print:w-full">
        {/* Modal Top Actions (Hidden on Print) */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-slate-900/95 border-b border-slate-800 backdrop-blur print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-semibold text-white">
              Surat Berita Acara Hasil Pertandingan (BAHP)
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
              #{match.id.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl shadow-sm transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Official Printable Document Content */}
        <div ref={printAreaRef} className="p-8 md:p-12 print:p-8 bg-slate-900 text-slate-100 print:bg-white print:text-slate-900 font-sans">
          {/* Print Kop Surat */}
          <div className="border-b-4 border-double border-slate-700 print:border-black pb-6 mb-6">
            <div className="flex items-center justify-between gap-4">
              <div className="w-16 h-16 rounded-xl bg-amber-500/20 border border-amber-500/40 print:border-black flex items-center justify-center font-bold text-2xl text-amber-400 print:text-black">
                {sport?.iconName || '🏆'}
              </div>
              <div className="text-center flex-1">
                <h1 className="text-xl md:text-2xl font-black uppercase tracking-wider text-white print:text-black">
                  PANITIA PELAKSANA TURNAMEN
                </h1>
                <h2 className="text-base md:text-lg font-bold text-amber-400 print:text-black">
                  {eventTitle}
                </h2>
                <p className="text-xs text-slate-400 print:text-slate-600">
                  Sekretariat: Gedung Serbaguna RW 08 • Kontak Panitia: 0812-3456-7890 • {seasonYear}
                </p>
              </div>
              <div className="w-16 h-16 rounded-xl bg-slate-800 border border-slate-700 print:border-black flex flex-col items-center justify-center text-xs text-slate-400 print:text-black">
                <span className="font-bold text-white print:text-black">RW 08</span>
                <span className="text-[10px]">OFFICIAL</span>
              </div>
            </div>
          </div>

          {/* Letter Title & Document ID */}
          <div className="text-center mb-6">
            <h3 className="text-lg font-extrabold uppercase tracking-wide underline decoration-amber-500 decoration-2 underline-offset-4 text-white print:text-black">
              BERITA ACARA HASIL PERTANDINGAN
            </h3>
            <p className="text-xs font-mono text-slate-400 print:text-slate-700 mt-1">
              Nomor: BAHP/{sport?.id.toUpperCase() || 'CABOR'}/{match.stage.toUpperCase()}/{match.id.toUpperCase()}/{new Date().getFullYear()}
            </p>
          </div>

          {/* Opening Paragraph */}
          <p className="text-xs md:text-sm leading-relaxed text-slate-300 print:text-slate-800 mb-6">
            Pada hari ini, <strong className="text-white print:text-black">{formattedDate}</strong> bertempat di <strong className="text-white print:text-black">{match.venue || (match as any).arenaLocation || 'Arena Utama RW 08'}</strong>, telah dilaksanakan pertandingan resmi turnamen antar Rukun Tetangga (RT) dengan rincian data sebagai berikut:
          </p>

          {/* Match Meta Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 print:bg-slate-50 print:border-slate-300 text-xs mb-6">
            <div>
              <span className="text-slate-400 print:text-slate-500 block">Cabang Olahraga:</span>
              <strong className="text-amber-300 print:text-black text-sm">{sport?.name || 'Umum'} ({sport?.category || '-'})</strong>
            </div>
            <div>
              <span className="text-slate-400 print:text-slate-500 block">Babak / Fase:</span>
              <strong className="text-white print:text-black text-sm capitalize">{match.stage.replace(/_/g, ' ')}</strong>
            </div>
            <div>
              <span className="text-slate-400 print:text-slate-500 block">Waktu Mulai:</span>
              <strong className="text-white print:text-black text-sm">{formattedTime} WIB</strong>
            </div>
            <div>
              <span className="text-slate-400 print:text-slate-500 block">Wasit / Juri:</span>
              <strong className="text-white print:text-black text-sm">{refereeName || 'Wasit Utama Cabor'}</strong>
            </div>
          </div>

          {/* Match Score Board Box */}
          <div className="border border-slate-700 print:border-slate-400 rounded-xl overflow-hidden mb-6">
            <div className="bg-slate-800 print:bg-slate-200 px-4 py-2 border-b border-slate-700 print:border-slate-400 flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 print:text-slate-800">
                Tabel Perolehan Poin / Skor Resmi
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 print:text-emerald-800">
                Status: {match.status.toUpperCase()}
              </span>
            </div>

            <table className="w-full text-xs md:text-sm">
              <thead className="bg-slate-800/40 print:bg-slate-100 border-b border-slate-700/60 print:border-slate-300 text-slate-400 print:text-slate-700">
                <tr>
                  <th className="py-2.5 px-4 text-left font-semibold">Kontingen RT</th>
                  <th className="py-2.5 px-3 text-center font-semibold">Babak 1</th>
                  <th className="py-2.5 px-3 text-center font-semibold">Babak 2</th>
                  <th className="py-2.5 px-4 text-center font-bold text-amber-400 print:text-black">Skor Akhir</th>
                  <th className="py-2.5 px-4 text-center font-semibold">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-slate-200">
                <tr className={winnerId === teamA?.id ? 'bg-amber-500/10 print:bg-amber-50/50 font-bold' : ''}>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: teamA?.color || '#3b82f6' }} />
                      <span className="text-white print:text-black">{teamA?.name || match.teamA?.label || 'Kontingen A'}</span>
                      {winnerId === teamA?.id && (
                        <span className="text-[10px] bg-amber-400 text-slate-950 font-extrabold px-1.5 py-0.5 rounded ml-1">
                          PEMENANG
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center font-mono">{r1A}</td>
                  <td className="py-3 px-3 text-center font-mono">{r2A}</td>
                  <td className="py-3 px-4 text-center font-mono text-base font-black text-amber-400 print:text-black">
                    {scoreA}
                  </td>
                  <td className="py-3 px-4 text-center text-xs text-slate-400 print:text-slate-700">
                    {winnerId === teamA?.id ? 'Lolos / Menang' : winnerId === teamB?.id ? 'Gugur' : 'Selesai'}
                  </td>
                </tr>

                <tr className={winnerId === teamB?.id ? 'bg-amber-500/10 print:bg-amber-50/50 font-bold' : ''}>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: teamB?.color || '#ef4444' }} />
                      <span className="text-white print:text-black">{teamB?.name || match.teamB?.label || 'Kontingen B'}</span>
                      {winnerId === teamB?.id && (
                        <span className="text-[10px] bg-amber-400 text-slate-950 font-extrabold px-1.5 py-0.5 rounded ml-1">
                          PEMENANG
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center font-mono">{r1B}</td>
                  <td className="py-3 px-3 text-center font-mono">{r2B}</td>
                  <td className="py-3 px-4 text-center font-mono text-base font-black text-amber-400 print:text-black">
                    {scoreB}
                  </td>
                  <td className="py-3 px-4 text-center text-xs text-slate-400 print:text-slate-700">
                    {winnerId === teamB?.id ? 'Lolos / Menang' : winnerId === teamA?.id ? 'Gugur' : 'Selesai'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Match Notes, MVP, Incidents */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-xs">
            <div className="p-3.5 rounded-lg bg-slate-800/40 border border-slate-700/60 print:bg-slate-50 print:border-slate-300">
              <span className="font-semibold text-slate-300 print:text-slate-800 block mb-1">
                Catatan / Insiden Khusus Pertandingan:
              </span>
              <p className="text-slate-400 print:text-slate-700 italic">
                {match.notes || 'Pertandingan berjalan dengan tertib, aman, dan menjunjung tinggi sportivitas serta nilai fair-play.'}
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-800/40 border border-slate-700/60 print:bg-slate-50 print:border-slate-300">
              <span className="font-semibold text-slate-300 print:text-slate-800 block mb-1">
                Pemain Terbaik (Man of the Match / MVP):
              </span>
              <div className="flex items-center gap-2 text-amber-400 print:text-black font-semibold">
                <Award className="w-4 h-4 text-amber-400" />
                <span>{mvpName ? `${mvpName} (${winner?.name || 'Pemenang'})` : 'Ditentukan oleh Dewan Wasit Cabor'}</span>
              </div>
            </div>
          </div>

          {/* Statement of Validity */}
          <p className="text-xs leading-relaxed text-slate-400 print:text-slate-700 mb-8">
            Demikian Berita Acara Hasil Pertandingan ini dibuat dengan sebenar-benarnya tanpa ada paksaan dari pihak manapun, ditandatangani oleh para pihak yang bertanding dan disahkan oleh Wasit serta Panitia Turnamen untuk dipergunakan sebagaimana mestinya.
          </p>

          {/* Four Signature Columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-xs pt-4 border-t border-slate-800 print:border-slate-300">
            {/* Captain Team A */}
            <div className="flex flex-col justify-between h-28">
              <div>
                <p className="text-slate-400 print:text-slate-600">Kapten / Perwakilan</p>
                <p className="font-semibold text-white print:text-black">{teamA?.name || match.teamA?.label || 'Tim A'}</p>
              </div>
              <div>
                <div className="w-24 mx-auto border-b border-dashed border-slate-600 print:border-black mb-1" />
                <p className="text-[10px] text-slate-400 print:text-slate-600">( Tanda Tangan & Nama )</p>
              </div>
            </div>

            {/* Captain Team B */}
            <div className="flex flex-col justify-between h-28">
              <div>
                <p className="text-slate-400 print:text-slate-600">Kapten / Perwakilan</p>
                <p className="font-semibold text-white print:text-black">{teamB?.name || match.teamB?.label || 'Tim B'}</p>
              </div>
              <div>
                <div className="w-24 mx-auto border-b border-dashed border-slate-600 print:border-black mb-1" />
                <p className="text-[10px] text-slate-400 print:text-slate-600">( Tanda Tangan & Nama )</p>
              </div>
            </div>

            {/* Main Referee */}
            <div className="flex flex-col justify-between h-28">
              <div>
                <p className="text-slate-400 print:text-slate-600">Wasit Utama / Scorer</p>
                <p className="font-semibold text-white print:text-black">{refereeName || 'Dewan Wasit'}</p>
              </div>
              <div>
                <div className="w-24 mx-auto border-b border-dashed border-slate-600 print:border-black mb-1" />
                <p className="text-[10px] text-slate-400 print:text-slate-600">( Tanda Tangan & Nama )</p>
              </div>
            </div>

            {/* Committee Chairman */}
            <div className="flex flex-col justify-between h-28">
              <div>
                <p className="text-slate-400 print:text-slate-600">Mengetahui,</p>
                <p className="font-semibold text-white print:text-black">Ketua Panitia RW 08</p>
              </div>
              <div>
                <div className="w-24 mx-auto border-b border-dashed border-slate-600 print:border-black mb-1" />
                <p className="text-[10px] text-slate-400 print:text-slate-600">Bpk. Hendra Gunawan, S.T.</p>
              </div>
            </div>
          </div>

          {/* Footer Timestamp & Verification */}
          <div className="mt-8 pt-4 border-t border-slate-800/80 print:border-slate-300 flex items-center justify-between text-[10px] text-slate-400 print:text-slate-600">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Dokumen Resmi Terverifikasi Sistem Pertandingan Antar RT
            </span>
            <span>Dicetak secara digital: {new Date().toLocaleString('id-ID')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
