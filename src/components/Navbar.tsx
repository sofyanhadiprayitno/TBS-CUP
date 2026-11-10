import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import {
  Trophy,
  Moon,
  Sun,
  Shield,
  User,
  LogOut,
  Menu,
  X,
  FileSpreadsheet,
  Globe,
  Bell,
  Phone,
  Mail
} from 'lucide-react';
import { PWAInstallButton } from './common/PWAInstallBanner';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openAuthModal: () => void;
  openNotifDrawer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  openAuthModal,
  openNotifDrawer
}) => {
  const {
    identity,
    currentUser,
    activeRole,
    logout,
    isDarkMode,
    toggleDarkMode,
    language,
    setLanguage,
    notifications,
    googleSheetsConfig
  } = useTournament();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const publicNavItems = [
    { id: 'public-live', labelId: 'Pusat Skor & Live', labelEn: 'Scores & Live' },
    { id: 'public-bracket', labelId: 'Bagan Turnamen', labelEn: 'Bracket' },
    { id: 'public-standings', labelId: 'Klasemen RT', labelEn: 'Standings' },
    { id: 'public-cabor', labelId: 'Cabang & Aturan', labelEn: 'Sports & Rules' },
    { id: 'public-register', labelId: 'Daftar Atlet Mandiri', labelEn: 'Register Athlete' }
  ];

  const adminNavItems = [
    { id: 'admin-dashboard', labelId: 'Dasbor Panitia', labelEn: 'Dashboard' },
    { id: 'admin-matches', labelId: 'Kelola Skor & Babak', labelEn: 'Scorekeeper' },
    { id: 'admin-bracket', labelId: 'Bagan Pertandingan', labelEn: 'Bracket Manager' },
    { id: 'admin-athletes', labelId: 'Data Atlet & Tim', labelEn: 'Athletes & Teams' },
    { id: 'admin-finance', labelId: 'Anggaran & SPJ', labelEn: 'Finances' },
    { id: 'admin-sheets', labelId: 'Google Sheets & AppScript', labelEn: 'Sheets Sync' }
  ];

  const isAdminTab = currentTab.startsWith('admin-');
  const navItems = isAdminTab ? adminNavItems : publicNavItems;

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'super_admin': return 'Super Admin';
      case 'ketua_panitia': return 'Ketua Panitia';
      case 'wasit': return 'Wasit / Scorer';
      case 'bendahara': return 'Bendahara';
      case 'pengurus_rt': return 'Admin RT';
      default: return 'Warga / Tamu';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setCurrentTab('public-live')}
              className="flex items-center gap-2 text-left group focus-visible:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 text-slate-950 flex items-center justify-center font-bold text-lg shadow-sm overflow-hidden border border-amber-300/40">
                {identity.logoUrl ? (
                  <img
                    src={identity.logoUrl}
                    alt="Logo"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <Trophy className="w-5 h-5 text-slate-950" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                  {identity.name.split(' ')[0]} {identity.name.split(' ')[1] || 'Cup'}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono tracking-tight leading-none whitespace-nowrap">
                  {identity.season}
                </span>
              </div>
            </button>

          </div>

          {/* Zone 2: 4-5 concise single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            {navItems.map(item => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`relative py-1 text-sm font-medium whitespace-nowrap shrink-0 transition-colors ${
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {language === 'id' ? item.labelId : item.labelEn}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action & Controls */}
          <div className="flex items-center gap-2.5 shrink-0">
            
            {/* PWA Install Button for all devices */}
            <PWAInstallButton />

            {/* Quick Contact Hotline */}
            {identity.contactWa && (
              <a
                href={`https://wa.me/${identity.contactWa.replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg border border-emerald-200 dark:border-emerald-800/60 transition-colors"
                title="Hubungi Kontak Panitia WhatsApp"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{identity.contactWa}</span>
              </a>
            )}

            {/* View Switcher (Public Portal vs Admin Console) */}
            <button
              onClick={() => setCurrentTab(isAdminTab ? 'public-live' : 'admin-dashboard')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                isAdminTab
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                  : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60 hover:bg-indigo-100'
              }`}
            >
              {isAdminTab ? (language === 'id' ? '← Portal Warga' : '← Citizen View') : (language === 'id' ? 'Masuk Panitia →' : 'Admin Panel →')}
            </button>

            {/* Notification Bell */}
            <button
              onClick={openNotifDrawer}
              aria-label="Notifications"
              className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
              className="p-1.5 text-xs font-mono uppercase text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1"
              title="Ganti Bahasa"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language}</span>
            </button>

            {/* Dark Mode Switcher */}
            <button
              onClick={toggleDarkMode}
              aria-label="Toggle theme"
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Auth Profile / Login Button */}
            {currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                <button
                  onClick={openAuthModal}
                  className="flex items-center gap-2 py-1 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                >
                  <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs">
                    {currentUser.fullName.charAt(0)}
                  </div>
                  <div className="hidden xl:flex flex-col">
                    <span className="text-xs font-medium text-slate-800 dark:text-slate-200 max-w-[110px] truncate">
                      {currentUser.fullName}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-none">
                      {getRoleBadge(currentUser.role)}
                    </span>
                  </div>
                </button>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-1.5 text-slate-400 hover:text-rose-500 rounded transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors whitespace-nowrap shrink-0 shadow-sm flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>{language === 'id' ? 'Login Pengurus' : 'Staff Login'}</span>
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="p-2 md:hidden text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-1">
            <div className="px-3 py-1.5 text-[11px] font-mono text-slate-400 uppercase">
              {isAdminTab ? 'Menu Admin Panitia' : 'Menu Warga & Publik'}
            </div>
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 rounded-md text-sm font-medium ${
                  currentTab === item.id
                    ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {language === 'id' ? item.labelId : item.labelEn}
              </button>
            ))}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex gap-2 px-3">
              <button
                onClick={() => {
                  setCurrentTab(isAdminTab ? 'public-live' : 'admin-dashboard');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-center"
              >
                {isAdminTab ? 'Beralih ke Portal Warga' : 'Beralih ke Panel Panitia'}
              </button>
            </div>

            {/* Official Contact Info in Mobile Menu */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 px-3 space-y-1.5 text-xs">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
                Kontak & Email Resmi Panitia:
              </span>
              {identity.contactWa && (
                <a
                  href={`https://wa.me/${identity.contactWa.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-mono text-[11px]"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{identity.contactWa}</span>
                </a>
              )}
              {identity.contactEmail && (
                <a
                  href={`mailto:${identity.contactEmail}`}
                  className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-indigo-500 text-[11px]"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{identity.contactEmail}</span>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
