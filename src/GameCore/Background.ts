import * as PIXI from 'pixi.js';

export class Background {
  private tilingSprite: PIXI.TilingSprite;

  constructor(imagePath: string, app: PIXI.Application) {
    const texture = PIXI.Texture.from(imagePath);
    this.tilingSprite = new PIXI.TilingSprite(
      texture,
      app.screen.width,
      app.screen.height
    );

    this.addResizeListener(app);
  }

  private addResizeListener(app: PIXI.Application): void {
    window.addEventListener('resize', () => {
      this.tilingSprite.width = app.screen.width;
      this.tilingSprite.height = app.screen.height;
    });
  }

  public getSprite() {
    return this.tilingSprite;
  }
}
