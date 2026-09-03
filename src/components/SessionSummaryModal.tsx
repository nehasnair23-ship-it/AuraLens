import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Award,
  Clock,
  Activity,
  Wind,
  CheckCircle2,
  ArrowRight,
  ShoppingBag,
  Trees,
  TrendingUp,
  X,
} from 'lucide-react';
import { SessionRecord, AuraBuddyProfile, TodayVsYouComparison } from '../types';
import { formatTime } from '../data/storeCatalog';
import AuraCompanionAvatar from './AuraCompanionAvatar';

interface SessionSummaryModalProps {
  isOpen: boolean;
  session: SessionRecord | null;
  buddy: AuraBuddyProfile;
  comparison: TodayVsYouComparison | null;
  onClose: () => void;
  onGoToStore: () => void;
  onGoToBloom: () => void;
  onGoToJourney: () => void;
}

export default function SessionSummaryModal({
  isOpen,
  session,
  buddy,
  comparison,
  onClose,
  onGoToStore,
  onGoToBloom,
  onGoToJourney,
}: SessionSummaryModalProps) {
  if (!isOpen || !session) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#141c3080] p-4 backdrop-blur-sm overflow-y-auto"
        role="dialog"
        aria-modal="true"
        data-testid="modal-session-summary"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative my-8 w-full max-w-xl rounded-[28px] border border-[#dcd8cb] bg-[#fbf8ef] p-6 sm:p-8 shadow-2xl"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 grid h-8 w-8 place-items-center rounded-full bg-[#f0ebd9] text-[#606e73] hover:bg-[#e4ddc8]"
            data-testid="button-close-summary"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Header & Celebration */}
          <div className="text-center">
            <div className="mx-auto mb-3 flex justify-center">
              <AuraCompanionAvatar
                species={buddy.species}
                reaction="celebrating"
                size="lg"
                equippedAccessory={buddy.equippedAccessory}
                equippedToy={buddy.equippedToy}
              />
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-[#dedace] bg-[#f2efe4] px-3.5 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-[#356a64]">
              <Sparkles className="h-3.5 w-3.5 text-[#e0984a]" />
              <span>Session Complete</span>
            </div>

            <h2 className="mt-2 font-serif text-[32px] sm:text-[38px] font-bold text-[#202840] tracking-tight">
              Focus Nourished ✨
            </h2>

            <p className="mt-1 text-sm text-[#5a676b]">
              {buddy.name} is proud of the patient rhythm you brought to your desk today.
            </p>
          </div>

          {/* Points & XP Reward Badges */}
          <div className="mt-6 grid grid-cols-2 gap-3.5">
            {/* Aura Points Earned Card */}
            <div className="flex flex-col items-center rounded-2xl border border-[#b8d9d2] bg-[#e8f3f0] p-4 text-center">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#356a64]">
                Aura Points Earned
              </span>
              <div className="mt-1 flex items-center gap-1.5 font-serif text-3xl font-bold text-[#25524d]">
                <Sparkles className="h-6 w-6 text-[#d08b32] fill-[#f6e3bf]" />
                <span>+{session.pointsEarned}</span>
              </div>
              <span className="mt-0.5 text-[11px] text-[#4d7b74]">Available to spend in Store</span>
            </div>

            {/* Buddy XP Earned Card */}
            <div className="flex flex-col items-center rounded-2xl border border-[#ecd9be] bg-[#fcf4e8] p-4 text-center">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#8e6129]">
                Buddy XP Earned
              </span>
              <div className="mt-1 flex items-center gap-1.5 font-serif text-3xl font-bold text-[#6d4615]">
                <Award className="h-6 w-6 text-[#d08b32]" />
                <span>+{session.xpEarned} XP</span>
              </div>
              <span className="mt-0.5 text-[11px] text-[#8e6129]">
                Level {buddy.level} ({buddy.xp}/{buddy.maxXp} XP)
              </span>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="mt-5 grid grid-cols-4 divide-x divide-[#dedace] rounded-2xl border border-[#dedace] bg-[#f5f1e4] py-3 text-center">
            <div className="px-2">
              <div className="flex items-center justify-center gap-1 text-[#65767b]">
                <Clock className="h-3 w-3" />
                <span className="font-mono text-[9px] uppercase tracking-wider">Duration</span>
              </div>
              <strong className="mt-0.5 block font-mono text-sm font-bold text-[#202840]">
                {formatTime(session.durationSeconds)}
              </strong>
            </div>

            <div className="px-2">
              <div className="flex items-center justify-center gap-1 text-[#65767b]">
                <Activity className="h-3 w-3" />
                <span className="font-mono text-[9px] uppercase tracking-wider">Avg Load</span>
              </div>
              <strong className="mt-0.5 block font-mono text-sm font-bold text-[#202840]">
                {session.avgScore}/100
              </strong>
            </div>

            <div className="px-2">
              <div className="flex items-center justify-center gap-1 text-[#65767b]">
                <TrendingUp className="h-3 w-3" />
                <span className="font-mono text-[9px] uppercase tracking-wider">Peaks</span>
              </div>
              <strong className="mt-0.5 block font-mono text-sm font-bold text-[#202840]">
                {session.elevatedPeriods}
              </strong>
            </div>

            <div className="px-2">
              <div className="flex items-center justify-center gap-1 text-[#65767b]">
                <Wind className="h-3 w-3" />
                <span className="font-mono text-[9px] uppercase tracking-wider">Resets</span>
              </div>
              <strong className="mt-0.5 block font-mono text-sm font-bold text-[#202840]">
                {session.resetsCount}
              </strong>
            </div>
          </div>

          {/* "Today vs You" Compassionate Comparative Breakdown */}
          {comparison && (
            <div className="mt-6 rounded-2xl border border-[#cfdacd] bg-[#edf3ec] p-4 sm:p-5">
              <div className="flex items-center gap-2">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-[#356a64] text-[#fbf8ef]">
                  <CheckCircle2 className="h-4 w-4" />
                </span>
                <h3 className="font-serif text-base font-bold text-[#224843]">
                  Today vs You
                </h3>
              </div>

              <p className="mt-2 text-xs font-semibold leading-relaxed text-[#2d5852]">
                "{comparison.summarySentence}"
              </p>

              <div className="mt-3 space-y-1.5 border-t border-[#d5e0d4] pt-3 text-[12px] text-[#42645f]">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-[#2d5852]">· Rhythm:</span>
                  <span>{comparison.durationComparison}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-[#2d5852]">· Intensity:</span>
                  <span>{comparison.scoreComparison}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-[#2d5852]">· Attention spikes:</span>
                  <span>{comparison.elevatedComparison}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-[#2d5852]">· Supportive care:</span>
                  <span>{comparison.resetsComparison}</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Destination Buttons */}
          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                onClose();
                onGoToStore();
              }}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#202840] px-4 py-3 text-xs font-bold text-[#fbf8ef] shadow-sm hover:bg-[#2e3a5a] transition-colors"
              data-testid="button-summary-store"
            >
              <ShoppingBag className="h-4 w-4 text-[#f5c65d]" />
              <span>Spend Aura Points</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onGoToBloom();
              }}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#b8d9d2] bg-[#e7f2ee] px-4 py-3 text-xs font-bold text-[#356a64] hover:bg-[#d8ece5] transition-colors"
              data-testid="button-summary-bloom"
            >
              <Trees className="h-4 w-4" />
              <span>AuraBloom Sanctuary</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onGoToJourney();
              }}
              className="rounded-xl border border-[#dedace] bg-[#f5f1e4] px-4 py-3 text-xs font-semibold text-[#5a676b] hover:bg-[#ebe5d6] transition-colors"
              data-testid="button-summary-journey"
            >
              Aura Journey
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
