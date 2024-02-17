import * as PIXI from 'pixi.js';
import { Coin } from './Coin';

export class Diamond extends Coin {
  public coinPoints = 5;

  constructor(
    x: number,
    y: number,
    sprite: string,
    layer: PIXI.Container<PIXI.DisplayObject>
  ) {
    super(x, y, sprite, layer);
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
