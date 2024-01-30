// Mushroom.ts
import * as PIXI from 'pixi.js';
import { AnimationManager } from '../AnimationManager';
import { Enemy } from './Enemy';

export class Mushroom extends Enemy {
  constructor(animationManager: AnimationManager, app: PIXI.Application) {
    super(animationManager, app);
  }

  protected createEnemySprite(): PIXI.AnimatedSprite {
    const mushroomTextures =
      this.animationManager.getMushroomStandingAnimation();
    const animation = new PIXI.AnimatedSprite(mushroomTextures);

    this.enemySprite = animation;

    this.setRandomPosition(animation);

    animation.animationSpeed = 0.1;
    animation.play();

    this.app.stage.addChild(animation);

    return animation;
  }

  private setRandomPosition(animation: PIXI.AnimatedSprite): void {
    const screenWidth = this.app.screen.width;
    const screenHeight = this.app.screen.height;

    const borderOffset = -150;

    // Randomly choose whether to spawn near the horizontal or vertical border
    const spawnNearHorizontal = Math.random() < 0.5;

    if (spawnNearHorizontal) {
      // Spawn near the left or right border
      const spawnOnLeft = Math.random() < 0.5;
      animation.x = spawnOnLeft
        ? Math.max(0, -borderOffset) // Ensure Mushroom stays inside left border
        : Math.min(screenWidth, screenWidth + borderOffset); // Ensure Mushroom stays inside right border

      animation.y = Math.random() * screenHeight;
    } else {
      // Spawn near the top or bottom border
      const spawnOnTop = Math.random() < 0.5;
      animation.x = Math.random() * screenWidth;
      animation.y = spawnOnTop
        ? Math.max(0, -borderOffset) // Ensure Mushroom stays inside top border
        : Math.min(screenHeight, screenHeight + borderOffset); // Ensure Mushroom stays inside bottom border
    }
  }

  public update(): void {}
}
