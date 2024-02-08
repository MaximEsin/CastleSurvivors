import * as PIXI from 'pixi.js';
import { System, Entity } from 'tick-knock';
import { Position } from '../../Components/Position';
import { EnemyComponent } from '../Components/Enemy';
import { MushroomComponent } from '../Components/Mushroom';

export class MushroomSystem extends System {
  private app: PIXI.Application;
  private readonly standingTextures: PIXI.Texture[];
  private readonly movingTextures: PIXI.Texture[];
  private mushroomEntity: Entity | null = null;

  constructor(app: PIXI.Application) {
    super();
    this.app = app;
    this.standingTextures = [];
    for (let i = 1; i <= 4; i++) {
      this.standingTextures.push(
        PIXI.Texture.from(`/Enemies/Mushroom/standing/standing${i}.png`)
      );
    }

    this.movingTextures = [];
    for (let i = 1; i <= 8; i++) {
      this.movingTextures.push(
        PIXI.Texture.from(`/Enemies/Mushroom/moving/moving${i}.png`)
      );
    }
  }

  getStandingTextures(): PIXI.Texture[] {
    return this.standingTextures;
  }

  getMovingTextures(): PIXI.Texture[] {
    return this.movingTextures;
  }

  update() {
    if (!this.mushroomEntity) {
      const mushroomEntity = new Entity();
      this.mushroomEntity = mushroomEntity;
      this.mushroomEntity.add(new MushroomComponent());

      const x = Math.random() * this.app.screen.width;
      const y = Math.random() * this.app.screen.height * 0.85;

      const position = new Position(x, y);
      mushroomEntity.add(position);

      const mushroomSprite = new PIXI.AnimatedSprite(this.standingTextures);
      mushroomSprite.anchor.set(0.5);
      mushroomSprite.position.set(x, y);
      mushroomSprite.animationSpeed = 0.1;
      mushroomSprite.play();

      mushroomEntity.add(mushroomSprite);
      this.engine.addEntity(mushroomEntity);
      this.app.stage.addChild(mushroomSprite);

      mushroomSprite.position.set(x, y);

      const directionX = Math.random() < 0.5 ? 1 : -1;
      const directionY = Math.random() < 0.5 ? 1 : -1;
      mushroomEntity.add(new EnemyComponent(directionX, directionY));
    }
  }
}
