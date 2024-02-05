import * as PIXI from 'pixi.js';
import { Entity } from './Entity';
import { RenderComponent } from '../Components/Render';

export class BackgroundEntity extends Entity {
  constructor(width: number, height: number, imagePath: string) {
    super(0);
    const texture = PIXI.Texture.from(imagePath);
    const backgroundSprite = new PIXI.Sprite(texture);

    backgroundSprite.width = width;
    backgroundSprite.height = height;

    this.addComponent('render', new RenderComponent(backgroundSprite));
  }
}
