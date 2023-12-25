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
  crash = false;

  currentSpeed = 0;
  gameTickSpeeds = [80, 70, 60, 50, 40, 30, 20, 10];

  maxX;
  minX;

  direction = 1;
  stop = false;
  countStopReset = 100;
  countStop;

  enemyCarSpeed = 1;
  clockCounter = 0;
  lineDivider = 8;
  dividerCounter = 80;

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
    this.triggerEvent(document.body, "gameInit");
    setTimeout(this.speedUp.bind(this), 6000);
  }
  speedChange() {
    clearInterval(this.gameTick);
    this.gameOnMove();
  }
  speedUp() {
    if (this.currentSpeed < this.gameTickSpeeds.length - 1) this.currentSpeed++;
    this.speedChange();
    this.triggerEvent(document.body, "speedUp");
    return this.currentSpeed;
  }
  speedDown() {
    if (this.currentSpeed > 0) this.currentSpeed--;
    this.speedChange();
    this.triggerEvent(document.body, "speedDown");
    return this.currentSpeed;
  }
  gameTickAction() {
    let X = this.trackLines.getApex().x;
    if (X > this.maxX) {
      this.direction = -5;
    }
    if (X < this.minX) {
      this.direction = 5;
    }

    // game tick
    this.clockCounter++;
    // move tracks
    this.dividerCounter++;
    this.container.setAttribute(
      "class",
      "divider-" + (this.dividerCounter % this.lineDivider)
    );
    if (this.dividerCounter == 80) {
      this.dividerCounter = 0;
    }

    this.roadCurving = !(
      this.gameSizes.width / 2 - 10 < X && X < this.gameSizes.width / 2 + 10
    );
    this.curving();

    for (let i = 0; i < this.enemyCar.cars.length; i++) {
      let enemyPositions = this.enemyCar.moveEnemyCar(
        i,
        this.clockCounter % this.enemyCarSpeed == 0,
        this.trackLines.getApex(),
        this.trackLines.band,
        this.trackLines.boundariesPoints,
        this.crash ? -1 : 1 // direction
      );
      if (
        this.player.isOverlap(enemyPositions, {
          x: this.player.playerPositions.x,
          y: this.player.playerPositions.y,
          width: this.carSizes.width,
          height: this.carSizes.height,
        })
      ) {
        this.crash = true;
        this.currentSpeed = 0;
        this.speedChange();
        this.triggerEvent(document.body, "carCrash");
        setTimeout(this.resetCrash.bind(this), 3000);
      }
    }

    this.countStop--;

    if (this.countStop < 0) {
      this.stop = !this.stop;
      this.countStop = this.countStopReset;
    }
    if (!this.stop) {
      X += this.direction;
      this.trackLines.moveAPoint(this.direction);
    }
    if (this.clockCounter == 100) {
      this.clockCounter = 0;
    }
  }
  curving() {
    if (!this.roadCurving) {
      this.triggerEvent(document.body, "notCurving");
    } else if (this.trackLines.apex.x < this.centerWidth) {
      this.triggerEvent(document.body, "curvingRight");
    } else {
      this.triggerEvent(document.body, "curvingLeft");
    }
  }
  resetCrash() {
    this.crash = false;
    this.triggerEvent(document.body, "resetCrash");
  }
  gameOnMove() {
    this.triggerEvent(document.body, "gameOn");
    // make tracks move
    this.gameTick = setInterval(
      this.gameTickAction.bind(this),
      this.gameTickSpeeds[this.currentSpeed]
    );
  }
  play() {
    if (!this.gameInPlay) {
      this.gameInPlay = true;
      this.gameIsPaused = false;
      this.gameOnMove();
    } else if (this.gameIsPaused) {
      this.unPause();
    } else if (this.gameInPlay) {
      this.pause();
    }
  }
  gameOver() {
    this.gameInPlay = false;
    this.gameIsPaused = false;
    this.triggerEvent(document.body, "gameOver");
  }
  pause() {
    this.gameIsPaused = true;
    clearInterval(this.gameTick);
    document.body.classList.add("paused");
    this.triggerEvent(document.body, "gamePaused");
  }
  unPause() {
    this.gameIsPaused = false;
    this.gameOnMove();
    this.triggerEvent(document.body, "gameUnpaused");
  }
  triggerEvent(el, eventType) {
    if (typeof eventType === "string" && typeof el[eventType] === "function") {
      el[eventType]();
    } else {
      const event =
        typeof eventType === "string"
          ? new Event(eventType, { bubbles: true })
          : eventType;
      el.dispatchEvent(event);
    }
  }
  addEventListener(el, eventName, eventHandler, selector) {
    if (selector) {
      const wrappedHandler = (e) => {
        if (!e.target) return;
        const el = e.target.closest(selector);
        if (el) {
          eventHandler.call(el, e);
        }
      };
      el.addEventListener(eventName, wrappedHandler);
      return wrappedHandler;
    } else {
      const wrappedHandler = (e) => {
        eventHandler.call(el, e);
      };
      el.addEventListener(eventName, wrappedHandler);
      return wrappedHandler;
    }
  }
}
