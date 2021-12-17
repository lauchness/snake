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

function getRandomArbitrary(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

const columns: string[] = " ".repeat(Dimensions.width).split("");

const board: string[][] = [[]];

let snake: [number, number][] = [[0, Dimensions.width / 2]];

let eggs: [number, number][] = [];

let currentDirection: Directions = Directions.South;

let tickTimer: NodeJS.Timer;

const horizontalBorder = `S${"-".repeat(Dimensions.width)}S\n`;

const printBoard = (board: string[][]) => {
  const boardString = `Press "q" to quit.\n${horizontalBorder}${board.reduce(
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

const endGame = () => {
  clearInterval(tickTimer);
  console.clear();
  console.log("Game Over");
  console.log(`Your score was ${snake.length}`);
  console.log(`Press "r" to restart`);
  console.log(`Press "q" to quit`);
};

const eatEggs = (coord: [number, number]) => {
  const eggHit = eggs.findIndex(
    (egg) => egg[0] === coord[0] && egg[1] === coord[1]
  );
  if (eggHit !== -1) {
    eggs = [...eggs.slice(0, eggHit), ...eggs.slice(eggHit + 1, eggs.length)];
  }
  return eggHit !== -1;
};

const checkCollision = (coord: [number, number]) => {
  const snakeExistsAt = snake.findIndex(
    (snakeCoord) => snakeCoord[0] === coord[0] && snakeCoord[1] === coord[1]
  );
  return snakeExistsAt !== -1;
};

const tick = () => {
  console.clear();
  resetBoard();
  const rand = Math.random();
  if (rand < 0.1) {
    const newX = getRandomArbitrary(0, Dimensions.width);
    const newY = getRandomArbitrary(0, Dimensions.height);
    eggs = [...eggs, [newY, newX]];
  }
  let nextCoord: [number, number];
  switch (currentDirection) {
    case Directions.North:
      nextCoord = [snake[0][0] - 1, snake[0][1]];
      if (nextCoord[0] === -1) {
        return endGame();
      }
      break;
    case Directions.East:
      nextCoord = [snake[0][0], snake[0][1] + 1];
      if (nextCoord[1] === Dimensions.width) {
        return endGame();
      }
      break;
    case Directions.South:
      nextCoord = [snake[0][0] + 1, snake[0][1]];
      if (nextCoord[0] === Dimensions.height) {
        return endGame();
      }
      break;
    case Directions.West:
      nextCoord = [snake[0][0], snake[0][1] - 1];
      if (nextCoord[1] === -1) {
        return endGame();
      }
      break;
    default:
      nextCoord = [snake[0][0], snake[0][1]];
  }
  if (checkCollision(nextCoord)) {
    return endGame();
  }
  if (eatEggs(nextCoord)) {
    snake = [nextCoord, ...snake];
  } else {
    snake = [nextCoord, ...snake.slice(0, snake.length - 1)];
  }

  snake.forEach((coord) => {
    board[coord[0]][coord[1]] = "█";
  });
  eggs.forEach((egg) => {
    board[egg[0]][egg[1]] = "0";
  });
  printBoard(board);
};

const init = () => {
  snake = [[0, Dimensions.width / 2]];

  eggs = [];

  currentDirection = Directions.South;

  for (let i = 0; i < Dimensions.height; i++) {
    board[i] = [...columns];
  }

  tickTimer = setInterval(tick, 200);
};

readline.emitKeypressEvents(process.stdin);

if (process.stdin.isTTY) process.stdin.setRawMode(true);

process.stdin.on("keypress", (chunk, key) => {
  switch (key.name) {
    case "up":
      currentDirection = Directions.North;
      break;
    case "right":
      currentDirection = Directions.East;
      break;
    case "down":
      currentDirection = Directions.South;
      break;
    case "left":
      currentDirection = Directions.West;
      break;
  }
  if (key && key.name == "q") process.exit();
  if (key && key.name === "r") {
    init();
  }
});

init();
