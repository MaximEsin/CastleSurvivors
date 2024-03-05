import * as PIXI from 'pixi.js';
import { AudioManager } from './AudioManager';
import { Interface } from '../UI/Interface';

export class EventHandler {
  private app: PIXI.Application;

  constructor(app: PIXI.Application) {
    this.app = app;
  }

  public setUpGlobalEventListeners(Interface: Interface) {
    window.addEventListener('resize', () => {
      this.app.renderer.resize(window.innerWidth, window.innerHeight);
      Interface.resizeInterface(this.app.screen.width, this.app.screen.height);
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
