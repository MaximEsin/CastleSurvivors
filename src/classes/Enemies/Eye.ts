import * as PIXI from 'pixi.js';
import { AnimationManager } from '../Managers/AnimationManager';
import { Enemy } from './Enemy';
import { Diamond } from '../Money/Diamond';

export class Eye extends Enemy {
  protected layer: PIXI.Container<PIXI.DisplayObject>;
  private standingAnimation: PIXI.Texture[];
  private movingAnimation: PIXI.Texture[];
  private damagedAnimation: PIXI.Texture[];

  constructor(
    animationManager: AnimationManager,
    app: PIXI.Application,
    layer: PIXI.Container<PIXI.DisplayObject>
  ) {
    super(animationManager, app, 20, layer);
    this.layer = layer;
    this.standingAnimation = this.animationManager.getEyeFlyingAnimation();
    this.movingAnimation = this.animationManager.getEyeFlyingAnimation();
    this.damagedAnimation = this.animationManager.getEyeDamagedAnimation();
  }

  protected createEnemySprite(): PIXI.AnimatedSprite {
    const eyeTextures = this.animationManager.getMushroomStandingAnimation();
    const animation = new PIXI.AnimatedSprite(eyeTextures);

    this.enemySprite = animation;

    this.setRandomPosition(animation);

    animation.animationSpeed = 0.1;
    animation.anchor.set(0.5);
    animation.play();

    this.layer.addChild(animation);

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

  override spawnCoin() {
    super.spawnCoin();
    return new Diamond(
      this.app,
      this.getSprite().x,
      this.getSprite().y,
      '/Shop/diamond.png',
      this.layer
    );
  }

  public update(): void {
    super.update();
    super.attack('/Enemies/Eye/projectile/Slime.png', 20);
    this.updateAnimation(
      this.standingAnimation,
      this.movingAnimation,
      this.damagedAnimation
    );
  }
}
