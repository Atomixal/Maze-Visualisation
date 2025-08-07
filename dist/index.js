"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Maze_1 = require("./Maze");
const DFSSolver_1 = require("./DFSSolver");
function main() {
    const maze = new Maze_1.Maze(20, 20);
    console.log("Generating maze...");
    maze.printMaze();
    console.log("unsolved maze");
    maze.generateMaze();
    maze.printMaze();
    console.log("Developed maze.");
    const solver = new DFSSolver_1.DFSSolver(maze);
    solver.solve();
    solver.printMazeWithSolution();
}
main();
