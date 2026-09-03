import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Wind, Square } from 'lucide-react';
import { AuraState } from '../types';
import { AURA_STATES, formatTime } from '../data/storeCatalog';

interface LiveAuraCardProps {
  sessionActive: boolean;
  state: AuraState;
  score: number;
  elapsedSeconds: number;
  cameraAvailable: boolean;
  onStartSession: (withCamera: boolean) => void;
  onEndSession: () => void;
  onOpenReset: () => void;
}

export default function LiveAuraCard({
  sessionActive,
  state,
  score,
  elapsedSeconds,
  onStartSession,
  onEndSession,
  onOpenReset,
}: LiveAuraCardProps) {
  const currentConfig = AURA_STATES[state];

  return (
    <section
      className="relative overflow-hidden rounded-[26px] border border-[#ded9cb] bg-[#f8f5ec] px-6 py-8 shadow-[0_12px_45px_rgba(32,40,64,0.05)] sm:px-10 sm:py-9"
      data-testid="card-live-aura"
    >
      {/* Ambient background glow */}
      <div
        className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full blur-3xl transition-colors duration-1000"
        style={{
          backgroundColor: sessionActive ? `${currentConfig.color}22` : '#f5c65d18',
        }}
      />

      <div className="relative flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
        {/* Left Column: State & Message & Metrics */}
        <div className="max-w-md">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#dedace] bg-[#f2efe4] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#637075]" data-testid="text-aura-eyebrow">
            <span
              className="h-2 w-2 rounded-full transition-colors duration-500"
              style={{ backgroundColor: sessionActive ? currentConfig.color : '#aab9bd' }}
            />
            {sessionActive ? currentConfig.eyebrow : 'A softer way to study'}
          </div>

          <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.19em] text-[#89918d]">
            Live aura state
          </p>

          <AnimatePresence mode="wait">
            <motion.div
              key={sessionActive ? state : 'idle'}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <h2
                className="mt-2 flex items-center gap-3.5 font-serif text-[44px] font-bold leading-none tracking-[-0.05em] sm:text-[50px]"
                style={{ color: sessionActive ? currentConfig.color : '#202840' }}
                data-testid="text-aura-state"
              >
                <span
                  className="h-4 w-4 rounded-full border-2 border-current/40 bg-current/80"
                  aria-label={`${state} level`}
                />
                {sessionActive ? state : 'Quiet'}
              </h2>

              <p
                className="mt-3.5 max-w-[360px] text-sm leading-relaxed text-[#59656b]"
                data-testid="text-aura-message"
              >
                {sessionActive
                  ? currentConfig.message
                  : 'Start when you are ready to check in with your study rhythm.'}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Prototype study load metric */}
          <div className="mt-6 max-w-[360px]">
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.12em] text-[#7d8789]">
              <span>Prototype study load</span>
              <strong className="font-semibold text-[#34445d]" data-testid="text-study-score">
                {score}/100
              </strong>
            </div>

            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e8e4da]">
              <motion.div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  backgroundColor: sessionActive ? currentConfig.color : '#bdc6c4',
                }}
                animate={{ width: `${Math.max(4, score)}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Session Timer & Status */}
          {sessionActive && (
            <div className="mt-5 flex items-center gap-4">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#89918d]">
                  Elapsed:
                </span>
                <span
                  className="font-mono text-base font-bold tracking-tight text-[#202840]"
                  data-testid="text-session-time"
                >
                  {formatTime(elapsedSeconds)}
                </span>
              </div>
              <span className="h-3.5 w-px bg-[#dedace]" />
              <span className="text-[11px] font-medium text-[#65767b]">
                {score < 40 ? 'Calm pacing' : score < 70 ? 'Active processing' : 'Consider a breath'}
              </span>
            </div>
          )}
        </div>

        {/* Right Column: Visual Aura Orb */}
        <div className="flex flex-col items-center justify-center pt-2 md:pt-4">
          <div
            className="relative grid h-[210px] w-[210px] place-items-center sm:h-[240px] sm:w-[240px]"
            data-testid="visual-aura-orb"
          >
            {/* Outer halo */}
            <motion.div
              className="absolute inset-0 rounded-full border border-dashed transition-colors duration-1000"
              style={{
                borderColor: sessionActive ? `${currentConfig.color}40` : '#b8c5c144',
              }}
              animate={
                sessionActive
                  ? {
                      rotate: 360,
                      scale: [0.97, 1.03, 0.97],
                    }
                  : { scale: 1 }
              }
              transition={{
                rotate: { duration: 32, repeat: Infinity, ease: 'linear' },
                scale: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
              }}
            />

            {/* Middle soft atmospheric aura */}
            <motion.div
              className="absolute inset-5 rounded-full transition-colors duration-1000"
              style={{
                backgroundColor: sessionActive ? `${currentConfig.color}25` : '#dbe5e230',
                boxShadow: sessionActive ? `0 0 70px ${currentConfig.color}35` : '0 0 35px #aebcb920',
              }}
              animate={
                sessionActive
                  ? {
                      scale: [0.92, 1.06, 0.92],
                      opacity: [0.65, 0.95, 0.65],
                    }
                  : { scale: 0.95, opacity: 0.4 }
              }
              transition={{
                duration: state === 'Elevated' ? 3.2 : 5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Core glowing orb */}
            <motion.div
              className="relative grid h-[105px] w-[105px] place-items-center rounded-full text-white shadow-lg transition-colors duration-1000 sm:h-[120px] sm:w-[120px]"
              style={{
                backgroundColor: sessionActive ? currentConfig.color : '#7c9a94',
                boxShadow: sessionActive
                  ? `0 14px 40px ${currentConfig.color}60`
                  : '0 10px 30px #4d6d6730',
              }}
              animate={
                sessionActive
                  ? {
                      scale: [0.96, 1.04, 0.96],
                    }
                  : { scale: 1 }
              }
              transition={{
                duration: state === 'Elevated' ? 2.6 : 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <div className="absolute inset-2 rounded-full border border-white/25" />
              <span className="font-serif text-2xl font-bold tracking-tight text-[#fbf8ef]">
                {sessionActive ? `${score}` : '·'}
              </span>
              <span className="absolute bottom-2.5 font-mono text-[9px] uppercase tracking-[0.15em] text-[#fbf8ef]/80">
                {sessionActive ? state : 'idle'}
              </span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Action Footer Controls */}
      <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-[#dedace] pt-6">
        {!sessionActive ? (
          <>
            <button
              onClick={() => onStartSession(true)}
              className="group flex items-center gap-2.5 rounded-xl bg-[#202840] px-5 py-3 text-xs font-bold text-[#fbf8ef] shadow-sm transition-all hover:bg-[#2c3754] hover:shadow"
              data-testid="button-start-session"
            >
              <Sparkles className="h-4 w-4 text-[#f5c65d]" />
              Start Study Session
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>

            <button
              onClick={() => onStartSession(false)}
              className="rounded-xl border border-[#d8d5c9] bg-[#fbf8ef] px-4 py-3 text-xs font-semibold text-[#546268] transition-colors hover:bg-[#ede9dc]"
              data-testid="button-start-without-camera"
            >
              Start camera-free
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onOpenReset}
              className="flex items-center gap-2 rounded-xl border border-[#b8d9d2] bg-[#e7f2ee] px-4 py-2.5 text-xs font-bold text-[#356a64] transition-colors hover:bg-[#d9ede6]"
              data-testid="button-open-reset"
            >
              <Wind className="h-4 w-4" />
              Take a breath (Reset)
            </button>

            <button
              onClick={onEndSession}
              className="flex items-center gap-2 rounded-xl border border-[#dedace] bg-[#fbf8ef] px-4 py-2.5 text-xs font-semibold text-[#667276] transition-colors hover:bg-[#f3eedf]"
              data-testid="button-end-session"
            >
              <Square className="h-3.5 w-3.5 fill-current" />
              End Session
            </button>
          </>
        )}
      </div>
    </section>
  );
}
