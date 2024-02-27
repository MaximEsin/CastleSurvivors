import * as PIXI from 'pixi.js';
import { AnimationManager } from '../Managers/AnimationManager';
import { Enemy } from './Enemy';
import { Player } from '../Player';
import { LootType } from './Enemy';

export class Eye extends Enemy {
  private standingAnimation: PIXI.Texture[];
  private movingAnimation: PIXI.Texture[];
  private damagedAnimation: PIXI.Texture[];

  constructor(
    animationManager: AnimationManager,
    app: PIXI.Application,
    layer: PIXI.Container<PIXI.DisplayObject>,
    isMobile: boolean
  ) {
    super(animationManager, app, 20, layer, isMobile);
    this.standingAnimation = this.animationManager.getEyeFlyingAnimation();
    this.movingAnimation = this.animationManager.getEyeFlyingAnimation();
    this.damagedAnimation = this.animationManager.getEyeDamagedAnimation();
    this.lootType = LootType.Diamond;
  }

  protected createEnemySprite(): PIXI.AnimatedSprite {
    const eyeTextures = this.animationManager.getMushroomStandingAnimation();
    const animation = new PIXI.AnimatedSprite(eyeTextures);

    this.enemySprite = animation;

    super.handleMobileResize();

    this.setRandomPosition(animation);

    animation.animationSpeed = 0.1;
    animation.anchor.set(0.5);
    animation.play();

    return animation;
  }

  public resetEye(): void {
    this.setRandomPosition(this.enemySprite);
    this.projectiles.forEach((projectile) => projectile.destroy());
    this.projectiles = [];
  }

  override getDeathState(): boolean {
    return super.getDeathState();
  }

  override handleDeath(): void {
    super.handleDeath();
  }

  public update(player: Player): void {
    super.update(player);
    super.attack('/Enemies/Eye/projectile/Slime.png', 20);
    this.updateAnimation(
      this.standingAnimation,
      this.movingAnimation,
      this.damagedAnimation
    );
  }
}
