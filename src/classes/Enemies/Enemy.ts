import * as PIXI from 'pixi.js';
import { AnimationManager } from '../AnimationManager';

export class Enemy {
  protected app: PIXI.Application;
  protected animationManager: AnimationManager;
  protected enemySprite: PIXI.AnimatedSprite;

  constructor(animationManager: AnimationManager, app: PIXI.Application) {
    this.animationManager = animationManager;
    this.app = app;
    this.enemySprite = this.createEnemySprite();
  }

  protected createEnemySprite(): PIXI.AnimatedSprite {
    throw new Error('createEnemySprite must be implemented in derived classes');
  }

  protected setRandomPosition(animation: PIXI.AnimatedSprite): void {
    const screenWidth = this.app.screen.width;
    const screenHeight = this.app.screen.height;

    const borderOffset = -150;

    // Randomly choose whether to spawn near the horizontal or vertical border
    const spawnNearHorizontal = Math.random() < 0.5;

    if (spawnNearHorizontal) {
      // Spawn near the left or right border
      const spawnOnLeft = Math.random() < 0.5;
      animation.x = spawnOnLeft
        ? Math.max(0, -borderOffset) // Ensure enemy stays inside left border
        : Math.min(screenWidth, screenWidth + borderOffset); // Ensure enemy stays inside right border

      animation.y = Math.random() * screenHeight;
    } else {
      // Spawn near the top or bottom border
      const spawnOnTop = Math.random() < 0.5;
      animation.x = Math.random() * screenWidth;
      animation.y = spawnOnTop
        ? Math.max(0, -borderOffset) // Ensure enemy stays inside top border
        : Math.min(screenHeight, screenHeight + borderOffset); // Ensure enemy stays inside bottom border
    }
  }

  public update(): void {}
}
