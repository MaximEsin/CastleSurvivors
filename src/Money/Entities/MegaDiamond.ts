import * as PIXI from 'pixi.js';
import { Entity } from 'tick-knock';
import { Position } from '../../Components/Position';
import { MegaDiamondComponent } from '../Components/MegaDiamond';

export class MegaDiamondEntity extends Entity {
  constructor(position: Position) {
    super();

    this.add(position);
    this.add(new MegaDiamondComponent());

    const coinSprite = new PIXI.Sprite(
      PIXI.Texture.from('/Shop/megaDiamond.png')
    );
    coinSprite.position.set(position.x, position.y);

    this.add(coinSprite);
  }
}
