import * as PIXI from 'pixi.js';

export class Background {
  private sprite: PIXI.Sprite;

  constructor(imagePath: string, app: PIXI.Application) {
    this.sprite = PIXI.Sprite.from(imagePath);
    this.sprite.width = app.screen.width;
    this.sprite.height = app.screen.height;
    app.stage.addChild(this.sprite);

    this.addResizeListener(app);
  }
  // Resize the background when the window is resized
  private addResizeListener(app: PIXI.Application): void {
    window.addEventListener('resize', () => {
      this.sprite.width = app.screen.width;
      this.sprite.height = app.screen.height;
    });
  }

  changeBackground() {
    // This might be needed for future levels
  }
}
