import * as PIXI from 'pixi.js';

export class Interface {
  private app: PIXI.Application;
  private centerContainer: PIXI.Container;
  private backgroundSprite: PIXI.Sprite;
  private coinIcon!: PIXI.Sprite;
  private coinText!: PIXI.Text;
  private timerText!: PIXI.Text;
  private coinCount: number = 0;

  constructor(app: PIXI.Application) {
    this.app = app;
    this.centerContainer = new PIXI.Container();
    this.backgroundSprite = new PIXI.Sprite(
      PIXI.Texture.from('/Interface/Paper.jpg')
    );

    this.createInterface(app.screen.width, app.screen.height);
  }

  private createInterface(width: number, height: number): void {
    const playerInterfaceHeight = height * 0.1;

    // Background
    this.backgroundSprite.width = width;
    this.backgroundSprite.height = playerInterfaceHeight;
    this.backgroundSprite.y = height - playerInterfaceHeight;

    // Center Container
    const iconSize = playerInterfaceHeight * 0.8;

    const icon = PIXI.Sprite.from('/Interface/heart.png');
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
    const knifeIcon = PIXI.Sprite.from('/Player/weapons/knife.png');
    knifeIcon.anchor.set(0.5);
    knifeIcon.width = knifeIcon.height = knifeIconSize;
    knifeIcon.x = width * 0.05;
    knifeIcon.y = height - playerInterfaceHeight / 2;
    this.centerContainer.addChild(knifeIcon);

    // Coin icon
    const coinIconSize = playerInterfaceHeight;
    this.coinIcon = PIXI.Sprite.from('/Shop/coin.png');
    this.coinIcon.anchor.set(0.5);
    this.coinIcon.width = this.coinIcon.height = coinIconSize;
    this.coinIcon.x = width * 0.87;
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

    this.timerText = new PIXI.Text('', { fill: 0xffffff });
    this.timerText.anchor.set(0.5, 0);
    this.timerText.position.set(this.app.screen.width / 2, 10);
  }

  public updateTimer(timerString: string): void {
    this.timerText.text = timerString;
  }

  public addCursedEyeIcon(width: number, height: number): void {
    const eyeIconSize = this.backgroundSprite.height;
    const eyeIcon = PIXI.Sprite.from('/Player/weapons/eye.png');
    eyeIcon.anchor.set(0.5);
    eyeIcon.width = eyeIcon.height = eyeIconSize;
    eyeIcon.x = width * 0.12;
    eyeIcon.y = height - this.backgroundSprite.height / 2;
    this.centerContainer.addChild(eyeIcon);
  }

  public addKebabIcon(width: number, height: number): void {
    const eyeIconSize = this.backgroundSprite.height * 0.9;
    const eyeIcon = PIXI.Sprite.from('/Player/weapons/kebab.png');
    eyeIcon.anchor.set(0.5);
    eyeIcon.width = eyeIcon.height = eyeIconSize;
    eyeIcon.x = width * 0.17;
    eyeIcon.y = height - this.backgroundSprite.height / 2;
    this.centerContainer.addChild(eyeIcon);
  }

  public handlePurchase(cost: number): void {
    this.coinCount -= cost;
    this.coinText.text = `Coins: ${this.coinCount}`;
  }

  public updateCoinCount(value: number): void {
    this.coinCount += value;
    this.coinText.text = `Coins: ${this.coinCount}`;
  }

  public resetCoins(): void {
    this.coinCount = 0;
    this.coinText.text = `Coins: ${this.coinCount}`;
  }

  public updateHealthText(health: number): void {
    const healthText = this.centerContainer.getChildAt(1) as PIXI.Text;
    healthText.text = `Health: ${health}`;
  }

  public resizeInterface(width: number, height: number): void {
    const playerInterfaceHeight = height * 0.1;

    this.backgroundSprite.width = width;
    this.backgroundSprite.height = playerInterfaceHeight;
    this.backgroundSprite.y = height - playerInterfaceHeight;

    const iconSize = playerInterfaceHeight * 0.8;
    const icon = this.centerContainer.getChildAt(0) as PIXI.Sprite;
    icon.width = icon.height = iconSize;
    icon.x = width / 2;
    icon.y = height - playerInterfaceHeight / 2;

    const text = this.centerContainer.getChildAt(1) as PIXI.Text;
    text.style.fontSize = playerInterfaceHeight * 0.4;
    text.x = width / 2;
    text.y = height - playerInterfaceHeight / 2 + iconSize / 2;

    const knifeIconSize = playerInterfaceHeight * 2;
    const knifeIcon = this.centerContainer.getChildAt(2) as PIXI.Sprite;
    knifeIcon.width = knifeIcon.height = knifeIconSize;
    knifeIcon.x = width * 0.05;
    knifeIcon.y = height - playerInterfaceHeight / 2;

    const coinIconSize = playerInterfaceHeight;
    this.coinIcon.width = this.coinIcon.height = coinIconSize;
    this.coinIcon.x = width * 0.87;
    this.coinIcon.y = height - playerInterfaceHeight / 2;

    this.coinText.style.fontSize = playerInterfaceHeight * 0.4;
    this.coinText.x = width * 0.94;
    this.coinText.y = height - playerInterfaceHeight / 2;

    this.timerText.position.set(width / 2, 10);
  }

  public getBackgroundSprite(): PIXI.Sprite {
    return this.backgroundSprite;
  }

  public getCenterContainer(): PIXI.Container {
    return this.centerContainer;
  }

  public getTimerText(): PIXI.Text {
    return this.timerText;
  }

  public getCoinCount(): number {
    return this.coinCount;
  }
}
