import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import { BudgetItem, ExpenseRecord, IncomeRecord } from '../../types';
import { exportFinancialsToCSV, printOfficialReport } from '../../utils/exportUtils';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Download,
  Printer,
  Plus,
  Receipt,
  PieChart,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const FinanceManager: React.FC = () => {
  const {
    budgetItems,
    expenses,
    incomes,
    addExpense,
    addIncome,
    addBudgetItem,
    deleteBudgetItem,
    identity,
    activeRole,
    currentUser
  } = useTournament();

  const [activeTab, setActiveTab] = useState<'overview' | 'expenses' | 'incomes' | 'rab'>('overview');
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showAddIncomeModal, setShowAddIncomeModal] = useState(false);
  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false);

  // New Expense Form State
  const [expCategory, setExpCategory] = useState('Piala & Medali');
  const [expDesc, setExpDesc] = useState('');
  const [expAmount, setExpAmount] = useState<number>(0);
  const [expReceipt, setExpReceipt] = useState('');
  const [expPaidBy, setExpPaidBy] = useState(currentUser?.fullName || 'H. Joko (Bendahara)');

  // New Income Form State
  const [incSource, setIncSource] = useState<IncomeRecord['source']>('iuran_rt');
  const [incSourceName, setIncSourceName] = useState('');
  const [incAmount, setIncAmount] = useState<number>(0);
  const [incMethod, setIncMethod] = useState<IncomeRecord['paymentMethod']>('transfer');

  // Calculations
  const totalPlannedBudget = budgetItems.reduce((acc, b) => acc + b.plannedAmount, 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
  const totalIncomes = incomes.reduce((acc, i) => acc + i.amount, 0);
  const netCashBalance = totalIncomes - totalExpenses;
  const budgetUtilizationPct = totalPlannedBudget > 0 ? Math.round((totalExpenses / totalPlannedBudget) * 100) : 0;

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (expAmount <= 0 || !expDesc.trim()) return;

    addExpense({
      category: expCategory,
      description: expDesc,
      amount: expAmount,
      date: new Date().toISOString().slice(0, 10),
      receiptNumber: expReceipt || `KWT-${Date.now().toString().slice(-4)}`,
      paidBy: expPaidBy,
      verifiedBy: 'Ketua Panitia'
    });

    setExpDesc('');
    setExpAmount(0);
    setExpReceipt('');
    setShowAddExpenseModal(false);
  };

  const handleCreateIncome = (e: React.FormEvent) => {
    e.preventDefault();
    if (incAmount <= 0 || !incSourceName.trim()) return;

    addIncome({
      source: incSource,
      sourceName: incSourceName,
      amount: incAmount,
      date: new Date().toISOString().slice(0, 10),
      paymentMethod: incMethod,
      status: 'paid',
      receiptNumber: `INC-${Date.now().toString().slice(-4)}`
    });

    setIncSourceName('');
    setIncAmount(0);
    setShowAddIncomeModal(false);
  };

  const handlePrintPDF = () => {
    const expenseRows = expenses.map(e => `
      <tr>
        <td>${e.receiptNumber}</td>
        <td>${e.date}</td>
        <td>${e.category}</td>
        <td>${e.description}</td>
        <td style="text-align: right; font-weight: bold;">Rp ${e.amount.toLocaleString('id-ID')}</td>
        <td>${e.paidBy}</td>
      </tr>
    `).join('');

    const incomeRows = incomes.map(i => `
      <tr>
        <td>${i.receiptNumber}</td>
        <td>${i.date}</td>
        <td>${i.source}</td>
        <td>${i.sourceName}</td>
        <td style="text-align: right; font-weight: bold;">Rp ${i.amount.toLocaleString('id-ID')}</td>
        <td>${i.paymentMethod.toUpperCase()}</td>
      </tr>
    `).join('');

    const html = `
      <div style="margin-bottom: 20px; padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0;">
        <h4 style="margin: 0 0 8px 0;">RINGKASAN KEUANGAN KAS TURNAMEN:</h4>
        <div style="display: flex; justify-content: space-between; font-weight: bold;">
          <span>Total Pemasukan Kas: Rp ${totalIncomes.toLocaleString('id-ID')}</span>
          <span>Total Realisasi Belanja: Rp ${totalExpenses.toLocaleString('id-ID')}</span>
          <span style="color: #16a34a;">Sisa Saldo Kas Bersih: Rp ${netCashBalance.toLocaleString('id-ID')}</span>
        </div>
      </div>

      <h4>1. REKAPITULASI PEMASUKAN DANA (KAS MASUK):</h4>
      <table>
        <thead>
          <tr>
            <th>No. Kuitansi</th>
            <th>Tanggal</th>
            <th>Kategori</th>
            <th>Sumber Dana</th>
            <th style="text-align: right;">Jumlah (Rp)</th>
            <th>Metode</th>
          </tr>
        </thead>
        <tbody>
          ${incomeRows}
        </tbody>
      </table>

      <h4 style="margin-top: 25px;">2. REKAPITULASI REALISASI PENGELUARAN (SPJ BELANJA):</h4>
      <table>
        <thead>
          <tr>
            <th>No. Bukti / Nota</th>
            <th>Tanggal</th>
            <th>Kategori</th>
            <th>Uraian Keperluan</th>
            <th style="text-align: right;">Jumlah (Rp)</th>
            <th>PJ Pengeluaran</th>
          </tr>
        </thead>
        <tbody>
          ${expenseRows}
        </tbody>
      </table>
    `;

    printOfficialReport(`LAPORAN PERTANGGUNGJAWABAN (SPJ) KEUANGAN - ${identity.name}`, html);
  };

  const canEdit = activeRole === 'super_admin' || activeRole === 'bendahara' || activeRole === 'ketua_panitia';

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Wallet className="w-5 h-5 text-emerald-500" />
            <span>Manajemen Keuangan, RAB & Realisasi Anggaran</span>
          </h2>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
            <span>RAB vs Realisasi Pengeluaran</span>
            <span aria-hidden="true">·</span>
            <span>Kas Masuk & Donatur Warga</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              Surplus Kas: Rp {netCashBalance.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportFinancialsToCSV(budgetItems, expenses, incomes)}
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
            <span>Cetak SPJ Laporan PDF</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Pemasukan */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span>Total Pemasukan Kas</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400 mt-1">
            Rp {totalIncomes.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">
            {incomes.length} Transaksi Kas Masuk
          </div>
        </div>

        {/* Realisasi Belanja */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span>Realisasi Pengeluaran</span>
            <TrendingDown className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-rose-600 dark:text-rose-400 mt-1">
            Rp {totalExpenses.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">
            {expenses.length} Pos Nota Belanja
          </div>
        </div>

        {/* Sisa Saldo Kas */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span>Saldo Kas Bersih Saat Ini</span>
            <Wallet className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-indigo-600 dark:text-indigo-400 mt-1">
            Rp {netCashBalance.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">
            {netCashBalance >= 0 ? 'Kondisi Kas Sehat' : 'Defisit Anggaran'}
          </div>
        </div>

        {/* Plafon RAB & Serapan */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span>Serapan Anggaran (RAB)</span>
            <PieChart className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1">
            {budgetUtilizationPct}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono truncate">
            Dari Plafon Rp {totalPlannedBudget.toLocaleString('id-ID')}
          </div>
        </div>

      </div>

      {/* Tab Switcher & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'overview'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Analitik & Grafik
          </button>
          <button
            onClick={() => setActiveTab('expenses')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'expenses'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Realisasi Pengeluaran ({expenses.length})
          </button>
          <button
            onClick={() => setActiveTab('incomes')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'incomes'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Pemasukan Kas ({incomes.length})
          </button>
          <button
            onClick={() => setActiveTab('rab')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'rab'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Plafon RAB ({budgetItems.length})
          </button>
        </div>

        {canEdit && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddIncomeModal(true)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Catat Kas Masuk</span>
            </button>
            <button
              onClick={() => setShowAddExpenseModal(true)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 hover:bg-rose-100 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Catat Pengeluaran</span>
            </button>
          </div>
        )}
      </div>

      {/* Tab 1: Overview & Visual Analytics */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Visual Bar: Budget vs Actual Category Comparison */}
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                Realisasi Pengeluaran per Kategori
              </h3>
              <span className="text-xs font-mono text-slate-400">Total: Rp {totalExpenses.toLocaleString('id-ID')}</span>
            </div>

            <div className="space-y-3 pt-2">
              {[
                { label: 'Piala & Medali Kejuaraan', amount: 3200000, target: 4500000, color: '#f59e0b' },
                { label: 'Honor Wasit & Caster', amount: 1500000, target: 2500000, color: '#6366f1' },
                { label: 'Kabel LAN, Switch & Hardware', amount: 1450000, target: 3200000, color: '#06b6d4' },
                { label: 'Konsumsi Panitia & Atlet', amount: 1100000, target: 2200000, color: '#10b981' }
              ].map((item, idx) => {
                const pct = Math.min(100, Math.round((item.amount / item.target) * 100));
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-800 dark:text-slate-200">{item.label}</span>
                      <span className="font-mono text-slate-500 tabular-nums">
                        Rp {item.amount.toLocaleString('id-ID')} / {item.target.toLocaleString('id-ID')} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Visual Bar: Sources of Income Breakdown */}
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                Komposisi Sumber Pemasukan Kas
              </h3>
              <span className="text-xs font-mono text-emerald-500 font-bold">
                Rp {totalIncomes.toLocaleString('id-ID')}
              </span>
            </div>

            <div className="space-y-3 pt-2">
              {[
                { label: 'Alokasi Kas RW 08', amount: 6000000, pct: 38, color: '#3b82f6' },
                { label: 'Sponsorship Komersial (Indihome & Toko)', amount: 5500000, pct: 35, color: '#8b5cf6' },
                { label: 'Iuran Wajib Kontingen 8 RT', amount: 3200000, pct: 20, color: '#10b981' },
                { label: 'Donatur Sukarela Warga', amount: 1000000, pct: 7, color: '#f59e0b' }
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-800 dark:text-slate-200">{item.label}</span>
                    <span className="font-mono text-slate-500 tabular-nums">
                      Rp {item.amount.toLocaleString('id-ID')} ({item.pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2 mt-4">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Seluruh transaksi keuangan telah diverifikasi oleh Bendahara & diaudit Ketua Panitia.</span>
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Expenses Table */}
      {activeTab === 'expenses' && (
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-mono">
                <tr>
                  <th className="py-3 px-4 font-semibold">No. Bukti / Nota</th>
                  <th className="py-3 px-4 font-semibold">Tanggal</th>
                  <th className="py-3 px-4 font-semibold">Kategori</th>
                  <th className="py-3 px-4 font-semibold">Deskripsi Pengeluaran</th>
                  <th className="py-3 px-4 font-semibold text-right">Jumlah Belanja</th>
                  <th className="py-3 px-4 font-semibold">Dibayarkan Oleh</th>
                  <th className="py-3 px-4 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {expenses.map(e => (
                  <tr key={e.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                      {e.receiptNumber}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-mono">
                      {e.date}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                      {e.category}
                    </td>
                    <td className="py-3 px-4 text-slate-900 dark:text-white max-w-xs">
                      {e.description}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                      Rp {e.amount.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      {e.paidBy}
                    </td>
                    <td className="py-3 px-4 text-center font-mono">
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Terverifikasi
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Incomes Table */}
      {activeTab === 'incomes' && (
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-mono">
                <tr>
                  <th className="py-3 px-4 font-semibold">No. Bukti</th>
                  <th className="py-3 px-4 font-semibold">Tanggal</th>
                  <th className="py-3 px-4 font-semibold">Kategori Sumber</th>
                  <th className="py-3 px-4 font-semibold">Keterangan Sumber Dana</th>
                  <th className="py-3 px-4 font-semibold text-right">Jumlah Kas Masuk</th>
                  <th className="py-3 px-4 font-semibold text-center">Metode Pembayaran</th>
                  <th className="py-3 px-4 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {incomes.map(i => (
                  <tr key={i.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                      {i.receiptNumber}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-mono">
                      {i.date}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200 capitalize">
                      {i.source.replace('_', ' ')}
                    </td>
                    <td className="py-3 px-4 text-slate-900 dark:text-white max-w-xs font-semibold">
                      {i.sourceName}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                      Rp {i.amount.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4 text-center font-mono uppercase text-slate-600 dark:text-slate-300">
                      {i.paymentMethod}
                    </td>
                    <td className="py-3 px-4 text-center font-mono">
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Lunas Masuk Kas
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: RAB Table */}
      {activeTab === 'rab' && (
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-mono">
                <tr>
                  <th className="py-3 px-4 font-semibold">Kode Pos</th>
                  <th className="py-3 px-4 font-semibold">Kategori Pos</th>
                  <th className="py-3 px-4 font-semibold">Uraian Kebutuhan Anggaran</th>
                  <th className="py-3 px-4 font-semibold text-right">Plafon RAB</th>
                  <th className="py-3 px-4 font-semibold text-center">Prioritas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {budgetItems.map(b => (
                  <tr key={b.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                      {b.id}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200 uppercase font-mono text-[11px]">
                      {b.category}
                    </td>
                    <td className="py-3 px-4 text-slate-900 dark:text-white font-semibold">
                      {b.title}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                      Rp {b.plannedAmount.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4 text-center font-mono uppercase text-[11px]">
                      <span className={`px-2 py-0.5 rounded font-semibold ${
                        b.priority === 'high' ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60' : 'bg-slate-100 text-slate-600 dark:bg-slate-800'
                      }`}>
                        {b.priority}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Catat Pengeluaran */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Receipt className="w-5 h-5 text-rose-500" />
              <span>Catat Realisasi Pengeluaran Kas</span>
            </h3>

            <form onSubmit={handleCreateExpense} className="space-y-4 text-xs">
              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Kategori Belanja
                </label>
                <select
                  value={expCategory}
                  onChange={e => setExpCategory(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Piala & Medali">Piala & Medali</option>
                  <option value="Honor Wasit">Honor Wasit & Caster</option>
                  <option value="Perlengkapan">Perlengkapan & IT / Jaringan</option>
                  <option value="Konsumsi">Konsumsi & Logistik</option>
                  <option value="Dekorasi & Tenda">Dekorasi & Tenda Arena</option>
                  <option value="Lain-lain">Medis & Tak Terduga</option>
                </select>
              </div>

              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Uraian Lengkap Pengeluaran
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Contoh: Pembelian kabel HDMI 15m dan baterai jam catur..."
                  value={expDesc}
                  onChange={e => setExpDesc(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                    Nominal Biaya (Rp)
                  </label>
                  <input
                    type="number"
                    min={1000}
                    required
                    value={expAmount || ''}
                    onChange={e => setExpAmount(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                    No. Nota / Kuitansi
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: NOTA-1092"
                    value={expReceipt}
                    onChange={e => setExpReceipt(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Penanggung Jawab Pembayaran
                </label>
                <input
                  type="text"
                  value={expPaidBy}
                  onChange={e => setExpPaidBy(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddExpenseModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-sm"
                >
                  Simpan Pengeluaran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Catat Pemasukan */}
      {showAddIncomeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-500" />
              <span>Catat Pemasukan Kas Turnamen</span>
            </h3>

            <form onSubmit={handleCreateIncome} className="space-y-4 text-xs">
              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Sumber Pemasukan
                </label>
                <select
                  value={incSource}
                  onChange={e => setIncSource(e.target.value as any)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="iuran_rt">Iuran Kontingen RT</option>
                  <option value="sponsor">Sponsorship / Sponsor</option>
                  <option value="registrasi">Registrasi Peserta</option>
                  <option value="donatur">Donatur Warga</option>
                  <option value="merchandise">Penjualan Merchandise</option>
                </select>
              </div>

              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Keterangan / Nama Donatur / Instansi
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Iuran RT 07 / Bpk. Sutrisno Donatur"
                  value={incSourceName}
                  onChange={e => setIncSourceName(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                    Nominal Masuk (Rp)
                  </label>
                  <input
                    type="number"
                    min={1000}
                    required
                    value={incAmount || ''}
                    onChange={e => setIncAmount(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                    Metode Pembayaran
                  </label>
                  <select
                    value={incMethod}
                    onChange={e => setIncMethod(e.target.value as any)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  >
                    <option value="transfer">Transfer Bank</option>
                    <option value="qris">QRIS RT</option>
                    <option value="cash">Tunai / Cash</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddIncomeModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm"
                >
                  Simpan Kas Masuk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
