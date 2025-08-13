import Maze from "../core/Maze.js";
import Cell from "../models/Cell.js";

export function drawMaze(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  maze: Maze,
  visitedCells = new Set<string>(),
  currentCell: Cell | null = null,
  isBacktracking = false,
  solutionPath: Cell[] = []
): void {
  const cellSize = Math.min(
    canvas.width / (maze.width || 1),
    canvas.height / (maze.height || 1)
  );
  const offsetX = (canvas.width - maze.width * cellSize) / 2;
  const offsetY = (canvas.height - maze.height * cellSize) / 2;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth = 2;

  const solutionSet = new Set<string>();
  solutionPath.forEach((cell) => solutionSet.add(`${cell.x},${cell.y}`));

  // Draw cells and walls
  for (let y = 0; y < maze.height; y++) {
    for (let x = 0; x < maze.width; x++) {
      const cell = maze.getCell(x, y);
      if (!cell) continue;

      const cellX = offsetX + x * cellSize;
      const cellY = offsetY + y * cellSize;

      // Fill cell background with priority order
      if (cell.isFirstCell) {
        ctx.fillStyle = "#4CAF50"; // start - green
      } else if (cell.isLastCell) {
        ctx.fillStyle = "#f44336"; // end - red
      } else if (currentCell && currentCell.x === x && currentCell.y === y) {
        ctx.fillStyle = isBacktracking ? "#FF6B6B" : "#54A0FF"; // current cell
      } else if (solutionSet.has(`${x},${y}`)) {
        ctx.fillStyle = "#FFD700"; // solution path - gold
      } else if (visitedCells.has(`${x},${y}`)) {
        ctx.fillStyle = "#E8F4FD"; // visited - light blue
      } else {
        ctx.fillStyle = "#FFFFFF"; // unvisited - white
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
    }
  }

  // Draw solution path as a connected line (if solution exists and is complete)
  if (solutionPath.length > 1) {
    drawSolutionLine(ctx, solutionPath, cellSize, offsetX, offsetY);
  }

  // Draw start and end labels (on top of everything)
  drawStartEndLabels(ctx, maze, cellSize, offsetX, offsetY);
}

function drawSolutionLine(
  ctx: CanvasRenderingContext2D,
  solutionPath: Cell[],
  cellSize: number,
  offsetX: number,
  offsetY: number
): void {
  if (solutionPath.length < 2) return;

  ctx.save();
  
  // Draw the main solution line
  ctx.strokeStyle = "#FF4444"; // Bright red for the solution line
  ctx.lineWidth = Math.max(3, cellSize * 0.1); // Thicker line, scaled to cell size
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  
  // Add slight transparency
  ctx.globalAlpha = 0.8;
  
  ctx.beginPath();
  
  // Start from center of first cell
  const firstCell = solutionPath[0];
  const startX = offsetX + firstCell.x * cellSize + cellSize / 2;
  const startY = offsetY + firstCell.y * cellSize + cellSize / 2;
  ctx.moveTo(startX, startY);
  
  // Draw line through center of each cell in the solution path
  for (let i = 1; i < solutionPath.length; i++) {
    const cell = solutionPath[i];
    const centerX = offsetX + cell.x * cellSize + cellSize / 2;
    const centerY = offsetY + cell.y * cellSize + cellSize / 2;
    ctx.lineTo(centerX, centerY);
  }
  
  ctx.stroke();
  
  // Draw directional arrows along the path
  drawPathArrows(ctx, solutionPath, cellSize, offsetX, offsetY);
  
  ctx.restore();
}

function drawPathArrows(
  ctx: CanvasRenderingContext2D,
  solutionPath: Cell[],
  cellSize: number,
  offsetX: number,
  offsetY: number
): void {
  const arrowSize = Math.max(4, cellSize * 0.15);
  
  ctx.fillStyle = "#FF4444";
  ctx.globalAlpha = 0.9;
  
  // Draw arrows every few cells (adjust frequency based on path length)
  const frequency = Math.max(1, Math.floor(solutionPath.length / 10));
  
  for (let i = frequency; i < solutionPath.length - 1; i += frequency) {
    const currentCell = solutionPath[i];
    const nextCell = solutionPath[i + 1];
    
    const currentX = offsetX + currentCell.x * cellSize + cellSize / 2;
    const currentY = offsetY + currentCell.y * cellSize + cellSize / 2;
    const nextX = offsetX + nextCell.x * cellSize + cellSize / 2;
    const nextY = offsetY + nextCell.y * cellSize + cellSize / 2;
    
    // Calculate direction
    const dx = nextX - currentX;
    const dy = nextY - currentY;
    const angle = Math.atan2(dy, dx);
    
    // Draw arrow at current position pointing toward next position
    drawArrow(ctx, currentX, currentY, angle, arrowSize);
  }
}

function drawArrow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  size: number
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  
  ctx.beginPath();
  ctx.moveTo(size, 0);
  ctx.lineTo(-size / 2, -size / 2);
  ctx.lineTo(-size / 2, size / 2);
  ctx.closePath();
  ctx.fill();
  
  ctx.restore();
}

function drawStartEndLabels(
  ctx: CanvasRenderingContext2D,
  maze: Maze,
  cellSize: number,
  offsetX: number,
  offsetY: number
): void {
  for (let y = 0; y < maze.height; y++) {
    for (let x = 0; x < maze.width; x++) {
      const cell = maze.getCell(x, y);
      if (!cell || (!cell.isFirstCell && !cell.isLastCell)) continue;

      const cellX = offsetX + x * cellSize;
      const cellY = offsetY + y * cellSize;

      // Draw labels with better contrast
      ctx.save();
      ctx.fillStyle = "white";
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 2;
      ctx.font = `bold ${cellSize * 0.4}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      const text = cell.isFirstCell ? "S" : "E";
      const textX = cellX + cellSize / 2;
      const textY = cellY + cellSize / 2;
      
      // Draw text outline for better visibility
      ctx.strokeText(text, textX, textY);
      ctx.fillText(text, textX, textY);
      
      ctx.restore();
    }
  }
}

// Optional: Export additional utility function for drawing statistics
export function drawSolvingStats(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  stats: { visitedCount: number; solutionLength: number; efficiency: number }
): void {
  ctx.save();
  
  // Draw semi-transparent background
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(10, 10, 200, 80);
  
  // Draw stats text
  ctx.fillStyle = "white";
  ctx.font = "14px Arial";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  
  ctx.fillText(`Visited: ${stats.visitedCount} cells`, 20, 25);
  ctx.fillText(`Solution: ${stats.solutionLength} steps`, 20, 45);
  ctx.fillText(`Efficiency: ${stats.efficiency}%`, 20, 65);
  
  ctx.restore();
}