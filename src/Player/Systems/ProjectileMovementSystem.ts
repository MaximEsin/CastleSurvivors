import { System } from 'tick-knock';
import { Position } from '../../Components/Position';
import { Velocity } from '../../Components/Velocity';
import { ProjectileComponent } from '../Components/Projectile';

export class PlayerProjectileMovementSystem extends System {
  update(delta: number) {
    this.engine.entities.forEach((entity) => {
      if (
        entity.has(Position) &&
        entity.has(Velocity) &&
        entity.has(ProjectileComponent)
      ) {
        const position = entity.get(Position);
        const velocity = entity.get(Velocity);
        if (position && velocity) {
          position.x += velocity.x * delta * 3;
          position.y += velocity.y * delta * 3;
        }
      }
    });
  }
}
