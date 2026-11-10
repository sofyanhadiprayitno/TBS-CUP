import { Match, StageType, RTContingent } from '../types';

export interface BracketRound {
  title: string;
  stage: StageType;
  matches: Match[];
}

export function generateInitialBracketMatches(
  sportId: string,
  contingents: RTContingent[],
  venueDefault = "Balai Warga RW 08"
): Match[] {
  // Use available contingents (e.g. 8 RTs)
  const sorted = [...contingents].slice(0, 8);
  const matches: Match[] = [];

  // 1. Quarter Finals (8 Besar) - 4 Matches
  const qfPairs = [
    { a: sorted[0], b: sorted[7], time: "2026-08-14 09:00" },
    { a: sorted[3], b: sorted[4], time: "2026-08-14 10:30" },
    { a: sorted[1], b: sorted[6], time: "2026-08-14 13:30" },
    { a: sorted[2], b: sorted[5], time: "2026-08-14 15:00" }
  ];

  qfPairs.forEach((pair, idx) => {
    matches.push({
      id: `match-${sportId}-qf-${idx + 1}`,
      sportId,
      stage: 'quarter_final',
      bracketIndex: idx,
      scheduledTime: pair.time,
      venue: venueDefault,
      refereeId: 'ref-01',
      teamA: {
        rtId: pair.a ? pair.a.id : 'rt-01',
        label: pair.a ? pair.a.name : 'TBD'
      },
      teamB: {
        rtId: pair.b ? pair.b.id : 'rt-02',
        label: pair.b ? pair.b.name : 'TBD'
      },
      status: 'scheduled',
      currentRound: 1,
      round1: { teamAScore: 0, teamBScore: 0 },
      round2: { teamAScore: 0, teamBScore: 0 },
      totalScoreA: 0,
      totalScoreB: 0,
      timeline: []
    });
  });

  // 2. Semi Finals (4 Besar) - 2 Matches
  matches.push({
    id: `match-${sportId}-sf-1`,
    sportId,
    stage: 'semi_final',
    bracketIndex: 0,
    scheduledTime: "2026-08-15 14:00",
    venue: venueDefault,
    refereeId: 'ref-01',
    teamA: { rtId: '', label: 'Pemenang 8 Besar 1' },
    teamB: { rtId: '', label: 'Pemenang 8 Besar 2' },
    status: 'scheduled',
    currentRound: 1,
    round1: { teamAScore: 0, teamBScore: 0 },
    round2: { teamAScore: 0, teamBScore: 0 },
    totalScoreA: 0,
    totalScoreB: 0,
    timeline: []
  });

  matches.push({
    id: `match-${sportId}-sf-2`,
    sportId,
    stage: 'semi_final',
    bracketIndex: 1,
    scheduledTime: "2026-08-15 16:00",
    venue: venueDefault,
    refereeId: 'ref-01',
    teamA: { rtId: '', label: 'Pemenang 8 Besar 3' },
    teamB: { rtId: '', label: 'Pemenang 8 Besar 4' },
    status: 'scheduled',
    currentRound: 1,
    round1: { teamAScore: 0, teamBScore: 0 },
    round2: { teamAScore: 0, teamBScore: 0 },
    totalScoreA: 0,
    totalScoreB: 0,
    timeline: []
  });

  // 3. Bronze Match (Perebutan Juara 3 & 4)
  matches.push({
    id: `match-${sportId}-bronze`,
    sportId,
    stage: 'third_place',
    bracketIndex: 0,
    scheduledTime: "2026-08-16 14:00",
    venue: venueDefault,
    refereeId: 'ref-01',
    teamA: { rtId: '', label: 'Kalah Semifinal 1' },
    teamB: { rtId: '', label: 'Kalah Semifinal 2' },
    status: 'scheduled',
    currentRound: 1,
    round1: { teamAScore: 0, teamBScore: 0 },
    round2: { teamAScore: 0, teamBScore: 0 },
    totalScoreA: 0,
    totalScoreB: 0,
    timeline: []
  });

  // 4. Gold Match (Final Perebutan Juara 1 & 2)
  matches.push({
    id: `match-${sportId}-final`,
    sportId,
    stage: 'final',
    bracketIndex: 0,
    scheduledTime: "2026-08-16 19:30",
    venue: venueDefault,
    refereeId: 'ref-01',
    teamA: { rtId: '', label: 'Pemenang Semifinal 1' },
    teamB: { rtId: '', label: 'Pemenang Semifinal 2' },
    status: 'scheduled',
    currentRound: 1,
    round1: { teamAScore: 0, teamBScore: 0 },
    round2: { teamAScore: 0, teamBScore: 0 },
    totalScoreA: 0,
    totalScoreB: 0,
    timeline: []
  });

  return matches;
}

export function autoAdvanceTournamentBracket(
  matches: Match[],
  contingents: RTContingent[]
): Match[] {
  const updated = [...matches];
  const findContingent = (id: string) => contingents.find(c => c.id === id);

  // Semifinal 1 comes from QF 0 and QF 1
  const qf0 = updated.find(m => m.stage === 'quarter_final' && m.bracketIndex === 0);
  const qf1 = updated.find(m => m.stage === 'quarter_final' && m.bracketIndex === 1);
  const sf0 = updated.find(m => m.stage === 'semi_final' && m.bracketIndex === 0);

  if (sf0) {
    if (qf0 && qf0.winnerRtId) {
      const c = findContingent(qf0.winnerRtId);
      sf0.teamA = { rtId: qf0.winnerRtId, label: c ? c.name : 'Pemenang 8 Besar 1' };
    }
    if (qf1 && qf1.winnerRtId) {
      const c = findContingent(qf1.winnerRtId);
      sf0.teamB = { rtId: qf1.winnerRtId, label: c ? c.name : 'Pemenang 8 Besar 2' };
    }
  }

  // Semifinal 2 comes from QF 2 and QF 3
  const qf2 = updated.find(m => m.stage === 'quarter_final' && m.bracketIndex === 2);
  const qf3 = updated.find(m => m.stage === 'quarter_final' && m.bracketIndex === 3);
  const sf1 = updated.find(m => m.stage === 'semi_final' && m.bracketIndex === 1);

  if (sf1) {
    if (qf2 && qf2.winnerRtId) {
      const c = findContingent(qf2.winnerRtId);
      sf1.teamA = { rtId: qf2.winnerRtId, label: c ? c.name : 'Pemenang 8 Besar 3' };
    }
    if (qf3 && qf3.winnerRtId) {
      const c = findContingent(qf3.winnerRtId);
      sf1.teamB = { rtId: qf3.winnerRtId, label: c ? c.name : 'Pemenang 8 Besar 4' };
    }
  }

  // Final and Bronze match come from SF 0 and SF 1
  const finalMatch = updated.find(m => m.stage === 'final');
  const bronzeMatch = updated.find(m => m.stage === 'third_place');

  if (sf0 && sf1) {
    // If SF0 is completed
    if (sf0.status === 'completed' && sf0.winnerRtId) {
      const winnerC = findContingent(sf0.winnerRtId);
      const loserRtId = sf0.winnerRtId === sf0.teamA.rtId ? sf0.teamB.rtId : sf0.teamA.rtId;
      const loserC = findContingent(loserRtId);

      if (finalMatch) {
        finalMatch.teamA = { rtId: sf0.winnerRtId, label: winnerC ? winnerC.name : 'Pemenang SF 1' };
      }
      if (bronzeMatch && loserRtId) {
        bronzeMatch.teamA = { rtId: loserRtId, label: loserC ? loserC.name : 'Kalah SF 1' };
      }
    }

    // If SF1 is completed
    if (sf1.status === 'completed' && sf1.winnerRtId) {
      const winnerC = findContingent(sf1.winnerRtId);
      const loserRtId = sf1.winnerRtId === sf1.teamA.rtId ? sf1.teamB.rtId : sf1.teamA.rtId;
      const loserC = findContingent(loserRtId);

      if (finalMatch) {
        finalMatch.teamB = { rtId: sf1.winnerRtId, label: winnerC ? winnerC.name : 'Pemenang SF 2' };
      }
      if (bronzeMatch && loserRtId) {
        bronzeMatch.teamB = { rtId: loserRtId, label: loserC ? loserC.name : 'Kalah SF 2' };
      }
    }
  }

  return updated;
}
