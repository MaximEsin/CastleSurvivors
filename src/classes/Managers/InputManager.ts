export class InputManager {
  private mousePosition: { x: number; y: number } = { x: 0, y: 0 };
  private mousePressed: boolean = false;

  constructor() {
    window.addEventListener('mousemove', this.handleMouseMove.bind(this));
    window.addEventListener('mousedown', this.handleMouseDown.bind(this));
    window.addEventListener('mouseup', this.handleMouseUp.bind(this));
  }

  private handleMouseMove(event: MouseEvent): void {
    this.mousePosition.x = event.clientX;
    this.mousePosition.y = event.clientY;
  }

  public getMousePosition(): { x: number; y: number } {
    return this.mousePosition;
  }

  private handleMouseDown(): void {
    this.mousePressed = true;
  }

  private handleMouseUp(): void {
    this.mousePressed = false;
  }

  public isMousePressed(): boolean {
    return this.mousePressed;
  }
}
