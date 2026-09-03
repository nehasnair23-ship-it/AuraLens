import { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Sparkles,
  Flame,
  Clock,
  Activity,
  Wind,
  Trophy,
  Trees,
  CheckCircle2,
  Calendar,
  Lock,
  ChevronRight,
  TrendingUp,
  Heart,
  Award,
} from 'lucide-react';
import {
  JourneyStats,
  AuraBuddyProfile,
  PlantedTree,
  SessionRecord,
  Achievement,
} from '../types';
import { formatTime } from '../data/storeCatalog';
import AuraCompanionAvatar from './AuraCompanionAvatar';

interface AuraJourneyProps {
  stats: JourneyStats;
  buddy: AuraBuddyProfile;
  trees: PlantedTree[];
  sessions: SessionRecord[];
  achievements: Achievement[];
  auraPoints: number;
  onReturnToSession: () => void;
  onGoToStore: () => void;
  onGoToBloom: () => void;
}

const MILESTONES = [
  { target: 1, label: 'First Step', desc: 'First mindful study session completed', icon: '🌱' },
  { target: 5, label: 'Flow Habit', desc: '5 mindful study sessions logged', icon: '🌿' },
  { target: 10, label: 'Sustained Rhythm', desc: '10 deep study sessions logged', icon: '🌲' },
  { target: 20, label: 'Master of Focus', desc: '20 intentional sessions logged', icon: '🏯' },
  { target: 30, label: 'Quiet Sanctuary', desc: '30 mindful sessions achieved', icon: '✨' },
  { target: 50, label: 'Aura Luminary', desc: '50 sessions of calm, steady growth', icon: '👑' },
];

export default function AuraJourney({
  stats,
  buddy,
  trees,
  sessions,
  achievements,
  auraPoints,
  onReturnToSession,
  onGoToStore,
  onGoToBloom,
}: AuraJourneyProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'sessions' | 'achievements'>('overview');

  const totalHours = (stats.totalSeconds / 3600).toFixed(1);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header & Nav */}
      <div
        className="mb-8 flex flex-col gap-4 border-b border-[#dedace] pb-6 sm:flex-row sm:items-center sm:justify-between"
        data-testid="header-journey"
      >
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onReturnToSession}
            className="flex items-center gap-2 rounded-xl border border-[#d8d5c9] bg-[#fbf8ef] px-3.5 py-2 text-xs font-semibold text-[#445055] transition-colors hover:bg-[#ede8db]"
            data-testid="link-journey-return"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to Session
          </button>

          <div className="flex items-center gap-2.5" data-testid="brand-journey">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#3a8c83] text-[#fbf8ef] font-bold shadow-[0_2px_0_#2b6962]">
              J
            </span>
            <span className="font-serif text-xl font-bold tracking-tight text-[#202840]">
              Aura Journey
            </span>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1 rounded-xl border border-[#dedace] bg-[#f5f1e4] p-1">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'overview'
                ? 'bg-[#fbf8ef] text-[#202840] shadow-sm'
                : 'text-[#697579] hover:text-[#202840]'
            }`}
          >
            Milestones & Metrics
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sessions')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'sessions'
                ? 'bg-[#fbf8ef] text-[#202840] shadow-sm'
                : 'text-[#697579] hover:text-[#202840]'
            }`}
          >
            Past Sessions ({sessions.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('achievements')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'achievements'
                ? 'bg-[#fbf8ef] text-[#202840] shadow-sm'
                : 'text-[#697579] hover:text-[#202840]'
            }`}
          >
            Achievements
          </button>
        </div>
      </div>

      {/* Hero Overview Banner with Streak & AuraBuddy Progress */}
      <div className="relative overflow-hidden rounded-[28px] border border-[#d6d0c0] bg-gradient-to-br from-[#fcf9f2] via-[#f7f2e4] to-[#ede7d5] p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#dedace] bg-[#fbf8ef] px-3.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#356a64]">
              <Sparkles className="h-3 w-3 text-[#d08b32]" />
              <span>Lifelong Focus Sanctuary</span>
            </div>

            <h2 className="mt-3 font-serif text-[34px] sm:text-[42px] font-bold tracking-tight text-[#202840] leading-none">
              Your rhythm is{' '}
              <span className="text-[#3a8c83]">growing roots.</span>
            </h2>

            <p className="mt-2.5 max-w-lg text-sm text-[#5a686c] leading-relaxed">
              Every mindful breath, quiet check-in, and reset contributes to your digital garden and companion bond.
            </p>
          </div>

          {/* Buddy Card Summary */}
          <div className="flex items-center gap-4 rounded-2xl border border-[#dedace] bg-[#fbf8ef] p-4 shadow-sm">
            <AuraCompanionAvatar
              species={buddy.species}
              reaction="calm"
              size="md"
              equippedAccessory={buddy.equippedAccessory}
              equippedToy={buddy.equippedToy}
            />

            <div>
              <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#79888c]">
                <Heart className="h-3 w-3 text-[#c96758] fill-[#f3d4ce]" />
                <span>Companion Bond</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-[#202840]">
                {buddy.name} (Lvl {buddy.level})
              </h3>
              <div className="mt-1 flex items-center gap-2">
                <div className="h-2 w-28 overflow-hidden rounded-full bg-[#e8e4da]">
                  <div
                    className="h-full rounded-full bg-[#3a8c83] transition-all"
                    style={{ width: `${Math.min(100, (buddy.xp / buddy.maxXp) * 100)}%` }}
                  />
                </div>
                <span className="font-mono text-[10px] font-semibold text-[#5a686c]">
                  {buddy.xp}/{buddy.maxXp} XP
                </span>
              </div>
              <p className="mt-1 font-mono text-[10px] text-[#7d8c90]">
                {buddy.sessionsTogether} sessions studied together
              </p>
            </div>
          </div>
        </div>

        {/* 4 Major High-Level Health Metric Cards */}
        <div className="mt-8 grid grid-cols-2 gap-3.5 sm:grid-cols-4">
          <div className="rounded-2xl border border-[#dedace] bg-[#fbf8ef] p-4">
            <div className="flex items-center justify-between text-[#68767b]">
              <span className="font-mono text-[10px] uppercase tracking-wider">Total Time</span>
              <Clock className="h-4 w-4 text-[#3a8c83]" />
            </div>
            <div className="mt-2 font-serif text-2xl font-bold text-[#202840]">
              {totalHours} hrs
            </div>
            <span className="font-mono text-[10px] text-[#7f8e92]">Across {stats.totalSessions} sessions</span>
          </div>

          <div className="rounded-2xl border border-[#dedace] bg-[#fbf8ef] p-4">
            <div className="flex items-center justify-between text-[#68767b]">
              <span className="font-mono text-[10px] uppercase tracking-wider">Study Streak</span>
              <Flame className="h-4 w-4 text-[#d08b32]" />
            </div>
            <div className="mt-2 font-serif text-2xl font-bold text-[#202840]">
              {stats.currentStreak} Days
            </div>
            <span className="font-mono text-[10px] text-[#7f8e92]">Best streak: {stats.longestStreak} days</span>
          </div>

          <div className="rounded-2xl border border-[#dedace] bg-[#fbf8ef] p-4">
            <div className="flex items-center justify-between text-[#68767b]">
              <span className="font-mono text-[10px] uppercase tracking-wider">Avg Load</span>
              <Activity className="h-4 w-4 text-[#3a8c83]" />
            </div>
            <div className="mt-2 font-serif text-2xl font-bold text-[#202840]">
              {stats.averageScore}/100
            </div>
            <span className="font-mono text-[10px] text-[#7f8e92]">Settled baseline</span>
          </div>

          <div className="rounded-2xl border border-[#dedace] bg-[#fbf8ef] p-4">
            <div className="flex items-center justify-between text-[#68767b]">
              <span className="font-mono text-[10px] uppercase tracking-wider">Aura Points</span>
              <Sparkles className="h-4 w-4 text-[#d08b32]" />
            </div>
            <div className="mt-2 font-serif text-2xl font-bold text-[#202840]">
              {auraPoints}
            </div>
            <span className="font-mono text-[10px] text-[#7f8e92]">{stats.totalPointsEarned} earned all-time</span>
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="mt-10">
        {activeTab === 'overview' && (
          <div className="space-y-10">
            {/* Visual Milestones Track */}
            <section className="rounded-2xl border border-[#dedace] bg-[#fbf8ef] p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#7d8c90]">
                    Long-Term Progression
                  </p>
                  <h3 className="mt-1 font-serif text-2xl font-bold text-[#202840]">
                    Study Milestones
                  </h3>
                </div>
                <span className="font-mono text-xs font-semibold text-[#356a64]">
                  {stats.totalSessions} sessions completed
                </span>
              </div>

              {/* Milestone Progress Bar & Nodes */}
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {MILESTONES.map((m) => {
                  const isUnlocked = stats.totalSessions >= m.target;
                  return (
                    <div
                      key={m.target}
                      className={`relative flex items-start gap-3.5 rounded-2xl border p-4.5 transition-all ${
                        isUnlocked
                          ? 'border-[#b8d9d2] bg-[#f1f8f6]'
                          : 'border-[#dedace] bg-[#f7f4ec] opacity-70'
                      }`}
                    >
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#fbf8ef] text-2xl shadow-sm">
                        {m.icon}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-serif text-base font-bold text-[#202840]">
                            {m.label}
                          </h4>
                          {isUnlocked ? (
                            <span className="flex items-center gap-1 font-mono text-[10px] font-bold text-[#356a64]">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Unlocked
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 font-mono text-[10px] text-[#869599]">
                              <Lock className="h-3 w-3" />
                              {m.target - stats.totalSessions} to go
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-xs text-[#5e6d71] leading-relaxed">
                          {m.desc}
                        </p>

                        <div className="mt-3 flex items-center gap-2">
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#dedace]">
                            <div
                              className="h-full rounded-full bg-[#3a8c83]"
                              style={{
                                width: `${Math.min(100, (stats.totalSessions / m.target) * 100)}%`,
                              }}
                            />
                          </div>
                          <span className="font-mono text-[9px] font-bold text-[#6d7c80]">
                            {Math.min(m.target, stats.totalSessions)}/{m.target}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Aura Garden Sanctuary Progress */}
            <section className="rounded-2xl border border-[#dedace] bg-[#fbf8ef] p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#7d8c90]">
                    Sanctuary Arboreta
                  </p>
                  <h3 className="mt-1 font-serif text-2xl font-bold text-[#202840]">
                    Planted Trees ({trees.length})
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onGoToBloom}
                    className="flex items-center gap-1.5 rounded-xl border border-[#b8d9d2] bg-[#e7f2ee] px-3.5 py-2 text-xs font-bold text-[#356a64] hover:bg-[#d9ede6]"
                  >
                    <Trees className="h-3.5 w-3.5" />
                    Visit AuraBloom
                  </button>
                  <button
                    type="button"
                    onClick={onGoToStore}
                    className="flex items-center gap-1.5 rounded-xl border border-[#dedace] bg-[#fbf8ef] px-3.5 py-2 text-xs font-semibold text-[#576468] hover:bg-[#ece6d7]"
                  >
                    Buy Trees in Store
                  </button>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {trees.map((tree) => (
                  <div
                    key={tree.id}
                    className="flex flex-col justify-between rounded-2xl border border-[#dedace] bg-[#f8f5ec] p-4.5"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-[#e8f3f0] px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-[#356a64]">
                          {tree.stage}
                        </span>
                        <span className="font-mono text-[10px] text-[#7d8c90]">
                          Planted {tree.plantedAt}
                        </span>
                      </div>

                      <h4 className="mt-3 font-serif text-lg font-bold text-[#202840]">
                        {tree.name}
                      </h4>
                      <p className="mt-0.5 text-xs text-[#5e6d71]">
                        Species: {tree.species} · Absorbed {tree.growthMinutes} focus minutes
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#dedace] flex items-center justify-between font-mono text-[10px] text-[#6d7c80]">
                      <span>Growth Progress</span>
                      <strong className="text-[#356a64]">
                        {tree.stage === 'Flourishing Tree' ? 'Full Bloom 🌸' : 'Growing 🌿'}
                      </strong>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl font-bold text-[#202840]">
                Logged Mindful Sessions
              </h3>
              <span className="font-mono text-xs text-[#707f83]">
                {sessions.length} total logged sessions
              </span>
            </div>

            <div className="grid gap-3.5">
              {sessions.map((sess) => (
                <div
                  key={sess.id}
                  className="flex flex-col justify-between gap-4 rounded-2xl border border-[#dedace] bg-[#fbf8ef] p-4.5 sm:flex-row sm:items-center shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#e7f2ee] text-[#356a64]">
                      <Calendar className="h-5 w-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif text-base font-bold text-[#202840]">
                          {sess.date}
                        </h4>
                        <span className="rounded-full bg-[#f2efe4] px-2 py-0.5 font-mono text-[9px] text-[#667478]">
                          {sess.withCamera ? 'Camera cues' : 'Camera-free'}
                        </span>
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-3 font-mono text-[11px] text-[#69787c]">
                        <span>Duration: <strong>{formatTime(sess.durationSeconds)}</strong></span>
                        <span>·</span>
                        <span>Avg Load: <strong>{sess.avgScore}/100</strong></span>
                        <span>·</span>
                        <span>Resets: <strong>{sess.resetsCount}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center">
                    <div className="text-right">
                      <div className="font-serif text-base font-bold text-[#356a64]">
                        +{sess.pointsEarned} Aura Points
                      </div>
                      <div className="font-mono text-[10px] text-[#8e6129]">
                        +{sess.xpEarned} Buddy XP
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className={`flex flex-col justify-between rounded-2xl border p-5 transition-all ${
                  ach.unlocked
                    ? 'border-[#b8d9d2] bg-[#fbf8ef] shadow-sm'
                    : 'border-[#dedace] bg-[#f7f4ec] opacity-75'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div
                      className={`grid h-10 w-10 place-items-center rounded-xl ${
                        ach.unlocked ? 'bg-[#e7f2ee] text-[#356a64]' : 'bg-[#dedace] text-[#849296]'
                      }`}
                    >
                      <Award className="h-5 w-5" />
                    </div>

                    {ach.unlocked ? (
                      <span className="flex items-center gap-1 font-mono text-[10px] font-bold text-[#356a64]">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Achieved
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 font-mono text-[10px] text-[#849296]">
                        <Lock className="h-3 w-3" />
                        Locked
                      </span>
                    )}
                  </div>

                  <h4 className="mt-4 font-serif text-lg font-bold text-[#202840]">
                    {ach.title}
                  </h4>

                  <p className="mt-1 text-xs text-[#5e6d71] leading-relaxed">
                    {ach.description}
                  </p>
                </div>

                <div className="mt-5 border-t border-[#dedace] pt-3">
                  {ach.unlocked ? (
                    <span className="font-mono text-[10px] text-[#356a64]">
                      Unlocked {ach.unlockedAt}
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#dedace]">
                        <div
                          className="h-full rounded-full bg-[#3a8c83]"
                          style={{ width: `${(ach.progress / ach.maxProgress) * 100}%` }}
                        />
                      </div>
                      <span className="font-mono text-[9px] font-bold text-[#6d7c80]">
                        {ach.progress}/{ach.maxProgress}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
