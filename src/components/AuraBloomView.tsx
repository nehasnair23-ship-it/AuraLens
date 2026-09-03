import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sprout,
  Droplets,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Heart,
  Wind,
  Sun,
  ShieldCheck,
} from 'lucide-react';
import { AuraState, PlantedTree } from '../types';
import { BLOOM_STAGES, getBloomStage, AURA_STATES } from '../data/storeCatalog';
import { soundEngine } from '../utils/audio';
import { Trees as TreesIcon, TreePine, Info } from 'lucide-react';

interface AuraBloomViewProps {
  elapsedSeconds: number;
  dewBalance: number;
  currentAuraState: AuraState;
  trees?: PlantedTree[];
  onNourish: (cost: number) => void;
  onReturnToSession: () => void;
  onGoToStore: () => void;
}

export default function AuraBloomView({
  elapsedSeconds,
  dewBalance,
  currentAuraState,
  trees = [],
  onNourish,
  onReturnToSession,
  onGoToStore,
}: AuraBloomViewProps) {
  const [reflectionText, setReflectionText] = useState<string>(
    'AuraBloom flourishes when your focus is steady and pauses are intentional.'
  );
  const [isWatering, setIsWatering] = useState(false);

  const focusMinutes = Math.floor(elapsedSeconds / 60);
  const { currentStage, nextStage, progress } = getBloomStage(focusMinutes);
  const auraConfig = AURA_STATES[currentAuraState];

  const handleNourish = (amount: number) => {
    if (dewBalance < amount) return;
    onNourish(amount);
    soundEngine.playDewEarnedTone();
    setIsWatering(true);
    setTimeout(() => setIsWatering(false), 2000);
    setReflectionText('AuraBloom received fresh dew. The petals shine with revitalized vitality.');
  };

  const handlePetalTouch = (petalIndex: number) => {
    const reflections = [
      'You are building deep comprehension, layer by layer.',
      'A quiet, patient breath opens fresh neural pathways.',
      'Do not rush understanding; let concepts settle organically.',
      'Your sustained attention is the rarest gift on this desk.',
      'Rest is not lost time; it is where memory solidifies.',
    ];
    setReflectionText(reflections[petalIndex % reflections.length]);
  };

  return (
    <div className="space-y-8" data-testid="view-aurabloom-sanctuary">
      {/* Top Header Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#dedace] pb-5">
        <div>
          <button
            type="button"
            onClick={onReturnToSession}
            className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-[#647478] hover:text-[#202840]"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            Back to Live Session
          </button>
          <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-[#202840] sm:text-4xl">
            AuraBloom <span className="text-[#3a8c83]">Sanctuary</span>
          </h1>
          <p className="mt-1 text-sm text-[#617175]">
            Your living botanical companion that blooms with your focused study minutes and mindful rests.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-full border border-[#dedace] bg-[#fbf8ef] px-3.5 py-1.5 font-mono text-xs font-semibold text-[#3a8c83]">
            <Droplets className="h-3.5 w-3.5 fill-current" />
            <span>{dewBalance} Dew</span>
          </div>

          <button
            type="button"
            onClick={onGoToStore}
            className="rounded-xl border border-[#dedace] bg-[#fbf8ef] px-4 py-2 text-xs font-bold text-[#556468] hover:bg-[#eae5d8]"
          >
            Aura Store & Garden
          </button>
        </div>
      </div>

      {/* Main Showcase Hero Section */}
      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        {/* Living Plant Canvas */}
        <div className="relative overflow-hidden rounded-[28px] border border-[#ded9cb] bg-[#f8f5eb] p-8 shadow-sm flex flex-col items-center justify-center min-h-[420px]">
          {/* Ambient Botanical Glow */}
          <div
            className="pointer-events-none absolute h-72 w-72 rounded-full blur-3xl transition-colors duration-1000"
            style={{ backgroundColor: `${currentStage.bloomColor}25` }}
          />

          {/* Plant Life Stage Pill */}
          <div className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full border border-[#dedace] bg-[#fbf8ef] px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-[#637276]">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: currentStage.bloomColor }}
            />
            Level {currentStage.level} · {currentStage.name}
          </div>

          {/* Plant Aura Reflection Pill */}
          <div className="absolute right-6 top-6 inline-flex items-center gap-1.5 rounded-full border border-[#dedace] bg-[#fbf8ef] px-3 py-1 font-mono text-[10px] text-[#637276]">
            <Sun className="h-3 w-3 text-[#d08b32]" />
            Aura state: <strong style={{ color: auraConfig.color }}>{currentAuraState}</strong>
          </div>

          {/* Water Droplet Shower Animation */}
          <AnimatePresence>
            {isWatering && (
              <motion.div
                initial={{ opacity: 0, y: -40, scale: 0.8 }}
                animate={{ opacity: 1, y: 30, scale: 1.2 }}
                exit={{ opacity: 0, y: 70 }}
                transition={{ duration: 1.5 }}
                className="pointer-events-none absolute top-12 z-20 flex gap-2 text-[#3a8c83]"
              >
                <Droplets className="h-7 w-7 animate-bounce fill-[#3a8c83]" />
                <Sparkles className="h-6 w-6 text-[#d08b32] animate-spin" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Center SVG Animated Botanical Blossom */}
          <motion.div
            className="relative my-6 cursor-pointer"
            animate={{
              rotate: [-1.2, 1.2, -1.2],
              scale: [0.99, 1.02, 0.99],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <svg
              width="240"
              height="240"
              viewBox="0 0 240 240"
              className="overflow-visible"
            >
              {/* Earthen Terracotta Pot */}
              <ellipse cx="120" cy="200" rx="55" ry="12" fill="#cfc7b4" />
              <path
                d="M75 198 L85 228 C87 232 153 232 155 228 L165 198 Z"
                fill="#b8ad96"
              />
              <ellipse cx="120" cy="198" rx="46" ry="7" fill="#8c7e68" />

              {/* Organic Stem */}
              <path
                d="M120 198 Q116 150 120 100"
                stroke="#4a8073"
                strokeWidth="7"
                strokeLinecap="round"
                fill="none"
              />

              {/* Leaves */}
              <path
                d="M118 155 Q85 145 80 122 Q105 132 118 148"
                fill="#619989"
                className="transition-colors duration-700"
              />
              {currentStage.level >= 2 && (
                <path
                  d="M122 140 Q155 130 160 105 Q135 116 122 134"
                  fill="#548b7b"
                  className="transition-colors duration-700"
                />
              )}

              {/* Multilayered Petals */}
              {currentStage.level >= 3 && (
                <g transform="translate(120, 95)" className="transition-all duration-1000">
                  {Array.from({ length: currentStage.petalCount }).map((_, i) => {
                    const angle = (i * 360) / currentStage.petalCount;
                    return (
                      <motion.path
                        key={i}
                        onClick={() => handlePetalTouch(i)}
                        d="M0 0 C-16 -24 -16 -48 0 -58 C16 -48 16 -24 0 0"
                        transform={`rotate(${angle})`}
                        fill={currentStage.bloomColor}
                        opacity={0.9}
                        className="cursor-pointer transition-all hover:opacity-100"
                        whileHover={{ scale: 1.08 }}
                      />
                    );
                  })}
                </g>
              )}

              {/* Central Core Stamen */}
              <circle
                cx="120"
                cy="95"
                r={currentStage.level >= 3 ? 15 : 9}
                fill={auraConfig.color}
                className="transition-colors duration-700 shadow-md"
              />
              <circle cx="120" cy="95" r={currentStage.level >= 3 ? 7 : 4} fill="#fbf8ef" />
            </svg>
          </motion.div>

          {/* Reflection Bubble */}
          <div className="mt-2 w-full max-w-md rounded-2xl border border-[#dbe6e2] bg-[#fbf8ef] p-4 text-center shadow-xs">
            <p className="text-xs italic text-[#405852]">"{reflectionText}"</p>
            <span className="mt-1 block font-mono text-[9px] uppercase tracking-wider text-[#7e938f]">
              Touch petals or water with dew for mindful guidance
            </span>
          </div>

          {/* Nourish Controls */}
          <div className="mt-5 flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleNourish(2)}
              disabled={dewBalance < 2}
              className="flex items-center gap-2 rounded-xl bg-[#3a8c83] px-5 py-2.5 text-xs font-bold text-[#fbf8ef] shadow-sm transition-all hover:bg-[#2d736b] disabled:opacity-40"
            >
              <Droplets className="h-4 w-4 fill-current" />
              Nourish with 2 Dew
            </button>

            <button
              type="button"
              onClick={() => handleNourish(5)}
              disabled={dewBalance < 5}
              className="flex items-center gap-2 rounded-xl border border-[#c3ded6] bg-[#e7f2ee] px-4 py-2.5 text-xs font-bold text-[#356a64] transition-all hover:bg-[#d8eee6] disabled:opacity-40"
            >
              <Sparkles className="h-4 w-4 text-[#d08b32]" />
              Super Nourish (5 Dew)
            </button>
          </div>
        </div>

        {/* Growth Stats & Biological Milestones */}
        <div className="space-y-6">
          {/* Card: Current Vitality & Stage */}
          <div className="rounded-[24px] border border-[#ded9cb] bg-[#fbf8ef] p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#798a8d]">
                Focus Absorption
              </span>
              <span className="font-serif text-lg font-bold text-[#202840]">
                {focusMinutes} min focused
              </span>
            </div>

            {/* Stage Progress Bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs font-semibold text-[#48575c]">
                <span>Stage: {currentStage.name}</span>
                <span>{progress}% towards next</span>
              </div>
              <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-[#e8e4d8]">
                <motion.div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ backgroundColor: currentStage.bloomColor }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
              {nextStage && (
                <p className="mt-2 text-[11px] text-[#78888c]">
                  Level {nextStage.level} ({nextStage.name}) unlocks at {nextStage.minMinutes} minutes of mindful focus.
                </p>
              )}
            </div>

            {/* Active Perk Pill */}
            <div className="mt-5 flex items-center gap-2.5 rounded-xl border border-[#d6e5e0] bg-[#f0f7f4] p-3 text-xs text-[#305a54]">
              <ShieldCheck className="h-4 w-4 shrink-0 text-[#3a8c83]" />
              <div>
                <strong>Active Botanical Perk:</strong> {currentStage.perk}
              </div>
            </div>
          </div>

          {/* Card: The 5 Growth Stages Milestone Path */}
          <div className="rounded-[24px] border border-[#ded9cb] bg-[#fbf8ef] p-6 shadow-xs">
            <h3 className="font-serif text-base font-bold text-[#202840]">
              The 5 Growth Milestones
            </h3>
            <p className="mt-1 text-xs text-[#718084]">
              Each stage deepens AuraBloom's resonance with your focus habits.
            </p>

            <div className="mt-4 space-y-3">
              {BLOOM_STAGES.map((stg) => {
                const isUnlocked = focusMinutes >= stg.minMinutes;
                const isCurrent = currentStage.level === stg.level;

                return (
                  <div
                    key={stg.level}
                    className={`flex items-start gap-3 rounded-xl border p-3 transition-colors ${
                      isCurrent
                        ? 'border-[#3a8c83] bg-[#eef7f4]'
                        : isUnlocked
                        ? 'border-[#dedace] bg-[#f8f5ec]'
                        : 'border-[#eae6d9] bg-[#fdfcfa] opacity-60'
                    }`}
                  >
                    <div className="mt-0.5">
                      {isUnlocked ? (
                        <CheckCircle2 className="h-4 w-4 text-[#3a8c83]" />
                      ) : (
                        <Lock className="h-4 w-4 text-[#aab6b9]" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-baseline justify-between">
                        <h4 className="text-xs font-bold text-[#202840]">
                          Level {stg.level}: {stg.name}
                        </h4>
                        <span className="font-mono text-[10px] text-[#718185]">
                          {stg.minMinutes}m
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-[#637276]">
                        {stg.description}
                      </p>
                      <p className="mt-1 font-mono text-[10px] font-semibold text-[#3a8c83]">
                        ✦ {stg.perk}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Virtual Tree Planting & Arboretum Section */}
      <section className="rounded-[28px] border border-[#ded9cb] bg-[#fbf8ef] p-6 sm:p-8 shadow-xs" data-testid="section-virtual-trees">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#dedace] bg-[#f2efe4] px-3.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#356a64]">
              <TreePine className="h-3.5 w-3.5" />
              <span>Virtual Tree Planting</span>
            </div>
            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-[#202840]">
              Your study time is growing something.
            </h2>
            <p className="mt-1 max-w-xl text-xs sm:text-sm text-[#617175]">
              Every focused session automatically channels restorative vitality into your planted trees. Watch seeds flourish into majestic canopies.
            </p>
          </div>

          <button
            type="button"
            onClick={onGoToStore}
            className="flex items-center gap-2 rounded-xl bg-[#202840] px-4 py-2.5 text-xs font-bold text-[#fbf8ef] hover:bg-[#2e3a5a] transition-colors self-start sm:self-auto"
          >
            <TreesIcon className="h-4 w-4 text-[#f5c65d]" />
            Plant Trees in Store
          </button>
        </div>

        {/* Tree Growth Stages Guide */}
        <div className="mt-6 grid grid-cols-5 gap-2 rounded-2xl border border-[#dedace] bg-[#f5f1e4] p-3 text-center">
          <div>
            <span className="text-xl">🌰</span>
            <div className="mt-1 font-serif text-xs font-bold text-[#202840]">Seed</div>
            <span className="font-mono text-[9px] text-[#718185]">0-9 min</span>
          </div>
          <div>
            <span className="text-xl">🌱</span>
            <div className="mt-1 font-serif text-xs font-bold text-[#202840]">Sprout</div>
            <span className="font-mono text-[9px] text-[#718185]">10-24 min</span>
          </div>
          <div>
            <span className="text-xl">🌿</span>
            <div className="mt-1 font-serif text-xs font-bold text-[#202840]">Young Tree</div>
            <span className="font-mono text-[9px] text-[#718185]">25-44 min</span>
          </div>
          <div>
            <span className="text-xl">🌳</span>
            <div className="mt-1 font-serif text-xs font-bold text-[#202840]">Growing Tree</div>
            <span className="font-mono text-[9px] text-[#718185]">45-74 min</span>
          </div>
          <div>
            <span className="text-xl">🌸</span>
            <div className="mt-1 font-serif text-xs font-bold text-[#202840]">Flourishing</div>
            <span className="font-mono text-[9px] text-[#718185]">75+ min</span>
          </div>
        </div>

        {/* Planted Trees Grid */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trees.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-dashed border-[#dedace] bg-[#fdfcfa] p-8 text-center text-xs text-[#718084]">
              No virtual trees planted yet. Visit the Aura Store to choose a Bonsai Pine or Cherry Blossom!
            </div>
          ) : (
            trees.map((tree) => {
              const iconStage =
                tree.stage === 'Seed'
                  ? '🌰'
                  : tree.stage === 'Sprout'
                  ? '🌱'
                  : tree.stage === 'Young Tree'
                  ? '🌿'
                  : tree.stage === 'Growing Tree'
                  ? '🌳'
                  : '🌸';

              return (
                <div
                  key={tree.id}
                  className="flex flex-col justify-between rounded-2xl border border-[#dedace] bg-[#fbf8ef] p-4.5 shadow-xs"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-3xl">{iconStage}</span>
                    <span className="rounded-full bg-[#e7f2ee] px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-[#356a64]">
                      {tree.stage}
                    </span>
                  </div>

                  <div className="mt-3">
                    <h4 className="font-serif text-lg font-bold text-[#202840]">
                      {tree.name}
                    </h4>
                    <p className="mt-0.5 text-xs text-[#637276]">
                      {tree.species} · Absorbed {tree.growthMinutes} focused study minutes
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#dedace] flex items-center justify-between text-[11px] font-mono text-[#718185]">
                    <span>Planted: {tree.plantedAt}</span>
                    <span className="font-bold text-[#356a64]">Vitality 100%</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Explicit Virtual Garden Disclaimer */}
        <div className="mt-6 flex items-center gap-2.5 rounded-xl border border-[#d8d5c9] bg-[#f5f1e4] p-3 text-xs text-[#637276]">
          <Info className="h-4 w-4 shrink-0 text-[#3a8c83]" />
          <span>
            <strong>Responsible AI Notice:</strong> This is an in-app virtual study garden. Purchasing or cultivating a virtual tree nurtures your digital wellness sanctuary and does not plant a physical real-world tree.
          </span>
        </div>
      </section>
    </div>
  );
}
