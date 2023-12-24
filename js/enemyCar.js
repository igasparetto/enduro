class EnemyCar {
  cars = [];
  constructor(container, carColors, carSizes, possibleTracks) {
    this.container = container;
    this.carColors = carColors;
    this.carSizes = carSizes;
    this.possibleTracks = possibleTracks;
  }
  createEnemyCar(position) {
    let track = possibleTracks[this.random(0, 2)];
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
      }, i * 1900)
    }
  }
  moveEnemyCar(carIndex, down, position, band) {
    let track = this.cars[carIndex].getAttribute("track");
    let index = parseInt(this.cars[carIndex].getAttribute("index"));
    let point = document.getElementById(track + "-side-block-" + index);
    if (!point) {
      index = 0;
      track = possibleTracks[this.random(0, 2)];
      this.cars[carIndex].setAttribute("index", index);
      this.cars[carIndex].setAttribute("track", track);
      this.cars[carIndex].style.width = "1px";
      this.cars[carIndex].style.height = (this.carSizes.height / this.carSizes.width) + "px";
      this.cars[carIndex].setAttribute(
        "class",
        "car enemy " + this.carColors[this.random(1, this.carColors.length - 1)]
      );
      return;
    }
    let y = parseFloat(point.style.top);
    let size = 0.25 * this.carSizes.width * ((y - position.y) / band);
    let x = parseFloat(point.style.left) - size / 2;
    this.cars[carIndex].style.left = x + "px";
    this.cars[carIndex].style.width = size + "px";
    this.cars[carIndex].style.height = size * (this.carSizes.height / this.carSizes.width) + "px";
    if (down) {
      index++;
      this.cars[carIndex].style.top = y + "px";
      this.cars[carIndex].setAttribute("index", index);
    }
  }
  random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}

