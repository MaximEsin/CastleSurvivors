export class InputManager {
  private pointerPosition: { x: number; y: number } = { x: 0, y: 0 };
  private pointerPressed: boolean = false;

  constructor() {
    window.addEventListener('mousemove', this.handlePointerMove.bind(this));
    window.addEventListener('mousedown', this.handlePointerDown.bind(this));
    window.addEventListener('mouseup', this.handlePointerUp.bind(this));

    window.addEventListener('touchmove', this.handleTouchMove.bind(this));
    window.addEventListener('touchstart', this.handleTouchStart.bind(this));
    window.addEventListener('touchend', this.handleTouchEnd.bind(this));
  }

  private handlePointerMove(event: MouseEvent): void {
    this.setPointerPosition(event.clientX, event.clientY);
  }

  private handlePointerDown(): void {
    this.setPointerPressed(true);
  }

  private handlePointerUp(): void {
    this.setPointerPressed(false);
  }

  private handleTouchMove(event: TouchEvent): void {
    const touch = event.touches[0];
    if (touch) {
      this.setPointerPosition(touch.clientX, touch.clientY);
    }
  }

  private handleTouchStart(): void {
    this.setPointerPressed(true);
  }

  private handleTouchEnd(): void {
    this.setPointerPressed(false);
  }

  private setPointerPosition(x: number, y: number): void {
    this.pointerPosition.x = x;
    this.pointerPosition.y = y;
  }

  private setPointerPressed(pressed: boolean): void {
    this.pointerPressed = pressed;
  }

  public getPointerPosition(): { x: number; y: number } {
    return this.pointerPosition;
  }

  public isPointerPressed(): boolean {
    return this.pointerPressed;
  }
}
