/**
 * Sound Service - Manages sound effects and background music
 */

type SoundType = 'trade-open' | 'profit' | 'loss' | 'click' | 'game-win' | 'game-lose';
type MusicType = 'bgm-normal' | 'bgm-event';

// Theme-based BGM tracks (1 per theme)
const THEME_TRACKS: Record<string, string> = {
  sandstone: '/sounds/bgm-1.mp3',
  midnight: '/sounds/bgm-midn.mp3',
  solarized: '/sounds/bgm-sola.mp3',
};
const BOSS_TRACKS = ['/sounds/boss-1.mp3', '/sounds/boss-2.mp3'];

class SoundService {
  private sounds: Map<SoundType, HTMLAudioElement> = new Map();
  private enabled: boolean = true;

  // Music system
  private music: HTMLAudioElement | null = null;
  private musicEnabled: boolean = false;
  private currentMusic: MusicType | null = null;
  private musicVolume: number = 0.5;
  private currentTrackPath: string | null = null;
  private fadeTimer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    // Load sound setting from localStorage
    const saved = localStorage.getItem('sound_enabled');
    this.enabled = saved !== null ? JSON.parse(saved) : true;

    const musicSaved = localStorage.getItem('music_enabled');
    this.musicEnabled = musicSaved !== null ? JSON.parse(musicSaved) : false;

    const volumeSaved = localStorage.getItem('music_volume');
    this.musicVolume = volumeSaved !== null ? parseFloat(volumeSaved) : 0.5;

    // Preload all sounds
    this.loadSound('trade-open', '/sounds/tradeopen.mp3');
    this.loadSound('profit', '/sounds/profit.mp3');
    this.loadSound('loss', '/sounds/loss.mp3');
    this.loadSound('click', '/sounds/click.mp3');
    this.loadSound('game-win', '/sounds/gamewin.mp3');
    this.loadSound('game-lose', '/sounds/gamelose.mp3');
  }

  private loadSound(type: SoundType, path: string) {
    try {
      const audio = new Audio(path);
      audio.preload = 'auto';
      audio.volume = 0.5;
      this.sounds.set(type, audio);
    } catch (error) {
      console.warn(`Failed to load sound: ${type}`, error);
    }
  }

  private pickTrack(type: MusicType, theme?: string): string {
    if (type === 'bgm-event') {
      return BOSS_TRACKS[Math.floor(Math.random() * BOSS_TRACKS.length)];
    }
    // Normal BGM: pick track based on current theme
    return THEME_TRACKS[theme || 'sandstone'] || THEME_TRACKS.sandstone;
  }

  /**
   * Play a sound effect
   */
  play(type: SoundType, volume?: number) {
    if (!this.enabled) return;

    const sound = this.sounds.get(type);
    if (!sound) {
      console.warn(`Sound not found: ${type}`);
      return;
    }

    try {
      sound.currentTime = 0;
      if (volume !== undefined) {
        sound.volume = Math.max(0, Math.min(1, volume));
      }
      sound.play().catch(err => {
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

  // --- Music methods ---

  playMusic(type: MusicType, theme?: string) {
    if (!this.musicEnabled) return;

    // Already playing this type (for event, always check; for normal, also check theme match)
    if (this.currentMusic === type && this.music && !this.music.paused) {
      if (type === 'bgm-event') return;
      // For normal BGM: check if theme track matches current
      const expectedTrack = this.pickTrack(type, theme);
      if (this.currentTrackPath === expectedTrack) return;
    }

    this.stopMusic();

    try {
      const trackPath = this.pickTrack(type, theme);
      const audio = new Audio(trackPath);
      audio.loop = true;
      audio.volume = this.musicVolume;
      audio.play().catch(err => {
        console.warn(`Failed to play music: ${type}`, err);
      });
      this.music = audio;
      this.currentMusic = type;
      this.currentTrackPath = trackPath;
    } catch (error) {
      console.warn(`Error playing music: ${type}`, error);
    }
  }

  stopMusic() {
    this.clearFade();
    if (this.music) {
      this.music.pause();
      this.music.currentTime = 0;
      this.music = null;
      this.currentMusic = null;
      this.currentTrackPath = null;
    }
  }

  /**
   * Fade out music over duration (ms), then stop.
   * Used for boss music when game ends.
   */
  fadeOutAndStop(duration: number = 1000): Promise<void> {
    return new Promise(resolve => {
      if (!this.music || this.music.paused) {
        this.stopMusic();
        resolve();
        return;
      }

      const startVolume = this.music.volume;
      const steps = 20; // 20 steps over the duration
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

  switchMusic(type: MusicType, theme?: string) {
    if (!this.musicEnabled) return;
    this.stopMusic();
    this.playMusic(type, theme);
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

  getMusicVolume(): number {
    return this.musicVolume;
  }

  setMusicVolume(volume: number) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    localStorage.setItem('music_volume', String(this.musicVolume));
    // Apply immediately to playing music
    if (this.music) {
      this.music.volume = this.musicVolume;
    }
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
  soundService.isEnabled();
};
