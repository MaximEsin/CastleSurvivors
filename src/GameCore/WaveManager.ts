import * as PIXI from 'pixi.js';
import { BaseLevel } from './BaseLevel';
import { Enemy } from '../Entities/Enemy';
import { EnemyType } from '../Enums/EnemyType';
import { ObjectManager } from './ObjectManager';

export class WaveManager {
  private app: PIXI.Application;
  private objectManager: ObjectManager;
  private baseLevel: BaseLevel;
  private gameLayer: PIXI.Container;
  private waveIntervals: number[] = [300, 240, 180, 120, 60];
  private easyWaveEnemyCounts: number = 5;
  private mediumWaveEnemyCounts: number = 10;
  private hardWaveEnemyCounts: number = 15;
  private currentWave: number = 0;

  constructor(
    app: PIXI.Application,
    baseLevel: BaseLevel,
    objectManager: ObjectManager,
    gameLayer: PIXI.Container
  ) {
    this.app = app;
    this.baseLevel = baseLevel;
    this.objectManager = objectManager;
    this.gameLayer = gameLayer;
  }

  public resetCurrentWave() {
    this.currentWave = 0;
  }

  public checkForNewWave(): void {
    const remainingTime = this.waveIntervals[this.currentWave];

    if (this.baseLevel.getTime() <= remainingTime) {
      this.startWave();
    }
  }

  private startWave(): void {
    this.currentWave++;

    this.spawnEnemiesForWave(this.currentWave);
  }

  private spawnEnemiesForWave(waveNumber: number): void {
    switch (waveNumber) {
      case 1:
        for (let i = 0; i < this.mediumWaveEnemyCounts; i++) {
          const mushroom = new Enemy(EnemyType.Mushroom);
          mushroom.setRandomPosition(this.app, mushroom.getSprite());
          this.gameLayer.addChild(mushroom.getSprite());
          this.objectManager.addEnemy(mushroom);
        }
        break;
      case 2:
        for (let i = 0; i < this.easyWaveEnemyCounts; i++) {
          const mushroom = new Enemy(EnemyType.Mushroom);
          mushroom.setRandomPosition(this.app, mushroom.getSprite());
          this.gameLayer.addChild(mushroom.getSprite());
          this.objectManager.addEnemy(mushroom);
        }

        for (let i = 0; i < this.easyWaveEnemyCounts; i++) {
          const eye = new Enemy(EnemyType.Eye);
          eye.setRandomPosition(this.app, eye.getSprite());
          this.gameLayer.addChild(eye.getSprite());
          this.objectManager.addEnemy(eye);
        }
        break;
      case 3:
        for (let i = 0; i < this.hardWaveEnemyCounts; i++) {
          const eye = new Enemy(EnemyType.Eye);
          eye.setRandomPosition(this.app, eye.getSprite());
          this.gameLayer.addChild(eye.getSprite());
          this.objectManager.addEnemy(eye);
        }
        break;
      case 4:
        for (let i = 0; i < this.easyWaveEnemyCounts; i++) {
          const eye = new Enemy(EnemyType.Eye);
          eye.setRandomPosition(this.app, eye.getSprite());
          this.gameLayer.addChild(eye.getSprite());
          this.objectManager.addEnemy(eye);
        }

        for (let i = 0; i < this.easyWaveEnemyCounts; i++) {
          const skeleton = new Enemy(EnemyType.Skeleton);
          skeleton.setRandomPosition(this.app, skeleton.getSprite());
          this.gameLayer.addChild(skeleton.getSprite());
          this.objectManager.addEnemy(skeleton);
        }
        break;
      case 5:
        for (let i = 0; i < this.hardWaveEnemyCounts; i++) {
          const skeleton = new Enemy(EnemyType.Skeleton);
          skeleton.setRandomPosition(this.app, skeleton.getSprite());
          this.gameLayer.addChild(skeleton.getSprite());
          this.objectManager.addEnemy(skeleton);
        }
        break;
    }
  }
}
