import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Shield, Compass, Heart } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HowItWorksModal({
  isOpen,
  onClose,
}: HowItWorksModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#141c3080] p-4 backdrop-blur-[3px]"
        role="dialog"
        aria-modal="true"
        data-testid="modal-how-it-works"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          className="relative w-full max-w-[520px] rounded-[26px] bg-[#f8f5ec] p-6 shadow-2xl sm:p-8"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 rounded-full p-2 text-[#7d8789] hover:bg-[#ede9dc]"
            aria-label="Close how it works"
            data-testid="button-close-how"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#f5dfae] text-[#845b1d]">
            <Sparkles className="h-5 w-5" />
          </div>

          <h2 className="mt-4 font-serif text-[32px] font-bold leading-[1.05] tracking-[-0.04em] text-[#202840]">
            A small mirror for
            <br />
            <span className="text-[#3a8c83]">long study days.</span>
          </h2>

          <div className="mt-6 space-y-4">
            <div className="flex gap-4 rounded-xl border border-[#ded9cb] bg-[#fbf8ef] p-3.5">
              <span className="font-mono text-xs font-bold text-[#b48030]">01</span>
              <div>
                <h4 className="text-xs font-bold text-[#202840]">Start a session</h4>
                <p className="mt-1 text-xs text-[#5e6c71] leading-relaxed">
                  Choose webcam or camera-free. There is no account required and no setup spiral.
                </p>
              </div>
            </div>

            <div className="flex gap-4 rounded-xl border border-[#ded9cb] bg-[#fbf8ef] p-3.5">
              <span className="font-mono text-xs font-bold text-[#3a8c83]">02</span>
              <div>
                <h4 className="text-xs font-bold text-[#202840]">Notice the aura</h4>
                <p className="mt-1 text-xs text-[#5e6c71] leading-relaxed">
                  Simple presence cues become a gentle Stable, Rising, or Elevated trend — never a verdict.
                </p>
              </div>
            </div>

            <div className="flex gap-4 rounded-xl border border-[#ded9cb] bg-[#fbf8ef] p-3.5">
              <span className="font-mono text-xs font-bold text-[#c96758]">03</span>
              <div>
                <h4 className="text-xs font-bold text-[#202840]">Make room</h4>
                <p className="mt-1 text-xs text-[#5e6c71] leading-relaxed">
                  When the signal shifts, try the guided two-minute reset and come back when you are ready.
                </p>
              </div>
            </div>
          </div>

          {/* Privacy & Wellness Note */}
          <div className="mt-5 rounded-xl border border-[#b8d9d266] bg-[#e8f3f0] p-3.5 text-[11px] leading-relaxed text-[#3a6861]">
            <div className="flex items-center gap-1.5 font-bold mb-1">
              <Shield className="h-3.5 w-3.5" />
              <span>Private by design</span>
            </div>
            Camera presence cues are processed strictly in your browser. No video is ever recorded or transmitted to any server.
          </div>

          <div className="mt-3 text-[10px] leading-relaxed text-[#7a888c]">
            <strong>Keep in mind:</strong> AuraLens is an experimental self-reflection tool, not medical advice or a diagnosis. The goal is to support your calm rhythm.
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-[#202840] px-5 py-2.5 text-xs font-bold text-[#fbf8ef] hover:bg-[#2e3b5a]"
              data-testid="button-dismiss-how"
            >
              Got it
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
