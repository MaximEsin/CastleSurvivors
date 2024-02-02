import * as PIXI from 'pixi.js';
import { AnimationManager } from './AnimationManager';
import { Player } from './Player';

export class Merchant {
  private app: PIXI.Application;
  private animationManager: AnimationManager;
  private merchantSprite: PIXI.AnimatedSprite;
  private standingTextures: PIXI.Texture[];
  private interactTextures: PIXI.Texture[];
  private metPlayer: boolean = false;

  constructor(app: PIXI.Application, animationManager: AnimationManager) {
    this.app = app;
    this.animationManager = animationManager;
    this.standingTextures =
      this.animationManager.getMerchantStandingAnimation();
    this.interactTextures =
      this.animationManager.getMerchantInteractAnimation();
    this.merchantSprite = this.createMerchantSprite();
  }

  private createMerchantSprite(): PIXI.AnimatedSprite {
    const animation = (this.merchantSprite = new PIXI.AnimatedSprite(
      this.standingTextures
    ));
    animation.animationSpeed = 0.1;
    animation.play();
    this.app.stage.addChild(animation);
    this.spawnRandomly();

    return animation;
  }

  private spawnRandomly(): void {
    const maxX = this.app.screen.width * 0.7 - this.merchantSprite.width;
    const maxY = this.app.screen.height * 0.7 - this.merchantSprite.height;

    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;

    this.merchantSprite.position.set(randomX, randomY);
  }

  public playInteractAnimation(): void {
    if (
      (!this.merchantSprite.playing ||
        this.merchantSprite.textures !== this.interactTextures) &&
      !this.metPlayer
    ) {
      this.merchantSprite.textures = this.interactTextures;
      this.merchantSprite.loop = false;
      this.merchantSprite.play();
      this.metPlayer = true;
    }
  }

  public playStandingAnimation(): void {
    if (
      !this.merchantSprite.playing ||
      this.merchantSprite.textures !== this.standingTextures
    ) {
      this.merchantSprite.textures = this.standingTextures;
      this.merchantSprite.loop = true;
      this.merchantSprite.play();
      this.metPlayer = false;
    }
  }

  public checkPlayerCollision(player: Player): void {
    const playerBounds = player.getBounds();
    const merchantBounds = this.merchantSprite.getBounds();

    if (playerBounds.intersects(merchantBounds)) {
      this.playInteractAnimation();
    } else {
      this.playStandingAnimation();
    }
  }
}
