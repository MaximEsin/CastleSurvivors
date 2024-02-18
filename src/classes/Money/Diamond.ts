import * as PIXI from 'pixi.js';
import { Coin } from './Coin';

export class Diamond extends Coin {
  public coinPoints = 5;

  constructor(
    x: number,
    y: number,
    sprite: string,
    layer: PIXI.Container<PIXI.DisplayObject>,
    isMobile: boolean
  ) {
    super(x, y, sprite, layer, isMobile);
  }

  override getIsCollected() {
    return super.getIsCollected();
  }

  override getSprite(): PIXI.Sprite {
    return super.getSprite();
  }
}
