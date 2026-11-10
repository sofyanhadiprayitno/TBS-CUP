import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import { SportBranch, RTContingent, SportCategory, MatchFormat } from '../../types';
import { ImageUploadField } from '../common/ImageUploadField';
import {
  Gamepad2,
  Flame,
  Trophy,
  Crosshair,
  Wind,
  CircleDot,
  Shield,
  Edit2,
  Plus,
  BookOpen,
  Trash2,
  X,
  Palette,
  Users,
  Image as ImageIcon
} from 'lucide-react';

export const SportsAndRTManager: React.FC = () => {
  const {
    sports,
    contingents,
    updateSport,
    addSport,
    deleteSport,
    updateContingent,
    addContingent,
    deleteContingent,
    activeRole
  } = useTournament();

  const [activeTab, setActiveTab] = useState<'sports' | 'contingents'>('sports');

  // Sport Modals
  const [showAddSport, setShowAddSport] = useState(false);
  const [editingSport, setEditingSport] = useState<SportBranch | null>(null);
  const [sportToDelete, setSportToDelete] = useState<SportBranch | null>(null);

  // New Sport State
  const [spName, setSpName] = useState('');
  const [spCategory, setSpCategory] = useState<SportCategory>('esports');
  const [spColor, setSpColor] = useState('#8b5cf6');
  const [spIcon, setSpIcon] = useState('Gamepad2');
  const [spImage, setSpImage] = useState('');
  const [spFormat, setSpFormat] = useState<MatchFormat>('BO3');
  const [spRound1, setSpRound1] = useState('Babak Pertama (Game 1)');
  const [spRound2, setSpRound2] = useState('Babak Kedua (Game 2)');
  const [spRound3, setSpRound3] = useState('Babak Ketiga (Decider)');
  const [spRulesSummary, setSpRulesSummary] = useState('');
  const [spVenue, setSpVenue] = useState('Balai Warga RW 08');
  const [spMaxTeam, setSpMaxTeam] = useState(5);

  // Contingent Modals
  const [showAddContingent, setShowAddContingent] = useState(false);
  const [editingContingent, setEditingContingent] = useState<RTContingent | null>(null);
  const [contingentToDelete, setContingentToDelete] = useState<RTContingent | null>(null);

  // New Contingent State
  const [rtCode, setRtCode] = useState('RT 09');
  const [rtName, setRtName] = useState('RT 09 - Ksatria Warga');
  const [rtMascot, setRtMascot] = useState('Singa Emas');
  const [rtColor, setRtColor] = useState('#3b82f6');
  const [rtLogo, setRtLogo] = useState('');
  const [rtKetua, setRtKetua] = useState('');
  const [rtPhone, setRtPhone] = useState('');
  const [rtAddress, setRtAddress] = useState('Jl. Cempaka Indah');

  const canManage = activeRole === 'super_admin' || activeRole === 'ketua_panitia';

  const renderSportIcon = (name: string, color: string) => {
    switch (name) {
      case 'Gamepad2': return <Gamepad2 className="w-5 h-5" style={{ color }} />;
      case 'Flame': return <Flame className="w-5 h-5" style={{ color }} />;
      case 'Trophy': return <Trophy className="w-5 h-5" style={{ color }} />;
      case 'Crosshair': return <Crosshair className="w-5 h-5" style={{ color }} />;
      case 'Wind': return <Wind className="w-5 h-5" style={{ color }} />;
      case 'CircleDot': return <CircleDot className="w-5 h-5" style={{ color }} />;
      default: return <Shield className="w-5 h-5" style={{ color }} />;
    }
  };

  // Sport Handlers
  const handleCreateSport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!spName.trim()) return;

    addSport({
      id: `sp-${Date.now()}`,
      name: spName.trim(),
      category: spCategory,
      iconName: spIcon,
      color: spColor,
      imageUrl: spImage || '/src/assets/images/cabor_esports_gaming_1794294148716.jpg',
      format: spFormat,
      roundLabels: {
        round1: spRound1,
        round2: spRound2,
        round3: spRound3
      },
      scoreType: spCategory === 'esports' ? 'kills' : 'points',
      rulesSummary: spRulesSummary || 'Format resmi turnamen antar RT RW 08.',
      rulesDetail: [
        'Wajib berdomisili atau memiliki KTP/KK di lingkungan RT masing-masing.',
        'Mengikuti arahan wasit dan panitia pelaksana.',
        'Keputusan wasit dan sistem bersifat mengikat.'
      ],
      maxTeamMembers: spMaxTeam,
      minAge: 12,
      maxAge: 45,
      venue: spVenue
    });

    setSpName('');
    setSpRulesSummary('');
    setSpImage('');
    setShowAddSport(false);
  };

  const handleUpdateSport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSport) return;
    updateSport(editingSport);
    setEditingSport(null);
  };

  const handleDeleteSport = () => {
    if (sportToDelete) {
      deleteSport(sportToDelete.id);
      setSportToDelete(null);
    }
  };

  // Contingent Handlers
  const handleCreateContingent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rtName.trim()) return;

    addContingent({
      id: `rt-${Date.now()}`,
      code: rtCode.trim(),
      name: rtName.trim(),
      mascotName: rtMascot.trim(),
      color: rtColor,
      iconName: 'Zap',
      logoUrl: rtLogo || '',
      ketuaRT: rtKetua.trim() || 'Ketua RT',
      phone: rtPhone.trim() || '0812-0000-0000',
      email: `${rtCode.toLowerCase().replace(/\s+/g, '')}@rw08.org`,
      address: rtAddress.trim(),
      gold: 0,
      silver: 0,
      bronze: 0,
      points: 0
    });

    setRtName('');
    setRtMascot('');
    setRtKetua('');
    setRtPhone('');
    setRtLogo('');
    setShowAddContingent(false);
  };

  const handleUpdateContingent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingContingent) return;
    updateContingent(editingContingent);
    setEditingContingent(null);
  };

  const handleDeleteContingent = () => {
    if (contingentToDelete) {
      deleteContingent(contingentToDelete.id);
      setContingentToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-500 font-semibold tracking-wider uppercase mb-1">
            <Palette className="w-4 h-4" />
            <span>Kustomisasi Cabor & Kontingen</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Cabang Olahraga & Kontingen RT
          </h2>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
            <span>Warna & Icon Khas Tiap Cabor & RT</span>
            <span aria-hidden="true">·</span>
            <span>Aturan Main & Banner Visual</span>
          </div>
        </div>

        {/* Tab Switcher & Add Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => setActiveTab('sports')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'sports'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Cabang Olahraga ({sports.length})
            </button>
            <button
              onClick={() => setActiveTab('contingents')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'contingents'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Kontingen RT ({contingents.length})
            </button>
          </div>

          {canManage && (
            <button
              onClick={() => {
                if (activeTab === 'sports') setShowAddSport(true);
                else setShowAddContingent(true);
              }}
              className="px-3.5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{activeTab === 'sports' ? 'Tambah Cabor Baru' : 'Tambah Kontingen RT'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab 1: Cabang Olahraga Cards */}
      {activeTab === 'sports' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sports.map(s => (
            <div
              key={s.id}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden flex flex-col justify-between hover:border-indigo-400/50 transition-all group"
            >
              {/* Image banner preview if exists */}
              <div className="relative h-36 bg-slate-100 dark:bg-slate-950 overflow-hidden">
                <img
                  src={s.imageUrl || '/src/assets/images/cabor_esports_gaming_1794294148716.jpg'}
                  alt={s.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={e => {
                    (e.target as HTMLImageElement).src = '/src/assets/images/cabor_esports_gaming_1794294148716.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                
                {/* Header tags over banner */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider text-white shadow" style={{ backgroundColor: s.color }}>
                    {s.format} · {s.category.toUpperCase()}
                  </span>
                  <div
                    className="w-4 h-4 rounded-full border-2 border-white shadow"
                    style={{ backgroundColor: s.color }}
                    title={`Warna Khas: ${s.color}`}
                  />
                </div>

                <div className="absolute bottom-2.5 left-3 flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-black/60 backdrop-blur-xs text-white">
                    {renderSportIcon(s.iconName, s.color)}
                  </div>
                  <h3 className="font-bold text-white text-sm drop-shadow-sm">
                    {s.name}
                  </h3>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                    {s.rulesSummary}
                  </p>

                  {/* Round Labels */}
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 text-[11px] font-mono space-y-1 text-slate-600 dark:text-slate-400">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Babak 1:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{s.roundLabels.round1}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Babak 2:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{s.roundLabels.round2}</span>
                    </div>
                  </div>
                </div>

                {/* Footer with Edit / Delete */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400 font-mono">
                    Maks {s.maxTeamMembers} Pemain/Tim
                  </span>

                  {canManage && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingSport(s)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Edit Cabor & Aturan"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setSportToDelete(s)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Hapus Cabang Olahraga"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Kontingen RT Cards */}
      {activeTab === 'contingents' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {contingents.map(c => (
            <div
              key={c.id}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between space-y-3 hover:border-indigo-400/50 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-white text-sm shadow-md"
                    style={{ backgroundColor: c.color }}
                  >
                    {c.code}
                  </div>
                  <div
                    className="w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-800 shadow"
                    style={{ backgroundColor: c.color }}
                  />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    {c.name}
                  </h3>
                  <div className="text-xs text-indigo-600 dark:text-indigo-400 font-mono mt-0.5">
                    Maskot: {c.mascotName}
                  </div>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                  <div>Ketua RT: <strong className="text-slate-900 dark:text-white">{c.ketuaRT}</strong></div>
                  <div>Kontak: <span className="font-mono">{c.phone}</span></div>
                  <div className="text-[11px] text-slate-400 truncate">Alamat: {c.address}</div>
                </div>

                {/* Medals badge */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-amber-500 font-bold">{c.gold} 🥇</span>
                  <span className="text-slate-400 font-bold">{c.silver} 🥈</span>
                  <span className="text-amber-700 font-bold">{c.bronze} 🥉</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">{c.points} Pts</span>
                </div>
              </div>

              {canManage && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-1">
                  <button
                    onClick={() => setEditingContingent(c)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Edit Identitas RT"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setContingentToDelete(c)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Hapus Kontingen"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal: Tambah Cabor Baru */}
      {showAddSport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-500" />
                <span>Tambah Cabang Olahraga / E-Sports Baru</span>
              </h3>
              <button onClick={() => setShowAddSport(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSport} className="space-y-4 text-xs">
              <ImageUploadField
                label="Banner Gambar Cabor"
                value={spImage}
                onChange={url => setSpImage(url)}
                aspectRatio="video"
                presetOptions={[
                  { label: 'Esports Gaming', url: '/src/assets/images/cabor_esports_gaming_1794294148716.jpg' },
                  { label: 'Badminton Court', url: '/src/assets/images/cabor_badminton_sports_1794294148699.jpg' },
                  { label: 'Arena Stage', url: '/src/assets/images/hero_esports_championship_1794294147972.jpg' }
                ]}
              />

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Nama Cabang Olahraga *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Valorant Community / Futsal Warga"
                  value={spName}
                  onChange={e => setSpName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Kategori
                  </label>
                  <select
                    value={spCategory}
                    onChange={e => setSpCategory(e.target.value as SportCategory)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="esports">E-Sports Digital</option>
                    <option value="sport">Olahraga Tradisional / Fisik</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Format Babak
                  </label>
                  <select
                    value={spFormat}
                    onChange={e => setSpFormat(e.target.value as MatchFormat)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="BO1">Best of 1 (BO1)</option>
                    <option value="BO3">Best of 3 (BO3)</option>
                    <option value="BO5">Best of 5 (BO5)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Warna Khas Cabor
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={spColor}
                      onChange={e => setSpColor(e.target.value)}
                      className="w-9 h-9 p-0.5 rounded-lg cursor-pointer border border-slate-200 dark:border-slate-700"
                    />
                    <span className="font-mono text-xs">{spColor}</span>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Ikon Cabor
                  </label>
                  <select
                    value={spIcon}
                    onChange={e => setSpIcon(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="Gamepad2">Gamepad / Stik</option>
                    <option value="Flame">Api / Flame</option>
                    <option value="Crosshair">Crosshair / Shooter</option>
                    <option value="Trophy">Trophy / Piala</option>
                    <option value="Wind">Wind / Shuttlecock</option>
                    <option value="CircleDot">Bola / Tenis</option>
                    <option value="Shield">Perisai / Catur</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Label Babak 1
                  </label>
                  <input
                    type="text"
                    value={spRound1}
                    onChange={e => setSpRound1(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Label Babak 2
                  </label>
                  <input
                    type="text"
                    value={spRound2}
                    onChange={e => setSpRound2(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Ringkasan Aturan Main
                </label>
                <textarea
                  rows={2}
                  value={spRulesSummary}
                  onChange={e => setSpRulesSummary(e.target.value)}
                  placeholder="Contoh: Tim 5v5 mode Custom Tournament Draft Pick..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddSport(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md"
                >
                  Simpan Cabor Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Cabor */}
      {editingSport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-indigo-500" />
                <span>Edit Cabang Olahraga: {editingSport.name}</span>
              </h3>
              <button onClick={() => setEditingSport(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateSport} className="space-y-4 text-xs">
              <ImageUploadField
                label="Banner Gambar Cabor"
                value={editingSport.imageUrl || ''}
                onChange={url => setEditingSport({ ...editingSport, imageUrl: url })}
                aspectRatio="video"
              />

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Nama Cabang Olahraga
                </label>
                <input
                  type="text"
                  required
                  value={editingSport.name}
                  onChange={e => setEditingSport({ ...editingSport, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Warna Khas Cabor
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={editingSport.color}
                      onChange={e => setEditingSport({ ...editingSport, color: e.target.value })}
                      className="w-9 h-9 p-0.5 rounded-lg cursor-pointer border border-slate-200 dark:border-slate-700"
                    />
                    <span className="font-mono text-xs">{editingSport.color}</span>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Format Pertandingan
                  </label>
                  <select
                    value={editingSport.format}
                    onChange={e => setEditingSport({ ...editingSport, format: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="BO1">Best of 1 (BO1)</option>
                    <option value="BO3">Best of 3 (BO3)</option>
                    <option value="BO5">Best of 5 (BO5)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Ringkasan Aturan Main
                </label>
                <textarea
                  rows={2}
                  value={editingSport.rulesSummary}
                  onChange={e => setEditingSport({ ...editingSport, rulesSummary: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Label Babak 1
                  </label>
                  <input
                    type="text"
                    value={editingSport.roundLabels.round1}
                    onChange={e => setEditingSport({
                      ...editingSport,
                      roundLabels: { ...editingSport.roundLabels, round1: e.target.value }
                    })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Label Babak 2
                  </label>
                  <input
                    type="text"
                    value={editingSport.roundLabels.round2}
                    onChange={e => setEditingSport({
                      ...editingSport,
                      roundLabels: { ...editingSport.roundLabels, round2: e.target.value }
                    })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingSport(null)}
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

      {/* Modal: Tambah Kontingen RT */}
      {showAddContingent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-500" />
                <span>Tambah Kontingen Rukun Tetangga (RT)</span>
              </h3>
              <button onClick={() => setShowAddContingent(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateContingent} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Kode RT *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="RT 09"
                    value={rtCode}
                    onChange={e => setRtCode(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Warna Khas RT
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={rtColor}
                      onChange={e => setRtColor(e.target.value)}
                      className="w-9 h-9 p-0.5 rounded-lg cursor-pointer border border-slate-200 dark:border-slate-700"
                    />
                    <span className="font-mono text-xs">{rtColor}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Nama Resmi Kontingen RT *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: RT 09 - Ksatria Warga"
                  value={rtName}
                  onChange={e => setRtName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Nama Maskot RT
                  </label>
                  <input
                    type="text"
                    placeholder="Singa Emas"
                    value={rtMascot}
                    onChange={e => setRtMascot(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Ketua RT / Kontingen
                  </label>
                  <input
                    type="text"
                    placeholder="Bpk. Hendro"
                    value={rtKetua}
                    onChange={e => setRtKetua(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    No. WhatsApp / HP
                  </label>
                  <input
                    type="text"
                    placeholder="0812-xxxx-xxxx"
                    value={rtPhone}
                    onChange={e => setRtPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Alamat Wilayah RT
                  </label>
                  <input
                    type="text"
                    value={rtAddress}
                    onChange={e => setRtAddress(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddContingent(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md"
                >
                  Simpan Kontingen RT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Kontingen */}
      {editingContingent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-indigo-500" />
                <span>Edit Identitas Kontingen: {editingContingent.code}</span>
              </h3>
              <button onClick={() => setEditingContingent(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateContingent} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Nama Resmi Kontingen RT
                </label>
                <input
                  type="text"
                  required
                  value={editingContingent.name}
                  onChange={e => setEditingContingent({ ...editingContingent, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Nama Maskot RT
                  </label>
                  <input
                    type="text"
                    value={editingContingent.mascotName}
                    onChange={e => setEditingContingent({ ...editingContingent, mascotName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Warna Khas RT
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={editingContingent.color}
                      onChange={e => setEditingContingent({ ...editingContingent, color: e.target.value })}
                      className="w-9 h-9 p-0.5 rounded-lg cursor-pointer border border-slate-200 dark:border-slate-700"
                    />
                    <span className="font-mono text-xs">{editingContingent.color}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Ketua RT
                  </label>
                  <input
                    type="text"
                    value={editingContingent.ketuaRT}
                    onChange={e => setEditingContingent({ ...editingContingent, ketuaRT: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    No. WhatsApp
                  </label>
                  <input
                    type="text"
                    value={editingContingent.phone}
                    onChange={e => setEditingContingent({ ...editingContingent, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Alamat Wilayah RT
                </label>
                <input
                  type="text"
                  value={editingContingent.address}
                  onChange={e => setEditingContingent({ ...editingContingent, address: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingContingent(null)}
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

      {/* Confirmation Modal: Delete Sport */}
      {sportToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Hapus Cabang Olahraga?
              </h3>
              <p className="text-xs text-slate-500">
                Apakah Anda yakin ingin menghapus cabor <strong>{sportToDelete.name}</strong>?
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSportToDelete(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteSport}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 text-white hover:bg-rose-500 shadow-md"
              >
                Hapus Cabor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Delete Contingent */}
      {contingentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Hapus Kontingen RT?
              </h3>
              <p className="text-xs text-slate-500">
                Apakah Anda yakin ingin menghapus <strong>{contingentToDelete.name}</strong>?
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setContingentToDelete(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteContingent}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 text-white hover:bg-rose-500 shadow-md"
              >
                Hapus Kontingen
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
