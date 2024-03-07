import * as PIXI from 'pixi.js';
import { AnimationManager } from '../GameCore/AnimationManager';

export class Merchant {
  private app: PIXI.Application;
  private merchantSprite: PIXI.AnimatedSprite;
  private standingTextures: PIXI.Texture[] =
    AnimationManager.getMerchantStandingAnimation();
  private interactTextures: PIXI.Texture[] =
    AnimationManager.getMerchantInteractAnimation();
  private metPlayer: boolean = false;
  private container: PIXI.Container;
  private isOpen: boolean = false;
  private isPlayerNear: boolean = false;

  constructor(app: PIXI.Application) {
    this.app = app;
    this.container = new PIXI.Container();
    this.container.interactive = true;
    this.merchantSprite = this.createMerchantSprite();
    this.container.visible = false;

    const containerBackground = new PIXI.Graphics();
    containerBackground.beginFill(0x2a2a2a);
    containerBackground.drawRect(0, 0, 300, 150);
    containerBackground.endFill();
    this.container.addChild(containerBackground);

    this.addWeaponImageWithText(
      '/Player/weapons/CursedEye.png',
      'Cursed Eye: 50',
      20,
      20
    );
    this.addWeaponImageWithText(
      '/Player/weapons/Kebab.png',
      'Kebab: 50',
      180,
      40
    );

    this.container.position.set(
      (app.screen.width - this.container.width) / 2,
      (app.screen.height - this.container.height) / 2
    );
  }

  public getMerchantWindowContainer() {
    return this.container;
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

    animation.animationSpeed = 0.1;
    animation.play();
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

  public getSprite() {
    return this.merchantSprite;
  }

  public getIsPlayerNear() {
    return this.isPlayerNear;
  }

  public setIsPlayerNear(value: boolean) {
    this.isPlayerNear = value;
  }

  public getIsOpen() {
    return this.isOpen;
  }
}
