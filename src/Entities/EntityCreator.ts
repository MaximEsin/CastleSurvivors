import { Player } from './Player';

export class EntityCreator {
  private player: Player;

  constructor() {
    this.player = new Player();
  }

  public getPlayer() {
    return this.player;
  }
}
