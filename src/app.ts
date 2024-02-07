import * as PIXI from 'pixi.js';
import { engine } from './Engine';
import { PlayerSystem } from './Player/PlayerSystem';
import { AnimationSystem } from './Systems/Animation';
import { PlayerMovementSystem } from './Player/PlayerMovementSystem';
import { PlayerWrapSystem } from './Player/PlayerWrapSystem';
import { AudioSystem } from './Systems/AudioSystem';
import { MushroomSystem } from './Enemies/Systems/Mushroom';

export class Game {
  private app: PIXI.Application;

  constructor() {
    this.app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    document.body.appendChild(this.app.view as unknown as Node);

    window.addEventListener('resize', () => {
      this.app.renderer.resize(window.innerWidth, window.innerHeight);
    });

    const background = PIXI.Sprite.from('/Backgrounds/CastleBG.jpg');

    background.width = this.app.screen.width;
    background.height = this.app.screen.height;

    this.app.stage.addChild(background);
  }

  start() {
    const playerSystem = new PlayerSystem(this.app);
    const animationSystem = new AnimationSystem();
    const playerMovementSystem = new PlayerMovementSystem();
    const playerWrapSystem = new PlayerWrapSystem(this.app);
    const audioSystem = new AudioSystem(playerMovementSystem);
    const mushroomSystem = new MushroomSystem(this.app);

    engine.addSystem(playerSystem);
    engine.addSystem(animationSystem);
    engine.addSystem(playerMovementSystem);
    engine.addSystem(playerWrapSystem);
    engine.addSystem(audioSystem);
    engine.addSystem(mushroomSystem);

    this.app.ticker.add((delta) => {
      engine.update(delta);
    });
  }
}

const game = new Game();

game.start();
