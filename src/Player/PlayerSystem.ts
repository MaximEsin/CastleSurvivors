import * as PIXI from 'pixi.js';
import { System, Entity } from 'tick-knock';
import { engine } from '../Engine';
import { Position } from '../Components/Position';
import { PlayerComponent } from './PlayerComponent';
import { Health } from '../Components/Health';

export class PlayerSystem extends System {
  private playerEntity: Entity | null = null;

  constructor(private app: PIXI.Application) {
    super();
    this.createPlayer();
  }

  private createPlayer() {
    this.playerEntity = new Entity();

    const position = new Position(
      this.app.screen.width / 2,
      this.app.screen.height / 2
    );
    this.playerEntity.add(position);
    this.playerEntity.add(new PlayerComponent());
    this.playerEntity.add(new Health(10));

    const standingTextures = [];
    for (let i = 1; i <= 4; i++) {
      standingTextures.push(
        PIXI.Texture.from(`/Player/standing/standing${i}.png`)
      );
    }

    const playerSprite = new PIXI.AnimatedSprite(standingTextures);

    playerSprite.anchor.set(0.5);

    const initialPosition = this.playerEntity.get(Position);
    if (initialPosition) {
      playerSprite.position.set(initialPosition.x, initialPosition.y);
    }

    playerSprite.animationSpeed = 0.1;
    playerSprite.textures = standingTextures;
    playerSprite.play();

    this.playerEntity.add(playerSprite);

    engine.addEntity(this.playerEntity);

    this.app.stage.addChild(playerSprite);
  }

  update() {
    if (this.playerEntity) {
      const position = this.playerEntity.get(Position);
      const playerSprite = this.playerEntity.get<PIXI.AnimatedSprite>(
        PIXI.AnimatedSprite
      );
      if (position && playerSprite) {
        playerSprite.position.set(position.x, position.y);
      }
    }
  }
}
