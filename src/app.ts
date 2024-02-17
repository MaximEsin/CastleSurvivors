import * as PIXI from 'pixi.js';
import { GameManager } from './classes/GameCore/GameManager';

export class Game {
  private app: PIXI.Application<HTMLCanvasElement>;
  private gameManager: GameManager;

  constructor() {
    this.app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    document.body.appendChild(this.app.view);

    this.gameManager = new GameManager(this.app);
  }

  start() {
    this.gameManager.start();
  }
}

const game = new Game();
game.start();
