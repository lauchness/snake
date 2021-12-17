import * as readline from "readline";

const Dimensions = {
  width: 20,
  height: 16,
};

enum Directions {
  "North",
  "East",
  "South",
  "West",
}

const columns: string[] = " ".repeat(Dimensions.width).split("");

const board: string[][] = [[]];

let snake: [number, number][] = [[0, Dimensions.width / 2]];

let currentDirection: Directions = Directions.West;

const horizontalBorder = `S${"-".repeat(Dimensions.width)}S\n`;

const printBoard = (board: string[][]) => {
  const boardString = `${horizontalBorder}${board.reduce(
    (acc, row) =>
      `${acc}|${row.reduce((rowAcc, col) => `${rowAcc}${col}`, "")}|\n`,
    ""
  )}${horizontalBorder}`;

  console.log(boardString);
};

const resetBoard = () => {
  for (let i = 0; i < Dimensions.height; i++) {
    board[i] = [...columns];
  }
};

const tick = () => {
  console.clear();
  resetBoard();
  let nextCoord: [number, number];
  switch (currentDirection) {
    case Directions.North:
      nextCoord = [snake[0][0] - 1, snake[0][1]];
      break;
    case Directions.East:
      nextCoord = [snake[0][0], snake[0][1] + 1];
      break;
    case Directions.South:
      nextCoord = [snake[0][0] + 1, snake[0][1]];
      break;
    case Directions.West:
      nextCoord = [snake[0][0], snake[0][1] - 1];
      break;
    default:
      nextCoord = [snake[0][0], snake[0][1]];
  }
  snake = [nextCoord, ...snake.slice(0, snake.length - 1)];
  snake.forEach((coord) => {
    board[coord[0]][coord[1]] = "█";
  });
  printBoard(board);
};

readline.emitKeypressEvents(process.stdin);

if (process.stdin.isTTY) process.stdin.setRawMode(true);

process.stdin.on("keypress", (chunk, key) => {
  console.log("key", key.name);
  if (key && key.name == "q") process.exit();
});

const init = () => {
  for (let i = 0; i < Dimensions.height; i++) {
    board[i] = [...columns];
  }
  setInterval(tick, 500);
};

init();
