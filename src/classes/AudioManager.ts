import { Sound } from '@pixi/sound';

export class AudioManager {
  protected sounds: { [key: string]: Sound } = {};

  constructor() {
    this.loadSound('ingameMusic', '/sounds/ingame.mp3');
    this.loadSound('walkingSound', '/sounds/footsteps.mp3');
    this.loadSound('playerHit', '/sounds/Hit.wav');
    this.loadSound('playerDead', '/sounds/Death.wav');
  }

  protected loadSound(id: string, src: string): void {
    const sound = Sound.from(src);
    this.sounds[id] = sound;
  }

  public playSound(key: string, loop: boolean = false): void {
    const sound = this.sounds[key];
    if (sound) {
      sound.loop = loop;
      sound.play();
    }
  }

  public pauseAllSounds(): void {
    Object.values(this.sounds).forEach((sound) => {
      if (sound && sound.isPlaying) {
        sound.pause();
      }
    });
  }

  public resumeAllPausedSounds(): void {
    Object.values(this.sounds).forEach((sound) => {
      if (sound && sound.paused) {
        sound.resume();
      }
    });
  }

  public pauseSound(key: string): void {
    const sound = this.sounds[key];
    if (sound) {
      sound.pause();
    }
  }

  public stopSound(key: string): void {
    const sound = this.sounds[key];
    if (sound) {
      sound.stop();
    }
  }

  public setVolume(key: string, volume: number): void {
    const sound = this.sounds[key];
    if (sound) {
      sound.volume = volume;
    }
  }
}
