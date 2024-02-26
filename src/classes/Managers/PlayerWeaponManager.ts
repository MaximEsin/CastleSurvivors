import * as PIXI from 'pixi.js';
import { Knife } from '../Weapons/Knife';
import { CursedEye } from '../Weapons/CursedEye';
import { Kebab } from '../Weapons/Kebab';
import { PlayerInterface } from '../UI/PlayerInterface';
import { Player } from '../Player';
import { Enemy } from '../Enemies/Enemy';

export class PlayerWeaponsManager {
  private app: PIXI.Application;
  private layer: PIXI.Container<PIXI.DisplayObject>;
  private player: Player;
  private playerInterface: PlayerInterface;
  private isMobile: boolean;

  public knives: Knife[] = [];
  public cursedEyes: CursedEye[] = [];
  public kebabs: Kebab[] = [];

  public isEyePurchased: boolean = false;
  public isKebabPurchased: boolean = false;

  private lastKnifeThrowTime: number = 0;
  private knifeCooldown: number = 2000;

  private lastEyeThrowTime: number = 0;
  private EyeCooldown: number = 3000;

  private lastKebabThrowTime: number = 0;
  private kebabCooldown: number = 5000;

  constructor(
    app: PIXI.Application,
    layer: PIXI.Container<PIXI.DisplayObject>,
    player: Player,
    playerinterface: PlayerInterface,
    isMobile: boolean
  ) {
    this.app = app;
    this.layer = layer;
    this.player = player;
    this.playerInterface = playerinterface;
    this.isMobile = isMobile;
    this.app.renderer.plugins.interaction.autoPreventDefault = false;
  }

  public update(enemies: Enemy[], dt: number) {
    const currentTime = Date.now();

    this.updateTimers(dt);

    if (
      currentTime - this.lastKnifeThrowTime >= this.knifeCooldown ||
      currentTime - this.lastEyeThrowTime >= this.EyeCooldown ||
      currentTime - this.lastKebabThrowTime >= this.kebabCooldown
    ) {
      const playerPosition = this.player.getSprite().position;
      const nearestEnemy = this.findNearestEnemy(playerPosition, enemies);

      if (nearestEnemy) {
        const dx = nearestEnemy.getSprite().x - this.player.getSprite().x;
        const dy = nearestEnemy.getSprite().y - this.player.getSprite().y;
        const length = Math.sqrt(dx ** 2 + dy ** 2);
        const direction = new PIXI.Point(dx / length, dy / length);
        const rotation = Math.atan2(dy, dx);

        if (currentTime - this.lastKnifeThrowTime >= this.knifeCooldown) {
          this.throwProjectile('knife', direction, rotation);
          this.lastKnifeThrowTime = currentTime;
        }

        if (currentTime - this.lastEyeThrowTime >= this.EyeCooldown) {
          if (this.isEyePurchased) {
            this.throwProjectile('eye', direction, rotation);
            this.lastEyeThrowTime = currentTime;
          }
        }

        if (currentTime - this.lastKebabThrowTime >= this.kebabCooldown) {
          if (this.isKebabPurchased) {
            this.throwProjectile('kebab', direction, rotation);
            this.lastKebabThrowTime = currentTime;
          }
        }
      }
    }

    this.updateKnives();
    this.updateCursedEyes();
    this.updateKebabs();
  }

  private updateTimers(dt: number) {
    this.lastKnifeThrowTime -= dt;
    this.lastEyeThrowTime -= dt;
    this.lastKebabThrowTime -= dt;
  }

  private updateKnives() {
    this.knives.forEach((knife) => {
      knife.update();
    });
  }

  private updateCursedEyes() {
    this.cursedEyes.forEach((eye) => {
      eye.update();
    });
  }

  private updateKebabs() {
    this.kebabs.forEach((kebab) => {
      kebab.update();
    });
  }

  getKnives() {
    return this.knives;
  }

  getEyes() {
    return this.cursedEyes;
  }

  getKebabs() {
    return this.kebabs;
  }

  private findNearestEnemy(
    playerPosition: PIXI.Point,
    enemies: Enemy[]
  ): Enemy | null {
    let nearestEnemy: Enemy | null = null;
    let nearestDistanceSquared = Number.MAX_VALUE;

    for (const enemy of enemies) {
      const enemyPosition = enemy.getSprite();
      const dx = enemyPosition.x - playerPosition.x;
      const dy = enemyPosition.y - playerPosition.y;
      const distanceSquared = dx * dx + dy * dy;

      if (distanceSquared < nearestDistanceSquared) {
        nearestEnemy = enemy;
        nearestDistanceSquared = distanceSquared;
      }
    }

    return nearestEnemy;
  }

  private throwProjectile(
    weaponType: string,
    direction: PIXI.Point,
    rotation: number
  ) {
    switch (weaponType) {
      case 'knife':
        const knife = new Knife(
          this.app,
          this.layer,
          this.player.getSprite().x,
          this.player.getSprite().y,
          direction,
          5,
          rotation,
          this.isMobile
        );
        this.knives.push(knife);
        this.layer.addChildAt(knife.getSprite(), 1);
        break;

      case 'eye':
        const eye = new CursedEye(
          this.app,
          this.layer,
          this.player.getSprite().x,
          this.player.getSprite().y,
          direction,
          20,
          rotation,
          this.isMobile
        );
        this.cursedEyes.push(eye);
        this.layer.addChildAt(eye.getSprite(), 1);
        break;

      case 'kebab':
        const kebab = new Kebab(
          this.app,
          this.layer,
          this.player.getSprite().x,
          this.player.getSprite().y,
          direction,
          10,
          rotation,
          this.isMobile
        );
        this.player.health += 5;
        this.playerInterface.updateHealthText(this.player.health);
        this.kebabs.push(kebab);
        this.layer.addChildAt(kebab.getSprite(), 1);
        break;

      default:
        break;
    }
  }
}
