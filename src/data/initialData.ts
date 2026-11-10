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
  GoogleSheetsConfig
} from '../types';

export const initialEventIdentity: EventIdentity = {
  name: "Piala Kemerdekaan Antar RT 2026",
  season: "Musim IV - 2026",
  year: 2026,
  slogan: "Semangat Guyub Rukun & Sportivitas Digital Generasi Warga RW 08",
  logoUrl: "/src/assets/images/trophy_gold_cup_1794294149443.jpg",
  siteIconUrl: "/src/assets/images/trophy_gold_cup_1794294149443.jpg",
  bannerUrl: "/src/assets/images/hero_esports_championship_1794294147972.jpg",
  trophyImageUrl: "/src/assets/images/trophy_gold_cup_1794294149443.jpg",
  organizer: "Karang Taruna & Forum Pengurus RT RW 08",
  location: "Balai Warga RW 08 & Esports Arena RT 03",
  contactWa: "+62 812-3456-7890",
  contactEmail: "panitia.turnamen.rt@gmail.com",
  primaryColor: "#6366f1",
  lastUpdated: new Date().toISOString()
};

export const initialSeasons: Season[] = [
  { id: "s-2026", year: 2026, name: "Piala Kemerdekaan Antar RT 2026 (Musim IV)", startDate: "2026-08-01", endDate: "2026-08-25", isActive: true },
  { id: "s-2025", year: 2025, name: "Liga Guyub Rukun Antar RT 2025 (Musim III)", startDate: "2025-08-05", endDate: "2025-08-22", isActive: false },
  { id: "s-2024", year: 2024, name: "Piala Pemuda Digital RT 2024 (Musim II)", startDate: "2024-08-10", endDate: "2024-08-20", isActive: false }
];

export const initialSportBranches: SportBranch[] = [
  {
    id: "sp-mlbb",
    name: "Mobile Legends: Bang Bang",
    category: "esports",
    iconName: "Gamepad2",
    color: "#8b5cf6", // Purple
    imageUrl: "/src/assets/images/cabor_esports_gaming_1794294148716.jpg",
    format: "BO3",
    roundLabels: {
      round1: "Game 1 (Fase Awal)",
      round2: "Game 2 (Fase Balasan)",
      round3: "Game 3 (Penentuan / Decider)"
    },
    scoreType: "kills",
    rulesSummary: "Tim 5v5 + 1 Cadangan. Sistem Draft Pick 5 Ban. Turnamen resmi MLBB mode Custom Tournament.",
    rulesDetail: [
      "Wajib berdomisili atau memiliki KTP/KK di lingkungan RT masing-masing.",
      "Perangkat smartphone pribadi (dilarang menggunakan emulator PC / tablet di atas 8.5 inci).",
      "Format penyisihan hingga semifinal Best of 3 (BO3). Babak Final Best of 5 (BO5).",
      "Skor babak 1 dan 2 dicatat berdasarkan perolehan Kills, Tower Destruction, serta status Lord.",
      "Toleransi keterlambatan tim maksimal 10 menit di lobby, melewati batas dianggap WO."
    ],
    maxTeamMembers: 6,
    minAge: 13,
    maxAge: 35,
    venue: "Main Stage Balai Warga & Discord Stream RW 08"
  },
  {
    id: "sp-freefire",
    name: "Free Fire (Clash Squad & BR)",
    category: "esports",
    iconName: "Flame",
    color: "#f97316", // Orange
    format: "BO3",
    roundLabels: {
      round1: "Ronde 1 (Bermuda)",
      round2: "Ronde 2 (Purgatory)",
      round3: "Ronde 3 (Kalahari / Decider)"
    },
    scoreType: "points",
    rulesSummary: "Squad 4 Pemain. Mode Clash Squad Tournament tanpa item drop pay-to-win.",
    rulesDetail: [
      "Semua skin senjata dimatikan (Gun Attributes OFF) demi keadilan kompetisi.",
      "Skor babak 1 dan 2 mencatat jumlah ronde menang & kill tim.",
      "Dilarang menggunakan aplikasi pihak ketiga, script, config, atau cheat dalam bentuk apapun."
    ],
    maxTeamMembers: 5,
    minAge: 12,
    maxAge: 30,
    venue: "Ruang Serbaguna RT 05"
  },
  {
    id: "sp-efootball",
    name: "eFootball 2026 (PS5 / Mobile)",
    category: "esports",
    iconName: "Trophy",
    color: "#06b6d4", // Cyan
    format: "BO3",
    roundLabels: {
      round1: "Babak Pertama (45' Menit I)",
      round2: "Babak Kedua (45' Menit II)",
      round3: "Extra Time & Adu Penalti"
    },
    scoreType: "goals",
    rulesSummary: "Format 1v1 / 2v2 Co-op. Waktu pertandingan 10 menit. Kondisi stamina Normal.",
    rulesDetail: [
      "Durasi per babak 5 menit waktu nyata (total 10 menit per match).",
      "Skor babak pertama (Half-Time) dan babak kedua (Full-Time) dicatat terpisah oleh wasit.",
      "Jika agregat imbang hingga babak kedua, dilanjutkan Golden Goal atau Adu Penalti."
    ],
    maxTeamMembers: 2,
    minAge: 12,
    maxAge: 45,
    venue: "Gaming Lounge Balai RW 08"
  },
  {
    id: "sp-pubg",
    name: "PUBG Mobile",
    category: "esports",
    iconName: "Crosshair",
    color: "#eab308", // Amber
    format: "BO3",
    roundLabels: {
      round1: "Match 1 (Erangel)",
      round2: "Match 2 (Miramar)",
      round3: "Match 3 (Sanhok)"
    },
    scoreType: "points",
    rulesSummary: "Squad 4 Pemain. Sistem poin resmi PMSL (Peringkat Placement + 1 Poin per Eliminasi).",
    rulesDetail: [
      "Perhitungan: Peringkat 1 (10 poin), Peringkat 2 (6 poin), Peringkat 3 (5 poin), dst.",
      "Setiap babak wajib menyetor screenshot hasil akhir pertandingan ke meja wasit.",
      "Koneksi internet hotspot cadangan disediakan oleh panitia pelaksana."
    ],
    maxTeamMembers: 5,
    minAge: 14,
    maxAge: 35,
    venue: "Panggung Terbuka RT 02"
  },
  {
    id: "sp-badminton",
    name: "Bulu Tangkis Ganda Putra",
    category: "sport",
    iconName: "Wind",
    color: "#10b981", // Emerald
    imageUrl: "/src/assets/images/cabor_badminton_sports_1794294148699.jpg",
    format: "BO3",
    roundLabels: {
      round1: "Set Pertama (Game 1 - 21 Pts)",
      round2: "Set Kedua (Game 2 - 21 Pts)",
      round3: "Set Ketiga (Rubber Game - 21 Pts)"
    },
    scoreType: "sets",
    rulesSummary: "Sistem Rally Point 21 poin, deuce maksimal 30 poin. Shuttlecock standar PBSI.",
    rulesDetail: [
      "Pemain wajib mengenakan kaos kontingen RT dan sepatu olahraga berbulu/court.",
      "Skor set pertama dan set kedua wajib diinput langsung oleh wasit meja.",
      "Jeda antar set selama 2 menit."
    ],
    maxTeamMembers: 2,
    minAge: 17,
    maxAge: 55,
    venue: "Lapangan Bulutangkis RW 08"
  },
  {
    id: "sp-tenismeja",
    name: "Tenis Meja Tunggal Warga",
    category: "sport",
    iconName: "CircleDot",
    color: "#ec4899", // Pink
    format: "BO3",
    roundLabels: {
      round1: "Game Pertama (11 Poin)",
      round2: "Game Kedua (11 Poin)",
      round3: "Game Penentu (11 Poin)"
    },
    scoreType: "points",
    rulesSummary: "Sistem Best of 3 Game sampai 11 poin. Servis bergantian tiap 2 poin.",
    rulesDetail: [
      "Bet standar dengan karet berlapis merah dan hitam.",
      "Wasit memantau skor poin demi poin di babak pertama dan kedua.",
      "Pemain yang memenangkan 2 game otomatis dinyatakan lolos ke babak selanjutnya."
    ],
    maxTeamMembers: 1,
    minAge: 15,
    maxAge: 60,
    venue: "Pos Kamling Induk RT 06"
  },
  {
    id: "sp-catur",
    name: "Catur Cepat Kilat (Rapid 15')",
    category: "sport",
    iconName: "Shield",
    color: "#64748b", // Slate
    format: "BO1",
    roundLabels: {
      round1: "Babak Putih (15 Menit + 10s)",
      round2: "Babak Hitam (15 Menit + 10s)",
      round3: "Armageddon (Bila Remis)"
    },
    scoreType: "points",
    rulesSummary: "Sistem waktu 15 menit increment 10 detik. Standar aturan FIDE & Percasi.",
    rulesDetail: [
      "Menggunakan jam catur digital resmi panitia.",
      "Sentuh-jalan (Touch-move) berlaku mutlak.",
      "Skor babak 1 dan 2 dicatat: Menang (1), Remis (0.5), Kalah (0)."
    ],
    maxTeamMembers: 1,
    minAge: 12,
    maxAge: 70,
    venue: "Pendopo Rukun Warga"
  }
];

export const initialRTContingents: RTContingent[] = [
  {
    id: "rt-01",
    code: "RT 01",
    name: "RT 01 - Garuda Perkasa",
    mascotName: "Garuda Emas",
    color: "#ef4444", // Red
    iconName: "Zap",
    ketuaRT: "Bpk. H. Bambang Sudiro",
    phone: "0812-1111-0101",
    email: "rt01.cempaka@gmail.com",
    address: "Jl. Cempaka Raya Blok A",
    gold: 2,
    silver: 1,
    bronze: 0,
    points: 13
  },
  {
    id: "rt-02",
    code: "RT 02",
    name: "RT 02 - Rajawali Biru",
    mascotName: "Rajawali Biru",
    color: "#3b82f6", // Blue
    iconName: "Feather",
    ketuaRT: "Bpk. Ir. Joko Prasetyo",
    phone: "0812-2222-0202",
    email: "rt02.rajawali@gmail.com",
    address: "Jl. Cempaka Raya Blok B",
    gold: 1,
    silver: 2,
    bronze: 1,
    points: 12
  },
  {
    id: "rt-03",
    code: "RT 03",
    name: "RT 03 - Singa Cyber",
    mascotName: "Cyber Lion",
    color: "#8b5cf6", // Purple
    iconName: "Cpu",
    ketuaRT: "Bpk. Dedi Kurniawan, S.Kom",
    phone: "0812-3333-0303",
    email: "rt03.cyber@gmail.com",
    address: "Jl. Anggrek Utama No. 12",
    gold: 3,
    silver: 0,
    bronze: 1,
    points: 16
  },
  {
    id: "rt-04",
    code: "RT 04",
    name: "RT 04 - Elang Hijau",
    mascotName: "Elang Hijau",
    color: "#10b981", // Emerald
    iconName: "ShieldCheck",
    ketuaRT: "Bpk. Drs. Slamet Riyadi",
    phone: "0812-4444-0404",
    email: "rt04.elang@gmail.com",
    address: "Jl. Kenanga Indah No. 44",
    gold: 1,
    silver: 1,
    bronze: 2,
    points: 10
  },
  {
    id: "rt-05",
    code: "RT 05",
    name: "RT 05 - Banteng Juara",
    mascotName: "Banteng Merah",
    color: "#f43f5e", // Rose
    iconName: "Target",
    ketuaRT: "Bpk. Mulyadi Saputra",
    phone: "0812-5555-0505",
    email: "rt05.banteng@gmail.com",
    address: "Jl. Melati Blok C",
    gold: 0,
    silver: 2,
    bronze: 1,
    points: 7
  },
  {
    id: "rt-06",
    code: "RT 06",
    name: "RT 06 - Macan Kuning",
    mascotName: "Macan Emas",
    color: "#eab308", // Yellow
    iconName: "Flame",
    ketuaRT: "Bpk. Hendra Gunawan",
    phone: "0812-6666-0606",
    email: "rt06.macan@gmail.com",
    address: "Jl. Mawar No. 06",
    gold: 1,
    silver: 0,
    bronze: 2,
    points: 7
  },
  {
    id: "rt-07",
    code: "RT 07",
    name: "RT 07 - Ksatria Samudra",
    mascotName: "Hiu Samudra",
    color: "#06b6d4", // Cyan
    iconName: "Anchor",
    ketuaRT: "Bpk. Rahmat Hidayat",
    phone: "0812-7777-0707",
    email: "rt07.samudra@gmail.com",
    address: "Jl. Dahlia Gang 7",
    gold: 0,
    silver: 1,
    bronze: 1,
    points: 4
  },
  {
    id: "rt-08",
    code: "RT 08",
    name: "RT 08 - Badak Perkasa",
    mascotName: "Badak Perkasa",
    color: "#64748b", // Slate
    iconName: "Compass",
    ketuaRT: "Bpk. Agus Santoso, M.M",
    phone: "0812-8888-0808",
    email: "rt08.badak@gmail.com",
    address: "Jl. Teratai Raya Blok F",
    gold: 0,
    silver: 1,
    bronze: 0,
    points: 3
  }
];

export const initialAthletes: Athlete[] = [
  {
    id: "ath-01",
    fullName: "Rizky 'SkyWalker' Pratama",
    rtId: "rt-03",
    sportId: "sp-mlbb",
    nickname: "SkyWalker",
    inGameId: "48291039 (2910)",
    phone: "0813-9876-1234",
    email: "rizky.pratama@gmail.com",
    nikMasked: "327501******0001",
    birthDate: "2003-05-14",
    status: "verified",
    role: "Captain",
    matchesPlayed: 4,
    wins: 4,
    mvpCount: 3,
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
    registeredAt: "2026-07-28"
  },
  {
    id: "ath-02",
    fullName: "Dimas 'Valkyrie' Nugroho",
    rtId: "rt-03",
    sportId: "sp-mlbb",
    nickname: "Valkyrie",
    inGameId: "81920391 (4810)",
    phone: "0813-1122-3344",
    email: "dimas.nugroho@gmail.com",
    nikMasked: "327501******0002",
    birthDate: "2004-11-20",
    status: "verified",
    role: "Member",
    matchesPlayed: 4,
    wins: 4,
    mvpCount: 1,
    avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80",
    registeredAt: "2026-07-28"
  },
  {
    id: "ath-03",
    fullName: "Fajar 'Shadow' Ramadhan",
    rtId: "rt-01",
    sportId: "sp-mlbb",
    nickname: "ShadowKill",
    inGameId: "77219032 (9120)",
    phone: "0813-5566-7788",
    email: "fajar.ramadhan@gmail.com",
    nikMasked: "327501******0003",
    birthDate: "2002-09-08",
    status: "verified",
    role: "Captain",
    matchesPlayed: 3,
    wins: 2,
    mvpCount: 2,
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    registeredAt: "2026-07-29"
  },
  {
    id: "ath-04",
    fullName: "Budi 'ElMatador' Santoso",
    rtId: "rt-02",
    sportId: "sp-efootball",
    nickname: "ElMatador",
    inGameId: "KONAMI-ID-9921",
    phone: "0813-9900-1122",
    email: "budi.santoso@gmail.com",
    nikMasked: "327501******0004",
    birthDate: "1998-03-12",
    status: "verified",
    role: "Captain",
    matchesPlayed: 3,
    wins: 3,
    mvpCount: 2,
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    registeredAt: "2026-07-29"
  },
  {
    id: "ath-05",
    fullName: "Ahmad 'Headshot' Fauzi",
    rtId: "rt-04",
    sportId: "sp-freefire",
    nickname: "Fauzi_OneTap",
    inGameId: "FF-8829-1029",
    phone: "0813-4433-2211",
    email: "ahmad.fauzi@gmail.com",
    nikMasked: "327501******0005",
    birthDate: "2005-02-18",
    status: "verified",
    role: "Captain",
    matchesPlayed: 3,
    wins: 2,
    mvpCount: 1,
    avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80",
    registeredAt: "2026-07-30"
  },
  {
    id: "ath-06",
    fullName: "Tri Handoko & Wahyu Prasetyo",
    rtId: "rt-01",
    sportId: "sp-badminton",
    nickname: "Duo Kilat RT 01",
    inGameId: "PBSI-RW08-01",
    phone: "0812-7788-9900",
    email: "tri.handoko@gmail.com",
    nikMasked: "327501******0006",
    birthDate: "1995-07-04",
    status: "verified",
    role: "Captain",
    matchesPlayed: 3,
    wins: 3,
    mvpCount: 2,
    avatarUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&auto=format&fit=crop&q=80",
    registeredAt: "2026-07-30"
  },
  {
    id: "ath-07",
    fullName: "Gunawan Wijaya",
    rtId: "rt-06",
    sportId: "sp-tenismeja",
    nickname: "SpinMaster",
    inGameId: "PTMSI-RW-06",
    phone: "0812-3344-5566",
    email: "gunawan.wijaya@gmail.com",
    nikMasked: "327501******0007",
    birthDate: "1988-12-01",
    status: "verified",
    role: "Captain",
    matchesPlayed: 3,
    wins: 3,
    mvpCount: 2,
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
    registeredAt: "2026-07-31"
  },
  {
    id: "ath-08",
    fullName: "Bambang Sudarsono",
    rtId: "rt-04",
    sportId: "sp-catur",
    nickname: "Grandmaster RT",
    inGameId: "CHESSCOM-RW08-44",
    phone: "0812-5566-7788",
    email: "bambang.catur@gmail.com",
    nikMasked: "327501******0008",
    birthDate: "1975-04-19",
    status: "verified",
    role: "Captain",
    matchesPlayed: 2,
    wins: 2,
    mvpCount: 1,
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80",
    registeredAt: "2026-07-31"
  }
];

export const initialReferees: Referee[] = [
  {
    id: "ref-01",
    fullName: "Wasit Arya 'CasterX' Pratama",
    sportIds: ["sp-mlbb", "sp-freefire"],
    license: "Certified IESPA Referee Grade B",
    phone: "0811-1234-5678",
    email: "arya.referee@gmail.com",
    assignedCount: 8,
    rating: 4.9
  },
  {
    id: "ref-02",
    fullName: "Bpk. M. Syaifullah (Wasit PBSI)",
    sportIds: ["sp-badminton"],
    license: "Wasit Daerah PBSI Tingkat II",
    phone: "0811-2345-6789",
    email: "syaifullah.pbsi@gmail.com",
    assignedCount: 6,
    rating: 5.0
  },
  {
    id: "ref-03",
    fullName: "Bambang Setiawan, S.Pd",
    sportIds: ["sp-efootball", "sp-catur"],
    license: "Wasit Nasional Percasi & E-Sports",
    phone: "0811-3456-7890",
    email: "bambang.setiawan@gmail.com",
    assignedCount: 5,
    rating: 4.8
  },
  {
    id: "ref-04",
    fullName: "Suryono Hadi",
    sportIds: ["sp-tenismeja"],
    license: "Wasit PTMSI Tingkat Jawa Barat",
    phone: "0811-4567-8901",
    email: "suryono.tenismeja@gmail.com",
    assignedCount: 4,
    rating: 4.7
  }
];

export const initialMatches: Match[] = [
  // 1. MLBB Semifinal 1 (Finished)
  {
    id: "match-mlbb-sf1",
    sportId: "sp-mlbb",
    stage: "semi_final",
    bracketIndex: 0,
    scheduledTime: "2026-08-15 14:00",
    venue: "Main Stage Balai Warga",
    refereeId: "ref-01",
    teamA: { rtId: "rt-03", label: "RT 03 - Singa Cyber" },
    teamB: { rtId: "rt-01", label: "RT 01 - Garuda Perkasa" },
    status: "completed",
    currentRound: 2,
    round1: { teamAScore: 18, teamBScore: 12, notes: "Game 1: RT 03 mendominasi Lord menit ke-14." },
    round2: { teamAScore: 22, teamBScore: 15, notes: "Game 2: Comeback indah dari RT 03 setelah kontes Lord." },
    totalScoreA: 2,
    totalScoreB: 0,
    winnerRtId: "rt-03",
    mvpAthleteId: "ath-01",
    timeline: [
      { id: "t1", time: "04:12", roundNumber: 1, text: "First Blood diraih RT 03 (SkyWalker - Hayabusa)", team: "A", type: "kill" },
      { id: "t2", time: "11:30", roundNumber: 1, text: "RT 01 mencuri Turtle ketiga dan menumbangkan 2 pemain RT 03", team: "B", type: "kill" },
      { id: "t3", time: "14:45", roundNumber: 1, text: "Base RT 01 hancur bersamaan Lord menit ke-14. RT 03 amankan Game 1", team: "A", type: "score" },
      { id: "t4", time: "07:20", roundNumber: 2, text: "Perang sengit di area sungai, RT 03 unggul 4 kills", team: "A", type: "kill" },
      { id: "t5", time: "17:10", roundNumber: 2, text: "Wipe Out oleh RT 03, mengakhiri Game 2 dengan skor 22-15", team: "A", type: "score" }
    ],
    notes: "RT 03 berhak melaju ke Babak Grand Final MLBB!"
  },
  // 2. MLBB Semifinal 2 (Finished)
  {
    id: "match-mlbb-sf2",
    sportId: "sp-mlbb",
    stage: "semi_final",
    bracketIndex: 1,
    scheduledTime: "2026-08-15 16:00",
    venue: "Main Stage Balai Warga",
    refereeId: "ref-01",
    teamA: { rtId: "rt-02", label: "RT 02 - Rajawali Biru" },
    teamB: { rtId: "rt-04", label: "RT 04 - Elang Hijau" },
    status: "completed",
    currentRound: 3,
    round1: { teamAScore: 14, teamBScore: 20, notes: "Game 1 dimenangkan RT 04 dengan split push." },
    round2: { teamAScore: 21, teamBScore: 9, notes: "Game 2 RT 02 membalas telak skor 21-9." },
    round3: { teamAScore: 19, teamBScore: 17, notes: "Game 3 rubber game dramatis dimenangkan RT 02!" },
    totalScoreA: 2,
    totalScoreB: 1,
    winnerRtId: "rt-02",
    timeline: [
      { id: "t6", time: "Game 1", roundNumber: 1, text: "RT 04 memimpin setelah memenangkan perebutan Lord pertama", team: "B", type: "kill" },
      { id: "t7", time: "Game 2", roundNumber: 2, text: "RT 02 menyamakan kedudukan 1-1", team: "A", type: "score" },
      { id: "t8", time: "Game 3", roundNumber: 3, text: "RT 02 mengunci kemenangan Game 3 dan lolos ke Final", team: "A", type: "score" }
    ],
    notes: "RT 02 melaju ke Grand Final, RT 04 ke Bronze Match."
  },
  // 3. MLBB Perebutan Juara 3 & 4 (Bronze Match - Scheduled)
  {
    id: "match-mlbb-bronze",
    sportId: "sp-mlbb",
    stage: "third_place",
    bracketIndex: 0,
    scheduledTime: "2026-08-16 13:30",
    venue: "Main Stage Balai Warga",
    refereeId: "ref-01",
    teamA: { rtId: "rt-01", label: "RT 01 - Garuda Perkasa" },
    teamB: { rtId: "rt-04", label: "RT 04 - Elang Hijau" },
    status: "scheduled",
    currentRound: 1,
    round1: { teamAScore: 0, teamBScore: 0 },
    round2: { teamAScore: 0, teamBScore: 0 },
    totalScoreA: 0,
    totalScoreB: 0,
    timeline: [],
    notes: "Perebutan Medali Perunggu Cabor Mobile Legends."
  },
  // 4. MLBB Grand Final Juara 1 & 2 (LIVE MATCH!)
  {
    id: "match-mlbb-final",
    sportId: "sp-mlbb",
    stage: "final",
    bracketIndex: 0,
    scheduledTime: "2026-08-16 19:30",
    venue: "Main Stage Balai Warga & YouTube Live RW08",
    refereeId: "ref-01",
    teamA: { rtId: "rt-03", label: "RT 03 - Singa Cyber" },
    teamB: { rtId: "rt-02", label: "RT 02 - Rajawali Biru" },
    status: "live",
    currentRound: 2,
    round1: { teamAScore: 24, teamBScore: 16, notes: "Game 1 diamankan RT 03 (MVP: SkyWalker Ling 11/1/8)" },
    round2: { teamAScore: 12, teamBScore: 14, notes: "Game 2 sedang berlangsung sengit di menit ke-13!" },
    round3: { teamAScore: 0, teamBScore: 0 },
    totalScoreA: 1,
    totalScoreB: 0,
    streamUrl: "https://www.youtube.com/watch?v=live_stream_mock",
    timeline: [
      { id: "tf1", time: "03:15", roundNumber: 1, text: "First Blood oleh Ling (RT 03 SkyWalker)", team: "A", type: "kill" },
      { id: "tf2", time: "16:40", roundNumber: 1, text: "Lord Terakhir mengawal RT 03 mengamankan Game 1 (1-0)", team: "A", type: "score" },
      { id: "tf3", time: "05:10", roundNumber: 2, text: "RT 02 merebut turtle pertama dan unggul 3 kills", team: "B", type: "kill" },
      { id: "tf4", time: "11:20", roundNumber: 2, text: "Pertahanan menara dalam RT 03 masih berdiri kokoh", team: "A", type: "pause" }
    ],
    notes: "Grand Final Penentuan Medali Emas & Piala Bergilir RW 08!"
  },
  // 5. eFootball Final (Completed)
  {
    id: "match-efootball-final",
    sportId: "sp-efootball",
    stage: "final",
    bracketIndex: 0,
    scheduledTime: "2026-08-14 20:00",
    venue: "Gaming Lounge Balai RW 08",
    refereeId: "ref-03",
    teamA: { rtId: "rt-02", label: "RT 02 - Rajawali Biru" },
    teamB: { rtId: "rt-05", label: "RT 05 - Banteng Juara" },
    status: "completed",
    currentRound: 2,
    round1: { teamAScore: 2, teamBScore: 1, notes: "Babak Pertama: Gol cepat menit 12' & 38' oleh Budi Santoso" },
    round2: { teamAScore: 1, teamBScore: 1, notes: "Babak Kedua: Gol menit 82' memastikan gelar juara RT 02" },
    totalScoreA: 3,
    totalScoreB: 2,
    winnerRtId: "rt-02",
    mvpAthleteId: "ath-04",
    timeline: [
      { id: "te1", time: "12'", roundNumber: 1, text: "Gol! Striker RT 02 menusuk dari sayap kanan", team: "A", type: "score" },
      { id: "te2", time: "29'", roundNumber: 1, text: "Gol balasan RT 05 melalui sundulan pojok", team: "B", type: "score" },
      { id: "te3", time: "38'", roundNumber: 1, text: "Gol indah tendangan bebas Budi Santoso (RT 02)", team: "A", type: "score" },
      { id: "te4", time: "65'", roundNumber: 2, text: "Penalti sukses dieksekusi RT 05", team: "B", type: "score" },
      { id: "te5", time: "82'", roundNumber: 2, text: "Gol penentu kemenangan RT 02! Peluit panjang berbunyi", team: "A", type: "score" }
    ],
    notes: "RT 02 meraih medali Emas cabor eFootball 2026."
  },
  // 6. Badminton Final (Completed)
  {
    id: "match-badminton-final",
    sportId: "sp-badminton",
    stage: "final",
    bracketIndex: 0,
    scheduledTime: "2026-08-13 19:00",
    venue: "Lapangan Bulutangkis RW 08",
    refereeId: "ref-02",
    teamA: { rtId: "rt-01", label: "RT 01 - Garuda Perkasa" },
    teamB: { rtId: "rt-02", label: "RT 02 - Rajawali Biru" },
    status: "completed",
    currentRound: 2,
    round1: { teamAScore: 21, teamBScore: 18, notes: "Set 1 berlangsung ketat dengan rally panjang." },
    round2: { teamAScore: 21, teamBScore: 16, notes: "Set 2 smash menyilang Tri Handoko mengunci kemenangan." },
    totalScoreA: 2,
    totalScoreB: 0,
    winnerRtId: "rt-01",
    mvpAthleteId: "ath-06",
    timeline: [
      { id: "tb1", time: "Set 1 11-10", roundNumber: 1, text: "Interval set pertama dipimpin RT 01", team: "A", type: "score" },
      { id: "tb2", time: "Set 1 21-18", roundNumber: 1, text: "Set point diamankan RT 01", team: "A", type: "score" },
      { id: "tb3", time: "Set 2 21-16", roundNumber: 2, text: "Ganda putra RT 01 resmi menjuarai cabor Bulutangkis!", team: "A", type: "score" }
    ],
    notes: "Medali Emas untuk RT 01, Perak untuk RT 02."
  }
];

export const initialBudgetItems: BudgetItem[] = [
  { id: "b-01", category: "prizes", title: "Piala Bergilir, Medali Emas/Perak/Perunggu & Piagam Penghargaan", plannedAmount: 4500000, priority: "high" },
  { id: "b-02", category: "equipment", title: "Sewa Sound System, Kabel LAN Cat6, Monitor & Router WiFi Balai", plannedAmount: 3200000, priority: "high" },
  { id: "b-03", category: "it_streaming", title: "Streaming Mixer, Webcam HD, Layar Proyektor & Server Cloud", plannedAmount: 1800000, priority: "medium" },
  { id: "b-04", category: "honor", title: "Honor Wasit Resmi PBSI, PTMSI & Caster E-Sports (10 Pertandingan)", plannedAmount: 2500000, priority: "high" },
  { id: "b-05", category: "consumption", title: "Konsumsi Panitia, Wasit & Atlet (Air Mineral & Snack)", plannedAmount: 2200000, priority: "medium" },
  { id: "b-06", category: "venue", title: "Dekorasi Panggung, Spanduk Banner Antar RT & Tenda Final", plannedAmount: 1600000, priority: "low" },
  { id: "b-07", category: "misc", title: "P3K, Obat-obatan Medis Darurat & Dana Tak Terduga", plannedAmount: 1000000, priority: "low" }
];

export const initialExpenses: ExpenseRecord[] = [
  {
    id: "exp-01",
    budgetItemId: "b-01",
    category: "Piala & Medali",
    description: "Uang muka pesanan piala bergilir RW 08 + 24 set medali logam cor emas perak perunggu",
    amount: 3200000,
    date: "2026-08-02",
    receiptNumber: "KWT-PL-001",
    paidBy: "H. Joko (Bendahara)",
    verifiedBy: "Bpk. Bambang (Ketua)"
  },
  {
    id: "exp-02",
    budgetItemId: "b-02",
    category: "Perlengkapan",
    description: "Pembelian kabel LAN Cat6 100 meter, Switch hub 8-port gigabit, & colokan listrik",
    amount: 1450000,
    date: "2026-08-04",
    receiptNumber: "NOTA-EL-889",
    paidBy: "Rian (Seksi Alat)",
    verifiedBy: "H. Joko (Bendahara)"
  },
  {
    id: "exp-03",
    budgetItemId: "b-04",
    category: "Honor Wasit",
    description: "Honorarium wasit PBSI & wasit e-sports babak penyisihan hingga perempat final",
    amount: 1500000,
    date: "2026-08-14",
    receiptNumber: "HONOR-W-01",
    paidBy: "H. Joko (Bendahara)",
    verifiedBy: "Bpk. Bambang (Ketua)"
  },
  {
    id: "exp-04",
    budgetItemId: "b-05",
    category: "Konsumsi",
    description: "Snack box dan air mineral galon untuk opening ceremony & babak 8 besar",
    amount: 1100000,
    date: "2026-08-12",
    receiptNumber: "NOTA-CATER-04",
    paidBy: "Ibu Siti (Seksi Konsumsi)",
    verifiedBy: "H. Joko (Bendahara)"
  }
];

export const initialIncomes: IncomeRecord[] = [
  {
    id: "inc-01",
    source: "iuran_rt",
    sourceName: "Kas RW 08 (Alokasi Dana Kegiatan Kemerdekaan)",
    amount: 6000000,
    date: "2026-08-01",
    paymentMethod: "transfer",
    status: "paid",
    receiptNumber: "RW08-TRF-01"
  },
  {
    id: "inc-02",
    source: "iuran_rt",
    sourceName: "Iuran Kontingen 8 RT (@ Rp 400.000)",
    amount: 3200000,
    date: "2026-08-03",
    paymentMethod: "cash",
    status: "paid",
    receiptNumber: "IURAN-RT-ALL"
  },
  {
    id: "inc-03",
    source: "sponsor",
    sourceName: "IndiHome Community & Telkomsel (Platinum Sponsor)",
    amount: 4000000,
    date: "2026-08-05",
    paymentMethod: "transfer",
    status: "paid",
    receiptNumber: "SPON-TEL-01"
  },
  {
    id: "inc-04",
    source: "sponsor",
    sourceName: "Toko Elektronik Berkah RT 04 (Gold Sponsor)",
    amount: 1500000,
    date: "2026-08-07",
    paymentMethod: "qris",
    status: "paid",
    receiptNumber: "SPON-BERKAH-02"
  },
  {
    id: "inc-05",
    source: "donatur",
    sourceName: "Hamba Allah Warga Blok B (Donasi Hadiah MVP)",
    amount: 1000000,
    date: "2026-08-10",
    paymentMethod: "cash",
    status: "paid",
    receiptNumber: "DON-091"
  }
];

export const initialSponsors: Sponsor[] = [
  {
    id: "spn-01",
    name: "IndiHome Community Telkom",
    tier: "Platinum",
    amount: 4000000,
    logoUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=100&auto=format&fit=crop&q=80",
    status: "confirmed",
    contactPerson: "Bpk. Aditya Firmansyah",
    phone: "0811-9988-7766",
    benefits: [
      "Logo di backdrop panggung utama & live stream overlay",
      "Penyediaan bandwidth internet gigabit khusus arena turnamen",
      "Penyebutan nama sponsor pada setiap awal match oleh caster"
    ]
  },
  {
    id: "spn-02",
    name: "Toko Elektronik Berkah RT 04",
    tier: "Gold",
    amount: 1500000,
    logoUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=80",
    status: "confirmed",
    contactPerson: "Bpk. H. Rasyid",
    phone: "0812-4455-6677",
    benefits: [
      "Logo di spanduk jalan masuk RW 08",
      "Voucher diskon aksesoris gaming untuk penonton",
      "Booth promosi di samping arena Balai Warga"
    ]
  },
  {
    id: "spn-03",
    name: "Warung Kopi 'Mas Bro' RT 03",
    tier: "Silver",
    amount: 750000,
    logoUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=100&auto=format&fit=crop&q=80",
    status: "confirmed",
    contactPerson: "Mas Bro Bram",
    phone: "0813-2211-9900",
    benefits: [
      "Penyediaan kopi gratis untuk panitia & wasit",
      "Logo di jersey panitia bagian lengan"
    ]
  },
  {
    id: "spn-04",
    name: "Koran Digital & Komunitas Warga RW 08",
    tier: "Media Partner",
    amount: 0,
    logoUrl: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=100&auto=format&fit=crop&q=80",
    status: "confirmed",
    contactPerson: "Dinda Saraswati",
    phone: "0812-8899-0011",
    benefits: [
      "Liputan berita harian dan foto rekap seluruh pertandingan",
      "Publikasi profil atlet berprestasi di buletin bulanan"
    ]
  }
];

export const initialCommitteeMembers: CommitteeMember[] = [
  { id: "com-01", fullName: "Bpk. Bambang Sudiro", role: "Ketua Panitia Pelaksana", division: "BPH", rtOrigin: "RT 01", phone: "0812-1111-0101", attendanceStatus: "present" },
  { id: "com-02", fullName: "Dedi Kurniawan, S.Kom", role: "Wakil Ketua / Koordinator Esports", division: "BPH", rtOrigin: "RT 03", phone: "0812-3333-0303", attendanceStatus: "present" },
  { id: "com-03", fullName: "H. Joko Prasetyo", role: "Bendahara Umum Turnamen", division: "BPH", rtOrigin: "RT 02", phone: "0812-2222-0202", attendanceStatus: "present" },
  { id: "com-04", fullName: "Farhan Maulana", role: "Seksi Pertandingan & Bagan", division: "Pertandingan", rtOrigin: "RT 04", phone: "0813-8877-6655", attendanceStatus: "duty" },
  { id: "com-05", fullName: "Rian Hidayat", role: "Seksi IT, Jaringan & Live Score", division: "Pertandingan", rtOrigin: "RT 03", phone: "0813-7766-5544", attendanceStatus: "duty" },
  { id: "com-06", fullName: "Ibu Siti Rohmah", role: "Koordinator Konsumsi & Logistik", division: "Konsumsi", rtOrigin: "RT 05", phone: "0812-5566-7788", attendanceStatus: "present" },
  { id: "com-07", fullName: "Anugrah Putra", role: "Seksi Keamanan & Ketertiban", division: "Keamanan", rtOrigin: "RT 06", phone: "0812-6677-8899", attendanceStatus: "present" }
];

export const initialUserAccounts: UserAccount[] = [
  {
    id: "usr-admin",
    username: "admin",
    fullName: "Super Administrator Sistem",
    role: "super_admin",
    email: "admin.turnamen@rw08.org",
    passwordHash: "admin123", // plaintext representation in local demo, verified via secure hash
    status: "active"
  },
  {
    id: "usr-ketua",
    username: "ketua",
    fullName: "Bpk. Bambang Sudiro (Ketua Panitia)",
    role: "ketua_panitia",
    email: "ketua.panitia@rw08.org",
    passwordHash: "ketua123",
    status: "active"
  },
  {
    id: "usr-wasit",
    username: "wasit",
    fullName: "Wasit Arya Pratama (Match Scorer)",
    role: "wasit",
    email: "wasit.arya@gmail.com",
    passwordHash: "wasit123",
    status: "active"
  },
  {
    id: "usr-bendahara",
    username: "bendahara",
    fullName: "H. Joko Prasetyo (Bendahara)",
    role: "bendahara",
    email: "bendahara.rw08@gmail.com",
    passwordHash: "uang123",
    status: "active"
  },
  {
    id: "usr-rt03",
    username: "pengurus_rt03",
    fullName: "Bpk. Dedi Kurniawan (Admin RT 03)",
    role: "pengurus_rt",
    rtId: "rt-03",
    email: "rt03.cyber@gmail.com",
    passwordHash: "rt03pass",
    status: "active"
  }
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: "log-101",
    timestamp: "2026-08-16 19:45:10",
    userName: "Wasit Arya Pratama",
    userRole: "wasit",
    action: "UPDATE_SCORE",
    module: "Pertandingan MLBB Grand Final",
    details: "Update skor babak 1 RT 03 (24) vs RT 02 (16), mengesahkan kemenangan Game 1 untuk RT 03.",
    ipAddress: "192.168.1.42 (Arena Wi-Fi)"
  },
  {
    id: "log-102",
    timestamp: "2026-08-16 18:30:22",
    userName: "Super Administrator Sistem",
    userRole: "super_admin",
    action: "SYNC_GOOGLE_SHEETS",
    module: "Integrasi AppScript",
    details: "Sinkronisasi otomatis 6 pertandingan dan klasemen ke Google Spreadsheet ID: 1BxiMVs0XRA5nFMdKv...",
    ipAddress: "127.0.0.1"
  },
  {
    id: "log-103",
    timestamp: "2026-08-15 21:10:05",
    userName: "H. Joko Prasetyo",
    userRole: "bendahara",
    action: "RECORD_EXPENSE",
    module: "Keuangan",
    details: "Mencatat pengeluaran honorarium wasit babak penyisihan Rp 1.500.000 (No: HONOR-W-01)",
    ipAddress: "192.168.1.15"
  },
  {
    id: "log-104",
    timestamp: "2026-08-14 20:30:00",
    userName: "Wasit Arya Pratama",
    userRole: "wasit",
    action: "FINALIZE_MATCH",
    module: "Pertandingan eFootball",
    details: "Mengesahkan skor akhir 3 - 2 dan menyatakan RT 02 sebagai Juara 1 Medali Emas eFootball",
    ipAddress: "192.168.1.20"
  }
];

export const initialNotifications: AppNotification[] = [
  {
    id: "notif-01",
    title: "LIVE NOW: Grand Final MLBB!",
    message: "Pertandingan sengit memperebutkan Medali Emas antara RT 03 (Singa Cyber) vs RT 02 (Rajawali Biru) sedang berlangsung!",
    type: "match_update",
    timestamp: "2026-08-16 19:30:00",
    targetRole: "all"
  },
  {
    id: "notif-02",
    title: "Update Perolehan Medali",
    message: "RT 01 memimpin cabor Bulutangkis, RT 02 merebut emas eFootball 2026.",
    type: "announcement",
    timestamp: "2026-08-15 22:00:00",
    targetRole: "all"
  },
  {
    id: "notif-03",
    title: "Laporan Keuangan Terupdate",
    message: "Realisasi anggaran telah diaudit mencapai 45.8% dengan surplus kas sehat.",
    type: "finance",
    timestamp: "2026-08-15 12:00:00",
    targetRole: "bendahara"
  }
];

export const defaultGoogleSheetsConfig: GoogleSheetsConfig = {
  scriptUrl: "https://script.google.com/macros/s/AKfycbx_RT_CHAMPIONSHIP_DATABASE/exec",
  sheetId: "1pRtCHAMPIONSHIP_DATABASE_SPREADSHEET_ID_2026",
  autoSync: true,
  syncIntervalMinutes: 5,
  lastSyncTime: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  syncStatus: "connected"
};
