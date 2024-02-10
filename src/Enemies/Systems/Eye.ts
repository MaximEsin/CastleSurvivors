import * as PIXI from 'pixi.js';
import { System } from 'tick-knock';
import { Position } from '../../Components/Position';
import { EyeComponent } from '../Components/Eye';
import { Entity } from 'tick-knock';
import { Health } from '../../Components/Health';
import { EnemyComponent } from '../Components/Enemy';

export class EyeSystem extends System {
  private app: PIXI.Application;
  private readonly movingTextures: PIXI.Texture[];
  private eyeEntity: Entity | null = null;
  private eyeSpawnTimer = 0;
  private eyeSpawnInterval = 2000;

  constructor(app: PIXI.Application) {
    super();
    this.app = app;

    this.movingTextures = [];
    for (let i = 1; i <= 8; i++) {
      this.movingTextures.push(
        PIXI.Texture.from(`/Enemies/Eye/moving/moving${i}.png`)
      );
    }
  }

  getMovingTextures(): PIXI.Texture[] {
    return this.movingTextures;
  }

  update() {
    this.eyeSpawnTimer += 10;
    if (this.eyeSpawnTimer >= this.eyeSpawnInterval) {
      this.eyeSpawnTimer = 0;
      const eyeEntity = new Entity();
      this.eyeEntity = eyeEntity;
      this.eyeEntity.add(new EyeComponent());
      this.eyeEntity.add(new Health(20));

      const x = Math.floor(Math.random() * (this.app.screen.width - 40)) + 20;
      const y =
        Math.floor(Math.random() * (this.app.screen.height - 40) * 0.85) + 20;

      const position = new Position(x, y);
      eyeEntity.add(position);

      const eyeSprite = new PIXI.AnimatedSprite(this.movingTextures);
      eyeSprite.anchor.set(0.5);
      eyeSprite.position.set(x, y);
      eyeSprite.animationSpeed = 0.1;
      eyeSprite.play();

      eyeEntity.add(eyeSprite);
      this.engine.addEntity(eyeEntity);
      this.app.stage.addChild(eyeSprite);

      eyeSprite.position.set(x, y);

      const directionX = Math.random() < 0.5 ? 1 : -1;
      const directionY = Math.random() < 0.5 ? 1 : -1;
      eyeEntity.add(new EnemyComponent(directionX, directionY));
    }
  }
}
