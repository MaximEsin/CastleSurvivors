import * as PIXI from 'pixi.js';

export class Projectile {
  protected app: PIXI.Application;
  protected projectileSprite: PIXI.Sprite;
  protected speed: number;
  protected direction: PIXI.Point;
  protected _isDestroyed: boolean = false;
  public damage: number;

  constructor(
    app: PIXI.Application,
    x: number,
    y: number,
    speed: number,
    projectileSprite: string,
    direction: PIXI.Point,
    damage: number
  ) {
    this.app = app;
    this.projectileSprite = new PIXI.Sprite(
      PIXI.Texture.from(projectileSprite)
    );
    this.projectileSprite.anchor.set(0.5);
    this.projectileSprite.position.set(x, y);
    this.speed = speed;
    this.direction = direction;
    this.damage = damage;

    app.stage.addChild(this.projectileSprite);
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
    // Remove projectile from the stage
    this.app.stage.removeChild(this.projectileSprite);
    this._isDestroyed = true;
  }

  public getSprite() {
    return this.projectileSprite;
  }

  get isDestroyed(): boolean {
    return this._isDestroyed;
  }
}
