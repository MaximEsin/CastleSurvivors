import * as PIXI from 'pixi.js';
import { System } from 'tick-knock';
import { Position } from '../../Components/Position';
import { Velocity } from '../../Components/Velocity';
import { Entity } from 'tick-knock';

export class ProjectileMovementSystem extends System {
  private app: PIXI.Application;

  constructor(app: PIXI.Application) {
    super();
    this.app = app;
  }

  update(delta: number) {
    this.engine.entities.forEach((entity) => {
      if (
        entity.hasTag('Projectile') &&
        entity.has(Position) &&
        entity.has(Velocity)
      ) {
        const position = entity.get(Position);
        const velocity = entity.get(Velocity);
        const sprite = entity.get<PIXI.Sprite>(PIXI.Sprite);

        if (position && velocity && sprite) {
          position.x += velocity.x * delta * 3;
          position.y += velocity.y * delta * 3;

          sprite.x = position.x;
          sprite.y = position.y;

          this.handleBoundaryCollision(position, entity, sprite);
        }
      }
    });
  }

  private handleBoundaryCollision(
    position: Position,
    entity: Entity,
    sprite: PIXI.Sprite
  ) {
    if (
      position.x < 20 ||
      position.x > this.app.screen.width - 20 ||
      position.y < 20 ||
      position.y > this.app.screen.height * 0.85
    ) {
      this.engine.removeEntity(entity);
      this.app.stage.removeChild(sprite);
    }
  }
}
