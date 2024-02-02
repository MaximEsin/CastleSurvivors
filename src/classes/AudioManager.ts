export class AudioManager {
  protected sounds: { [key: string]: HTMLAudioElement } = {};

  constructor() {
    this.loadAudio('ingameMusic', '/sounds/ingame.mp3');
    this.loadAudio('walkingSound', '/sounds/footsteps.mp3');
    this.loadAudio('playerHit', '/sounds/Hit.wav');
    this.loadAudio('playerDead', '/sounds/Death.wav');
  }

  protected loadAudio(id: string, src: string): HTMLAudioElement {
    const audio = document.getElementById(id) as HTMLAudioElement;
    if (audio) {
      audio.src = src;
    }
    this.sounds[id] = audio;
    return audio;
  }

  public playSound(key: string): void {
    const audio = this.sounds[key];
    if (audio) {
      audio.play();
    }
  }

  public pauseSound(key: string): void {
    const audio = this.sounds[key];
    if (audio) {
      audio.pause();
    }
  }

  public stopSound(key: string): void {
    const audio = this.sounds[key];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }

  public setVolume(key: string, volume: number): void {
    const audio = this.sounds[key];
    if (audio) {
      audio.volume = volume;
    }
  }
}
