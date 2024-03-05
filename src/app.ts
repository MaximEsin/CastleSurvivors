import * as PIXI from 'pixi.js';

export class Game {
  private app: PIXI.Application<HTMLCanvasElement>;

  constructor() {
    this.app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    document.body.appendChild(this.app.view);
  }

  start() {}
}

const game = new Game();
game.start();
