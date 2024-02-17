export class Timer {
  private totalTime: number;
  private currentTime: number;
  private frameRate: number = 66;

  constructor(totalTime: number) {
    this.totalTime = totalTime;
    this.currentTime = totalTime;
  }

  public update(dt: number): void {
    this.currentTime -= dt / this.frameRate;
    if (this.currentTime < 0) {
      this.currentTime = 0;
    }
  }

  public getTime() {
    return this.currentTime;
  }

  public resetTimer() {
    this.currentTime = this.totalTime;
  }

  public getTimeString(): string {
    const minutes = Math.floor(this.currentTime / 60);
    const seconds = Math.floor(this.currentTime % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
}
