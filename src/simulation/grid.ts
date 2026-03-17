export class Grid {
  width: number;
  height: number;
  current: Uint8Array;
  next: Uint8Array;
  metadata: Uint8Array; // Aux data: deepfake disguise timers, etc.

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.current = new Uint8Array(width * height);
    this.next = new Uint8Array(width * height);
    this.metadata = new Uint8Array(width * height);
  }

  get(x: number, y: number): number {
    return this.current[y * this.width + x];
  }

  set(x: number, y: number, type: number): void {
    this.current[y * this.width + x] = type;
  }

  setNext(x: number, y: number, type: number): void {
    this.next[y * this.width + x] = type;
  }

  getMetadata(x: number, y: number): number {
    return this.metadata[y * this.width + x];
  }

  setMetadata(x: number, y: number, value: number): void {
    this.metadata[y * this.width + x] = value;
  }

  swap(): void {
    const tmp = this.current;
    this.current = this.next;
    this.next = tmp;
  }

  clear(): void {
    this.current.fill(0);
    this.next.fill(0);
    this.metadata.fill(0);
  }

  getNeighbors(x: number, y: number, wrap: boolean): number[] {
    const neighbors: number[] = [];
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        let nx = x + dx;
        let ny = y + dy;
        if (wrap) {
          nx = (nx + this.width) % this.width;
          ny = (ny + this.height) % this.height;
        } else if (nx < 0 || nx >= this.width || ny < 0 || ny >= this.height) {
          continue;
        }
        neighbors.push(this.current[ny * this.width + nx]);
      }
    }
    return neighbors;
  }

  getNeighborCoords(x: number, y: number, wrap: boolean): Array<[number, number]> {
    const coords: Array<[number, number]> = [];
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        let nx = x + dx;
        let ny = y + dy;
        if (wrap) {
          nx = (nx + this.width) % this.width;
          ny = (ny + this.height) % this.height;
        } else if (nx < 0 || nx >= this.width || ny < 0 || ny >= this.height) {
          continue;
        }
        coords.push([nx, ny]);
      }
    }
    return coords;
  }

  countPopulations(): Record<number, number> {
    const counts: Record<number, number> = {};
    for (let i = 0; i < this.current.length; i++) {
      const type = this.current[i];
      if (type !== 0) {
        counts[type] = (counts[type] || 0) + 1;
      }
    }
    return counts;
  }

  clone(): Grid {
    const g = new Grid(this.width, this.height);
    g.current.set(this.current);
    g.next.set(this.next);
    g.metadata.set(this.metadata);
    return g;
  }

  randomize(density: number = 0.3, maxType: number = 8): void {
    for (let i = 0; i < this.current.length; i++) {
      this.current[i] = Math.random() < density
        ? Math.floor(Math.random() * maxType) + 1
        : 0;
    }
  }

  placePattern(pattern: number[][], startX: number, startY: number): void {
    for (let py = 0; py < pattern.length; py++) {
      for (let px = 0; px < pattern[py].length; px++) {
        const x = startX + px;
        const y = startY + py;
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
          this.current[y * this.width + x] = pattern[py][px];
        }
      }
    }
  }
}
