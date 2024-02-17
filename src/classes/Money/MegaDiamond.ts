import * as PIXI from 'pixi.js';
import { Coin } from './Coin';

export class MegaDiamond extends Coin {
  public coinPoints: number = 10;

  constructor(
    x: number,
    y: number,
    sprite: string,
    layer: PIXI.Container<PIXI.DisplayObject>
  ) {
    super(x, y, sprite, layer);
    this.coinPoints = 10;
  }

  override getIsCollected() {
    return super.getIsCollected();
  }

  override getSprite(): PIXI.Sprite {
    return super.getSprite();
  }

  override destroy(): void {
    super.destroy();
  }
}
