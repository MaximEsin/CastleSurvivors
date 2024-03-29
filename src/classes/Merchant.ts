import * as PIXI from 'pixi.js';
import { AnimationManager } from './Managers/AnimationManager';
import { Player } from './Player';
import { PlayerInterface } from './UI/PlayerInterface';
import { PlayerWeaponsManager } from './Managers/PlayerWeaponManager';

export class Merchant {
  private app: PIXI.Application;
  private layer: PIXI.Container<PIXI.DisplayObject>;
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
  private playerWeaponsManager: PlayerWeaponsManager;
  private isMobile: boolean;

  constructor(
    app: PIXI.Application,
    layer: PIXI.Container<PIXI.DisplayObject>,
    animationManager: AnimationManager,
    playerInterface: PlayerInterface,
    playerWeaponsManager: PlayerWeaponsManager,
    isMobile: boolean
  ) {
    this.app = app;
    this.layer = layer;
    this.animationManager = animationManager;
    this.playerInterface = playerInterface;
    this.playerWeaponsManager = playerWeaponsManager;
    this.isMobile = isMobile;
    this.container = new PIXI.Container();
    this.container.interactive = true;
    this.standingTextures =
      this.animationManager.getMerchantStandingAnimation();
    this.interactTextures =
      this.animationManager.getMerchantInteractAnimation();
    this.merchantSprite = this.createMerchantSprite();

    this.layer.addChild(this.container);
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
      20
    );
    this.addWeaponImageWithText(
      '/Player/weapons/kebab.png',
      'Kebab: 50',
      180,
      40
    );

    this.container.position.set(
      (app.screen.width - this.container.width) / 2,
      (app.screen.height - this.container.height) / 2
    );

    this.app.ticker.add(this.checkPlayerProximity.bind(this));
  }

  private checkPlayerProximity(): void {
    if (this.isPlayerNear && !this.isOpen) {
      this.openMerchantWindow();
    } else if (!this.isPlayerNear && this.isOpen) {
      this.closeMerchantWindow();
    }
  }

  public checkPlayerCollision(player: Player): void {
    const playerBounds = player.getBounds();
    const merchantBounds = this.merchantSprite.getBounds();

    if (playerBounds.intersects(merchantBounds)) {
      this.playInteractAnimation();
      this.isPlayerNear = true;

      if (!this.isEyePurchased && this.playerInterface.canPlayerAfford(50)) {
        this.playerInterface.handlePurchase(50);
        this.handleEyePurchase();
      } else if (
        !this.isKebabPurchased &&
        this.playerInterface.canPlayerAfford(50)
      ) {
        this.playerInterface.handlePurchase(50);
        this.handleKebabPurchase();
      }
    } else {
      this.playStandingAnimation();
      this.isPlayerNear = false;
    }
  }

  private addWeaponImageWithText(
    imagePath: string,
    text: string,
    x: number,
    y: number
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
  }

  private createMerchantSprite(): PIXI.AnimatedSprite {
    const animation = (this.merchantSprite = new PIXI.AnimatedSprite(
      this.standingTextures
    ));

    if (this.isMobile) {
      animation.scale.set(0.5);
    }

    animation.animationSpeed = 0.1;
    animation.play();
    this.layer.addChild(animation);
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
      this.playerWeaponsManager.isEyePurchased = true;
    }
  }

  public handleKebabPurchase() {
    if (!this.isKebabPurchased) {
      this.isKebabPurchased = true;
      this.playerInterface.addKebabIcon(
        this.app.screen.width,
        this.app.screen.height
      );
      this.playerWeaponsManager.isKebabPurchased = true;
    }
  }
}
