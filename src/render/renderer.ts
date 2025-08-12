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

  for (let y = 0; y < maze.height; y++) {
    for (let x = 0; x < maze.width; x++) {
      const cell = maze.getCell(x, y);
      if (!cell) continue;

      const cellX = offsetX + x * cellSize;
      const cellY = offsetY + y * cellSize;

      // Fill cell background
      if (cell.isFirstCell) {
        ctx.fillStyle = "#4CAF50"; // start
      } else if (cell.isLastCell) {
        ctx.fillStyle = "#f44336"; // end
      } else if (solutionSet.has(`${x},${y}`)) {
        ctx.fillStyle = "#FFD700"; // solution
      } else if (currentCell && currentCell.x === x && currentCell.y === y) {
        ctx.fillStyle = isBacktracking ? "#FF6B6B" : "#54A0FF";
      } else if (visitedCells.has(`${x},${y}`)) {
        ctx.fillStyle = "#E8F4FD"; // visited
      } else {
        ctx.fillStyle = "#FFFFFF"; // unvisited
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

      // Draw S and E
      if (cell.isFirstCell || cell.isLastCell) {
        ctx.fillStyle = "white";
        ctx.font = `bold ${cellSize * 0.4}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(cell.isFirstCell ? "S" : "E", cellX + cellSize / 2, cellY + cellSize / 2);
      }
    }
  }
}
