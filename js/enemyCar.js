class EnemyCar {
  cars = [];
  containerHeight = 0;
  constructor(container, carColors, carSizes, possibleCarPaths) {
    this.container = container;
    this.carColors = carColors;
    this.carSizes = carSizes;
    this.possibleCarPaths = possibleCarPaths;
    this.containerHeight = parseInt(this.container.style.height);
  }
  createEnemyCar(position) {
    let track = possibleCarPaths[this.random(0, 2)];
    let enemy = document.createElement("div");
    enemy.classList.add(
      "car",
      "enemy",
      carColors[this.random(1, carColors.length - 1)]
    );
    enemy.style.width = "1px";
    enemy.style.height = (this.carSizes.height / this.carSizes.width) + "px";
    enemy.style.left = position.x + "px";
    enemy.style.top = position.y + "px";
    enemy.setAttribute("index", 0);
    enemy.setAttribute("track", track);
    this.container.append(enemy);
    return enemy;
  }
  createEnemyCars (n = 5, position) {
    let _this = this;
    for(var i = 0; i < n; i++) {
      setTimeout(function() {
        _this.cars.push(_this.createEnemyCar(position))
      }, i * 2500)
    }
  }
  getNextIndex(index, points, direction) {
    if(direction > 0) {
      for(var i = index + 1; i < points.length; i++) {
        if(points[i].print) {
          return i;
        }
      }
    } else {
      for(var i = index - 1; i > 0; i--) {
        if(points[i].print) {
          return i;
        }
      }
    }
    return false;
  }
  moveEnemyCar(carIndex, down, apex, band, points, direction) {
    let index = parseInt(this.cars[carIndex].getAttribute("index"));
    let carPoints = points[this.cars[carIndex].getAttribute("track")];
    let nextPositionIndex = this.getNextIndex(index, carPoints, direction);
    let refSideBlock = document.getElementById(this.cars[carIndex].getAttribute("track") + "-side-block-" + nextPositionIndex);
    let size, y, x;
    let h = (this.carSizes.height / this.carSizes.width);
    if (!refSideBlock) {
      this.cars[carIndex].setAttribute("index", 0);
      this.cars[carIndex].setAttribute("track", possibleCarPaths[this.random(0, 2)]);
      this.cars[carIndex].style.width = "1px";
      this.cars[carIndex].style.height = h + "px";
      this.cars[carIndex].setAttribute(
        "class",
        "car enemy " + this.carColors[this.random(1, this.carColors.length - 1)]
      );
      return {
        x: apex.x,
        y: apex.y,
        width: 1,
        height: h
      };
    }
    y = parseFloat(refSideBlock.style.top);
    size = 0.25 * this.carSizes.width * ((y - apex.y) / band);
    x = parseFloat(refSideBlock.style.left) - size / 2;
    h = size * h;
    this.cars[carIndex].style.left = x + "px";
    this.cars[carIndex].style.width = size + "px";
    this.cars[carIndex].style.height = h + "px";
    if (down) {
      index++;
      this.cars[carIndex].style.top = y + "px";
      this.cars[carIndex].setAttribute("index", nextPositionIndex);
    }
 
    return {
      x: x,
      y: y,
      width: size,
      height: h
    };
  }
  random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}

