import * as PIXI from 'pixi.js';
import { Player } from './Player';

export class PlayerInterface {
  private centerContainer: PIXI.Container;
  private backgroundSprite: PIXI.Sprite;
  private player: Player;

  constructor(app: PIXI.Application, player: Player) {
    this.centerContainer = new PIXI.Container();
    this.backgroundSprite = new PIXI.Sprite(
      PIXI.Texture.from('./public/Interface/Paper.jpg')
    );
    this.player = player;

    this.createInterface(app.screen.width, app.screen.height);
    app.stage.addChild(this.backgroundSprite, this.centerContainer);
  }

  private createInterface(width: number, height: number): void {
    const playerInterfaceHeight = height * 0.1;

    // Background
    this.backgroundSprite.width = width;
    this.backgroundSprite.height = playerInterfaceHeight;
    this.backgroundSprite.y = height - playerInterfaceHeight;

    // Center Container (for icon and text)
    const iconSize = playerInterfaceHeight * 0.8;

    const icon = PIXI.Sprite.from('./public/Interface/heart.png');
    icon.anchor.set(0.7);
    icon.width = icon.height = iconSize;
    icon.x = width / 2;
    icon.y = height - playerInterfaceHeight / 2;
    this.centerContainer.addChild(icon);

    const textStyle = new PIXI.TextStyle({
      fill: 'black',
      fontFamily: 'Times New Roman',
      fontSize: playerInterfaceHeight * 0.4,
      align: 'center',
    });

    const health = this.player.getPlayerHealth();

    const text = new PIXI.Text(`Health: ${health}`, textStyle);
    text.anchor.set(0.6);
    text.x = width / 2;
    text.y = height - playerInterfaceHeight / 2 + iconSize / 2;
    this.centerContainer.addChild(text);
  }

  public resizeInterface(width: number, height: number): void {
    this.createInterface(width, height);
  }
}
