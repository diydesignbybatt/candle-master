/**
 * Sound Service - Manages sound effects and background music
 */

type SoundType = 'trade-open' | 'profit' | 'loss' | 'click' | 'game-win' | 'game-lose';
type MusicType = 'bgm-normal' | 'bgm-event';

class SoundService {
  private sounds: Map<SoundType, HTMLAudioElement> = new Map();
  private enabled: boolean = true;

  // Music system
  private music: HTMLAudioElement | null = null;
  private musicEnabled: boolean = false;
  private currentMusic: MusicType | null = null;
  private musicVolume: number = 0.15;

  constructor() {
    // Load sound setting from localStorage
    const saved = localStorage.getItem('sound_enabled');
    this.enabled = saved !== null ? JSON.parse(saved) : true;

    const musicSaved = localStorage.getItem('music_enabled');
    this.musicEnabled = musicSaved !== null ? JSON.parse(musicSaved) : false;

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

  private getMusicPath(type: MusicType): string {
    if (type === 'bgm-normal') return '/sounds/bgm-normal.mp3';
    return '/sounds/bgm-event.mp3';
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

  playMusic(type: MusicType) {
    if (!this.musicEnabled) return;

    // Already playing this track
    if (this.currentMusic === type && this.music && !this.music.paused) return;

    this.stopMusic();

    try {
      const audio = new Audio(this.getMusicPath(type));
      audio.loop = true;
      audio.volume = this.musicVolume;
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
    if (this.music) {
      this.music.pause();
      this.music.currentTime = 0;
      this.music = null;
      this.currentMusic = null;
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
