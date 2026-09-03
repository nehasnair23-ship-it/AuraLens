import {
  AuraBuddyProfile,
  BuddySpecies,
  PlantedTree,
  SessionRecord,
  JourneyStats,
  Achievement,
  TodayVsYouComparison,
} from '../types';

const STORAGE_KEYS = {
  POINTS: 'auralens_points',
  BUDDY: 'auralens_buddy',
  UNLOCKED: 'auralens_unlocked_items',
  EQUIPPED: 'auralens_equipped',
  TREES: 'auralens_planted_trees',
  SESSIONS: 'auralens_sessions',
  AWARDED_IDS: 'auralens_awarded_session_ids',
};

export const DEFAULT_BUDDY: AuraBuddyProfile = {
  species: 'puppy',
  name: 'Boba',
  level: 3,
  xp: 180,
  maxXp: 250,
  sessionsTogether: 12,
  equippedAccessory: 'silk-scarf',
  equippedToy: 'wooden-stick',
};

export const DEFAULT_PLANTED_TREES: PlantedTree[] = [
  {
    id: 'tree-1',
    treeItemId: 'bonsai-pine',
    name: 'Bonsai Pine',
    species: 'Pine',
    plantedAt: '2026-08-28',
    growthMinutes: 48,
    stage: 'Growing Tree',
  },
  {
    id: 'tree-2',
    treeItemId: 'cherry-blossom',
    name: 'Cherry Blossom',
    species: 'Sakura',
    plantedAt: '2026-09-01',
    growthMinutes: 82,
    stage: 'Flourishing Tree',
  },
];

export const DEFAULT_SESSION_HISTORY: SessionRecord[] = [
  {
    id: 'sess-prev-1',
    date: 'Yesterday, 4:15 PM',
    durationSeconds: 1500, // 25 min
    avgScore: 28,
    maxScore: 62,
    elevatedPeriods: 1,
    resetsCount: 1,
    pointsEarned: 25,
    xpEarned: 45,
    withCamera: true,
  },
  {
    id: 'sess-prev-2',
    date: '2 days ago, 10:30 AM',
    durationSeconds: 2400, // 40 min
    avgScore: 34,
    maxScore: 74,
    elevatedPeriods: 2,
    resetsCount: 2,
    pointsEarned: 45,
    xpEarned: 70,
    withCamera: true,
  },
  {
    id: 'sess-prev-3',
    date: '3 days ago, 8:00 PM',
    durationSeconds: 900, // 15 min
    avgScore: 22,
    maxScore: 45,
    elevatedPeriods: 0,
    resetsCount: 0,
    pointsEarned: 15,
    xpEarned: 25,
    withCamera: false,
  },
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_breath',
    title: 'First Step',
    description: 'Complete your first mindful study session.',
    icon: 'Sparkles',
    unlocked: true,
    progress: 1,
    maxProgress: 1,
    unlockedAt: 'August 28, 2026',
  },
  {
    id: 'reset_master',
    title: 'Mindful Pause',
    description: 'Complete 3 intentional breathing resets.',
    icon: 'Wind',
    unlocked: true,
    progress: 3,
    maxProgress: 3,
    unlockedAt: 'September 1, 2026',
  },
  {
    id: 'deep_roots',
    title: 'Deep Roots',
    description: 'Plant your first tree in AuraBloom.',
    icon: 'TreePine',
    unlocked: true,
    progress: 2,
    maxProgress: 1,
    unlockedAt: 'August 28, 2026',
  },
  {
    id: 'study_habit_5',
    title: 'Study Flow',
    description: 'Complete 5 mindful study sessions.',
    icon: 'Award',
    unlocked: true,
    progress: 5,
    maxProgress: 5,
    unlockedAt: 'September 2, 2026',
  },
  {
    id: 'study_habit_10',
    title: 'Sustained Rhythm',
    description: 'Complete 10 mindful study sessions.',
    icon: 'Trophy',
    unlocked: true,
    progress: 12,
    maxProgress: 10,
    unlockedAt: 'September 2, 2026',
  },
  {
    id: 'buddy_bond',
    title: 'Loyal Companion',
    description: 'Reach Level 5 with your chosen AuraBuddy.',
    icon: 'Heart',
    unlocked: false,
    progress: 3,
    maxProgress: 5,
  },
  {
    id: 'flourishing_sanctuary',
    title: 'Flourishing Canopy',
    description: 'Grow a tree to the Flourishing Tree stage.',
    icon: 'Crown',
    unlocked: true,
    progress: 1,
    maxProgress: 1,
    unlockedAt: 'September 1, 2026',
  },
];

// LocalStorage helpers with safe fallbacks
export function getStoredPoints(): number {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.POINTS);
    if (val !== null) {
      const parsed = parseInt(val, 10);
      if (!isNaN(parsed) && parsed >= 0) return parsed;
    }
  } catch {}
  return 85; // Starting points for great onboarding exploration
}

export function setStoredPoints(points: number): void {
  try {
    const safe = Math.max(0, points);
    localStorage.setItem(STORAGE_KEYS.POINTS, safe.toString());
  } catch {}
}

export function getStoredBuddy(): AuraBuddyProfile {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.BUDDY);
    if (val) {
      const parsed = JSON.parse(val);
      if (parsed && parsed.species) return parsed;
    }
  } catch {}
  return DEFAULT_BUDDY;
}

export function setStoredBuddy(buddy: AuraBuddyProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BUDDY, JSON.stringify(buddy));
  } catch {}
}

export function getStoredUnlocked(): string[] {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.UNLOCKED);
    if (val) {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return ['moonfern', 'sunspool', 'bonsai-pine', 'silk-scarf', 'wooden-stick'];
}

export function setStoredUnlocked(ids: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.UNLOCKED, JSON.stringify(ids));
  } catch {}
}

export function getStoredPlantedTrees(): PlantedTree[] {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.TREES);
    if (val) {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return DEFAULT_PLANTED_TREES;
}

export function setStoredPlantedTrees(trees: PlantedTree[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TREES, JSON.stringify(trees));
  } catch {}
}

export function getStoredSessions(): SessionRecord[] {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (val) {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return DEFAULT_SESSION_HISTORY;
}

export function setStoredSessions(sessions: SessionRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  } catch {}
}

export function getAwardedSessionIds(): string[] {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.AWARDED_IDS);
    if (val) {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

export function markSessionAwarded(id: string): void {
  try {
    const prev = getAwardedSessionIds();
    if (!prev.includes(id)) {
      localStorage.setItem(STORAGE_KEYS.AWARDED_IDS, JSON.stringify([...prev, id]));
    }
  } catch {}
}

/**
 * Calculates Aura Points based on explicit rules:
 * - 10-minute session → +10 points
 * - 25-minute session → +25 points
 * - 45-minute session → +50 points
 * - Completed reset → +5 points each
 * - Proportional calculation for arbitrary durations
 */
export function calculateAuraPoints(durationSeconds: number, resetsCount: number): number {
  const minutes = Math.floor(durationSeconds / 60);
  let basePoints = 5; // Minimum courtesy points for showing up

  if (minutes >= 45) {
    basePoints = 50;
  } else if (minutes >= 25) {
    basePoints = 25;
  } else if (minutes >= 10) {
    basePoints = 10;
  } else if (minutes >= 5) {
    basePoints = 5;
  } else {
    basePoints = Math.max(3, minutes * 2);
  }

  const resetBonus = resetsCount * 5;
  return basePoints + resetBonus;
}

/**
 * Calculates Buddy XP gained from session
 */
export function calculateBuddyXp(durationSeconds: number, resetsCount: number): number {
  const minutes = Math.floor(durationSeconds / 60);
  return Math.max(15, minutes * 2 + resetsCount * 10);
}

/**
 * Adds XP to Buddy and handles Level Up
 */
export function addBuddyXp(
  current: AuraBuddyProfile,
  xpToAdd: number
): { updatedBuddy: AuraBuddyProfile; leveledUp: boolean } {
  let newXp = current.xp + xpToAdd;
  let newLevel = current.level;
  let maxXp = current.maxXp;
  let leveledUp = false;

  while (newXp >= maxXp) {
    newXp -= maxXp;
    newLevel += 1;
    maxXp = Math.round(maxXp * 1.35);
    leveledUp = true;
  }

  return {
    updatedBuddy: {
      ...current,
      level: newLevel,
      xp: newXp,
      maxXp,
      sessionsTogether: current.sessionsTogether + 1,
    },
    leveledUp,
  };
}

/**
 * Determine tree growth stage based on focus minutes absorbed
 */
export function getTreeStage(
  growthMinutes: number
): 'Seed' | 'Sprout' | 'Young Tree' | 'Growing Tree' | 'Flourishing Tree' {
  if (growthMinutes < 10) return 'Seed';
  if (growthMinutes < 25) return 'Sprout';
  if (growthMinutes < 45) return 'Young Tree';
  if (growthMinutes < 75) return 'Growing Tree';
  return 'Flourishing Tree';
}

/**
 * Generate "Today vs You" comparison in compassionate, neutral terms
 */
export function generateTodayVsYou(
  current: SessionRecord,
  history: SessionRecord[]
): TodayVsYouComparison {
  if (history.length === 0) {
    return {
      durationComparison: 'First logged session on record.',
      scoreComparison: 'Baseline prototype study load established.',
      elevatedComparison: 'No prior sessions to compare.',
      resetsComparison: `${current.resetsCount} reset${current.resetsCount === 1 ? '' : 's'} taken.`,
      summarySentence: 'A steady foundation established for your mindful study rhythm.',
    };
  }

  const avgDuration =
    history.reduce((acc, s) => acc + s.durationSeconds, 0) / history.length;
  const avgHistScore =
    history.reduce((acc, s) => acc + s.avgScore, 0) / history.length;
  const avgElevated =
    history.reduce((acc, s) => acc + s.elevatedPeriods, 0) / history.length;

  const curMinutes = Math.round(current.durationSeconds / 60);
  const histMinutes = Math.round(avgDuration / 60);

  let durationComparison = '';
  if (curMinutes > histMinutes + 5) {
    durationComparison = `${curMinutes}m (${curMinutes - histMinutes}m longer than your ${histMinutes}m average)`;
  } else if (curMinutes < histMinutes - 5) {
    durationComparison = `${curMinutes}m (compact session compared to ${histMinutes}m average)`;
  } else {
    durationComparison = `${curMinutes}m (consistent with your ${histMinutes}m typical length)`;
  }

  let scoreComparison = '';
  if (current.avgScore < avgHistScore - 5) {
    scoreComparison = `Average load of ${current.avgScore} (calmer than your ${Math.round(avgHistScore)} baseline)`;
  } else if (current.avgScore > avgHistScore + 5) {
    scoreComparison = `Average load of ${current.avgScore} (higher intensity than your ${Math.round(avgHistScore)} baseline)`;
  } else {
    scoreComparison = `Average load of ${current.avgScore} (settled near your ${Math.round(avgHistScore)} baseline)`;
  }

  let elevatedComparison = '';
  if (current.elevatedPeriods === 0) {
    elevatedComparison = '0 elevated periods detected throughout.';
  } else if (current.elevatedPeriods <= avgElevated) {
    elevatedComparison = `${current.elevatedPeriods} elevated period${current.elevatedPeriods === 1 ? '' : 's'} (fewer peaks than usual).`;
  } else {
    elevatedComparison = `${current.elevatedPeriods} elevated period${current.elevatedPeriods === 1 ? '' : 's'} noticed and navigated.`;
  }

  const resetsComparison =
    current.resetsCount > 0
      ? `${current.resetsCount} intentional reset${current.resetsCount === 1 ? '' : 's'} completed.`
      : 'Completed without taking an intentional reset.';

  // Neutral, supportive summary sentence
  let summarySentence = 'Today’s session was more consistent than your previous sessions.';
  if (current.avgScore <= avgHistScore) {
    summarySentence = 'Your rhythm showed calm endurance and steady attention throughout.';
  } else if (current.resetsCount > 0) {
    summarySentence = 'You noticed rising cognitive intensity and answered it with a supportive pause.';
  } else {
    summarySentence = 'A dedicated session carried through to a peaceful finish.';
  }

  return {
    durationComparison,
    scoreComparison,
    elevatedComparison,
    resetsComparison,
    summarySentence,
  };
}

export function computeJourneyStats(
  sessions: SessionRecord[],
  trees: PlantedTree[],
  currentPoints: number
): JourneyStats {
  const totalSessions = sessions.length;
  const totalSeconds = sessions.reduce((acc, s) => acc + s.durationSeconds, 0);
  const totalResets = sessions.reduce((acc, s) => acc + s.resetsCount, 0);
  const totalPointsEarned = sessions.reduce((acc, s) => acc + s.pointsEarned, 0) + currentPoints;
  const averageScore =
    totalSessions > 0
      ? Math.round(sessions.reduce((acc, s) => acc + s.avgScore, 0) / totalSessions)
      : 24;

  return {
    totalSessions,
    totalSeconds,
    averageScore,
    totalResets,
    totalPointsEarned,
    currentStreak: Math.min(14, Math.max(1, totalSessions)),
    longestStreak: Math.min(21, Math.max(1, totalSessions + 2)),
    treesPlanted: trees.length,
  };
}

// Aliases and convenience methods for clean state orchestration
export const loadAuraPoints = getStoredPoints;
export const saveAuraPoints = setStoredPoints;
export const loadBuddyProfile = getStoredBuddy;
export const saveBuddyProfile = setStoredBuddy;
export const loadPlantedTrees = getStoredPlantedTrees;
export const savePlantedTrees = setStoredPlantedTrees;
export const loadSessionHistory = getStoredSessions;

export function saveSessionRecord(newSession: SessionRecord): SessionRecord[] {
  const current = getStoredSessions();
  const updated = [newSession, ...current].slice(0, 30);
  setStoredSessions(updated);
  return updated;
}

export function addTreeGrowthMinutes(trees: PlantedTree[], additionalMinutes: number): PlantedTree[] {
  return trees.map((tree) => {
    const nextMinutes = tree.growthMinutes + additionalMinutes;
    return {
      ...tree,
      growthMinutes: nextMinutes,
      stage: getTreeStage(nextMinutes),
    };
  });
}

export function loadAchievements(): Achievement[] {
  try {
    const val = localStorage.getItem('auralens_achievements');
    if (val) {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return INITIAL_ACHIEVEMENTS;
}

export function saveAchievements(achievements: Achievement[]): void {
  try {
    localStorage.setItem('auralens_achievements', JSON.stringify(achievements));
  } catch {}
}

export function updateAchievements(
  current: Achievement[],
  sessions: SessionRecord[],
  buddy: AuraBuddyProfile,
  trees: PlantedTree[]
): Achievement[] {
  const totalSessions = sessions.length;
  const totalResets = sessions.reduce((acc, s) => acc + s.resetsCount, 0);
  const flourishingCount = trees.filter((t) => t.stage === 'Flourishing Tree').length;

  return current.map((ach) => {
    if (ach.unlocked) return ach;

    let progress = ach.progress;
    let unlocked = false;

    if (ach.id === 'first_breath' && totalSessions >= 1) {
      progress = 1;
      unlocked = true;
    } else if (ach.id === 'reset_master') {
      progress = Math.min(3, totalResets);
      unlocked = totalResets >= 3;
    } else if (ach.id === 'deep_roots') {
      progress = Math.min(1, trees.length);
      unlocked = trees.length >= 1;
    } else if (ach.id === 'study_habit_5') {
      progress = Math.min(5, totalSessions);
      unlocked = totalSessions >= 5;
    } else if (ach.id === 'study_habit_10') {
      progress = Math.min(10, totalSessions);
      unlocked = totalSessions >= 10;
    } else if (ach.id === 'buddy_bond') {
      progress = Math.min(5, buddy.level);
      unlocked = buddy.level >= 5;
    } else if (ach.id === 'flourishing_sanctuary') {
      progress = Math.min(1, flourishingCount);
      unlocked = flourishingCount >= 1;
    }

    return {
      ...ach,
      progress,
      unlocked,
      unlockedAt: unlocked && !ach.unlockedAt ? new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ach.unlockedAt,
    };
  });
}

export function calculateSessionRewards(
  durationSeconds: number,
  resetsCount: number,
  avgScore: number
): {
  pointsEarned: number;
  xpEarned: number;
  breakdown: { label: string; points: number }[];
} {
  const minutes = Math.max(1, Math.floor(durationSeconds / 60));
  let basePoints = 5;
  if (minutes >= 45) basePoints = 50;
  else if (minutes >= 25) basePoints = 25;
  else if (minutes >= 10) basePoints = 10;
  else basePoints = Math.max(5, minutes * 2);

  const resetBonus = resetsCount * 3;
  const calmBonus = avgScore <= 35 ? 4 : 0;

  const breakdown = [
    { label: `Focused time (${minutes}m)`, points: basePoints },
  ];
  if (resetBonus > 0) {
    breakdown.push({ label: `Mindful resets (${resetsCount})`, points: resetBonus });
  }
  if (calmBonus > 0) {
    breakdown.push({ label: 'Calm rhythm bonus', points: calmBonus });
  }

  const pointsEarned = basePoints + resetBonus + calmBonus;
  const xpEarned = calculateBuddyXp(durationSeconds, resetsCount);

  return { pointsEarned, xpEarned, breakdown };
}
