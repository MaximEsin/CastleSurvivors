import * as PIXI from 'pixi.js';
import { AnimationManager } from './AnimationManager';
import { Player } from './Player';
import { PlayerInterface } from './UI/PlayerInterface';

export class Merchant {
  private app: PIXI.Application;
  private animationManager: AnimationManager;
  private merchantSprite: PIXI.AnimatedSprite;
  private playerInterface: PlayerInterface;
  private standingTextures: PIXI.Texture[];
  private interactTextures: PIXI.Texture[];
  private metPlayer: boolean = false;
  private container: PIXI.Container;
  private isOpen: boolean = false;
  private isPlayerNear: boolean = false;
  private isEyePurchased: boolean = false;
  private isKebabPurchased: boolean = false;
  private player: Player;

  constructor(
    app: PIXI.Application,
    animationManager: AnimationManager,
    playerInterface: PlayerInterface,
    player: Player
  ) {
    this.app = app;
    this.animationManager = animationManager;
    this.playerInterface = playerInterface;
    this.player = player;
    this.container = new PIXI.Container();
    this.container.interactive = true;
    this.standingTextures =
      this.animationManager.getMerchantStandingAnimation();
    this.interactTextures =
      this.animationManager.getMerchantInteractAnimation();
    this.merchantSprite = this.createMerchantSprite();

    this.app.stage.addChild(this.container);
    this.container.visible = false;

    const containerBackground = new PIXI.Graphics();
    containerBackground.beginFill(0x2a2a2a);
    containerBackground.drawRect(0, 0, 300, 150);
    containerBackground.endFill();
    this.container.addChild(containerBackground);

    this.addWeaponImageWithText(
      '/Player/weapons/eye.png',
      'Cursed Eye: 50',
      20,
      20,
      1
    );
    this.addWeaponImageWithText(
      '/Player/weapons/kebab.png',
      'Kebab: 50',
      180,
      40,
      2
    );

    this.container.position.set(
      (app.screen.width - this.container.width) / 2,
      (app.screen.height - this.container.height) / 2
    );

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        if (!this.isOpen && this.isPlayerNear) {
          this.openMerchantWindow();
        } else {
          this.closeMerchantWindow();
        }
      }

      if (event.key === '1') {
        if (this.playerInterface.canPlayerAfford(50) && !this.isEyePurchased) {
          this.playerInterface.handlePurchase(50);
          this.handleEyePurchase();
        }
      }

      if (event.key === '2') {
        if (
          this.playerInterface.canPlayerAfford(50) &&
          !this.isKebabPurchased
        ) {
          this.playerInterface.handlePurchase(50);
          this.handleKebabPurchase();
        }
      }
    });
  }

  private addWeaponImageWithText(
    imagePath: string,
    text: string,
    x: number,
    y: number,
    key: number
  ): void {
    const weaponImage = PIXI.Sprite.from(imagePath);
    weaponImage.position.set(x, y);
    this.container.addChild(weaponImage);

    const weaponText = new PIXI.Text(text, {
      fill: 'white',
      fontFamily: 'Times New Roman',
      fontSize: 12,
    });
    weaponText.anchor.set(0, 0);
    weaponText.position.set(x + weaponImage.width / 2 + 20, y - 15);
    this.container.addChild(weaponText);

    const weaponText2 = new PIXI.Text(`Press ${key}`, {
      fill: 'white',
      fontFamily: 'Times New Roman',
      fontSize: 12,
    });
    weaponText2.anchor.set(0, 0);
    weaponText2.position.set(x + weaponImage.width / 2 + 35, 130);
    this.container.addChild(weaponText2);
  }

  private createMerchantSprite(): PIXI.AnimatedSprite {
    const animation = (this.merchantSprite = new PIXI.AnimatedSprite(
      this.standingTextures
    ));
    animation.animationSpeed = 0.1;
    animation.play();
    this.app.stage.addChild(animation);
    this.spawnRandomly();

    return animation;
  }

  private spawnRandomly(): void {
    const maxX = this.app.screen.width * 0.7 - this.merchantSprite.width;
    const maxY = this.app.screen.height * 0.7 - this.merchantSprite.height;

    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;

    this.merchantSprite.position.set(randomX, randomY);
  }

  public playInteractAnimation(): void {
    if (
      (!this.merchantSprite.playing ||
        this.merchantSprite.textures !== this.interactTextures) &&
      !this.metPlayer
    ) {
      this.merchantSprite.textures = this.interactTextures;
      this.merchantSprite.loop = false;
      this.merchantSprite.play();
      this.metPlayer = true;
    }
  }

  public playStandingAnimation(): void {
    if (
      !this.merchantSprite.playing ||
      this.merchantSprite.textures !== this.standingTextures
    ) {
      this.merchantSprite.textures = this.standingTextures;
      this.merchantSprite.loop = true;
      this.merchantSprite.play();
      this.metPlayer = false;
    }
  }

  public checkPlayerCollision(player: Player): void {
    const playerBounds = player.getBounds();
    const merchantBounds = this.merchantSprite.getBounds();

    if (playerBounds.intersects(merchantBounds)) {
      this.playInteractAnimation();
      this.isPlayerNear = true;
    } else {
      this.playStandingAnimation();
      this.isPlayerNear = false;
      this.closeMerchantWindow();
    }
  }

  public openMerchantWindow(): void {
    this.container.visible = true;
    this.isOpen = true;
  }

  public closeMerchantWindow(): void {
    this.container.visible = false;
    this.isOpen = false;
  }

  public handleEyePurchase() {
    if (!this.isEyePurchased) {
      this.isEyePurchased = true;
      this.playerInterface.addCursedEyeIcon(
        this.app.screen.width,
        this.app.screen.height
      );
      this.player.isEyePurchased = true;
    }
  }

  public handleKebabPurchase() {
    if (!this.isKebabPurchased) {
      this.isKebabPurchased = true;
      this.playerInterface.addKebabIcon(
        this.app.screen.width,
        this.app.screen.height
      );
      this.player.isKebabPurchased = true;
    }
  }
}
