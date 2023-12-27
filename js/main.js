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

var carAudio1 = new Audio('audio/car-running.mp3');
carAudio1.loop = true;
var carAudio2 = new Audio('audio/car-running.mp3');
carAudio2.loop = true;

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

  let moveTick = 100;
  let moveRightInterval = false;
  let startMoveRight = function(event) {
    if(event){
      event.preventDefault();
      event.stopPropagation();
    }
    clearInterval(moveLeftInterval);
    if(!moveRightInterval)
      moveRightInterval = setInterval(moveRight, moveTick);
  }
  let stopMoveRight = function(e) {
    clearInterval(moveRightInterval);
    moveRightInterval = false;
  }

  let moveLeftInterval = false;
  let startMoveLeft = function(event) {
    if(event){
      event.preventDefault();
      event.stopPropagation();
    }
    clearInterval(moveRightInterval);
    if(!moveLeftInterval)
      moveLeftInterval = setInterval(moveLeft, moveTick);
  }
  let stopMoveLeft = function() {
    clearInterval(moveLeftInterval);
    moveLeftInterval = false;
  }

  document.body.classList.add("paused");
  
  control.setButtonEventAction("start", "click", game.play.bind(game));
  control.setButtonEventAction("btnRight", "mousedown", startMoveRight);
  control.setButtonEventAction("btnRight", "mouseup", stopMoveRight);
  control.setButtonEventAction("btnLeft", "mousedown", startMoveLeft);
  control.setButtonEventAction("btnLeft", "mouseup", stopMoveLeft);

  control.setButtonEventAction("btnRight", "touchstart", startMoveRight);
  control.setButtonEventAction("btnRight", "touchend", stopMoveRight);
  control.setButtonEventAction("btnLeft", "touchstart", startMoveLeft);
  control.setButtonEventAction("btnLeft", "touchend", stopMoveLeft);

  control.setKeyboardEventAction("ArrowRight", "keydown", startMoveRight);
  control.setKeyboardEventAction("ArrowRight", "keyup", stopMoveRight);
  control.setKeyboardEventAction("ArrowLeft", "keydown", startMoveLeft);
  control.setKeyboardEventAction("ArrowLeft", "keyup", stopMoveLeft);
  
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
  
  function playSecondCarAudio() {
    // prevents discontinuous audio
    setTimeout(function() {
      carAudio2.play();
    }, 1000);
  }

  game.addEventListener(document.body, "engineStart", function () {
    currentScene = 0; // from scene.js
    years = 1; // from scene.js
    var startingAudio = new Audio('audio/car-starting.mp3');
    startingAudio.loop = false;
    startingAudio.play();
    setTimeout(function() {
      carAudio1.play();
      playSecondCarAudio();
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
    carAudio1.pause();
    carAudio2.pause();
  });
  game.addEventListener(document.body, "gameUnpaused", function () {
    document.body.classList.remove("paused");
    $eventLog.innerHTML = "Game On";
    carAudio1.play();
    playSecondCarAudio()
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
    $points.innerHTML = (game.gamePoints < 10 ? "00" : game.gamePoints < 100 ? "0" : "") + game.gamePoints;
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
