import * as PIXI from 'pixi.js';
import { Background } from './Background';

export class BaseLevel {
  private app: PIXI.Application;
  private backgroundLayer: PIXI.Container;
  private background: Background;

  constructor(app: PIXI.Application) {
    this.app = app;

    this.backgroundLayer = new PIXI.Container();

    this.app.stage.addChild(this.backgroundLayer);

    this.background = new Background('/Backgrounds/CastleBG.webp', this.app);

    this.backgroundLayer.addChild(this.background.getSprite());
  }

  init() {}
}
