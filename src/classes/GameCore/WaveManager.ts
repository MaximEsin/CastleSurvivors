import * as PIXI from 'pixi.js';
import { Timer } from '../UI/Timer';
import { Mushroom } from '../Enemies/Mushroom';
import { Eye } from '../Enemies/Eye';
import { Skeleton } from '../Enemies/Skeleton';
import { GameObjectManager } from './GameObjectManager';

export class WaveManager {
  private app: PIXI.Application;
  private gameLayer: PIXI.Container;
  private timer: Timer;
  private gameObjectManager: GameObjectManager;
  private waveIntervals: number[] = [300, 240, 180, 120, 60];
  private isMobile: boolean;

  constructor(
    app: PIXI.Application,
    gameLayer: PIXI.Container,
    timer: Timer,
    gameObjectManager: GameObjectManager,
    isMobile: boolean
  ) {
    this.app = app;
    this.gameLayer = gameLayer;
    this.timer = timer;
    this.gameObjectManager = gameObjectManager;
    this.isMobile = isMobile;
  }

  public checkForNewWave(): void {
    const remainingTime =
      this.waveIntervals[this.gameObjectManager.getCurrentWave()];

    if (this.timer.getTime() <= remainingTime) {
      this.startWave();
    }
  }

  private startWave(): void {
    this.gameObjectManager.incrementCurrentWave();

    this.spawnEnemiesForWave(this.gameObjectManager.getCurrentWave());
  }

  private spawnEnemiesForWave(waveNumber: number): void {
    switch (waveNumber) {
      case 1:
        // Магические цифры, лучше вынести в константы
        // Так будет проще настраивать баланс
        for (let i = 0; i < 10; i++) {
          const mushroom = new Mushroom(
            this.gameObjectManager.animationManager,
            this.app,
            this.gameLayer,
            this.isMobile
          );
          this.gameLayer.addChild(mushroom.getSprite());
          this.gameObjectManager.enemies.push(mushroom);
        }
        break;
      case 2:
        for (let i = 0; i < 5; i++) {
          const mushroom = new Mushroom(
            this.gameObjectManager.animationManager,
            this.app,
            this.gameLayer,
            this.isMobile
          );
          this.gameLayer.addChild(mushroom.getSprite());
          this.gameObjectManager.enemies.push(mushroom);
        }

        /// Ты вот сейчас передаешь и слой внутри класса варага, сверху в форе
        /// а там ты кстати хех, УЖЕ кладёшь анимацию на слой
        /// а потом на тот-же слой ещё раз кладёшь эту анимацию.
        for (let i = 0; i < 5; i++) {
          const eye = new Eye(
            this.gameObjectManager.animationManager,
            this.app,
            this.gameLayer,
            this.isMobile
          );
          /// На самом деле, так как ты наследуешь энеми от контейнера, можно было сразу сделать так
          /// this.gameLayer.addChild(eye);
          /// А уже в самом контейнере адчайлдить анимацию не на слой, а this.addChild()
          this.gameLayer.addChild(eye.getSprite());
          this.gameObjectManager.enemies.push(eye);
        }
        break;
      case 3:
        for (let i = 0; i < 15; i++) {
          const eye = new Eye(
            this.gameObjectManager.animationManager,
            this.app,
            this.gameLayer,
            this.isMobile
          );
          this.gameLayer.addChild(eye.getSprite());
          this.gameObjectManager.enemies.push(eye);
        }
        break;
      case 4:
        for (let i = 0; i < 5; i++) {
          const eye = new Eye(
            this.gameObjectManager.animationManager,
            this.app,
            this.gameLayer,
            this.isMobile
          );
          this.gameLayer.addChild(eye.getSprite());
          this.gameObjectManager.enemies.push(eye);
        }

        for (let i = 0; i < 5; i++) {
          const skeleton = new Skeleton(
            this.gameObjectManager.animationManager,
            this.app,
            this.gameLayer,
            this.isMobile
          );
          this.gameLayer.addChild(skeleton.getSprite());
          this.gameObjectManager.enemies.push(skeleton);
        }
        break;
      case 5:
        for (let i = 0; i < 15; i++) {
          const skeleton = new Skeleton(
            this.gameObjectManager.animationManager,
            this.app,
            this.gameLayer,
            this.isMobile
          );
          this.gameLayer.addChild(skeleton.getSprite());
          this.gameObjectManager.enemies.push(skeleton);
        }
        break;
    }
  }
}
