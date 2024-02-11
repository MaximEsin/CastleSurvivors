import * as PIXI from 'pixi.js';
import { Enemy } from './Enemies/Enemy';

export class Projectile {
  protected app: PIXI.Application;
  protected layer: PIXI.Container<PIXI.DisplayObject>;
  protected projectileSprite: PIXI.Sprite;
  protected speed: number;
  protected direction: PIXI.Point;
  protected _isDestroyed: boolean = false;
  public damage: number;
  private collisionCooldown: boolean = false;

  constructor(
    app: PIXI.Application,
    layer: PIXI.Container<PIXI.DisplayObject>,
    x: number,
    y: number,
    speed: number,
    projectileSprite: string,
    direction: PIXI.Point,
    damage: number
  ) {
    this.app = app;
    this.layer = layer;
    this.projectileSprite = new PIXI.Sprite(
      PIXI.Texture.from(projectileSprite)
    );
    this.projectileSprite.anchor.set(0.5);
    this.projectileSprite.position.set(x, y);
    this.speed = speed;
    this.direction = direction;
    this.damage = damage;

    layer.addChild(this.projectileSprite);
  }

  public update(): void {
    this.projectileSprite.x += this.speed * this.direction.x;
    this.projectileSprite.y += this.speed * this.direction.y;

    // Check if the projectile hit the game border
    if (this.projectileSprite.x > this.app.screen.width) {
      this.destroy();
    }
  }

  public destroy(): void {
    this.layer.removeChild(this.projectileSprite);
    this._isDestroyed = true;
  }

  public getSprite() {
    return this.projectileSprite;
  }

  get isDestroyed(): boolean {
    return this._isDestroyed;
  }

  public checkEnemyCollision(enemies: Enemy[]): void {
    if (this.collisionCooldown) {
      return;
    }

    for (const enemy of enemies) {
      if (
        this.projectileSprite
          .getBounds()
          .intersects(enemy.getSprite().getBounds())
      ) {
        enemy.receiveDamage(this.damage);
        this.destroy();
        this.setCollisionCooldown();
        break;
      }
    }
  }

  private setCollisionCooldown(): void {
    this.collisionCooldown = true;
    setTimeout(() => {
      this.collisionCooldown = false;
    }, 1000);
  }
}
