import * as PIXI from 'pixi.js';
import { Projectile } from '../Projectile';

export class Kebab extends Projectile {
  constructor(
    app: PIXI.Application,
    layer: PIXI.Container<PIXI.DisplayObject>,
    x: number,
    y: number,
    direction: PIXI.Point,
    damage: number,
    rotation: number
  ) {
    const kebabTexture = '/Player/weapons/kebab.png';
    super(app, layer, x, y, 8, kebabTexture, direction, damage);

    this.getSprite().rotation = rotation;
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
