import * as PIXI from 'pixi.js';
import { AnimationManager } from '../Managers/AnimationManager';
import { Enemy } from './Enemy';
import { Diamond } from '../Money/Diamond';
import { Player } from '../Player';

export class Eye extends Enemy {
  protected layer: PIXI.Container<PIXI.DisplayObject>;
  private standingAnimation: PIXI.Texture[];
  private movingAnimation: PIXI.Texture[];
  private damagedAnimation: PIXI.Texture[];

  constructor(
    animationManager: AnimationManager,
    app: PIXI.Application,
    layer: PIXI.Container<PIXI.DisplayObject>,
    isMobile: boolean
  ) {
    super(animationManager, app, 20, layer, isMobile);
    // Зачем тут лэйер? Он уже есть в родительском классе.
    // и так как он там protected, к нему можно обращаться
    // просто как к собственной переменной.
    this.layer = layer;
    this.standingAnimation = this.animationManager.getEyeFlyingAnimation();
    this.movingAnimation = this.animationManager.getEyeFlyingAnimation();
    this.damagedAnimation = this.animationManager.getEyeDamagedAnimation();
  }

  protected createEnemySprite(): PIXI.AnimatedSprite {
    const eyeTextures = this.animationManager.getMushroomStandingAnimation();
    const animation = new PIXI.AnimatedSprite(eyeTextures);

    this.enemySprite = animation;

    super.handleMobileResize();

    this.setRandomPosition(animation);

    animation.animationSpeed = 0.1;
    animation.anchor.set(0.5);
    animation.play();

    // Плохая затея. Старайся функции делать так, чтобы они выполняли только одну задачу.
    // пусть добавляет на нужный слой тот, кто запросил создание.
    this.layer.addChild(animation);

    return animation;
  }

  public resetEye(): void {
    this.setRandomPosition(this.enemySprite);
    this.projectiles.forEach((projectile) => projectile.destroy());
    this.projectiles = [];
  }

  override getDeathState(): boolean {
    return super.getDeathState();
  }

  override handleDeath(): void {
    super.handleDeath();
  }

  // Название слишком конкретное.
  // Из всех трёх врагов, КОИН у тебя только один враг генерит
  // Мб придумать какое-то общее название? Например spawnLoot или что-то такое.
  override spawnCoin() {
    super.spawnCoin();
    // Смотри, на самом деле лучше было бы это обратно наверх вынести
    // в GameObjectManager.
    // У гриба и скелетона тоже есть жестко настроенный метод.
    // и если например нужно будет поменять монетку на алмаз, то придется менять во всех местах.
    // Вместо спавн коина можно было бы отдавать тип монетки
    // а в GameObjectManager уже создать функцию типа spawnCoin, в которой передаём тип и позицию
    // после чего, при помощи switch-case создаём нужный экземпляр.
    // А вот для конкретного экземпляра как раз можно было бы создать свои функции
    // (просто чтобы разгрузить свич-кейс часть).
    // Это упростит создание новых монеток, сократит код и позволит динамически влиять на
    // монеты, которые выпадают из врагов. Например, если решишь добавить бустер, который
    // на время из всех врагов генерит алмазы. Тогда нужно будет просто на время присвоить
    // врагам нужный тип. Или, ахах, врагов, которые после убийства генерят
    // других врагов. Но это вот уже несколько спорно.

    // Я там в первом кодеревью писал, "можно было бы держать информацию о типе монеты в параметре врага,
    // а не проверять тип его класса."
    // Я имел в виду просто переменную с типом, которую враг отдаёт при запросе.
    // Тип монетки можно реализовать при помощи const enum (например в классе врага)
    // Например:
    // private static readonly enum CoinType {
    //   Coin,
    //   Diamond,
    //   Booster,
    // }
    // И обращаться к ней при помощи Enemy.CoinType
    return new Diamond(
      this.getSprite().x,
      this.getSprite().y,
      '/Shop/diamond.png',
      this.layer,
      super.getIsMobile()
    );
  }

  public update(player: Player): void {
    super.update(player);
    super.attack('/Enemies/Eye/projectile/Slime.png', 20);
    this.updateAnimation(
      this.standingAnimation,
      this.movingAnimation,
      this.damagedAnimation
    );
  }
}
