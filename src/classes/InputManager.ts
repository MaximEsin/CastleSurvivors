export class InputManager {
  private keys: { [key: string]: boolean } = {};
  private disabled: boolean = false;

  constructor() {
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (!this.disabled) {
      this.keys[event.key] = true;
    }
  }

  private handleKeyUp(event: KeyboardEvent): void {
    if (!this.disabled) {
      this.keys[event.key] = false;
    }
  }

  public isKeyPressed(key: string): boolean {
    return this.keys[key];
  }

  public disableInput(): void {
    this.disabled = true;
  }

  public enableInput(): void {
    this.disabled = false;
  }
}
