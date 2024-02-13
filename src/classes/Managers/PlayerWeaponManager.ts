import * as PIXI from 'pixi.js';
import { Knife } from '../Weapons/Knife';
import { CursedEye } from '../Weapons/CursedEye';
import { Kebab } from '../Weapons/Kebab';
import { PlayerInterface } from '../UI/PlayerInterface';
import { Player } from '../Player';

export class PlayerWeaponsManager {
  private app: PIXI.Application;
  private layer: PIXI.Container<PIXI.DisplayObject>;
  private player: Player;
  private playerInterface: PlayerInterface;

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
    playerinterface: PlayerInterface
  ) {
    this.app = app;
    this.layer = layer;
    this.player = player;
    this.playerInterface = playerinterface;
    this.app.renderer.plugins.interaction.autoPreventDefault = false;
  }

  public update(mousePosition: { x: number; y: number }) {
    this.updateKnives(mousePosition);
    this.updateCursedEyes(mousePosition);
    this.updateKebabs(mousePosition);
  }

  private updateKnives(mousePosition: { x: number; y: number }) {
    this.throwKnife(mousePosition);
    this.knives.forEach((knife) => {
      knife.update();
    });
  }

  private updateCursedEyes(mousePosition: { x: number; y: number }) {
    if (this.isEyePurchased) {
      this.throwEye(mousePosition);
    }
    this.cursedEyes.forEach((eye) => {
      eye.update();
    });
  }

  private updateKebabs(mousePosition: { x: number; y: number }) {
    if (this.isKebabPurchased) {
      this.throwKebab(mousePosition);
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

  private throwProjectile(
    lastItemThrowTimer: number,
    coolDown: number,
    weaponType: string,
    mousePosition: { x: number; y: number }
  ) {
    const currentTime = Date.now();

    if (currentTime - lastItemThrowTimer >= coolDown) {
      const dx = mousePosition.x - this.player.getSprite().x;
      const dy = mousePosition.y - this.player.getSprite().y;

      const length = Math.sqrt(dx ** 2 + dy ** 2);
      const direction = new PIXI.Point(dx / length, dy / length);
      const rotation = Math.atan2(dy, dx);

      if (weaponType === 'knife') {
        const knife = new Knife(
          this.app,
          this.layer,
          this.player.getSprite().x,
          this.player.getSprite().y,
          direction,
          5,
          rotation
        );

        this.knives.push(knife);

        this.layer.addChildAt(knife.getSprite(), 1);

        this.lastKnifeThrowTime = currentTime;
      }

      if (weaponType === 'eye') {
        const eye = new CursedEye(
          this.app,
          this.layer,
          this.player.getSprite().x,
          this.player.getSprite().y,
          direction,
          20,
          rotation
        );

        this.cursedEyes.push(eye);

        this.layer.addChildAt(eye.getSprite(), 1);

        this.lastEyeThrowTime = currentTime;
      }

      if (weaponType === 'kebab') {
        const kebab = new Kebab(
          this.app,
          this.layer,
          this.player.getSprite().x,
          this.player.getSprite().y,
          direction,
          10,
          rotation
        );

        this.player.health += 5;
        this.playerInterface.updateHealthText(this.player.health);

        this.kebabs.push(kebab);

        this.layer.addChildAt(kebab.getSprite(), 1);

        this.lastKebabThrowTime = currentTime;
      }
    }
  }

  public throwKnife(mousePosition: { x: number; y: number }) {
    this.throwProjectile(
      this.lastKnifeThrowTime,
      this.knifeCooldown,
      'knife',
      mousePosition
    );
  }

  public throwEye(mousePosition: { x: number; y: number }) {
    this.throwProjectile(
      this.lastEyeThrowTime,
      this.EyeCooldown,
      'eye',
      mousePosition
    );
  }

  public throwKebab(mousePosition: { x: number; y: number }) {
    this.throwProjectile(
      this.lastKebabThrowTime,
      this.kebabCooldown,
      'kebab',
      mousePosition
    );
  }
}
