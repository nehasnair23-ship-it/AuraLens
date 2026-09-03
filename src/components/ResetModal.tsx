import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Pause, RotateCcw, Check, Sparkles } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { formatTime } from '../data/storeCatalog';

interface ResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (dewEarned: number) => void;
}

export default function ResetModal({
  isOpen,
  onClose,
  onComplete,
}: ResetModalProps) {
  const [seconds, setSeconds] = useState(30);
  const [isActive, setIsActive] = useState(true);
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSeconds(30);
      setIsActive(true);
      setPhase('Inhale');
      setIsFinished(false);
      return;
    }

    if (!isActive || isFinished) return;

    soundEngine.playInhaleTone();

    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          setIsFinished(true);
          soundEngine.playCompletionChime();
          clearInterval(interval);
          return 0;
        }

        const next = prev - 1;
        const mod = (30 - next) % 16;
        if (mod < 4) {
          setPhase('Inhale');
        } else if (mod < 8) {
          setPhase('Hold');
        } else if (mod < 12) {
          setPhase('Exhale');
        } else {
          setPhase('Rest');
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, isActive, isFinished]);

  const handleRestart = () => {
    setSeconds(30);
    setIsActive(true);
    setPhase('Inhale');
    setIsFinished(false);
    soundEngine.playInhaleTone();
  };

  const handleDone = () => {
    onComplete(6);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#141c3080] p-4 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        data-testid="modal-reset"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          className="relative w-full max-w-[480px] rounded-[26px] bg-[#f8f5ec] p-6 shadow-2xl sm:p-8"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 rounded-full p-2 text-[#7d8789] hover:bg-[#ede9dc]"
            aria-label="Close reset"
            data-testid="button-close-reset"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-[#dcebe0] text-[#3a8c83]">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#718195]">
              Guided Micro-Reset
            </span>
          </div>

          <h2 className="mt-2.5 font-serif text-[28px] font-bold leading-tight tracking-[-0.04em] text-[#202840]">
            Soft exhale. Slow arrival.
          </h2>

          <p className="mt-2 text-xs leading-relaxed text-[#626f74]">
            Take 30 seconds of box breathing to settle cognitive load. Inhale 4s, hold 4s, exhale 4s, rest 4s.
          </p>

          {/* Breathing Canvas */}
          <div className="relative my-7 grid h-[200px] place-items-center">
            <motion.div
              animate={{
                scale:
                  phase === 'Inhale' || phase === 'Hold'
                    ? 1.2
                    : phase === 'Exhale'
                    ? 0.85
                    : 0.85,
                backgroundColor:
                  phase === 'Inhale'
                    ? '#3a8c8333'
                    : phase === 'Hold'
                    ? '#d08b3230'
                    : phase === 'Exhale'
                    ? '#74b5aa40'
                    : '#dedace30',
              }}
              transition={{ duration: 3.5, ease: 'easeInOut' }}
              className="absolute h-40 w-40 rounded-full border border-[#3a8c8350]"
            />

            <div className="relative grid h-24 w-24 place-items-center rounded-full bg-[#3a8c83] text-white shadow-md">
              <span className="font-mono text-2xl font-bold">{formatTime(seconds)}</span>
            </div>

            <span className="absolute bottom-1 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#3a8c83]">
              {isFinished ? 'Complete' : phase}
            </span>
          </div>

          {/* Finished alert banner */}
          {isFinished && (
            <div
              className="mb-5 flex items-center gap-2.5 rounded-xl bg-[#e7f2ee] p-3 text-xs font-medium text-[#356a64]"
              data-testid="reset-complete-message"
            >
              <Check className="h-4 w-4 shrink-0 text-[#3a8c83]" />
              <span>Reset complete. You earned <strong>+6 Dew</strong> for your garden!</span>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-between border-t border-[#dedace] pt-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsActive((a) => !a)}
                className="flex items-center gap-1.5 rounded-lg border border-[#dedace] bg-[#fbf8ef] px-3 py-1.5 text-xs font-semibold text-[#445055] hover:bg-[#ede8dc]"
                data-testid="button-toggle-breathing"
              >
                {isActive ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                {isActive ? 'Pause' : 'Resume'}
              </button>

              <button
                type="button"
                onClick={handleRestart}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-[#6a777c] hover:bg-[#ede8dc]"
                data-testid="button-restart-reset"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Restart
              </button>
            </div>

            {isFinished ? (
              <button
                type="button"
                onClick={handleDone}
                className="rounded-xl bg-[#3a8c83] px-4 py-2 text-xs font-bold text-white hover:bg-[#32776f]"
              >
                Collect & Return
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-semibold text-[#7f8b8f] hover:text-[#384347]"
                data-testid="button-skip-reset"
              >
                Skip reset
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
