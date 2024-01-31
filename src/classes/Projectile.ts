import * as PIXI from 'pixi.js';

export class Projectile {
  private app: PIXI.Application;
  private projectileSprite: PIXI.Sprite;
  private speed: number;
  private direction: PIXI.Point;
  private _isDestroyed: boolean = false;

  constructor(
    app: PIXI.Application,
    x: number,
    y: number,
    speed: number,
    projectileSprite: string,
    direction: PIXI.Point
  ) {
    this.app = app;
    this.projectileSprite = new PIXI.Sprite(
      PIXI.Texture.from(projectileSprite)
    );
    this.projectileSprite.anchor.set(0.5);
    this.projectileSprite.position.set(x, y);
    this.speed = speed;
    this.direction = direction;

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

  get isDestroyed(): boolean {
    return this._isDestroyed;
  }
}
