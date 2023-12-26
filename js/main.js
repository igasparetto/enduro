let $gameContainer = document.getElementById("game");
let $eventLog = document.getElementById("eventLog");
let $start = document.getElementById("start");
let $points = document.getElementById("points");
let $currentSpeed = document.getElementById("currentSpeed");

// expose to global scope (for now)
let game = new Game($gameContainer, carSizes);
let trackLines;
let enemyCar;
let player;
let control;

var carAudio = new Audio('audio/car-running.mp3');
carAudio.loop = true;

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

  player = new Player(10, game);

  game.init(trackLines, enemyCar, player);

  control = new Control();
  let moveRight = function () {
    player.actionRight(trackLines.getBoundariesPoints());
  };
  let moveLeft = function () {
    player.actionLeft(trackLines.getBoundariesPoints());
  };

  document.body.classList.add("paused");
  
  control.setButtonEventAction("start", "click", game.play.bind(game));
  control.setButtonEventAction("btnRight", "click", moveRight);
  control.setButtonEventAction("btnLeft", "click", moveLeft);

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
    $eventLog.innerHTML = "Game On";
  });
  
  game.addEventListener(document.body, "engineStart", function () {
    var startingAudio = new Audio('audio/car-starting.mp3');
    startingAudio.loop = false;
    startingAudio.play();
    setTimeout(function() {
      carAudio.play();
    }, 5900);

    // create the 3 cars
    enemyCar.cars.push(enemyCar.createEnemyCar(trackLines.getApex()));
    setTimeout(function() {
      enemyCar.cars.push(enemyCar.createEnemyCar(trackLines.getApex()))
    }, 3500)
    setTimeout(function() {
      enemyCar.cars.push(enemyCar.createEnemyCar(trackLines.getApex()))
    }, 6000)
  });
  game.addEventListener(document.body, "gamePaused", function () {
    document.body.classList.remove("add");
    $eventLog.innerHTML = "Game Paused";
    carAudio.pause();
  });
  game.addEventListener(document.body, "gameUnpaused", function () {
    document.body.classList.remove("paused");
    $eventLog.innerHTML = "Game On";
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
  game.addEventListener(document.body, "addOne", function () {
    $points.innerHTML = game.gamePoints;
  });
  game.addEventListener(document.body, "addOne", function () {
    $points.innerHTML = game.gamePoints;
  });
  game.addEventListener(document.body, "speedChange", function () {
    $currentSpeed.innerHTML = game.currentSpeed + 1;
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
