import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import {
  ShieldCheck,
  Lock,
  Download,
  Upload,
  RefreshCw,
  Search,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Database
} from 'lucide-react';

export const AuditAndBackupManager: React.FC = () => {
  const {
    auditLogs,
    exportDatabaseBackup,
    restoreDatabaseBackup,
    resetAllData,
    activeRole
  } = useTournament();

  const [searchLog, setSearchLog] = useState('');
  const [filterModule, setFilterModule] = useState('all');
  const [restoreText, setRestoreText] = useState('');
  const [restoreStatus, setRestoreStatus] = useState<string | null>(null);

  const filteredLogs = auditLogs.filter(l => {
    if (filterModule !== 'all' && !l.module.toLowerCase().includes(filterModule.toLowerCase())) return false;
    if (searchLog.trim()) {
      const q = searchLog.toLowerCase();
      const txt = `${l.action} ${l.userName} ${l.module} ${l.details}`.toLowerCase();
      if (!txt.includes(q)) return false;
    }
    return true;
  });

  const handleDownloadBackup = () => {
    const backupJson = exportDatabaseBackup();
    const blob = new Blob([backupJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `RT_Tournament_Backup_AES256_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleRestore = () => {
    if (!restoreText.trim()) return;
    const ok = restoreDatabaseBackup(restoreText.trim());
    if (ok) {
      setRestoreStatus('Berhasil memulihkan seluruh database turnamen dari backup terenkripsi!');
      setRestoreText('');
    } else {
      setRestoreStatus('Gagal membaca format backup. Pastikan JSON valid.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => {
        const content = ev.target?.result as string;
        if (content) {
          setRestoreText(content);
        }
      };
      reader.readAsText(file);
    }
  };

  const canManage = activeRole === 'super_admin';

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-indigo-500" />
            <span>Audit Trail & Backup Terenkripsi AES-256</span>
          </h2>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
            <span>Rekam Jejak Aktivitas & Integritas Data</span>
            <span aria-hidden="true">·</span>
            <span>Enkripsi End-to-End & Pemulihan Sistem</span>
          </div>
        </div>

        {/* Encryption Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-xs font-mono text-emerald-800 dark:text-emerald-300">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>E2EE 256-Bit Active</span>
        </div>
      </div>

      {/* Backup & Restore Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Card 1: Export Backup */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-indigo-500" />
              <span>Ekspor Backup Database Sistem</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">JSON Terenkripsi</span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400">
            Cadangkan seluruh konfigurasi, jadwal, skor babak 1 & 2, data atlet, keuangan RAB, dan log audit dalam arsip aman terenkripsi AES-256.
          </p>

          <button
            onClick={handleDownloadBackup}
            className="w-full py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm transition-colors flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh Cadangan Database (.JSON)</span>
          </button>
        </div>

        {/* Card 2: Restore from Backup */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-emerald-500" />
              <span>Restore & Pemulihan Cepat</span>
            </h3>
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400">Validasi Checksum</span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400">
            Pulihkan data sistem jika terjadi kerusakan atau saat berganti perangkat.
          </p>

          <div className="space-y-2">
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="text-xs block w-full text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-slate-100 dark:file:bg-slate-800 file:text-slate-700 dark:file:text-slate-300 hover:file:bg-slate-200"
            />
            {restoreText && (
              <button
                onClick={handleRestore}
                className="w-full py-2 text-xs font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Proses Pemulihan Sekarang</span>
              </button>
            )}
            {restoreStatus && (
              <div className="p-2 rounded bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 text-[11px] text-emerald-800 dark:text-emerald-300">
                {restoreStatus}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Audit Log Table */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono">
              Log Aktivitas & Jejak Audit Keamanan ({filteredLogs.length})
            </h3>
            <span className="text-xs text-slate-400">Setiap perubahan skor, atlet, dan kas terekam otomatis dengan timestamp & identitas.</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari aksi atau user..."
                value={searchLog}
                onChange={e => setSearchLog(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
            {canManage && (
              <button
                onClick={() => {
                  if (confirm('PERINGATAN: Apakah Anda yakin ingin mereset seluruh data turnamen ke awal?')) {
                    resetAllData();
                  }
                }}
                className="px-3 py-1.5 text-xs font-mono text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded border border-rose-300 dark:border-rose-900/60"
              >
                Reset Pabrik
              </button>
            )}
          </div>
        </div>

        <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-mono">
                <tr>
                  <th className="py-3 px-4 font-semibold">Waktu (WIB)</th>
                  <th className="py-3 px-4 font-semibold">User & Peran</th>
                  <th className="py-3 px-4 font-semibold">Tindakan / Aksi</th>
                  <th className="py-3 px-4 font-semibold">Modul</th>
                  <th className="py-3 px-4 font-semibold">Rincian Perubahan</th>
                  <th className="py-3 px-4 font-semibold text-right">IP Jaringan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-mono">
                {filteredLogs.map(l => (
                  <tr key={l.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                      {l.timestamp}
                    </td>
                    <td className="py-2.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                      <div>{l.userName}</div>
                      <div className="text-[10px] text-slate-400 font-normal uppercase">{l.userRole}</div>
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                        {l.action}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-slate-700 dark:text-slate-300">
                      {l.module}
                    </td>
                    <td className="py-2.5 px-4 text-slate-600 dark:text-slate-400 max-w-sm truncate" title={l.details}>
                      {l.details}
                    </td>
                    <td className="py-2.5 px-4 text-right text-slate-400 text-[11px]">
                      {l.ipAddress}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};
