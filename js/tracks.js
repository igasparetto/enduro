class TrackLines {
  boundariesPoints = {};
  trackCorners = {};
  apex = { x: 0, y: 0 };
  steps = 0;
  correction = 25;

  constructor(container, game) {
    this.container = container;
    this.game = game;
    this.innitTrackCorners();
    this.innitBezierPoints();
    this.band = ((2 / 3) * this.game.gameSizes.height) / 5;
  }
  getApex() {
    return this.apex;
  }
  getBoundariesPoints() {
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
  recurveLine(start, end, increment, key) {
    let n = 0;
    for (let i = 0; i < this.steps - 1; i++) {
      let point = this.bezier(
        n,
        start,
        this.bezierPoints[key].p1,
        this.bezierPoints[key].p2,
        end
      );
      let el = document.getElementById(key + "-side-block-" + i);
      if(el) {
        el.style.left = point.x + "px";
      }
      n += increment;
    }
  }
  moveAPoint(positionIncrement) {
    // move A point
    this.apex.x += positionIncrement;

    let increment = 1 / this.steps;

    for (let key in this.trackCorners) {
      if (key !== "apex") {
        this.recurveLine(this.apex, this.trackCorners[key], increment, key);
      }
    }
  }
  createSideBlock(point, n, group, opacity) {
    let sideBlock = document.createElement("div");
    sideBlock.classList.add("band-" +  Math.floor(point.y / this.band), "side-block", "side-block-" + group);
    sideBlock.setAttribute("id", group + "-side-block-" + n);
    sideBlock.style.width = point.width + "px";
    sideBlock.style.height = point.height + "px";
    sideBlock.style.top = point.y + "px";
    sideBlock.style.opacity = opacity + "%";
    sideBlock.style.left = point.x + "px";
    this.game.container.append(sideBlock);
  }
  isOverlap(previous, subject) {
    return previous.y + previous.height > subject.y;
  }
  initBoundary(from, to, group) {
    // points a to b
    let steps = to.y - from.y;
    let deltaX = (to.x - from.x) / steps;
    let opacity = 1;
    let _boundariesPoints = [];
    // only create points that don't overlap
    let previousPoint = false;
    for (let n = 0; n < steps - 1; n++) {
      let point = { x: 0, y: 0 };
      let size;
      point.x = from.x + deltaX * n;
      point.y = from.y + n;
      size = (point.y - this.trackCorners.apex.y) / this.band;
      if(size < 1)
        size = 1;
      point.width = size;
      point.height = size;
      point.print = previousPoint === false || !this.isOverlap(previousPoint, point);

      _boundariesPoints.push(point);
      if(point.print){
        this.createSideBlock(point, n, group, opacity);
        previousPoint = point;
      }
      opacity++;
    }
    return _boundariesPoints;
  }
  initBoundaries() {
    this.apex = {
      x: this.trackCorners.apex.x,
      y: this.trackCorners.apex.y,
    };
    for (let key in this.trackCorners) {
      if (key !== "apex") {
        this.boundariesPoints[key] = this.initBoundary(
          this.trackCorners.apex,
          this.trackCorners[key],
          key
        );
      }
    }
    this.steps = Math.floor(this.trackCorners.right.y - this.apex.y);
  }
  innitTrackCorners() {
    let fifthOfWidth = this.game.gameSizes.width / 5;
    this.trackCorners = {
      apex: {
        // top corner
        x: this.game.gameSizes.width / 2,
        y: this.game.gameSizes.height / 3,
      },
      left: {
        // left corner
        x: fifthOfWidth,
        y: this.game.gameSizes.height,
      },
      right: {
        // right corner
        x: this.game.gameSizes.width - fifthOfWidth,
        y: this.game.gameSizes.height,
      },
      centerTrack: {
        // center track
        x: this.game.gameSizes.width / 2,
        y: this.game.gameSizes.height,
      },
      leftTrack: {
        // left track
        x:
          fifthOfWidth +
          (this.game.gameSizes.width - fifthOfWidth - fifthOfWidth) / 4,
        y: this.game.gameSizes.height,
      },
      rightTrack: {
        // right track
        x:
          fifthOfWidth +
          3 * ((this.game.gameSizes.width - fifthOfWidth - fifthOfWidth) / 4),
        y: this.game.gameSizes.height,
      },
    };
  }
  innitBezierPoints() {
    let halfWidth = this.game.gameSizes.width / 2;
    let midHeight = (this.trackCorners.apex.y + this.game.gameSizes.height) / 2;
    this.bezierPoints = {
      right: {
        p1: {
          x: (this.trackCorners.right.x + halfWidth) / 2 - this.correction,
          y: midHeight,
        },
        p2: {
          x: (this.trackCorners.right.x + halfWidth) / 2 + this.correction,
          y: midHeight,
        },
      },
      centerTrack: {
        p1: {
          x: (this.trackCorners.centerTrack.x + halfWidth) / 2,
          y: midHeight,
        },
        p2: {
          x: (this.trackCorners.centerTrack.x + halfWidth) / 2,
          y: midHeight,
        },
      },
      left: {
        p1: {
          x: (this.trackCorners.left.x + halfWidth) / 2 + this.correction,
          y: midHeight,
        },
        p2: {
          x: (this.trackCorners.left.x + halfWidth) / 2 - this.correction,
          y: midHeight,
        },
      },
      leftTrack: {
        p1: {
          x: this.trackCorners.leftTrack.x + 2.2 * this.correction,
          y: midHeight,
        },
        p2: {
          x: this.trackCorners.leftTrack.x + 1.5 * this.correction,
          y: midHeight,
        },
      },
      rightTrack: {
        p1: {
          x: this.trackCorners.rightTrack.x - 2.2 * this.correction,
          y: midHeight,
        },
        p2: {
          x: this.trackCorners.rightTrack.x - 1.5 * this.correction,
          y: midHeight,
        },
      },
    };
  }
}
