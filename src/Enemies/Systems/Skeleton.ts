import * as PIXI from 'pixi.js';
import { System } from 'tick-knock';
import { Position } from '../../Components/Position';
import { SkeletonComponent } from '../Components/Skeleton';
import { Entity } from 'tick-knock';
import { Health } from '../../Components/Health';
import { EnemyComponent } from '../Components/Enemy';

export class SkeletonSystem extends System {
  private app: PIXI.Application;
  private readonly movingTextures: PIXI.Texture[];
  private readonly standingTextures: PIXI.Texture[];
  private skeletonEntity: Entity | null = null;

  constructor(app: PIXI.Application) {
    super();
    this.app = app;

    this.movingTextures = [];
    for (let i = 1; i <= 4; i++) {
      this.movingTextures.push(
        PIXI.Texture.from(`/Enemies/Skeleton/moving/moving${i}.png`)
      );
    }

    this.standingTextures = [];
    for (let i = 1; i <= 3; i++) {
      this.standingTextures.push(
        PIXI.Texture.from(`/Enemies/Skeleton/standing/standing${i}.png`)
      );
    }
  }

  getMovingTextures(): PIXI.Texture[] {
    return this.movingTextures;
  }

  getStandingTextures(): PIXI.Texture[] {
    return this.movingTextures;
  }

  update() {
    if (!this.skeletonEntity) {
      const skeletonEntity = new Entity();
      this.skeletonEntity = skeletonEntity;
      this.skeletonEntity.add(new SkeletonComponent());
      this.skeletonEntity.add(new Health(50));

      const x = Math.floor(Math.random() * (this.app.screen.width - 40)) + 20;
      const y =
        Math.floor(Math.random() * (this.app.screen.height - 40) * 0.85) + 20;

      const position = new Position(x, y);
      skeletonEntity.add(position);

      const skeletonSprite = new PIXI.AnimatedSprite(this.standingTextures);
      skeletonSprite.anchor.set(0.5);
      skeletonSprite.position.set(x, y);
      skeletonSprite.animationSpeed = 0.1;
      skeletonSprite.play();

      skeletonEntity.add(skeletonSprite);
      this.engine.addEntity(skeletonEntity);
      this.app.stage.addChild(skeletonSprite);

      skeletonSprite.position.set(x, y);

      const directionX = Math.random() < 0.5 ? 1 : -1;
      const directionY = Math.random() < 0.5 ? 1 : -1;
      skeletonEntity.add(new EnemyComponent(directionX, directionY));
    }
  }
}
