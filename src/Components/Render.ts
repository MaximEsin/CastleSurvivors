import * as PIXI from 'pixi.js';

export class RenderComponent {
  sprite: PIXI.Sprite;

  constructor(sprite: PIXI.Sprite) {
    this.sprite = sprite;
  }
}
