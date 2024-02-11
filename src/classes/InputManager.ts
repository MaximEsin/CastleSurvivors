export class InputManager {
  private keys: { [key: string]: boolean } = {};
  private mousePosition: { x: number; y: number } = { x: 0, y: 0 };
  private disabled: boolean = false;

  constructor() {
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
    window.addEventListener('mousemove', this.handleMouseMove.bind(this));
  }

  private handleMouseMove(event: MouseEvent): void {
    this.mousePosition.x = event.clientX;
    this.mousePosition.y = event.clientY;
  }

  public getMousePosition(): { x: number; y: number } {
    return this.mousePosition;
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (!this.disabled) {
      this.keys[event.code] = true;
    }
  }

  private handleKeyUp(event: KeyboardEvent): void {
    if (!this.disabled) {
      this.keys[event.code] = false;
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
