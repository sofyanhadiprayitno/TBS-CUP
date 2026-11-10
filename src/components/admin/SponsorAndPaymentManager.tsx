import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import { Sponsor } from '../../types';
import { ImageUploadField } from '../common/ImageUploadField';
import {
  Briefcase,
  QrCode,
  CheckCircle2,
  Plus,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  Building,
  Smartphone,
  PhoneCall,
  Edit2,
  Trash2,
  Eye,
  Settings,
  Sparkles,
  X,
  UploadCloud
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const SponsorAndPaymentManager: React.FC = () => {
  const {
    sponsors,
    addSponsor,
    updateSponsor,
    deleteSponsor,
    addIncome,
    identity,
    updateIdentity,
    activeRole
  } = useTournament();

  const [activeTab, setActiveTab] = useState<'sponsors' | 'qris_settings'>('sponsors');

  // Sponsor Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);
  const [sponsorToDelete, setSponsorToDelete] = useState<Sponsor | null>(null);

  // New Sponsor Form State
  const [name, setName] = useState('');
  const [tier, setTier] = useState<Sponsor['tier']>('Gold');
  const [amount, setAmount] = useState<number>(1000000);
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [benefit1, setBenefit1] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

  // QRIS Payment Portal / Simulator Modal
  const [showQRISModal, setShowQRISModal] = useState(false);
  const [payAmount, setPayAmount] = useState<number>(500000);
  const [payerName, setPayerName] = useState<string>('Kontingen RT 03 / Donatur');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // QRIS Custom Settings Form State (in qris_settings tab)
  const [qrisNMID, setQrisNMID] = useState('ID102938472918');
  const [qrisMerchantName, setQrisMerchantName] = useState(identity.organizer || 'Panitia Turnamen RW 08');
  const [bankAccount, setBankAccount] = useState('BCA 829-102-9988 a/n Hendra Panitia RW 08');
  const [qrisCustomImageUrl, setQrisCustomImageUrl] = useState('');
  const [savedSettingsNotice, setSavedSettingsNotice] = useState(false);

  const canEdit = activeRole === 'super_admin' || activeRole === 'ketua_panitia' || activeRole === 'bendahara';

  const handleAddSponsor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addSponsor({
      name: name.trim(),
      tier,
      amount,
      logoUrl: logoUrl.trim() || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=80',
      status: 'confirmed',
      contactPerson: contactPerson.trim() || 'PIC Sponsor',
      phone: phone.trim() || '0812-0000-0000',
      benefits: [benefit1.trim() || 'Logo pada backdrop acara & live streaming']
    });

    setName('');
    setContactPerson('');
    setPhone('');
    setBenefit1('');
    setLogoUrl('');
    setShowAddModal(false);
  };

  const handleUpdateSponsor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSponsor || !editingSponsor.name.trim()) return;
    updateSponsor(editingSponsor);
    setEditingSponsor(null);
  };

  const handleDeleteConfirm = () => {
    if (sponsorToDelete) {
      deleteSponsor(sponsorToDelete.id);
      setSponsorToDelete(null);
    }
  };

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      confetti({ particleCount: 75, spread: 60, origin: { y: 0.6 } });

      // Automatically register payment into financial kas
      addIncome({
        source: 'sponsor',
        sourceName: payerName,
        amount: payAmount,
        date: new Date().toISOString().slice(0, 10),
        paymentMethod: 'qris',
        status: 'paid',
        receiptNumber: `QRIS-${Date.now().toString().slice(-6)}`
      });

      setTimeout(() => {
        setPaymentSuccess(false);
        setShowQRISModal(false);
      }, 2500);
    }, 1200);
  };

  const handleSaveQRISSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSettingsNotice(true);
    setTimeout(() => setSavedSettingsNotice(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-500" />
            <span>Manajemen Sponsor & Payment Gateway QRIS</span>
          </h2>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
            <span>Kemitraan Sponsorship Antar RT</span>
            <span aria-hidden="true">·</span>
            <span>Gateway Pembayaran QRIS & Kas RW 08</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Tabs switch */}
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs">
            <button
              onClick={() => setActiveTab('sponsors')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'sponsors'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Daftar Sponsor ({sponsors.length})
            </button>
            <button
              onClick={() => setActiveTab('qris_settings')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 ${
                activeTab === 'qris_settings'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <QrCode className="w-3.5 h-3.5 text-emerald-500" />
              <span>Pengaturan QRIS</span>
            </button>
          </div>

          <button
            onClick={() => setShowQRISModal(true)}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm transition-colors flex items-center gap-1.5"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Buka QRIS Bayar</span>
          </button>

          {canEdit && activeTab === 'sponsors' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Sponsor</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'sponsors' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sponsors.map(sp => {
              const isPlatinum = sp.tier === 'Platinum';
              const isGold = sp.tier === 'Gold';
              const isSilver = sp.tier === 'Silver';

              return (
                <div
                  key={sp.id}
                  className={`p-5 rounded-2xl border bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between space-y-4 transition-all hover:shadow-md ${
                    isPlatinum
                      ? 'border-indigo-500/40 ring-1 ring-indigo-500/20'
                      : isGold
                      ? 'border-amber-500/40'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Tier badge & amount */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-bold font-mono uppercase px-2 py-0.5 rounded-md tracking-wider ${
                          isPlatinum
                            ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                            : isGold
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : isSilver
                            ? 'bg-slate-500/15 text-slate-300 border border-slate-500/30'
                            : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {sp.tier} Partner
                      </span>
                      <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {sp.amount > 0 ? `Rp ${sp.amount.toLocaleString('id-ID')}` : 'In-Kind Partner'}
                      </span>
                    </div>

                    {/* Logo & Sponsor Name */}
                    <div className="flex items-center gap-3">
                      <img
                        src={sp.logoUrl}
                        alt={sp.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0 shadow-xs"
                        onError={e => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=80';
                        }}
                      />
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm truncate">
                          {sp.name}
                        </h3>
                        <div className="text-[11px] text-slate-400 font-mono truncate">
                          PIC: {sp.contactPerson}
                        </div>
                      </div>
                    </div>

                    {/* Benefits List */}
                    <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 block text-[11px]">
                        Hak Kompensasi & Promosi:
                      </span>
                      <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                        {sp.benefits.map((b, idx) => (
                          <li key={idx} className="line-clamp-2">{b}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Card Footer with Contact & Edit/Delete Actions */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400 font-mono">
                      📞 {sp.phone}
                    </span>

                    <div className="flex items-center gap-1">
                      {canEdit && (
                        <>
                          <button
                            onClick={() => setEditingSponsor(sp)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Edit Sponsor"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setSponsorToDelete(sp)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Hapus Sponsor"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {sponsors.length === 0 && (
            <div className="text-center py-12 border border-dashed border-slate-700 rounded-2xl p-8 bg-slate-900/50">
              <Briefcase className="w-10 h-10 text-slate-500 mx-auto mb-2" />
              <h4 className="text-sm font-semibold text-white">Belum Ada Sponsor</h4>
              <p className="text-xs text-slate-400 mt-1">Klik tombol "+ Tambah Sponsor" untuk mendaftarkan mitra turnamen.</p>
            </div>
          )}
        </div>
      ) : (
        /* Tab 2: Pengaturan QRIS & Rekening Bank */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Form: Edit QRIS & Bank Info */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Pengaturan QRIS & Rekening Kas
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Resmi Bank Indonesia
              </span>
            </div>

            {savedSettingsNotice && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Pengaturan QRIS & Rekening Kas berhasil disimpan!</span>
              </div>
            )}

            <form onSubmit={handleSaveQRISSettings} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Nama Merchant / Penyelenggara QRIS *
                </label>
                <input
                  type="text"
                  required
                  value={qrisMerchantName}
                  onChange={e => setQrisMerchantName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  NMID (National Merchant ID QRIS) *
                </label>
                <input
                  type="text"
                  required
                  value={qrisNMID}
                  onChange={e => setQrisNMID(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Nomor Rekening Bank & Atas Nama *
                </label>
                <input
                  type="text"
                  required
                  value={bankAccount}
                  onChange={e => setBankAccount(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <ImageUploadField
                label="Unggah Gambar Barcode QRIS Asli (Opsional)"
                value={qrisCustomImageUrl}
                onChange={url => setQrisCustomImageUrl(url)}
                aspectRatio="square"
              />

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-sm transition-all"
                >
                  Simpan Pengaturan QRIS
                </button>
              </div>
            </form>
          </div>

          {/* Right: Live Preview of QRIS Card */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <QrCode className="w-4 h-4 text-emerald-500" />
                <span>Pratinjau QRIS Kas Turnamen</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tampilan QR Code yang akan dilihat oleh kontingen RT, sponsor, dan donatur saat memindai pembayaran.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center space-y-3">
              <div className="w-56 h-56 bg-white p-3 rounded-xl border-2 border-slate-700 shadow-md flex flex-col items-center justify-center">
                {qrisCustomImageUrl ? (
                  <img
                    src={qrisCustomImageUrl}
                    alt="Custom QRIS"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-900 rounded-lg flex flex-col items-center justify-center text-white p-2 text-center">
                    <QrCode className="w-20 h-20 text-emerald-400 mb-1" />
                    <span className="font-extrabold text-[11px] tracking-wider text-slate-100">QRIS STANDAR BI</span>
                    <span className="text-[10px] text-slate-400 font-mono">NMID: {qrisNMID}</span>
                  </div>
                )}
              </div>

              <div className="text-center font-mono">
                <div className="text-xs font-bold text-white">{qrisMerchantName}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{bankAccount}</div>
              </div>
            </div>

            <button
              onClick={() => setShowQRISModal(true)}
              className="w-full py-2.5 text-xs font-bold rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Smartphone className="w-4 h-4" />
              <span>Buka Modal Simulasi Transaksi</span>
            </button>
          </div>
        </div>
      )}

      {/* QRIS Gateway Simulator Modal */}
      {showQRISModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Gerbang Pembayaran QRIS Resmi
                  </h3>
                  <p className="text-[10px] text-slate-400">Pindai dengan GoPay, OVO, Dana, BCA, atau Livin</p>
                </div>
              </div>
              <button
                onClick={() => setShowQRISModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {paymentSuccess ? (
              <div className="p-6 rounded-xl bg-emerald-950/40 border border-emerald-800 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <h4 className="text-base font-bold text-emerald-200">
                  Pembayaran QRIS Berhasil Diverifikasi!
                </h4>
                <p className="text-xs text-emerald-300">
                  Kuitansi otomatis diterbitkan dan kas turnamen telah bertambah sebesar <strong>Rp {payAmount.toLocaleString('id-ID')}</strong>.
                </p>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                {/* QR Code Graphic Mockup */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center space-y-2">
                  <div className="w-48 h-48 bg-white p-3 rounded-lg border-2 border-slate-700 flex flex-col items-center justify-center relative shadow-sm">
                    {qrisCustomImageUrl ? (
                      <img src={qrisCustomImageUrl} alt="QRIS" className="w-full h-full object-contain" />
                    ) : (
                      <div className="w-full h-full bg-slate-900 rounded flex flex-col items-center justify-center text-white text-[11px] font-mono text-center p-2">
                        <QrCode className="w-14 h-14 mx-auto text-emerald-400 mb-1" />
                        <div className="font-bold text-[10px] tracking-wider">QRIS STANDAR BI</div>
                        <div className="text-[9px] text-slate-400 font-mono">NMID: {qrisNMID}</div>
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    Merchant: {qrisMerchantName}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">
                      Nama Pengirim / Pembayar
                    </label>
                    <input
                      type="text"
                      value={payerName}
                      onChange={e => setPayerName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">
                      Nominal Transaksi (Rp)
                    </label>
                    <input
                      type="number"
                      value={payAmount}
                      onChange={e => setPayAmount(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white font-mono font-bold text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowQRISModal(false)}
                    className="px-4 py-2 rounded-xl text-slate-300 hover:bg-slate-800"
                  >
                    Tutup
                  </button>
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handleSimulatePayment}
                    className="px-4 py-2 font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>{isProcessing ? 'Memproses Gateway...' : 'Simulasikan Pembayaran Berhasil'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Tambah Sponsor Baru */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building className="w-5 h-5 text-indigo-400" />
                <span>Tambah Mitra Sponsor Baru</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSponsor} className="space-y-4 text-xs">
              <ImageUploadField
                label="Logo Sponsor / Perusahaan"
                value={logoUrl}
                onChange={url => setLogoUrl(url)}
                aspectRatio="square"
              />

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Nama Perusahaan / Brand Sponsor *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Toko Olahraga Maju Jaya"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    Tingkat (Tier) Sponsor *
                  </label>
                  <select
                    value={tier}
                    onChange={e => setTier(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white font-medium"
                  >
                    <option value="Platinum">Platinum (Utama)</option>
                    <option value="Gold">Gold</option>
                    <option value="Silver">Silver</option>
                    <option value="Media Partner">Media Partner</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    Nilai Kontribusi Kas (Rp) *
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={amount}
                    onChange={e => setAmount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    Nama Narahubung (PIC) *
                  </label>
                  <input
                    type="text"
                    placeholder="Bpk. Hendra"
                    value={contactPerson}
                    onChange={e => setContactPerson(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    No. Telepon / WhatsApp *
                  </label>
                  <input
                    type="text"
                    placeholder="0812-xxxx-xxxx"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Benefit / Hak Promosi Utama
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Penayangan logo di banner dan piala bergilir"
                  value={benefit1}
                  onChange={e => setBenefit1(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-300 hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md"
                >
                  Simpan Sponsor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Sponsor */}
      {editingSponsor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-indigo-400" />
                <span>Edit Mitra Sponsor: {editingSponsor.name}</span>
              </h3>
              <button
                onClick={() => setEditingSponsor(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateSponsor} className="space-y-4 text-xs">
              <ImageUploadField
                label="Logo Sponsor / Perusahaan"
                value={editingSponsor.logoUrl}
                onChange={url => setEditingSponsor({ ...editingSponsor, logoUrl: url })}
                aspectRatio="square"
              />

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Nama Perusahaan / Brand Sponsor *
                </label>
                <input
                  type="text"
                  required
                  value={editingSponsor.name}
                  onChange={e => setEditingSponsor({ ...editingSponsor, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    Tingkat (Tier) Sponsor *
                  </label>
                  <select
                    value={editingSponsor.tier}
                    onChange={e => setEditingSponsor({ ...editingSponsor, tier: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white font-medium"
                  >
                    <option value="Platinum">Platinum (Utama)</option>
                    <option value="Gold">Gold</option>
                    <option value="Silver">Silver</option>
                    <option value="Media Partner">Media Partner</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    Nilai Kontribusi Kas (Rp) *
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editingSponsor.amount}
                    onChange={e => setEditingSponsor({ ...editingSponsor, amount: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    Nama Narahubung (PIC) *
                  </label>
                  <input
                    type="text"
                    value={editingSponsor.contactPerson}
                    onChange={e => setEditingSponsor({ ...editingSponsor, contactPerson: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    No. Telepon / WhatsApp *
                  </label>
                  <input
                    type="text"
                    value={editingSponsor.phone}
                    onChange={e => setEditingSponsor({ ...editingSponsor, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Benefit / Hak Promosi Utama
                </label>
                <input
                  type="text"
                  value={editingSponsor.benefits[0] || ''}
                  onChange={e => {
                    const newBenefits = [...editingSponsor.benefits];
                    newBenefits[0] = e.target.value;
                    setEditingSponsor({ ...editingSponsor, benefits: newBenefits });
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingSponsor(null)}
                  className="px-4 py-2 rounded-xl text-slate-300 hover:bg-slate-800"
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

      {/* Modal: Hapus Sponsor Konfirmasi */}
      {sponsorToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">
                Hapus Mitra Sponsor?
              </h3>
              <p className="text-xs text-slate-400">
                Apakah Anda yakin ingin menghapus sponsor <strong>{sponsorToDelete.name}</strong>? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSponsorToDelete(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 text-white hover:bg-rose-500 shadow-md"
              >
                Ya, Hapus Sponsor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
