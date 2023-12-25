let $gameContainer = document.getElementById("game");
let $eventLog = document.getElementById("eventLog");
let $start = document.getElementById("start");

// expose to global scope (for now)
let game = new Game($gameContainer, carSizes);
let trackLines;
let enemyCar;
let player;
let control;

var carAudio = new Audio('audio/car-running.mp3');
carAudio.loop = false;

function init() {
  trackLines = new TrackLines(document.getElementById("gameWrapper"), game);
  trackLines.initBoundaries();
  trackLines.moveAPoint(0);

  enemyCar = new EnemyCar(
    $gameContainer,
    carColors,
    carSizes,
    possibleCarPaths
  );
  enemyCar.createEnemyCars(5, trackLines.getApex());

  player = new Player(carMoveByPixels, game);

  game.init(trackLines, enemyCar, player);

  control = new Control();
  let moveRight = function () {
    player.actionRight(trackLines.getBoundariesPoints());
  };
  let moveLeft = function () {
    player.actionLeft(trackLines.getBoundariesPoints());
  };

  control.setButtonEventAction("start", "click", game.play.bind(game));
  control.setButtonEventAction("btnRight", "click", moveRight);
  control.setButtonEventAction("btnLeft", "click", moveLeft);

  control.setKeyboardEventAction("Space", "keydown", game.play.bind(game));
  control.setKeyboardEventAction("ArrowRight", "keydown", moveRight);
  control.setKeyboardEventAction("ArrowLeft", "keydown", moveLeft);

  game.addEventListener(document.body, "carCrash", function () {
    var carCrashAudio = new Audio('audio/car-crash.mp3');
    carCrashAudio.loop = false;
    carCrashAudio.play();

    $eventLog.innerHTML = "Car Crashed";

    setTimeout(function () {
      $eventLog.innerHTML = "&nbsp;";
    }, 2000);
  });
  game.addEventListener(document.body, "gameOn", function () {
    $start.innerHTML = "Pause";
    $eventLog.innerHTML = "Game On";
  });
  
  game.addEventListener(document.body, "engineStart", function () {
    var startingAudio = new Audio('audio/car-starting.mp3');
    startingAudio.loop = false;
    startingAudio.play();
    setTimeout(function() {
      carAudio.loop = true;
      carAudio.play();
    }, 5900)
  });
  game.addEventListener(document.body, "gamePaused", function () {
    $start.innerHTML = "Unpause";
    $eventLog.innerHTML = "Game Paused";
    carAudio.loop = false;
    carAudio.pause();
  });
  game.addEventListener(document.body, "gameUnpaused", function () {
    $start.innerHTML = "Pause";
    $eventLog.innerHTML = "Game On";
    carAudio.loop = true;
    carAudio.play();
  });

  game.addEventListener(document.body, "notCurving", function () {
    $gameContainer.classList.remove("curving-left", "curving-right");
  });
  game.addEventListener(document.body, "curvingRight", function () {
    $gameContainer.classList.remove("curving-right");
    $gameContainer.classList.add("curving-left");
  });
  game.addEventListener(document.body, "curvingLeft", function () {
    $gameContainer.classList.remove("curving-left");
    $gameContainer.classList.add("curving-right");
  });

  game.addEventListener(document.body, "gameOn", function () {
    document.body.classList.remove("paused");
    document.body.classList.remove("speed-1");
    document.body.classList.remove("speed-2");
    document.body.classList.remove("speed-3");
    document.body.classList.remove("speed-4");
    document.body.classList.remove("speed-5");
    document.body.classList.add("speed-" + (game.currentSpeed + 1));
  });
}
init();
