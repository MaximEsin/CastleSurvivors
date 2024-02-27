import * as PIXI from 'pixi.js';
import { AnimationManager } from '../Managers/AnimationManager';
import { Enemy, LootType } from './Enemy';
import { Player } from '../Player';

export class Mushroom extends Enemy {
  private standingAnimation: PIXI.Texture[];
  private movingAnimation: PIXI.Texture[];
  private damagedAnimation: PIXI.Texture[];

  constructor(
    animationManager: AnimationManager,
    app: PIXI.Application,
    layer: PIXI.Container<PIXI.DisplayObject>,
    isMobile: boolean
  ) {
    super(animationManager, app, 10, layer, isMobile);
    this.standingAnimation =
      this.animationManager.getMushroomStandingAnimation();
    this.movingAnimation = this.animationManager.getMushroomMovingAnimation();
    this.damagedAnimation = this.animationManager.getMushroomDamagedAnimation();
    this.lootType = LootType.Coin;
  }

  protected createEnemySprite(): PIXI.AnimatedSprite {
    const mushroomTextures =
      this.animationManager.getMushroomStandingAnimation();
    const animation = new PIXI.AnimatedSprite(mushroomTextures);

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
    super.attack('/Enemies/Mushroom/projectile/projectile.png', 10);
    this.updateAnimation(
      this.standingAnimation,
      this.movingAnimation,
      this.damagedAnimation
    );
  }
}
