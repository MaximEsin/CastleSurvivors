export class InputManager {
  private keys: { [key: string]: boolean } = {};

  constructor() {
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  private handleKeyDown(event: KeyboardEvent): void {
    this.keys[event.key] = true;
  }

  private handleKeyUp(event: KeyboardEvent): void {
    this.keys[event.key] = false;
  }

  public isKeyPressed(key: string): boolean {
    return this.keys[key];
  }
}
