const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
if(window.innerHeight <= window.innerWidth){
  canvas.height = window.innerHeight * 0.8;
  canvas.width = window.innerHeight * 0.8;
}
else if(window.innerHeight > window.innerWidth){
  canvas.height = window.innerWidth * 0.8;
  canvas.width = window.innerWidth * 0.8;
}
const boxColor = ["rgb(255, 227, 227)", "rgb(255, 220, 227)", "rgb(255, 242, 217)", "rgb(255, 255, 227)", "rgb(227, 255, 227)", "rgb(227, 255, 255)", "rgb(227, 227, 255)", "rgb(217, 227, 255)", "rgb(238, 227, 255)"];
let a = 2;
let xMid = canvas.height / 2 - canvas.height / 6;
let yMid = canvas.height / 2 - canvas.height / 6;
let gameOver = false;
let currentSprite;
let currentZone;
let score = 0;

function displayScore() {
  document.getElementById("score").innerHTML = score;
}

function loss() {
  gameOver = true;
  document.getElementById("score").innerHTML = "";
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height + 5);
  ctx.fillStyle = "white"
  ctx.font = `30px sans-serif`;
  const textWidth = ctx.measureText("Score: " + score).width;
  ctx.fillText("Score: " + score, canvas.width / 2 - textWidth / 2, canvas.height / (9 / 4));
  ctx.font = '12px sans-serif';
  const textWidth2 = ctx.measureText("Press SPACE or tap screen to Continue").width;
  ctx.fillText("Press SPACE or tap screen to Continue", canvas.width / 2 - textWidth2 / 2, canvas.height / (7 / 4));
}

class Sprite {
  constructor(x, y, length, width, direction, color) {
    this.x = x;
    this.y = y;
    this.length = length;
    this.width = width;
    this.direction = direction;
    this.color = color;
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.length, this.width);
  }
  move() {
    if (this.direction === "down") {
      this.y += canvas.height / 40;
    }
    if (this.direction === "up") {
      this.y -= canvas.height / 40;
    }
    if (this.y >= canvas.height - this.width) {
      this.direction = "up";
    }
    if (this.y <= 0) {
      this.direction = "down";
    }
    if (this.direction === "right") {
      this.x += canvas.width / 40;
    }
    if (this.direction === "left") {
      this.x -= canvas.width / 40;
    }
    if (this.x >= canvas.width - this.length) {
      this.direction = "left";
    }
    if (this.x <= 0) {
      this.direction = "right";
    }

  }
  drop() {
    if (this.x >= currentZone.x) {
      this.length = currentZone.x + currentZone.length - this.x;
      if (currentZone.x + currentZone.length < this.x) { loss(); }
    }
    if (this.x <= currentZone.x) {
      this.length = this.x + this.length - currentZone.x;
      this.x = currentZone.x;
    }
    if (this.y >= currentZone.y) {
      this.width = currentZone.y + currentZone.width - this.y;
      if (currentZone.y + currentZone.width < this.y) { loss(); }
    }
    if (this.y <= currentZone.y) {
      if (this.y + this.width < currentZone.y) { loss(); }
      this.width = this.y + this.width - currentZone.y;
      this.y = currentZone.y;
    }

    if (this.length <= 0 || this.width <= 0) {
      loss();
    }
    else {
      this.genNew(this.x, this.y, this.length, this.width);
      score++;
    }

  }
  genNew(x, y, length, width) {
    if (this.direction === "left" || this.direction === "right") {
      let sprite2 = new Sprite(x, 0, length, width, "down", boxColor[a]); spriteArray.push(sprite2);
    }
    else { let sprite2 = new Sprite(0, y, length, width, "right", boxColor[a]); spriteArray.push(sprite2); }
    a++; if (a > 8) { a = 0 };
  }
}

let spriteArray = [];

function draw() {
  for (let i = 0; i < spriteArray.length; i++) {
    spriteArray[i].draw();
  }
}

function animate() {
  if (gameOver === false) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    currentSprite = spriteArray[spriteArray.length - 1];
    currentZone = spriteArray[spriteArray.length - 2];
    currentSprite.move();
    draw();
    displayScore();
    requestAnimationFrame(animate);
  }
  if (gameOver === true) {
    loss()
  };
}

function startGame() {
  let start = new Sprite(xMid, yMid, canvas.height / 3, canvas.height / 3, "right", boxColor[0]); spriteArray.push(start);
  let sprite1 = new Sprite(0, yMid, canvas.height / 3, canvas.height / 3, "right", boxColor[1]); spriteArray.push(sprite1);
  score = 0;
}

startGame();
animate();

function handleDrop() {
  if (gameOver === false) {
    currentSprite.drop();
  } else {
    spriteArray.length = 0;
    gameOver = false;
    startGame();
    animate();
  }
}

window.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    handleDrop();
  }
});

window.addEventListener('click', () => {
  handleDrop();
});
