import * as PIXI from 'pixi.js';
import { AnimationManager } from '../GameCore/AnimationManager';

export class Player {
  private playerSprite: PIXI.AnimatedSprite;

  constructor() {
    this.playerSprite = this.createPlayer();
  }

  private createPlayer() {
    const playerTextures = AnimationManager.getPlayerStandingAnimation();
    const animation = new PIXI.AnimatedSprite(playerTextures);
    animation.anchor.set(0.5);
    animation.animationSpeed = 0.1;
    animation.play();
    return animation;
  }

  public getSprite() {
    return this.playerSprite;
  }
}
