import * as PIXI from 'pixi.js';
import { Coin } from './Coin';

export class MegaDiamond extends Coin {
  protected _coinPoints: number = 10;

  constructor(
    x: number,
    y: number,
    sprite: string,
    layer: PIXI.Container<PIXI.DisplayObject>,
    isMobile: boolean
  ) {
    super(x, y, sprite, layer, isMobile);
    this._coinPoints = 10;
  }

  override getIsCollected() {
    return super.getIsCollected();
  }

  override getSprite(): PIXI.Sprite {
    return super.getSprite();
  }
}
