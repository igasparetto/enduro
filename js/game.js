class Game {
  container;

  gameIsPaused = false;
  gameInPlay = false;
  roadCurving = false;
  centerWidth = 0;

  gameWidthFitsCars = 10;
  gameHeightFitsCars = 14;

  trackLines;
  enemyCar;
  player;

  currentSpeed = 1;
  gameTickSpeeds = [
    80,
    70,
    60,
    50,
    40,
    30,
    20,
    10
  ]

  maxX;
  minX;

  direction = 1;
  stop = false;
  countStopReset = 100;
  countStop;

  enemyCarSpeed = 1;
  clockCounter = 0;
  lineDivider = 24;
  dividerCounter = 0;

  constructor(container, carSizes) {
    this.container = container;
    this.carSizes = carSizes;
    this.gameSizes = {
      width: carSizes.width * this.gameWidthFitsCars,
      height: carSizes.height * this.gameHeightFitsCars,
    };
    this.centerWidth = this.gameSizes.width / 2;

    container.style.width = this.gameSizes.width + "px";
    container.style.height = this.gameSizes.height + "px";
  }
  init(trackLines, enemyCar, player) {
    this.trackLines = trackLines;
    this.enemyCar = enemyCar;
    this.player = player;

    this.maxX = this.trackLines.trackCorners.right.x;
    this.minX = this.trackLines.trackCorners.left.x;
    this.countStop = this.countStopReset;

    document.body.classList.add("paused");
    document.body.classList.add("speed-1");
  }
  speedUp() {
    if(this.currentSpeed < this.gameTickSpeeds.length-1)
      this.currentSpeed++;
    clearInterval(this.gameTick);
    this.gameOnMove();
    return this.currentSpeed;
  }
  speedDown() {
    if(this.currentSpeed > 0)
      this.currentSpeed--;
    clearInterval(this.gameTick);
    this.gameOnMove();
    return this.currentSpeed;
  }
  gameOnMove() {
    // make tracks move
    let _this = this;
    document.body.classList.remove("paused");

    document.body.classList.remove("speed-1");
    document.body.classList.remove("speed-2");
    document.body.classList.remove("speed-3");
    document.body.classList.remove("speed-4");
    document.body.classList.remove("speed-5");
    document.body.classList.add("speed-" + (this.currentSpeed + 1));

    this.gameTick = setInterval(function () {
      // move tracks
      _this.dividerCounter++;
      _this.container.setAttribute(
        "class",
        "divider-" + (_this.dividerCounter % _this.lineDivider)
      );
      if (_this.dividerCounter == 100) {
        _this.dividerCounter = 0;
      }
      
      // game tick
      _this.clockCounter++;

      let X = _this.trackLines.getApex().x;
      if (X > _this.maxX) {
        _this.direction = -5;
      }
      if (X < _this.minX) {
        _this.direction = 5;
      }

      _this.roadCurving = !(
        _this.gameSizes.width / 2 - 10 < X && X < _this.gameSizes.width / 2 + 10
      );

      for (let i = 0; i < _this.enemyCar.cars.length; i++) {
        _this.enemyCar.moveEnemyCar(
          i,
          _this.clockCounter % _this.enemyCarSpeed == 0,
          _this.trackLines.getApex(),
          _this.trackLines.band
        );
      }

      _this.countStop--;

      if (_this.countStop < 0) {
        _this.stop = !_this.stop;
        this.countStop = _this.countStopReset;
      }
      if (!_this.stop) {
        X += _this.direction;
        _this.trackLines.moveAPoint(_this.direction);
      }
      if (_this.clockCounter == 100) {
        _this.clockCounter = 0;
      }
    }, this.gameTickSpeeds[this.currentSpeed]);
  }
  play() {
    if(!this.gameInPlay) {
      this.gameInPlay = true;
      this.gameIsPaused = false;
      this.gameOnMove();
    } else if(this.gameIsPaused) {
      this.unPause();
    } else if(this.gameInPlay) {
      this.pause();
    }
  }
  gameOver() {
    this.gameInPlay = false;
    this.gameIsPaused = false;
  }
  pause() {
    this.gameIsPaused = true;
    clearInterval(this.gameTick);
    document.body.classList.add("paused");
  }
  unPause() {
    this.gameIsPaused = false;
    this.gameOnMove();
  }
}
