import * as PIXI from 'pixi.js';
import { AnimationManager } from '../AnimationManager';
import { Enemy } from './Enemy';

export class Mushroom extends Enemy {
  private standingAnimation: PIXI.Texture[];
  private movingAnimation: PIXI.Texture[];
  private damagedAnimation: PIXI.Texture[];

  constructor(animationManager: AnimationManager, app: PIXI.Application) {
    super(animationManager, app, 10);
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
    super.attack('/Enemies/Mushroom/projectile/projectile.png', 10);
    this.updateAnimation(
      this.standingAnimation,
      this.movingAnimation,
      this.damagedAnimation
    );
  }
}
