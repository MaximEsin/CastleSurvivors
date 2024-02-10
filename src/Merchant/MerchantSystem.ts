import * as PIXI from 'pixi.js';
import { System } from 'tick-knock';
import { Position } from '../Components/Position';
import { MerchantEntity } from './MerchantEntity';
import { Entity } from 'tick-knock';
import { PlayerComponent } from '../Player/Components/PlayerComponent';
import { PlayerInterfaceSystem } from '../Systems/Interface';

export class MerchantSystem extends System {
  private app: PIXI.Application;
  private merchant: Entity | null = null;
  private container: PIXI.Container;
  private isEyePurchased: boolean = false;
  private isKebabPurchased: boolean = false;
  private playerInterface: PlayerInterfaceSystem;

  constructor(app: PIXI.Application, playerIntrface: PlayerInterfaceSystem) {
    super();
    this.app = app;
    this.playerInterface = playerIntrface;
    this.container = new PIXI.Container();
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
      if (this.container.visible) {
        if (event.key === '1') {
          if (
            this.playerInterface.canPlayerAfford(50) &&
            !this.isEyePurchased
          ) {
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

  public openMerchantWindow(): void {
    this.container.visible = true;
  }

  public closeMerchantWindow(): void {
    this.container.visible = false;
  }

  public handleEyePurchase() {
    if (!this.isEyePurchased) {
      this.isEyePurchased = true;
      this.playerInterface.addCursedEyeIcon(
        this.app.screen.width,
        this.app.screen.height
      );
    }
  }

  public handleKebabPurchase() {
    if (!this.isKebabPurchased) {
      this.isKebabPurchased = true;
      this.playerInterface.addKebabIcon(
        this.app.screen.width,
        this.app.screen.height
      );
    }
  }

  spawnMerchant() {
    const position = this.getRandomPosition();
    this.merchant = new MerchantEntity(position);
    const merchantSprite = this.merchant.get<PIXI.Sprite>(PIXI.Sprite);
    if (merchantSprite) this.app.stage.addChild(merchantSprite);
    this.engine.addEntity(this.merchant);
  }

  private getRandomPosition(): Position {
    const x = Math.floor(Math.random() * (this.app.screen.width - 40)) + 20;
    const y =
      Math.floor(Math.random() * (this.app.screen.height - 40) * 0.7) + 20;
    return new Position(x, y);
  }

  update() {
    if (!this.merchant) {
      this.spawnMerchant();
    }

    const playerEntities: ReadonlyArray<Entity> = this.engine.entities.filter(
      (entity) => entity.has(PlayerComponent)
    );

    playerEntities.forEach((entity) => {
      if (this.isEyePurchased) {
        entity.addTag('EyePurchased');
      }
      if (this.isKebabPurchased) {
        entity.addTag('KebabPurchased');
      }
      const playerPosition = entity.get(Position);
      let merchantPosition: Position | undefined;
      if (this.merchant && playerPosition) {
        merchantPosition = this.merchant.get(Position);

        if (merchantPosition) {
          const distance = Math.sqrt(
            Math.pow(playerPosition.x - merchantPosition.x, 2) +
              Math.pow(playerPosition.y - merchantPosition.y, 2)
          );

          const merchantWindowThreshold = 100;
          if (distance <= merchantWindowThreshold) {
            this.container.visible = true;
          } else {
            this.container.visible = false;
          }
        }
      }
    });
  }
}
