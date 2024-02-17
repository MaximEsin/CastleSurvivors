import * as PIXI from 'pixi.js';
import { GameManager } from './classes/GameCore/GameManager';

export class Game {
  // Лучше вот так
  private app: PIXI.Application<HTMLCanvasElement>;
  private gameManager: GameManager;

  constructor() {
    this.app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    // И теперь можно избавиться от as as конструкции
    document.body.appendChild(this.app.view as unknown as Node);

    this.gameManager = new GameManager(this.app);
  }

  start() {
    this.gameManager.start();
  }
}

const game = new Game();
game.start();
