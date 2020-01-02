[
  "adorable",
  "comique",
  "curieuse",
  "drole",
  "engagee",
  "enjouee",
  "fidele",
  "futee",
  "radieuse",
  "sensible",
  "sincere",
  "complice",
  "creative",
  "elegante",
  "farceuse",
  "joviale",
  "motivee",
  "ordonnee",
  "prudente",
  "sexy",
  "tendre"
].map(word => WordFindGame.insertWordBefore($("#add-word").parent(), word));
$("#secret-word").val("LAETITIA");
/* Init */
function recreate() {
  $("#result-message").removeClass();
  var fillBlanks, game;
  // if ($("#extra-letters").val() === "none") {
  //   fillBlanks = false;
  // } else if (
  //   $("#extra-letters")
  //     .val()
  //     .startsWith("secret-word")
  // ) {
  //   fillBlanks = $("#secret-word").val();
  // }
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
/* Event listeners */
// $("#extra-letters").change(evt =>
//   $("#secret-word").prop(
//     "disabled",
//     !evt.target.value.startsWith("secret-word")
//   )
// );
// $("#add-word").click(() =>
//   WordFindGame.insertWordBefore($("#add-word").parent())
// );
// $("#create-grid").click(recreate);

$("#solve").click(() => game.solve());
