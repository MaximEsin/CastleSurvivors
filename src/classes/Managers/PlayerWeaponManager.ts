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

  public update(enemies: Enemy[]) {
    // Советую передавать сюда dt и из last...ThrowTime вычитать dt
    // Если меньше или равно 0, кидаем проджектайл без проверки внутри
    // И приравниваем last...ThrowTime к ...Cooldown
    // чуть подробнее описал в throwProjectile
    this.updateKnives(enemies);
    this.updateCursedEyes(enemies);
    this.updateKebabs(enemies);
  }

  private updateKnives(enemies: Enemy[]) {
    this.throwKnife(enemies);
    this.knives.forEach((knife) => {
      knife.update();
    });
  }

  private updateCursedEyes(enemies: Enemy[]) {
    if (this.isEyePurchased) {
      this.throwEye(enemies);
    }
    this.cursedEyes.forEach((eye) => {
      eye.update();
    });
  }

  private updateKebabs(enemies: Enemy[]) {
    if (this.isKebabPurchased) {
      this.throwKebab(enemies);
    }
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
    lastItemThrowTimer: number,
    coolDown: number,
    weaponType: string,
    enemies: Enemy[]
  ) {
    const currentTime = Date.now();
    const playerPosition = this.player.getSprite().position;

    // Проверку на куррент тайм лучше вынести на два шаг назад
    // в update-функцию
    if (currentTime - lastItemThrowTimer >= coolDown) {
      // Нахрждение ближайшего врага на самом деле нужно делать только один раз
      // для всех видов оружия. Это можно перенести в update.
      // Типа, вначале обновляем таймеры, если хотя бы один из них прошел,
      // ищем врага, а затем уже кидаем оружие с вышедшим таймером.
      const nearestEnemy = this.findNearestEnemy(playerPosition, enemies);

      if (nearestEnemy) {
        const dx = nearestEnemy.getSprite().x - this.player.getSprite().x;
        const dy = nearestEnemy.getSprite().y - this.player.getSprite().y;
        const length = Math.sqrt(dx ** 2 + dy ** 2);
        const direction = new PIXI.Point(dx / length, dy / length);
        const rotation = Math.atan2(dy, dx);

        // Вот тут можно довольно большую часть кода выделить в общую функцию
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
            this.lastKnifeThrowTime = currentTime;
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
            this.lastEyeThrowTime = currentTime;
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
            this.lastKebabThrowTime = currentTime;
            break;

          default:
            break;
        }
      }
    }
  }

  public throwKnife(enemies: Enemy[]) {
    this.throwProjectile(
      this.lastKnifeThrowTime,
      this.knifeCooldown,
      'knife',
      enemies
    );
  }

  public throwEye(enemies: Enemy[]) {
    this.throwProjectile(
      this.lastEyeThrowTime,
      this.EyeCooldown,
      'eye',
      enemies
    );
  }

  public throwKebab(enemies: Enemy[]) {
    this.throwProjectile(
      this.lastKebabThrowTime,
      this.kebabCooldown,
      'kebab',
      enemies
    );
  }
}
