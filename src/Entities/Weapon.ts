import * as PIXI from 'pixi.js';

export class Weapon extends PIXI.Container {
  private app: PIXI.Application;
  private projectileSprite: PIXI.Sprite;
  private speed: number = 8;
  private direction: PIXI.Point;
  private isDestroyed: boolean = false;
  private damage: number = 5;

  constructor(
    app: PIXI.Application,
    x: number,
    y: number,
    direction: PIXI.Point
  ) {
    super();
    this.app = app;
    this.projectileSprite = new PIXI.Sprite(
      PIXI.Texture.from('/Player/weapons/knife.png')
    );
    this.projectileSprite.anchor.set(0.5);
    this.projectileSprite.position.set(x, y);
    this.direction = direction;
  }

  public handleWeaponMovement(): void {
    this.projectileSprite.x += this.speed * this.direction.x;
    this.projectileSprite.y += this.speed * this.direction.y;

    if (
      this.getSprite().x < 0 ||
      this.getSprite().x > this.app.screen.width ||
      this.getSprite().y < 0 ||
      this.getSprite().y > this.app.screen.height
    ) {
      this.destroy();
    }
  }

  public destroy(): void {
    this.isDestroyed = true;
  }

  public getSprite() {
    return this.projectileSprite;
  }

  public getisDestroyed(): boolean {
    return this.isDestroyed;
  }

  public getDamage() {
    return this.damage;
  }
}
