export class Cell {
  x: number;
  y: number;
  isVisited: boolean;
  isLastCell: boolean;
  isFirstCell: boolean;

  topWall: boolean;
  leftWall: boolean;
  rightWall: boolean;
  bottomWall: boolean;

  constructor(
    x: number,
    y: number,
    isVisited: boolean = false,
    isLastCell: boolean = false,
    isFirstCell: boolean = false,

    topWall: boolean = true,
    leftWall: boolean = true,
    rightWall: boolean = true,
    bottomWall: boolean = true
  ) {
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

  testFunction(): void {
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
