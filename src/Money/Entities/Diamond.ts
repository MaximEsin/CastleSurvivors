import * as PIXI from 'pixi.js';
import { Entity } from 'tick-knock';
import { Position } from '../../Components/Position';
import { DiamondComponent } from '../Components/Diamond';

export class DiamondEntity extends Entity {
  constructor(position: Position) {
    super();

    this.add(position);
    this.add(new DiamondComponent());

    const coinSprite = new PIXI.Sprite(PIXI.Texture.from('/Shop/diamond.png'));
    coinSprite.position.set(position.x, position.y);

    this.add(coinSprite);
  }
}
