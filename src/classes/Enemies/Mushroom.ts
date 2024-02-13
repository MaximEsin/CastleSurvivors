import * as PIXI from 'pixi.js';
import { AnimationManager } from '../Managers/AnimationManager';
import { Enemy } from './Enemy';
import { Coin } from '../Money/Coin';

export class Mushroom extends Enemy {
  protected layer: PIXI.Container<PIXI.DisplayObject>;
  private standingAnimation: PIXI.Texture[];
  private movingAnimation: PIXI.Texture[];
  private damagedAnimation: PIXI.Texture[];

  constructor(
    animationManager: AnimationManager,
    app: PIXI.Application,
    layer: PIXI.Container<PIXI.DisplayObject>
  ) {
    super(animationManager, app, 10, layer);
    this.layer = layer;
    this.standingAnimation =
      this.animationManager.getMushroomStandingAnimation();
    this.movingAnimation = this.animationManager.getMushroomMovingAnimation();
    this.damagedAnimation = this.animationManager.getMushroomDamagedAnimation();
  }

  protected createEnemySprite(): PIXI.AnimatedSprite {
    const mushroomTextures =
      this.animationManager.getMushroomStandingAnimation();
    const animation = new PIXI.AnimatedSprite(mushroomTextures);

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
    return new Coin(
      this.app,
      this.getSprite().x,
      this.getSprite().y,
      '/Shop/coin.png',
      this.layer
    );
  }

  public update(): void {
    super.update();
    super.attack('/Enemies/Mushroom/projectile/projectile.png', 10);
    this.updateAnimation(
      this.standingAnimation,
      this.movingAnimation,
      this.damagedAnimation
    );
  }
}
