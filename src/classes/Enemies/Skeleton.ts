import * as PIXI from 'pixi.js';
import { AnimationManager } from '../AnimationManager';
import { Enemy } from './Enemy';

export class Skeleton extends Enemy {
  protected layer: PIXI.Container<PIXI.DisplayObject>;
  private standingAnimation: PIXI.Texture[];
  private movingAnimation: PIXI.Texture[];
  private damagedAnimation: PIXI.Texture[];

  constructor(
    animationManager: AnimationManager,
    app: PIXI.Application,
    layer: PIXI.Container<PIXI.DisplayObject>
  ) {
    super(animationManager, app, 50, layer);
    this.layer = layer;
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
    animation.anchor.set(0.5);
    animation.play();

    this.layer.addChild(animation);

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
    super.attack('/Enemies/Skeleton/projectile/bones.png', 30);
    this.updateAnimation(
      this.standingAnimation,
      this.movingAnimation,
      this.damagedAnimation
    );
  }
}
