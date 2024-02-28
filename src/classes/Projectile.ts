import * as PIXI from 'pixi.js';
import { Enemy } from './Enemies/Enemy';

export class Projectile extends PIXI.Container {
  protected app: PIXI.Application;
  protected layer: PIXI.Container<PIXI.DisplayObject>;
  protected projectileSprite: PIXI.Sprite;
  protected speed: number;
  protected direction: PIXI.Point;
  protected _isDestroyed: boolean = false;
  public damage: number;
  private collisionCooldown: boolean = false;
  private isMobile: boolean;

  constructor(
    app: PIXI.Application,
    layer: PIXI.Container<PIXI.DisplayObject>,
    x: number,
    y: number,
    speed: number,
    projectileSprite: string,
    direction: PIXI.Point,
    damage: number,
    isMobile: boolean
  ) {
    super();
    this.app = app;
    this.layer = layer;
    this.isMobile = isMobile;
    this.projectileSprite = new PIXI.Sprite(
      PIXI.Texture.from(projectileSprite)
    );
    this.projectileSprite.anchor.set(0.5);
    this.projectileSprite.position.set(x, y);
    this.speed = speed;
    this.direction = direction;
    this.damage = damage;

    this.handleMobileResize();

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

  public checkEnemyCollision(enemy: Enemy): boolean | void {
    if (this.collisionCooldown) {
      return;
    }
    if (
      this.projectileSprite
        .getBounds()
        .intersects(enemy.getSprite().getBounds())
    ) {
      this.destroy();
      this.setCollisionCooldown();
      return true;
    }
  }

  public getDamage() {
    return this.damage;
  }

  private setCollisionCooldown(): void {
    this.collisionCooldown = true;
    setTimeout(() => {
      this.collisionCooldown = false;
    }, 1000);
  }

  public handleMobileResize() {
    if (this.isMobile) {
      this.projectileSprite.scale.set(0.6);
    }
  }
}
