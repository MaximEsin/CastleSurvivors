import * as PIXI from 'pixi.js';

export class DeathScreen {
  private app: PIXI.Application;
  private container: PIXI.Container;
  private deathSprite: PIXI.Sprite;

  constructor(app: PIXI.Application) {
    this.app = app;
    this.container = new PIXI.Container();
    this.deathSprite = PIXI.Sprite.from('./public/Interface/deathscreen.jpeg');
    this.deathSprite.anchor.set(0.5);
    this.deathSprite.position.set(app.screen.width / 2, app.screen.height / 2);
    this.container.addChild(this.deathSprite);

    // Initially hide the death screen
    this.container.visible = false;

    app.stage.addChild(this.container);
  }

  public showDeathScreen(): void {
    this.container.visible = true;
  }
}
