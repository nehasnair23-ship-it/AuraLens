import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { AuraSnapshot } from '../types';
import { AURA_STATES, formatClockTime } from '../data/storeCatalog';

interface AuraTimelineCardProps {
  snapshots: AuraSnapshot[];
}

export default function AuraTimelineCard({ snapshots }: AuraTimelineCardProps) {
  return (
    <section
      className="rounded-2xl border border-[#dcd8cb] bg-[#fbf8ef] p-5 shadow-sm"
      data-testid="card-aura-timeline"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#3a8c83]" />
            <h3 className="text-sm font-bold text-[#303847]">Aura Timeline</h3>
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-[#7c8585]">
            A quiet story of how your study rhythm changes.
          </p>
        </div>
        <span className="rounded-full bg-[#e7f2ee] px-2.5 py-1 font-mono text-[9px] font-medium text-[#3a8c83]">
          {snapshots.length} {snapshots.length === 1 ? 'cue' : 'cues'}
        </span>
      </div>

      <div className="relative mt-6">
        {snapshots.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#dedace] bg-[#f7f4eb] p-6 text-center text-xs text-[#7d8789]">
            Begin studying to view your gentle rhythm cues and focus timeline.
          </div>
        ) : (
          <>
            {/* Vertical timeline rule */}
            <div className="absolute bottom-3 left-[7px] top-2 w-px bg-[#ded9cc]" />

            <div className="space-y-4">
              {snapshots.map((snap) => {
                const config = AURA_STATES[snap.state];
                return (
                  <motion.div
                    key={snap.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25 }}
                    className="relative flex items-start gap-3.5"
                    data-testid={`timeline-snapshot-${snap.id}`}
                  >
                    <div
                      className="relative z-10 mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-[3px] border-[#fbf8ef]"
                      style={{
                        backgroundColor: config.color,
                        boxShadow: `0 0 0 1px ${config.color}66`,
                      }}
                    />
                    <div className="min-w-0 flex-1 rounded-xl border border-[#ece8dc] bg-[#f8f5eb] p-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className="rounded-md px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider"
                          style={{
                            backgroundColor: config.soft,
                            color: config.color,
                          }}
                        >
                          {snap.state}
                        </span>
                        <time className="font-mono text-[9px] text-[#8e9a9d]">
                          {formatClockTime(snap.timestamp)}
                        </time>
                      </div>
                      <p className="mt-1 text-xs text-[#4b585e] leading-snug">
                        {snap.detail}
                      </p>
                      {snap.trigger && (
                        <span className="mt-1.5 inline-block rounded bg-[#f0ebd9] px-1.5 py-0.5 font-mono text-[8px] font-medium uppercase tracking-wider text-[#736341]">
                          {snap.trigger}
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
