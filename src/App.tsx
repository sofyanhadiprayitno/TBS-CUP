/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TournamentProvider, useTournament } from './context/TournamentContext';
import { Navbar } from './components/Navbar';
import { LiveScoreTicker } from './components/LiveScoreTicker';
import { NotificationDrawer } from './components/NotificationDrawer';
import { ScoreModal } from './components/admin/ScoreModal';
import { RegistrationModal } from './components/public/RegistrationModal';
import { AuthModal } from './components/auth/AuthModal';

// Public Views
import { PublicTournamentView } from './components/public/PublicTournamentView';
import { TournamentBracketView } from './components/admin/TournamentBracketView';
import { StandingsManager } from './components/admin/StandingsManager';
import { SportsAndRTManager } from './components/admin/SportsAndRTManager';

// Admin Views
import { AdminDashboard } from './components/admin/AdminDashboard';
import { MatchManager } from './components/admin/MatchManager';
import { AthletesManager } from './components/admin/AthletesManager';
import { FinanceManager } from './components/admin/FinanceManager';
import { SponsorAndPaymentManager } from './components/admin/SponsorAndPaymentManager';
import { CommitteeAndRefereesManager } from './components/admin/CommitteeAndRefereesManager';
import { GoogleSheetsIntegration } from './components/admin/GoogleSheetsIntegration';
import { NotificationHub } from './components/admin/NotificationHub';
import { AuditAndBackupManager } from './components/admin/AuditAndBackupManager';
import { SettingsAndRBACManager } from './components/admin/SettingsAndRBACManager';

import {
  Trophy,
  LayoutDashboard,
  Radio,
  GitBranch,
  Users,
  Wallet,
  Briefcase,
  Users2,
  FileSpreadsheet,
  Bell,
  Lock,
  Settings,
  ShieldAlert,
  Palette,
  Phone,
  Mail
} from 'lucide-react';

const MainLayout: React.FC = () => {
  const { identity, activeRole, currentUser } = useTournament();

  const [currentTab, setCurrentTab] = useState<string>('public-live');
  const [activeScoreMatchId, setActiveScoreMatchId] = useState<string | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showNotifDrawer, setShowNotifDrawer] = useState<boolean>(false);

  const isAdminTab = currentTab.startsWith('admin-');

  // Admin secondary sidebar navigation items
  const adminSubTabs = [
    { id: 'admin-dashboard', label: 'Ringkasan Dasbor', icon: LayoutDashboard },
    { id: 'admin-matches', label: 'Skor Babak 1 & 2', icon: Radio },
    { id: 'admin-bracket', label: 'Bagan Turnamen', icon: GitBranch },
    { id: 'admin-athletes', label: 'Data Atlet & Verifikasi', icon: Users },
    { id: 'admin-cabor-rt', label: 'Cabor & Kontingen RT', icon: Palette },
    { id: 'admin-finance', label: 'Keuangan & SPJ', icon: Wallet },
    { id: 'admin-sponsor', label: 'Sponsor & QRIS', icon: Briefcase },
    { id: 'admin-committee', label: 'Panitia & Wasit', icon: Users2 },
    { id: 'admin-sheets', label: 'Google Sheets Sync', icon: FileSpreadsheet },
    { id: 'admin-notifs', label: 'Broadcast & Notifikasi', icon: Bell },
    { id: 'admin-audit', label: 'Audit Log & Backup', icon: Lock },
    { id: 'admin-settings', label: 'Identitas & Hak Akses', icon: Settings }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        openAuthModal={() => setShowAuthModal(true)}
        openNotifDrawer={() => setShowNotifDrawer(true)}
      />

      {/* Real-Time Live Score Ticker Strip */}
      <LiveScoreTicker
        onSelectMatch={matchId => {
          setActiveScoreMatchId(matchId);
        }}
      />

      {/* Admin Subnav Toolbar when inside Admin views */}
      {isAdminTab && (
        <div className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-16 z-30 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-1 overflow-x-auto py-2 no-scrollbar">
              {adminSubTabs.map(sub => {
                const Icon = sub.icon;
                const isActive = currentTab === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setCurrentTab(sub.id)}
                    className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{sub.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* PUBLIC CITIZEN TABS */}
        {currentTab === 'public-live' && (
          <PublicTournamentView
            onOpenRegisterModal={() => setShowRegisterModal(true)}
            onOpenScoreModal={mId => setActiveScoreMatchId(mId)}
          />
        )}

        {currentTab === 'public-bracket' && (
          <TournamentBracketView
            onOpenScoreModal={mId => setActiveScoreMatchId(mId)}
            readOnly={activeRole === 'public'}
          />
        )}

        {currentTab === 'public-standings' && (
          <StandingsManager />
        )}

        {currentTab === 'public-cabor' && (
          <SportsAndRTManager />
        )}

        {currentTab === 'public-register' && (
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2 py-4">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Pendaftaran Mandiri Atlet Antar-RT
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Warga RW 08 yang memiliki hobi dan bakat dalam e-sports maupun olahraga dapat mendaftarkan diri secara langsung.
              </p>
              <button
                onClick={() => setShowRegisterModal(true)}
                className="mt-2 px-6 py-2.5 text-xs font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 shadow-md transition-colors"
              >
                + Buka Formulir Pendaftaran Sekarang
              </button>
            </div>
            <AthletesManager />
          </div>
        )}

        {/* ADMIN PANITIA TABS */}
        {currentTab === 'admin-dashboard' && (
          <AdminDashboard
            onNavigateTab={tab => setCurrentTab(tab)}
            onOpenScoreModal={mId => setActiveScoreMatchId(mId)}
          />
        )}

        {currentTab === 'admin-matches' && (
          <MatchManager />
        )}

        {currentTab === 'admin-bracket' && (
          <TournamentBracketView
            onOpenScoreModal={mId => setActiveScoreMatchId(mId)}
          />
        )}

        {currentTab === 'admin-athletes' && (
          <AthletesManager />
        )}

        {currentTab === 'admin-cabor-rt' && (
          <SportsAndRTManager />
        )}

        {currentTab === 'admin-finance' && (
          <FinanceManager />
        )}

        {currentTab === 'admin-sponsor' && (
          <SponsorAndPaymentManager />
        )}

        {currentTab === 'admin-committee' && (
          <CommitteeAndRefereesManager />
        )}

        {currentTab === 'admin-sheets' && (
          <GoogleSheetsIntegration />
        )}

        {currentTab === 'admin-notifs' && (
          <NotificationHub />
        )}

        {currentTab === 'admin-audit' && (
          <AuditAndBackupManager />
        )}

        {currentTab === 'admin-settings' && (
          <SettingsAndRBACManager />
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-xs text-slate-500 dark:text-slate-400 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-indigo-500 shrink-0" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {identity.name}
            </span>
            <span>·</span>
            <span>{identity.organizer}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-mono">
            {identity.contactWa && (
              <a
                href={`https://wa.me/${identity.contactWa.replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 hover:underline"
                title="Nomor Kontak WhatsApp Panitia"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Kontak: {identity.contactWa}</span>
              </a>
            )}
            <span className="hidden sm:inline">·</span>
            {identity.contactEmail && (
              <a
                href={`mailto:${identity.contactEmail}`}
                className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-indigo-500 hover:underline font-sans"
                title="Email Resmi Panitia"
              >
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Email: {identity.contactEmail}</span>
              </a>
            )}
            <span>·</span>
            <button
              onClick={() => setShowAuthModal(true)}
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              {currentUser ? `Pengurus: ${currentUser.fullName}` : 'Login Pengurus'}
            </button>
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      {activeScoreMatchId && (
        <ScoreModal
          matchId={activeScoreMatchId}
          onClose={() => setActiveScoreMatchId(null)}
        />
      )}

      {showRegisterModal && (
        <RegistrationModal
          onClose={() => setShowRegisterModal(false)}
        />
      )}

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
        />
      )}

      <NotificationDrawer
        isOpen={showNotifDrawer}
        onClose={() => setShowNotifDrawer(false)}
      />

    </div>
  );
};

export default function App() {
  return (
    <TournamentProvider>
      <MainLayout />
    </TournamentProvider>
  );
}
