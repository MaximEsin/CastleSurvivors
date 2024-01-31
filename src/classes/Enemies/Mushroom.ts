import * as PIXI from 'pixi.js';
import { AnimationManager } from '../AnimationManager';
import { Enemy } from './Enemy';
import { Projectile } from '../Projectile';

export class Mushroom extends Enemy {
  private standingAnimation: PIXI.Texture[];
  private movingAnimation: PIXI.Texture[];

  constructor(animationManager: AnimationManager, app: PIXI.Application) {
    super(animationManager, app);
    this.standingAnimation =
      this.animationManager.getMushroomStandingAnimation();
    this.movingAnimation = this.animationManager.getMushroomMovingAnimation();
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

  public getProjectiles(): Projectile[] {
    return this.projectiles;
  }

  public switchToStandingAnimation(): void {
    super.switchToStandingAnimation(this.standingAnimation);
  }

  public update(): void {
    super.update();
    super.attack('./public/Enemies/Mushroom/projectile/projectile.png', 10);
    this.updateAnimation(this.standingAnimation, this.movingAnimation);
  }
}
