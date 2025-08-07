"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Maze = void 0;
const Stack_1 = require("./Stack");
const Cell_1 = require("./Cell");
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
                row.push(new Cell_1.Cell(x, y, false, false, false));
            }
            this.grid.push(row);
        }
        // TODO: Have the first and last cells dynamically populated according to the user.
        this.grid[0][0].isFirstCell = true;
    }
    // Generic method to get neighbors with optional wall checking and custom filter
    getNeighbours(cell, filterFn, respectWalls = false) {
        const neighbors = [];
        const { x, y } = cell;
        const directions = [
            { dx: 0, dy: -1, wallCheck: () => !cell.topWall }, // Up
            { dx: 1, dy: 0, wallCheck: () => !cell.rightWall }, // Right
            { dx: 0, dy: 1, wallCheck: () => !cell.bottomWall }, // Down
            { dx: -1, dy: 0, wallCheck: () => !cell.leftWall }, // Left
        ];
        for (const { dx, dy, wallCheck } of directions) {
            // If respectWalls is true, check if there's a wall blocking the path
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
    // Convenience method for getting unvisited neighbors (for maze generation)
    getUnvisitedNeighbours(cell) {
        return this.getNeighbours(cell, (neighbor) => !neighbor.isVisited, false);
    }
    removeWall(current, neighbor) {
        const dx = current.x - neighbor.x;
        const dy = current.y - neighbor.y;
        // Remove walls based on relative position
        if (dx === 1) {
            // Neighbor to the left
            current.leftWall = false;
            neighbor.rightWall = false;
        }
        else if (dx === -1) {
            // Neighbor to the right
            current.rightWall = false;
            neighbor.leftWall = false;
        }
        else if (dy === 1) {
            // Neighbor above
            current.topWall = false;
            neighbor.bottomWall = false;
        }
        else if (dy === -1) {
            // Neighbor below
            current.bottomWall = false;
            neighbor.topWall = false;
        }
    }
    // Generate Maze using DFS
    generateMaze() {
        const cellStack = new Stack_1.Stack();
        const startCell = this.getFirstCell();
        startCell.isVisited = true;
        cellStack.push(startCell);
        while (!cellStack.isEmpty()) {
            const currentCell = cellStack.peek();
            const unvisitedNeighbors = this.getUnvisitedNeighbours(currentCell);
            if (unvisitedNeighbors.length > 0) {
                // Chose next neighbor that's not been visited
                const randomIndex = Math.floor(Math.random() * unvisitedNeighbors.length);
                const chosenNeighbor = unvisitedNeighbors[randomIndex];
                chosenNeighbor.isVisited = true;
                this.removeWall(currentCell, chosenNeighbor);
                cellStack.push(chosenNeighbor);
            }
            else {
                // No unvisited neighbors, backtrack
                cellStack.pop();
            }
        }
    }
    // Reset Maze for next generation
    // Seperate function because easier interfacing for later
    reset() {
        this.initialiseMaze(this.width, this.height);
    }
    // Outputs the maze to Console in ASCII
    printMaze() {
        let mazeString = "";
        // Print the top border
        for (let x = 0; x < this.width; x++) {
            const cell = this.getCell(x, 0);
            if (cell && cell.topWall) {
                mazeString += "+---";
            }
            else {
                mazeString += "+   ";
            }
        }
        mazeString += "+\n";
        // Print each row
        for (let y = 0; y < this.height; y++) {
            let rowString = "";
            for (let x = 0; x < this.width; x++) {
                const cell = this.getCell(x, y);
                if (!cell)
                    continue;
                // Left wall
                if (cell.leftWall) {
                    rowString += "|";
                }
                else {
                    rowString += " ";
                }
                if (cell.isFirstCell) {
                    rowString += " S ";
                }
                else if (cell.isLastCell) {
                    rowString += " E ";
                }
                else {
                    rowString += "   ";
                }
            }
            // Right border
            const rightMostCell = this.getCell(this.width - 1, y);
            if (rightMostCell && rightMostCell.rightWall) {
                rowString += "|";
            }
            else {
                rowString += " ";
            }
            mazeString += rowString + "\n";
            // Print horizontal walls
            let wallString = "";
            for (let x = 0; x < this.width; x++) {
                const cell = this.getCell(x, y);
                if (!cell)
                    continue;
                wallString += "+";
                if (cell.bottomWall) {
                    wallString += "---";
                }
                else {
                    wallString += "   ";
                }
            }
            mazeString += wallString += "+\n";
        }
        console.log(mazeString);
    }
    getCell(x, y) {
        // Catch any out of bounds Exceptions.
        if (y < 0 || y >= this.grid.length || x < 0 || x >= this.grid[y].length) {
            console.log(`The coordinates (${x},${y}) are out of bounds!\nThe maze is ${this.width}, ${this.height}.`);
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
    // Utility method to check if two cells are the same
    isSameCell(cell1, cell2) {
        return cell1.x === cell2.x && cell1.y === cell2.y;
    }
    // Utility method to create a unique key for a cell
    getCellKey(cell) {
        return `${cell.x},${cell.y}`;
    }
}
exports.Maze = Maze;
