import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import { Athlete, AthleteRole, AthleteVerificationStatus } from '../../types';
import { exportAthletesToCSV } from '../../utils/exportUtils';
import { ImageUploadField } from '../common/ImageUploadField';
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Plus,
  ShieldCheck,
  Award,
  Trash2,
  Edit2,
  Eye,
  UserCheck,
  X,
  Filter,
  Gamepad2,
  Sparkles,
  Phone,
  Mail,
  Calendar,
  CreditCard
} from 'lucide-react';

export const AthletesManager: React.FC = () => {
  const {
    athletes,
    contingents,
    sports,
    registerAthlete,
    updateAthlete,
    verifyAthlete,
    deleteAthlete,
    activeRole
  } = useTournament();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterRT, setFilterRT] = useState('all');
  const [filterSport, setFilterSport] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAthlete, setEditingAthlete] = useState<Athlete | null>(null);
  const [athleteToDelete, setAthleteToDelete] = useState<Athlete | null>(null);
  const [viewingAthlete, setViewingAthlete] = useState<Athlete | null>(null);

  // Add Form State
  const [fullName, setFullName] = useState('');
  const [rtId, setRtId] = useState(contingents[0]?.id || 'rt-01');
  const [sportId, setSportId] = useState(sports[0]?.id || 'sp-mlbb');
  const [nickname, setNickname] = useState('');
  const [inGameId, setInGameId] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [nik, setNik] = useState('');
  const [role, setRole] = useState<AthleteRole>('Member');
  const [avatarUrl, setAvatarUrl] = useState('');

  const contingentsMap: Record<string, string> = {};
  contingents.forEach(c => { contingentsMap[c.id] = c.name; });

  const sportsMap: Record<string, string> = {};
  sports.forEach(s => { sportsMap[s.id] = s.name; });

  const filteredAthletes = athletes.filter(a => {
    if (filterRT !== 'all' && a.rtId !== filterRT) return false;
    if (filterSport !== 'all' && a.sportId !== filterSport) return false;
    if (filterStatus !== 'all' && a.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const txt = `${a.fullName} ${a.nickname} ${a.inGameId} ${a.phone}`.toLowerCase();
      if (!txt.includes(q)) return false;
    }
    return true;
  });

  const handleAddAthlete = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !nickname.trim()) return;

    registerAthlete({
      fullName: fullName.trim(),
      rtId,
      sportId,
      nickname: nickname.trim(),
      inGameId: inGameId.trim() || 'N/A',
      phone: phone.trim() || '0812-0000-0000',
      email: email.trim() || `${nickname.toLowerCase()}@rw08.org`,
      nikMasked: nik.length >= 10 ? nik.slice(0, 6) + '******' + nik.slice(-4) : '327501******' + Math.floor(1000 + Math.random() * 9000),
      birthDate: '2003-01-01',
      role,
      avatarUrl: avatarUrl || `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 50)}?w=100&auto=format&fit=crop&q=80`
    });

    setFullName('');
    setNickname('');
    setInGameId('');
    setPhone('');
    setEmail('');
    setNik('');
    setAvatarUrl('');
    setShowAddModal(false);
  };

  const handleUpdateAthlete = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAthlete) return;
    updateAthlete(editingAthlete);
    setEditingAthlete(null);
  };

  const handleDeleteConfirm = () => {
    if (athleteToDelete) {
      deleteAthlete(athleteToDelete.id);
      setAthleteToDelete(null);
    }
  };

  const handleExportCSV = () => {
    exportAthletesToCSV(filteredAthletes, contingentsMap, sportsMap);
  };

  const canManage = activeRole === 'super_admin' || activeRole === 'ketua_panitia' || activeRole === 'pengurus_rt';

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-500 font-semibold tracking-wider uppercase mb-1">
            <Users className="w-4 h-4" />
            <span>Manajemen Tim & Verifikasi Warga</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Data Atlet & Roster Kontingen RT
          </h2>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
            <span>Verifikasi KTP/KK</span>
            <span aria-hidden="true">·</span>
            <span>Nickname Game & In-Game ID</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{athletes.length} Atlet Terdaftar</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 text-xs font-medium rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Ekspor Excel (.CSV)</span>
          </button>

          {canManage && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md hover:shadow-indigo-500/20 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Atlet & Tim Baru</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="relative sm:col-span-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Cari atlet, IGN, ID..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <select
          value={filterRT}
          onChange={e => setFilterRT(e.target.value)}
          className="text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium"
        >
          <option value="all">Semua Kontingen RT</option>
          {contingents.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select
          value={filterSport}
          onChange={e => setFilterSport(e.target.value)}
          className="text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium"
        >
          <option value="all">Semua Cabang Olahraga</option>
          {sports.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium"
        >
          <option value="all">Semua Status Verifikasi</option>
          <option value="verified">✅ Valid Terverifikasi</option>
          <option value="pending">⏳ Menunggu Verifikasi</option>
          <option value="rejected">❌ Ditolak / Tidak Sah</option>
        </select>
      </div>

      {/* Athletes Data Table */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-mono">
              <tr>
                <th className="py-3 px-4 font-semibold">Atlet & Foto</th>
                <th className="py-3 px-4 font-semibold">Kontingen RT</th>
                <th className="py-3 px-4 font-semibold">Cabor & Peran</th>
                <th className="py-3 px-4 font-semibold">IGN & ID Game</th>
                <th className="py-3 px-4 font-semibold">Statistik</th>
                <th className="py-3 px-4 font-semibold text-center">Status Verifikasi</th>
                <th className="py-3 px-4 font-semibold text-right">Aksi Menu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredAthletes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Tidak ada atlet yang ditemukan berdasarkan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredAthletes.map(a => {
                  const contingent = contingents.find(c => c.id === a.rtId);
                  const sport = sports.find(s => s.id === a.sportId);

                  return (
                    <tr
                      key={a.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Athlete Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={a.avatarUrl}
                            alt={a.fullName}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0 shadow-xs"
                            onError={e => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80';
                            }}
                          />
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">
                              {a.fullName}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              NIK: {a.nikMasked}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contingent */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: contingent?.color || '#94a3b8' }}
                          />
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {contingent?.name || a.rtId}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          {a.phone}
                        </div>
                      </td>

                      {/* Sport & Role */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                          {sport?.name || a.sportId}
                        </div>
                        <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-mono mt-0.5">
                          {a.role === 'Captain' ? '👑 Kapten Tim' : a.role === 'Member' ? 'Anggota Inti' : 'Pemain Cadangan'}
                        </div>
                      </td>

                      {/* IGN & Game ID */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className="font-bold text-slate-900 dark:text-white">
                          "{a.nickname}"
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[130px]">
                          ID: {a.inGameId}
                        </div>
                      </td>

                      {/* Stats */}
                      <td className="py-3.5 px-4 font-mono tabular-nums text-slate-600 dark:text-slate-300">
                        <div>Main: {a.matchesPlayed} | Menang: {a.wins}</div>
                        <div className="text-[11px] text-amber-500 font-semibold flex items-center gap-1 mt-0.5">
                          <Award className="w-3 h-3" /> MVP: {a.mvpCount}x
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center font-mono">
                        {a.status === 'verified' ? (
                          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Valid KTP
                          </span>
                        ) : a.status === 'pending' ? (
                          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold flex items-center justify-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> Verifikasi
                          </span>
                        ) : (
                          <span className="text-[11px] text-rose-500 font-semibold flex items-center justify-center gap-1">
                            <XCircle className="w-3.5 h-3.5" /> Ditolak
                          </span>
                        )}
                      </td>

                      {/* Actions: Lihat, Edit, Tambah, Hapus */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* 1. Lihat (View KTA / Detail) */}
                          <button
                            onClick={() => setViewingAthlete(a)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-sky-400 hover:bg-sky-500/10 transition-colors"
                            title="Lihat Detail & KTA Atlet"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {canManage && (
                            <>
                              {/* 2. Edit */}
                              <button
                                onClick={() => setEditingAthlete(a)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                                title="Edit Data Atlet"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              {/* 3. Tambah (Quick add for this RT/Cabor) */}
                              <button
                                onClick={() => {
                                  setRtId(a.rtId);
                                  setSportId(a.sportId);
                                  setShowAddModal(true);
                                }}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                                title="Tambah Atlet di RT Ini"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>

                              {/* 4. Hapus */}
                              <button
                                onClick={() => setAthleteToDelete(a)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                                title="Hapus Atlet"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}

                          {canManage && a.status !== 'verified' && (
                            <button
                              onClick={() => verifyAthlete(a.id, 'verified')}
                              className="ml-1 px-2 py-1 text-[11px] font-semibold rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25"
                              title="Setujui Verifikasi Domisili"
                            >
                              Setujui
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

      {/* Modal 1: Tambah Atlet Baru */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-indigo-500" />
                <span>Tambah Atlet & Anggota Tim Baru</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAthlete} className="space-y-4 text-xs">
              
              {/* Photo Upload */}
              <ImageUploadField
                label="Foto Profil Atlet / Avatar"
                value={avatarUrl}
                onChange={url => setAvatarUrl(url)}
                aspectRatio="square"
                presetOptions={[
                  { label: 'Avatar 1', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80' },
                  { label: 'Avatar 2', url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80' },
                  { label: 'Avatar 3', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' }
                ]}
              />

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Nama Lengkap Sesuai KTP / KK *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Muhammad Rizky Pratama"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Kontingen RT *
                  </label>
                  <select
                    value={rtId}
                    onChange={e => setRtId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    {contingents.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Cabang Olahraga *
                  </label>
                  <select
                    value={sportId}
                    onChange={e => setSportId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    {sports.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Nickname / IGN *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="SkyWalker"
                    value={nickname}
                    onChange={e => setNickname(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    User ID Game
                  </label>
                  <input
                    type="text"
                    placeholder="48291039 (2910)"
                    value={inGameId}
                    onChange={e => setInGameId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Nomor WhatsApp / HP
                  </label>
                  <input
                    type="text"
                    placeholder="0813-xxxx-xxxx"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Posisi / Peran Tim
                  </label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value as AthleteRole)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="Captain">👑 Kapten Tim</option>
                    <option value="Member">Anggota Inti</option>
                    <option value="Substitute">Pemain Cadangan</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md"
                >
                  Simpan Atlet Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Edit Atlet */}
      {editingAthlete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-indigo-500" />
                <span>Edit Data Atlet: {editingAthlete.fullName}</span>
              </h3>
              <button
                onClick={() => setEditingAthlete(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateAthlete} className="space-y-4 text-xs">
              
              <ImageUploadField
                label="Foto Profil Atlet"
                value={editingAthlete.avatarUrl}
                onChange={url => setEditingAthlete({ ...editingAthlete, avatarUrl: url })}
                aspectRatio="square"
              />

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={editingAthlete.fullName}
                  onChange={e => setEditingAthlete({ ...editingAthlete, fullName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Kontingen RT
                  </label>
                  <select
                    value={editingAthlete.rtId}
                    onChange={e => setEditingAthlete({ ...editingAthlete, rtId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    {contingents.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Cabang Olahraga
                  </label>
                  <select
                    value={editingAthlete.sportId}
                    onChange={e => setEditingAthlete({ ...editingAthlete, sportId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    {sports.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Nickname (IGN)
                  </label>
                  <input
                    type="text"
                    required
                    value={editingAthlete.nickname}
                    onChange={e => setEditingAthlete({ ...editingAthlete, nickname: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    ID Game
                  </label>
                  <input
                    type="text"
                    value={editingAthlete.inGameId}
                    onChange={e => setEditingAthlete({ ...editingAthlete, inGameId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Peran Tim
                  </label>
                  <select
                    value={editingAthlete.role}
                    onChange={e => setEditingAthlete({ ...editingAthlete, role: e.target.value as AthleteRole })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="Captain">👑 Kapten Tim</option>
                    <option value="Member">Anggota Inti</option>
                    <option value="Substitute">Pemain Cadangan</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Status Verifikasi KTP
                  </label>
                  <select
                    value={editingAthlete.status}
                    onChange={e => setEditingAthlete({ ...editingAthlete, status: e.target.value as AthleteVerificationStatus })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="verified">✅ Valid Terverifikasi</option>
                    <option value="pending">⏳ Menunggu Verifikasi</option>
                    <option value="rejected">❌ Ditolak</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingAthlete(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Hapus Atlet Konfirmasi */}
      {athleteToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Hapus Data Atlet?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Apakah Anda yakin ingin menghapus <strong>{athleteToDelete.fullName} ({athleteToDelete.nickname})</strong>? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAthleteToDelete(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 text-white hover:bg-rose-500 shadow-md"
              >
                Ya, Hapus Atlet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: Lihat Detail & KTA Atlet Digital */}
      {viewingAthlete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-8 text-slate-100">
            {/* Header Badge Card */}
            <div className="relative p-6 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 border-b border-slate-800">
              <button
                onClick={() => setViewingAthlete(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono font-bold tracking-wider uppercase mb-2">
                <CreditCard className="w-4 h-4" />
                <span>Kartu Tanda Anggota Atlet (KTA Digital)</span>
              </div>

              <div className="flex items-center gap-4 mt-3">
                <img
                  src={viewingAthlete.avatarUrl}
                  alt={viewingAthlete.fullName}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-lg"
                  onError={e => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80';
                  }}
                />
                <div>
                  <h4 className="text-lg font-bold text-white">
                    {viewingAthlete.fullName}
                  </h4>
                  <div className="text-sm font-mono text-indigo-400 font-semibold">
                    "{viewingAthlete.nickname}"
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    NIK: {viewingAthlete.nikMasked}
                  </div>
                </div>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-6 space-y-4 text-xs">
              {/* Status & Role Pill */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div>
                  <span className="text-slate-400 block text-[11px]">Status KTP Warga:</span>
                  {viewingAthlete.status === 'verified' ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Terverifikasi Sah RW 08
                    </span>
                  ) : viewingAthlete.status === 'pending' ? (
                    <span className="text-amber-400 font-bold flex items-center gap-1 mt-0.5">
                      <Clock className="w-3.5 h-3.5" /> Menunggu Konfirmasi RT
                    </span>
                  ) : (
                    <span className="text-rose-400 font-bold flex items-center gap-1 mt-0.5">
                      <XCircle className="w-3.5 h-3.5" /> Berkas Ditolak
                    </span>
                  )}
                </div>

                <div className="text-right">
                  <span className="text-slate-400 block text-[11px]">Peran Skuad:</span>
                  <span className="font-bold text-amber-400 mt-0.5 block">
                    {viewingAthlete.role === 'Captain' ? '👑 Kapten Tim' : viewingAthlete.role === 'Member' ? 'Pemain Inti' : 'Pemain Cadangan'}
                  </span>
                </div>
              </div>

              {/* Grid Info */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50 font-mono">
                <div>
                  <span className="text-slate-400 text-[10px] block">KONTINGEN RT</span>
                  <span className="font-bold text-white text-xs">
                    {contingentsMap[viewingAthlete.rtId] || viewingAthlete.rtId}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">CABANG OLAHRAGA</span>
                  <span className="font-bold text-amber-300 text-xs">
                    {sportsMap[viewingAthlete.sportId] || viewingAthlete.sportId}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">IN-GAME ID (IGN)</span>
                  <span className="font-bold text-indigo-300 text-xs truncate block">
                    {viewingAthlete.inGameId}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">KONTAK WHATSAPP</span>
                  <span className="font-bold text-emerald-400 text-xs">
                    {viewingAthlete.phone}
                  </span>
                </div>
              </div>

              {/* Match Stats Box */}
              <div className="p-3.5 rounded-xl bg-slate-800/30 border border-slate-700/40">
                <span className="text-slate-400 text-[11px] font-semibold block mb-2">
                  Statistik Rekam Jejak Turnamen
                </span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono">
                  <div className="p-2 rounded-lg bg-slate-800/80">
                    <span className="text-[10px] text-slate-400 block">Tanding</span>
                    <strong className="text-sm text-white">{viewingAthlete.matchesPlayed}</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-800/80">
                    <span className="text-[10px] text-slate-400 block">Menang</span>
                    <strong className="text-sm text-emerald-400">{viewingAthlete.wins}</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-800/80">
                    <span className="text-[10px] text-slate-400 block">MVP</span>
                    <strong className="text-sm text-amber-400 flex items-center justify-center gap-1">
                      <Award className="w-3 h-3" /> {viewingAthlete.mvpCount}x
                    </strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons in Modal */}
              <div className="flex items-center justify-between pt-2">
                <div className="text-[10px] text-slate-400 font-mono">
                  ID: #{viewingAthlete.id.toUpperCase()}
                </div>
                <div className="flex items-center gap-2">
                  {canManage && (
                    <button
                      onClick={() => {
                        const target = viewingAthlete;
                        setViewingAthlete(null);
                        setEditingAthlete(target);
                      }}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit Data</span>
                    </button>
                  )}
                  <button
                    onClick={() => setViewingAthlete(null)}
                    className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
