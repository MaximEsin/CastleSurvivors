import * as PIXI from 'pixi.js';
import { AnimationManager } from '../Managers/AnimationManager';
import { Enemy } from './Enemy';
import { MegaDiamond } from '../Money/MegaDiamond';

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

  override getDeathState(): boolean {
    return super.getDeathState();
  }

  override handleDeath(): void {
    super.handleDeath();
  }

  override spawnCoin() {
    super.spawnCoin();
    return new MegaDiamond(
      this.app,
      this.getSprite().x,
      this.getSprite().y,
      '/Shop/megaDiamond.png',
      this.layer
    );
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
