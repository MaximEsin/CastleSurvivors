import * as PIXI from 'pixi.js';

export class Coin extends PIXI.Container {
  protected layer: PIXI.Container<PIXI.DisplayObject>;
  protected coinSprite: PIXI.Sprite;
  protected isCollected: boolean = false;
  public coinPoints: number = 1;
  private isMobile: boolean;

  constructor(
    x: number,
    y: number,
    sprite: string,
    layer: PIXI.Container<PIXI.DisplayObject>,
    isMobile: boolean
  ) {
    super();
    this.layer = layer;
    this.coinSprite = new PIXI.Sprite(PIXI.Texture.from(sprite));
    this.coinSprite.anchor.set(0.5);
    this.coinSprite.position.set(x, y);
    this.isMobile = isMobile;

    this.handleMobileResize();

    this.layer.addChild(this.coinSprite);
  }

  public collect(): void {
    if (!this.isCollected) {
      this.isCollected = true;
    }
  }

  public getIsCollected(): boolean {
    return this.isCollected;
  }

  public getSprite(): PIXI.Sprite {
    return this.coinSprite;
  }

  public handleMobileResize() {
    if (this.isMobile) {
      this.coinSprite.scale.set(0.4);
    }
  }
}
