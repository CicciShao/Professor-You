// Cars driving left to right 🚗
// Click the canvas to add a new car.

const LANES = 4; // number of lanes on the road

let roadTop, laneH;
let cars = [];
let carColors = [
  "#e63946", // red
  "#f4a261", // orange
  "#2a9d8f", // teal
  "#457b9d", // blue
  "#e9c46a", // yellow
  "#9b5de5", // purple
  "#f8f9fa", // white
];

function setup() {
  createCanvas(800, 500);
  roadTop = height * 0.45; // where the road begins
  laneH = (height - roadTop) / LANES;

  // Start with one car per lane
  for (let i = 0; i < LANES; i++) {
    cars.push(new Car(i));
  }
}

function draw() {
  drawSky();
  drawRoad();

  for (let car of cars) {
    car.update();
    car.show();
  }
}

function mousePressed() {
  cars.push(new Car(floor(random(LANES))));
}

class Car {
  constructor(lane) {
    this.lane = lane;
    this.h = laneH * 0.55; // car height
    this.w = this.h * random(1.9, 2.4); // car length
    this.x = random(-width, -this.w); // start off-screen left
    this.speed = random(2, 6); // px per frame, left -> right
    this.color = random(carColors);
    this.y = roadTop + laneH * (lane + 0.5) - this.h / 2;
    this.wheelPhase = random(TWO_PI);
  }

  update() {
    this.x += this.speed;
    // Wrap around: re-enter from the left edge once fully off-screen right
    if (this.x > width + 10) {
      this.x = -this.w - random(0, 200);
      this.speed = random(2, 6);
      this.color = random(carColors);
    }
    this.wheelPhase += this.speed * 0.1;
  }

  show() {
    push();
    translate(this.x, this.y);

    // Body
    noStroke();
    fill(this.color);
    rect(0, this.h * 0.25, this.w, this.h * 0.55, this.h * 0.15);

    // Cabin
    fill(this.color);
    rect(this.w * 0.22, 0, this.w * 0.42, this.h * 0.45, this.h * 0.12);

    // Windows
    fill(174, 217, 240);
    rect(this.w * 0.26, this.h * 0.07, this.w * 0.34, this.h * 0.3, 3);

    // Headlight
    fill(255, 240, 150);
    rect(this.w - this.h * 0.12, this.h * 0.42, this.h * 0.12, this.h * 0.12, 2);

    // Wheels
    fill(30);
    let wheelY = this.h * 0.8;
    let r = this.h * 0.22;
    for (let wx of [this.w * 0.22, this.w * 0.78]) {
      ellipse(wx, wheelY, r * 2);
      // Spokes so the wheels appear to spin
      stroke(200);
      strokeWeight(2);
      let a = this.wheelPhase;
      line(
        wx,
        wheelY,
        wx + cos(a) * r * 0.7,
        wheelY + sin(a) * r * 0.7
      );
      noStroke();
    }

    pop();
  }
}

function drawSky() {
  // Gradient-ish sky
  noStroke();
  for (let y = 0; y < roadTop; y++) {
    let t = y / roadTop;
    fill(lerpColor(color(120, 180, 240), color(200, 230, 255), t));
    rect(0, y, width, 1);
  }

  // Sun
  fill(255, 220, 90);
  circle(width * 0.85, roadTop * 0.25, 60);

  // Clouds (static)
  fill(255, 255, 255, 220);
  for (let [cx, cy, s] of [
    [width * 0.2, roadTop * 0.3, 1],
    [width * 0.5, roadTop * 0.18, 0.8],
    [width * 0.7, roadTop * 0.4, 0.6],
  ]) {
    circle(cx, cy, 40 * s);
    circle(cx + 25 * s, cy + 5 * s, 30 * s);
    circle(cx - 25 * s, cy + 8 * s, 26 * s);
  }
}

function drawRoad() {
  // Grass
  noStroke();
  fill(106, 190, 105);
  rect(0, roadTop - 20, width, 20);

  // Asphalt
  fill(70);
  rect(0, roadTop, width, height - roadTop);

  // Lane dividers
  stroke(240);
  strokeWeight(4);
  for (let i = 1; i < LANES; i++) {
    let y = roadTop + laneH * i;
    for (let x = 10; x < width; x += 50) {
      line(x, y, x + 25, y);
    }
  }
  noStroke();
}
