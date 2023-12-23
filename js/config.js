// Cars
let carSizes = { width: 66, height: 22 };
let gameSizes = { width: carSizes.width * 10, height: carSizes.height * 14 };
let carMoveByPixels = 8;

// Tracks
let boundaryTileSize = 3;
let trackCorners = {
  apex: {
    // top corner
    x: gameSizes.width / 2,
    y: gameSizes.height / 3,
  },
  left: {
    // left corner
    x: gameSizes.width / 5,
    y: gameSizes.height,
  },
  right: {
    // right corner
    x: gameSizes.width - gameSizes.width / 5,
    y: gameSizes.height,
  },
  centerTrack: {
    // center track
    x: gameSizes.width / 2,
    y: gameSizes.height,
  },
  leftTrack: {
    // left track
    x:
      gameSizes.width / 5 +
      (gameSizes.width - gameSizes.width / 5 - gameSizes.width / 5) / 4,
    y: gameSizes.height,
  },
  rightTrack: {
    // right track
    x:
      gameSizes.width / 5 +
      3 * ((gameSizes.width - gameSizes.width / 5 - gameSizes.width / 5) / 4),
    y: gameSizes.height,
  },
};
let correction = 25;
let midHeight = (trackCorners.apex.y + gameSizes.height) / 2;
let bezierPoints = {
  right: {
    p1: {
      x: (trackCorners.right.x + gameSizes.width / 2) / 2 - correction,
      y: midHeight,
    },
    p2: {
      x: (trackCorners.right.x + gameSizes.width / 2) / 2 + correction,
      y: midHeight,
    },
  },
  centerTrack: {
    p1: {
      x: (trackCorners.centerTrack.x + gameSizes.width / 2) / 2,
      y: midHeight,
    },
    p2: {
      x: (trackCorners.centerTrack.x + gameSizes.width / 2) / 2,
      y: midHeight,
    },
  },
  left: {
    p1: {
      x: (trackCorners.left.x + gameSizes.width / 2) / 2 + correction,
      y: midHeight,
    },
    p2: {
      x: (trackCorners.left.x + gameSizes.width / 2) / 2 - correction,
      y: midHeight,
    },
  },
  leftTrack: {
    p1: {
      x: trackCorners.leftTrack.x + 2.2 * correction,
      y: midHeight,
    },
    p2: {
      x: trackCorners.leftTrack.x + 1.5 * correction,
      y: midHeight,
    },
  },
  rightTrack: {
    p1: {
      x: trackCorners.rightTrack.x - 2.2 * correction,
      y: midHeight,
    },
    p2: {
      x: trackCorners.rightTrack.x - 1.5 * correction,
      y: midHeight,
    },
  },
};
let band = ((2 / 3) * gameSizes.height) / 5;

// Enemy Cars
let carColors = [
  ["grey"],
  ["orange"],
  ["blue"],
  ["green"],
  ["purple"],
  ["yellow"],
  ["pink"],
  ["red"],
];
let possibleTracks = ["leftTrack", "centerTrack", "rightTrack"];
