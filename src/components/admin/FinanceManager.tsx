import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import { BudgetItem, ExpenseRecord, IncomeRecord } from '../../types';
import { ImageUploadField } from '../common/ImageUploadField';
import { exportFinancialsToCSV } from '../../utils/exportUtils';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PieChart as PieIcon,
  Download,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  FileSpreadsheet,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  ShieldCheck,
  Edit2,
  Trash2,
  X,
  FileText
} from 'lucide-react';

export const FinanceManager: React.FC = () => {
  const {
    budgetItems,
    expenses,
    incomes,
    addExpense,
    updateExpense,
    deleteExpense,
    addIncome,
    updateIncome,
    deleteIncome,
    addBudgetItem,
    updateBudgetItem,
    deleteBudgetItem,
    identity,
    activeRole,
    currentUser
  } = useTournament();

  const [activeTab, setActiveTab] = useState<'overview' | 'expenses' | 'incomes' | 'rab'>('overview');

  // Add Modals
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showAddIncomeModal, setShowAddIncomeModal] = useState(false);
  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false);

  // Edit Modals
  const [editingExpense, setEditingExpense] = useState<ExpenseRecord | null>(null);
  const [editingIncome, setEditingIncome] = useState<IncomeRecord | null>(null);
  const [editingBudget, setEditingBudget] = useState<BudgetItem | null>(null);

  // Delete Confirmations
  const [expenseToDelete, setExpenseToDelete] = useState<ExpenseRecord | null>(null);
  const [incomeToDelete, setIncomeToDelete] = useState<IncomeRecord | null>(null);
  const [budgetToDelete, setBudgetToDelete] = useState<BudgetItem | null>(null);

  // New Expense Form State
  const [expCategory, setExpCategory] = useState('Piala & Medali');
  const [expDesc, setExpDesc] = useState('');
  const [expAmount, setExpAmount] = useState<number>(0);
  const [expReceipt, setExpReceipt] = useState('');
  const [expPaidBy, setExpPaidBy] = useState('Bendahara Panitia');
  const [expReceiptImage, setExpReceiptImage] = useState('');

  // New Income Form State
  const [incSource, setIncSource] = useState<IncomeRecord['source']>('iuran_rt');
  const [incSourceName, setIncSourceName] = useState('');
  const [incAmount, setIncAmount] = useState<number>(0);
  const [incMethod, setIncMethod] = useState<IncomeRecord['paymentMethod']>('transfer');

  // New Budget Form State
  const [rabCategory, setRabCategory] = useState<BudgetItem['category']>('prizes');
  const [rabTitle, setRabTitle] = useState('');
  const [rabPlannedAmount, setRabPlannedAmount] = useState<number>(1000000);
  const [rabPriority, setRabPriority] = useState<'high' | 'medium' | 'low'>('high');

  // Financial Calculations
  const totalRAB = budgetItems.reduce((acc, curr) => acc + curr.plannedAmount, 0);
  const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const currentBalance = totalIncome - totalExpense;
  const budgetUtilization = totalRAB > 0 ? Math.round((totalExpense / totalRAB) * 100) : 0;

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expDesc.trim() || expAmount <= 0) return;

    addExpense({
      category: expCategory,
      description: expDesc.trim(),
      amount: expAmount,
      date: new Date().toISOString().slice(0, 10),
      receiptNumber: expReceipt.trim() || `NOTA-${Math.floor(1000 + Math.random() * 9000)}`,
      paidBy: expPaidBy.trim() || 'Bendahara',
      verifiedBy: 'Panitia'
    });

    setExpDesc('');
    setExpAmount(0);
    setExpReceipt('');
    setExpReceiptImage('');
    setShowAddExpenseModal(false);
  };

  const handleUpdateExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExpense || editingExpense.amount <= 0) return;
    updateExpense(editingExpense);
    setEditingExpense(null);
  };

  const handleDeleteExpenseConfirm = () => {
    if (expenseToDelete) {
      deleteExpense(expenseToDelete.id);
      setExpenseToDelete(null);
    }
  };

  const handleCreateIncome = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incSourceName.trim() || incAmount <= 0) return;

    addIncome({
      source: incSource,
      sourceName: incSourceName.trim(),
      amount: incAmount,
      date: new Date().toISOString().slice(0, 10),
      paymentMethod: incMethod,
      status: 'paid',
      receiptNumber: `KW-${Date.now().toString().slice(-6)}`
    });

    setIncSourceName('');
    setIncAmount(0);
    setShowAddIncomeModal(false);
  };

  const handleUpdateIncomeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingIncome || editingIncome.amount <= 0) return;
    updateIncome(editingIncome);
    setEditingIncome(null);
  };

  const handleDeleteIncomeConfirm = () => {
    if (incomeToDelete) {
      deleteIncome(incomeToDelete.id);
      setIncomeToDelete(null);
    }
  };

  const handleCreateBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rabTitle.trim() || rabPlannedAmount <= 0) return;

    addBudgetItem({
      category: rabCategory,
      title: rabTitle.trim(),
      plannedAmount: rabPlannedAmount,
      priority: rabPriority
    });

    setRabTitle('');
    setRabPlannedAmount(1000000);
    setShowAddBudgetModal(false);
  };

  const handleUpdateBudgetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBudget || editingBudget.plannedAmount <= 0) return;
    updateBudgetItem(editingBudget);
    setEditingBudget(null);
  };

  const handleDeleteBudgetConfirm = () => {
    if (budgetToDelete) {
      deleteBudgetItem(budgetToDelete.id);
      setBudgetToDelete(null);
    }
  };

  const handleExportCSV = () => {
    exportFinancialsToCSV(budgetItems, expenses, incomes);
  };

  const canManage = activeRole === 'super_admin' || activeRole === 'ketua_panitia' || activeRole === 'bendahara';

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-500 font-semibold tracking-wider uppercase mb-1">
            <Wallet className="w-4 h-4" />
            <span>Transparansi Kas & Akuntabilitas Anggaran</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Sistem Keuangan & Plafon RAB Turnamen
          </h2>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
            <span>Perencanaan RAB</span>
            <span aria-hidden="true">·</span>
            <span>Kas Masuk & Donatur</span>
            <span aria-hidden="true">·</span>
            <span>Realisasi SPJ Belanja</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 text-xs font-medium rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Unduh Laporan Keuangan (.CSV)</span>
          </button>

          {canManage && (
            <div className="flex items-center gap-1.5">
              {activeTab === 'expenses' && (
                <button
                  onClick={() => setShowAddExpenseModal(true)}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-md transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Pengeluaran</span>
                </button>
              )}

              {activeTab === 'incomes' && (
                <button
                  onClick={() => setShowAddIncomeModal(true)}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Kas Masuk</span>
                </button>
              )}

              {activeTab === 'rab' && (
                <button
                  onClick={() => setShowAddBudgetModal(true)}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Pos Plafon RAB</span>
                </button>
              )}

              {activeTab === 'overview' && (
                <button
                  onClick={() => setShowAddExpenseModal(true)}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-md transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Catat Pengeluaran</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Plafon RAB */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
              <span>Plafon Target RAB</span>
              <PieIcon className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
              Rp {totalRAB.toLocaleString('id-ID')}
            </div>
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
            <span>{budgetItems.length} Pos Alokasi</span>
            <span className="text-indigo-400 font-bold">100% Target</span>
          </div>
        </div>

        {/* Card 2: Pemasukan Kas */}
        <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 text-xs mb-1 font-semibold">
              <span>Total Pemasukan Kas</span>
              <ArrowDownLeft className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-xl font-black font-mono tracking-tight text-emerald-600 dark:text-emerald-400">
              Rp {totalIncome.toLocaleString('id-ID')}
            </div>
          </div>
          <div className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 font-mono mt-2 pt-2 border-t border-emerald-500/20 flex items-center justify-between">
            <span>{incomes.length} Transaksi Terverifikasi</span>
            <span className="font-bold">{totalRAB > 0 ? Math.round((totalIncome / totalRAB) * 100) : 0}% vs RAB</span>
          </div>
        </div>

        {/* Card 3: Realisasi Pengeluaran */}
        <div className="p-5 rounded-2xl border border-rose-500/30 bg-rose-500/5 dark:bg-rose-950/20 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-rose-600 dark:text-rose-400 text-xs mb-1 font-semibold">
              <span>Realisasi Belanja (SPJ)</span>
              <ArrowUpRight className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-xl font-black font-mono tracking-tight text-rose-600 dark:text-rose-400">
              Rp {totalExpense.toLocaleString('id-ID')}
            </div>
          </div>
          <div className="text-[11px] text-rose-600/80 dark:text-rose-400/80 font-mono mt-2 pt-2 border-t border-rose-500/20 flex items-center justify-between">
            <span>{expenses.length} Bukti Kuitansi</span>
            <span className="font-bold">{budgetUtilization}% Terserap</span>
          </div>
        </div>

        {/* Card 4: Saldo Kas Terkini */}
        <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 text-xs mb-1 font-semibold">
              <span>Sisa Saldo Kas Bersih</span>
              <Wallet className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-xl font-black font-mono tracking-tight text-amber-600 dark:text-amber-400">
              Rp {currentBalance.toLocaleString('id-ID')}
            </div>
          </div>
          <div className="text-[11px] text-amber-600/80 dark:text-amber-400/80 font-mono mt-2 pt-2 border-t border-amber-500/20 flex items-center justify-between">
            <span>Status Kas Turnamen</span>
            <span className="font-bold">{currentBalance >= 0 ? 'SURPLUS' : 'DEFISIT'}</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'overview'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Ringkasan & Visualisasi
        </button>

        <button
          onClick={() => setActiveTab('expenses')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'expenses'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>Realisasi Pengeluaran</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">{expenses.length}</span>
        </button>

        <button
          onClick={() => setActiveTab('incomes')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'incomes'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>Pemasukan Kas</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">{incomes.length}</span>
        </button>

        <button
          onClick={() => setActiveTab('rab')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'rab'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>Plafon Target RAB</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">{budgetItems.length}</span>
        </button>
      </div>

      {/* Tab 1: Overview & Progress Bars */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Penyerapan Anggaran Terhadap Plafon RAB
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Rasio realisasi belanja turnamen terhadap pagu anggaran yang telah disahkan.
                </p>
              </div>
              <span className="text-lg font-black font-mono text-indigo-500">
                {budgetUtilization}%
              </span>
            </div>

            <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-rose-500 transition-all duration-500"
                style={{ width: `${Math.min(budgetUtilization, 100)}%` }}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-slate-400 block text-[11px]">RAB Disahkan:</span>
                <strong className="text-slate-900 dark:text-white">Rp {totalRAB.toLocaleString('id-ID')}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Kas Masuk:</span>
                <strong className="text-emerald-500">Rp {totalIncome.toLocaleString('id-ID')}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Belanja SPJ:</span>
                <strong className="text-rose-500">Rp {totalExpense.toLocaleString('id-ID')}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Sisa Kas Bersih:</span>
                <strong className="text-amber-500">Rp {currentBalance.toLocaleString('id-ID')}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Expenses Table */}
      {activeTab === 'expenses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Daftar seluruh kuitansi & nota belanja pertanggungjawaban panitia (SPJ).
            </div>
            {canManage && (
              <button
                onClick={() => setShowAddExpenseModal(true)}
                className="px-3 py-1.5 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-1 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Pengeluaran</span>
              </button>
            )}
          </div>

          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
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
                    <th className="py-3 px-4 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {expenses.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        Belum ada data pengeluaran kas yang dicatat.
                      </td>
                    </tr>
                  ) : (
                    expenses.map(e => (
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
                        <td className="py-3 px-4 text-slate-900 dark:text-white max-w-xs font-semibold">
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
                            <CheckCircle2 className="w-3 h-3" /> Sah SPJ
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {canManage && (
                              <>
                                <button
                                  onClick={() => setEditingExpense(e)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                  title="Edit Pengeluaran"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setExpenseToDelete(e)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                  title="Hapus Pengeluaran"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Incomes Table */}
      {activeTab === 'incomes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Daftar seluruh penerimaan dana kas dari iuran kontingen RT, sponsor, dan donatur.
            </div>
            {canManage && (
              <button
                onClick={() => setShowAddIncomeModal(true)}
                className="px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Pemasukan Kas</span>
              </button>
            )}
          </div>

          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-mono">
                  <tr>
                    <th className="py-3 px-4 font-semibold">No. Bukti</th>
                    <th className="py-3 px-4 font-semibold">Tanggal</th>
                    <th className="py-3 px-4 font-semibold">Kategori Sumber</th>
                    <th className="py-3 px-4 font-semibold">Keterangan Sumber Dana</th>
                    <th className="py-3 px-4 font-semibold text-right">Jumlah Kas Masuk</th>
                    <th className="py-3 px-4 font-semibold text-center">Metode</th>
                    <th className="py-3 px-4 font-semibold text-center">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {incomes.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        Belum ada data pemasukan kas yang dicatat.
                      </td>
                    </tr>
                  ) : (
                    incomes.map(i => (
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
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {canManage && (
                              <>
                                <button
                                  onClick={() => setEditingIncome(i)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                  title="Edit Pemasukan"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setIncomeToDelete(i)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                  title="Hapus Pemasukan"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: RAB Table */}
      {activeTab === 'rab' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Rencana Anggaran Biaya (RAB) dan plafon alokasi kebutuhan turnamen.
            </div>
            {canManage && (
              <button
                onClick={() => setShowAddBudgetModal(true)}
                className="px-3 py-1.5 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Pos Plafon RAB</span>
              </button>
            )}
          </div>

          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-mono">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Kode Pos</th>
                    <th className="py-3 px-4 font-semibold">Kategori Pos</th>
                    <th className="py-3 px-4 font-semibold">Uraian Kebutuhan Anggaran</th>
                    <th className="py-3 px-4 font-semibold text-right">Plafon RAB</th>
                    <th className="py-3 px-4 font-semibold text-center">Prioritas</th>
                    <th className="py-3 px-4 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {budgetItems.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        Belum ada pos anggaran RAB yang dibuat.
                      </td>
                    </tr>
                  ) : (
                    budgetItems.map(b => (
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
                          <span
                            className={`px-2 py-0.5 rounded font-semibold ${
                              b.priority === 'high'
                                ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                                : 'bg-slate-500/15 text-slate-300 border border-slate-500/30'
                            }`}
                          >
                            {b.priority}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {canManage && (
                              <>
                                <button
                                  onClick={() => setEditingBudget(b)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                  title="Edit Pos RAB"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setBudgetToDelete(b)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                  title="Hapus Pos RAB"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODALS SECTION ================= */}

      {/* Modal 1: Tambah Pengeluaran */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Receipt className="w-5 h-5 text-rose-400" />
                <span>Catat Pengeluaran Kas (SPJ Belanja)</span>
              </h3>
              <button
                onClick={() => setShowAddExpenseModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Kategori Pengeluaran *
                </label>
                <select
                  value={expCategory}
                  onChange={e => setExpCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white font-medium"
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
                <label className="font-semibold text-slate-300 block mb-1">
                  Uraian Lengkap Belanja *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Contoh: Pembelian kabel HDMI 15m dan baterai jam catur..."
                  value={expDesc}
                  onChange={e => setExpDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    Nominal Biaya (Rp) *
                  </label>
                  <input
                    type="number"
                    min={1000}
                    required
                    value={expAmount || ''}
                    onChange={e => setExpAmount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    No. Nota / Kuitansi
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: NOTA-1092"
                    value={expReceipt}
                    onChange={e => setExpReceipt(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Penanggung Jawab Pembayaran
                </label>
                <input
                  type="text"
                  value={expPaidBy}
                  onChange={e => setExpPaidBy(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white"
                />
              </div>

              <ImageUploadField
                label="Unggah Foto Kuitansi / Bukti Pembayaran (Opsional)"
                value={expReceiptImage}
                onChange={url => setExpReceiptImage(url)}
                aspectRatio="square"
              />

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddExpenseModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-300 hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-md"
                >
                  Simpan Pengeluaran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Edit Pengeluaran */}
      {editingExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-indigo-400" />
                <span>Edit Pengeluaran: {editingExpense.receiptNumber}</span>
              </h3>
              <button
                onClick={() => setEditingExpense(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateExpenseSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Kategori Pengeluaran *
                </label>
                <select
                  value={editingExpense.category}
                  onChange={e => setEditingExpense({ ...editingExpense, category: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white font-medium"
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
                <label className="font-semibold text-slate-300 block mb-1">
                  Uraian Lengkap Belanja *
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingExpense.description}
                  onChange={e => setEditingExpense({ ...editingExpense, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    Nominal Biaya (Rp) *
                  </label>
                  <input
                    type="number"
                    min={1000}
                    required
                    value={editingExpense.amount}
                    onChange={e => setEditingExpense({ ...editingExpense, amount: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    No. Nota / Kuitansi
                  </label>
                  <input
                    type="text"
                    value={editingExpense.receiptNumber}
                    onChange={e => setEditingExpense({ ...editingExpense, receiptNumber: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Penanggung Jawab Pembayaran
                </label>
                <input
                  type="text"
                  value={editingExpense.paidBy}
                  onChange={e => setEditingExpense({ ...editingExpense, paidBy: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingExpense(null)}
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

      {/* Modal 3: Hapus Pengeluaran Konfirmasi */}
      {expenseToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">
                Hapus Data Pengeluaran?
              </h3>
              <p className="text-xs text-slate-400">
                Apakah Anda yakin ingin menghapus catatan belanja <strong>{expenseToDelete.description} (Rp {expenseToDelete.amount.toLocaleString('id-ID')})</strong>?
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setExpenseToDelete(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteExpenseConfirm}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 text-white hover:bg-rose-500 shadow-md"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: Tambah Pemasukan Kas */}
      {showAddIncomeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                <span>Catat Pemasukan Kas Turnamen</span>
              </h3>
              <button
                onClick={() => setShowAddIncomeModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateIncome} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Sumber Pemasukan *
                </label>
                <select
                  value={incSource}
                  onChange={e => setIncSource(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white font-medium"
                >
                  <option value="iuran_rt">Iuran Kontingen RT</option>
                  <option value="sponsor">Sponsorship / Sponsor</option>
                  <option value="registrasi">Registrasi Peserta</option>
                  <option value="donatur">Donatur Warga</option>
                  <option value="merchandise">Penjualan Merchandise</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Keterangan / Nama Donatur / Instansi *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Iuran RT 07 / Bpk. Sutrisno Donatur"
                  value={incSourceName}
                  onChange={e => setIncSourceName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    Nominal Masuk (Rp) *
                  </label>
                  <input
                    type="number"
                    min={1000}
                    required
                    value={incAmount || ''}
                    onChange={e => setIncAmount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    Metode Pembayaran *
                  </label>
                  <select
                    value={incMethod}
                    onChange={e => setIncMethod(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white font-mono"
                  >
                    <option value="transfer">Transfer Bank</option>
                    <option value="qris">QRIS RT</option>
                    <option value="cash">Tunai / Cash</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddIncomeModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-300 hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md"
                >
                  Simpan Kas Masuk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 5: Edit Pemasukan Kas */}
      {editingIncome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-indigo-400" />
                <span>Edit Pemasukan: {editingIncome.receiptNumber}</span>
              </h3>
              <button
                onClick={() => setEditingIncome(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateIncomeSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Sumber Pemasukan *
                </label>
                <select
                  value={editingIncome.source}
                  onChange={e => setEditingIncome({ ...editingIncome, source: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white font-medium"
                >
                  <option value="iuran_rt">Iuran Kontingen RT</option>
                  <option value="sponsor">Sponsorship / Sponsor</option>
                  <option value="registrasi">Registrasi Peserta</option>
                  <option value="donatur">Donatur Warga</option>
                  <option value="merchandise">Penjualan Merchandise</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Keterangan / Nama Donatur / Instansi *
                </label>
                <input
                  type="text"
                  required
                  value={editingIncome.sourceName}
                  onChange={e => setEditingIncome({ ...editingIncome, sourceName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    Nominal Masuk (Rp) *
                  </label>
                  <input
                    type="number"
                    min={1000}
                    required
                    value={editingIncome.amount}
                    onChange={e => setEditingIncome({ ...editingIncome, amount: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    Metode Pembayaran *
                  </label>
                  <select
                    value={editingIncome.paymentMethod}
                    onChange={e => setEditingIncome({ ...editingIncome, paymentMethod: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white font-mono"
                  >
                    <option value="transfer">Transfer Bank</option>
                    <option value="qris">QRIS RT</option>
                    <option value="cash">Tunai / Cash</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingIncome(null)}
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

      {/* Modal 6: Hapus Pemasukan Konfirmasi */}
      {incomeToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">
                Hapus Data Pemasukan?
              </h3>
              <p className="text-xs text-slate-400">
                Apakah Anda yakin ingin menghapus data kas masuk dari <strong>{incomeToDelete.sourceName} (Rp {incomeToDelete.amount.toLocaleString('id-ID')})</strong>?
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIncomeToDelete(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteIncomeConfirm}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 text-white hover:bg-rose-500 shadow-md"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 7: Tambah Pos Plafon RAB */}
      {showAddBudgetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <PieIcon className="w-5 h-5 text-indigo-400" />
                <span>Tambah Pos Plafon RAB Baru</span>
              </h3>
              <button
                onClick={() => setShowAddBudgetModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBudget} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Kategori Pos Anggaran *
                </label>
                <select
                  value={rabCategory}
                  onChange={e => setRabCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white font-medium"
                >
                  <option value="Hadiah & Trophy">Hadiah & Trophy</option>
                  <option value="Operasional">Operasional & Perlengkapan</option>
                  <option value="Honor Wasit">Honor Wasit & Caster</option>
                  <option value="Konsumsi">Konsumsi & Logistik</option>
                  <option value="Dekorasi & Tenda">Dekorasi & Tenda Arena</option>
                  <option value="Medis & Tak Terduga">Medis & Tak Terduga</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Uraian Kebutuhan Anggaran *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Piala Bergilir RW 08 & Uang Pembinaan Juara 1-3"
                  value={rabTitle}
                  onChange={e => setRabTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    Plafon Anggaran (Rp) *
                  </label>
                  <input
                    type="number"
                    min={1000}
                    required
                    value={rabPlannedAmount}
                    onChange={e => setRabPlannedAmount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    Skala Prioritas *
                  </label>
                  <select
                    value={rabPriority}
                    onChange={e => setRabPriority(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white font-medium"
                  >
                    <option value="high">Tinggi (High Priority)</option>
                    <option value="medium">Sedang (Medium)</option>
                    <option value="low">Rendah (Low / Fleksibel)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddBudgetModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-300 hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md"
                >
                  Simpan Pos RAB
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 8: Edit Pos Plafon RAB */}
      {editingBudget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-indigo-400" />
                <span>Edit Pos RAB: {editingBudget.title}</span>
              </h3>
              <button
                onClick={() => setEditingBudget(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateBudgetSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Kategori Pos Anggaran *
                </label>
                <select
                  value={editingBudget.category}
                  onChange={e => setEditingBudget({ ...editingBudget, category: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white font-medium"
                >
                  <option value="Hadiah & Trophy">Hadiah & Trophy</option>
                  <option value="Operasional">Operasional & Perlengkapan</option>
                  <option value="Honor Wasit">Honor Wasit & Caster</option>
                  <option value="Konsumsi">Konsumsi & Logistik</option>
                  <option value="Dekorasi & Tenda">Dekorasi & Tenda Arena</option>
                  <option value="Medis & Tak Terduga">Medis & Tak Terduga</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Uraian Kebutuhan Anggaran *
                </label>
                <input
                  type="text"
                  required
                  value={editingBudget.title}
                  onChange={e => setEditingBudget({ ...editingBudget, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    Plafon Anggaran (Rp) *
                  </label>
                  <input
                    type="number"
                    min={1000}
                    required
                    value={editingBudget.plannedAmount}
                    onChange={e => setEditingBudget({ ...editingBudget, plannedAmount: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    Skala Prioritas *
                  </label>
                  <select
                    value={editingBudget.priority}
                    onChange={e => setEditingBudget({ ...editingBudget, priority: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white font-medium"
                  >
                    <option value="high">Tinggi (High Priority)</option>
                    <option value="medium">Sedang (Medium)</option>
                    <option value="low">Rendah (Low / Fleksibel)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingBudget(null)}
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

      {/* Modal 9: Hapus Pos RAB Konfirmasi */}
      {budgetToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">
                Hapus Pos Plafon RAB?
              </h3>
              <p className="text-xs text-slate-400">
                Apakah Anda yakin ingin menghapus pos anggaran <strong>{budgetToDelete.title} (Rp {budgetToDelete.plannedAmount.toLocaleString('id-ID')})</strong>?
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setBudgetToDelete(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteBudgetConfirm}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 text-white hover:bg-rose-500 shadow-md"
              >
                Ya, Hapus Pos RAB
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
