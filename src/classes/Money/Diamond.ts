import * as PIXI from 'pixi.js';
import { Coin } from './Coin';

export class Diamond extends Coin {
  protected value = 5;

  constructor(
    app: PIXI.Application,
    x: number,
    y: number,
    sprite: string,
    layer: PIXI.Container<PIXI.DisplayObject>
  ) {
    super(app, x, y, sprite, layer);
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
