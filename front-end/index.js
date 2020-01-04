const USER_URL = "http://localhost:3000/users";
const GAME_URL = "http://localhost:3000/games";
var game;
var score = 0;
var gameID;
var userID;

const resetGame = game => {
  document
    .querySelectorAll(".word")
    .forEach(el => el.parentNode.removeChild(el));
  score = 0;
  let score_counter = document.querySelector(".score_counter");
  score_counter.innerText = `Your score is: ${score}`;
  renderNewGame(game);
};

function leaveGame() {
  document
    .querySelectorAll(".word")
    .forEach(el => el.parentNode.removeChild(el));

  renderLogin();
}

function hidePuzzle() {
  const scoreP = document.querySelector(".score_counter");
  scoreP.innerText = "";
  score = 0;
  const pDiv = document.querySelector("#puzzle");
  pDiv.style.display = "none";
  const pUl = document.querySelector("#words");
  pUl.style.display = "none";
}

function prepareGamePage() {
  const loginDiv = document.querySelector("#login");
  loginDiv.style.display = "none";
  const pDiv = document.querySelector("#puzzle");
  pDiv.style.display = "block";
  const pUl = document.querySelector("#words");
  pUl.style.display = "block";
}

function showEndGamePopup(total_score) {
  return Swal.fire({
    title: `Your current game score is: ${score}, and your total score is: ${total_score} `,
    width: 600,
    padding: "3em",
    backdrop: `
      rgba(0,0,123,0.4)
      url("images/nyan-cat.gif")
      left top
      no-repeat
    `,
    showCloseButton: true,
    showCancelButton: true,
    focusConfirm: false,
    confirmButtonText: "Play again",
    confirmButtonAriaLabel: "",
    cancelButtonText: "Exit",
    cancelButtonAriaLabel: ""
  });
}

function calculateTotalScore(user_info) {
  let total_score = 0;
  user_info.games.forEach(game => (total_score += game.score));
  return total_score;
}

function requestNewGame(user_id) {
  return fetch(GAME_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: user_id,
      difficulty: "EASY",
      score: 0
    })
  });
}

function score_alert(user_info) {
  userID = user_info.id;
  let total_score = calculateTotalScore(user_info);

  showEndGamePopup(total_score).then(result => {
    if (result.value) {
      requestNewGame(user_info.id)
        .then(resp => resp.json())
        .then(game => {
          resetGame(game);
        });
    } else {
      leaveGame();
    }
  });
}

const init = () => {
  renderLogin();
};

function createLoginPage() {
  const div = document.querySelector("#login");
  div.style.display = "block";
  const nameInput = document.querySelector("#username");
  nameInput.style.display = "inline";
  nameInput.value = "";
  const createGameBtn = document.querySelector(".button");
  createGameBtn.style.display = "inline";
}

function requestUser(username) {
  return fetch(USER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: username
    })
  });
}

const createGame = e => {
  e.preventDefault();
  const username = document.querySelector("#username").value;
  requestUser(username)
    .then(resp => resp.json())
    .then(user => {
      requestNewGame(user.id)
        .then(resp => resp.json())
        .then(game => {
          renderNewGame(game);
        });
    });
};

const renderLogin = () => {
  createLoginPage();
  const createGameBtn = document.querySelector(".button");
  createGameBtn.removeEventListener("click", createGame);
  createGameBtn.addEventListener("click", createGame);

  hidePuzzle();
};

/* Init */
function recreate() {
  $("#result-message").removeClass();
  var fillBlanks, game;
  game = new WordFindGame("#puzzle", {
    allowedMissingWords: +$("#allowed-missing-words").val(),
    maxGridGrowth: +$("#max-grid-growth").val(),
    fillBlanks: fillBlanks,
    allowExtraBlanks: ["none", "secret-word-plus-blanks"].includes(
      $("#extra-letters").val()
    ),
    maxAttempts: 100
  });

  wordfind.print(game);
  if (window.game) {
    var emptySquaresCount = WordFindGame.emptySquaresCount();
    $("#result-message")
      .text(`😃 ${emptySquaresCount ? "but there are empty squares" : ""}`)
      .css({ color: "" });
  }
  window.game = game;
}

const renderNewGame = game => {
  gameID = game.id;

  userID = game.user_id;

  prepareGamePage();

  const wordsArray = game.words.split(" ");

  wordsArray.map(word =>
    WordFindGame.insertWordBefore($("#add-word").parent(), word)
  );

  recreate();
  $("#solve").click(() => game.solve());
};

document.addEventListener("DOMContentLoaded", () => {
  init();
});
