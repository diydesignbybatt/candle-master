/**
 * Sound Service - Manages sound effects and background music
 * ใช้ Web Audio API (GainNode) เพื่อควบคุม volume แบบ dB ได้แม่นยำ
 * HTMLAudioElement.volume เป็น linear 0-1 ทำให้ปรับเสียงเบาได้ไม่ดี
 */

type SoundType = 'trade-open' | 'profit' | 'loss' | 'click' | 'game-win' | 'game-lose';
type MusicType = 'bgm-normal' | 'bgm-event';

// BGM tracks
const NORMAL_TRACKS = ['/sounds/bgm-1.mp3', '/sounds/bgm-3.mp3'];
const BOSS_TRACKS = ['/sounds/boss-1.mp3', '/sounds/boss-2.mp3'];

/**
 * แปลง dB เป็น linear gain value
 * 0 dB = 1.0 (original), -6 dB ≈ 0.5, -12 dB ≈ 0.25, -20 dB ≈ 0.1
 */
function dbToGain(db: number): number {
  if (db <= -60) return 0; // ถือว่าเงียบ
  return Math.pow(10, db / 20);
}

class SoundService {
  private sounds: Map<SoundType, HTMLAudioElement> = new Map();
  private enabled: boolean = true;

  // Web Audio API context + gain nodes
  private audioCtx: AudioContext | null = null;
  private sfxGain: GainNode | null = null;    // gain node สำหรับ sound effects
  private musicGain: GainNode | null = null;  // gain node สำหรับ BGM
  private musicSource: MediaElementAudioSourceNode | null = null;

  // AudioBuffer cache — ใช้สำหรับ play SFX ผ่าน Web Audio API โดยตรง (ไม่พึ่ง HTMLAudioElement)
  // แก้ปัญหา Android WebView ที่ HTMLAudioElement.play() ถูก interrupt โดย heavy state updates
  private audioBuffers: Map<SoundType, AudioBuffer> = new Map();

  // Volume ในหน่วย dB (0 dB = เสียงเต็ม, ค่าติดลบ = เบาลง)
  private sfxVolumeDb: number = 0;      // SFX: 0 dB (เสียงเต็ม)
  private musicVolumeDb: number = 0;    // BGM: 0 dB (เสียงเต็ม)

  // Music system
  private music: HTMLAudioElement | null = null;
  private musicEnabled: boolean = false;
  private currentMusic: MusicType | null = null;
  private fadeTimer: ReturnType<typeof setInterval> | null = null;

  // Autoplay unlock: queue pending music until user interacts
  private pendingMusic: MusicType | null = null;
  private userHasInteracted: boolean = false;

  // SFX file paths สำหรับ preload AudioBuffer
  private sfxPaths: Map<SoundType, string> = new Map();

  constructor() {
    // Load sound setting from localStorage
    const saved = localStorage.getItem('sound_enabled');
    this.enabled = saved !== null ? JSON.parse(saved) : true;

    const musicSaved = localStorage.getItem('music_enabled');
    this.musicEnabled = musicSaved !== null ? JSON.parse(musicSaved) : true;

    // Preload all sounds (HTMLAudioElement fallback + save paths for AudioBuffer)
    this.loadSound('trade-open', '/sounds/tradeopen.mp3');
    this.loadSound('profit', '/sounds/profit.mp3');
    this.loadSound('loss', '/sounds/loss.mp3');
    this.loadSound('click', '/sounds/click.mp3');
    this.loadSound('game-win', '/sounds/gamewin.mp3');
    this.loadSound('game-lose', '/sounds/gamelose.mp3');

    // Listen for first user interaction to unlock autoplay
    this.setupAutoplayUnlock();
  }

  /**
   * สร้าง AudioContext + GainNode (ต้องเรียกหลัง user interaction ครั้งแรก)
   * แล้ว preload AudioBuffer สำหรับ SFX ทุกตัว
   */
  private initAudioContext() {
    if (this.audioCtx) return;
    try {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();

      // SFX gain node
      this.sfxGain = this.audioCtx.createGain();
      this.sfxGain.gain.value = dbToGain(this.sfxVolumeDb);
      this.sfxGain.connect(this.audioCtx.destination);

      // Music gain node
      this.musicGain = this.audioCtx.createGain();
      this.musicGain.gain.value = dbToGain(this.musicVolumeDb);
      this.musicGain.connect(this.audioCtx.destination);

      // Preload AudioBuffer สำหรับ SFX ทุกตัว (ใช้แทน HTMLAudioElement บน Android)
      // AudioBufferSourceNode สร้างใหม่ทุกครั้งที่ play → ไม่มีปัญหา reuse/interrupt
      this.sfxPaths.forEach((path, type) => {
        this.preloadAudioBuffer(type, path);
      });

      console.log(`[Audio] Web Audio API initialized — SFX: ${this.sfxVolumeDb}dB, Music: ${this.musicVolumeDb}dB`);
    } catch (err) {
      console.warn('[Audio] Web Audio API not supported, falling back to HTMLAudioElement volume', err);
    }
  }

  /**
   * Fetch + decode MP3 เป็น AudioBuffer (เร็ว, ไม่ block main thread ตอน play)
   */
  private async preloadAudioBuffer(type: SoundType, path: string) {
    if (!this.audioCtx) return;
    try {
      const response = await fetch(path);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioCtx.decodeAudioData(arrayBuffer);
      this.audioBuffers.set(type, audioBuffer);
      console.log(`[Audio] AudioBuffer loaded: ${type}`);
    } catch (err) {
      console.warn(`[Audio] Failed to preload AudioBuffer: ${type}`, err);
    }
  }

  /**
   * Browsers block audio.play() until user interacts with the page.
   * This listens for the first click/touch and plays any pending music.
   */
  private setupAutoplayUnlock() {
    const unlock = () => {
      this.userHasInteracted = true;

      // สร้าง AudioContext ตอน user interaction ครั้งแรก
      this.initAudioContext();

      // Play pending music if any
      if (this.pendingMusic && this.musicEnabled) {
        console.log(`[Music] Autoplay unlocked, playing pending: ${this.pendingMusic}`);
        this.playMusicInternal(this.pendingMusic);
        this.pendingMusic = null;
      }
      // Remove listeners after first interaction
      document.removeEventListener('click', unlock);
      document.removeEventListener('touchstart', unlock);
    };
    document.addEventListener('click', unlock, { once: true });
    document.addEventListener('touchstart', unlock, { once: true });
  }

  private loadSound(type: SoundType, path: string) {
    try {
      const audio = new Audio(path);
      audio.preload = 'auto';
      audio.volume = 1.0;
      this.sounds.set(type, audio);
      this.sfxPaths.set(type, path); // เก็บ path ไว้สำหรับ preload AudioBuffer ภายหลัง
    } catch (error) {
      console.warn(`Failed to load sound: ${type}`, error);
    }
  }

  private pickTrack(type: MusicType): string {
    if (type === 'bgm-event') {
      return BOSS_TRACKS[Math.floor(Math.random() * BOSS_TRACKS.length)];
    }
    return NORMAL_TRACKS[Math.floor(Math.random() * NORMAL_TRACKS.length)];
  }

  /**
   * Play a sound effect
   *
   * ใช้ AudioBuffer (Web Audio API) เป็นหลัก — สร้าง BufferSourceNode ใหม่ทุกครั้ง
   * ไม่มีปัญหา reuse/interrupt ที่เกิดกับ HTMLAudioElement บน Android WebView
   *
   * Fallback เป็น cloneNode HTMLAudioElement ถ้า AudioBuffer ยังไม่พร้อม
   */
  play(type: SoundType, volume?: number) {
    if (!this.enabled) return;

    try {
      // Resume AudioContext ถ้า suspended (จำเป็นสำหรับ Android WebView)
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      // ✅ Primary: ใช้ AudioBuffer + BufferSourceNode (เร็ว, ไม่ interrupt, play ซ้อนได้)
      const buffer = this.audioBuffers.get(type);
      if (buffer && this.audioCtx && this.sfxGain) {
        const source = this.audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(this.sfxGain);
        source.start(0);
        return;
      }

      // 🔄 Fallback: clone HTMLAudioElement (ไม่ reuse ตัวเดิม → หลีกเลี่ยง interrupt)
      const original = this.sounds.get(type);
      if (!original) {
        console.warn(`Sound not found: ${type}`);
        return;
      }

      const clone = original.cloneNode() as HTMLAudioElement;
      clone.volume = volume !== undefined ? Math.max(0, Math.min(1, dbToGain(volume))) : 1.0;
      clone.play().catch(err => {
        console.warn(`Failed to play sound: ${type}`, err);
      });
    } catch (error) {
      console.warn(`Error playing sound: ${type}`, error);
    }
  }

  /**
   * Enable or disable all sounds
   */
  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    localStorage.setItem('sound_enabled', JSON.stringify(enabled));
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  setVolume(type: SoundType, volume: number) {
    const sound = this.sounds.get(type);
    if (sound) {
      sound.volume = Math.max(0, Math.min(1, volume));
    }
  }

  setMasterVolume(volume: number) {
    const normalizedVolume = Math.max(0, Math.min(1, volume));
    this.sounds.forEach(sound => {
      sound.volume = normalizedVolume;
    });
  }

  /**
   * ปรับ volume SFX ในหน่วย dB
   * เช่น setSfxVolumeDb(-6) = ลดลง 6dB (ประมาณ 50%)
   */
  setSfxVolumeDb(db: number) {
    this.sfxVolumeDb = db;
    if (this.sfxGain) {
      this.sfxGain.gain.value = dbToGain(db);
    }
  }

  /**
   * ปรับ volume BGM ในหน่วย dB
   * เช่น setMusicVolumeDb(-16) = ลดลง 16dB (เบามาก)
   * เช่น setMusicVolumeDb(-5) = ลดลง 5dB
   */
  setMusicVolumeDb(db: number) {
    this.musicVolumeDb = db;
    if (this.musicGain) {
      this.musicGain.gain.value = dbToGain(db);
    }
  }

  getSfxVolumeDb(): number {
    return this.sfxVolumeDb;
  }

  getMusicVolumeDb(): number {
    return this.musicVolumeDb;
  }

  // --- Music methods ---

  playMusic(type: MusicType) {
    if (!this.musicEnabled) return;

    // Already playing this type
    if (this.currentMusic === type && this.music && !this.music.paused) return;

    // If user hasn't interacted yet, queue it for later
    if (!this.userHasInteracted) {
      console.log(`[Music] Autoplay blocked, queuing: ${type}`);
      this.pendingMusic = type;
      return;
    }

    this.playMusicInternal(type);
  }

  private playMusicInternal(type: MusicType) {
    this.stopMusic();

    try {
      const trackPath = this.pickTrack(type);
      const audio = new Audio(trackPath);
      audio.loop = true;

      // Route ผ่าน Web Audio API GainNode ถ้ามี
      if (this.audioCtx && this.musicGain) {
        audio.volume = 1.0; // element volume เต็ม, GainNode ควบคุม dB
        this.musicSource = this.audioCtx.createMediaElementSource(audio);
        this.musicSource.connect(this.musicGain);
      } else {
        // Fallback: ใช้ linear volume (แปลง dB → linear)
        audio.volume = dbToGain(this.musicVolumeDb);
      }

      audio.play().catch(err => {
        console.warn(`Failed to play music: ${type}`, err);
      });
      this.music = audio;
      this.currentMusic = type;
    } catch (error) {
      console.warn(`Error playing music: ${type}`, error);
    }
  }

  stopMusic() {
    this.clearFade();
    if (this.musicSource) {
      try { this.musicSource.disconnect(); } catch (_) {}
      this.musicSource = null;
    }
    if (this.music) {
      this.music.pause();
      this.music.currentTime = 0;
      this.music = null;
      this.currentMusic = null;
    }
  }

  /**
   * Fade out music over duration (ms), then stop.
   * Used for boss music when game ends.
   * ใช้ Web Audio API linearRampToValueAtTime ถ้ามี (smooth กว่า setInterval)
   */
  fadeOutAndStop(duration: number = 1000): Promise<void> {
    return new Promise(resolve => {
      if (!this.music || this.music.paused) {
        this.stopMusic();
        resolve();
        return;
      }

      // ถ้ามี Web Audio API → ใช้ native fade (smooth มาก)
      if (this.audioCtx && this.musicGain) {
        const now = this.audioCtx.currentTime;
        this.musicGain.gain.setValueAtTime(this.musicGain.gain.value, now);
        this.musicGain.gain.linearRampToValueAtTime(0, now + duration / 1000);

        // หลัง fade เสร็จ → stop + reset gain กลับ
        setTimeout(() => {
          this.stopMusic();
          if (this.musicGain) {
            this.musicGain.gain.value = dbToGain(this.musicVolumeDb);
          }
          resolve();
        }, duration + 50);
        return;
      }

      // Fallback: setInterval fade (สำหรับ browser ที่ไม่มี Web Audio API)
      const startVolume = this.music.volume;
      const steps = 20;
      const interval = duration / steps;
      const volumeStep = startVolume / steps;
      let step = 0;

      this.clearFade();
      this.fadeTimer = setInterval(() => {
        step++;
        if (!this.music || step >= steps) {
          this.clearFade();
          this.stopMusic();
          resolve();
          return;
        }
        this.music.volume = Math.max(0, startVolume - volumeStep * step);
      }, interval);
    });
  }

  private clearFade() {
    if (this.fadeTimer) {
      clearInterval(this.fadeTimer);
      this.fadeTimer = null;
    }
  }

  switchMusic(type: MusicType) {
    if (!this.musicEnabled) return;
    this.stopMusic();
    this.playMusic(type);
  }

  pauseMusic() {
    if (this.music && !this.music.paused) {
      this.music.pause();
    }
  }

  resumeMusic() {
    if (this.musicEnabled && this.music && this.music.paused && this.currentMusic) {
      this.music.play().catch(() => {});
    }
  }

  setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
    localStorage.setItem('music_enabled', JSON.stringify(enabled));
    if (!enabled) {
      this.stopMusic();
    }
  }

  isMusicEnabled(): boolean {
    return this.musicEnabled;
  }

  getCurrentMusic(): MusicType | null {
    return this.currentMusic;
  }

}

// Export singleton instance
export const soundService = new SoundService();

// Convenience functions
export const playSound = (type: SoundType, volume?: number) => {
  soundService.play(type, volume);
};

export const toggleSound = (enabled: boolean) => {
  soundService.setEnabled(enabled);
};

export const isSoundEnabled = () => {
  return soundService.isEnabled();
};
