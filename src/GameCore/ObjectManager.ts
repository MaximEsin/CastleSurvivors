import * as PIXI from 'pixi.js';
import { Player } from '../Entities/Player';
import { InputManager } from './InputManager';
import { Enemy } from '../Entities/Enemy';
import { EnemyType } from '../Enums/EnemyType';
import { Weapon } from '../Entities/Weapon';
import { Loot } from '../Entities/Loot';
import { LootType } from '../Enums/LootType';
import { WeaponType } from '../Enums/WeaponType';
import { Merchant } from '../Entities/Merchant';
import { BaseLevel } from './BaseLevel';

export class ObjectManager {
  private app: PIXI.Application;
  private baseLevel: BaseLevel;
  private inputManager: InputManager;
  private gameLayer: PIXI.Container;
  private player: Player;
  private merchant: Merchant;
  private enemies: Enemy[] = [];
  private weapons: Weapon[] = [];
  private loot: Loot[] = [];
  private interfaceSizeMultiplier: number = 0.8;
  private lastWeaponThrowTime: number = 0;
  private weaponCooldown: number = 2000;
  private collisionCooldown: boolean = false;
  private kebabHealAmount: number = 5;
  private isEyePurchased: boolean = false;
  private isKebabPurchased: boolean = false;

  constructor(
    app: PIXI.Application,
    baseLevel: BaseLevel,
    gameLayer: PIXI.Container,
    inputManager: InputManager
  ) {
    this.app = app;
    this.baseLevel = baseLevel;
    this.inputManager = inputManager;
    this.gameLayer = gameLayer;
    this.player = new Player();
    this.merchant = new Merchant(this.app);
  }

  public spawnPlayer(): void {
    const playerSprite = this.player.getSprite();
    playerSprite.x = this.app.screen.width / 2;
    playerSprite.y = this.app.screen.height / 2;
    this.gameLayer.addChild(playerSprite);
  }

  public handlePlayerMovement(dt: number): void {
    if (this.inputManager.isPointerPressed()) {
      const mousePosition = this.inputManager.getPointerPosition();
      this.player.handlePlayerMovement(mousePosition, dt);
    } else {
      this.player.handlePlayerHalt();
    }

    this.player.adjustPlayerRotation(this.inputManager.getPointerPosition().x);
  }

  public handlePlayerBorderWrap(): void {
    const screenWidth = this.app.screen.width;
    const screenHeight = this.app.screen.height * this.interfaceSizeMultiplier;
    const playerSprite = this.player.getSprite();

    if (playerSprite.x < 20) {
      playerSprite.x = screenWidth;
    } else if (playerSprite.x > screenWidth) {
      playerSprite.x = 20;
    }

    if (playerSprite.y < 20) {
      playerSprite.y = screenHeight;
    } else if (playerSprite.y > screenHeight) {
      playerSprite.y = 20;
    }
  }

  public spawnEnemies(): void {
    const enemy = new Enemy(EnemyType.Mushroom);
    const enemy2 = new Enemy(EnemyType.Eye);
    const enemy3 = new Enemy(EnemyType.Skeleton);
    this.enemies.push(enemy, enemy2, enemy3);
    enemy.setRandomPosition(this.app, enemy.getSprite());
    enemy2.setRandomPosition(this.app, enemy2.getSprite());
    enemy3.setRandomPosition(this.app, enemy3.getSprite());

    this.gameLayer.addChild(enemy.getSprite());
    this.gameLayer.addChild(enemy2.getSprite());
    this.gameLayer.addChild(enemy3.getSprite());
  }

  public handleEnemyMovement(): void {
    this.enemies.forEach((enemy) => {
      enemy.moveToPlayer(this.player);
    });
  }

  public checkCollisionBetweenPlayerAndEnemy(enemy: Enemy): boolean {
    const playerBounds = this.player.getSprite().getBounds();
    const enemyBounds = enemy.getSprite().getBounds();

    if (playerBounds.intersects(enemyBounds)) {
      return true;
    }

    return false;
  }

  public handleMeleeDamageDealing(): void {
    if (!this.player.getIsDead()) {
      const currentTime = Date.now();
      for (const enemy of this.enemies) {
        if (this.checkCollisionBetweenPlayerAndEnemy(enemy)) {
          const timeSinceLastDamage =
            currentTime - this.player.getLastMeleeDamageTime();
          if (timeSinceLastDamage < this.player.getMeleeDamageCooldown()) {
            return;
          }
          this.player.setLastMeleeDamageTime(currentTime);
          this.player.setHealth(
            this.player.getHealth() - enemy.getMeleeDamage()
          );
          this.player.playHitSound();
          this.player.setIsDamaged(true);
        }
      }
    }
  }

  public handlePlayerAnimationUpdate(): void {
    this.player.updatePlayerAnimation();
  }

  public handlePlayerDeath(): void {
    if (this.player.getHealth() <= 0 && !this.player.getIsDead()) {
      this.player.handlePlayerDefeat();
    }
  }

  public resetEntities(): void {
    this.enemies.forEach((enemy) => {
      this.gameLayer.removeChild(enemy.getSprite());
    });
    this.enemies = [];

    this.gameLayer.removeChild(this.player.getSprite());
    this.player = new Player();
    this.spawnPlayer();
    this.spawnEnemies();
  }

  public getPlayer(): Player {
    return this.player;
  }

  public handleWeaponMovement() {
    this.weapons.forEach((weapon) => {
      weapon.handleWeaponMovement();
    });
  }

  private findNearestEnemy(): Enemy | null {
    let nearestEnemy: Enemy | null = null;
    let nearestDistanceSquared = Number.MAX_VALUE;

    for (const enemy of this.enemies) {
      const enemyPosition = enemy.getSprite();
      const dx = enemyPosition.x - this.player.getSprite().x;
      const dy = enemyPosition.y - this.player.getSprite().y;
      const distanceSquared = dx * dx + dy * dy;

      if (distanceSquared < nearestDistanceSquared) {
        nearestEnemy = enemy;
        nearestDistanceSquared = distanceSquared;
      }
    }

    return nearestEnemy;
  }

  public handlePlayerAttacks(dt: number) {
    const currentTime = Date.now();

    this.lastWeaponThrowTime -= dt;

    if (currentTime - this.lastWeaponThrowTime >= this.weaponCooldown) {
      const nearestEnemy = this.findNearestEnemy();

      if (nearestEnemy) {
        const dx = nearestEnemy.getSprite().x - this.player.getSprite().x;
        const dy = nearestEnemy.getSprite().y - this.player.getSprite().y;
        const length = Math.sqrt(dx ** 2 + dy ** 2);
        const direction = new PIXI.Point(dx / length, dy / length);
        const rotation = Math.atan2(dy, dx);

        if (currentTime - this.lastWeaponThrowTime >= this.weaponCooldown) {
          const weapon = new Weapon(
            this.app,
            this.player.getSprite().x,
            this.player.getSprite().y,
            direction,
            this.isEyePurchased,
            this.isKebabPurchased
          );
          weapon.getSprite().rotation = rotation;
          if (weapon.getWeaponType() === WeaponType.Kebab) {
            this.player.setHealth(
              this.player.getHealth() + this.kebabHealAmount
            );
          }
          this.weapons.push(weapon);
          this.gameLayer.addChild(weapon.getSprite());
          this.lastWeaponThrowTime = currentTime;
        }
      }
    }
  }

  public handleEnemyAnimationUpdate() {
    this.enemies.forEach((enemy) => {
      enemy.updateEnemyAnimation();
    });
  }

  public handleWeaponAndEnemyCollision(): boolean | void {
    if (this.collisionCooldown) {
      return;
    }
    this.weapons.forEach((weapon) => {
      this.enemies.forEach((enemy) => {
        if (
          weapon
            .getSprite()
            .getBounds()
            .intersects(enemy.getSprite().getBounds())
        ) {
          this.handleDamageDealingToEnemy(weapon.getDamage(), enemy);
          weapon.destroy();
          this.setCollisionCooldown();
          return true;
        }
      });
    });
  }

  private handleDamageDealingToEnemy(damage: number, enemy: Enemy) {
    enemy.setHealth(damage);
    enemy.setIsDamaged(true);

    if (enemy.getHealth() <= 0) {
      const index = this.enemies.indexOf(enemy);
      if (index !== -1) {
        this.enemies.splice(index, 1);
      }
      this.gameLayer.removeChild(enemy.getSprite());
      this.spawnLoot(
        enemy.getSprite().x,
        enemy.getSprite().y,
        enemy.getLootType()
      );
    }
  }

  private spawnLoot(x: number, y: number, lootType: LootType) {
    const loot = new Loot(x, y, lootType);
    this.loot.push(loot);
    this.gameLayer.addChild(loot.getSprite());
  }

  public handleLootCollision(): void {
    const playerBounds = this.player.getSprite().getBounds();
    for (const loot of this.loot) {
      const lootBounds = loot.getSprite().getBounds();

      if (playerBounds.intersects(lootBounds)) {
        if (!loot.getIsCollected()) {
          const value = loot.getLootValue();
          loot.collect();
          const playerMoney = this.player.getMoney();
          this.player.setMoney(playerMoney + value);

          for (let i = this.loot.length - 1; i >= 0; i--) {
            const lootEntity = this.loot[i];

            if (lootEntity.getIsCollected()) {
              this.loot.splice(i, 1);

              this.gameLayer.removeChild(loot.getSprite());
            }
          }
        }
      }
    }
  }

  private setCollisionCooldown(): void {
    this.collisionCooldown = true;
    setTimeout(() => {
      this.collisionCooldown = false;
    }, 1000);
  }

  public cleaner() {
    this.weapons.forEach((weapon) => {
      if (weapon.getisDestroyed()) {
        this.gameLayer.removeChild(weapon.getSprite());
      }
    });
  }

  public spawnMerchant() {
    this.gameLayer.addChild(this.merchant.getSprite());
    this.gameLayer.addChild(this.merchant.getMerchantWindowContainer());
    this.app.ticker.add(this.checkPlayerProximity.bind(this));
  }

  private checkPlayerProximity(): void {
    if (this.merchant.getIsPlayerNear() && !this.merchant.getIsOpen()) {
      this.merchant.openMerchantWindow();
    } else if (!this.merchant.getIsPlayerNear() && this.merchant.getIsOpen()) {
      this.merchant.closeMerchantWindow();
    }
  }

  public canPlayerAfford(cost: number) {
    if (cost <= this.player.getMoney()) {
      return true;
    }

    return false;
  }

  public handleMerchantAndPlayerCollision(): void {
    const playerBounds = this.player.getSprite().getBounds();
    const merchantBounds = this.merchant.getSprite().getBounds();

    if (playerBounds.intersects(merchantBounds)) {
      this.merchant.playInteractAnimation();
      this.merchant.setIsPlayerNear(true);

      if (!this.isEyePurchased && this.canPlayerAfford(50)) {
        this.handlePurchase(50);
        this.handleEyePurchase();
      } else if (!this.isKebabPurchased && this.canPlayerAfford(50)) {
        this.handlePurchase(50);
        this.handleKebabPurchase();
      }
    } else {
      this.merchant.playStandingAnimation();
      this.merchant.setIsPlayerNear(false);
    }
  }

  public handlePurchase(cost: number): void {
    this.player.setMoney(this.player.getMoney() - cost);
  }

  public handleEyePurchase() {
    if (!this.isEyePurchased) {
      this.isEyePurchased = true;
      this.baseLevel
        .getInterface()
        .addCursedEyeIcon(this.app.screen.width, this.app.screen.height);
    }
  }

  public handleKebabPurchase() {
    if (!this.isKebabPurchased) {
      this.isKebabPurchased = true;
      this.baseLevel
        .getInterface()
        .addKebabIcon(this.app.screen.width, this.app.screen.height);
    }
  }
}
