/**
 * TODO
 * atCenter
 * game must be a class
 */

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

let game = {
  gameIsPaused: false,
  gameInPlay: true,
  gameSizes: gameSizes,
  carSizes: carSizes,
  atCenter: true,
};

let trackLines;
let enemyCar;
let player;

let playerPositions = {
  x: gameSizes.width / 2 - carSizes.width / 2,
  y: gameSizes.height - 2 * carSizes.height,
};

$game = document.getElementById("game");
$game.style.width = gameSizes.width + "px";
$game.style.height = gameSizes.height + "px";
$controls = document.getElementById("controls");
$controls.style.width = gameSizes.width + "px";

document.getElementById("btnRight").addEventListener("click", function () {
  player.actionRight(trackLines.getBoundariesPoints());
});
document.getElementById("btnLeft").addEventListener("click", function () {
  player.actionRight(left);
});

function play() {
  gameInPlay = true;
}

function init() {
  trackLines = new TrackLines(
    document.getElementById("gameWrapper"),
    trackCorners,
    band,
    boundaryTileSize,
    game
  );

  trackLines.initBoundaries();
  trackLines.moveAPoint(0, bezierPoints);

  enemyCar = new EnemyCar(
    document.getElementById("game"),
    carColors,
    carSizes,
    possibleTracks
  );
  enemyCar.createEnemyCars(5, trackLines.getApex());

  player = new Player(
    $game,
    playerPositions,
    carMoveByPixels,
    boundaryTileSize,
    game
  );
}

init();
play();

let maxX = trackCorners.right.x;
let minX = trackCorners.left.x;
let direction = 1;

let stop = false;
let countStopReset = 115;
let countStop = countStopReset;

let otherCarSpeed = 1;
let clockCounter = 0;
let lineDivider = 8;
let dividerCounter = 0;

// make tracks move
let movingTracks = setInterval(function () {
  dividerCounter++;
  $game.setAttribute("class", "divider-" + (dividerCounter % lineDivider));
  if (dividerCounter == 100) {
    dividerCounter = 0;
  }
}, 100);

let gameTick = setInterval(function () {
  clockCounter++;
  let X = trackLines.getApex().x;
  if (X > maxX) {
    direction = -5;
  }
  if (X < minX) {
    direction = 5;
  }

  game.atCenter = gameSizes.width / 2 - 10 < X && X < gameSizes.width / 2 + 10;

  for (i = 0; i < enemyCar.cars.length; i++) {
    enemyCar.moveEnemyCar(
      i,
      clockCounter % otherCarSpeed == 0,
      trackLines.getApex(),
      band
    );
  }

  countStop--;

  if (countStop < 0) {
    stop = !stop;
    countStop = countStopReset;
  }
  if (!stop) {
    X += direction;
    trackLines.moveAPoint(direction, bezierPoints);
  }
  if (clockCounter == 100) {
    clockCounter = 0;
  }
}, 100);

window.addEventListener("keydown", function (e) {
  if (e.code == "ArrowRight") {
    player.actionRight(trackLines.getBoundariesPoints());
  } else if (e.code == "ArrowLeft") {
    player.actionLeft(trackLines.getBoundariesPoints());
  }
});

let flipImage = false;
let flipImageSpeed = 200;
function flipCarImage() {
  flipImage = !flipImage;
  if (flipImage) {
    document.body.classList.add("flip-image");
  } else {
    document.body.classList.remove("flip-image");
  }
}

let flipInterval = setInterval(flipCarImage, flipImageSpeed);
