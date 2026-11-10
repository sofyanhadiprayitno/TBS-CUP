import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import { CommitteeMember, Referee } from '../../types';
import { ImageUploadField } from '../common/ImageUploadField';
import {
  Users2,
  Shield,
  Star,
  CheckCircle2,
  Clock,
  Phone,
  Plus,
  Edit2,
  Trash2,
  X,
  Mail,
  Award,
  AlertTriangle
} from 'lucide-react';

export const CommitteeAndRefereesManager: React.FC = () => {
  const {
    committee,
    referees,
    sports,
    addCommitteeMember,
    updateCommitteeMember,
    deleteCommitteeMember,
    updateCommitteeStatus,
    addReferee,
    updateReferee,
    deleteReferee,
    activeRole
  } = useTournament();

  const [activeTab, setActiveTab] = useState<'committee' | 'referees'>('committee');

  // Committee Modal States
  const [showAddCommittee, setShowAddCommittee] = useState(false);
  const [editingCommittee, setEditingCommittee] = useState<CommitteeMember | null>(null);
  const [committeeToDelete, setCommitteeToDelete] = useState<CommitteeMember | null>(null);

  // Committee Form State
  const [comFullName, setComFullName] = useState('');
  const [comRole, setComRole] = useState('');
  const [comDivision, setComDivision] = useState<CommitteeMember['division']>('Acara');
  const [comRtOrigin, setComRtOrigin] = useState('RT 01');
  const [comPhone, setComPhone] = useState('');

  // Referee Modal States
  const [showAddReferee, setShowAddReferee] = useState(false);
  const [editingReferee, setEditingReferee] = useState<Referee | null>(null);
  const [refereeToDelete, setRefereeToDelete] = useState<Referee | null>(null);

  // Referee Form State
  const [refFullName, setRefFullName] = useState('');
  const [refSports, setRefSports] = useState<string[]>([sports[0]?.id || 'sp-mlbb']);
  const [refLicense, setRefLicense] = useState('');
  const [refPhone, setRefPhone] = useState('');
  const [refEmail, setRefEmail] = useState('');
  const [refRating, setRefRating] = useState<number>(4.9);
  const [refAvatar, setRefAvatar] = useState('');

  const canManage = activeRole === 'super_admin' || activeRole === 'ketua_panitia';

  // Committee Handlers
  const handleAddCommittee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comFullName.trim() || !comRole.trim()) return;

    addCommitteeMember({
      fullName: comFullName.trim(),
      role: comRole.trim(),
      division: comDivision,
      rtOrigin: comRtOrigin,
      phone: comPhone.trim() || '0812-0000-0000',
      attendanceStatus: 'present'
    });

    setComFullName('');
    setComRole('');
    setComPhone('');
    setShowAddCommittee(false);
  };

  const handleUpdateCommittee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCommittee) return;
    updateCommitteeMember(editingCommittee);
    setEditingCommittee(null);
  };

  const handleDeleteCommittee = () => {
    if (committeeToDelete) {
      deleteCommitteeMember(committeeToDelete.id);
      setCommitteeToDelete(null);
    }
  };

  // Referee Handlers
  const handleAddReferee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refFullName.trim()) return;

    addReferee({
      fullName: refFullName.trim(),
      sportIds: refSports,
      license: refLicense.trim() || 'Wasit Tingkat RW / Daerah',
      phone: refPhone.trim() || '0811-0000-0000',
      email: refEmail.trim() || 'wasit@rw08.org',
      assignedCount: 0,
      rating: refRating,
      avatarUrl: refAvatar || 'https://images.unsplash.com/photo-1534528741775?w=100&auto=format&fit=crop&q=80'
    });

    setRefFullName('');
    setRefLicense('');
    setRefPhone('');
    setRefEmail('');
    setRefAvatar('');
    setShowAddReferee(false);
  };

  const handleUpdateReferee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReferee) return;
    updateReferee(editingReferee);
    setEditingReferee(null);
  };

  const handleDeleteReferee = () => {
    if (refereeToDelete) {
      deleteReferee(refereeToDelete.id);
      setRefereeToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-500 font-semibold tracking-wider uppercase mb-1">
            <Users2 className="w-4 h-4" />
            <span>Struktur Organisasi & Korps Pengadil</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Panitia Pelaksana & Korps Wasit
          </h2>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
            <span>Presensi & Tugas Lapangan</span>
            <span aria-hidden="true">·</span>
            <span>Lisensi & Penugasan Pertandingan</span>
          </div>
        </div>

        {/* Tab switch & Add buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => setActiveTab('committee')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'committee'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Panitia ({committee.length})
            </button>
            <button
              onClick={() => setActiveTab('referees')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'referees'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Wasit / Scorer ({referees.length})
            </button>
          </div>

          {canManage && (
            <button
              onClick={() => {
                if (activeTab === 'committee') setShowAddCommittee(true);
                else setShowAddReferee(true);
              }}
              className="px-3.5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{activeTab === 'committee' ? 'Tambah Panitia' : 'Tambah Wasit'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab 1: Committee Table */}
      {activeTab === 'committee' && (
        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-mono">
                <tr>
                  <th className="py-3 px-4 font-semibold">Nama Panitia</th>
                  <th className="py-3 px-4 font-semibold">Jabatan & Peran</th>
                  <th className="py-3 px-4 font-semibold">Divisi</th>
                  <th className="py-3 px-4 font-semibold">Asal RT</th>
                  <th className="py-3 px-4 font-semibold">Kontak WhatsApp</th>
                  <th className="py-3 px-4 font-semibold text-center">Status Kehadiran / Presensi</th>
                  <th className="py-3 px-4 font-semibold text-right">Aksi Menu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {committee.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      {c.fullName}
                    </td>
                    <td className="py-3.5 px-4 text-indigo-600 dark:text-indigo-400 font-medium">
                      {c.role}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {c.division}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                      {c.rtOrigin}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400">
                      {c.phone}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono">
                      {canManage ? (
                        <select
                          value={c.attendanceStatus}
                          onChange={e => updateCommitteeStatus(c.id, e.target.value as any)}
                          className="text-[11px] font-semibold py-1 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                        >
                          <option value="present">🟢 Hadir di Arena</option>
                          <option value="duty">🔵 Bertugas Lapangan</option>
                          <option value="absent">⚪ Izin / Absen</option>
                        </select>
                      ) : (
                        <span className="text-[11px] font-bold">
                          {c.attendanceStatus === 'present' ? '🟢 Hadir' : c.attendanceStatus === 'duty' ? '🔵 Tugas' : '⚪ Izin'}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {canManage && (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setEditingCommittee(c)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Edit Data Panitia"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setCommitteeToDelete(c)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Hapus Panitia"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Referees Cards */}
      {activeTab === 'referees' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {referees.map(r => (
            <div
              key={r.id}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between space-y-4 hover:border-indigo-400/50 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={r.avatarUrl || 'https://images.unsplash.com/photo-1534528741775?w=100&auto=format&fit=crop&q=80'}
                      alt={r.fullName}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                    />
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                        {r.fullName}
                      </h3>
                      <div className="text-xs text-indigo-600 dark:text-indigo-400 font-mono">
                        {r.license}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 font-mono text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-lg">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{r.rating.toFixed(1)}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1 pt-1">
                  <div className="flex items-center gap-1.5 font-mono">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{r.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{r.email}</span>
                  </div>
                </div>

                {/* Assigned Sports */}
                <div className="pt-2 flex flex-wrap gap-1">
                  {r.sportIds.map(sId => {
                    const sp = sports.find(s => s.id === sId);
                    return (
                      <span
                        key={sId}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                      >
                        {sp?.name || sId}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Card Footer with Edit / Delete */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500">
                  {r.assignedCount} Match Dipimpin
                </span>

                {canManage && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingReferee(r)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Edit Data Wasit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setRefereeToDelete(r)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Hapus Wasit"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Tambah Panitia */}
      {showAddCommittee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users2 className="w-5 h-5 text-indigo-500" />
                <span>Tambah Anggota Panitia Pelaksana</span>
              </h3>
              <button onClick={() => setShowAddCommittee(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCommittee} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Nama Lengkap Panitia *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={comFullName}
                  onChange={e => setComFullName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Jabatan / Tugas *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Koordinator Perlengkapan"
                    value={comRole}
                    onChange={e => setComRole(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Divisi
                  </label>
                  <select
                    value={comDivision}
                    onChange={e => setComDivision(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="BPH">BPH (Pengurus Harian)</option>
                    <option value="Acara">Seksi Acara</option>
                    <option value="Pertandingan">Seksi Pertandingan</option>
                    <option value="Humas">Seksi Humas & Publikasi</option>
                    <option value="Perlengkapan">Seksi Perlengkapan / IT</option>
                    <option value="Konsumsi">Seksi Konsumsi</option>
                    <option value="Keamanan">Seksi Keamanan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Asal Rukun Tetangga (RT)
                  </label>
                  <input
                    type="text"
                    value={comRtOrigin}
                    onChange={e => setComRtOrigin(e.target.value)}
                    placeholder="RT 03"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    No. WhatsApp
                  </label>
                  <input
                    type="text"
                    value={comPhone}
                    onChange={e => setComPhone(e.target.value)}
                    placeholder="0812-xxxx-xxxx"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddCommittee(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md"
                >
                  Simpan Panitia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Panitia */}
      {editingCommittee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-indigo-500" />
                <span>Edit Data Panitia: {editingCommittee.fullName}</span>
              </h3>
              <button onClick={() => setEditingCommittee(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateCommittee} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={editingCommittee.fullName}
                  onChange={e => setEditingCommittee({ ...editingCommittee, fullName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Jabatan / Peran
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCommittee.role}
                    onChange={e => setEditingCommittee({ ...editingCommittee, role: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Divisi
                  </label>
                  <select
                    value={editingCommittee.division}
                    onChange={e => setEditingCommittee({ ...editingCommittee, division: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="BPH">BPH (Pengurus Harian)</option>
                    <option value="Acara">Seksi Acara</option>
                    <option value="Pertandingan">Seksi Pertandingan</option>
                    <option value="Humas">Seksi Humas & Publikasi</option>
                    <option value="Perlengkapan">Seksi Perlengkapan / IT</option>
                    <option value="Konsumsi">Seksi Konsumsi</option>
                    <option value="Keamanan">Seksi Keamanan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Asal RT
                  </label>
                  <input
                    type="text"
                    value={editingCommittee.rtOrigin}
                    onChange={e => setEditingCommittee({ ...editingCommittee, rtOrigin: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    No. WhatsApp
                  </label>
                  <input
                    type="text"
                    value={editingCommittee.phone}
                    onChange={e => setEditingCommittee({ ...editingCommittee, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingCommittee(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100"
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

      {/* Modal: Tambah Wasit */}
      {showAddReferee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-500" />
                <span>Tambah Wasit / Scorer Pertandingan</span>
              </h3>
              <button onClick={() => setShowAddReferee(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddReferee} className="space-y-4 text-xs">
              <ImageUploadField
                label="Foto Profil Wasit"
                value={refAvatar}
                onChange={url => setRefAvatar(url)}
                aspectRatio="square"
              />

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Nama Lengkap Wasit *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Wasit Gilang Ramadan"
                  value={refFullName}
                  onChange={e => setRefFullName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Lisensi / Sertifikasi Wasit
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Certified IESPA Scorer / Lisensi PBSI B"
                  value={refLicense}
                  onChange={e => setRefLicense(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    No. WhatsApp / HP
                  </label>
                  <input
                    type="text"
                    placeholder="0811-xxxx-xxxx"
                    value={refPhone}
                    onChange={e => setRefPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="wasit@gmail.com"
                    value={refEmail}
                    onChange={e => setRefEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddReferee(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md"
                >
                  Simpan Wasit Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Wasit */}
      {editingReferee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-indigo-500" />
                <span>Edit Data Wasit: {editingReferee.fullName}</span>
              </h3>
              <button onClick={() => setEditingReferee(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateReferee} className="space-y-4 text-xs">
              <ImageUploadField
                label="Foto Profil Wasit"
                value={editingReferee.avatarUrl || ''}
                onChange={url => setEditingReferee({ ...editingReferee, avatarUrl: url })}
                aspectRatio="square"
              />

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Nama Lengkap Wasit
                </label>
                <input
                  type="text"
                  required
                  value={editingReferee.fullName}
                  onChange={e => setEditingReferee({ ...editingReferee, fullName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Lisensi / Sertifikasi Wasit
                </label>
                <input
                  type="text"
                  value={editingReferee.license}
                  onChange={e => setEditingReferee({ ...editingReferee, license: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    No. WhatsApp
                  </label>
                  <input
                    type="text"
                    value={editingReferee.phone}
                    onChange={e => setEditingReferee({ ...editingReferee, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editingReferee.email}
                    onChange={e => setEditingReferee({ ...editingReferee, email: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingReferee(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100"
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

      {/* Confirmation Modal: Delete Committee */}
      {committeeToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Hapus Anggota Panitia?
              </h3>
              <p className="text-xs text-slate-500">
                Apakah Anda yakin ingin menghapus <strong>{committeeToDelete.fullName}</strong> ({committeeToDelete.role})?
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCommitteeToDelete(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteCommittee}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 text-white hover:bg-rose-500 shadow-md"
              >
                Hapus Panitia
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Delete Referee */}
      {refereeToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Hapus Data Wasit?
              </h3>
              <p className="text-xs text-slate-500">
                Apakah Anda yakin ingin menghapus wasit <strong>{refereeToDelete.fullName}</strong>?
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRefereeToDelete(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteReferee}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 text-white hover:bg-rose-500 shadow-md"
              >
                Hapus Wasit
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
