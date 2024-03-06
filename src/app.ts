import * as PIXI from 'pixi.js';
import { BaseLevel } from './GameCore/BaseLevel';

export class Game {
  private app: PIXI.Application<HTMLCanvasElement>;
  private baseLevel: BaseLevel;

  constructor() {
    this.app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    document.body.appendChild(this.app.view);

    this.baseLevel = new BaseLevel(this.app);
  }

  start(): void {
    this.baseLevel.init();
  }
}

const game = new Game();
game.start();
