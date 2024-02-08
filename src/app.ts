import * as PIXI from 'pixi.js';
import { engine } from './Engine';
import { PlayerSystem } from './Player/PlayerSystem';
import { AnimationSystem } from './Player/PlayerAnimation';
import { PlayerMovementSystem } from './Player/PlayerMovementSystem';
import { PlayerWrapSystem } from './Player/PlayerWrapSystem';
import { AudioSystem } from './Systems/AudioSystem';
import { MushroomSystem } from './Enemies/Systems/Mushroom';
import { EnemyMovementSystem } from './Enemies/Systems/Movement';
import { EnemyAnimationSystem } from './Enemies/Systems/Animation';
import { PlayerInterfaceSystem } from './Systems/Interface';
import { ProjectileMovementSystem } from './Enemies/Systems/ProjectileMovement';
import { EnemyAttackSystem } from './Enemies/Systems/Attack';

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

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        if (this.app.ticker.started) {
          this.app.ticker.stop();
        } else {
          this.app.ticker.start();
        }
      }
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
    const enemyMovementSystem = new EnemyMovementSystem(this.app);
    const enemyAnimationSystem = new EnemyAnimationSystem(mushroomSystem);
    const playerInterfaceSystem = new PlayerInterfaceSystem(this.app);
    const projectileMovementSystem = new ProjectileMovementSystem(this.app);
    const enemyAttackSystem = new EnemyAttackSystem(this.app);

    engine.addSystem(playerSystem);
    engine.addSystem(animationSystem);
    engine.addSystem(playerMovementSystem);
    engine.addSystem(playerWrapSystem);
    engine.addSystem(audioSystem);
    engine.addSystem(mushroomSystem);
    engine.addSystem(enemyMovementSystem);
    engine.addSystem(enemyAnimationSystem);
    engine.addSystem(playerInterfaceSystem);
    engine.addSystem(enemyAttackSystem);
    engine.addSystem(projectileMovementSystem);

    this.app.ticker.add((delta) => {
      engine.update(delta);
    });
  }
}

const game = new Game();

game.start();
