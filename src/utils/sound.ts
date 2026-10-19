// Kid-friendly Web Audio Synthesizer and Speech Cheer

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export class SoundManager {
  private sfxEnabled = true;
  private voiceEnabled = true;

  constructor() {
    if (typeof window !== 'undefined') {
      const savedSfx = localStorage.getItem('kid_tetris_sfx');
      const savedVoice = localStorage.getItem('kid_tetris_voice');
      if (savedSfx !== null) this.sfxEnabled = savedSfx === 'true';
      if (savedVoice !== null) this.voiceEnabled = savedVoice === 'true';
    }
  }

  isSfxEnabled() {
    return this.sfxEnabled;
  }

  isVoiceEnabled() {
    return this.voiceEnabled;
  }

  toggleSfx() {
    this.sfxEnabled = !this.sfxEnabled;
    localStorage.setItem('kid_tetris_sfx', String(this.sfxEnabled));
    return this.sfxEnabled;
  }

  toggleVoice() {
    this.voiceEnabled = !this.voiceEnabled;
    localStorage.setItem('kid_tetris_voice', String(this.voiceEnabled));
    return this.voiceEnabled;
  }

  // Soft toy marimba move tone
  playMove() {
    if (!this.sfxEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      
      const freqs = [392, 440, 523.25, 587.33, 659.25]; // G, A, C, D, E (pentatonic scale - sounds always good)
      const freq = freqs[Math.floor(Math.random() * freqs.length)];
      
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // Ignore audio failure
    }
  }

  // Bouncy rotate chirp
  playRotate() {
    if (!this.sfxEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
      
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch {
      // Ignore
    }
  }

  // Soft warm drop thud
  playDrop() {
    if (!this.sfxEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.12);
      
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch {
      // Ignore
    }
  }

  // Sparkling fanfare for clearing lines
  playLineClear(linesCount = 1) {
    if (!this.sfxEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      const count = Math.min(notes.length, linesCount + 2);

      notes.slice(0, count).forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);

        gain.gain.setValueAtTime(0.18, ctx.currentTime + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.08);
        osc.stop(ctx.currentTime + i * 0.08 + 0.25);
      });
    } catch {
      // Ignore
    }
  }

  // Magic wand sparkle sound
  playMagicWand() {
    if (!this.sfxEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const freqs = [659.25, 830.61, 987.77, 1318.51, 1567.98];
      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.05);

        gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.05 + 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.05);
        osc.stop(ctx.currentTime + i * 0.05 + 0.2);
      });
    } catch {
      // Ignore
    }
  }

  // Rewind / Undo sound
  playUndo() {
    if (!this.sfxEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(250, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {
      // Ignore
    }
  }

  // Victory / Celebration Fanfare
  playCelebration() {
    if (!this.sfxEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const melody = [
        { f: 523.25, d: 0.12 }, // C
        { f: 659.25, d: 0.12 }, // E
        { f: 783.99, d: 0.12 }, // G
        { f: 1046.5, d: 0.28 }, // C (high)
      ];
      let t = ctx.currentTime;
      melody.forEach(note => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.f, t);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + note.d + 0.1);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + note.d + 0.1);
        t += note.d;
      });
    } catch {
      // Ignore
    }
  }

  // Warm Korean encouraging voice for 5-7 year olds
  speakCheer(text: string) {
    if (!this.voiceEnabled) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel(); // Stop prior
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      utterance.rate = 1.05; // Friendly and upbeat
      utterance.pitch = 1.25; // Gentle and cheerful
      utterance.volume = 0.9;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Speech may not be supported or allowed
    }
  }
}

export const soundManager = new SoundManager();
