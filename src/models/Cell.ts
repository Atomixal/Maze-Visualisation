export default class Cell {
  x: number;
  y: number;
  isVisited: boolean;
  isFirstCell: boolean;
  isLastCell: boolean;
  topWall: boolean;
  rightWall: boolean;
  bottomWall: boolean;
  leftWall: boolean;

  constructor(
    x: number,
    y: number,
    isVisited = false,
    isFirstCell = false,
    isLastCell = false
  ) {
    this.x = x;
    this.y = y;
    this.isVisited = isVisited;
    this.isFirstCell = isFirstCell;
    this.isLastCell = isLastCell;
    this.topWall = true;
    this.rightWall = true;
    this.bottomWall = true;
    this.leftWall = true;
  }
}