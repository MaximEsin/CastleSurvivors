import * as PIXI from 'pixi.js';
import { AnimationManager } from '../Managers/AnimationManager';
import { Enemy, LootType } from './Enemy';
import { Player } from '../Player';

export class Skeleton extends Enemy {
  private standingAnimation: PIXI.Texture[];
  private movingAnimation: PIXI.Texture[];
  private damagedAnimation: PIXI.Texture[];

  constructor(
    animationManager: AnimationManager,
    app: PIXI.Application,
    layer: PIXI.Container<PIXI.DisplayObject>,
    isMobile: boolean
  ) {
    super(animationManager, app, 50, layer, isMobile);
    this.standingAnimation =
      this.animationManager.getSkeletonStandingAnimation();
    this.movingAnimation = this.animationManager.getSkeletonMovingAnimation();
    this.damagedAnimation = this.animationManager.getSkeletonDamagedAnimation();
    this.lootType = LootType.MegaDiamond;
  }

  protected createEnemySprite(): PIXI.AnimatedSprite {
    const skeletonTextures =
      this.animationManager.getSkeletonStandingAnimation();
    const animation = new PIXI.AnimatedSprite(skeletonTextures);

    this.enemySprite = animation;

    super.handleMobileResize();

    this.setRandomPosition(animation);

    animation.animationSpeed = 0.1;
    animation.anchor.set(0.5);
    animation.play();

    return animation;
  }

  override getDeathState(): boolean {
    return super.getDeathState();
  }

  override handleDeath(): void {
    super.handleDeath();
  }

  public update(player: Player): void {
    super.update(player);
    super.attack('/Enemies/Skeleton/projectile/bones.png', 30);
    this.updateAnimation(
      this.standingAnimation,
      this.movingAnimation,
      this.damagedAnimation
    );
  }
}
