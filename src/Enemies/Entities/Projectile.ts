import { Entity } from 'tick-knock';
import * as PIXI from 'pixi.js';
import { Position } from '../../Components/Position';
import { Velocity } from '../../Components/Velocity';

export class EnemyProjectileEntity extends Entity {
  public position: Position;
  public velocity: Velocity;
  public sprite: PIXI.Sprite;

  constructor(position: Position, velocity: Velocity, sprite: PIXI.Sprite) {
    super();
    this.position = position;
    this.velocity = velocity;
    this.sprite = sprite;
    this.add(position);
    this.add(velocity);
    this.add(sprite);
    this.addTag('Projectile');
  }
}
