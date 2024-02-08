import * as PIXI from 'pixi.js';
import { System } from 'tick-knock';
import { Entity } from 'tick-knock';
import { PlayerComponent } from '../Components/PlayerComponent';
import { Position } from '../../Components/Position';

export class PlayerWrapSystem extends System {
  constructor(private app: PIXI.Application) {
    super();
  }

  update() {
    const playerEntities: ReadonlyArray<Entity> = this.engine.entities.filter(
      (entity) => entity.has(PlayerComponent)
    );

    playerEntities.forEach((entity) => {
      const position = entity.get<Position>(Position);
      if (!position) return;

      if (position.x < 20) {
        position.x = this.app.screen.width - 20;
      } else if (position.x > this.app.screen.width - 20) {
        position.x = 20;
      }

      if (position.y < 20) {
        position.y = this.app.screen.height * 0.85;
      } else if (position.y > this.app.screen.height * 0.85) {
        position.y = 20;
      }
    });
  }
}
