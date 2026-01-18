/**
 * Sound Service - Manages all sound effects in the app
 */

type SoundType = 'trade-open' | 'profit' | 'loss' | 'click' | 'game-win' | 'game-lose';

class SoundService {
  private sounds: Map<SoundType, HTMLAudioElement> = new Map();
  private enabled: boolean = true;

  constructor() {
    // Load sound setting from localStorage
    const saved = localStorage.getItem('sound_enabled');
    this.enabled = saved !== null ? JSON.parse(saved) : true;

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
      audio.volume = 0.5; // Default volume at 50%
      this.sounds.set(type, audio);
    } catch (error) {
      console.warn(`Failed to load sound: ${type}`, error);
    }
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
      // Reset to start if already playing
      sound.currentTime = 0;

      // Set volume if provided
      if (volume !== undefined) {
        sound.volume = Math.max(0, Math.min(1, volume));
      }

      // Play the sound
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

  /**
   * Check if sounds are enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Set volume for a specific sound (0.0 to 1.0)
   */
  setVolume(type: SoundType, volume: number) {
    const sound = this.sounds.get(type);
    if (sound) {
      sound.volume = Math.max(0, Math.min(1, volume));
    }
  }

  /**
   * Set volume for all sounds
   */
  setMasterVolume(volume: number) {
    const normalizedVolume = Math.max(0, Math.min(1, volume));
    this.sounds.forEach(sound => {
      sound.volume = normalizedVolume;
    });
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
