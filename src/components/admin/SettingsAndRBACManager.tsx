import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import { UserAccount, Season, UserRole } from '../../types';
import { ImageUploadField } from '../common/ImageUploadField';
import {
  Settings,
  Users,
  Calendar,
  Image,
  Shield,
  KeyRound,
  Check,
  Plus,
  Edit2,
  Trash2,
  Trophy,
  Sparkles,
  AlertTriangle,
  X
} from 'lucide-react';

export const SettingsAndRBACManager: React.FC = () => {
  const {
    identity,
    updateIdentity,
    seasons,
    currentSeason,
    setSeason,
    users,
    addUser,
    updateUser,
    deleteUser,
    activeRole,
    currentUser
  } = useTournament();

  const [activeTab, setActiveTab] = useState<'identity' | 'seasons' | 'users' | 'recovery'>('identity');

  // Identity Form State
  const [name, setName] = useState(identity.name);
  const [slogan, setSlogan] = useState(identity.slogan);
  const [organizer, setOrganizer] = useState(identity.organizer);
  const [location, setLocation] = useState(identity.location);
  const [contactWa, setContactWa] = useState(identity.contactWa);
  const [contactEmail, setContactEmail] = useState(identity.contactEmail);
  const [logoUrl, setLogoUrl] = useState(identity.logoUrl);
  const [siteIconUrl, setSiteIconUrl] = useState(identity.siteIconUrl);
  const [bannerUrl, setBannerUrl] = useState(identity.bannerUrl || '');
  const [trophyImageUrl, setTrophyImageUrl] = useState(identity.trophyImageUrl || '');
  const [saveIdentitySuccess, setSaveIdentitySuccess] = useState(false);

  // User CRUD states
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserAccount | null>(null);

  // New/Edit User Form State
  const [userUsername, setUserUsername] = useState('');
  const [userFullName, setUserFullName] = useState('');
  const [userRole, setUserRole] = useState<UserRole>('wasit');
  const [userEmail, setUserEmail] = useState('');
  const [userPass, setUserPass] = useState('');

  // Password Recovery Simulator
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryStatus, setRecoveryStatus] = useState<string | null>(null);

  const handleSaveIdentity = (e: React.FormEvent) => {
    e.preventDefault();
    updateIdentity({
      name,
      slogan,
      organizer,
      location,
      contactWa,
      contactEmail,
      logoUrl,
      siteIconUrl,
      bannerUrl,
      trophyImageUrl
    });
    setSaveIdentitySuccess(true);
    setTimeout(() => setSaveIdentitySuccess(false), 2500);
  };

  const handleOpenAddUser = () => {
    setUserUsername('');
    setUserFullName('');
    setUserRole('wasit');
    setUserEmail('');
    setUserPass('');
    setIsAddUserOpen(true);
  };

  const handleOpenEditUser = (u: UserAccount) => {
    setEditingUser(u);
    setUserUsername(u.username);
    setUserFullName(u.fullName);
    setUserRole(u.role);
    setUserEmail(u.email);
    setUserPass(u.passwordHash);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userUsername.trim() || !userFullName.trim()) return;

    if (editingUser) {
      updateUser({
        ...editingUser,
        username: userUsername.trim().toLowerCase(),
        fullName: userFullName.trim(),
        role: userRole,
        email: userEmail.trim() || `${userUsername}@rw08.org`,
        passwordHash: userPass || editingUser.passwordHash
      });
      setEditingUser(null);
    } else {
      addUser({
        username: userUsername.trim().toLowerCase(),
        fullName: userFullName.trim(),
        role: userRole,
        email: userEmail.trim() || `${userUsername}@rw08.org`,
        passwordHash: userPass || 'password123',
        status: 'active'
      });
      setIsAddUserOpen(false);
    }
  };

  const handleConfirmDeleteUser = () => {
    if (deletingUser) {
      deleteUser(deletingUser.id);
      setDeletingUser(null);
    }
  };

  const handleRecoverPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail.trim()) return;

    const found = users.find(
      u =>
        u.email.toLowerCase() === recoveryEmail.toLowerCase().trim() ||
        u.username.toLowerCase() === recoveryEmail.toLowerCase().trim()
    );
    if (found) {
      setRecoveryStatus(
        `Tautan reset kata sandi telah dikirimkan ke email ${found.email}. Kata sandi akun Anda: "${found.passwordHash}".`
      );
    } else {
      setRecoveryStatus('Akun dengan username atau email tersebut tidak ditemukan dalam sistem RW 08.');
    }
  };

  const canEdit = activeRole === 'super_admin' || activeRole === 'ketua_panitia';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-500" />
            <span>Pengaturan Identitas Acara, Banner, Trofi & Hak Akses (RBAC)</span>
          </h2>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-2">
            <span>Upload Hero Banner & Logo</span>
            <span aria-hidden="true">·</span>
            <span>Foto Trofi Juara</span>
            <span aria-hidden="true">·</span>
            <span>Manajemen Pengguna (Tambah, Edit, Hapus)</span>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
          <button
            onClick={() => setActiveTab('identity')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'identity'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Identitas & Gambar
          </button>
          <button
            onClick={() => setActiveTab('seasons')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'seasons'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Musim & Tahun
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'users'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            User & RBAC ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('recovery')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'recovery'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Pemulihan Akun
          </button>
        </div>
      </div>

      {/* Tab 1: Identity & Full Image Upload Settings */}
      {activeTab === 'identity' && (
        <form onSubmit={handleSaveIdentity} className="space-y-6 max-w-4xl">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Pengaturan Identitas Utama Turnamen</span>
              </h3>
              <span className="text-xs font-mono text-slate-400">Musim Aktif: {identity.season}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Nama Resmi Turnamen
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Penyelenggara / Panitia Induk
                </label>
                <input
                  type="text"
                  value={organizer}
                  onChange={e => setOrganizer(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Slogan / Tema Acara
              </label>
              <input
                type="text"
                value={slogan}
                onChange={e => setSlogan(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Lokasi Pusat Turnamen / Arena Utama
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Nomor WhatsApp Hotline Panitia
                </label>
                <input
                  type="text"
                  value={contactWa}
                  onChange={e => setContactWa(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Image Upload Gallery Settings */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Image className="w-4 h-4 text-amber-500" />
                <span>Pengaturan Upload Gambar & Visual Branding Turnamen</span>
              </h3>
              <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">Mendukung File Lokal & Preset HD</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hero Banner Upload */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Image className="w-3.5 h-3.5 text-indigo-500" /> Banner Utama Panggung (Hero Header)
                </span>
                <ImageUploadField
                  label="Foto Banner Panggung (16:9)"
                  value={bannerUrl}
                  onChange={setBannerUrl}
                  aspectRatio="banner"
                  presetOptions={[
                    { label: 'Stage E-Sports HD', url: '/src/assets/images/hero_esports_championship_1794294147972.jpg' },
                    { label: 'Gaming Cyber Arena', url: '/src/assets/images/cabor_esports_gaming_1794294148716.jpg' }
                  ]}
                />
              </div>

              {/* Trophy Emblem Upload */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-amber-500" /> Foto Trofi Juara Bergilir
                </span>
                <ImageUploadField
                  label="Foto Trofi / Piala Emas"
                  value={trophyImageUrl}
                  onChange={setTrophyImageUrl}
                  aspectRatio="square"
                  presetOptions={[
                    { label: 'Piala Bergilir Emas', url: '/src/assets/images/trophy_gold_cup_1794294149443.jpg' }
                  ]}
                />
              </div>

              {/* Logo Turnamen Upload */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-500" /> Logo Resmi Turnamen
                </span>
                <ImageUploadField
                  label="Logo Turnamen RW 08"
                  value={logoUrl}
                  onChange={setLogoUrl}
                  aspectRatio="square"
                  presetOptions={[
                    { label: 'Piala Turnamen', url: '/src/assets/images/trophy_gold_cup_1794294149443.jpg' }
                  ]}
                />
              </div>

              {/* Favicon Website Upload */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-500" /> Icon Website / Profil (Favicon)
                </span>
                <ImageUploadField
                  label="Icon Web Profil"
                  value={siteIconUrl}
                  onChange={setSiteIconUrl}
                  aspectRatio="square"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              {saveIdentitySuccess ? (
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 animate-fadeIn">
                  <Check className="w-4 h-4" /> Pengaturan identitas dan gambar berhasil disimpan!
                </span>
              ) : (
                <span className="text-xs text-slate-400">Pastikan resolusi gambar proporsional</span>
              )}

              <button
                type="submit"
                className="px-6 py-2.5 font-bold text-xs rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md transition-all flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Simpan Seluruh Pengaturan</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Tab 2: Seasons & Year Management */}
      {activeTab === 'seasons' && (
        <div className="space-y-4 max-w-3xl">
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-500" />
              <span>Pilihan Musim & Tahun Turnamen</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pilih musim yang aktif atau lihat rekam jejak turnamen tahun-tahun sebelumnya secara historis.
            </p>
          </div>

          <div className="space-y-3">
            {seasons.map(s => {
              const isActive = s.id === currentSeason.id;
              return (
                <div
                  key={s.id}
                  className={`p-4 rounded-xl border transition-all flex items-center justify-between ${
                    isActive
                      ? 'border-amber-500 bg-amber-50/20 dark:bg-amber-950/20'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {s.name}
                      </h4>
                      {isActive && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold uppercase">
                          Musim Aktif Sekarang
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">
                      Tahun: {s.year} · Periode: {s.startDate} s/d {s.endDate}
                    </div>
                  </div>

                  {!isActive && (
                    <button
                      onClick={() => setSeason(s.id)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      Beralih ke Musim Ini
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Users & Role-Based Access Control (RBAC) with Tambah, Edit, Hapus */}
      {activeTab === 'users' && (
        <div className="space-y-6 max-w-5xl">
          {/* RBAC Info Card */}
          <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 text-xs text-indigo-900 dark:text-indigo-200 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold flex items-center gap-1.5 text-indigo-950 dark:text-indigo-100">
                <Shield className="w-4 h-4 text-amber-500" />
                <span>Hierarki Hak Akses Pengurus & Panitia (RBAC):</span>
              </h4>
              {canEdit && (
                <button
                  onClick={handleOpenAddUser}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors flex items-center gap-1 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Tambah Akun Pengurus</span>
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
              <div className="p-2 rounded-lg bg-white/50 dark:bg-slate-900/50 border border-indigo-200/50 dark:border-indigo-900/50">
                <strong>Super Admin</strong>: Akses tak terbatas & reset
              </div>
              <div className="p-2 rounded-lg bg-white/50 dark:bg-slate-900/50 border border-indigo-200/50 dark:border-indigo-900/50">
                <strong>Ketua Panitia</strong>: Kelola cabor & wasit
              </div>
              <div className="p-2 rounded-lg bg-white/50 dark:bg-slate-900/50 border border-indigo-200/50 dark:border-indigo-900/50">
                <strong>Wasit / Scorer</strong>: Skor babak 1 & 2
              </div>
              <div className="p-2 rounded-lg bg-white/50 dark:bg-slate-900/50 border border-indigo-200/50 dark:border-indigo-900/50">
                <strong>Bendahara</strong>: RAB, kas & nota SPJ
              </div>
            </div>
          </div>

          {/* User Table with Edit & Hapus Buttons */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-mono">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Username</th>
                    <th className="py-3 px-4 font-semibold">Nama Lengkap</th>
                    <th className="py-3 px-4 font-semibold">Peran Hak Akses</th>
                    <th className="py-3 px-4 font-semibold">Email</th>
                    <th className="py-3 px-4 font-semibold text-center">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-mono">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        {u.username}
                      </td>
                      <td className="py-3 px-4 font-sans font-medium text-slate-800 dark:text-slate-200">
                        {u.fullName}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 font-bold uppercase text-[10px] border border-amber-200/50 dark:border-amber-800/50">
                          {u.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {u.email}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[10px] uppercase">
                          AKTIF
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1 font-sans">
                          <button
                            onClick={() => handleOpenEditUser(u)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-lg transition-colors"
                            title="Edit Akun"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingUser(u)}
                            disabled={users.length <= 1}
                            className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-lg transition-colors disabled:opacity-30 disabled:pointer-events-none"
                            title="Hapus Akun"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Account Password Recovery */}
      {activeTab === 'recovery' && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 max-w-xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Pemulihan Akun Panitia (Lupa Kata Sandi)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ketikkan email terdaftar atau username Anda untuk memulihkan akses ke sistem.
              </p>
            </div>
          </div>

          <form onSubmit={handleRecoverPassword} className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Username atau Alamat Email Pengurus
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: admin, wasit, atau ketua.panitia@rw08.org"
                value={recoveryEmail}
                onChange={e => setRecoveryEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 font-bold text-xs rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-colors"
            >
              Kirim Tautan Pemulihan Kata Sandi
            </button>

            {recoveryStatus && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-mono">
                {recoveryStatus}
              </div>
            )}
          </form>
        </div>
      )}

      {/* Modal Add / Edit User */}
      {(isAddUserOpen || editingUser) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-fadeIn">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-500" />
                <span>{editingUser ? 'Edit Akun Pengguna' : 'Tambah Akun Pengurus / Wasit Baru'}</span>
              </h3>
              <button
                onClick={() => {
                  setIsAddUserOpen(false);
                  setEditingUser(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Username Akun
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: wasit_mlbb"
                  value={userUsername}
                  onChange={e => setUserUsername(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Rian Anggara"
                  value={userFullName}
                  onChange={e => setUserFullName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Peran Hak Akses (RBAC)
                </label>
                <select
                  value={userRole}
                  onChange={e => setUserRole(e.target.value as UserRole)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                >
                  <option value="wasit">Wasit / Match Scorer</option>
                  <option value="pengurus_rt">Admin Kontingen RT</option>
                  <option value="bendahara">Bendahara Keuangan</option>
                  <option value="ketua_panitia">Ketua Panitia</option>
                  <option value="super_admin">Super Administrator</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="nama@rw08.org"
                  value={userEmail}
                  onChange={e => setUserEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Minimal 6 karakter"
                  value={userPass}
                  onChange={e => setUserPass(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddUserOpen(false);
                    setEditingUser(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm"
                >
                  {editingUser ? 'Simpan Perubahan' : 'Buat Pengguna'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirm Delete User */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-xl text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Hapus Akun Pengguna?
                </h4>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                  Apakah Anda yakin ingin menghapus user <strong>{deletingUser.fullName}</strong> ({deletingUser.username})?
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="px-3.5 py-1.5 font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteUser}
                className="px-4 py-1.5 font-bold rounded-lg bg-rose-600 hover:bg-rose-500 text-white shadow-sm"
              >
                Hapus Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
