export type SportCategory = 'esports' | 'sport';
export type MatchFormat = 'BO1' | 'BO3' | 'BO5';
export type MatchStatus = 'scheduled' | 'live' | 'completed' | 'postponed';
export type StageType = 'round_of_16' | 'quarter_final' | 'semi_final' | 'third_place' | 'final';
export type UserRole = 'super_admin' | 'ketua_panitia' | 'wasit' | 'bendahara' | 'pengurus_rt' | 'public';
export type AthleteVerificationStatus = 'verified' | 'pending' | 'rejected';
export type AthleteRole = 'Captain' | 'Member' | 'Substitute';

export interface EventIdentity {
  name: string;
  season: string;
  year: number;
  slogan: string;
  logoUrl: string;
  siteIconUrl: string;
  bannerUrl?: string;
  trophyImageUrl?: string;
  organizer: string;
  location: string;
  contactWa: string;
  contactEmail: string;
  primaryColor: string;
  lastUpdated: string;
}

export interface SportBranch {
  id: string;
  name: string;
  category: SportCategory;
  iconName: string;
  color: string;
  imageUrl?: string;
  format: MatchFormat;
  roundLabels: {
    round1: string;
    round2: string;
    round3: string;
  };
  scoreType: 'points' | 'kills' | 'sets' | 'goals';
  rulesSummary: string;
  rulesDetail: string[];
  maxTeamMembers: number;
  minAge: number;
  maxAge: number;
  venue: string;
}

export interface RTContingent {
  id: string;
  code: string; // e.g. "RT 01"
  name: string; // e.g. "RT 01 - Garuda Perkasa"
  mascotName: string;
  color: string;
  iconName: string;
  logoUrl?: string;
  ketuaRT: string;
  phone: string;
  email: string;
  address: string;
  gold: number;
  silver: number;
  bronze: number;
  points: number;
}

export interface Athlete {
  id: string;
  fullName: string;
  rtId: string;
  sportId: string;
  nickname: string;
  inGameId: string;
  phone: string;
  email: string;
  nikMasked: string;
  birthDate: string;
  status: AthleteVerificationStatus;
  role: AthleteRole;
  matchesPlayed: number;
  wins: number;
  mvpCount: number;
  avatarUrl: string;
  registeredAt: string;
}

export interface Referee {
  id: string;
  fullName: string;
  sportIds: string[];
  license: string;
  avatarUrl?: string;
  phone: string;
  email: string;
  assignedCount: number;
  rating: number;
}

export interface RoundScore {
  teamAScore: number;
  teamBScore: number;
  notes?: string;
}

export interface MatchTimelineItem {
  id: string;
  time: string; // e.g. "12'" or "Game 1 08:30"
  roundNumber: 1 | 2 | 3;
  text: string;
  team: 'A' | 'B' | 'neutral';
  type: 'score' | 'kill' | 'tower' | 'penalty' | 'mvp' | 'pause';
}

export interface Match {
  id: string;
  sportId: string;
  stage: StageType;
  bracketIndex: number; // 0 to N for positioning in tournament tree
  scheduledTime: string;
  venue: string;
  refereeId: string;
  teamA: {
    rtId: string;
    label: string;
    roster?: string[];
  };
  teamB: {
    rtId: string;
    label: string;
    roster?: string[];
  };
  status: MatchStatus;
  currentRound: 1 | 2 | 3;
  // Babak pertama dan babak kedua
  round1: RoundScore;
  round2: RoundScore;
  round3?: RoundScore;
  totalScoreA: number;
  totalScoreB: number;
  winnerRtId?: string;
  mvpAthleteId?: string;
  timeline: MatchTimelineItem[];
  streamUrl?: string;
  notes?: string;
}

export interface BudgetItem {
  id: string;
  category: 'venue' | 'equipment' | 'prizes' | 'consumption' | 'it_streaming' | 'honor' | 'misc';
  title: string;
  plannedAmount: number;
  priority: 'high' | 'medium' | 'low';
}

export interface ExpenseRecord {
  id: string;
  budgetItemId?: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  receiptNumber: string;
  paidBy: string;
  verifiedBy: string;
}

export interface IncomeRecord {
  id: string;
  source: 'iuran_rt' | 'sponsor' | 'registrasi' | 'donatur' | 'merchandise';
  sourceName: string;
  rtId?: string;
  amount: number;
  date: string;
  paymentMethod: 'qris' | 'transfer' | 'cash';
  status: 'paid' | 'pending';
  receiptNumber: string;
}

export interface Sponsor {
  id: string;
  name: string;
  tier: 'Platinum' | 'Gold' | 'Silver' | 'Media Partner';
  amount: number;
  logoUrl: string;
  status: 'confirmed' | 'pending' | 'in_discussion';
  contactPerson: string;
  phone: string;
  benefits: string[];
}

export interface CommitteeMember {
  id: string;
  fullName: string;
  role: string;
  division: 'BPH' | 'Acara' | 'Pertandingan' | 'Humas' | 'Perlengkapan' | 'Konsumsi' | 'Dokumentasi' | 'Keamanan';
  rtOrigin: string;
  phone: string;
  attendanceStatus: 'present' | 'duty' | 'absent';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userName: string;
  userRole: string;
  action: string;
  module: string;
  details: string;
  ipAddress: string;
}

export interface UserAccount {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
  rtId?: string;
  email: string;
  passwordHash: string; // hashed/salted representation
  avatarUrl?: string;
  status: 'active' | 'inactive';
}

export interface Season {
  id: string;
  year: number;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface GoogleSheetsConfig {
  scriptUrl: string;
  sheetId: string;
  autoSync: boolean;
  syncIntervalMinutes: number;
  lastSyncTime?: string;
  syncStatus: 'idle' | 'syncing' | 'connected' | 'error';
  lastErrorMessage?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'match_update' | 'score' | 'schedule' | 'announcement' | 'finance';
  timestamp: string;
  targetRole?: UserRole | 'all';
  isRead?: boolean;
}
