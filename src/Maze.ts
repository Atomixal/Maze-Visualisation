import { Cell } from "./Cell";

export class Maze {
  readonly width: number;
  readonly height: number;
  private readonly grid: Cell[][];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.grid = [];

    this.initialiseMaze(width, height);
  }

  private initialiseMaze(width: number, height: number): void {
    for (let y = 0; y < height; y++) {
      const row: Cell[] = [];
      for (let x = 0; x < width; x++) {
        row.push(new Cell(x, y, false, false, false));
      }
      this.grid.push(row);
    }

    // TODO: Have the first and last cells dynamically populated according to the user.
    this.grid[0][0].isFirstCell = true;
    this.grid[height - 1][width - 1].isLastCell = true;
  }

  private getUnvisitedNeighbours(cell: Cell): Cell[] {
    const neighbours: Cell[] = [];
    const { x, y } = cell;

    const directions = [
      { dx: 0, dy: -1 },
      { dx: 1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: -1, dy: 0 },
    ];

    for (const { dx, dy } of directions) {
      const neighbor = this.getCell(x + dx, y + dy);
      if (neighbor && !neighbor.isVisited) {
        neighbours.push(neighbor);
      }
    }

    return neighbours;
  }

  private removeWall(current: Cell, neighbor: Cell): void {
    const dx = current.x - neighbor.x;
    const dy = current.y - neighbor.y;

    // Remove walls based on relative position
    if (dx === 1) {
      // Neighbor to the left
      current.leftWall = false;
      neighbor.rightWall = false;
    } else if (dx === -1) {
      // Neighbor to the right
      current.rightWall = false;
      neighbor.leftWall = false;
    } else if (dy === 1) {
      // Neighbor above
      current.topWall = false;
      neighbor.bottomWall = false;
    } else if (dy === -1) {
      // Neighbor below
      current.bottomWall = false;
      neighbor.topWall = false;
    }
  }

  // TODO: Write later
  // Generate Maze using DFS
  public generateMaze(startX: number = 0, startY: number = 0): void {}

  // TODO: Write later
  // Reset Maze for next generation
  public reset(): void {}

  // TODO: Write later
  // Outputs the maze to Console in ASCII
  public printMaze(): void {}

  public getCell(x: number, y: number): Cell | null {
    // Catch any out of bounds Exceptions.
    if (y < 0 || y >= this.grid.length || x < 0 || x >= this.grid[y].length) {
      console.log(
        `The coordinates (${x},${y}) are out of bounds!\nThe maze is ${this.width}, ${this.height}.`
      );
      return null;
    }

    return this.grid[y][x];
  }
}
