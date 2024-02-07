import * as PIXI from 'pixi.js';
import { System, Entity } from 'tick-knock';
import { Position } from '../../Components/Position';
import { MushroomComponent } from '../Components/Mushroom';

export class MushroomSystem extends System {
  private app: PIXI.Application;
  private readonly mushroomTextures: PIXI.Texture[];
  private mushroomSpawned: boolean = false;

  constructor(app: PIXI.Application) {
    super();
    this.app = app;
    this.mushroomTextures = [];
    for (let i = 1; i <= 4; i++) {
      this.mushroomTextures.push(
        PIXI.Texture.from(`/Enemies/Mushroom/standing/standing${i}.png`)
      );
    }
  }
  update() {
    if (!this.mushroomSpawned) {
      const mushroomEntity = new Entity();

      const x = Math.random() * this.app.screen.width;
      const y = Math.random() * this.app.screen.height;

      const position = new Position(x, y);
      mushroomEntity.add(position);

      const mushroomSprite = new PIXI.AnimatedSprite(this.mushroomTextures);
      mushroomSprite.anchor.set(0.5);
      mushroomSprite.position.set(x, y);
      mushroomSprite.animationSpeed = 0.1;
      mushroomSprite.play();

      mushroomEntity.add(mushroomSprite);
      this.engine.addEntity(mushroomEntity);
      this.app.stage.addChild(mushroomSprite);

      this.mushroomSpawned = true;
    }
  }
}
