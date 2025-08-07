// this whole thing is a proof of concept
import { Cell } from "./Cell";
import { Maze } from "./Maze";
import { DFSSolver } from "./DFSSolver";

function main(): void {
    const maze = new Maze(20, 20);
    console.log("Generating maze...");
    maze.printMaze();
    console.log("unsolved maze");
    maze.generateMaze();
    maze.printMaze();
    console.log("Developed maze.")
    const solver = new DFSSolver(maze);
    solver.solve();
    solver.printMazeWithSolution();
}

main();