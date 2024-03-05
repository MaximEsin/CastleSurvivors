import { Sound } from '@pixi/sound';

export class AudioManager {
  protected static sounds: { [key: string]: Sound } = {};

  protected static loadSound(id: string, src: string): void {
    const sound = Sound.from(src);
    this.sounds[id] = sound;
  }

  static initialize(): void {
    this.loadSound('ingameMusic', '/sounds/ingame.mp3');
    this.loadSound('walkingSound', '/sounds/footsteps.mp3');
    this.loadSound('playerHit', '/sounds/Hit.wav');
    this.loadSound('playerDead', '/sounds/Death.wav');
  }

  public static playSound(key: string): void {
    const sound = this.sounds[key];
    if (sound) {
      sound.play();
    }
  }

  public static playSoundWithLoop(key: string, loop: boolean = false): void {
    const sound = this.sounds[key];
    if (sound) {
      sound.loop = loop;
      sound.play();
    }
  }

  public static pauseAllSounds(): void {
    Object.values(this.sounds).forEach((sound) => {
      if (sound && sound.isPlaying) {
        sound.pause();
      }
    });
  }

  public static resumeAllPausedSounds(): void {
    Object.values(this.sounds).forEach((sound) => {
      if (sound && sound.paused) {
        sound.resume();
      }
    });
  }

  public static pauseSound(key: string): void {
    const sound = this.sounds[key];
    if (sound) {
      sound.pause();
    }
  }

  public static stopSound(key: string): void {
    const sound = this.sounds[key];
    if (sound) {
      sound.stop();
    }
  }

  public static setVolume(key: string, volume: number): void {
    const sound = this.sounds[key];
    if (sound) {
      sound.volume = volume;
    }
  }
}
