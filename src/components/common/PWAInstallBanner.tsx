import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import {
  Download,
  Smartphone,
  Monitor,
  Apple,
  Share2,
  PlusSquare,
  CheckCircle2,
  X,
  Sparkles,
  Zap,
  ShieldCheck
} from 'lucide-react';

export const PWAInstallModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, isDesktop, install, platformLabel } = usePWAInstall();
  const [justInstalled, setJustInstalled] = useState(false);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (isInstallable) {
      const ok = await install();
      if (ok) {
        setJustInstalled(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100">
        
        {/* Modal Header */}
        <div className="relative p-6 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white overflow-hidden border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 p-0.5 shadow-lg shrink-0">
              <img
                src="/pwa-192x192.png"
                alt="App Icon"
                className="w-full h-full object-cover rounded-[14px]"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-amber-400 uppercase tracking-wider font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Instalasi Resmi Aplikasi</span>
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight mt-0.5">
                Turnamen RT E-Sports
              </h3>
              <p className="text-xs text-slate-300">
                Akses cepat, notifikasi real-time & hemat kuota
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-xs">
          {justInstalled || isInstalled ? (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-200">
                Aplikasi Berhasil Terpasang!
              </h4>
              <p className="text-emerald-700 dark:text-emerald-300 text-[11px]">
                Icon Turnamen RT sekarang telah berada di layar utama perangkat Anda.
              </p>
            </div>
          ) : (
            <>
              {/* Platform Detection Badge */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  {isIOS ? (
                    <Apple className="w-4 h-4 text-slate-800 dark:text-slate-200" />
                  ) : isAndroid ? (
                    <Smartphone className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Monitor className="w-4 h-4 text-indigo-500" />
                  )}
                  <span className="font-semibold">Terdeteksi: <strong>{platformLabel}</strong></span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  PWA Ready
                </span>
              </div>

              {/* Platform Instructions */}
              {isIOS ? (
                /* Apple iOS / iPadOS Instructions */
                <div className="space-y-3 p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 text-indigo-950 dark:text-indigo-200">
                  <h4 className="font-bold text-sm flex items-center gap-1.5 text-indigo-900 dark:text-indigo-100">
                    <Apple className="w-4 h-4" /> Cara Pasang di iPhone / iPad:
                  </h4>
                  <ol className="space-y-2.5 text-xs list-decimal list-inside leading-relaxed text-slate-700 dark:text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">1.</span>
                      <span>
                        Buka web ini di <strong>Safari</strong>, lalu tekan tombol <strong>Bagikan / Share</strong> (<Share2 className="w-3.5 h-3.5 inline text-indigo-500" /> di bilah bawah).
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">2.</span>
                      <span>
                        Geser ke bawah dan pilih <strong>"Tambah ke Layar Utama"</strong> (<PlusSquare className="w-3.5 h-3.5 inline text-indigo-500" /> / <em>Add to Home Screen</em>).
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">3.</span>
                      <span>
                        Tekan <strong>"Tambah / Add"</strong> di pojok kanan atas. Icon aplikasi akan langsung muncul di home screen!
                      </span>
                    </li>
                  </ol>
                </div>
              ) : isInstallable ? (
                /* Android & Desktop 1-Click Install */
                <div className="space-y-3">
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-xs">
                    Pasang aplikasi langsung ke perangkat Anda untuk mendapatkan pengalaman layar penuh tanpa bilah peramban dan sinkronisasi skor instan.
                  </p>
                  <button
                    onClick={handleInstallClick}
                    className="w-full py-3 px-4 font-bold text-sm rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-lg hover:shadow-amber-500/20 transition-all flex items-center justify-center gap-2 transform active:scale-98"
                  >
                    <Download className="w-4 h-4 text-slate-950" />
                    <span>Pasang Aplikasi Sekarang (1-Klik)</span>
                  </button>
                </div>
              ) : (
                /* Desktop Browser Instructions */
                <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                  <h4 className="font-bold text-xs flex items-center gap-1.5 text-slate-900 dark:text-white">
                    <Monitor className="w-4 h-4 text-indigo-500" /> Cara Pasang di Desktop (Chrome / Edge / Safari):
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    Klik icon <strong>Pasang / Install App</strong> (<Download className="w-3.5 h-3.5 inline text-amber-500" />) pada bilah alamat URL peramban Anda di pojok kanan atas, lalu pilih <strong>Install</strong>.
                  </p>
                </div>
              )}

              {/* Benefits Checklist */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Loading Instan & Ringan</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Dukungan Mode Offline</span>
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Tutup
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export const PWAInstallButton: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { isInstalled, isInstallable, isIOS, platformLabel } = usePWAInstall();
  const [modalOpen, setModalOpen] = useState(false);

  // If already running in standalone mode, do not show install CTA
  if (isInstalled) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className={`px-3 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-sm transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 transform active:scale-95 ${className}`}
        title={`Instal Aplikasi untuk ${platformLabel}`}
      >
        <Download className="w-3.5 h-3.5 text-slate-950" />
        <span>Instal App</span>
      </button>

      <PWAInstallModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};
