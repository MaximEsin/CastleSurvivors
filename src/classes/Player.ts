import * as PIXI from 'pixi.js';
import { AnimationManager } from './AnimationManager';

export class Player {
  private animationManager: AnimationManager;
  private playerSprite: PIXI.AnimatedSprite;

  constructor(animationManager: AnimationManager) {
    this.animationManager = animationManager;
    this.playerSprite = this.createPlayerSprite();
  }

  private createPlayerSprite(): PIXI.AnimatedSprite {
    const playerTextures = this.loadPlayerTextures(19);

    return this.animationManager.createAnimation(playerTextures, 0, 0);
  }

  private loadPlayerTextures(frameCount: number): string[] {
    const texturePaths: string[] = [];

    for (let i = 0; i < frameCount; i++) {
      const texturePath = `./public/Player/standing/standing${i}.png`;
      texturePaths.push(texturePath);
    }

    return texturePaths;
  }
}
