import { Stack } from "./Stack";
import { Cell } from "./Cell";

export class Maze {
  readonly width: number;
  readonly height: number;
  private readonly grid: Cell[][];
  private startCell: Cell;
  private endCell: Cell;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.grid = [];

    this.initialiseMaze(width, height);
    this.startCell = this.grid[0][0];
    this.endCell = this.grid[height - 1][width - 1];
    this.startCell.isFirstCell = true;
    this.endCell.isLastCell = true;
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

  // Generate Maze using DFS
  public generateMaze(): void {
    const cellStack: Stack<Cell> = new Stack<Cell>;
    const startCell = this.getFirstCell();
    startCell.isVisited = true;
    cellStack.push(startCell);

    while (!cellStack.isEmpty())
    {
      const currentCell = cellStack.peek();
      const unvisitedNeighbors = this.getUnvisitedNeighbours(currentCell);

      if (unvisitedNeighbors.length > 0) {
        // Chose next neighbor that's not been visited
        const randomIndex = Math.floor(Math.random() * unvisitedNeighbors.length);
        const chosenNeighbor = unvisitedNeighbors[randomIndex];

        chosenNeighbor.isVisited = true;
        this.removeWall(currentCell, chosenNeighbor);

        cellStack.push(chosenNeighbor);
      } else {
        // No unvisited neighbors, backtrack
        cellStack.pop();
      }
    }
  }

  // Reset Maze for next generation
  // Seperate function because easier interfacing for later
  public reset(): void {
    this.initialiseMaze(this.width, this.height);
  }

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

  public getFirstCell(): Cell {
    return this.startCell;
  }

  public getEndCell(): Cell {
    return this.endCell;
  }
}
