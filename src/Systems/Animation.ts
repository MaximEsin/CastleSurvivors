import * as PIXI from 'pixi.js';
import { System } from 'tick-knock';
import { engine } from '../Engine';
import { PlayerComponent } from '../Player/PlayerComponent';
import { Entity } from 'tick-knock';
import { Position } from '../Components/Position';

export class AnimationSystem extends System {
  private lastPlayerPositions: Map<Entity, Position> = new Map();

  update() {
    const playerEntities: ReadonlyArray<Entity> = engine.entities.filter(
      (entity) => entity.has(PlayerComponent)
    );

    playerEntities.forEach((entity) => {
      const playerSprite = entity.get<PIXI.AnimatedSprite>(PIXI.AnimatedSprite);
      const position = entity.get<Position>(Position);
      if (!playerSprite || !position) return;

      const lastPosition = this.lastPlayerPositions.get(entity);

      const movingTextures = [];
      for (let i = 1; i <= 8; i++) {
        movingTextures.push(PIXI.Texture.from(`/Player/moving/moving${i}.png`));
      }

      const standingTextures = [];
      for (let i = 1; i <= 4; i++) {
        standingTextures.push(
          PIXI.Texture.from(`/Player/standing/standing${i}.png`)
        );
      }

      let texturesToUse = standingTextures;

      if (
        lastPosition &&
        (lastPosition.x !== position.x || lastPosition.y !== position.y)
      ) {
        texturesToUse = movingTextures;

        if (position.x < lastPosition.x) {
          playerSprite.scale.x = -1;
        } else {
          playerSprite.scale.x = 1;
        }
      }

      if (playerSprite.textures.length !== texturesToUse.length) {
        playerSprite.textures = texturesToUse;

        if (!playerSprite.playing) {
          playerSprite.play();
        }
      }

      this.lastPlayerPositions.set(entity, { x: position.x, y: position.y });
    });
  }
}
