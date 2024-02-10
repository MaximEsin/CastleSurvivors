import * as PIXI from 'pixi.js';
import { System } from 'tick-knock';
import { Position } from '../Components/Position';
import { MerchantEntity } from './MerchantEntity';
import { Entity } from 'tick-knock';

export class MerchantSystem extends System {
  private readonly app: PIXI.Application;
  private merchant: Entity | null = null;

  constructor(app: PIXI.Application) {
    super();
    this.app = app;
  }

  spawnMerchant() {
    const position = this.getRandomPosition();
    this.merchant = new MerchantEntity(position);
    const merchantSprite = this.merchant.get<PIXI.Sprite>(PIXI.Sprite);
    if (merchantSprite) this.app.stage.addChild(merchantSprite);
    this.engine.addEntity(this.merchant);
  }

  private getRandomPosition(): Position {
    const x = Math.floor(Math.random() * (this.app.screen.width - 40)) + 20;
    const y =
      Math.floor(Math.random() * (this.app.screen.height - 40) * 0.85) + 20;
    return new Position(x, y);
  }

  update() {
    if (!this.merchant) {
      this.spawnMerchant();
    }
  }
}
