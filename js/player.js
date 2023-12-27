class Player {
  constructor(carMoveByPixels, game) {
    this.possibleCarPaths = possibleCarPaths;
    this.carMoveByPixels = carMoveByPixels;
    this.game = game;
    this.playerPositions = {
      x: this.game.gameSizes.width / 2 - this.game.carSizes.width / 2,
      y: this.game.gameSizes.height - 2 * this.game.carSizes.height,
    };

    this.player = document.createElement("div");
    this.player.classList.add("car", "player");
    this.player.style.width = this.game.carSizes.width + "px";
    this.player.style.height = this.game.carSizes.height + "px";
    this.player.style.left = this.playerPositions.x + "px";
    this.player.style.top = this.playerPositions.y + "px";
    this.player.setAttribute("image_index", 0);
    this.game.container.append(this.player);
  }
  action(foo, param) {
    if (this.game.gameIsPaused || !this.game.gameInPlay) {
      return;
    }
    foo(param);
  }
  isOverlap(a, b) {
    return !(
      b.x > a.x + a.width ||
      b.y > a.y + a.height ||
      a.x > b.x + b.width ||
      a.y > b.y + b.height
    );
  }
  actionRight(boundariesPoints) {
    return this.moveRL(this.carMoveByPixels + this.game.currentSpeed, boundariesPoints);
  }
  actionLeft(boundariesPoints) {
    return this.moveRL(-this.carMoveByPixels + this.game.currentSpeed, boundariesPoints);
  }
  isSideCrash(data) {
    for (let i = 0; i < data.length; i++) {
      if (
        this.isOverlap(
          {
            x: this.playerPositions.x,
            y: this.playerPositions.y,
            width: this.game.carSizes.width,
            height: this.game.carSizes.height,
          },
          {
            x: data[i].x,
            y: data[i].y,
            width: 1, // old boundaryTileSize
            height: 1,
          }
        )
      ) {
        return true;
      }
    }
  }
  moveRL(direction, boundariesPoints) {
    if (this.game.gameIsPaused || !this.game.gameInPlay) {
      return false;
    }
    if (direction < 0) {
      if (
        this.player.style.left == "0px" ||
        this.isSideCrash(boundariesPoints.left)
      ) {
        return false;
      }
    } else if (direction > 0) {
      if (
        this.playerPositions.x >=
          this.game.gameSizes.width - this.game.carSizes.width ||
        this.isSideCrash(boundariesPoints.right)
      ) {
        return false;
      }
    }
    this.playerPositions.x = this.playerPositions.x + direction + (direction > 0 ? this.game.currentSpeed : -this.game.currentSpeed);
    this.player.style.left = this.playerPositions.x + "px";
    return true;
  }
}
