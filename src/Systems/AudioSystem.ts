import { System } from 'tick-knock';
import { PlayerMovementSystem } from '../Player/Systems/PlayerMovementSystem';

export class AudioSystem extends System {
  private walkingSound: HTMLAudioElement;
  private playerMovementSystem: PlayerMovementSystem;

  constructor(playerMovementSystem: PlayerMovementSystem) {
    super();
    this.playerMovementSystem = playerMovementSystem;
    this.walkingSound = new Audio('/sounds/footsteps.mp3');
  }

  update() {
    if (this.playerMovementSystem.isPlayerMoving) {
      if (this.walkingSound.paused) {
        this.walkingSound.play();
        this.walkingSound.volume = 0.3;
      }
    } else {
      this.walkingSound.pause();
      this.walkingSound.currentTime = 0;
    }
  }
}
