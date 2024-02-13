import * as PIXI from 'pixi.js';
import { PlayerInterface } from '../UI/PlayerInterface';
import { AudioManager } from '../Managers/AudioManager';

export class GameEventHandler {
  private app: PIXI.Application;
  private playerInterface: PlayerInterface;
  private audioManager: AudioManager;

  constructor(
    app: PIXI.Application,
    playerInterface: PlayerInterface,
    audioManager: AudioManager
  ) {
    this.app = app;
    this.playerInterface = playerInterface;
    this.audioManager = audioManager;
  }

  public setUpGlobalEventListeners() {
    window.addEventListener('resize', () => {
      this.app.renderer.resize(window.innerWidth, window.innerHeight);
      this.playerInterface.resizeInterface(
        this.app.screen.width,
        this.app.screen.height
      );
    });

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        if (this.app.ticker.started) {
          this.app.ticker.stop();
          this.audioManager.pauseAllSounds();
        } else {
          this.app.ticker.start();
          this.audioManager.resumeAllPausedSounds();
        }
      }
    });
  }
}
