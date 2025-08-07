class Cell {
  constructor(
    x,
    y,
    isVisited = false,
    isFirstCell = false,
    isLastCell = false
  ) {
    this.x = x;
    this.y = y;
    this.isVisited = isVisited;
    this.isFirstCell = isFirstCell;
    this.isLastCell = isLastCell;
    this.topWall = true;
    this.rightWall = true;
    this.bottomWall = true;
    this.leftWall = true;
  }
}

// Stack class
class Stack {
  constructor() {
    this.items = [];
  }

  push(item) {
    this.items.push(item);
  }

  pop() {
    return this.items.pop();
  }

  peek() {
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length === 0;
  }
}

// Maze class
class Maze {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.grid = [];
    this.initialiseMaze(width, height);
    this.startCell = this.grid[0][0];
    this.endCell = this.grid[height - 1][width - 1];
    this.startCell.isFirstCell = true;
    this.endCell.isLastCell = true;
  }

  initialiseMaze(width, height) {
    for (let y = 0; y < height; y++) {
      const row = [];
      for (let x = 0; x < width; x++) {
        row.push(new Cell(x, y, false, false, false));
      }
      this.grid.push(row);
    }
    this.grid[0][0].isFirstCell = true;
  }

  getNeighbours(cell, filterFn, respectWalls = false) {
    const neighbors = [];
    const { x, y } = cell;

    const directions = [
      { dx: 0, dy: -1, wallCheck: () => !cell.topWall },
      { dx: 1, dy: 0, wallCheck: () => !cell.rightWall },
      { dx: 0, dy: 1, wallCheck: () => !cell.bottomWall },
      { dx: -1, dy: 0, wallCheck: () => !cell.leftWall },
    ];

    for (const { dx, dy, wallCheck } of directions) {
      if (respectWalls && !wallCheck()) {
        continue;
      }

      const neighbor = this.getCell(x + dx, y + dy);
      if (neighbor && filterFn(neighbor)) {
        neighbors.push(neighbor);
      }
    }

    return neighbors;
  }

  getUnvisitedNeighbours(cell) {
    return this.getNeighbours(cell, (neighbor) => !neighbor.isVisited, false);
  }

  removeWall(current, neighbor) {
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

  generateMaze() {
    const cellStack = new Stack();
    const startCell = this.getFirstCell();
    startCell.isVisited = true;
    cellStack.push(startCell);

    while (!cellStack.isEmpty()) {
      const currentCell = cellStack.peek();
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

  getCell(x, y) {
    if (y < 0 || y >= this.grid.length || x < 0 || x >= this.grid[y].length) {
      return null;
    }
    return this.grid[y][x];
  }

  getFirstCell() {
    return this.startCell;
  }

  getEndCell() {
    return this.endCell;
  }

  isSameCell(cell1, cell2) {
    return cell1.x === cell2.x && cell1.y === cell2.y;
  }

  getCellKey(cell) {
    return `${cell.x},${cell.y}`;
  }
}

// DFS Solver class
class DFSSolver extends Maze {
  constructor(maze) {
    super(maze.width, maze.height);

    this.grid.length = 0;
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
    this.cellStack = new Stack();
    this.visitedCells = new Set();
    this.solutionPath = [];
    this.solved = false;
    this.isAnimating = false;
  }

  async solveAnimated(onStep, delay = 50) {
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

    if (onStep) {
      onStep(startCell, new Set(this.visitedCells), false);
    }
    await this.sleep(delay);

    while (!this.cellStack.isEmpty() && this.isAnimating) {
      const currentCell = this.cellStack.peek();

      if (this.isSameCell(currentCell, endCell)) {
        this.solved = true;
        this.buildSolutionPath();
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

        if (onStep) {
          onStep(nextCell, new Set(this.visitedCells), false);
        }
      } else {
        this.cellStack.pop();
        const backtrackCell = this.cellStack.peek();

        if (onStep && backtrackCell) {
          onStep(backtrackCell, new Set(this.visitedCells), true);
        }
      }

      await this.sleep(delay);
    }

    this.isAnimating = false;
    return false;
  }

  stopAnimation() {
    this.isAnimating = false;
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  markVisited(cell) {
    const key = this.getCellKey(cell);
    this.visitedCells.add(key);
  }

  isVisitedBySolver(cell) {
    const key = this.getCellKey(cell);
    return this.visitedCells.has(key);
  }

  buildSolutionPath() {
    this.solutionPath.length = 0;
    const tempStack = new Stack();

    while (!this.cellStack.isEmpty()) {
      tempStack.push(this.cellStack.pop());
    }

    while (!tempStack.isEmpty()) {
      this.solutionPath.push(tempStack.pop());
    }
  }

  resetSolver() {
    this.visitedCells.clear();
    this.solutionPath.length = 0;
    this.solved = false;
    while (!this.cellStack.isEmpty()) {
      this.cellStack.pop();
    }
  }

  getSolutionPath() {
    return [...this.solutionPath];
  }

  isSolved() {
    return this.solved;
  }

  isAnimationRunning() {
    return this.isAnimating;
  }
}

// Global variables
let currentMaze = null;
let currentSolver = null;
const canvas = document.getElementById("maze");
const ctx = canvas.getContext("2d");

// Visualization functions
function drawMaze(
  maze,
  visitedCells = new Set(),
  currentCell = null,
  isBacktracking = false,
  solutionPath = []
) {
  const cellSize = Math.min(
    canvas.width / maze.width,
    canvas.height / maze.height
  );
  const offsetX = (canvas.width - maze.width * cellSize) / 2;
  const offsetY = (canvas.height - maze.height * cellSize) / 2;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth = 2;

  // Create solution path set for quick lookup
  const solutionSet = new Set();
  solutionPath.forEach((cell) => {
    solutionSet.add(`${cell.x},${cell.y}`);
  });

  for (let y = 0; y < maze.height; y++) {
    for (let x = 0; x < maze.width; x++) {
      const cell = maze.getCell(x, y);
      if (!cell) continue;

      const cellX = offsetX + x * cellSize;
      const cellY = offsetY + y * cellSize;

      // Fill cell background
      if (cell.isFirstCell) {
        ctx.fillStyle = "#4CAF50"; // Green for start
      } else if (cell.isLastCell) {
        ctx.fillStyle = "#f44336"; // Red for end
      } else if (solutionSet.has(`${x},${y}`)) {
        ctx.fillStyle = "#FFD700"; // Gold for solution path
      } else if (currentCell && currentCell.x === x && currentCell.y === y) {
        ctx.fillStyle = isBacktracking ? "#FF6B6B" : "#54A0FF"; // Different colors for current cell
      } else if (visitedCells.has(`${x},${y}`)) {
        ctx.fillStyle = "#E8F4FD"; // Light blue for visited
      } else {
        ctx.fillStyle = "#FFFFFF"; // White for unvisited
      }

      ctx.fillRect(cellX, cellY, cellSize, cellSize);

      // Draw walls
      ctx.strokeStyle = "#333333";
      ctx.beginPath();

      if (cell.topWall) {
        ctx.moveTo(cellX, cellY);
        ctx.lineTo(cellX + cellSize, cellY);
      }
      if (cell.rightWall) {
        ctx.moveTo(cellX + cellSize, cellY);
        ctx.lineTo(cellX + cellSize, cellY + cellSize);
      }
      if (cell.bottomWall) {
        ctx.moveTo(cellX + cellSize, cellY + cellSize);
        ctx.lineTo(cellX, cellY + cellSize);
      }
      if (cell.leftWall) {
        ctx.moveTo(cellX, cellY + cellSize);
        ctx.lineTo(cellX, cellY);
      }

      ctx.stroke();

      // Draw S and E markers
      if (cell.isFirstCell || cell.isLastCell) {
        ctx.fillStyle = "white";
        ctx.font = `bold ${cellSize * 0.4}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
          cell.isFirstCell ? "S" : "E",
          cellX + cellSize / 2,
          cellY + cellSize / 2
        );
      }
    }
  }
}

function updateStatus(message, className = "") {
  const status = document.getElementById("status");
  status.textContent = message;
  status.className = `status ${className}`;
}

function generateMaze() {
  const width = parseInt(document.getElementById("width").value);
  const height = parseInt(document.getElementById("height").value);

  if (width < 5 || height < 5 || width > 50 || height > 50) {
    alert("Please enter width and height between 5 and 50");
    return;
  }

  updateStatus("Generating maze...", "generating");

  // Disable buttons during generation
  document.getElementById("solveBtn").disabled = true;
  document.getElementById("stopBtn").disabled = true;

  setTimeout(() => {
    currentMaze = new Maze(width, height);
    currentMaze.generateMaze();
    currentSolver = null;

    drawMaze(currentMaze);
    updateStatus('Maze generated! Click "Solve Maze" to see the solution.', "");
    document.getElementById("solveBtn").disabled = false;
  }, 100);
}

async function solveMaze() {
  if (!currentMaze) {
    alert("Please generate a maze first!");
    return;
  }

  currentSolver = new DFSSolver(currentMaze);

  updateStatus("Solving maze...", "solving");
  document.getElementById("solveBtn").disabled = true;
  document.getElementById("stopBtn").disabled = false;

  const solved = await currentSolver.solveAnimated(
    (currentCell, visitedCells, isBacktracking) => {
      drawMaze(currentMaze, visitedCells, currentCell, isBacktracking);
    },
    100
  );

  if (solved && currentSolver.isAnimationRunning() !== false) {
    updateStatus("Maze solved! Showing solution path...", "solved");
    // Draw final solution
    drawMaze(
      currentMaze,
      currentSolver.visitedCells,
      null,
      false,
      currentSolver.getSolutionPath()
    );

    setTimeout(() => {
      updateStatus(
        `Solution found! Path length: ${
          currentSolver.getSolutionPath().length
        } steps`,
        "solved"
      );
    }, 1000);
  } else if (!currentSolver.isAnimationRunning()) {
    updateStatus("Solving stopped", "");
  } else {
    updateStatus("No solution found!", "");
  }

  document.getElementById("solveBtn").disabled = false;
  document.getElementById("stopBtn").disabled = true;
}

function stopSolving() {
  if (currentSolver) {
    currentSolver.stopAnimation();
    updateStatus("Solving stopped", "");
    document.getElementById("solveBtn").disabled = false;
    document.getElementById("stopBtn").disabled = true;
  }
}

// Initialize with a default maze
window.onload = function () {
  generateMaze();
};
