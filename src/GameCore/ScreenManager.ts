import * as PIXI from 'pixi.js';
import { ScreenType } from '../Enums/ScreenType';

export class ScreenManager {
  private app: PIXI.Application;
  private container: PIXI.Container;
  private winSprite: PIXI.Sprite;
  private deathSprite: PIXI.Sprite;
  private isButtonPressed: boolean = false;
  private isScreenDisplayed: boolean = false;

  constructor(
    app: PIXI.Application,
    layer: PIXI.Container<PIXI.DisplayObject>
  ) {
    this.app = app;
    this.container = new PIXI.Container();
    this.winSprite = PIXI.Sprite.from('/Interface/winscreen.avif');
    this.winSprite.anchor.set(1);
    this.winSprite.width = app.screen.width;
    this.winSprite.height = app.screen.height;
    this.winSprite.position.set(app.screen.width, app.screen.height);
    this.deathSprite = PIXI.Sprite.from('/Interface/deathscreen.jpeg');
    this.deathSprite.anchor.set(1);
    this.deathSprite.width = app.screen.width;
    this.deathSprite.height = app.screen.height;
    this.deathSprite.position.set(app.screen.width, app.screen.height);

    this.container.visible = false;

    layer.addChild(this.container);
  }

  private createResetButton(): PIXI.Sprite {
    const resetButton = PIXI.Sprite.from('/Interface/resetbtn.png');
    resetButton.anchor.set(0.5);
    resetButton.position.set(
      this.app.screen.width / 2,
      this.app.screen.height / 2 + 100
    );
    resetButton.interactive = true;
    resetButton.on('pointerdown', () => {
      this.isButtonPressed = true;
    });

    return resetButton;
  }

  public showScreen(type: ScreenType): void {
    this.isScreenDisplayed = true;
    if (type === ScreenType.Win) {
      this.container.addChild(this.winSprite);
    } else if (type === ScreenType.Death) {
      this.container.addChild(this.deathSprite);
    }
    const resetButton = this.createResetButton();
    this.container.addChild(resetButton);
    this.container.visible = true;
  }

  public hideScreen(): void {
    this.isScreenDisplayed = false;
    this.container.visible = false;
    this.isButtonPressed = false;
    this.container.removeChild(this.deathSprite);
    this.container.removeChild(this.winSprite);
  }

  public getIsPressed(): boolean {
    return this.isButtonPressed;
  }

  public getIsScreenDisplayed(): boolean {
    return this.isScreenDisplayed;
  }
}
