class TrackLines {
  boundariesPoints = {};
  apex = {"x": 0, "y": 0};
  constructor(container, trackCorners, band, boundaryTileSize, game) {
    this.container = container;
    this.trackCorners = trackCorners;
    this.band = band;
    this.boundaryTileSize = boundaryTileSize;
    this.game = game;
  }
  getApex () {
    return this.apex;
  }
  getBoundariesPoints () {
    return this.boundariesPoints;
  }
  bezier(t, start, p1, p2, end) {
    let cX = 3 * (p1.x - start.x),
      bX = 3 * (p2.x - p1.x) - cX,
      aX = end.x - start.x - cX - bX;

    let cY = 3 * (p1.y - start.y),
      bY = 3 * (p2.y - p1.y) - cY,
      aY = end.y - start.y - cY - bY;

    let x = aX * Math.pow(t, 3) + bX * Math.pow(t, 2) + cX * t + start.x;
    let y = aY * Math.pow(t, 3) + bY * Math.pow(t, 2) + cY * t + start.y;

    return { x: x, y: y };
  }
  recurveLine(start, end, steps, increment, key, bezierPoints) {
    let n = 0;
    for (let i = 0; i < steps - 1; i++) {
      let point = this.bezier(
        n,
        start,
        bezierPoints[key].p1,
        bezierPoints[key].p2,
        end
      );
      let el = document.getElementById(key + "-side-block-" + i);
      el.style.left = point.x + "px";
      n += increment;
    }
  }
  moveAPoint(positionIncrement, bezierPoints) {
    // move A point
    this.apex.x += positionIncrement;
    let steps = Math.floor((this.trackCorners.right.y - this.apex.y) / this.boundaryTileSize);
    let increment = 1 / steps;

    if (this.game.atCenter) {
      this.container.classList.remove("moving-left", "moving-right");
    } else if (this.apex.x < gameSizes.width / 2) {
      this.container.classList.remove("moving-right");
      this.container.classList.add("moving-left");
    } else {
      this.container.classList.remove("moving-left");
      this.container.classList.add("moving-right");
    }

    for (let key in this.trackCorners) {
      if (key !== "apex") {
        this.recurveLine(this.apex, this.trackCorners[key], steps, increment, key, bezierPoints);
      }
    }
  }
  createSideBlock(point, n, group, opacity) {
    let sideBlock = document.createElement("div");
    const size =
      this.boundaryTileSize + (point.y - this.trackCorners.apex.y) / this.band - 2;
    sideBlock.classList.add("side-block", "side-block-" + group);
    sideBlock.setAttribute("id", group + "-side-block-" + n);
    sideBlock.style.width = size + "px";
    sideBlock.style.height = size + "px";
    sideBlock.style.top = point.y + "px";
    sideBlock.style.opacity = opacity + "%";
    sideBlock.style.left = point.x + "px";
    $game.append(sideBlock);
  }
  initBoundary(from, to, group) {
    // points a to b
    let steps = (to.y - from.y) / this.boundaryTileSize;
    let deltaX = (to.x - from.x) / steps;
    let opacity = 20;
    let _boundariesPoints = [];
    for (let n = 0; n < steps - 1; n++) {
      let point = { x: 0, y: 0 };
      point.x = from.x + deltaX * n;
      point.y = from.y + this.boundaryTileSize * n;
      this.createSideBlock(point, n, group, opacity);
      _boundariesPoints.push(point);
      opacity++;
    }
    return _boundariesPoints;
  }
  initBoundaries() {
    this.apex = {
      "x": this.trackCorners.apex.x,
      "y": this.trackCorners.apex.y
    }
    for (let key in this.trackCorners) {
      if (key !== "apex") {
        this.boundariesPoints[key] = this.initBoundary(
          this.trackCorners.apex,
          this.trackCorners[key],
          key
        );
      }
    }
  }
}
