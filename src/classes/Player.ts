import * as PIXI from 'pixi.js';
import { AnimationManager } from './AnimationManager';

export class Player {
  private app: PIXI.Application;
  private animationManager: AnimationManager;
  private playerSprite: PIXI.AnimatedSprite;

  constructor(animationManager: AnimationManager, app: PIXI.Application) {
    this.animationManager = animationManager;
    this.app = app;
    this.playerSprite = this.createPlayerSprite();
  }

  private createPlayerSprite(): PIXI.AnimatedSprite {
    const playerTextures = this.animationManager.getPlayerStandingAnimation();
    const animation = new PIXI.AnimatedSprite(playerTextures);
    animation.x = window.innerWidth / 2 - 100;
    animation.y = window.innerHeight / 2 - 100;
    animation.animationSpeed = 0.2;
    animation.play();

    this.app.stage.addChild(animation);

    return animation;
  }
}
