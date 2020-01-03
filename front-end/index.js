// generating divs//

const USER_URL = "http://localhost:3000/users";
const GAME_URL = "http://localhost:3000/games";
var game;
var score = 0;
var gameID;
var userID;

function score_alert(user_info) {
  userID = user_info.id;
  let total_score = 0;
  user_info.games.forEach(game => (total_score += game.score));

  Swal.fire({
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
    cancelButtonText: "leave",
    cancelButtonAriaLabel: ""
  }).then(result => {
    if (result.value) {
      fetch(GAME_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userID,
          difficulty: "EASY",
          score: 0
        })
      })
        .then(resp => resp.json())
        .then(game => {
          //document.body.innerHTML = "";
          //document.getElementById("words").innerHTML = "";
          document
            .querySelectorAll(".word")
            .forEach(el => el.parentNode.removeChild(el));
          //document.getElementById("words").innerHTML = "";
          score = 0;
          let score_counter = document.querySelector(".score_counter");
          score_counter.innerText = `Your score is: ${score}`;

          renderNewGame(game);
        });
    } else {
      document
        .querySelectorAll(".word")
        .forEach(el => el.parentNode.removeChild(el));

      renderLogin();
    }
  });
}

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
          .then(game => {
            renderNewGame(game);
          });
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
  const loginDiv = document.querySelector("#login");
  loginDiv.style.display = "none";
  const pDiv = document.querySelector("#puzzle");
  pDiv.style.display = "block";
  const pUl = document.querySelector("#words");
  pUl.style.display = "block";

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

// code from WORDFINDGAME///////////
//////////////////////////////////////////////////
////////////////////////////////////////////////

/**
 * Wordfind.js 0.0.1
 * (c) 2012 Bill, BunKat LLC.
 * Wordfind is freely distributable under the MIT license.
 * For all details and documentation:
 *     http://github.com/bunkat/wordfind
 */

(function(document, $, wordfind) {
  "use strict";

  /**
   * An example game using the puzzles created from wordfind.js. Click and drag
   * to highlight words.
   *
   * WordFindGame requires wordfind.js and jQuery.
   */

  /**
   * Draws the puzzle by inserting rows of buttons into el.
   *
   * @param {String} el: The jQuery element to write the puzzle to
   * @param {[[String]]} puzzle: The puzzle to draw
   */
  var drawPuzzle = function(el, puzzle) {
    var output = "";
    // for each row in the puzzle
    for (var i = 0, height = puzzle.length; i < height; i++) {
      // append a div to represent a row in the puzzle
      var row = puzzle[i];
      output += "<div>";
      // for each element in that row
      for (var j = 0, width = row.length; j < width; j++) {
        // append our button with the appropriate class
        output += '<button class="puzzleSquare" x="' + j + '" y="' + i + '">';
        output += row[j] || "&nbsp;";
        output += "</button>";
      }
      // close our div that represents a row
      output += "</div>";
    }

    $(el).html(output);
  };

  var getWords = function() {
    return $("input.word")
      .toArray()
      .map(wordEl => wordEl.value.toLowerCase())
      .filter(word => word);
  };

  /**
   * Given two points, ensure that they are adjacent and determine what
   * orientation the second point is relative to the first
   *
   * @param {int} x1: The x coordinate of the first point
   * @param {int} y1: The y coordinate of the first point
   * @param {int} x2: The x coordinate of the second point
   * @param {int} y2: The y coordinate of the second point
   */
  var calcOrientation = function(x1, y1, x2, y2) {
    for (var orientation in wordfind.orientations) {
      var nextFn = wordfind.orientations[orientation];
      var nextPos = nextFn(x1, y1, 1);

      if (nextPos.x === x2 && nextPos.y === y2) {
        return orientation;
      }
    }

    return null;
  };

  /**
   * Initializes the WordFindGame object.
   *
   * Creates a new word find game and draws the board and words.
   *
   * Returns the puzzle that was created.
   *
   * @param {String} puzzleEl: Selector to use when inserting the puzzle
   * @param {Options} options: WordFind options to use when creating the puzzle
   */
  var WordFindGame = function(puzzleEl, options) {
    // Class properties, game initial config:
    var wordList, puzzle;

    /**
     * Game play events.
     *
     * The following events handle the turns, word selection, word finding, and
     * game end.
     *
     */

    // Game state
    var startSquare,
      selectedSquares = [],
      curOrientation,
      curWord = "";

    /**
     * Event that handles mouse down on a new square. Initializes the game state
     * to the letter that was selected.
     *
     */
    var startTurn = function() {
      $(this).addClass("selected");
      startSquare = this;
      selectedSquares.push(this);
      curWord = $(this).text();
    };

    var touchMove = function(e) {
      var xPos = e.originalEvent.touches[0].pageX;
      var yPos = e.originalEvent.touches[0].pageY;
      var targetElement = document.elementFromPoint(xPos, yPos);
      select(targetElement);
    };

    var mouseMove = function() {
      select(this);
    };

    /**
     * Event that handles mouse over on a new square. Ensures that the new square
     * is adjacent to the previous square and the new square is along the path
     * of an actual word.
     *
     */
    var select = function(target) {
      // if the user hasn't started a word yet, just return
      if (!startSquare) {
        return;
      }

      // if the new square is actually the previous square, just return
      var lastSquare = selectedSquares[selectedSquares.length - 1];
      if (lastSquare == target) {
        return;
      }

      // see if the user backed up and correct the selectedSquares state if
      // they did
      var backTo;
      for (var i = 0, len = selectedSquares.length; i < len; i++) {
        if (selectedSquares[i] == target) {
          backTo = i + 1;
          break;
        }
      }

      while (backTo < selectedSquares.length) {
        $(selectedSquares[selectedSquares.length - 1]).removeClass("selected");
        selectedSquares.splice(backTo, 1);
        curWord = curWord.substr(0, curWord.length - 1);
      }

      // see if this is just a new orientation from the first square
      // this is needed to make selecting diagonal words easier
      var newOrientation = calcOrientation(
        $(startSquare).attr("x") - 0,
        $(startSquare).attr("y") - 0,
        $(target).attr("x") - 0,
        $(target).attr("y") - 0
      );

      if (newOrientation) {
        selectedSquares = [startSquare];
        curWord = $(startSquare).text();
        if (lastSquare !== startSquare) {
          $(lastSquare).removeClass("selected");
          lastSquare = startSquare;
        }
        curOrientation = newOrientation;
      }

      // see if the move is along the same orientation as the last move
      var orientation = calcOrientation(
        $(lastSquare).attr("x") - 0,
        $(lastSquare).attr("y") - 0,
        $(target).attr("x") - 0,
        $(target).attr("y") - 0
      );

      // if the new square isn't along a valid orientation, just ignore it.
      // this makes selecting diagonal words less frustrating
      if (!orientation) {
        return;
      }

      // finally, if there was no previous orientation or this move is along
      // the same orientation as the last move then play the move
      if (!curOrientation || curOrientation === orientation) {
        curOrientation = orientation;
        playTurn(target);
      }
    };

    /**
     * Updates the game state when the previous selection was valid.
     *
     * @param {el} square: The jQuery element that was played
     */
    var playTurn = function(square) {
      // make sure we are still forming a valid word
      for (var i = 0, len = wordList.length; i < len; i++) {
        if (wordList[i].indexOf(curWord + $(square).text()) === 0) {
          $(square).addClass("selected");
          selectedSquares.push(square);
          curWord += $(square).text();
          break;
        }
      }
    };

    /**
     * Event that handles mouse up on a square. Checks to see if a valid word
     * was created and updates the class of the letters and word if it was. Then
     * resets the game state to start a new word.
     *
     */

    var endTurn = function() {
      // see if we formed a valid word
      for (var i = 0, len = wordList.length; i < len; i++) {
        if (wordList[i] === curWord) {
          $(".selected").addClass("found");
          wordList.splice(i, 1);
          $('input.word[value="' + curWord + '"]').addClass("wordFound");
          score += 10;
          let score_counter = document.querySelector(".score_counter");
          score_counter.innerText = `Your score is: ${score}`;
        }

        if (wordList.length === 0) {
          $(".puzzleSquare").addClass("complete");

          fetch(GAME_URL + `/${gameID}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ score: score })
          })
            .then(resp => resp.json())
            .then(data => {
              userID = data.id;
              score_alert(data);
            });
        }
      }

      // reset the turn
      $(".selected").removeClass("selected");
      startSquare = null;
      selectedSquares = [];
      curWord = "";
      curOrientation = null;
    };

    /* Constructor START */
    $("input.word").removeClass("wordFound");

    // Class properties, game initial config:
    wordList = getWords().sort();
    puzzle = wordfind.newPuzzleLax(wordList, options);

    // Draw all of the words
    drawPuzzle(puzzleEl, puzzle);

    // attach events to the buttons
    // optimistically add events for windows 8 touch
    if (window.navigator.msPointerEnabled) {
      $(".puzzleSquare").on("MSPointerDown", startTurn);
      $(".puzzleSquare").on("MSPointerOver", select);
      $(".puzzleSquare").on("MSPointerUp", endTurn);
    } else {
      $(".puzzleSquare").mousedown(startTurn);
      $(".puzzleSquare").mouseenter(mouseMove);
      $(".puzzleSquare").mouseup(endTurn);
      $(".puzzleSquare").on("touchstart", startTurn);
      $(".puzzleSquare").on("touchmove", touchMove);
      $(".puzzleSquare").on("touchend", endTurn);
    }

    /**
     * Solves an existing puzzle.
     *
     * @param {[[String]]} puzzle: The puzzle to solve
     */
    this.solve = function() {
      var solution = wordfind.solve(puzzle, wordList).found;

      for (var i = 0, len = solution.length; i < len; i++) {
        var word = solution[i].word,
          orientation = solution[i].orientation,
          x = solution[i].x,
          y = solution[i].y,
          next = wordfind.orientations[orientation];

        var wordEl = $('input.word[value="' + word + '"]');
        if (!wordEl.hasClass("wordFound")) {
          for (var j = 0, size = word.length; j < size; j++) {
            var nextPos = next(x, y, j);
            $('[x="' + nextPos.x + '"][y="' + nextPos.y + '"]').addClass(
              "solved"
            );
          }

          wordEl.addClass("wordFound");
        }
      }
    };
  };

  WordFindGame.emptySquaresCount = function() {
    var allSquares = $(".puzzleSquare").toArray();
    return (
      allSquares.length - allSquares.filter(b => b.textContent.trim()).length
    );
  };

  // Static method
  WordFindGame.insertWordBefore = function(el, word) {
    $(
      '<li><input class="word" value="' + (word || "") + '"></li>'
    ).insertBefore(el);
  };

  /**
   * Allow game to be used within the browser
   */
  window.WordFindGame = WordFindGame;
})(document, jQuery, wordfind);
