"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cell = void 0;
class Cell {
    constructor(x, y, isVisited = false, isLastCell = false, isFirstCell = false, topWall = true, leftWall = true, rightWall = true, bottomWall = true) {
        this.x = x;
        this.y = y;
        this.isVisited = isVisited;
        this.isFirstCell = isFirstCell;
        this.isLastCell = isLastCell;
        this.topWall = topWall;
        this.leftWall = leftWall;
        this.rightWall = rightWall;
        this.bottomWall = bottomWall;
    }
    testFunction() {
        console.log(`Hi, I'm a random cell, I'm at (${this.x},${this.y})`);
        if (this.isFirstCell) {
            console.log("I am the first cell");
        }
        if (this.isLastCell) {
            console.log("I am the last cell");
        }
        if (this.isVisited) {
            console.log("I have been visited.");
        }
    }
}
exports.Cell = Cell;
