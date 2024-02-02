import * as PIXI from 'pixi.js';

export class PlayerInterface {
  private centerContainer: PIXI.Container;
  private backgroundSprite: PIXI.Sprite;
  private coinIcon!: PIXI.Sprite;
  private coinText!: PIXI.Text;
  private coinCount: number = 0;

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

    // Center Container
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

    const knifeIconSize = playerInterfaceHeight * 2;
    const knifeIcon = PIXI.Sprite.from('./public/Player/weapons/knife.png');
    knifeIcon.anchor.set(0.5);
    knifeIcon.width = knifeIcon.height = knifeIconSize;
    knifeIcon.x = width * 0.05;
    knifeIcon.y = height - playerInterfaceHeight / 2;
    this.centerContainer.addChild(knifeIcon);

    // Coin icon
    const coinIconSize = playerInterfaceHeight;
    this.coinIcon = PIXI.Sprite.from('./public/Shop/coin.png');
    this.coinIcon.anchor.set(0.5);
    this.coinIcon.width = this.coinIcon.height = coinIconSize;
    this.coinIcon.x = width * 0.88;
    this.coinIcon.y = height - playerInterfaceHeight / 2;
    this.centerContainer.addChild(this.coinIcon);

    // Coin count text
    const coinTextStyle = new PIXI.TextStyle({
      fill: 'black',
      fontFamily: 'Times New Roman',
      fontSize: playerInterfaceHeight * 0.4,
      align: 'center',
    });

    this.coinText = new PIXI.Text(`Coins: ${this.coinCount}`, coinTextStyle);
    this.coinText.anchor.set(0.5);
    this.coinText.x = width * 0.94;
    this.coinText.y = height - playerInterfaceHeight / 2;
    this.centerContainer.addChild(this.coinText);
  }

  public addCursedEyeIcon(width: number, height: number) {
    const eyeIconSize = this.backgroundSprite.height;
    const eyeIcon = PIXI.Sprite.from('./public/Player/weapons/eye.png');
    eyeIcon.anchor.set(0.5);
    eyeIcon.width = eyeIcon.height = eyeIconSize;
    eyeIcon.x = width * 0.12;
    eyeIcon.y = height - this.backgroundSprite.height / 2;
    this.centerContainer.addChild(eyeIcon);
  }

  public updateCoinCount(value: number): void {
    this.coinCount += value;
    this.coinText.text = `Coins: ${this.coinCount}`;
  }

  public resetCoins() {
    this.coinCount = 0;
    this.coinText.text = `Coins: ${this.coinCount}`;
  }

  public updateHealthText(health: number): void {
    const healthText = this.centerContainer.getChildAt(1) as PIXI.Text;
    healthText.text = `Health: ${health}`;
  }

  public resizeInterface(width: number, height: number): void {
    this.createInterface(width, height);
  }
}
