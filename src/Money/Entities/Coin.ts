import * as PIXI from 'pixi.js';
import { Entity } from 'tick-knock';
import { Position } from '../../Components/Position';
import { CoinComponent } from '../Components/Coint';

export class CoinEntity extends Entity {
  constructor(position: Position) {
    super();

    this.add(position);
    this.add(new CoinComponent());

    const coinSprite = new PIXI.Sprite(PIXI.Texture.from('/Shop/coin.png'));
    coinSprite.position.set(position.x, position.y);

    this.add(coinSprite);
  }
}
