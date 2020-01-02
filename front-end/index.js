// generating divs//

function fillGrid() {
  const div = document.querySelector("game-grid");
  const letters_div = document.createElement("div");
  letters_div.classList("grid-item");
}

const USER_URL = "http://localhost:3000/users";
const GAME_URL = "http://localhost:3000/games";

let gameId = 0;

const init = () => {
  renderLogin();
};

const renderLogin = () => {
  const main = document.querySelector("#main");
  const div = document.createElement("div");
  div.setAttribute("id", "login");
  // div.style.vw = "100vw";
  // div.style.color = "red";
  const h1 = document.createElement("h1");
  h1.innerText = "WELCOME TO WORDHUNTER";
  const h3Username = document.createElement("h3");
  h3Username.innerText = "Please enter your name:  ";
  const nameInput = document.createElement("input");
  nameInput.setAttribute("type", "text");
  nameInput.setAttribute("id", "username");
  const createGameBtn = document.createElement("button");
  createGameBtn.innerText = "Start new game";
  createGameBtn.setAttribute("class", "button");
  createGameBtn.addEventListener("click", e => {
    e.preventDefault();
    const newUsername = document.querySelector("#username").value;
    // debugger;
    fetch(USER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: newUsername
      })
    })
      .then(resp => resp.json())
      .then(user => {
        fetch(GAME_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user.id,
            difficulty: "EASY",
            score: 0
          })
        })
          .then(resp => resp.json())
          .then(game => renderNewGame(game));
      });

    // div.style.display = "none";
  });

  h3Username.append(nameInput);
  div.append(h1, h3Username, createGameBtn);
  main.append(div);

  //hide puzzle
  const pDiv = document.querySelector("#puzzle");
  pDiv.style.display = "none";
  const pUl = document.querySelector("#words");
  pUl.style.display = "none";
  const pSolveBtn = document.querySelector("#solve");
  pSolveBtn.style.display = "none";
};

const renderNewGame = game => {
  const loginDiv = document.querySelector("#login");
  loginDiv.style.display = "none";
  const pDiv = document.querySelector("#puzzle");
  pDiv.style.display = "block";
  const pUl = document.querySelector("#words");
  pUl.style.display = "block";
  const pSolveBtn = document.querySelector("#solve");
  pSolveBtn.style.display = "block";

  

  const wordsArray = game.words.split(" ");

  wordsArray.map(word =>
    WordFindGame.insertWordBefore($("#add-word").parent(), word)
  );
  /* Init */
  function recreate() {
    $("#result-message").removeClass();
    var fillBlanks, game;
    try {
      game = new WordFindGame("#puzzle", {
        allowedMissingWords: +$("#allowed-missing-words").val(),
        maxGridGrowth: +$("#max-grid-growth").val(),
        fillBlanks: fillBlanks,
        allowExtraBlanks: ["none", "secret-word-plus-blanks"].includes(
          $("#extra-letters").val()
        ),
        maxAttempts: 100
      });
    } catch (error) {
      $("#result-message")
        .text(`😞 ${error}, try to specify less ones`)
        .css({ color: "red" });
      return;
    }
    wordfind.print(game);
    if (window.game) {
      var emptySquaresCount = WordFindGame.emptySquaresCount();
      $("#result-message")
        .text(`😃 ${emptySquaresCount ? "but there are empty squares" : ""}`)
        .css({ color: "" });
    }
    window.game = game;
  }
  recreate();
  $("#solve").click(() => game.solve());
};

document.addEventListener("DOMContentLoaded", () => {
  init();
});
