import * as PIXI from 'pixi.js';
import { AnimationManager } from '../AnimationManager';
import { Enemy } from './Enemy';

export class Skeleton extends Enemy {
  private standingAnimation: PIXI.Texture[];
  private movingAnimation: PIXI.Texture[];
  private damagedAnimation: PIXI.Texture[];

  constructor(animationManager: AnimationManager, app: PIXI.Application) {
    super(animationManager, app, 50);
    this.standingAnimation =
      this.animationManager.getSkeletonStandingAnimation();
    this.movingAnimation = this.animationManager.getSkeletonMovingAnimation();
    this.damagedAnimation = this.animationManager.getSkeletonDamagedAnimation();
  }

  protected createEnemySprite(): PIXI.AnimatedSprite {
    const skeletonTextures =
      this.animationManager.getSkeletonStandingAnimation();
    const animation = new PIXI.AnimatedSprite(skeletonTextures);

    this.enemySprite = animation;

    this.setRandomPosition(animation);

    animation.animationSpeed = 0.1;
    animation.play();

    this.app.stage.addChild(animation);

    return animation;
  }

  public switchToStandingAnimation(): void {
    super.switchToStandingAnimation(this.standingAnimation);
  }

  override getDeathState(): boolean {
    return super.getDeathState();
  }

  override handleDeath(): void {
    super.handleDeath();
  }

  public update(): void {
    super.update();
    super.attack('./public/Enemies/Skeleton/projectile/bones.png', 30);
    this.updateAnimation(
      this.standingAnimation,
      this.movingAnimation,
      this.damagedAnimation
    );
  }
}
