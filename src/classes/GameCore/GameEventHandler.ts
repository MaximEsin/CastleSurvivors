import * as PIXI from 'pixi.js';
import { PlayerInterface } from '../UI/PlayerInterface';
import { AudioManager } from '../Managers/AudioManager';

export class GameEventHandler {
  private app: PIXI.Application;
  private playerInterface: PlayerInterface;

  constructor(app: PIXI.Application, playerInterface: PlayerInterface) {
    this.app = app;
    this.playerInterface = playerInterface;
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
          AudioManager.pauseAllSounds();
        } else {
          this.app.ticker.start();
          AudioManager.resumeAllPausedSounds();
        }
      }
    });
  }
}
