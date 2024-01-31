import * as PIXI from 'pixi.js';

export class PlayerInterface {
  private centerContainer: PIXI.Container;
  private backgroundSprite: PIXI.Sprite;

  constructor(app: PIXI.Application) {
    this.centerContainer = new PIXI.Container();
    this.backgroundSprite = new PIXI.Sprite(
      PIXI.Texture.from('./public/Interface/Paper.jpg')
    );

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

    const text = new PIXI.Text(`Health: 100`, textStyle);
    text.anchor.set(0.6);
    text.x = width / 2;
    text.y = height - playerInterfaceHeight / 2 + iconSize / 2;
    this.centerContainer.addChild(text);
  }

  public updateHealthText(health: number): void {
    const healthText = this.centerContainer.getChildAt(1) as PIXI.Text;
    healthText.text = `Health: ${health}`;
  }

  public getHealthText(): PIXI.Text {
    return this.centerContainer.getChildAt(1) as PIXI.Text;
  }

  public resizeInterface(width: number, height: number): void {
    this.createInterface(width, height);
  }
}
