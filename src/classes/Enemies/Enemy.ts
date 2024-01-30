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

  public update(): void {}
}
