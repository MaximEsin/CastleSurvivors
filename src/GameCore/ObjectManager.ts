import * as PIXI from 'pixi.js';
import { EntityCreator } from '../Entities/EntityCreator';

export class ObjectManager {
  private app: PIXI.Application;
  private gameLayer: PIXI.Container;
  private entityCreator: EntityCreator;

  constructor(app: PIXI.Application, gameLayer: PIXI.Container) {
    this.app = app;
    this.gameLayer = gameLayer;
    this.entityCreator = new EntityCreator();
  }

  public spawnPlayer() {
    const playerSprite = this.entityCreator.getPlayer().getSprite();
    playerSprite.x = this.app.screen.width / 2;
    playerSprite.y = this.app.screen.height / 2;
    this.gameLayer.addChild(playerSprite);
  }
}
