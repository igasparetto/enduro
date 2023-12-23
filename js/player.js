class Player {
  constructor(container, playerPositions, carMoveByPixels, boundaryTileSize, game) {
    this.container = container;
    this.possibleTracks = possibleTracks;
    this.carMoveByPixels = carMoveByPixels;
    this.playerPositions = playerPositions;
    this.boundaryTileSize = boundaryTileSize;
    this.game = game;

    this.player = document.createElement("div");
    this.player.classList.add("car", "player");
    this.player.style.width = this.game.carSizes.width + "px";
    this.player.style.height = this.game.carSizes.height + "px";
    this.player.style.left = playerPositions.x + "px";
    this.player.style.top = playerPositions.y + "px";
    this.player.setAttribute("image_index", 0);
    container.append(this.player);
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
    this.moveRL(this.carMoveByPixels, boundariesPoints);
  }
  actionLeft(boundariesPoints) {
    this.moveRL(-this.carMoveByPixels, boundariesPoints);
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
            width: this.boundaryTileSize,
            height: this.boundaryTileSize,
          }
        )
      ) {
        return true;
      }
    }
  }
  moveRL(direction, boundariesPoints) {
    console.log({direction, boundariesPoints})
    if (this.game.gameIsPaused || !this.game.gameInPlay) {
      console.log(11)
      return false;
    }
    if (direction < 0) {
      if (this.player.style.left == "0px" || this.isSideCrash(boundariesPoints.left)) {
        console.log(12)
        return false;
      }
    } else if (direction > 0) {
      if (
        this.playerPositions.x >= this.game.gameSizes.width - this.game.carSizes.width ||
        this.isSideCrash(boundariesPoints.right)
      ) {
        console.log(13)
        return false;
      }
    }
    console.log(14)
    this.playerPositions.x = this.playerPositions.x + direction;
    this.player.style.left = this.playerPositions.x + "px";
    return true;
  }
}
