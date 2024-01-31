import * as PIXI from 'pixi.js';

export class DeathScreen {
  private app: PIXI.Application;
  private container: PIXI.Container;
  private deathSprite: PIXI.Sprite;
  private resetGameCallback: () => void;

  constructor(app: PIXI.Application, resetGameCallback: () => void) {
    this.app = app;
    this.container = new PIXI.Container();
    this.deathSprite = PIXI.Sprite.from('./public/Interface/deathscreen.jpeg');
    this.deathSprite.anchor.set(0.5);
    this.deathSprite.position.set(app.screen.width / 2, app.screen.height / 2);
    this.container.addChild(this.deathSprite);
    this.resetGameCallback = resetGameCallback;

    this.container.visible = false;

    app.stage.addChild(this.container);
  }

  private createResetButton(): PIXI.Sprite {
    const resetButton = PIXI.Sprite.from('./public/Interface/resetbtn.png');
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