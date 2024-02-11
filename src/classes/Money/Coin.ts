import * as PIXI from 'pixi.js';

export class Coin {
  protected app: PIXI.Application;
  protected layer: PIXI.Container<PIXI.DisplayObject>;
  protected coinSprite: PIXI.Sprite;
  protected isCollected: boolean = false;
  protected value: number = 1;

  constructor(
    app: PIXI.Application,
    x: number,
    y: number,
    sprite: string,
    layer: PIXI.Container<PIXI.DisplayObject>
  ) {
    this.app = app;
    this.layer = layer;
    this.coinSprite = new PIXI.Sprite(PIXI.Texture.from(sprite));
    this.coinSprite.anchor.set(0.5);
    this.coinSprite.position.set(x, y);

    this.layer.addChild(this.coinSprite);
  }

  public collect(): void {
    if (!this.isCollected) {
      this.isCollected = true;
      this.destroy();
    }
  }

  public getIsCollected() {
    return this.isCollected;
  }

  public getSprite(): PIXI.Sprite {
    return this.coinSprite;
  }

  public getValue() {
    return this.value;
  }

  public destroy(): void {
    this.layer.removeChild(this.coinSprite);
  }
}
