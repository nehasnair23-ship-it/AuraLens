import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Play,
  RotateCcw,
  CheckCircle2,
  X,
  Wind,
  ShoppingBag,
  Trees,
  Award,
  Zap,
} from 'lucide-react';
import { AuraState } from '../types';

interface DemoStep {
  id: string;
  title: string;
  subtitle: string;
  stageName: string;
  description: string;
  stateToSimulate: AuraState;
  scoreToSimulate: number;
  actionHint: string;
}

const DEMO_STEPS: DemoStep[] = [
  {
    id: 'stable',
    title: '1. Stable Rhythm',
    subtitle: 'Calm Cognitive Baseline',
    stageName: 'Stable',
    description: 'AuraLens monitors observable physical movement and presence changes. In this steady state, the prototype load sits below 40 with a soft teal aura.',
    stateToSimulate: 'Stable',
    scoreToSimulate: 24,
    actionHint: 'Notice the calm companion and peaceful breathing pulse.',
  },
  {
    id: 'rising',
    title: '2. Rising Study Load',
    subtitle: 'Increasing Processing Intensity',
    stageName: 'Rising',
    description: 'As cognitive demands increase or fidgeting intensifies, the indicator gently shifts to warm amber (40-69). AuraBuddy becomes attentive.',
    stateToSimulate: 'Rising',
    scoreToSimulate: 54,
    actionHint: 'Notice the subtle shift in color and attentive companion posture.',
  },
  {
    id: 'elevated',
    title: '3. Elevated State',
    subtitle: 'Noticeable Load',
    stageName: 'Elevated',
    description: 'When continuous intensity persists above 70, AuraLens signals that a pause is welcome. No scolding, simply caring awareness.',
    stateToSimulate: 'Elevated',
    scoreToSimulate: 78,
    actionHint: 'Aura Shift intervention prepares to offer a 20-second pause.',
  },
  {
    id: 'shift',
    title: '4. Signature Aura Shift',
    subtitle: 'Mindful 20s Intervention',
    stageName: 'Intervention',
    description: 'A full-screen gentle breathing overlay initiates when elevated load is sustained. Harmonized inhale/exhale tones guide your reset.',
    stateToSimulate: 'Elevated',
    scoreToSimulate: 75,
    actionHint: 'Can trigger the automatic 20-second breathing overlay.',
  },
  {
    id: 'reset',
    title: '5. Guided Breathing Reset',
    subtitle: '4-4-4-4 Box Breathing',
    stageName: 'Manual Reset',
    description: 'Users can initiate a manual 30-second breathing reset anytime, gaining immediate relief and +6 bonus Aura Points.',
    stateToSimulate: 'Stable',
    scoreToSimulate: 22,
    actionHint: 'Interactive timer with harmonic sound frequencies.',
  },
  {
    id: 'complete',
    title: '6. Session Completion & Points',
    subtitle: 'Earn Aura Points & Buddy XP',
    stageName: 'Reward',
    description: 'Finishing a study session calculates earned Aura Points and Buddy XP. Points cannot be double-awarded, and balances never go negative.',
    stateToSimulate: 'Stable',
    scoreToSimulate: 20,
    actionHint: 'Awards +25 Aura Points & +45 Companion XP.',
  },
  {
    id: 'today_vs_you',
    title: '7. "Today vs You" Summary',
    subtitle: 'Compassionate Progress Comparison',
    stageName: 'Reflection',
    description: 'Provides neutral, non-shaming context comparing today’s session with your past average, celebrating consistency.',
    stateToSimulate: 'Stable',
    scoreToSimulate: 20,
    actionHint: 'Neutral, uplifting comparative metrics.',
  },
  {
    id: 'store',
    title: '8. Aura Store & Virtual Trees',
    subtitle: 'Spend Points On Virtual Plants & Accessories',
    stageName: 'Sanctuary Store',
    description: 'Spend earned Aura Points on virtual trees, garden decor, and buddy accessories. No real money, zero paywalls.',
    stateToSimulate: 'Stable',
    scoreToSimulate: 20,
    actionHint: 'Purchase a Bonsai Pine or Cherry Blossom with points.',
  },
  {
    id: 'bloom',
    title: '9. AuraBloom Sanctuary',
    subtitle: 'Virtual Tree Planting & Growth',
    stageName: 'Sanctuary Growth',
    description: 'Your focus minutes physically nurture planted virtual trees through 5 botanical growth stages from Seed to Flourishing Tree.',
    stateToSimulate: 'Stable',
    scoreToSimulate: 20,
    actionHint: 'Clear disclaimer: Virtual trees do not plant real-world trees.',
  },
];

interface DemoTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerState: (state: AuraState, score: number) => void;
  onTriggerAuraShift: () => void;
  onTriggerReset: () => void;
  onTriggerSessionComplete: () => void;
  onGoToStore: () => void;
  onGoToBloom: () => void;
}

export default function DemoTourModal({
  isOpen,
  onClose,
  onTriggerState,
  onTriggerAuraShift,
  onTriggerReset,
  onTriggerSessionComplete,
  onGoToStore,
  onGoToBloom,
}: DemoTourModalProps) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  if (!isOpen) return null;

  const currentStep = DEMO_STEPS[currentStepIdx];

  const handleApplyStep = (idx: number) => {
    setCurrentStepIdx(idx);
    const step = DEMO_STEPS[idx];
    onTriggerState(step.stateToSimulate, step.scoreToSimulate);
  };

  const handleNext = () => {
    if (currentStepIdx < DEMO_STEPS.length - 1) {
      handleApplyStep(currentStepIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      handleApplyStep(currentStepIdx - 1);
    }
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#141c3080] p-4 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        data-testid="modal-demo-tour"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl rounded-[28px] border border-[#dcd8cb] bg-[#fbf8ef] p-6 sm:p-8 shadow-2xl"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 grid h-8 w-8 place-items-center rounded-full bg-[#f0ebd9] text-[#606e73] hover:bg-[#e4ddc8]"
            data-testid="button-close-demo"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Banner Tag */}
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-[#f6e3bf] px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[#915e1c]">
              <Zap className="h-3 w-3 fill-current" />
              Interactive Prototype Demo Mode
            </span>
            <span className="font-mono text-xs text-[#738387]">
              Step {currentStepIdx + 1} of {DEMO_STEPS.length}
            </span>
          </div>

          <h2 className="mt-3 font-serif text-2xl sm:text-3xl font-bold text-[#202840]">
            {currentStep.title}
          </h2>
          <p className="font-mono text-xs font-semibold text-[#356a64]">
            {currentStep.subtitle}
          </p>

          <p className="mt-3 text-sm leading-relaxed text-[#59666a]">
            {currentStep.description}
          </p>

          {/* Quick interactive test buttons */}
          <div className="mt-6 rounded-2xl border border-[#dedace] bg-[#f5f1e4] p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#637276]">
                Simulation Actions for this stage:
              </span>
              <span className="font-mono text-xs font-bold text-[#356a64]">
                Score: {currentStep.scoreToSimulate}/100
              </span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => onTriggerState(currentStep.stateToSimulate, currentStep.scoreToSimulate)}
                className="flex items-center gap-1.5 rounded-xl bg-[#202840] px-3.5 py-2 text-xs font-bold text-[#fbf8ef] hover:bg-[#2f3b5c]"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                Apply {currentStep.stageName} State
              </button>

              {currentStep.id === 'shift' && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onTriggerAuraShift();
                  }}
                  className="flex items-center gap-1.5 rounded-xl border border-[#c96758] bg-[#f9e9e6] px-3.5 py-2 text-xs font-bold text-[#963728] hover:bg-[#f4d4ce]"
                >
                  <Wind className="h-3.5 w-3.5" />
                  Trigger 20s Aura Shift
                </button>
              )}

              {currentStep.id === 'reset' && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onTriggerReset();
                  }}
                  className="flex items-center gap-1.5 rounded-xl border border-[#3a8c83] bg-[#e7f2ee] px-3.5 py-2 text-xs font-bold text-[#356a64] hover:bg-[#d9ece5]"
                >
                  <Wind className="h-3.5 w-3.5" />
                  Open Guided Reset
                </button>
              )}

              {(currentStep.id === 'complete' || currentStep.id === 'today_vs_you') && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onTriggerSessionComplete();
                  }}
                  className="flex items-center gap-1.5 rounded-xl border border-[#d08b32] bg-[#fcf4e8] px-3.5 py-2 text-xs font-bold text-[#8e6129] hover:bg-[#f6e5cd]"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Show Session Complete + Today vs You
                </button>
              )}

              {currentStep.id === 'store' && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onGoToStore();
                  }}
                  className="flex items-center gap-1.5 rounded-xl border border-[#dedace] bg-[#fbf8ef] px-3.5 py-2 text-xs font-bold text-[#202840] hover:bg-[#ece6d7]"
                >
                  <ShoppingBag className="h-3.5 w-3.5 text-[#3a8c83]" />
                  Open Aura Store & Trees
                </button>
              )}

              {currentStep.id === 'bloom' && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onGoToBloom();
                  }}
                  className="flex items-center gap-1.5 rounded-xl border border-[#3a8c83] bg-[#e7f2ee] px-3.5 py-2 text-xs font-bold text-[#356a64] hover:bg-[#d8ede5]"
                >
                  <Trees className="h-3.5 w-3.5" />
                  Open AuraBloom Sanctuary
                </button>
              )}
            </div>

            <p className="mt-2.5 text-[11px] text-[#69797d]">
              💡 {currentStep.actionHint}
            </p>
          </div>

          {/* Stepper navigation bar */}
          <div className="mt-6 flex items-center justify-between border-t border-[#dedace] pt-4">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStepIdx === 0}
              className={`flex items-center gap-1 rounded-xl px-3.5 py-2 text-xs font-semibold ${
                currentStepIdx === 0
                  ? 'text-[#a2afb2] cursor-not-allowed'
                  : 'text-[#505f63] hover:bg-[#ece6d7]'
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>

            {/* Step circles */}
            <div className="flex items-center gap-1.5">
              {DEMO_STEPS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleApplyStep(i)}
                  className={`h-2.5 rounded-full transition-all ${
                    currentStepIdx === i
                      ? 'w-6 bg-[#3a8c83]'
                      : 'w-2.5 bg-[#dedace] hover:bg-[#b0bcbe]'
                  }`}
                  aria-label={`Jump to step ${i + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleNext}
              disabled={currentStepIdx === DEMO_STEPS.length - 1}
              className={`flex items-center gap-1 rounded-xl px-3.5 py-2 text-xs font-bold ${
                currentStepIdx === DEMO_STEPS.length - 1
                  ? 'text-[#a2afb2] cursor-not-allowed'
                  : 'bg-[#202840] text-[#fbf8ef] hover:bg-[#303c5d]'
              }`}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Prototype Disclaimer Banner */}
          <div className="mt-4 text-center">
            <span className="font-mono text-[10px] text-[#7d8c90]">
              Experimental prototype. Not a medical diagnostic system.
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
