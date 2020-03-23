export class Rect {
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    public color: string
  ) {}

  clone(): Rect {
    return new Rect(this.x, this.y, this.width, this.height, this.color)
  }

  left(): number {
    return this.x - this.width / 2
  }

  top(): number {
    return this.y - this.height / 2
  }

  goto(x: number, y: number): void {
    this.x = x
    this.y = y
  }

  scale(width: number = 0, height: number = 0): void {
    this.width += width
    this.height += height
  }
}

export class Motion {
  frame = 0
  initX = 0
  initY = 0
  constructor(
    public frameMax: number,
    public easing: any,
    public x: number,
    public y: number
  ) {}

  init(x: number, y: number): void {
    this.initX = x
    this.initY = y
  }

  isFinished(): boolean {
    return this.frame >= this.frameMax
  }

  step() {
    if (this.isFinished()) {
      return
    }
    this.frame++
  }

  get(): { x: number; y: number } {
    return {
      x: this.initX + this.x * this.easing(this.frame / this.frameMax),
      y: this.initY + this.y * this.easing(this.frame / this.frameMax)
    }
  }
}

export class WaveRect {
  private initX: number
  private initY: number
  constructor(public rect: Rect, public motion: Motion) {
    this.initX = rect.x
    this.initY = rect.y
  }

  step() {
    this.motion.step()
    const { x, y } = this.motion.get()
    this.rect.goto(x, y)
  }

  isFinished(): boolean {
    return this.motion.isFinished()
  }
}

export class Wave {
  rects: WaveRect[] = []

  add(...wr: WaveRect[]): void {
    this.rects.push(...wr)
  }

  toArray(): Rect[] {
    return this.rects.map(wr => wr.rect)
  }

  eject(): Rect[] {
    const arr = this.toArray()
    this.rects.splice(0, this.rects.length)
    return arr
  }

  step(): WaveRect[] {
    const finished: WaveRect[] = []
    const wip: WaveRect[] = []
    this.rects.forEach(wr => {
      wr.step()
      if (wr.isFinished()) {
        finished.push(wr)
      } else {
        wip.push(wr)
      }
    })
    this.rects = wip
    return finished
  }
}

export class Result {
  rects: Rect[] = []

  add(...r: Rect[]) {
    this.rects.push(...r)
  }

  clear() {
    this.rects.splice(0, this.rects.length)
  }
}

/**
 * Text represents the text on the canvas
 */
export class Text {
  const sizeInverse: number
  const fonts = [
    "Avenir Next",
    "Arial",
    "Verdana",
    "Arial Black",
    "AmericanTypewriter-Bold",
    "Chalkboard SE",
    "Copperplate-Bold",
    "GillSans-UltraBold",
    "DIN Condensed"
  ]
  constructor(
    public text: string,
    public fontFamily: string,
    public textSize: number,
    public textColor: string,
    public textShadowColor: string
  ) {
    this.sizeInverse = 1 / textSize
  }

  sizeUp(): void {
    this.sizeInverse -= 1
    this.textSize = 1 / this.sizeInverse
  }

  sizeDown(): void {
    this.sizeInverse += 1
    this.textSize = 1 / this.sizeInverse
  }

  rotateFonts(): void {
    this.fonts.push(this.fonts.shift()!)
    this.fontFamily = this.fonts[0]
  }

  font(height: number): string {
    return `bold ${height * this.textSize}px "${this.fontFamily}"`
  }

  shadowBlur(height: number): number {
    return height * this.textSize / 20
  }
}
