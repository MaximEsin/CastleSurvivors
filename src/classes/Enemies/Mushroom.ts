import * as PIXI from 'pixi.js';
import { AnimationManager } from '../AnimationManager';
import { Enemy } from './Enemy';
import { Projectile } from '../Projectile';
import { Coin } from '../Coin';

export class Mushroom extends Enemy {
  private standingAnimation: PIXI.Texture[];
  private movingAnimation: PIXI.Texture[];
  private damagedAnimation: PIXI.Texture[];
  private coins: Coin[] = [];

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

  public getProjectiles(): Projectile[] {
    return this.projectiles;
  }

  public switchToStandingAnimation(): void {
    super.switchToStandingAnimation(this.standingAnimation);
  }

  public resetMushroom(): void {
    this.setRandomPosition(this.enemySprite);
    this.projectiles.forEach((projectile) => projectile.destroy());
    this.projectiles = [];
  }

  override getDeathState(): boolean {
    return super.getDeathState();
  }

  override handleDeath(): void {
    super.handleDeath();
    const coin = new Coin(this.app, this.enemySprite.x, this.enemySprite.y);
    this.coins.push(coin);
    if (coin.getIsCollected()) {
      this.coins.filter((c) => c !== coin);
    }
  }

  getCoins() {
    return this.coins;
  }

  public update(): void {
    super.update();
    super.attack('./public/Enemies/Mushroom/projectile/projectile.png', 10);
    this.updateAnimation(
      this.standingAnimation,
      this.movingAnimation,
      this.damagedAnimation
    );
  }
}
