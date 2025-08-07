"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const Maze_1 = require("./Maze");
const DFSSolver_1 = require("./DFSSolver");
const readline = __importStar(require("readline"));
function main() {
    UI();
}
function UI() {
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
            const maze = new Maze_1.Maze(w, h);
            maze.generateMaze();
            maze.printMaze();
            const solver = new DFSSolver_1.DFSSolver(maze);
            solver.solve();
            solver.printMazeWithSolution();
            rl.close();
        });
    });
}
main();
