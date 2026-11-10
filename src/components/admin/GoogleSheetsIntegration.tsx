import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import { GOOGLE_APPS_SCRIPT_TEMPLATE } from '../../utils/googleSheetsSync';
import {
  FileSpreadsheet,
  Copy,
  Check,
  RefreshCw,
  Zap,
  Globe,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock
} from 'lucide-react';

export const GoogleSheetsIntegration: React.FC = () => {
  const {
    googleSheetsConfig,
    updateGoogleSheetsConfig,
    testSheetsConnection,
    triggerSyncToSheets
  } = useTournament();

  const [copied, setCopied] = useState(false);
  const [testing, setTesting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; latencyMs: number } | null>(null);

  const handleCopyScript = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_TEMPLATE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    const res = await testSheetsConnection();
    setTestResult(res);
    setTesting(false);
  };

  const handleTriggerSync = async () => {
    setSyncing(true);
    const res = await triggerSyncToSheets();
    setTestResult(res);
    setSyncing(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
            <span>Integrasi Google Sheets & Engine Google Apps Script</span>
          </h2>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
            <span>Database Cloud Utama Tanpa Biaya Server (Serverless)</span>
            <span aria-hidden="true">·</span>
            <span>Sinkronisasi Jadwal, Skor Babak, Atlet & Keuangan</span>
          </div>
        </div>

        {/* Sync Status Badge */}
        <div className="flex items-center gap-2">
          <div className={`px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-2 ${
            googleSheetsConfig.syncStatus === 'connected'
              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
              : 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-200'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              googleSheetsConfig.syncStatus === 'connected' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
            }`} />
            <span>Status: {googleSheetsConfig.syncStatus === 'connected' ? 'Terhubung (Ready)' : 'Antrean Lokal'}</span>
          </div>
        </div>
      </div>

      {/* Cloud Configuration Form */}
      <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-4 h-4 text-indigo-500" />
          <span>Konfigurasi Endpoint Google Apps Script Web App</span>
        </h3>

        <div className="space-y-3 text-xs">
          <div>
            <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
              Google Apps Script Web App Deployment URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
                value={googleSheetsConfig.scriptUrl}
                onChange={e => updateGoogleSheetsConfig({ scriptUrl: e.target.value })}
                className="flex-1 p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs"
              />
              <button
                type="button"
                disabled={testing}
                onClick={handleTestConnection}
                className="px-4 py-2 font-semibold text-xs rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 border border-indigo-200 dark:border-indigo-800 transition-colors shrink-0 flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
                <span>{testing ? 'Menguji...' : 'Uji Koneksi'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                ID Dokumen Google Spreadsheet (Sheet ID)
              </label>
              <input
                type="text"
                placeholder="1pRtCHAMPIONSHIP_DATABASE_SPREADSHEET_ID_2026"
                value={googleSheetsConfig.sheetId}
                onChange={e => updateGoogleSheetsConfig({ sheetId: e.target.value })}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs"
              />
            </div>

            <div>
              <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Interval Sinkronisasi Otomatis
              </label>
              <select
                value={googleSheetsConfig.syncIntervalMinutes}
                onChange={e => updateGoogleSheetsConfig({ syncIntervalMinutes: Number(e.target.value) })}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              >
                <option value={1}>Setiap 1 Menit (Turnamen Aktif)</option>
                <option value={5}>Setiap 5 Menit (Standar)</option>
                <option value={15}>Setiap 15 Menit (Hemat Bandwidth)</option>
              </select>
            </div>
          </div>

          {/* Test connection feedback */}
          {testResult && (
            <div className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
              testResult.success
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
            }`}>
              <div className="flex items-center gap-2">
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{testResult.message}</span>
              </div>
              <span className="font-mono text-[11px] font-bold">
                Latensi: {testResult.latencyMs} ms
              </span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-400 font-mono">
              Terakhir disinkronkan: {googleSheetsConfig.lastSyncTime ? new Date(googleSheetsConfig.lastSyncTime).toLocaleTimeString('id-ID') : 'Belum pernah'}
            </span>

            <button
              onClick={handleTriggerSync}
              disabled={syncing}
              className="px-4 py-2 font-semibold text-xs rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? 'Menyinkronkan...' : 'Sinkronkan ke Cloud Sekarang'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Step-by-Step Deployment Guide */}
      <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Petunjuk Deploy Google Apps Script (1 Menit Jadi)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Salin script di bawah ini ke editor Apps Script spreadsheet Anda untuk mengaktifkan sinkronisasi cloud real-time.
            </p>
          </div>

          <button
            onClick={handleCopyScript}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm transition-colors flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin!' : 'Salin Seluruh Kode .GS'}</span>
          </button>
        </div>

        <ol className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs text-slate-600 dark:text-slate-400">
          <li className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono">Langkah 1</span>
            <p>Buka spreadsheet baru di Google Drive, klik <strong>Ekstensi &gt; Apps Script</strong>.</p>
          </li>
          <li className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono">Langkah 2</span>
            <p>Hapus isi kode default, lalu tempelkan (paste) script generator di bawah ini.</p>
          </li>
          <li className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono">Langkah 3</span>
            <p>Klik <strong>Deploy &gt; New Deployment &gt; Web app</strong>. Pilih Who has access: <em>Anyone</em>.</p>
          </li>
          <li className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono">Langkah 4</span>
            <p>Salin <strong>Web App URL</strong> yang dihasilkan dan tempelkan ke kolom form di atas.</p>
          </li>
        </ol>

        {/* Script Preview Box */}
        <div className="relative">
          <pre className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] overflow-x-auto max-h-64 border border-slate-800">
            {GOOGLE_APPS_SCRIPT_TEMPLATE}
          </pre>
        </div>
      </div>

    </div>
  );
};
