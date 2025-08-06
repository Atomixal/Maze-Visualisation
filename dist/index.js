"use strict";
class Cell {
    constructor(x, y, isVisited, isLastCell, isFirstCell) {
        this.x = x;
        this.y = y;
        this.isVisited = isVisited;
        this.isFirstCell = isFirstCell;
        this.isLastCell = isLastCell;
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
const exampleCell = new Cell(1, 2, true, false, true);
exampleCell.testFunction();
