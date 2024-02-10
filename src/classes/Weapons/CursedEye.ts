import * as PIXI from 'pixi.js';
import { Projectile } from '../Projectile';

export class CursedEye extends Projectile {
  constructor(
    app: PIXI.Application,
    x: number,
    y: number,
    direction: PIXI.Point,
    damage: number
  ) {
    const eyeTexture = '/Player/weapons/eye.png';
    super(app, x, y, 8, eyeTexture, direction, damage);
  }

  public update(): void {
    super.update();

    this.getSprite().x += this.speed * this.direction.x;
    this.getSprite().y += this.speed * this.direction.y;

    if (
      this.getSprite().x < 0 ||
      this.getSprite().x > this.app.screen.width ||
      this.getSprite().y < 0 ||
      this.getSprite().y > this.app.screen.height
    ) {
      this.destroy();
    }
  }
}