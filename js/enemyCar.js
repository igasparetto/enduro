class EnemyCar {
  otherCars = [];
  constructor(container, carColors, carSizes, possibleTracks) {
    this.container = container;
    this.carColors = carColors;
    this.carSizes = carSizes;
    this.possibleTracks = possibleTracks;
  }
  createEnemyCar(position) {
    let track = possibleTracks[this.random(0, 2)];
    let otherCar = document.createElement("div");
    otherCar.classList.add(
      "car",
      "otherCar",
      carColors[this.random(1, carColors.length - 1)]
    );
    otherCar.style.width = "1px";
    otherCar.style.height = (this.carSizes.height / this.carSizes.width) + "px";
    otherCar.style.left = position.x + "px";
    otherCar.style.top = position.y + "px";
    otherCar.setAttribute("index", 0);
    otherCar.setAttribute("track", track);
    this.container.append(otherCar);
    return otherCar;
  }
  createEnemyCars (n = 5, position) {
    let _this = this;
    for(var i = 0; i < n; i++) {
      setTimeout(function() {
        _this.otherCars.push(_this.createEnemyCar(position))
      }, i * 1900)
    }
  }
  moveOtherCar(carIndex, down, position, band) {
    let track = this.otherCars[carIndex].getAttribute("track");
    let index = parseInt(this.otherCars[carIndex].getAttribute("index"));
    let point = document.getElementById(track + "-side-block-" + index);
    if (!point) {
      index = 0;
      track = possibleTracks[this.random(0, 2)];
      this.otherCars[carIndex].setAttribute("index", index);
      this.otherCars[carIndex].setAttribute("track", track);
      this.otherCars[carIndex].style.width = "1px";
      this.otherCars[carIndex].style.height = (this.carSizes.height / this.carSizes.width) + "px";
      this.otherCars[carIndex].setAttribute(
        "class",
        "car otherCar " + this.carColors[this.random(1, this.carColors.length - 1)]
      );
      return;
    }
    let y = parseFloat(point.style.top);
    let size = 0.25 * this.carSizes.width * ((y - position.y) / band);
    let x = parseFloat(point.style.left) - size / 2;
    this.otherCars[carIndex].style.left = x + "px";
    this.otherCars[carIndex].style.width = size + "px";
    this.otherCars[carIndex].style.height = size * (this.carSizes.height / this.carSizes.width) + "px";
    if (down) {
      index++;
      this.otherCars[carIndex].style.top = y + "px";
      this.otherCars[carIndex].setAttribute("index", index);
    }
  }
  random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}

