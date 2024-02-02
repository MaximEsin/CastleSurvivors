import * as PIXI from 'pixi.js';
import { Coin } from './Coin';

export class MegaDiamond extends Coin {
  protected value: number = 10;

  constructor(app: PIXI.Application, x: number, y: number, sprite: string) {
    super(app, x, y, sprite);
    this.value = 10;
  }

  override getIsCollected() {
    return super.getIsCollected();
  }

  override getSprite(): PIXI.Sprite {
    return super.getSprite();
  }

  override getValue() {
    return this.value;
  }

  override destroy(): void {
    super.destroy();
  }
}
