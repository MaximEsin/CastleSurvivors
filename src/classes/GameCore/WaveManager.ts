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
  private easyWaveEnemyCounts: number = 5;
  private mediumWaveEnemyCounts: number = 10;
  private hardWaveEnemyCounts: number = 15;
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
        for (let i = 0; i < this.mediumWaveEnemyCounts; i++) {
          const mushroom = new Mushroom(
            this.gameObjectManager.animationManager,
            this.app,
            this.gameLayer,
            this.isMobile
          );
          this.gameLayer.addChild(mushroom);
          this.gameObjectManager.enemies.push(mushroom);
        }
        break;
      case 2:
        for (let i = 0; i < this.easyWaveEnemyCounts; i++) {
          const mushroom = new Mushroom(
            this.gameObjectManager.animationManager,
            this.app,
            this.gameLayer,
            this.isMobile
          );
          this.gameLayer.addChild(mushroom);
          this.gameObjectManager.enemies.push(mushroom);
        }

        for (let i = 0; i < this.easyWaveEnemyCounts; i++) {
          const eye = new Eye(
            this.gameObjectManager.animationManager,
            this.app,
            this.gameLayer,
            this.isMobile
          );
          this.gameLayer.addChild(eye);
          this.gameObjectManager.enemies.push(eye);
        }
        break;
      case 3:
        for (let i = 0; i < this.hardWaveEnemyCounts; i++) {
          const eye = new Eye(
            this.gameObjectManager.animationManager,
            this.app,
            this.gameLayer,
            this.isMobile
          );
          this.gameLayer.addChild(eye);
          this.gameObjectManager.enemies.push(eye);
        }
        break;
      case 4:
        for (let i = 0; i < this.easyWaveEnemyCounts; i++) {
          const eye = new Eye(
            this.gameObjectManager.animationManager,
            this.app,
            this.gameLayer,
            this.isMobile
          );
          this.gameLayer.addChild(eye);
          this.gameObjectManager.enemies.push(eye);
        }

        for (let i = 0; i < this.easyWaveEnemyCounts; i++) {
          const skeleton = new Skeleton(
            this.gameObjectManager.animationManager,
            this.app,
            this.gameLayer,
            this.isMobile
          );
          this.gameLayer.addChild(skeleton);
          this.gameObjectManager.enemies.push(skeleton);
        }
        break;
      case 5:
        for (let i = 0; i < this.hardWaveEnemyCounts; i++) {
          const skeleton = new Skeleton(
            this.gameObjectManager.animationManager,
            this.app,
            this.gameLayer,
            this.isMobile
          );
          this.gameLayer.addChild(skeleton);
          this.gameObjectManager.enemies.push(skeleton);
        }
        break;
    }
  }
}
