import * as PIXI from 'pixi.js';
import { Knife } from '../Weapons/Knife';
import { CursedEye } from '../Weapons/CursedEye';
import { Kebab } from '../Weapons/Kebab';

export class PlayerWeaponsManager {
  private app: PIXI.Application;
  private layer: PIXI.Container<PIXI.DisplayObject>;
  private playerSprite: PIXI.AnimatedSprite;

  public knives: Knife[] = [];
  public cursedEyes: CursedEye[] = [];
  public kebabs: Kebab[] = [];

  private lastKnifeThrowTime: number = 0;
  private knifeCooldown: number = 2000;

  private lastEyeThrowTime: number = 0;
  private EyeCooldown: number = 3000;

  private lastKebabThrowTime: number = 0;
  private kebabCooldown: number = 5000;

  constructor(
    app: PIXI.Application,
    layer: PIXI.Container<PIXI.DisplayObject>,
    playerSprite: PIXI.AnimatedSprite
  ) {
    this.app = app;
    this.layer = layer;
    this.playerSprite = playerSprite;
    this.app.renderer.plugins.interaction.autoPreventDefault = false;
  }

  public update() {
    this.updateKnives();
    this.updateCursedEyes();
    this.updateKebabs();
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

  private throwProjectile(
    lastItemThrowTimer: number,
    coolDown: number,
    weaponType: string,
    mousePosition: { x: number; y: number }
  ) {
    const currentTime = Date.now();

    if (currentTime - lastItemThrowTimer >= coolDown) {
      const dx = mousePosition.x - this.playerSprite.x;
      const dy = mousePosition.y - this.playerSprite.y;

      const length = Math.sqrt(dx ** 2 + dy ** 2);
      const direction = new PIXI.Point(dx / length, dy / length);
      const rotation = Math.atan2(dy, dx);

      if (weaponType === 'knife') {
        const knife = new Knife(
          this.app,
          this.layer,
          this.playerSprite.x,
          this.playerSprite.y,
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
          this.playerSprite.x,
          this.playerSprite.y,
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
          this.playerSprite.x,
          this.playerSprite.y,
          direction,
          10,
          rotation
        );

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
