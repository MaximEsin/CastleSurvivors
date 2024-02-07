import * as PIXI from 'pixi.js';
import { System } from 'tick-knock';
import { Entity } from 'tick-knock';
import { PlayerComponent } from './PlayerComponent';
import { Position } from '../Components/Position';

export class PlayerWrapSystem extends System {
  constructor(private app: PIXI.Application) {
    super();
  }

  update(delta: number) {
    const playerEntities: ReadonlyArray<Entity> = this.engine.entities.filter(
      (entity) => entity.has(PlayerComponent)
    );

    playerEntities.forEach((entity) => {
      const position = entity.get<Position>(Position);
      if (!position) return;

      if (position.x < 0) {
        position.x = this.app.screen.width;
      } else if (position.x > this.app.screen.width) {
        position.x = 0;
      }

      if (position.y < 0) {
        position.y = this.app.screen.height;
      } else if (position.y > this.app.screen.height) {
        position.y = 0;
      }
    });
  }
}
