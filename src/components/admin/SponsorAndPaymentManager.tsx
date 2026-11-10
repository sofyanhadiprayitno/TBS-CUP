import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import { Sponsor } from '../../types';
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
  PhoneCall
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const SponsorAndPaymentManager: React.FC = () => {
  const { sponsors, addSponsor, addIncome, identity, activeRole } = useTournament();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showQRISModal, setShowQRISModal] = useState(false);
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null);

  // New Sponsor Form
  const [name, setName] = useState('');
  const [tier, setTier] = useState<Sponsor['tier']>('Gold');
  const [amount, setAmount] = useState<number>(1000000);
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [benefit1, setBenefit1] = useState('');

  // Payment simulator state
  const [payAmount, setPayAmount] = useState<number>(500000);
  const [payerName, setPayerName] = useState<string>('Kontingen RT 03 / Donatur');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleAddSponsor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addSponsor({
      name,
      tier,
      amount,
      logoUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=80',
      status: 'confirmed',
      contactPerson,
      phone,
      benefits: [benefit1 || 'Logo pada backdrop acara & live streaming']
    });

    setName('');
    setContactPerson('');
    setPhone('');
    setBenefit1('');
    setShowAddModal(false);
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

  const canEdit = activeRole === 'super_admin' || activeRole === 'ketua_panitia' || activeRole === 'bendahara';

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-500" />
            <span>Manajemen Sponsor & Payment Gateway QRIS</span>
          </h2>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
            <span>Paket Kerjasama Sponsorship</span>
            <span aria-hidden="true">·</span>
            <span>Simulasi Gateway Transaksi Instan QRIS & Transfer Bank</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowQRISModal(true)}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm transition-colors flex items-center gap-1.5"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Buka QRIS Payment Portal</span>
          </button>

          {canEdit && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Sponsor</span>
            </button>
          )}
        </div>
      </div>

      {/* Sponsor Tier Showcase Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {sponsors.map(sp => {
          const isPlatinum = sp.tier === 'Platinum';
          const isGold = sp.tier === 'Gold';
          const isSilver = sp.tier === 'Silver';

          return (
            <div
              key={sp.id}
              className={`p-5 rounded-xl border bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between space-y-4 ${
                isPlatinum
                  ? 'border-indigo-400/50 ring-1 ring-indigo-400/20'
                  : isGold
                  ? 'border-amber-400/50'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold font-mono uppercase px-2 py-0.5 rounded tracking-wider ${
                    isPlatinum
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                      : isGold
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      : isSilver
                      ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {sp.tier} Partner
                  </span>
                  <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {sp.amount > 0 ? `Rp ${sp.amount.toLocaleString('id-ID')}` : 'In-Kind Partner'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={sp.logoUrl}
                    alt={sp.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-800 shrink-0"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                      {sp.name}
                    </h3>
                    <div className="text-[11px] text-slate-400 font-mono">
                      PIC: {sp.contactPerson}
                    </div>
                  </div>
                </div>

                {/* Benefits */}
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

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 font-mono">
                  📞 {sp.phone}
                </span>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> MOU Aktif
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* QRIS Gateway Simulator Modal */}
      {showQRISModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
            
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center font-bold">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Gerbang Pembayaran QRIS Resmi RT / RW
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pindai kode QR menggunakan GoPay, OVO, Dana, BCA, Mandiri, atau Livin
              </p>
            </div>

            {paymentSuccess ? (
              <div className="p-6 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                <h4 className="text-base font-bold text-emerald-900 dark:text-emerald-200">
                  Pembayaran QRIS Berhasil Diverifikasi!
                </h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-300">
                  Kuitansi otomatis diterbitkan dan kas turnamen telah bertambah sebesar <strong>Rp {payAmount.toLocaleString('id-ID')}</strong>.
                </p>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                {/* Simulated QR Code Visual Box */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center space-y-2">
                  <div className="w-48 h-48 bg-white p-3 rounded-lg border-2 border-slate-800 flex flex-col items-center justify-center relative shadow-sm">
                    {/* QR graphic mockup */}
                    <div className="w-full h-full bg-slate-900/90 rounded flex items-center justify-center text-white text-[11px] font-mono text-center p-2">
                      <div className="space-y-1">
                        <QrCode className="w-16 h-16 mx-auto text-emerald-400" />
                        <div className="font-bold text-[10px] tracking-wider">QRIS STANDAR BI</div>
                        <div className="text-[9px] text-slate-300 font-mono">NMID: ID102938472918</div>
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    Merchant: {identity.organizer}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                      Nama Pengirim / Pembayar
                    </label>
                    <input
                      type="text"
                      value={payerName}
                      onChange={e => setPayerName(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                      Nominal Transaksi (Rp)
                    </label>
                    <input
                      type="number"
                      value={payAmount}
                      onChange={e => setPayAmount(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowQRISModal(false)}
                    className="px-4 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Tutup
                  </button>
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handleSimulatePayment}
                    className="px-4 py-2 font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm flex items-center gap-1.5"
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

      {/* Add Sponsor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building className="w-5 h-5 text-indigo-500" />
              <span>Tambah Mitra Sponsor Baru</span>
            </h3>

            <form onSubmit={handleAddSponsor} className="space-y-4 text-xs">
              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Nama Perusahaan / Brand Sponsor
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Toko Olahraga Maju Jaya"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                    Tingkat (Tier) Sponsor
                  </label>
                  <select
                    value={tier}
                    onChange={e => setTier(e.target.value as any)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Platinum">Platinum (Utama)</option>
                    <option value="Gold">Gold</option>
                    <option value="Silver">Silver</option>
                    <option value="Media Partner">Media Partner</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                    Nilai Kontribusi (Rp)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={amount}
                    onChange={e => setAmount(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                    Nama Narahubung (PIC)
                  </label>
                  <input
                    type="text"
                    placeholder="Bpk. Hendra"
                    value={contactPerson}
                    onChange={e => setContactPerson(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                    No. Telepon / WhatsApp
                  </label>
                  <input
                    type="text"
                    placeholder="0812-xxxx-xxxx"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Benefit / Hak Promosi Utama
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Penayangan logo di banner dan piala bergilir"
                  value={benefit1}
                  onChange={e => setBenefit1(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm"
                >
                  Simpan Sponsor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
