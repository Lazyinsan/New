document.addEventListener("DOMContentLoaded", () => {
  const board = Array(9).fill(null);
  const cells = document.querySelectorAll(".cell");
  const gameBoard = document.getElementById("game-board");
  const gameResult = document.getElementById("game-result");
  const resultText = document.getElementById("result-text");
  const congratsText = document.getElementById("congrats");
  const restartButton = document.getElementById("restart");
  const goBackButton = document.getElementById("go-back");

  let currentPlayer = "X";
  let vsBot = false;

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  document.getElementById("two-player").addEventListener("click", () => {
    vsBot = false;
    startGame();
  });

  document.getElementById("vs-bot").addEventListener("click", () => {
    vsBot = true;
    startGame();
  });

  restartButton.addEventListener("click", () => {
    resetGame();
  });

  goBackButton.addEventListener("click", () => {
    resetGame();
    gameBoard.classList.add("hidden");
    gameResult.classList.add("hidden");
    document.querySelector(".game-mode").classList.remove("hidden");
  });

  function startGame() {
    gameBoard.classList.remove("hidden");
    document.querySelector(".game-mode").classList.add("hidden");
  }

  function resetGame() {
    board.fill(null);
    cells.forEach(cell => {
      cell.textContent = "";
      cell.classList.remove("taken");
    });
    gameBoard.classList.remove("hidden");
    gameResult.classList.add("hidden");
    congratsText.classList.add("hidden");
    currentPlayer = "X";
  }

  cells.forEach(cell => {
    cell.addEventListener("click", () => {
      const index = cell.dataset.index;

      if (!board[index]) {
        board[index] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.classList.add("taken");

        if (checkWinner()) {
          endGame(`${currentPlayer} Wins!`);
        } else if (board.every(cell => cell)) {
          endGame("It's a Draw!");
        } else {
          currentPlayer = currentPlayer === "X" ? "O" : "X";
          if (vsBot && currentPlayer === "O") botMove();
        }
      }
    });
  });

  function botMove() {
    const bestMove = findBestMove(board);
    board[bestMove] = currentPlayer;

    const botCell = cells[bestMove];
    botCell.textContent = currentPlayer;
    botCell.classList.add("taken");

    if (checkWinner()) {
      endGame(`${currentPlayer} Wins!`);
    } else if (board.every(cell => cell)) {
      endGame("It's a Draw!");
    } else {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
    }
  }

  function findBestMove(board) {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        board[i] = currentPlayer;
        let score = minimax(board, 0, false);
        board[i] = null;
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    return move;
  }

  function minimax(board, depth, isMaximizing) {
    if (checkWinner()) return isMaximizing ? -1 : 1;
    if (board.every(cell => cell)) return 0;

    let bestScore = isMaximizing ? -Infinity : Infinity;
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        board[i] = isMaximizing ? currentPlayer : currentPlayer === "X" ? "O" : "X";
        let score = minimax(board, depth + 1, !isMaximizing);
        board[i] = null;
        bestScore = isMaximizing
          ? Math.max(score, bestScore)
          : Math.min(score, bestScore);
      }
    }
    return bestScore;
  }

  function checkWinner() {
    return winningCombinations.some(combination =>
      combination.every(index => board[index] === currentPlayer)
    );
  }

  function endGame(message) {
    resultText.textContent = message;
    if (message.includes("Wins")) congratsText.classList.remove("hidden");
    gameBoard.classList.add("hidden");
    gameResult.classList.remove("hidden");
  }
});
