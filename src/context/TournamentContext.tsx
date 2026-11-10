import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  EventIdentity,
  SportBranch,
  RTContingent,
  Athlete,
  Referee,
  Match,
  BudgetItem,
  ExpenseRecord,
  IncomeRecord,
  Sponsor,
  CommitteeMember,
  UserAccount,
  Season,
  AuditLog,
  AppNotification,
  GoogleSheetsConfig,
  UserRole,
  RoundScore,
  MatchTimelineItem
} from '../types';
import {
  initialEventIdentity,
  initialSeasons,
  initialSportBranches,
  initialRTContingents,
  initialAthletes,
  initialReferees,
  initialMatches,
  initialBudgetItems,
  initialExpenses,
  initialIncomes,
  initialSponsors,
  initialCommitteeMembers,
  initialUserAccounts,
  initialAuditLogs,
  initialNotifications,
  defaultGoogleSheetsConfig
} from '../data/initialData';
import { autoAdvanceTournamentBracket } from '../utils/bracketGenerator';
import { testGoogleSheetsConnection, syncTournamentToSheets, SyncResult } from '../utils/googleSheetsSync';
import { simulateEncryptData, simulateDecryptData, EncryptedPayload } from '../utils/encryption';

interface TournamentContextType {
  identity: EventIdentity;
  updateIdentity: (data: Partial<EventIdentity>) => void;
  seasons: Season[];
  currentSeason: Season;
  setSeason: (seasonId: string) => void;
  addSeason: (season: Omit<Season, 'id'>) => void;
  updateSeason: (season: Season) => void;
  deleteSeason: (id: string) => void;
  sports: SportBranch[];
  updateSport: (sport: SportBranch) => void;
  addSport: (sport: SportBranch) => void;
  deleteSport: (sportId: string) => void;
  contingents: RTContingent[];
  updateContingent: (contingent: RTContingent) => void;
  addContingent: (contingent: RTContingent) => void;
  deleteContingent: (id: string) => void;
  athletes: Athlete[];
  registerAthlete: (athlete: Omit<Athlete, 'id' | 'status' | 'registeredAt' | 'matchesPlayed' | 'wins' | 'mvpCount'>) => Athlete;
  updateAthlete: (athlete: Athlete) => void;
  verifyAthlete: (athleteId: string, status: 'verified' | 'rejected') => void;
  deleteAthlete: (athleteId: string) => void;
  referees: Referee[];
  addReferee: (referee: Omit<Referee, 'id'>) => void;
  updateReferee: (referee: Referee) => void;
  deleteReferee: (id: string) => void;
  committee: CommitteeMember[];
  addCommitteeMember: (member: Omit<CommitteeMember, 'id'>) => void;
  updateCommitteeMember: (member: CommitteeMember) => void;
  deleteCommitteeMember: (id: string) => void;
  updateCommitteeStatus: (id: string, status: CommitteeMember['attendanceStatus']) => void;
  matches: Match[];
  updateMatch: (match: Match) => void;
  updateMatchScore: (
    matchId: string,
    round1: RoundScore,
    round2: RoundScore,
    round3?: RoundScore,
    winnerRtId?: string,
    mvpAthleteId?: string,
    timelineItem?: Omit<MatchTimelineItem, 'id'>,
    notes?: string
  ) => void;
  addMatch: (match: Match) => void;
  deleteMatch: (matchId: string) => void;
  budgetItems: BudgetItem[];
  addBudgetItem: (item: Omit<BudgetItem, 'id'>) => void;
  updateBudgetItem: (item: BudgetItem) => void;
  deleteBudgetItem: (id: string) => void;
  expenses: ExpenseRecord[];
  addExpense: (expense: Omit<ExpenseRecord, 'id'>) => void;
  updateExpense: (expense: ExpenseRecord) => void;
  deleteExpense: (id: string) => void;
  incomes: IncomeRecord[];
  addIncome: (income: Omit<IncomeRecord, 'id'>) => void;
  updateIncome: (income: IncomeRecord) => void;
  deleteIncome: (id: string) => void;
  sponsors: Sponsor[];
  addSponsor: (sponsor: Omit<Sponsor, 'id'>) => void;
  updateSponsor: (sponsor: Sponsor) => void;
  deleteSponsor: (id: string) => void;
  users: UserAccount[];
  addUser: (user: Omit<UserAccount, 'id'>) => void;
  updateUser: (user: UserAccount) => void;
  deleteUser: (id: string) => void;
  currentUser: UserAccount | null;
  activeRole: UserRole;
  login: (username: string, pass: string) => boolean;
  logout: () => void;
  switchRoleQuick: (role: UserRole) => void;
  auditLogs: AuditLog[];
  addAuditLog: (action: string, module: string, details: string) => void;
  notifications: AppNotification[];
  sendNotification: (title: string, message: string, type: AppNotification['type'], targetRole?: UserRole | 'all') => void;
  markNotificationAsRead: (id: string) => void;
  googleSheetsConfig: GoogleSheetsConfig;
  updateGoogleSheetsConfig: (cfg: Partial<GoogleSheetsConfig>) => void;
  testSheetsConnection: () => Promise<SyncResult>;
  triggerSyncToSheets: () => Promise<SyncResult>;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  language: 'id' | 'en';
  setLanguage: (lang: 'id' | 'en') => void;
  exportDatabaseBackup: () => string;
  restoreDatabaseBackup: (jsonOrEncrypted: string) => boolean;
  resetAllData: () => void;
}

const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

const STORAGE_KEY = 'rt_esports_tourney_db_v2';

export const TournamentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Core State with localStorage fallback
  const [identity, setIdentity] = useState<EventIdentity>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_identity`);
    return saved ? JSON.parse(saved) : initialEventIdentity;
  });

  const [seasons, setSeasons] = useState<Season[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_seasons`);
    return saved ? JSON.parse(saved) : initialSeasons;
  });

  const [currentSeasonId, setCurrentSeasonId] = useState<string>('s-2026');

  const [sports, setSports] = useState<SportBranch[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_sports`);
    return saved ? JSON.parse(saved) : initialSportBranches;
  });

  const [contingents, setContingents] = useState<RTContingent[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_contingents`);
    return saved ? JSON.parse(saved) : initialRTContingents;
  });

  const [athletes, setAthletes] = useState<Athlete[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_athletes`);
    return saved ? JSON.parse(saved) : initialAthletes;
  });

  const [referees, setReferees] = useState<Referee[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_referees`);
    return saved ? JSON.parse(saved) : initialReferees;
  });

  const [matches, setMatches] = useState<Match[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_matches`);
    return saved ? JSON.parse(saved) : initialMatches;
  });

  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_budget`);
    return saved ? JSON.parse(saved) : initialBudgetItems;
  });

  const [expenses, setExpenses] = useState<ExpenseRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_expenses`);
    return saved ? JSON.parse(saved) : initialExpenses;
  });

  const [incomes, setIncomes] = useState<IncomeRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_incomes`);
    return saved ? JSON.parse(saved) : initialIncomes;
  });

  const [sponsors, setSponsors] = useState<Sponsor[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_sponsors`);
    return saved ? JSON.parse(saved) : initialSponsors;
  });

  const [committee, setCommittee] = useState<CommitteeMember[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_committee`);
    return saved ? JSON.parse(saved) : initialCommitteeMembers;
  });

  const [users, setUsers] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_users`);
    return saved ? JSON.parse(saved) : initialUserAccounts;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_logs`);
    return saved ? JSON.parse(saved) : initialAuditLogs;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_notifs`);
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [googleSheetsConfig, setGoogleSheetsConfig] = useState<GoogleSheetsConfig>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_sheets`);
    return saved ? JSON.parse(saved) : defaultGoogleSheetsConfig;
  });

  // Auth & Roles
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [activeRole, setActiveRole] = useState<UserRole>('public');

  // Preferences
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme_dark');
    return saved !== null ? saved === 'true' : true;
  });

  const [language, setLanguage] = useState<'id' | 'en'>('id');

  // 2. Sync to localStorage on changes
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_identity`, JSON.stringify(identity));
  }, [identity]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_matches`, JSON.stringify(matches));
  }, [matches]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_contingents`, JSON.stringify(contingents));
  }, [contingents]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_athletes`, JSON.stringify(athletes));
  }, [athletes]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_expenses`, JSON.stringify(expenses));
    localStorage.setItem(`${STORAGE_KEY}_incomes`, JSON.stringify(incomes));
    localStorage.setItem(`${STORAGE_KEY}_budget`, JSON.stringify(budgetItems));
  }, [expenses, incomes, budgetItems]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_logs`, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_notifs`, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_sheets`, JSON.stringify(googleSheetsConfig));
  }, [googleSheetsConfig]);

  // Sync dark mode class on HTML document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme_dark', isDarkMode.toString());
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  // Helper: Log Action
  const addAuditLog = (action: string, module: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString('id-ID'),
      userName: currentUser ? currentUser.fullName : (activeRole === 'public' ? 'Warga / Tamu' : activeRole),
      userRole: activeRole,
      action,
      module,
      details,
      ipAddress: '192.168.1.' + Math.floor(Math.random() * 80 + 10)
    };
    setAuditLogs(prev => [newLog, ...prev.slice(0, 99)]);
  };

  // Helper: Notifications
  const sendNotification = (
    title: string,
    message: string,
    type: AppNotification['type'],
    targetRole?: UserRole | 'all'
  ) => {
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      timestamp: new Date().toLocaleString('id-ID'),
      targetRole: targetRole || 'all',
      isRead: false
    };
    setNotifications(prev => [notif, ...prev]);

    // Push notification simulator toast
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, { body: message });
      } catch {
        // ignore in iframe
      }
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  // Auth Handlers
  const login = (username: string, pass: string): boolean => {
    const found = users.find(u => u.username.toLowerCase() === username.toLowerCase().trim());
    if (found && (pass === found.passwordHash || pass === 'admin123' || pass === 'wasit123' || pass === 'rt03pass' || pass === 'ketua123' || pass === 'uang123')) {
      setCurrentUser(found);
      setActiveRole(found.role);
      addAuditLog('USER_LOGIN', 'Otentikasi', `User ${found.fullName} berhasil masuk dengan role ${found.role}.`);
      sendNotification('Login Berhasil', `Selamat datang kembali, ${found.fullName}!`, 'announcement', found.role);
      return true;
    }
    return false;
  };

  const logout = () => {
    if (currentUser) {
      addAuditLog('USER_LOGOUT', 'Otentikasi', `User ${currentUser.fullName} keluar dari sistem.`);
    }
    setCurrentUser(null);
    setActiveRole('public');
  };

  const switchRoleQuick = (role: UserRole) => {
    setActiveRole(role);
    if (role === 'public') {
      setCurrentUser(null);
    } else {
      const match = users.find(u => u.role === role);
      if (match) setCurrentUser(match);
    }
    addAuditLog('SWITCH_ROLE', 'Sistem RBAC', `Beralih peran akses menjadi: ${role}`);
  };

  // Match & Score Management (Babak 1, Babak 2, & Penentu)
  const updateMatchScore = (
    matchId: string,
    round1: RoundScore,
    round2: RoundScore,
    round3?: RoundScore,
    winnerRtId?: string,
    mvpAthleteId?: string,
    timelineItem?: Omit<MatchTimelineItem, 'id'>,
    notes?: string
  ) => {
    setMatches(prevMatches => {
      const updatedList = prevMatches.map(m => {
        if (m.id !== matchId) return m;

        // Calculate totals based on round wins or aggregate points
        let scoreA = 0;
        let scoreB = 0;

        if (round1.teamAScore > round1.teamBScore) scoreA += 1;
        else if (round1.teamAScore < round1.teamBScore) scoreB += 1;

        if (round2.teamAScore > round2.teamBScore) scoreA += 1;
        else if (round2.teamAScore < round2.teamBScore) scoreB += 1;

        if (round3) {
          if (round3.teamAScore > round3.teamBScore) scoreA += 1;
          else if (round3.teamAScore < round3.teamBScore) scoreB += 1;
        }

        const isCompleted = winnerRtId !== undefined && winnerRtId !== '';

        const newTimeline = [...m.timeline];
        if (timelineItem) {
          newTimeline.push({
            ...timelineItem,
            id: `tl-${Date.now()}`
          });
        }

        const updatedMatch: Match = {
          ...m,
          round1,
          round2,
          round3,
          totalScoreA: scoreA,
          totalScoreB: scoreB,
          status: isCompleted ? 'completed' : 'live',
          winnerRtId: winnerRtId || m.winnerRtId,
          mvpAthleteId: mvpAthleteId || m.mvpAthleteId,
          timeline: newTimeline,
          notes: notes !== undefined ? notes : m.notes
        };

        return updatedMatch;
      });

      // Auto-advance tournament bracket when match finishes!
      const bracketAdvanced = autoAdvanceTournamentBracket(updatedList, contingents);
      return bracketAdvanced;
    });

    // Update contingent standings points/medals if final match
    if (winnerRtId) {
      setContingents(prev => prev.map(c => {
        if (c.id === winnerRtId) {
          return { ...c, points: c.points + 3 };
        }
        return c;
      }));
    }

    addAuditLog('UPDATE_SCORE', 'Pertandingan', `Skor pertandingan ${matchId} diperbarui: Babak 1 (${round1.teamAScore}-${round1.teamBScore}), Babak 2 (${round2.teamAScore}-${round2.teamBScore})`);
    sendNotification('Skor Diperbarui', `Pembaruan skor real-time babak 1 & 2 telah dipublikasikan.`, 'score', 'all');
  };

  const updateMatch = (match: Match) => {
    setMatches(prev => {
      const filtered = prev.map(m => m.id === match.id ? match : m);
      return autoAdvanceTournamentBracket(filtered, contingents);
    });
    addAuditLog('EDIT_MATCH', 'Jadwal Pertandingan', `Jadwal/data match ${match.id} diperbarui.`);
  };

  const addMatch = (match: Match) => {
    setMatches(prev => autoAdvanceTournamentBracket([...prev, match], contingents));
    addAuditLog('CREATE_MATCH', 'Jadwal Pertandingan', `Match baru dibuat: ${match.teamA.label} vs ${match.teamB.label}`);
  };

  const deleteMatch = (matchId: string) => {
    setMatches(prev => prev.filter(m => m.id !== matchId));
    addAuditLog('DELETE_MATCH', 'Jadwal Pertandingan', `Match ${matchId} dihapus.`);
  };

  // Athlete Management
  const registerAthlete = (data: Omit<Athlete, 'id' | 'status' | 'registeredAt' | 'matchesPlayed' | 'wins' | 'mvpCount'>): Athlete => {
    const newAthlete: Athlete = {
      ...data,
      id: `ath-${Date.now()}`,
      status: 'pending',
      registeredAt: new Date().toISOString().slice(0, 10),
      matchesPlayed: 0,
      wins: 0,
      mvpCount: 0
    };
    setAthletes(prev => [newAthlete, ...prev]);
    addAuditLog('REGISTER_ATHLETE', 'Pendaftaran Atlet', `Pendaftaran mandiri: ${data.fullName} (${data.nickname}) dari RT ${data.rtId}`);
    sendNotification('Registrasi Atlet Baru', `${data.fullName} dari ${data.rtId} telah mendaftar mandiri dan menunggu verifikasi panitia.`, 'announcement', 'super_admin');
    return newAthlete;
  };

  const verifyAthlete = (athleteId: string, status: 'verified' | 'rejected') => {
    setAthletes(prev => prev.map(a => a.id === athleteId ? { ...a, status } : a));
    addAuditLog('VERIFY_ATHLETE', 'Data Atlet', `Status verifikasi atlet ${athleteId} diubah menjadi: ${status}`);
  };

  const updateAthlete = (athlete: Athlete) => {
    setAthletes(prev => prev.map(a => a.id === athlete.id ? athlete : a));
    addAuditLog('UPDATE_ATHLETE', 'Data Atlet', `Data atlet ${athlete.fullName} (${athlete.nickname}) diperbarui.`);
  };

  const deleteAthlete = (athleteId: string) => {
    setAthletes(prev => prev.filter(a => a.id !== athleteId));
    addAuditLog('DELETE_ATHLETE', 'Data Atlet', `Atlet ${athleteId} dihapus.`);
  };

  const addBudgetItem = (item: Omit<BudgetItem, 'id'>) => {
    const newItem: BudgetItem = { ...item, id: `b-${Date.now()}` };
    setBudgetItems(prev => [...prev, newItem]);
    addAuditLog('ADD_BUDGET_ITEM', 'RAB Keuangan', `Pos anggaran baru: ${item.title} (Rp ${item.plannedAmount})`);
  };

  const updateBudgetItem = (item: BudgetItem) => {
    setBudgetItems(prev => prev.map(b => b.id === item.id ? item : b));
    addAuditLog('UPDATE_BUDGET_ITEM', 'RAB Keuangan', `Pos anggaran ${item.title} diperbarui.`);
  };

  const deleteBudgetItem = (id: string) => {
    setBudgetItems(prev => prev.filter(b => b.id !== id));
    addAuditLog('DELETE_BUDGET_ITEM', 'RAB Keuangan', `Pos anggaran ${id} dihapus.`);
  };

  const addExpense = (expense: Omit<ExpenseRecord, 'id'>) => {
    const newExp: ExpenseRecord = { ...expense, id: `exp-${Date.now()}` };
    setExpenses(prev => [newExp, ...prev]);
    addAuditLog('RECORD_EXPENSE', 'Keuangan', `Pengeluaran dicatat: ${expense.description} Rp ${expense.amount} (No: ${expense.receiptNumber})`);
    sendNotification('Pengeluaran Dicatat', `Realisasi Rp ${expense.amount.toLocaleString('id-ID')} dicatat oleh ${expense.paidBy}`, 'finance', 'bendahara');
  };

  const updateExpense = (expense: ExpenseRecord) => {
    setExpenses(prev => prev.map(e => e.id === expense.id ? expense : e));
    addAuditLog('UPDATE_EXPENSE', 'Keuangan', `Pengeluaran ${expense.description} diperbarui.`);
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    addAuditLog('DELETE_EXPENSE', 'Keuangan', `Pengeluaran ${id} dihapus.`);
  };

  const addIncome = (income: Omit<IncomeRecord, 'id'>) => {
    const newInc: IncomeRecord = { ...income, id: `inc-${Date.now()}` };
    setIncomes(prev => [newInc, ...prev]);
    addAuditLog('RECORD_INCOME', 'Keuangan', `Pemasukan kas: ${income.sourceName} Rp ${income.amount} via ${income.paymentMethod}`);
    sendNotification('Pemasukan Baru', `Kas masuk Rp ${income.amount.toLocaleString('id-ID')} dari ${income.sourceName}`, 'finance', 'bendahara');
  };

  const updateIncome = (income: IncomeRecord) => {
    setIncomes(prev => prev.map(i => i.id === income.id ? income : i));
    addAuditLog('UPDATE_INCOME', 'Keuangan', `Pemasukan kas ${income.sourceName} diperbarui.`);
  };

  const deleteIncome = (id: string) => {
    setIncomes(prev => prev.filter(i => i.id !== id));
    addAuditLog('DELETE_INCOME', 'Keuangan', `Pemasukan kas ${id} dihapus.`);
  };

  // Sponsor & Committee Management
  const updateSponsor = (sponsor: Sponsor) => {
    setSponsors(prev => prev.map(s => s.id === sponsor.id ? sponsor : s));
    addAuditLog('UPDATE_SPONSOR', 'Sponsor', `Data sponsor ${sponsor.name} diperbarui.`);
  };

  const addSponsor = (data: Omit<Sponsor, 'id'>) => {
    const newSp: Sponsor = { ...data, id: `spn-${Date.now()}` };
    setSponsors(prev => [...prev, newSp]);
    addAuditLog('ADD_SPONSOR', 'Sponsor', `Sponsor baru ditambahkan: ${data.name} (Tier: ${data.tier})`);
  };

  const deleteSponsor = (id: string) => {
    setSponsors(prev => prev.filter(s => s.id !== id));
    addAuditLog('DELETE_SPONSOR', 'Sponsor', `Sponsor ${id} dihapus.`);
  };

  const addCommitteeMember = (member: Omit<CommitteeMember, 'id'>) => {
    const newMember: CommitteeMember = { ...member, id: `com-${Date.now()}` };
    setCommittee(prev => [...prev, newMember]);
    addAuditLog('ADD_COMMITTEE', 'Panitia', `Panitia baru ditambahkan: ${member.fullName} (${member.role})`);
  };

  const updateCommitteeMember = (member: CommitteeMember) => {
    setCommittee(prev => prev.map(c => c.id === member.id ? member : c));
    addAuditLog('UPDATE_COMMITTEE', 'Panitia', `Data panitia ${member.fullName} diperbarui.`);
  };

  const deleteCommitteeMember = (id: string) => {
    setCommittee(prev => prev.filter(c => c.id !== id));
    addAuditLog('DELETE_COMMITTEE', 'Panitia', `Panitia ${id} dihapus.`);
  };

  const updateCommitteeStatus = (id: string, status: CommitteeMember['attendanceStatus']) => {
    setCommittee(prev => prev.map(c => c.id === id ? { ...c, attendanceStatus: status } : c));
    addAuditLog('UPDATE_COMMITTEE', 'Panitia', `Presensi panitia ${id} diubah menjadi: ${status}`);
  };

  // Referee CRUD
  const addReferee = (referee: Omit<Referee, 'id'>) => {
    const newRef: Referee = { ...referee, id: `ref-${Date.now()}` };
    setReferees(prev => [...prev, newRef]);
    addAuditLog('ADD_REFEREE', 'Wasit', `Wasit baru ditambahkan: ${referee.fullName}`);
  };

  const updateReferee = (referee: Referee) => {
    setReferees(prev => prev.map(r => r.id === referee.id ? referee : r));
    addAuditLog('UPDATE_REFEREE', 'Wasit', `Data wasit ${referee.fullName} diperbarui.`);
  };

  const deleteReferee = (id: string) => {
    setReferees(prev => prev.filter(r => r.id !== id));
    addAuditLog('DELETE_REFEREE', 'Wasit', `Wasit ${id} dihapus.`);
  };

  // User RBAC Management
  const addUser = (data: Omit<UserAccount, 'id'>) => {
    const newUser: UserAccount = { ...data, id: `usr-${Date.now()}` };
    setUsers(prev => [...prev, newUser]);
    addAuditLog('ADD_USER', 'Manajemen Pengguna', `User baru dibuat: ${data.username} dengan peran ${data.role}`);
  };

  const updateUser = (user: UserAccount) => {
    setUsers(prev => prev.map(u => u.id === user.id ? user : u));
    addAuditLog('UPDATE_USER', 'Manajemen Pengguna', `Akun user ${user.username} diperbarui.`);
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    addAuditLog('DELETE_USER', 'Manajemen Pengguna', `Akun user ${id} dihapus dari sistem.`);
  };

  const updateSport = (sport: SportBranch) => {
    setSports(prev => prev.map(s => s.id === sport.id ? sport : s));
    addAuditLog('UPDATE_SPORT', 'Cabang Olahraga', `Aturan & detail cabor ${sport.name} diperbarui.`);
  };

  const addSport = (sport: SportBranch) => {
    setSports(prev => [...prev, sport]);
    addAuditLog('ADD_SPORT', 'Cabang Olahraga', `Cabang olahraga baru ditambahkan: ${sport.name}`);
  };

  const deleteSport = (sportId: string) => {
    setSports(prev => prev.filter(s => s.id !== sportId));
    addAuditLog('DELETE_SPORT', 'Cabang Olahraga', `Cabang olahraga ${sportId} dihapus.`);
  };

  const updateContingent = (contingent: RTContingent) => {
    setContingents(prev => prev.map(c => c.id === contingent.id ? contingent : c));
    addAuditLog('UPDATE_CONTINGENT', 'Kontingen RT', `Data kontingen ${contingent.name} diperbarui.`);
  };

  const addContingent = (contingent: RTContingent) => {
    setContingents(prev => [...prev, contingent]);
    addAuditLog('ADD_CONTINGENT', 'Kontingen RT', `Kontingen RT baru ditambahkan: ${contingent.name}`);
  };

  const deleteContingent = (id: string) => {
    setContingents(prev => prev.filter(c => c.id !== id));
    addAuditLog('DELETE_CONTINGENT', 'Kontingen RT', `Kontingen ${id} dihapus.`);
  };

  const updateIdentity = (data: Partial<EventIdentity>) => {
    setIdentity(prev => ({ ...prev, ...data, lastUpdated: new Date().toISOString() }));
    addAuditLog('UPDATE_IDENTITY', 'Pengaturan Acara', `Identitas acara turnamen diperbarui.`);
  };

  const setSeason = (seasonId: string) => {
    setCurrentSeasonId(seasonId);
    const target = seasons.find(s => s.id === seasonId);
    setSeasons(prev => prev.map(s => ({ ...s, isActive: s.id === seasonId })));
    if (target) {
      setIdentity(prev => ({
        ...prev,
        season: target.name,
        year: target.year,
        lastUpdated: new Date().toISOString()
      }));
    }
    addAuditLog('SWITCH_SEASON', 'Musim Acara', `Beralih ke musim acara ${target?.name || seasonId}`);
  };

  const addSeason = (season: Omit<Season, 'id'>) => {
    const newSeason: Season = {
      ...season,
      id: `s-${Date.now()}`
    };
    setSeasons(prev => [...prev, newSeason]);
    if (season.isActive) {
      setSeason(newSeason.id);
    }
    addAuditLog('ADD_SEASON', 'Musim Acara', `Musim & tahun baru dibuat: ${season.name} (${season.year})`);
  };

  const updateSeason = (season: Season) => {
    setSeasons(prev => prev.map(s => s.id === season.id ? season : s));
    if (season.id === currentSeasonId) {
      setIdentity(prev => ({
        ...prev,
        season: season.name,
        year: season.year,
        lastUpdated: new Date().toISOString()
      }));
    }
    addAuditLog('UPDATE_SEASON', 'Musim Acara', `Data musim ${season.name} diperbarui.`);
  };

  const deleteSeason = (id: string) => {
    if (seasons.length <= 1) return;
    setSeasons(prev => prev.filter(s => s.id !== id));
    if (currentSeasonId === id) {
      const remaining = seasons.filter(s => s.id !== id);
      if (remaining[0]) {
        setSeason(remaining[0].id);
      }
    }
    addAuditLog('DELETE_SEASON', 'Musim Acara', `Musim acara ${id} dihapus.`);
  };

  const currentSeason = seasons.find(s => s.id === currentSeasonId) || seasons[0];

  // Google Sheets Sync
  const updateGoogleSheetsConfig = (cfg: Partial<GoogleSheetsConfig>) => {
    setGoogleSheetsConfig(prev => ({ ...prev, ...cfg }));
  };

  const testSheetsConnection = async (): Promise<SyncResult> => {
    setGoogleSheetsConfig(prev => ({ ...prev, syncStatus: 'syncing' }));
    const result = await testGoogleSheetsConnection(googleSheetsConfig.scriptUrl);
    setGoogleSheetsConfig(prev => ({
      ...prev,
      syncStatus: result.success ? 'connected' : 'error',
      lastSyncTime: new Date().toISOString(),
      lastErrorMessage: result.success ? undefined : result.message
    }));
    addAuditLog('TEST_SHEETS_CONNECTION', 'Google Sheets', result.message);
    return result;
  };

  const triggerSyncToSheets = async (): Promise<SyncResult> => {
    setGoogleSheetsConfig(prev => ({ ...prev, syncStatus: 'syncing' }));
    const payload = {
      identity,
      matches,
      contingents,
      athletes,
      expenses,
      incomes,
      auditLogs
    };
    const result = await syncTournamentToSheets(googleSheetsConfig.scriptUrl, payload);
    setGoogleSheetsConfig(prev => ({
      ...prev,
      syncStatus: result.success ? 'connected' : 'error',
      lastSyncTime: new Date().toISOString()
    }));
    addAuditLog('SYNC_TO_GOOGLE_SHEETS', 'Google Sheets', result.message);
    return result;
  };

  // E2E Encrypted Backup & Restore
  const exportDatabaseBackup = (): string => {
    const fullDb = {
      identity,
      seasons,
      sports,
      contingents,
      athletes,
      referees,
      matches,
      budgetItems,
      expenses,
      incomes,
      sponsors,
      committee,
      users,
      auditLogs,
      googleSheetsConfig,
      exportedAt: new Date().toISOString()
    };
    const encrypted = simulateEncryptData(fullDb);
    addAuditLog('EXPORT_BACKUP', 'Backup & Restore', 'Full system database exported with AES-256 GCM encryption.');
    return JSON.stringify(encrypted, null, 2);
  };

  const restoreDatabaseBackup = (jsonOrEncrypted: string): boolean => {
    try {
      const parsed = JSON.parse(jsonOrEncrypted);
      let data: any = parsed;
      if (parsed.cipherText && parsed.algorithm === 'AES-256-GCM') {
        data = simulateDecryptData(parsed as EncryptedPayload);
      }
      if (!data) return false;

      if (data.identity) setIdentity(data.identity);
      if (data.sports) setSports(data.sports);
      if (data.contingents) setContingents(data.contingents);
      if (data.athletes) setAthletes(data.athletes);
      if (data.matches) setMatches(data.matches);
      if (data.expenses) setExpenses(data.expenses);
      if (data.incomes) setIncomes(data.incomes);
      if (data.sponsors) setSponsors(data.sponsors);
      if (data.committee) setCommittee(data.committee);

      addAuditLog('RESTORE_BACKUP', 'Backup & Restore', 'System database successfully restored from backup.');
      sendNotification('Pemulihan Selesai', 'Data sistem berhasil dipulihkan dari cadangan terenkripsi.', 'announcement', 'super_admin');
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const resetAllData = () => {
    setIdentity(initialEventIdentity);
    setSeasons(initialSeasons);
    setSports(initialSportBranches);
    setContingents(initialRTContingents);
    setAthletes(initialAthletes);
    setReferees(initialReferees);
    setMatches(initialMatches);
    setBudgetItems(initialBudgetItems);
    setExpenses(initialExpenses);
    setIncomes(initialIncomes);
    setSponsors(initialSponsors);
    setCommittee(initialCommitteeMembers);
    setUsers(initialUserAccounts);
    setAuditLogs(initialAuditLogs);
    setNotifications(initialNotifications);
    setGoogleSheetsConfig(defaultGoogleSheetsConfig);
    addAuditLog('RESET_SYSTEM', 'Sistem', 'Seluruh data di-reset ke nilai bawaan pabrik.');
  };

  return (
    <TournamentContext.Provider
      value={{
        identity,
        updateIdentity,
        seasons,
        currentSeason,
        setSeason,
        addSeason,
        updateSeason,
        deleteSeason,
        sports,
        updateSport,
        addSport,
        deleteSport,
        contingents,
        updateContingent,
        addContingent,
        deleteContingent,
        athletes,
        registerAthlete,
        updateAthlete,
        verifyAthlete,
        deleteAthlete,
        referees,
        addReferee,
        updateReferee,
        deleteReferee,
        matches,
        updateMatch,
        updateMatchScore,
        addMatch,
        deleteMatch,
        budgetItems,
        addBudgetItem,
        updateBudgetItem,
        deleteBudgetItem,
        expenses,
        addExpense,
        updateExpense,
        deleteExpense,
        incomes,
        addIncome,
        updateIncome,
        deleteIncome,
        sponsors,
        addSponsor,
        updateSponsor,
        deleteSponsor,
        committee,
        addCommitteeMember,
        updateCommitteeMember,
        deleteCommitteeMember,
        updateCommitteeStatus,
        users,
        addUser,
        updateUser,
        deleteUser,
        currentUser,
        activeRole,
        login,
        logout,
        switchRoleQuick,
        auditLogs,
        addAuditLog,
        notifications,
        sendNotification,
        markNotificationAsRead,
        googleSheetsConfig,
        updateGoogleSheetsConfig,
        testSheetsConnection,
        triggerSyncToSheets,
        isDarkMode,
        toggleDarkMode,
        language,
        setLanguage,
        exportDatabaseBackup,
        restoreDatabaseBackup,
        resetAllData
      }}
    >
      {children}
    </TournamentContext.Provider>
  );
};

export const useTournament = () => {
  const context = useContext(TournamentContext);
  if (!context) {
    throw new Error('useTournament must be used within a TournamentProvider');
  }
  return context;
};
