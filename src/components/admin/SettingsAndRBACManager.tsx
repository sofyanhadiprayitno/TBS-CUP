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
  X,
  Phone,
  Mail,
  RotateCcw,
  CheckCircle2,
  Database,
  Download,
  Upload,
  Copy,
  RefreshCw,
  FileCheck
} from 'lucide-react';

export const SettingsAndRBACManager: React.FC = () => {
  const {
    identity,
    updateIdentity,
    seasons,
    currentSeason,
    setSeason,
    addSeason,
    updateSeason,
    deleteSeason,
    users,
    addUser,
    updateUser,
    deleteUser,
    activeRole,
    currentUser,
    contingents,
    sports,
    athletes,
    matches,
    exportDatabaseBackup,
    restoreDatabaseBackup,
    resetAllData
  } = useTournament();

  const [activeTab, setActiveTab] = useState<'identity' | 'seasons' | 'users' | 'recovery' | 'backup'>('identity');

  // Backup & Reset State
  const [restoreJsonInput, setRestoreJsonInput] = useState('');
  const [restoreStatus, setRestoreStatus] = useState<string | null>(null);
  const [restoreError, setRestoreError] = useState<string | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetConfirmWord, setResetConfirmWord] = useState('');
  const [backupCopied, setBackupCopied] = useState(false);

  // Identity Form State
  const [name, setName] = useState(identity.name);
  const [seasonText, setSeasonText] = useState(identity.season);
  const [yearNum, setYearNum] = useState(identity.year || 2026);
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

  // Season CRUD states
  const [isAddSeasonOpen, setIsAddSeasonOpen] = useState(false);
  const [editingSeason, setEditingSeason] = useState<Season | null>(null);
  const [seasonToDelete, setSeasonToDelete] = useState<Season | null>(null);

  // New Season Form State
  const [newSeasonName, setNewSeasonName] = useState('');
  const [newSeasonYear, setNewSeasonYear] = useState(new Date().getFullYear());
  const [newSeasonStart, setNewSeasonStart] = useState('2026-08-01');
  const [newSeasonEnd, setNewSeasonEnd] = useState('2026-08-17');
  const [newSeasonSetCurrent, setNewSeasonSetCurrent] = useState(true);

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
      season: seasonText,
      year: yearNum,
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

  // Season Handlers
  const handleOpenAddSeason = () => {
    const nextYear = new Date().getFullYear();
    setNewSeasonName(`Musim ${nextYear} - Turnamen Kemerdekaan`);
    setNewSeasonYear(nextYear);
    setNewSeasonStart(`${nextYear}-08-01`);
    setNewSeasonEnd(`${nextYear}-08-17`);
    setNewSeasonSetCurrent(true);
    setIsAddSeasonOpen(true);
  };

  const handleCreateSeason = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSeasonName.trim()) return;

    addSeason({
      name: newSeasonName.trim(),
      year: Number(newSeasonYear),
      startDate: newSeasonStart,
      endDate: newSeasonEnd,
      isActive: newSeasonSetCurrent
    });

    setIsAddSeasonOpen(false);
  };

  const handleOpenEditSeason = (s: Season) => {
    setEditingSeason(s);
  };

  const handleSaveEditSeason = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSeason || !editingSeason.name.trim()) return;

    updateSeason(editingSeason);
    setEditingSeason(null);
  };

  const handleConfirmDeleteSeason = () => {
    if (seasonToDelete) {
      deleteSeason(seasonToDelete.id);
      setSeasonToDelete(null);
    }
  };

  // User Handlers
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
            <span>Edit Musim & Tahun</span>
            <span aria-hidden="true">·</span>
            <span>Kontak WhatsApp & Email</span>
            <span aria-hidden="true">·</span>
            <span>Upload Hero Banner, Trofi & Logo</span>
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
            Identitas & Kontak
          </button>
          <button
            onClick={() => setActiveTab('seasons')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'seasons'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Musim & Tahun ({seasons.length})
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
          <button
            onClick={() => setActiveTab('backup')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'backup'
                ? 'bg-rose-500 text-slate-950 font-black shadow-sm'
                : 'text-rose-400 hover:text-rose-300 hover:bg-rose-500/10'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Backup & Reset</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Identity, Season Editing & Contact Info Settings */}
      {activeTab === 'identity' && (
        <form onSubmit={handleSaveIdentity} className="space-y-6 max-w-4xl">
          {/* Main Tournament Information */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Pengaturan Identitas Utama Turnamen & Musim Aktif</span>
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                  Musim Aktif: {identity.season} ({identity.year})
                </span>
              </div>
            </div>

            {/* Multi-Season & Annual Event Explanatory Banner */}
            <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50 text-xs text-amber-950 dark:text-amber-200 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Sistem Multi-Musim & Penggunaan Kegiatan Tahunan:</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                Aplikasi ini dirancang untuk dapat dipakai terus menerus di setiap kegiatan tahunan (HUT RI, Porseni Warga, Turnamen Akhir Tahun, dsb.). Anda dapat mengubah nama musim aktif di bawah ini, atau mengelola riwayat musim pada tab <strong>Musim & Tahun</strong>.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Nama Resmi Turnamen *
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

            {/* Season and Year Editing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
              <div className="md:col-span-2">
                <label className="font-bold text-slate-900 dark:text-white block mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                  <span>Edit Nama Musim / Edisi Acara</span>
                </label>
                <input
                  type="text"
                  required
                  value={seasonText}
                  onChange={e => setSeasonText(e.target.value)}
                  placeholder="Contoh: Musim 2026 - HUT RI Ke-81"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-900 dark:text-white block mb-1">
                  Tahun Acara
                </label>
                <input
                  type="number"
                  required
                  min={2020}
                  max={2035}
                  value={yearNum}
                  onChange={e => setYearNum(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold"
                />
              </div>

              <div className="md:col-span-3 pt-1">
                <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                  Atau Beralih Cepat ke Koleksi Musim Terdaftar:
                </label>
                <div className="flex flex-wrap gap-2">
                  {seasons.map(s => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setSeason(s.id);
                        setSeasonText(s.name);
                        setYearNum(s.year);
                      }}
                      className={`px-3 py-1 text-xs font-mono rounded-lg border transition-all ${
                        s.name === seasonText
                          ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-amber-400'
                      }`}
                    >
                      {s.name} ({s.year})
                    </button>
                  ))}
                </div>
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

            {/* Official Contact Phone & Email Settings */}
            <div className="p-5 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Pengaturan Nomor Kontak & Email Resmi Panitia</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500">Tampil di Beranda & Formulir</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Nomor Kontak / WhatsApp Panitia *
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Contoh: 0812-3456-7890 atau 6281234567890"
                      value={contactWa}
                      onChange={e => setContactWa(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">Warga dapat mengklik nomor ini untuk chat langsung di WhatsApp.</span>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Alamat Email Resmi Panitia & Pengurus *
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="Contoh: panitia.turnamen@rw08.org"
                      value={contactEmail}
                      onChange={e => setContactEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">Digunakan untuk surat-menyurat resmi dan pendaftaran atlet.</span>
                </div>
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
                  <Check className="w-4 h-4" /> Pengaturan identitas, kontak, dan gambar berhasil disimpan!
                </span>
              ) : (
                <span className="text-xs text-slate-400">Pastikan nomor kontak & email aktif</span>
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

      {/* Tab 2: Seasons & Year Management with Full CRUD (Tambah, Edit, Hapus, Beralih) */}
      {activeTab === 'seasons' && (
        <div className="space-y-6 max-w-4xl">
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-500" />
                  <span>Kelola Pilihan Musim & Tahun Turnamen</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Tambah musim baru setiap tahun acara, edit periode pelaksanaan, atau beralih ke musim turnamen lainnya.
                </p>
              </div>

              {canEdit && (
                <button
                  type="button"
                  onClick={handleOpenAddSeason}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-sm flex items-center gap-1.5 whitespace-nowrap self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5 text-slate-950" />
                  <span>+ Buat Musim & Tahun Baru</span>
                </button>
              )}
            </div>
          </div>

          {/* Season Cards Grid */}
          <div className="space-y-3">
            {seasons.map(s => {
              const isActive = s.id === currentSeason.id;
              return (
                <div
                  key={s.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isActive
                      ? 'border-amber-500/80 bg-gradient-to-r from-amber-50/30 via-transparent to-amber-50/10 dark:from-amber-950/30 dark:to-transparent shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {s.name}
                      </h4>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                        Tahun {s.year}
                      </span>
                      {isActive && (
                        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold uppercase flex items-center gap-1 border border-emerald-300/40">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          Musim Aktif Sekarang
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-mono flex items-center gap-3">
                      <span>Mulai: {s.startDate}</span>
                      <span>·</span>
                      <span>Selesai: {s.endDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {canEdit && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleOpenEditSeason(s)}
                          className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-xl transition-colors"
                          title="Edit Musim"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setSeasonToDelete(s)}
                          disabled={seasons.length <= 1}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-xl transition-colors disabled:opacity-30 disabled:pointer-events-none"
                          title="Hapus Musim"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}

                    {!isActive ? (
                      <button
                        type="button"
                        onClick={() => setSeason(s.id)}
                        className="px-3.5 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        Beralih ke Musim Ini
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400 font-mono px-3 py-1">
                        ✓ Aktif
                      </span>
                    )}
                  </div>
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
                  type="button"
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
                            type="button"
                            onClick={() => handleOpenEditUser(u)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-lg transition-colors"
                            title="Edit Akun"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
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

      {/* Tab 5: Backup & Reset Data Sistem */}
      {activeTab === 'backup' && (
        <div className="space-y-6 max-w-4xl">
          {/* Header Info */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  Pusat Cadangan Data (Backup) & Pemulihan Sistem (Restore)
                </h3>
                <p className="text-xs text-slate-400">
                  Amankan seluruh data turnamen, kontingen RT, atlet, jadwal, skor, sponsor, dan kas keuangan secara instan.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <Shield className="w-3 h-3" /> Auto Sync Aktif
            </span>
          </div>

          {/* Backup Summary Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">KONTINGEN RT</span>
              <strong className="text-white text-base font-bold">{contingents.length} RT</strong>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">CABANG OLAHRAGA</span>
              <strong className="text-amber-400 text-base font-bold">{sports.length} Cabor</strong>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">ATLET TERDAFTAR</span>
              <strong className="text-emerald-400 text-base font-bold">{athletes.length} Atlet</strong>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">PERTANDINGAN</span>
              <strong className="text-indigo-400 text-base font-bold">{matches.length} Laga</strong>
            </div>
          </div>

          {/* 1. Ekspor Cadangan Data (Download Backup) */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-bold text-white">
                  1. Ekspor & Unduh File Cadangan (Backup Database)
                </h4>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Format: JSON Terenkripsi</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Unduh berkas arsip lengkap seluruh konfigurasi, atlet, wasit, sponsor, bagan turnamen, serta laporan keuangan. File backup ini dapat disimpan di komputer panitia atau Google Drive sebagai arsip resmi.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  const data = exportDatabaseBackup();
                  const blob = new Blob([data], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `backup_turnamen_rw08_${new Date().toISOString().slice(0, 10)}.json`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md flex items-center gap-2 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Unduh File Backup (.json)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const data = exportDatabaseBackup();
                  navigator.clipboard.writeText(data);
                  setBackupCopied(true);
                  setTimeout(() => setBackupCopied(false), 2500);
                }}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-2 transition-all"
              >
                {backupCopied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Tersalin ke Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Salin Teks Backup JSON</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 2. Pemulihan Data Sistem (Restore Backup) */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-indigo-400" />
                <h4 className="text-sm font-bold text-white">
                  2. Pulihkan Data dari File Backup (Restore Database)
                </h4>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Unggah File atau Tempel JSON</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Pilih file backup (.json) yang pernah Anda unduh sebelumnya atau tempelkan teks JSON untuk memulihkan seluruh data dan skor turnamen.
            </p>

            {restoreStatus && (
              <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{restoreStatus}</span>
              </div>
            )}

            {restoreError && (
              <div className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{restoreError}</span>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Pilih File Backup JSON dari Komputer / HP:
                </label>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      const content = event.target?.result as string;
                      setRestoreJsonInput(content);
                    };
                    reader.readAsText(file);
                  }}
                  className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 file:cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Atau Tempelkan Isi Kode JSON Backup di Bawah Ini:
                </label>
                <textarea
                  rows={4}
                  value={restoreJsonInput}
                  onChange={(e) => setRestoreJsonInput(e.target.value)}
                  placeholder='{"identity": {...}, "athletes": [...], "matches": [...]}'
                  className="w-full p-3 rounded-xl border border-slate-700 bg-slate-800 text-white font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  disabled={!restoreJsonInput.trim()}
                  onClick={() => {
                    if (!restoreJsonInput.trim()) return;
                    try {
                      const success = restoreDatabaseBackup(restoreJsonInput);
                      if (success) {
                        setRestoreStatus('Berhasil! Seluruh data turnamen telah dipulihkan dari arsip backup.');
                        setRestoreError(null);
                        setRestoreJsonInput('');
                      } else {
                        setRestoreError('Gagal memulihkan database. Format JSON tidak sesuai dengan skema turnamen.');
                        setRestoreStatus(null);
                      }
                    } catch (err: any) {
                      setRestoreError('Error saat membaca file JSON: ' + (err?.message || 'Data korup'));
                      setRestoreStatus(null);
                    }
                  }}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white shadow-md transition-all flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Jalankan Pemulihan Data (Restore)</span>
                </button>
              </div>
            </div>
          </div>

          {/* 3. Reset Seluruh Data (Danger Zone) */}
          <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-500/40 space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              <h4 className="text-sm font-bold text-rose-400">
                3. Zona Berbahaya: Reset Seluruh Data ke Setelan Awal Pabrik
              </h4>
            </div>

            <p className="text-xs text-rose-300/80 leading-relaxed">
              Tindakan ini akan menghapus semua perubahan custom, mengosongkan log aktivitas, dan mengembalikan seluruh data (atlet, pertandingan, jadwal, RAB, kas) ke data awal default RW 08. Pastikan Anda telah mengunduh file backup sebelum melakukan reset.
            </p>

            <button
              type="button"
              onClick={() => {
                setResetConfirmWord('');
                setShowResetModal(true);
              }}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-md flex items-center gap-2 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Data Turnamen</span>
            </button>
          </div>
        </div>
      )}

      {/* Modal: Tambah Musim & Tahun Baru */}
      {isAddSeasonOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-fadeIn">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-500" />
                <span>Buat Musim & Tahun Acara Baru</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddSeasonOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSeason} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Nama Musim / Edisi Acara *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Turnamen HUT RI Ke-82 (2027)"
                  value={newSeasonName}
                  onChange={e => setNewSeasonName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Tahun Acara *
                </label>
                <input
                  type="number"
                  required
                  min={2020}
                  max={2035}
                  value={newSeasonYear}
                  onChange={e => setNewSeasonYear(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Tanggal Mulai
                  </label>
                  <input
                    type="date"
                    required
                    value={newSeasonStart}
                    onChange={e => setNewSeasonStart(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Tanggal Selesai
                  </label>
                  <input
                    type="date"
                    required
                    value={newSeasonEnd}
                    onChange={e => setNewSeasonEnd(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newSeasonSetCurrent}
                    onChange={e => setNewSeasonSetCurrent(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-amber-400"
                  />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Aktifkan langsung sebagai musim berjalan sekarang
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddSeasonOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm"
                >
                  Simpan Musim Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Musim */}
      {editingSeason && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-fadeIn">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-amber-500" />
                <span>Edit Musim & Periode Turnamen</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingSeason(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditSeason} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Nama Musim / Edisi Acara
                </label>
                <input
                  type="text"
                  required
                  value={editingSeason.name}
                  onChange={e => setEditingSeason({ ...editingSeason, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Tahun Acara
                </label>
                <input
                  type="number"
                  required
                  value={editingSeason.year}
                  onChange={e => setEditingSeason({ ...editingSeason, year: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Tanggal Mulai
                  </label>
                  <input
                    type="date"
                    required
                    value={editingSeason.startDate}
                    onChange={e => setEditingSeason({ ...editingSeason, startDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Tanggal Selesai
                  </label>
                  <input
                    type="date"
                    required
                    value={editingSeason.endDate}
                    onChange={e => setEditingSeason({ ...editingSeason, endDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingSeason(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Konfirmasi Hapus Musim */}
      {seasonToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xl text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Hapus Musim Ini?
                </h4>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                  Apakah Anda yakin ingin menghapus <strong>{seasonToDelete.name}</strong> ({seasonToDelete.year})?
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSeasonToDelete(null)}
                className="px-3.5 py-1.5 font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteSeason}
                className="px-4 py-1.5 font-bold rounded-lg bg-rose-600 hover:bg-rose-500 text-white shadow-sm"
              >
                Hapus Sekarang
              </button>
            </div>
          </div>
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
                type="button"
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

      {/* Modal: Reset Data Sistem Konfirmasi */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-white">
                Konfirmasi Reset Seluruh Data Turnamen
              </h3>
              <p className="text-xs text-slate-400">
                Tindakan ini akan mengembalikan seluruh database ke kondisi awal default. Ketik <span className="text-rose-400 font-mono font-bold">RESET</span> untuk melanjutkan.
              </p>
            </div>

            <div className="space-y-2">
              <input
                type="text"
                placeholder="Ketik 'RESET' di sini..."
                value={resetConfirmWord}
                onChange={e => setResetConfirmWord(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-rose-500/40 bg-slate-800 text-white font-mono text-center text-sm font-bold tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={resetConfirmWord.trim().toUpperCase() !== 'RESET'}
                onClick={() => {
                  resetAllData();
                  setShowResetModal(false);
                  setResetConfirmWord('');
                }}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white shadow-md transition-all flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Ya, Reset Semua Data</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
