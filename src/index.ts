import { Cell } from "./Cell";
import { Maze } from "./Maze";
import { DFSSolver } from "./DFSSolver";
import * as readline from "readline";

function main(): void {
    UI();
}

function UI(): void {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    rl.question("Enter the width of the maze: ", (width) => {
        rl.question("Enter the height of the maze: ", (height) => {
            const w = parseInt(width);
            const h = parseInt(height);
            
            if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
                console.log("Please enter valid positive numbers for width and height.");
                rl.close();
                return;
            }
            
            console.log(`Creating ${w}x${h} maze...`);
            const maze = new Maze(w, h);
            maze.generateMaze();
            maze.printMaze();
            
            const solver = new DFSSolver(maze);
            solver.solve();
            solver.printMazeWithSolution();
            
            rl.close();
        });
    });
}

main();