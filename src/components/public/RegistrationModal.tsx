import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import { AthleteRole } from '../../types';
import {
  UserPlus,
  X,
  CheckCircle2,
  ShieldCheck,
  Gamepad2,
  FileCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface RegistrationModalProps {
  onClose: () => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({ onClose }) => {
  const { identity, contingents, sports, registerAthlete } = useTournament();

  const [fullName, setFullName] = useState('');
  const [rtId, setRtId] = useState(contingents[0]?.id || 'rt-01');
  const [sportId, setSportId] = useState(sports[0]?.id || 'sp-mlbb');
  const [nickname, setNickname] = useState('');
  const [inGameId, setInGameId] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [nik, setNik] = useState('');
  const [role, setRole] = useState<AthleteRole>('Captain');

  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !nickname.trim() || !phone.trim()) return;

    registerAthlete({
      fullName,
      rtId,
      sportId,
      nickname,
      inGameId: inGameId || 'N/A',
      phone,
      email: email || `${nickname.toLowerCase().replace(/\s+/g, '')}@rw08.org`,
      nikMasked: nik.length >= 10 ? nik.slice(0, 6) + '******' + nik.slice(-4) : '327501******0099',
      birthDate: '2004-05-12',
      role,
      avatarUrl: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 80)}?w=100&auto=format&fit=crop&q=80`
    });

    setIsSuccess(true);
    confetti({ particleCount: 90, spread: 60, origin: { y: 0.6 } });
    setTimeout(() => {
      onClose();
    }, 2800);
  };

  const selectedSport = sports.find(s => s.id === sportId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Formulir Pendaftaran Atlet Warga Antar-RT
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pendaftaran otomatis terhubung ke sistem panitia & database Google Sheets
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

        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto animate-bounce" />
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">
              Pendaftaran Anda Berhasil Dikirim!
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
              Terima kasih <strong>{fullName}</strong>. Data Anda telah masuk ke daftar tunggu verifikasi domisili oleh pengurus {contingents.find(c => c.id === rtId)?.name}.
            </p>
            <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 pt-2">
              Status: Menunggu Verifikasi KTP / KK (Otomatis Masuk Google Sheets)
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {/* Cabor notice */}
            {selectedSport && (
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4 text-indigo-500" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedSport.name} ({selectedSport.format})
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">
                  Maks: {selectedSport.maxTeamMembers} Pemain/Tim
                </span>
              </div>
            )}

            <div>
              <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Nama Lengkap (Sesuai KTP / Kartu Keluarga) *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Muhammad Fajar Ramadhan"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Pilih Kontingen Asal RT Anda *
                </label>
                <select
                  value={rtId}
                  onChange={e => setRtId(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                >
                  {contingents.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Cabang Olahraga / Game *
                </label>
                <select
                  value={sportId}
                  onChange={e => setSportId(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                >
                  {sports.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Nickname / In-Game Name (IGN) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: ShadowSlayer"
                  value={nickname}
                  onChange={e => setNickname(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  User ID Game / Server ID
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 12345678 (2020)"
                  value={inGameId}
                  onChange={e => setInGameId(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Nomor WhatsApp Aktif *
                </label>
                <input
                  type="text"
                  required
                  placeholder="0812-xxxx-xxxx"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Nomor NIK (Verifikasi Warga RT) *
                </label>
                <input
                  type="text"
                  required
                  maxLength={16}
                  placeholder="16 digit NIK KTP Anda"
                  value={nik}
                  onChange={e => setNik(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Butuh bantuan pendaftaran?</span>
              <div className="flex items-center gap-3">
                {identity.contactWa && (
                  <a href={`https://wa.me/${identity.contactWa.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="text-emerald-600 dark:text-emerald-400 font-mono hover:underline">
                    WA: {identity.contactWa}
                  </a>
                )}
                {identity.contactEmail && (
                  <a href={`mailto:${identity.contactEmail}`} className="hover:underline">
                    {identity.contactEmail}
                  </a>
                )}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 flex items-start gap-2 text-indigo-900 dark:text-indigo-200 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <span>
                Data NIK & nomor kontak Anda dienkripsi secara aman dan hanya digunakan oleh Pengurus RT untuk memverifikasi domisili warga asli.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
              >
                <FileCheck className="w-4 h-4" />
                <span>Kirim Pendaftaran Atlet Mandiri</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
