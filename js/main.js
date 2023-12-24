/**
 * TODO
 * roadCurving
 * game must be a class
 */

let $gameContainer = document.getElementById("game");
let game = new Game($gameContainer, carSizes);
let trackLines;
let enemyCar;
let player;
let control;

function init() {
  trackLines = new TrackLines(
    document.getElementById("gameWrapper"),
    boundaryTileSize,
    game
  );
  trackLines.initBoundaries();
  trackLines.moveAPoint(0);

  enemyCar = new EnemyCar(
    $gameContainer,
    carColors,
    carSizes,
    possibleCarPaths
  );
  enemyCar.createEnemyCars(5, trackLines.getApex());

  player = new Player(
    carMoveByPixels,
    boundaryTileSize,
    game
  );

  game.init(trackLines, enemyCar, player);

  control = new Control();
  let moveRight = function () {
    player.actionRight(trackLines.getBoundariesPoints())
  }
  let moveLeft = function () {
    player.actionLeft(trackLines.getBoundariesPoints())
  }
  control.setButtonEventAction("start", "click", game.play.bind(game));
  control.setButtonEventAction("btnRight", "click", moveRight);
  control.setButtonEventAction("btnLeft", "click", moveLeft);
  
  control.setKeyboardEventAction("Space", "keydown", game.play.bind(game));
  control.setKeyboardEventAction("ArrowRight", "keydown", moveRight);
  control.setKeyboardEventAction("ArrowLeft", "keydown", moveLeft);
}
init();

