export type AuraState = 'Stable' | 'Rising' | 'Elevated';

export type CameraStatus =
  | 'idle'
  | 'requesting'
  | 'live'
  | 'denied'
  | 'skipped'
  | 'stopped';

export type FaceCueStatus = 'loading' | 'ready' | 'no-face' | 'error';

export interface AuraSnapshot {
  id: string;
  timestamp: Date;
  state: AuraState;
  score: number;
  detail: string;
  trigger?: string;
}

export type BuddySpecies = 'puppy' | 'cat' | 'bunny' | 'fox';

export type BuddyReaction =
  | 'ready'
  | 'calm'
  | 'attentive'
  | 'supportive'
  | 'noticing'
  | 'breathing'
  | 'celebrating';

export interface AuraBuddyProfile {
  species: BuddySpecies;
  name: string;
  level: number;
  xp: number;
  maxXp: number;
  sessionsTogether: number;
  equippedAccessory?: string;
  equippedToy?: string;
}

export type StoreCategory =
  | 'All'
  | 'Trees'
  | 'Plants'
  | 'Flowers'
  | 'Decor'
  | 'Accessories'
  | 'Toys'
  | 'Themes';

export interface StoreItem {
  id: string;
  name: string;
  category: 'Trees' | 'Plants' | 'Flowers' | 'Decor' | 'Accessories' | 'Toys' | 'Themes';
  description: string;
  cost: number;
  iconName: string;
  accent: string;
  soft: string;
  tag: string;
  type?: 'garden' | 'tree' | 'accessory' | 'toy' | 'theme';
  treeSpecies?: string;
  locked?: boolean;
  lockCopy?: string;
}

export interface PlantedTree {
  id: string;
  treeItemId: string;
  name: string;
  species: string;
  plantedAt: string;
  growthMinutes: number;
  stage: 'Seed' | 'Sprout' | 'Young Tree' | 'Growing Tree' | 'Flourishing Tree';
}

export interface SessionRecord {
  id: string;
  date: string;
  timestamp?: number;
  durationSeconds: number;
  avgScore: number;
  maxScore?: number;
  elevatedPeriods?: number;
  resetsCount: number;
  pointsEarned: number;
  xpEarned: number;
  breakdown?: { label: string; points: number }[];
  withCamera: boolean;
}

export interface JourneyStats {
  totalSessions: number;
  totalSeconds: number;
  averageScore: number;
  totalResets: number;
  totalPointsEarned: number;
  currentStreak: number;
  longestStreak: number;
  treesPlanted: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  unlockedAt?: string;
}

export interface TodayVsYouComparison {
  durationComparison: string;
  scoreComparison: string;
  elevatedComparison: string;
  resetsComparison: string;
  summarySentence: string;
}

export interface StateConfig {
  eyebrow: string;
  message: string;
  color: string;
  soft: string;
}

export interface StudyFlashcard {
  front: string;
  back: string;
}

export interface StudyQuiz {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface StudyChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  cardType?: 'text' | 'flashcards' | 'quiz';
  flashcards?: StudyFlashcard[];
  quiz?: StudyQuiz;
}

export interface BloomStage {
  level: number;
  name: string;
  minMinutes: number;
  description: string;
  petalCount: number;
  bloomColor: string;
  perk: string;
}

export interface BloomGrowthState {
  stageIndex: number;
  stageName: string;
  growthProgress: number; // 0-100
  dewNourished: number;
  focusMinutesAbsorbed: number;
  vitality: number;
}

