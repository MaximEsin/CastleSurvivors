import * as PIXI from 'pixi.js';

export class Coin {
  protected app: PIXI.Application;
  protected layer: PIXI.Container<PIXI.DisplayObject>;
  protected coinSprite: PIXI.Sprite;
  protected isCollected: boolean = false;
  // название value слишком общее
  protected value: number = 1;

  constructor(
    app: PIXI.Application,
    x: number,
    y: number,
    sprite: string,
    layer: PIXI.Container<PIXI.DisplayObject>
  ) {
    // Зачем мы передаём сюда app ?
    this.app = app;
    this.layer = layer;
    this.coinSprite = new PIXI.Sprite(PIXI.Texture.from(sprite));
    this.coinSprite.anchor.set(0.5);
    this.coinSprite.position.set(x, y);

    this.layer.addChild(this.coinSprite);
  }

  public collect(): void {
    if (!this.isCollected) {
      this.isCollected = true;
      this.destroy();
    }
  }

  // Лучше явно указывать тип возврашаемой переменной
  public getIsCollected() {
    return this.isCollected;
  }

  public getSprite(): PIXI.Sprite {
    return this.coinSprite;
  }

  public getValue() {
    // Для подобных функций можно использовать геттеры.
    // Не очень понятно зачем скрывать переменные за protected
    // а потом отдавать их public 
    return this.value;
  }

  public destroy(): void {
    // Подобные функции должны отвечать только за то, что происходит внутри
    // например, за уничтожение спрайта. 
    // А вот уже удалением из родительского слоя, из массива и тд, стоит заниматься
    // в том месте, где был создан экземпляр.
    this.layer.removeChild(this.coinSprite);
  }
}
