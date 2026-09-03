import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sprout, Droplets, Sparkles, Heart, Info } from 'lucide-react';
import { AuraState } from '../types';
import { getBloomStage, AURA_STATES } from '../data/storeCatalog';
import { soundEngine } from '../utils/audio';

interface AuraBloomCardProps {
  elapsedSeconds: number;
  dewBalance: number;
  currentAuraState: AuraState;
  onNourish: (cost: number) => void;
  onOpenFullBloom: () => void;
}

const MINDFUL_QUOTES = [
  'Deep work grows quietly, like roots beneath the earth.',
  'Your mind is an ecosystem. Give it sunlight and gentle rest.',
  'Patience is the fertile soil where true understanding blossoms.',
  'Each steady breath feeds your cognitive clarity.',
];

export default function AuraBloomCard({
  elapsedSeconds,
  dewBalance,
  currentAuraState,
  onNourish,
  onOpenFullBloom,
}: AuraBloomCardProps) {
  const [reflection, setReflection] = useState<string | null>(null);
  const [nourishAnimation, setNourishAnimation] = useState(false);

  const focusMinutes = Math.floor(elapsedSeconds / 60);
  const { currentStage, nextStage, progress } = getBloomStage(focusMinutes);
  const auraConfig = AURA_STATES[currentAuraState];

  const handleNourish = () => {
    if (dewBalance < 2) return;
    onNourish(2);
    soundEngine.playDewEarnedTone();
    setNourishAnimation(true);
    setTimeout(() => setNourishAnimation(false), 1600);
  };

  const handlePetalClick = () => {
    const randomQuote = MINDFUL_QUOTES[Math.floor(Math.random() * MINDFUL_QUOTES.length)];
    setReflection(randomQuote);
    setTimeout(() => setReflection(null), 5000);
  };

  return (
    <div
      className="relative overflow-hidden rounded-[24px] border border-[#ded9cb] bg-[#fbf8ef] p-5 shadow-[0_4px_24px_rgba(32,40,64,0.03)]"
      data-testid="card-aurabloom"
    >
      {/* Subtle ambient botanical glow */}
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full blur-2xl transition-colors duration-1000"
        style={{ backgroundColor: `${currentStage.bloomColor}22` }}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#e8f2ee] text-[#3a8c83]">
            <Sprout className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#202840]">AuraBloom Companion</h3>
            <p className="text-[11px] text-[#718084]">Living focus plant · Level {currentStage.level}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenFullBloom}
          className="flex items-center gap-1 rounded-lg border border-[#dedace] bg-[#f8f5eb] px-2.5 py-1 text-[10px] font-semibold text-[#546267] hover:bg-[#ede8db]"
          title="Open AuraBloom Sanctuary"
        >
          <Info className="h-3 w-3" />
          <span>Sanctuary</span>
        </button>
      </div>

      {/* Visual Plant Stage + Petal Artwork */}
      <div className="relative mt-4 flex items-center justify-center py-2">
        <div
          onClick={handlePetalClick}
          className="group relative cursor-pointer"
          title="Click your AuraBloom for mindful reflection"
        >
          {/* Water droplet shower effect */}
          <AnimatePresence>
            {nourishAnimation && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.8 }}
                animate={{ opacity: 1, y: 10, scale: 1.1 }}
                exit={{ opacity: 0, y: 25 }}
                transition={{ duration: 1.2 }}
                className="pointer-events-none absolute -top-4 left-1/2 -translate-x-1/2 flex gap-1 z-20 text-[#3a8c83]"
              >
                <Droplets className="h-5 w-5 animate-bounce fill-[#3a8c83]" />
                <Sparkles className="h-4 w-4 text-[#d08b32]" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* SVG Botanical Flower / Sprout with Dynamic Petals */}
          <motion.svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            className="overflow-visible"
            animate={{
              rotate: [-1.5, 1.5, -1.5],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {/* Soil / Pot Base */}
            <ellipse cx="60" cy="100" rx="32" ry="7" fill="#d9d2c1" />
            <path
              d="M34 98 L40 114 C41 116 79 116 80 114 L86 98 Z"
              fill="#c4bbaa"
            />
            <ellipse cx="60" cy="98" rx="26" ry="4" fill="#a49987" />

            {/* Stem */}
            <path
              d="M60 98 Q58 75 60 55"
              stroke="#558c7e"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />

            {/* Leaves (Sprout / Seedling) */}
            <path
              d="M59 75 Q42 70 40 58 Q52 64 59 72"
              fill="#74aa9a"
              className="transition-colors duration-700"
            />
            {currentStage.level >= 2 && (
              <path
                d="M61 68 Q78 62 80 50 Q68 56 61 65"
                fill="#619989"
                className="transition-colors duration-700"
              />
            )}

            {/* Floral Petals radiating based on stage */}
            {currentStage.level >= 3 && (
              <g className="transition-all duration-1000" transform="translate(60, 50)">
                {Array.from({ length: currentStage.petalCount }).map((_, i) => {
                  const angle = (i * 360) / currentStage.petalCount;
                  return (
                    <motion.path
                      key={i}
                      d="M0 0 C-9 -14 -9 -28 0 -34 C9 -28 9 -14 0 0"
                      transform={`rotate(${angle})`}
                      fill={currentStage.bloomColor}
                      opacity={0.88}
                      className="transition-transform group-hover:scale-105"
                    />
                  );
                })}
              </g>
            )}

            {/* Flower Center Core / Stamen */}
            <circle
              cx="60"
              cy="50"
              r={currentStage.level >= 3 ? 8 : 5}
              fill={auraConfig.color}
              className="transition-colors duration-700 shadow-sm"
            />
            <circle cx="60" cy="50" r={currentStage.level >= 3 ? 4 : 2.5} fill="#fbf8ef" />
          </motion.svg>
        </div>

        {/* Growth Stats Info */}
        <div className="ml-4 flex-1">
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-base font-bold text-[#202840]">
              {currentStage.name}
            </span>
            <span className="font-mono text-[10px] font-bold text-[#3a8c83]">
              Lvl {currentStage.level}/5
            </span>
          </div>

          <p className="mt-1 text-[11px] leading-snug text-[#627175]">
            {currentStage.description}
          </p>

          {/* Growth progress bar */}
          <div className="mt-3">
            <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-wider text-[#819094]">
              <span>Stage Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[#e8e3d5]">
              <motion.div
                className="h-full rounded-full transition-all duration-500"
                style={{ backgroundColor: currentStage.bloomColor }}
                animate={{ width: `${progress}%` }}
              />
            </div>
            {nextStage && (
              <p className="mt-1 text-[9px] text-[#869599]">
                Next stage at {nextStage.minMinutes}m ({Math.max(0, nextStage.minMinutes - focusMinutes)}m left)
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Mindful reflection bubble on click */}
      <AnimatePresence>
        {reflection && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mt-3 rounded-xl border border-[#d6e7e2] bg-[#f0f7f5] px-3 py-2 text-[11px] italic text-[#2e5952]"
          >
            "{reflection}"
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action footer: Nourish with Dew */}
      <div className="mt-4 flex items-center justify-between border-t border-[#dedace] pt-3">
        <div className="flex items-center gap-1.5 text-[11px] text-[#637276]">
          <Heart className="h-3.5 w-3.5 text-[#d08b32]" />
          <span>Perk: <strong>{currentStage.perk}</strong></span>
        </div>

        <button
          type="button"
          onClick={handleNourish}
          disabled={dewBalance < 2}
          className="flex items-center gap-1.5 rounded-xl border border-[#c3dfd7] bg-[#e7f2ee] px-3 py-1.5 text-[11px] font-bold text-[#356a64] transition-all hover:bg-[#d8ece6] disabled:opacity-40"
          title="Nourish your bloom with 2 Dew"
        >
          <Droplets className="h-3 w-3 fill-current" />
          <span>Nourish</span>
          <span className="font-mono text-[9px] opacity-75">(2 Dew)</span>
        </button>
      </div>
    </div>
  );
}
