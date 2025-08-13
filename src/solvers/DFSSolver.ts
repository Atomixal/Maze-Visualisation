import Maze from "../core/Maze.js";
import Cell from "../models/Cell.js";
import Stack from "../utils/Stack.js";

export default class DFSSolver extends Maze {
  private cellStack: Stack<Cell>;
  visitedCells: Set<string>;
  private solutionPath: Cell[];
  private solved: boolean;
  private isAnimating: boolean;
  private parentMap: Map<string, Cell>; // Track parent-child relationships

  constructor(maze: Maze) {
    super(maze.width, maze.height);
    // Copy references to original cells so renderer can use the same instances
    this.grid.length = 0;
    for (let y = 0; y < maze.height; y++) {
      this.grid[y] = [];
      for (let x = 0; x < maze.width; x++) {
        const originalCell = maze.getCell(x, y);
        this.grid[y][x] = originalCell ?? null;
      }
    }
    this.startCell = maze.getFirstCell();
    this.endCell = maze.getEndCell();
    this.cellStack = new Stack<Cell>();
    this.visitedCells = new Set<string>();
    this.solutionPath = [];
    this.solved = false;
    this.isAnimating = false;
    this.parentMap = new Map<string, Cell>();
  }

  async solveAnimated(
    onStep?: (
      currentCell: Cell,
      visited: Set<string>,
      isBacktracking?: boolean
    ) => void,
    delay = 50
  ): Promise<boolean> {
    this.resetSolver();
    this.isAnimating = true;
    const startCell = this.getFirstCell();
    const endCell = this.getEndCell();
    
    if (!startCell || !endCell) {
      this.isAnimating = false;
      return false;
    }

    this.cellStack.push(startCell);
    this.markVisited(startCell);
    if (onStep) onStep(startCell, new Set(this.visitedCells), false);
    await this.sleep(delay);

    while (!this.cellStack.isEmpty() && this.isAnimating) {
      const currentCell = this.cellStack.peek()!;
      
      if (this.isSameCell(currentCell, endCell)) {
        this.solved = true;
        this.buildTrueSolutionPath();
        this.isAnimating = false;
        return true;
      }

      const unvisitedNeighbors = this.getNeighbours(
        currentCell,
        (neighbor) => !this.isVisitedBySolver(neighbor),
        true
      );

      if (unvisitedNeighbors.length > 0) {
        const nextCell = unvisitedNeighbors[0];
        this.cellStack.push(nextCell);
        this.markVisited(nextCell);
        
        // Record parent-child relationship
        const nextKey = this.getCellKey(nextCell);
        this.parentMap.set(nextKey, currentCell);
        
        if (onStep) onStep(nextCell, new Set(this.visitedCells), false);
      } else {
        this.cellStack.pop();
        const backtrackCell = this.cellStack.peek();
        if (onStep && backtrackCell)
          onStep(backtrackCell, new Set(this.visitedCells), true);
      }
      await this.sleep(delay);
    }

    this.isAnimating = false;
    return false;
  }

  stopAnimation(): void {
    this.isAnimating = false;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private markVisited(cell: Cell): void {
    const key = this.getCellKey(cell);
    this.visitedCells.add(key);
  }

  isVisitedBySolver(cell: Cell): boolean {
    const key = this.getCellKey(cell);
    return this.visitedCells.has(key);
  }

  private buildTrueSolutionPath(): void {
    this.solutionPath.length = 0;
    const endCell = this.getEndCell();
    
    if (!endCell) return;

    // Build path by following parent relationships backwards from end to start
    const path: Cell[] = [];
    let currentCell: Cell | undefined = endCell;
    
    while (currentCell) {
      path.unshift(currentCell); // Add to front of array
      const currentKey = this.getCellKey(currentCell);
      currentCell = this.parentMap.get(currentKey);
    }
    
    this.solutionPath = path;
  }

  resetSolver(): void {
    this.visitedCells.clear();
    this.solutionPath.length = 0;
    this.solved = false;
    this.cellStack = new Stack<Cell>();
    this.parentMap.clear(); // Clear parent relationships
  }

  getSolutionPath(): Cell[] {
    return [...this.solutionPath];
  }

  isSolved(): boolean {
    return this.solved;
  }

  isAnimationRunning(): boolean {
    return this.isAnimating;
  }

  // Additional method to get all visited cells (for debugging or visualization)
  getAllVisitedCells(): Cell[] {
    const visited: Cell[] = [];
    this.visitedCells.forEach(key => {
      const [x, y] = key.split(',').map(Number);
      const cell = this.getCell(x, y);
      if (cell) visited.push(cell);
    });
    return visited;
  }

  // Method to get statistics about the solving process
  getSolvingStats(): { visitedCount: number, solutionLength: number, efficiency: number } {
    const visitedCount = this.visitedCells.size;
    const solutionLength = this.solutionPath.length;
    const efficiency = solutionLength > 0 ? (solutionLength / visitedCount) * 100 : 0;
    
    return {
      visitedCount,
      solutionLength,
      efficiency: Math.round(efficiency * 100) / 100 // Round to 2 decimal places
    };
  }
}