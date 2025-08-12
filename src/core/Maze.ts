import Cell from "../models/Cell.js";
import Stack from "../utils/Stack.js";

export default class Maze {
  width: number;
  height: number;
  grid: (Cell | null)[][] = [];
  startCell: Cell | null = null;
  endCell: Cell | null = null;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.initialiseMaze(width, height);
    this.startCell = this.grid[0][0];
    this.endCell = this.grid[height - 1][width - 1];
    if (this.startCell) this.startCell.isFirstCell = true;
    if (this.endCell) this.endCell.isLastCell = true;
  }

  initialiseMaze(width: number, height: number): void {
    this.grid.length = 0;
    for (let y = 0; y < height; y++) {
      const row: (Cell | null)[] = [];
      for (let x = 0; x < width; x++) {
        row.push(new Cell(x, y, false, false, false));
      }
      this.grid.push(row);
    }
    if (this.grid[0] && this.grid[0][0]) this.grid[0][0]!.isFirstCell = true;
  }

  getNeighbours(
    cell: Cell,
    filterFn: (n: Cell) => boolean,
    respectWalls = false
  ): Cell[] {
    const neighbors: Cell[] = [];
    const { x, y } = cell;

    const directions = [
      { dx: 0, dy: -1, wallCheck: () => !cell.topWall },
      { dx: 1, dy: 0, wallCheck: () => !cell.rightWall },
      { dx: 0, dy: 1, wallCheck: () => !cell.bottomWall },
      { dx: -1, dy: 0, wallCheck: () => !cell.leftWall },
    ];

    for (const { dx, dy, wallCheck } of directions) {
      if (respectWalls && !wallCheck()) continue;
      const neighbor = this.getCell(x + dx, y + dy);
      if (neighbor && filterFn(neighbor)) neighbors.push(neighbor);
    }

    return neighbors;
  }

  getUnvisitedNeighbours(cell: Cell): Cell[] {
    return this.getNeighbours(cell, (n) => !n.isVisited, false);
  }

  removeWall(current: Cell, neighbor: Cell): void {
    const dx = current.x - neighbor.x;
    const dy = current.y - neighbor.y;

    if (dx === 1) {
      current.leftWall = false;
      neighbor.rightWall = false;
    } else if (dx === -1) {
      current.rightWall = false;
      neighbor.leftWall = false;
    } else if (dy === 1) {
      current.topWall = false;
      neighbor.bottomWall = false;
    } else if (dy === -1) {
      current.bottomWall = false;
      neighbor.topWall = false;
    }
  }

  generateMaze(): void {
    const cellStack = new Stack<Cell>();
    const startCell = this.getFirstCell();
    if (!startCell) return;

    startCell.isVisited = true;
    cellStack.push(startCell);

    while (!cellStack.isEmpty()) {
      const currentCell = cellStack.peek()!;
      const unvisitedNeighbors = this.getUnvisitedNeighbours(currentCell);

      if (unvisitedNeighbors.length > 0) {
        const randomIndex = Math.floor(
          Math.random() * unvisitedNeighbors.length
        );
        const chosenNeighbor = unvisitedNeighbors[randomIndex];

        chosenNeighbor.isVisited = true;
        this.removeWall(currentCell, chosenNeighbor);
        cellStack.push(chosenNeighbor);
      } else {
        cellStack.pop();
      }
    }
  }

  getCell(x: number, y: number): Cell | null {
    if (y < 0 || y >= this.grid.length) return null;
    if (x < 0 || x >= this.grid[y].length) return null;
    return this.grid[y][x];
  }

  getFirstCell(): Cell | null {
    return this.startCell;
  }

  getEndCell(): Cell | null {
    return this.endCell;
  }

  isSameCell(cell1: Cell, cell2: Cell): boolean {
    return cell1.x === cell2.x && cell1.y === cell2.y;
  }

  getCellKey(cell: Cell): string {
    return `${cell.x},${cell.y}`;
  }
}
