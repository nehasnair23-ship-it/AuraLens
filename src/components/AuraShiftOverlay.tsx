import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, ArrowRight, X } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { formatTime } from '../data/storeCatalog';

interface AuraShiftOverlayProps {
  isOpen: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export default function AuraShiftOverlay({
  isOpen,
  onComplete,
  onSkip,
}: AuraShiftOverlayProps) {
  const [secondsRemaining, setSecondsRemaining] = useState(20);
  const [phase, setPhase] = useState<'Breathe in' | 'Breathe out'>('Breathe in');
  const [isMuted, setIsMuted] = useState(false);
  const [isDone, setIsDone] = useState(false);

  // Initialize and reset cycle when opened
  useEffect(() => {
    if (!isOpen) {
      setSecondsRemaining(20);
      setPhase('Breathe in');
      setIsDone(false);
      return;
    }

    soundEngine.playInhaleTone();

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          setIsDone(true);
          soundEngine.playCompletionChime();
          clearInterval(interval);
          return 0;
        }
        const next = prev - 1;
        // 4-second breath cycle
        const cycle = next % 8;
        if (cycle >= 4 && phase !== 'Breathe out') {
          setPhase('Breathe out');
          soundEngine.playExhaleTone();
        } else if (cycle < 4 && phase !== 'Breathe in') {
          setPhase('Breathe in');
          soundEngine.playInhaleTone();
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, phase]);

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundEngine.isMuted = next;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d1424b3] p-4 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="aura-shift-title"
        data-testid="overlay-aura-shift"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 8 }}
          transition={{ duration: 0.3 }}
          className="relative flex w-full max-w-[580px] flex-col items-center rounded-[30px] border border-[#93d0c733] bg-[#223049] px-6 pb-8 pt-7 text-[#f6f0df] shadow-[0_24px_80px_rgba(5,12,28,0.5)] sm:px-10"
        >
          {/* Header */}
          <div className="flex w-full items-start justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#f5c65d]">
                signature intervention
              </p>
              <h2
                id="aura-shift-title"
                className="mt-1.5 font-serif text-[26px] font-bold leading-tight tracking-[-0.04em] text-[#fbf8ef] sm:text-[32px]"
              >
                AURA SHIFT <span className="text-[#93d0c7]">—</span> Let’s take a moment to reset.
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleMute}
                className="flex shrink-0 items-center gap-1.5 rounded-full border border-[#93d0c744] bg-[#2d3e5c] px-3 py-1.5 text-[11px] font-semibold text-[#c7d8d5] transition-colors hover:bg-[#394c6f]"
                aria-label={isMuted ? 'Unmute ambient sound' : 'Mute ambient sound'}
                data-testid="button-mute-aura-shift"
              >
                {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                <span className="hidden sm:inline">{isMuted ? 'Muted' : 'Mute'}</span>
              </button>

              <button
                type="button"
                onClick={onSkip}
                className="rounded-full p-1.5 text-[#9cb1b0] hover:bg-[#ffffff15]"
                aria-label="Skip reset"
                data-testid="button-skip-aura-shift"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <p className="mt-3 max-w-[450px] text-center text-xs leading-relaxed text-[#b9cbc8]">
            {isDone
              ? 'Reset complete — ready to return to your study flow?'
              : 'A short visual pause for your study rhythm. Nothing is recorded during this exercise.'}
          </p>

          {/* Breathing Orb Visualization */}
          <div className="relative my-7 grid h-[240px] w-[240px] place-items-center sm:my-8 sm:h-[280px] sm:w-[280px]">
            {/* Outer halo ripple */}
            <motion.div
              animate={
                isDone
                  ? { scale: 1, opacity: 0.3 }
                  : { scale: [0.88, 1.1, 0.88], opacity: [0.2, 0.45, 0.2] }
              }
              transition={
                isDone
                  ? { duration: 0.4 }
                  : { duration: 4, repeat: Infinity, ease: 'easeInOut' }
              }
              className="absolute inset-0 rounded-full border border-[#93d0c755]"
            />

            {/* Middle glowing aura */}
            <motion.div
              animate={
                isDone
                  ? { scale: 1, opacity: 0.65 }
                  : {
                      scale: phase === 'Breathe in' ? 1.08 : 0.84,
                      opacity: phase === 'Breathe in' ? 0.95 : 0.55,
                    }
              }
              transition={{ duration: 4, ease: 'easeInOut' }}
              className="absolute inset-5 rounded-full bg-[#3a8c8340] shadow-[0_0_80px_#4fb7a750]"
            />

            {/* Inner dashed ring */}
            <div className="absolute inset-10 rounded-full border border-dashed border-[#93d0c788]" />

            {/* Center counter orb */}
            <div className="relative grid h-[120px] w-[120px] place-items-center rounded-full bg-[#3a8c83] shadow-[0_12px_40px_#132d3a99] sm:h-[135px] sm:w-[135px]">
              <span
                className="font-mono text-[30px] font-bold tracking-tight text-[#f6f0df]"
                data-testid="text-aura-shift-countdown"
              >
                {formatTime(secondsRemaining)}
              </span>
            </div>

            {/* Phase indicator text */}
            <span
              className="absolute bottom-2 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[#93d0c7]"
              data-testid="text-aura-shift-phase"
            >
              {isDone ? 'Balanced' : phase}
            </span>
          </div>

          {/* Action Footer */}
          {isDone ? (
            <div className="flex w-full gap-3">
              <button
                type="button"
                onClick={onComplete}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#f5c65d] px-5 py-3.5 text-xs font-bold text-[#202840] shadow-md transition-transform hover:-translate-y-0.5"
                data-testid="button-continue-studying"
              >
                Continue Studying
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex w-full justify-between items-center pt-2">
              <span className="font-mono text-[10px] text-[#9cb1b0]">
                Takes 20 seconds · restores your baseline
              </span>
              <button
                type="button"
                onClick={onSkip}
                className="text-xs font-medium text-[#b9cbc8] hover:text-[#f6f0df] underline-offset-4 hover:underline"
                data-testid="button-skip-aura-shift-complete"
              >
                Skip reset
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
