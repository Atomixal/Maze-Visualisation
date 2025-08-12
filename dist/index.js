import Maze from "./core/Maze.js";
import DFSSolver from "./solvers/DFSSolver.js";
import { drawMaze } from "./render/renderer.js";
let currentMaze = null;
let currentSolver = null;
function getCanvasAndCtx() {
    const canvas = document.getElementById("maze");
    const ctx = canvas ? canvas.getContext("2d") : null;
    return { canvas, ctx };
}
function updateStatus(message, className = "") {
    const status = document.getElementById("status");
    if (!status)
        return;
    status.textContent = message;
    status.className = `status ${className}`;
}
function generateMaze() {
    const widthInput = document.getElementById("width");
    const heightInput = document.getElementById("height");
    const width = widthInput ? parseInt(widthInput.value, 10) : 20;
    const height = heightInput ? parseInt(heightInput.value, 10) : 20;
    if (isNaN(width) || isNaN(height) || width < 5 || height < 5 || width > 50 || height > 50) {
        alert("Please enter width and height between 5 and 50");
        return;
    }
    updateStatus("Generating maze...", "generating");
    const solveBtn = document.getElementById("solveBtn");
    const stopBtn = document.getElementById("stopBtn");
    if (solveBtn)
        solveBtn.disabled = true;
    if (stopBtn)
        stopBtn.disabled = true;
    setTimeout(() => {
        currentMaze = new Maze(width, height);
        currentMaze.generateMaze();
        currentSolver = null;
        const { canvas, ctx } = getCanvasAndCtx();
        if (ctx && canvas && currentMaze)
            drawMaze(ctx, canvas, currentMaze);
        updateStatus('Maze generated! Click "Solve Maze" to see the solution.', "");
        if (solveBtn)
            solveBtn.disabled = false;
    }, 100);
}
async function solveMaze() {
    if (!currentMaze) {
        alert("Please generate a maze first!");
        return;
    }
    currentSolver = new DFSSolver(currentMaze);
    updateStatus("Solving maze...", "solving");
    const solveBtn = document.getElementById("solveBtn");
    const stopBtn = document.getElementById("stopBtn");
    if (solveBtn)
        solveBtn.disabled = true;
    if (stopBtn)
        stopBtn.disabled = false;
    const { canvas, ctx } = getCanvasAndCtx();
    const solved = await currentSolver.solveAnimated((currentCell, visitedCells, isBacktracking) => {
        const { canvas: c, ctx: g } = getCanvasAndCtx();
        if (g && c && currentMaze)
            drawMaze(g, c, currentMaze, visitedCells, currentCell, !!isBacktracking);
    }, 100);
    if (solved && currentSolver.isAnimationRunning() !== false) {
        updateStatus("Maze solved! Showing solution path...", "solved");
        const { canvas: c, ctx: g } = getCanvasAndCtx();
        if (g && c && currentMaze && currentSolver) {
            drawMaze(g, c, currentMaze, currentSolver.visitedCells, null, false, currentSolver.getSolutionPath());
        }
        setTimeout(() => {
            if (currentSolver)
                updateStatus(`Solution found! Path length: ${currentSolver.getSolutionPath().length} steps`, "solved");
        }, 1000);
    }
    else if (currentSolver && !currentSolver.isAnimationRunning()) {
        updateStatus("Solving stopped", "");
    }
    else {
        updateStatus("No solution found!", "");
    }
    if (solveBtn)
        solveBtn.disabled = false;
    if (stopBtn)
        stopBtn.disabled = true;
}
function stopSolving() {
    if (currentSolver) {
        currentSolver.stopAnimation();
        updateStatus("Solving stopped", "");
        const solveBtn = document.getElementById("solveBtn");
        const stopBtn = document.getElementById("stopBtn");
        if (solveBtn)
            solveBtn.disabled = false;
        if (stopBtn)
            stopBtn.disabled = true;
    }
}
// Wire up buttons if present
window.addEventListener("load", () => {
    const genBtn = document.getElementById("generateBtn");
    const solveBtn = document.getElementById("solveBtn");
    const stopBtn = document.getElementById("stopBtn");
    if (genBtn)
        genBtn.addEventListener("click", generateMaze);
    if (solveBtn)
        solveBtn.addEventListener("click", () => void solveMaze());
    if (stopBtn)
        stopBtn.addEventListener("click", stopSolving);
    // initialize with a default maze
    generateMaze();
});
