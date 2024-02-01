import * as PIXI from 'pixi.js';
import { AnimationManager } from './AnimationManager';
import { InputManager } from './InputManager';
import { AudioManager } from './AudioManager';
import { Projectile } from './Projectile';
import { PlayerInterface } from './UI/PlayerInterface';
import { DeathScreen } from './UI/DeathScreen';
import { Knife } from './Weapons/Knife';
import { Coin } from './Coin';

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
  private isDamaged: boolean = false;
  private stopGameCallback: () => void;
  private knives: Knife[] = [];
  private lastKnifeThrowTime: number = 0;
  private knifeCooldown: number = 2000;

  constructor(
    animationManager: AnimationManager,
    app: PIXI.Application,
    inputManager: InputManager,
    audioManager: AudioManager,
    playerInterface: PlayerInterface,
    deathScreen: DeathScreen,
    stopGameCallback: () => void
  ) {
    this.animationManager = animationManager;
    this.inputManager = inputManager;
    this.audioManager = audioManager;
    this.app = app;
    this.health = 10;
    this.playerInterface = playerInterface;
    this.stopGameCallback = stopGameCallback;
    this.playerSprite = this.createPlayerSprite();
    this.playerStandingTextures =
      this.animationManager.getPlayerStandingAnimation();
    this.playerMovingTextures =
      this.animationManager.getPlayerMovingAnimation();
    this.playerDamagedTextures =
      this.animationManager.getPlayerDamagedAnimation();
    this.deathScreen = deathScreen;
  }

  private createPlayerSprite(): PIXI.AnimatedSprite {
    const playerTextures = this.animationManager.getPlayerStandingAnimation();
    const animation = new PIXI.AnimatedSprite(playerTextures);
    animation.x = window.innerWidth / 2 - 100;
    animation.y = window.innerHeight / 2 - 100;
    animation.animationSpeed = 0.1;
    animation.play();

    this.app.stage.addChild(animation);

    return animation;
  }

  public moveUp(): void {
    this.playerSprite.y -= 5;
    this.playMovingSound();
  }

  public moveDown(): void {
    this.playerSprite.y += 5;
    this.playMovingSound();
  }

  public moveLeft(): void {
    this.playerSprite.x -= 5;
    this.playerSprite.scale.x = -1;
    this.playMovingSound();
  }

  public moveRight(): void {
    this.playerSprite.x += 5;
    this.playerSprite.scale.x = 1;
    this.playMovingSound();
  }

  public handlePlayerInput(): void {
    if (this.inputManager.isKeyPressed('w')) {
      this.moveUp();
    } else if (this.inputManager.isKeyPressed('s')) {
      this.moveDown();
    }

    if (this.inputManager.isKeyPressed('a')) {
      this.moveLeft();
    } else if (this.inputManager.isKeyPressed('d')) {
      this.moveRight();
    }

    if (this.inputManager.isKeyPressed('c')) {
      this.throwKnife();
    }

    this.handleBorderWrap();
  }

  public updatePlayerAnimation(): void {
    if (this.isDamaged) {
      // Play damaged animation once
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
      if (
        this.inputManager.isKeyPressed('w') ||
        this.inputManager.isKeyPressed('a') ||
        this.inputManager.isKeyPressed('s') ||
        this.inputManager.isKeyPressed('d')
      ) {
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
    this.audioManager.playSound('walkingSound');
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
    this.stopGameCallback();

    setTimeout(() => {
      this.deathScreen.showDeathScreen();
    }, 900);
  }

  private playDeathAnimation(): void {
    const deathTextures = this.animationManager.getPlayerDyingAnimation();
    const deathAnimation = new PIXI.AnimatedSprite(deathTextures);
    this.app.stage.removeChild(this.playerSprite);
    deathAnimation.x = this.playerSprite.x;
    deathAnimation.y = this.playerSprite.y;
    deathAnimation.anchor.set(0.5);
    deathAnimation.animationSpeed = 0.1;
    deathAnimation.loop = false;
    deathAnimation.play();

    this.app.stage.addChild(deathAnimation);
  }

  public resetPlayer(): void {
    this.app.stage.removeChild(this.playerSprite);

    this.playerSprite = this.createPlayerSprite();
    this.playerSprite.animationSpeed = 0.1;
    this.playerSprite.play();

    this.playerSprite.x = window.innerWidth / 2 - 100;
    this.playerSprite.y = window.innerHeight / 2 - 100;
    this.health = 10;
    this.isDamaged = false;
    this.playerInterface.updateHealthText(this.health);

    this.inputManager.enableInput();
  }

  private throwKnife(): void {
    const currentTime = Date.now();

    if (currentTime - this.lastKnifeThrowTime >= this.knifeCooldown) {
      const direction = new PIXI.Point(
        this.playerSprite.scale.x > 0 ? 1 : -1,
        0
      );

      const length = Math.sqrt(direction.x ** 2 + direction.y ** 2);
      direction.x /= length;
      direction.y /= length;

      const knife = new Knife(
        this.app,
        this.playerSprite.x,
        this.playerSprite.y,
        direction,
        5
      );

      this.knives.push(knife);

      this.app.stage.addChildAt(knife.getSprite(), 1);

      this.lastKnifeThrowTime = currentTime;
    }
  }

  public getKnives(): Knife[] {
    return this.knives;
  }

  public checkCoinCollision(coins: Coin[]): void {
    const playerBounds = this.playerSprite.getBounds();

    for (const coin of coins) {
      const coinBounds = coin.getSprite().getBounds();

      if (playerBounds.intersects(coinBounds)) {
        if (!coin.getIsCollected()) {
          coin.collect();
          this.playerInterface.updateCoinCount();
        }
      }
    }
  }
}
