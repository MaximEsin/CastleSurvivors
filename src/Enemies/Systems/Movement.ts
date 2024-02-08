import * as PIXI from 'pixi.js';
import { System } from 'tick-knock';
import { Position } from '../../Components/Position';
import { EnemyComponent } from '../Components/Enemy';

export class EnemyMovementSystem extends System {
  private app: PIXI.Application;

  constructor(app: PIXI.Application) {
    super();
    this.app = app;
  }

  update() {
    this.engine.entities.forEach((entity) => {
      if (
        entity.has(Position) &&
        entity.has(EnemyComponent) &&
        entity.has(PIXI.AnimatedSprite)
      ) {
        const position = entity.get(Position);
        const enemyData = entity.get(EnemyComponent);
        const sprite = entity.get<PIXI.AnimatedSprite>(PIXI.AnimatedSprite);

        if (position && enemyData && sprite) {
          const speed = 2;

          position.x += enemyData.enemyDirectionX * speed;
          position.y += enemyData.enemyDirectionY * speed;

          if (enemyData.enemyDirectionX < 0) {
            sprite.scale.x = -1;
          } else {
            sprite.scale.x = 1;
          }

          if (position.x < 20 || position.x > this.app.screen.width - 20) {
            enemyData.enemyDirectionX *= -1;
          }
          if (position.y < 30 || position.y > this.app.screen.height * 0.85) {
            enemyData.enemyDirectionY *= -1;
          }

          if (position && enemyData && entity.has(PIXI.AnimatedSprite)) {
            const sprite = entity.get<PIXI.AnimatedSprite>(PIXI.AnimatedSprite);

            if (sprite && enemyData) {
              sprite.position.set(position.x, position.y);
            }
          }
        }
      }
    });
  }
}
