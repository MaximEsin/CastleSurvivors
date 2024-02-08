import * as PIXI from 'pixi.js';
import { System } from 'tick-knock';
import { Position } from '../../Components/Position';
import { EnemyComponent } from '../Components/Enemy';
import { MushroomSystem } from './Mushroom';
import { MushroomComponent } from '../Components/Mushroom';

export class EnemyAnimationSystem extends System {
  private mushroomSystem: MushroomSystem;

  constructor(mushroomSystem: MushroomSystem) {
    super();
    this.mushroomSystem = mushroomSystem;
  }

  update() {
    this.engine.entities.forEach((entity) => {
      if (
        entity.has(Position) &&
        entity.has(EnemyComponent) &&
        entity.has(PIXI.AnimatedSprite)
      ) {
        const position = entity.get(Position);
        const enemyComponent = entity.get(EnemyComponent);
        const sprite = entity.get<PIXI.AnimatedSprite>(PIXI.AnimatedSprite);

        let movingTextures: PIXI.Texture[] = [];
        let standingTextures: PIXI.Texture[] = [];

        if (entity.has(MushroomComponent)) {
          movingTextures = this.mushroomSystem.getMovingTextures();
          standingTextures = this.mushroomSystem.getStandingTextures();
        }

        if (position && enemyComponent && sprite) {
          const isMoving =
            enemyComponent.enemyDirectionX !== 0 ||
            enemyComponent.enemyDirectionY !== 0;

          if (isMoving) {
            if (sprite.textures.length < movingTextures.length) {
              sprite.textures = movingTextures;
              sprite.play();
            }
          } else {
            if (sprite.textures !== standingTextures) {
              sprite.textures = standingTextures;
              sprite.play();
            }
          }
        }
      }
    });
  }
}