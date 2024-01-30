import * as PIXI from 'pixi.js';
import { AnimationManager } from '../AnimationManager';

export class Enemy {
  protected app: PIXI.Application;
  protected animationManager: AnimationManager;
  protected enemySprite: PIXI.AnimatedSprite;
  protected direction: PIXI.Point = new PIXI.Point(1, 0);

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

  protected moveRandomly(): void {
    const speed = 2;

    // Move the enemy in the current direction
    this.enemySprite.x += this.direction.x * speed;
    this.enemySprite.y += this.direction.y * speed;
  }

  protected updateAnimation(
    standingFrames: PIXI.Texture[],
    movingFrames: PIXI.Texture[]
  ): void {
    // Update the animation based on the movement state
    if (
      this.direction.x !== 0 || // Moving horizontally
      this.direction.y !== 0 // Moving vertically
    ) {
      // Switch to moving animation
      if (
        !this.enemySprite.playing ||
        this.enemySprite.textures !== movingFrames
      ) {
        this.enemySprite.textures = movingFrames;
        this.enemySprite.play();
      }
    } else {
      // Switch to standing animation
      if (
        !this.enemySprite.playing ||
        this.enemySprite.textures !== standingFrames
      ) {
        this.enemySprite.textures = standingFrames;
        this.enemySprite.play();
      }
    }

    // Play the animation
    if (!this.enemySprite.playing) {
      this.enemySprite.play();
    }
  }
}
