import * as PIXI from 'pixi.js';
import { WeaponType } from '../Enums/WeaponType';

export class Weapon extends PIXI.Container {
  private app: PIXI.Application;
  private projectileSprite: PIXI.Sprite;
  private speed: number = 8;
  private direction: PIXI.Point;
  private isDestroyed: boolean = false;
  private damage: number;
  private weaponType: WeaponType;
  private isEyePurchased: boolean;
  private isKebabPurchased: boolean;

  constructor(
    app: PIXI.Application,
    x: number,
    y: number,
    direction: PIXI.Point,
    isEyePurchased: boolean,
    isKebabPurchased: boolean
  ) {
    super();
    this.app = app;
    this.isEyePurchased = isEyePurchased;
    this.isKebabPurchased = isKebabPurchased;

    const availableWeaponTypes: WeaponType[] = [WeaponType.Knife];
    if (this.isEyePurchased) {
      availableWeaponTypes.push(WeaponType.CursedEye);
    }
    if (this.isKebabPurchased) {
      availableWeaponTypes.push(WeaponType.Kebab);
    }

    const randomWeaponType =
      availableWeaponTypes[
        Math.floor(Math.random() * availableWeaponTypes.length)
      ];

    this.weaponType = randomWeaponType;

    this.projectileSprite = new PIXI.Sprite(
      PIXI.Texture.from(`/Player/weapons/${randomWeaponType}.png`)
    );
    this.projectileSprite.anchor.set(0.5);
    this.projectileSprite.position.set(x, y);
    this.direction = direction;
    this.damage = this.getDamageForWeapon(randomWeaponType);
  }

  private getDamageForWeapon(weaponType: WeaponType): number {
    switch (weaponType) {
      case WeaponType.Knife:
        return 5;
      case WeaponType.CursedEye:
        return 20;
      case WeaponType.Kebab:
        return 10;
      default:
        return 5;
    }
  }

  public handleWeaponMovement(): void {
    this.projectileSprite.x += this.speed * this.direction.x;
    this.projectileSprite.y += this.speed * this.direction.y;

    if (
      this.getSprite().x < 0 ||
      this.getSprite().x > this.app.screen.width ||
      this.getSprite().y < 0 ||
      this.getSprite().y > this.app.screen.height
    ) {
      this.destroy();
    }
  }

  public destroy(): void {
    this.isDestroyed = true;
  }

  public getSprite() {
    return this.projectileSprite;
  }

  public getisDestroyed(): boolean {
    return this.isDestroyed;
  }

  public getDamage() {
    return this.damage;
  }

  public getWeaponType() {
    return this.weaponType;
  }
}
