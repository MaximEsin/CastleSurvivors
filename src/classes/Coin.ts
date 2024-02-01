import * as PIXI from 'pixi.js';

export class Coin {
  private app: PIXI.Application;
  private coinSprite: PIXI.Sprite;
  private isCollected: boolean = false;

  constructor(app: PIXI.Application, x: number, y: number) {
    this.app = app;
    this.coinSprite = new PIXI.Sprite(
      PIXI.Texture.from('./public/Shop/coin.png')
    );
    this.coinSprite.anchor.set(0.5);
    this.coinSprite.position.set(x, y);

    app.stage.addChild(this.coinSprite);
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

  public destroy(): void {
    this.app.stage.removeChild(this.coinSprite);
  }
}
