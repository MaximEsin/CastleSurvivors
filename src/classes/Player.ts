import * as PIXI from 'pixi.js';
import { AnimationManager } from './Managers/AnimationManager';
import { InputManager } from './Managers/InputManager';
import { AudioManager } from './Managers/AudioManager';
import { Projectile } from './Projectile';
import { PlayerInterface } from './UI/PlayerInterface';
import { DeathScreen } from './UI/DeathScreen';
import { Knife } from './Weapons/Knife';
import { Coin } from './Money/Coin';
import { CursedEye } from './Weapons/CursedEye';
import { PlayerWeaponsManager } from './Managers/PlayerWeaponManager';

export class Player {
  private app: PIXI.Application;
  private animationManager: AnimationManager;
  private inputManager: InputManager;
  private audioManager: AudioManager;
  private playerSprite: PIXI.AnimatedSprite;
  private playerStandingTextures: PIXI.Texture[];
  private playerMovingTextures: PIXI.Texture[];
  private playerDamagedTextures: PIXI.Texture[];
  private playerInterface: PlayerInterface;
  private deathScreen: DeathScreen;
  private health: number;
  private layer: PIXI.Container<PIXI.DisplayObject>;
  private isDamaged: boolean = false;
  private isMoving: boolean = false;
  private stopEnemiesCallback: () => void;
  public isEyePurchased: boolean = false;
  public isKebabPurchased: boolean = false;
  private isWalkingSoundPlaying: boolean = false;
  private playerWeaponsManager: PlayerWeaponsManager;

  constructor(
    animationManager: AnimationManager,
    app: PIXI.Application,
    inputManager: InputManager,
    audioManager: AudioManager,
    playerInterface: PlayerInterface,
    deathScreen: DeathScreen,
    stopEnemiesCallback: () => void,
    layer: PIXI.Container<PIXI.DisplayObject>
  ) {
    this.animationManager = animationManager;
    this.inputManager = inputManager;
    this.audioManager = audioManager;
    this.app = app;
    this.layer = layer;
    this.health = 100;
    this.playerInterface = playerInterface;
    this.stopEnemiesCallback = stopEnemiesCallback;
    this.playerSprite = this.createPlayerSprite();
    this.playerStandingTextures =
      this.animationManager.getPlayerStandingAnimation();
    this.playerMovingTextures =
      this.animationManager.getPlayerMovingAnimation();
    this.playerDamagedTextures =
      this.animationManager.getPlayerDamagedAnimation();
    this.deathScreen = deathScreen;
    this.playerWeaponsManager = new PlayerWeaponsManager(
      app,
      layer,
      this.playerSprite
    );
  }

  private createPlayerSprite(): PIXI.AnimatedSprite {
    const playerTextures = this.animationManager.getPlayerStandingAnimation();
    const animation = new PIXI.AnimatedSprite(playerTextures);
    animation.x = window.innerWidth / 2 - 100;
    animation.y = window.innerHeight / 2 - 100;
    animation.anchor.set(0.5);
    animation.animationSpeed = 0.1;
    animation.play();

    this.layer.addChild(animation);

    return animation;
  }

  public handlePlayerMovement(mousePosition: { x: number; y: number }): void {
    const playerPosition = this.playerSprite.position;
    const dx = mousePosition.x - playerPosition.x;
    const dy = mousePosition.y - playerPosition.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 30) {
      this.isMoving = true;

      if (!this.isWalkingSoundPlaying) {
        this.playMovingSound();
        this.isWalkingSoundPlaying = true;
      }

      const directionX = dx / distance;
      const directionY = dy / distance;

      playerPosition.x += directionX * 5;
      playerPosition.y += directionY * 5;

      this.playerSprite.rotation = Math.atan2(dy, dx);
    }

    if (distance < 30) {
      this.handlePlayerHalt();
    }
  }

  private handlePlayerHalt(): void {
    this.isMoving = false;
    this.isWalkingSoundPlaying = false;
    this.audioManager.stopSound('walkingSound');
  }

  public handlePlayerKeyboardInput(): void {
    const mousePosition = this.inputManager.getMousePosition();
    if (this.inputManager.isKeyPressed('KeyC')) {
      this.playerWeaponsManager.throwKnife(mousePosition);
    }

    if (this.inputManager.isKeyPressed('KeyV')) {
      if (this.isEyePurchased) {
        this.playerWeaponsManager.throwEye(mousePosition);
      }
    }

    if (this.inputManager.isKeyPressed('KeyX')) {
      if (this.isKebabPurchased) {
        this.playerWeaponsManager.throwKebab(mousePosition);
        this.health += 5;
        this.playerInterface.updateHealthText(this.health);
      }
    }
  }

  private adjustPlayerRotation(): void {
    const mouseX = this.inputManager.getMousePosition().x;
    const playerX = this.playerSprite.x;

    const dx = mouseX - playerX;

    const direction = dx > 0 ? 1 : -1;

    if (direction === -1) {
      this.playerSprite.scale.x = -1;
    } else {
      this.playerSprite.scale.x = 1;
    }

    const dy = this.inputManager.getMousePosition().y - this.playerSprite.y;
    const rotation = Math.atan2(dy, dx);

    if (direction === -1) {
      this.playerSprite.rotation = rotation + Math.PI;
    } else {
      this.playerSprite.rotation = rotation;
    }
  }

  public updatePlayerAnimation(): void {
    if (this.isDamaged) {
      if (
        !this.playerSprite.playing ||
        this.playerSprite.textures !== this.playerDamagedTextures
      ) {
        this.playerSprite.textures = this.playerDamagedTextures;
        this.playerSprite.loop = false;
        this.playerSprite.onComplete = () => {
          this.isDamaged = false;
          this.playerSprite.textures = this.playerStandingTextures;
          this.playerSprite.loop = true;
        };
        this.playerSprite.play();
      }
    } else {
      if (this.isMoving) {
        if (
          !this.playerSprite.playing ||
          this.playerSprite.textures !== this.playerMovingTextures
        ) {
          this.playerSprite.textures = this.playerMovingTextures;
          this.playerSprite.play();
        }
      } else {
        if (
          !this.playerSprite.playing ||
          this.playerSprite.textures !== this.playerStandingTextures
        ) {
          this.playerSprite.textures = this.playerStandingTextures;
          this.playerSprite.play();
        }
      }
    }
  }

  private handleBorderWrap(): void {
    const screenWidth = this.app.screen.width;
    const screenHeight = this.app.screen.height * 0.8;

    // Check and handle border wrap-around horizontally
    if (this.playerSprite.x < 0) {
      this.playerSprite.x = screenWidth;
    } else if (this.playerSprite.x > screenWidth) {
      this.playerSprite.x = 0;
    }

    // Check and handle border wrap-around vertically
    if (this.playerSprite.y < 0) {
      this.playerSprite.y = screenHeight;
    } else if (this.playerSprite.y > screenHeight) {
      this.playerSprite.y = 0;
    }
  }

  private playMovingSound() {
    this.audioManager.playSound('walkingSound', true);
    this.audioManager.setVolume('walkingSound', 0.5);
  }

  private playHitSound(): void {
    this.audioManager.playSound('playerHit');
  }

  private playDeathSound(): void {
    this.audioManager.playSound('playerDead');
  }

  public checkProjectileCollision(projectiles: Projectile[]): void {
    for (const projectile of projectiles) {
      if (
        this.playerSprite
          .getBounds()
          .contains(projectile.getSprite().x, projectile.getSprite().y)
      ) {
        this.receiveDamage(projectile.damage);
        projectile.destroy();
      }
    }
  }

  private receiveDamage(damage: number): void {
    this.health -= damage;
    this.isDamaged = true;

    this.playHitSound();

    this.playerInterface.updateHealthText(this.health);

    if (this.health <= 0) {
      this.handlePlayerDefeat();
    }
  }

  private handlePlayerDefeat(): void {
    this.playDeathAnimation();

    this.inputManager.disableInput();
    this.playDeathSound();
    this.stopEnemiesCallback();

    setTimeout(() => {
      this.deathScreen.showDeathScreen();
    }, 900);
  }

  private playDeathAnimation(): void {
    const deathTextures = this.animationManager.getPlayerDyingAnimation();
    const deathAnimation = new PIXI.AnimatedSprite(deathTextures);
    this.layer.removeChild(this.playerSprite);
    deathAnimation.x = this.playerSprite.x;
    deathAnimation.y = this.playerSprite.y;
    deathAnimation.anchor.set(0.5);
    deathAnimation.animationSpeed = 0.1;
    deathAnimation.loop = false;
    deathAnimation.play();

    this.layer.addChild(deathAnimation);
  }

  public resetPlayer(): void {
    this.layer.removeChild(this.playerSprite);

    this.playerSprite = this.createPlayerSprite();
    this.playerSprite.animationSpeed = 0.1;
    this.playerSprite.play();

    this.playerSprite.x = window.innerWidth / 2 - 100;
    this.playerSprite.y = window.innerHeight / 2 - 100;
    this.health = 100;
    this.isDamaged = false;
    this.playerInterface.updateHealthText(this.health);

    this.inputManager.enableInput();
  }

  public getKnives(): Knife[] {
    return this.playerWeaponsManager.knives;
  }

  public getEyes(): CursedEye[] {
    return this.playerWeaponsManager.cursedEyes;
  }

  public getKebabs(): CursedEye[] {
    return this.playerWeaponsManager.kebabs;
  }

  public getSprite() {
    return this.playerSprite;
  }

  private checkCoinCollision(coins: Coin[]): void {
    const playerBounds = this.playerSprite.getBounds();
    for (const coin of coins) {
      const coinBounds = coin.getSprite().getBounds();

      if (playerBounds.intersects(coinBounds)) {
        if (!coin.getIsCollected()) {
          const value = coin.getValue();
          coin.collect();
          this.playerInterface.updateCoinCount(value);
        }
      }
    }
  }

  public getBounds() {
    return this.playerSprite.getBounds();
  }

  update(coins: Coin[]) {
    if (this.inputManager.isMousePressed()) {
      const mousePosition = this.inputManager.getMousePosition();
      this.handlePlayerMovement(mousePosition);
    } else {
      this.handlePlayerHalt();
    }

    this.handlePlayerKeyboardInput();
    this.handleBorderWrap();
    this.adjustPlayerRotation();
    this.updatePlayerAnimation();
    this.checkCoinCollision(coins);
    this.playerWeaponsManager.update();
  }
}
