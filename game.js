/////////////////
/* GLOBAL VARS */
/////////////////

let turn = 0;
let shotClock = 15;
let myShotClockInterval;

//////////////////
/* DOM HANDLING */
//////////////////

const gameMsg = document.getElementById("gameMsg");

const timer = document.getElementById("timer");
timer.innerText = String(shotClock);

const board = new Array(9).fill(null).map((_, idx) => {
  return `<div class="square" id="${"square-" + (idx + 1)}"></div>`;
});

const app = document.getElementById("app");
app.innerHTML = board.join("");

const boardSquares = Array.from(document.querySelectorAll(".square"));

boardSquares.forEach((node, idx) => {
  let columnClass = "column";

  switch (true) {
    case idx % 3 === 0:
      columnClass += 1;
      break;
    case (idx + 1) % 3 === 0:
      columnClass += 2;
      break;
    default:
      columnClass += 3;
  }

  node.classList.add(columnClass);
});

/////////////////////
/* GAME PLAY LOGIC */
/////////////////////

const clickHandler = (e) => {
  if (myShotClockInterval) {
    shotClock = 15;
    clearInterval(myShotClockInterval);
  }

  myShotClockInterval = setInterval(() => {
    timer.innerText = shotClock;
    shotClock--;
    if (shotClock === 0) {
      endGame("Sorry, too slow :/ you have lost");
    }
  }, 1000);

  if (e.target.innerText) {
    return;
  }

  const move = turn % 2 === 0 ? "X" : "O";
  e.target.innerText = move;
  turn++;

  winOrStalemate();
};

app.addEventListener("click", clickHandler);

////////////////////
/* Game Win Logic */
////////////////////

// helpers for finding wins
const allX = (combo) => {
  for (let i = 0; i < combo.length; i++) {
    const currNode = combo[i];
    if (currNode.innerText === "O" || currNode.innerText === "") {
      return false;
    }
  }
  return true;
};

const allO = (combo) => {
  for (let i = 0; i < combo.length; i++) {
    const currNode = combo[i];
    if (currNode.innerText === "X" || currNode.innerText === "") {
      return false;
    }
  }
  return true;
};

// end game helper function
const endGame = (message) => {
  gameMsg.innerText = message;
  clearInterval(myShotClockInterval);
  document.getElementById("timeLeftMsg").innerText = "";
  timer.innerText = "";
  app.removeEventListener("click", clickHandler);
};

// check whether game is won or no turns remain (stalemate)
function winOrStalemate() {
  // build rows
  const rows = [
    [...boardSquares.slice(0, 3)],
    [...boardSquares.slice(3, 6)],
    [...boardSquares.slice(6)],
  ];

  // build columns
  const column1 = Array.from(document.querySelectorAll(".column1"));
  const column2 = Array.from(document.querySelectorAll(".column2"));
  const column3 = Array.from(document.querySelectorAll(".column3"));
  const columns = [column1, column2, column3];

  // build diagonals
  const diagonal1 = Array.from(
    document.querySelectorAll("#square-1, #square-5, #square-9")
  );
  const diagonal2 = Array.from(
    document.querySelectorAll("#square-3, #square-5, #square-7")
  );
  const diagonals = [diagonal1, diagonal2];

  // evaluate each scenario's nodes
  // if any are a win, end game, else play until stalemate
  [rows, columns, diagonals].forEach((category) => {
    category.forEach((combination) => {
      const won = allX(combination) || allO(combination);

      if (won) {
        const player = turn % 2 === 0 ? "O" : "X";
        endGame(`Player ${player} won!`);
      } else if (turn === 9) {
        endGame("Stalemate!");
      }
    });
  });
}
