import * as PIXI from 'pixi.js';
import { Entity } from 'tick-knock';
import { Position } from '../Components/Position';

export class MerchantEntity extends Entity {
  constructor(position: Position) {
    super();

    this.add(position);

    const merchantSprite = new PIXI.Sprite(
      PIXI.Texture.from('/Merchant/interact/interact8.png')
    );
    merchantSprite.position.set(position.x, position.y);

    this.add(merchantSprite);
  }
}
