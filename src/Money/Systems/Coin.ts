import * as PIXI from 'pixi.js';
import { System } from 'tick-knock';
import { Position } from '../../Components/Position';
import { CoinComponent } from '../Components/Coint';
import { PlayerComponent } from '../../Player/Components/PlayerComponent';
import { Entity } from 'tick-knock';
import { PlayerInterfaceSystem } from '../../Systems/Interface';

export class CoinSystem extends System {
  private app: PIXI.Application;
  private playerInterface: PlayerInterfaceSystem;

  constructor(app: PIXI.Application, playerInterface: PlayerInterfaceSystem) {
    super();
    this.app = app;
    this.playerInterface = playerInterface;
  }

  update() {
    const playerEntity = this.engine.entities.find((entity) =>
      entity.has(PlayerComponent)
    );
    if (!playerEntity) return;

    const playerPosition = playerEntity.get(Position);

    this.engine.entities.forEach((entity) => {
      if (entity.has(Position) && entity.has(CoinComponent)) {
        const coinPosition = entity.get(Position);

        if (playerPosition && coinPosition) {
          if (
            Math.sqrt(
              Math.pow(playerPosition.x - coinPosition.x, 2) +
                Math.pow(playerPosition.y - coinPosition.y, 2)
            ) < 50
          ) {
            this.collectCoin(entity);
          }
        }
      }
    });
  }

  private collectCoin(coinEntity: Entity) {
    this.engine.removeEntity(coinEntity);
    const coinSprite = coinEntity.get<PIXI.Sprite>(PIXI.Sprite);
    if (coinSprite) this.app.stage.removeChild(coinSprite);
    this.playerInterface.increaseCoinCount(1);
  }
}
