import { Maze } from "./Maze";
import { Stack } from "./Stack";
import { Cell } from "./Cell";

export class DFSSolver extends Maze {
  private readonly cellStack: Stack<Cell>;
  private readonly visitedCells: Set<string>;
  private readonly solutionPath: Cell[];
  private solved: boolean;

  constructor(maze: Maze) {
    // Call parent constructor with maze dimensions
    super(maze.width, maze.height);

    // Copy the maze's grid and cell references
    this.grid.length = 0; // Clear the initialized grid
    for (let y = 0; y < maze.height; y++) {
      this.grid[y] = [];
      for (let x = 0; x < maze.width; x++) {
        const originalCell = maze.getCell(x, y);
        if (originalCell) {
          this.grid[y][x] = originalCell;
        }
      }
    }

    this.startCell = maze.getFirstCell();
    this.endCell = maze.getEndCell();

    this.cellStack = new Stack<Cell>();
    this.visitedCells = new Set<string>();
    this.solutionPath = [];
    this.solved = false;
  }

  public solve(): boolean {
    // Reset solver state
    this.resetSolver();

    const startCell = this.getFirstCell();
    const endCell = this.getEndCell();

    if (!startCell || !endCell) {
      console.log("Start or end cell not found!");
      return false;
    }

    // Start DFS from the start cell
    this.cellStack.push(startCell);
    this.markVisited(startCell);

    while (!this.cellStack.isEmpty()) {
      const currentCell = this.cellStack.peek();

      // Check if we've reached the end
      if (this.isSameCell(currentCell, endCell)) {
        this.solved = true;
        this.buildSolutionPath();
        return true;
      }

      // Get accessible unvisited neighbors using inherited method
      const unvisitedNeighbors = this.getNeighbours(
        currentCell,
        (neighbor) => !this.isVisitedBySolver(neighbor),
        true // Respect walls for pathfinding
      );

      if (unvisitedNeighbors.length > 0) {
        // Choose the first unvisited neighbor
        const nextCell = unvisitedNeighbors[0];
        this.cellStack.push(nextCell);
        this.markVisited(nextCell);
      } else {
        // No accessible unvisited neighbors, backtrack
        this.cellStack.pop();
      }
    }

    // No solution found
    return false;
  }

  private markVisited(cell: Cell): void {
    const key = this.getCellKey(cell); // Using inherited method
    this.visitedCells.add(key);
  }

  private isVisitedBySolver(cell: Cell): boolean {
    const key = this.getCellKey(cell); // Using inherited method
    return this.visitedCells.has(key);
  }

  private buildSolutionPath(): void {
    // Convert stack to array to get the solution path
    this.solutionPath.length = 0; // Clear existing path
    const tempStack = new Stack<Cell>();

    // Copy stack contents to temp stack (reversing order)
    while (!this.cellStack.isEmpty()) {
      tempStack.push(this.cellStack.pop());
    }

    // Build solution path
    while (!tempStack.isEmpty()) {
      this.solutionPath.push(tempStack.pop());
    }
  }

  private resetSolver(): void {
    this.visitedCells.clear();
    this.solutionPath.length = 0;
    this.solved = false;
    // Clear the stack
    while (!this.cellStack.isEmpty()) {
      this.cellStack.pop();
    }
  }

  public getSolutionPath(): Cell[] {
    return [...this.solutionPath]; // Return a copy
  }

  public isSolved(): boolean {
    return this.solved;
  }

  public printMazeWithSolution(): void {
    if (!this.solved) {
      console.log("Maze not solved yet! Call solve() first.");
      return;
    }

    // Create a set of solution path cells for quick lookup
    const solutionCells = new Set<string>();
    for (const cell of this.solutionPath) {
      const key = this.getCellKey(cell);
      solutionCells.add(key);
    }

    let mazeString = "";

    // Print the top border
    for (let x = 0; x < this.width; x++) {
      const cell = this.getCell(x, 0);
      if (cell && cell.topWall) {
        mazeString += "+---";
      } else {
        mazeString += "+   ";
      }
    }
    mazeString += "+\n";

    // Print each row
    for (let y = 0; y < this.height; y++) {
      let rowString = "";
      for (let x = 0; x < this.width; x++) {
        const cell = this.getCell(x, y);
        if (!cell) continue;

        // Left wall
        if (cell.leftWall) {
          rowString += "|";
        } else {
          rowString += " ";
        }

        // Cell content
        if (cell.isFirstCell) {
          rowString += " S ";
        } else if (cell.isLastCell) {
          rowString += " E ";
        } else {
          // Check if this cell is part of the solution path
          const cellKey = this.getCellKey(cell);
          if (solutionCells.has(cellKey)) {
            rowString += " * "; // Solution path marker
          } else {
            rowString += "   ";
          }
        }
      }

      // Right border
      const rightMostCell = this.getCell(this.width - 1, y);
      if (rightMostCell && rightMostCell.rightWall) {
        rowString += "|";
      } else {
        rowString += " ";
      }
      mazeString += rowString + "\n";

      // Print horizontal walls
      let wallString = "";
      for (let x = 0; x < this.width; x++) {
        const cell = this.getCell(x, y);
        if (!cell) continue;

        wallString += "+";
        if (cell.bottomWall) {
          wallString += "---";
        } else {
          wallString += "   ";
        }
      }
      mazeString += wallString + "+\n";
    }

    console.log(mazeString);
    console.log(
      `Solution path marked with '*' - Total steps: ${this.solutionPath.length}`
    );
  }

  public printSolutionLength(): void {
    if (this.solved) {
      console.log(
        `Solution found! Path length: ${this.solutionPath.length} cells`
      );
    } else {
      console.log("No solution found!");
    }
  }
}
