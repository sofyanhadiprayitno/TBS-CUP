import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import {
  Shield,
  KeyRound,
  User,
  X,
  CheckCircle2,
  Lock,
  Zap,
  Info
} from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const { login, currentUser, activeRole, users } = useTournament();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [forgotInput, setForgotInput] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const success = login(username, password);
    if (success) {
      onClose();
    } else {
      setErrorMessage('Username atau kata sandi tidak cocok. Silakan periksa kembali atau gunakan fitur lupa kata sandi.');
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = users.find(u => u.username.toLowerCase() === forgotInput.toLowerCase() || u.email.toLowerCase() === forgotInput.toLowerCase());
    if (found) {
      setForgotMessage(`Kata sandi akun Anda "${found.fullName}": ${found.passwordHash}. Anda sekarang dapat masuk.`);
    } else {
      setForgotMessage('Data pengguna tidak ditemukan. Silakan cek kembali.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {showForgot ? 'Pemulihan Kata Sandi' : 'Login Panitia & Pengurus RT'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Warga & penonton umum dapat mengakses portal tanpa login
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {showForgot ? (
          /* Forgot Password View */
          <form onSubmit={handleForgotSubmit} className="space-y-3 text-xs">
            <p className="text-slate-600 dark:text-slate-400">
              Masukkan username atau email pengurus Anda yang terdaftar dalam sistem:
            </p>
            <div>
              <input
                type="text"
                required
                placeholder="admin / wasit / ketua / email..."
                value={forgotInput}
                onChange={e => setForgotInput(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
              />
            </div>

            {forgotMessage && (
              <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 text-indigo-900 dark:text-indigo-200 text-[11px] font-mono">
                {forgotMessage}
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setShowForgot(false)}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                ← Kembali ke Form Login
              </button>
              <button
                type="submit"
                className="px-4 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm"
              >
                Cek Akun
              </button>
            </div>
          </form>
        ) : (
          /* Normal Login Form */
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            {errorMessage && (
              <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs">
                {errorMessage}
              </div>
            )}

            <div>
              <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Username Pengurus / Panitia
              </label>
              <input
                type="text"
                required
                placeholder="admin / wasit / ketua / bendahara / pengurus_rt03"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-medium text-slate-700 dark:text-slate-300">
                  Kata Sandi
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Lupa kata sandi?
                </button>
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Masuk ke Panel Pengurus</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
