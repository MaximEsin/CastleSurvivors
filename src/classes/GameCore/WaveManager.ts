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
  private waveIntervals: number[] = [300, 240, 180, 120, 60];
  private easyWaveEnemyCounts: number = 5;
  private mediumWaveEnemyCounts: number = 10;
  private hardWaveEnemyCounts: number = 15;
  private isMobile: boolean;

  constructor(
    app: PIXI.Application,
    gameLayer: PIXI.Container,
    timer: Timer,
    isMobile: boolean
  ) {
    this.app = app;
    this.gameLayer = gameLayer;
    this.timer = timer;
    this.isMobile = isMobile;
  }

  public checkForNewWave(): void {
    const remainingTime =
      this.waveIntervals[GameObjectManager.instance.getCurrentWave()];

    if (this.timer.getTime() <= remainingTime) {
      this.startWave();
    }
  }

  private startWave(): void {
    GameObjectManager.instance.incrementCurrentWave();

    this.spawnEnemiesForWave(GameObjectManager.instance.getCurrentWave());
  }

  private spawnEnemiesForWave(waveNumber: number): void {
    switch (waveNumber) {
      case 1:
        for (let i = 0; i < this.mediumWaveEnemyCounts; i++) {
          const mushroom = new Mushroom(
            GameObjectManager.instance.animationManager,
            this.app,
            this.gameLayer,
            this.isMobile
          );
          this.gameLayer.addChild(mushroom);
          GameObjectManager.instance.enemies.push(mushroom);
        }
        break;
      case 2:
        for (let i = 0; i < this.easyWaveEnemyCounts; i++) {
          const mushroom = new Mushroom(
            GameObjectManager.instance.animationManager,
            this.app,
            this.gameLayer,
            this.isMobile
          );
          this.gameLayer.addChild(mushroom);
          GameObjectManager.instance.enemies.push(mushroom);
        }

        for (let i = 0; i < this.easyWaveEnemyCounts; i++) {
          const eye = new Eye(
            GameObjectManager.instance.animationManager,
            this.app,
            this.gameLayer,
            this.isMobile
          );
          this.gameLayer.addChild(eye);
          GameObjectManager.instance.enemies.push(eye);
        }
        break;
      case 3:
        for (let i = 0; i < this.hardWaveEnemyCounts; i++) {
          const eye = new Eye(
            GameObjectManager.instance.animationManager,
            this.app,
            this.gameLayer,
            this.isMobile
          );
          this.gameLayer.addChild(eye);
          GameObjectManager.instance.enemies.push(eye);
        }
        break;
      case 4:
        for (let i = 0; i < this.easyWaveEnemyCounts; i++) {
          const eye = new Eye(
            GameObjectManager.instance.animationManager,
            this.app,
            this.gameLayer,
            this.isMobile
          );
          this.gameLayer.addChild(eye);
          GameObjectManager.instance.enemies.push(eye);
        }

        for (let i = 0; i < this.easyWaveEnemyCounts; i++) {
          const skeleton = new Skeleton(
            GameObjectManager.instance.animationManager,
            this.app,
            this.gameLayer,
            this.isMobile
          );
          this.gameLayer.addChild(skeleton);
          GameObjectManager.instance.enemies.push(skeleton);
        }
        break;
      case 5:
        for (let i = 0; i < this.hardWaveEnemyCounts; i++) {
          const skeleton = new Skeleton(
            GameObjectManager.instance.animationManager,
            this.app,
            this.gameLayer,
            this.isMobile
          );
          this.gameLayer.addChild(skeleton);
          GameObjectManager.instance.enemies.push(skeleton);
        }
        break;
    }
  }
}
