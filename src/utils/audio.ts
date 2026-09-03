/**
 * Web Audio API synthesizer for AuraLens gentle chimes & breath pacing
 */
class SoundEngine {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;

  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  playSingingBowl(freq = 280, duration = 3.5, gainLevel = 0.25) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Fundamental oscillator
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, now);

      // Warm harmonic overtone
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 1.5, now);

      // Low resonance body
      const osc3 = ctx.createOscillator();
      const gain3 = ctx.createGain();
      osc3.type = 'triangle';
      osc3.frequency.setValueAtTime(freq * 0.5, now);

      gain1.gain.setValueAtTime(0.001, now);
      gain1.gain.exponentialRampToValueAtTime(gainLevel, now + 0.15);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      gain2.gain.setValueAtTime(0.001, now);
      gain2.gain.exponentialRampToValueAtTime(gainLevel * 0.4, now + 0.25);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.7);

      gain3.gain.setValueAtTime(0.001, now);
      gain3.gain.exponentialRampToValueAtTime(gainLevel * 0.25, now + 0.1);
      gain3.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.9);

      osc1.connect(gain1);
      osc2.connect(gain2);
      osc3.connect(gain3);

      gain1.connect(ctx.destination);
      gain2.connect(ctx.destination);
      gain3.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc3.start(now);

      osc1.stop(now + duration);
      osc2.stop(now + duration);
      osc3.stop(now + duration);
    } catch {
      // Audio playback fails gracefully if unallowed by browser
    }
  }

  playInhaleTone() {
    this.playSingingBowl(329.63, 2.8, 0.18); // E4 gentle chime
  }

  playExhaleTone() {
    this.playSingingBowl(261.63, 3.2, 0.18); // C4 grounding tone
  }

  playCompletionChime() {
    if (this.isMuted) return;
    const notes = [261.63, 329.63, 392.0, 523.25]; // C major chord
    notes.forEach((freq, index) => {
      setTimeout(() => {
        this.playSingingBowl(freq, 3.0, 0.15);
      }, index * 120);
    });
  }

  playDewEarnedTone() {
    if (this.isMuted) return;
    const notes = [440, 554.37, 659.25]; // A major pleasant chime
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playSingingBowl(freq, 1.8, 0.12);
      }, idx * 90);
    });
  }
}

export const soundEngine = new SoundEngine();
