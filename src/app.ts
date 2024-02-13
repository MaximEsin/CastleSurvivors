import * as PIXI from 'pixi.js';
import { GameManager } from './classes/GameCore/GameManager';

export class Game {
  private app: PIXI.Application;
  private gameManager: GameManager;

  constructor() {
    this.app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    document.body.appendChild(this.app.view as unknown as Node);

    this.gameManager = new GameManager(this.app);
  }

  start() {
    this.gameManager.start();
  }
}

const game = new Game();
game.start();
