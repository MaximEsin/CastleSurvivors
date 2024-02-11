import * as PIXI from 'pixi.js';

export class DeathScreen {
  private app: PIXI.Application;
  private container: PIXI.Container;
  private deathSprite: PIXI.Sprite;
  private resetGameCallback: () => void;

  constructor(
    app: PIXI.Application,
    resetGameCallback: () => void,
    layer: PIXI.Container<PIXI.DisplayObject>
  ) {
    this.app = app;
    this.container = new PIXI.Container();
    this.deathSprite = PIXI.Sprite.from('/Interface/deathscreen.jpeg');
    this.deathSprite.anchor.set(1);
    this.deathSprite.width = app.screen.width;
    this.deathSprite.height = app.screen.height;
    this.deathSprite.position.set(app.screen.width, app.screen.height);
    this.container.addChild(this.deathSprite);
    this.resetGameCallback = resetGameCallback;

    this.container.visible = false;

    layer.addChild(this.container);
  }

  private createResetButton(): PIXI.Sprite {
    const resetButton = PIXI.Sprite.from('/Interface/resetbtn.png');
    resetButton.anchor.set(0.5);
    resetButton.position.set(
      this.app.screen.width / 2,
      this.app.screen.height / 2 + 150
    );
    resetButton.interactive = true;
    resetButton.on('pointerdown', () => {
      this.resetGame();
    });

    return resetButton;
  }

  resetGame(): void {
    this.container.visible = false;
    if (this.resetGameCallback) {
      this.resetGameCallback();
    }
  }

  public showDeathScreen(): void {
    const resetButton = this.createResetButton();
    this.container.addChild(resetButton);
    this.container.visible = true;
  }
}
