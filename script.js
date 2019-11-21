// img source: https://icon-library.net/icon/hero-icon-16.html
// img source: https://icon-library.net/icon/explosion-icon-png-24.html
// img source: https://www.flaticon.com/free-icon/insect_2203229
// img source: https://www.flaticon.com/free-icon/bug_2235682

const bossLive = document.getElementById("boss-live");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const timer = document.getElementById("timer");
const scoreboard = document.getElementById("score");
const livestatus = document.getElementById("live");
const bossOne = {
  x: 450,
  y: 240,
  radius: 20,
  direction: 1,
  live: 30,
  color: "green",
  img: boss1
};

const bossTwo = {
  x: 450,
  y: 240,
  radius: 30,
  direction: 1,
  live: 50,
  color: "yellow",
  img: boss2
};

let bossList = [bossOne, bossTwo];
let bossIndex = 0;
let currentboss = "";

let bossBulletList = [];
let bossBulletX;
let bossBulletY;
let bossTimer = 6000; // 6000 ms

let bulletList = [];
let bulletColor = "green";
let bulletDelay = 1;
let bulletSize = 10;

let bugList = [];
let bugsAmount = 5;
let bugRadius = 10;

let bossMode = false;
let score = 0;
let live = 5;
let running = true;

let bugKillerX;
let bugKillerY;
let bugKiller = {
  x: bugKillerX,
  y: bugKillerY
};

let cloudOneX = 100;
let cloudOneY = 100;
let cloudOne = [
  [cloudOneX, cloudOneY],
  [cloudOneX + 10, cloudOneY + 10],
  [cloudOneX + 15, cloudOneY],
  [cloudOneX - 5, cloudOneY + 15],
  [cloudOneX + 20, cloudOneY + 5]
];

function drawBugKiller() {
  ctx.drawImage(img, bugKiller.x - 40, bugKiller.y - 35);
  //   ctx.beginPath();
  //   ctx.fillStyle = "red";
  //   ctx.arc(bugKiller.x, bugKiller.y, 20, 0, 2 * Math.PI);
  //   ctx.fill();
}

class Bug {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.color = "red";
    this.radius = bugRadius;
    this.speed = speed;
  }
  move() {
    if (this.x <= 0) {
      // if bug reaches your land live -1
      this.x = 500;
      this.y = Math.floor((Math.random() * 500) / 20) * 20;
      live--;
      canvas.style.backgroundColor = "red";
      livestatus.innerHTML = `You have ${live} live left`;
    }
    // bugs x-position -= 1
    this.x -= 1 * this.speed;
  }
  draw() {
    ctx.drawImage(bug, this.x - 15, this.y - 15);
  }
  reborn() {
    this.x = 520;
    this.y = Math.floor((Math.random() * 500) / 20) * 20;
  }
}

class PowerUp {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.color = "red";
    this.radius = bugRadius;
    this.speed = speed;
  }
  move() {
    this.x -= 1 * this.speed;
  }
  draw() {
    ctx.drawImage(power, this.x - 15, this.y - 15, 30, 30);
    // ctx.beginPath();
    // ctx.fillStyle = "red";
    // ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    // ctx.fill();
  }
}

let powerUpArr = []

function createPowerUp() {
  let powerUpObj = new PowerUp(520, Math.floor((Math.random() * 500) / 20) * 20, 5)
  powerUpArr.push(powerUpObj)
}

class Bullet {
  constructor(x, y, radius, direction, color, damage) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.direction = direction;
    this.color = color;
    this.damage = damage;
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
  }
  move() {
    this.x += 5 * this.direction;
  }
  specialMove() {
    this.x += 5 * this.direction;
    if (this.y == bugKiller.y && this.x > 150) {
      return
    } else if (this.y >= bugKiller.y && this.x > 150) {
      this.y -= 3
    } else if (this.y <= bugKiller.y && this.x > 150) {
      this.y += 3
    }

  }


  drawSpecial() {
    ctx.drawImage(bullet, this.x - this.radius, this.y - this.radius, 2 * this.radius, 2 * this.radius)
    // ctx.fillStyle = 'blue';
    // ctx.beginPath();
    // ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    // ctx.fill();
  }
}

let sizeOfBullet = 10;
let damageOfBullet = 1;

function enlargeBullet() {
  sizeOfBullet += 1;
  damageOfBullet += 0.1;
}

let bugSpeed = 1
function createBugs(bugsAmount, bugSpeed) {
  for (let i = 0; i < bugsAmount; i++) {
    let newBug = new Bug(500, 10 + (500 / bugsAmount) * i, bugSpeed);
    bugList.push(newBug);
  }
}

function createBullet() {
  bulletList.push(
    new Bullet(
      55,
      bugKiller.y - 20,
      sizeOfBullet,
      1,
      "orange",
      Math.floor(damageOfBullet)
    )
  );
  sizeOfBullet = 10;
  damageOfBullet = 1;
}

function createBoss() {
  currentboss = bossList[bossIndex];
  bossLive.min = 0;
  bossLive.max = currentboss.live;
  bossLive.value = currentboss.live;
}
function removeBoss() {
  currentboss = "";
  bossMode = false;
  bossIndex++;
  bulletList = [];
  bossBulletList = [];
  timer.innerHTML = "";
}
function moveBoss() {
  // if position-y of boss is less 40 => move down
  if (currentboss.y <= 40) {
    currentboss.direction = 1;
    // if position-y of currentboss reach 460 => move down
  } else if (currentboss.y >= 460) {
    currentboss.direction = -1;
  }
  currentboss.y += currentboss.direction * 3;
}
function drawBoss() {
  ctx.drawImage(currentboss.img, currentboss.x - 30, currentboss.y - 30);

}
function countDown() {
  //bossTimer -= 0.01
  // should fix the 0.4 - 0.3 problem
  bossTimer -= 5;
  let timeLeft = (bossTimer / 100).toFixed(1);
  //   let timeLeft = bossTimer / 100;

  timer.innerHTML = `Time left: ${timeLeft}`;
  if (bossTimer == 0) {
    lose();
  }
}

function lose() {
  running = false;
  ctx.clearRect(0, 0, 500, 500);
  livestatus.innerHTML = `You lose!!!`;
  canvas.style.backgroundColor = "red";
  ctx.fillStyle = "Yellow";
  ctx.font = "50px Arial";
  ctx.fillText("You lose!", 150, 250);
  reStartBtn.style.display = "block";
}

function createBossBullet() {
  bossBulletList.push(
    new Bullet(currentboss.x, currentboss.y, bulletSize, -1, currentboss.color)
  );
}

function createCloud() {
  for (let i = 0; i < cloudOne.length; i++) {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(cloudOne[i][0], cloudOne[i][1], 10, 0, 2 * Math.PI);
    ctx.fill();
  }
}

function moveCloud() {
  for (let i = 0; i < cloudOne.length; i++) {
    if (cloudOne[4][0] <= 0) {
      let cloudOneX = 500;
      let cloudOneY = Math.floor((Math.random() * 500) / 20) * 20;
      cloudOne = [
        [cloudOneX, cloudOneY],
        [cloudOneX + 10, cloudOneY + 10],
        [cloudOneX + 15, cloudOneY],
        [cloudOneX - 5, cloudOneY + 15],
        [cloudOneX + 20, cloudOneY + 5]
      ];
    }
    cloudOne[i][0] -= 3;
  }
}

function checkLive() {
  if (live <= 0 || bossTimer == 0) {
    lose();
  }
}
function checkScore() {
  // if score > boss score, activate boss mode. clear all bugs and bullets
  if (score == 10 || score == 30) {
    bossMode = true;
    bulletList = [];
    bugList = [];
  }
}
// set pause funtion press p to pause and resume
window.addEventListener("keyup", function (e) {
  if (e.keyCode == 27 && running == true) {
    running = false;
    canvas.style.backgroundColor = "gray";
  } else if (e.keyCode == 27 && running == false) {
    running = true;
    canvas.style.backgroundColor = "aquamarine";
  }
});
function checkCollision() {
  for (let i = 0; i < bulletList.length; i++) {
    for (let j = 0; j < bugList.length; j++) {
      // I use The Pythagorean Theorem to get the distance between the center of bullet and bug
      if (
        Math.sqrt(
          (bulletList[i].x - bugList[j].x) ** 2 +
          (bulletList[i].y - bugList[j].y) ** 2
        ) <
        bulletList[i].radius + 15
      ) {
        ctx.drawImage(boom, bugList[j].x - 30, bugList[j].y - 30)
        //if bullet touches the bug and set bug location to (500, random(20x))
        bugList[j].reborn();
        //remove bullet from bullet list

        bulletList.splice(i, 1);

        score++;
        scoreboard.innerHTML = `Your Score: ${score}`;
      }
    }
  }
}

function checkCollisionBug() {
  livestatus.innerHTML = `You have ${live} live left.`;
  for (let i = 0; i < bugList.length; i++) {
    if (
      Math.sqrt(
        (bugList[i].x - bugKiller.x) ** 2 +
        (bugList[i].y - bugKiller.y) ** 2
      ) < 40
    ) {
      // remove touched bullet from bullet list
      canvas.style.backgroundColor = "red";
      bugList[i].reborn()
      // boss live -= 1
      live--;
      livestatus.innerHTML = `You have ${live} live left.  Boss has ${currentboss.live} live left}`;

    }
  }
}

function checkCollisionPowerUp() {
  // livestatus.innerHTML = `You have ${live} live left.  Boss has ${currentboss.live} live left}`;
  if (
    Math.sqrt(
      (powerUpArr[0].x - bugKiller.x) ** 2 +
      (powerUpArr[0].y - bugKiller.y) ** 2
    ) < 40
  ) {
    console.log('hit')
    powerUpArr.splice(0, 1)
    console.log(`DElete ${powerUpArr}`)
    canvas.style.backgroundColor = "yellow"
    powerUp = true

  }
}



function checkCollisionBoss() {
  livestatus.innerHTML = `You have ${live} live left.  Boss has ${currentboss.live} live left}`;
  for (let i = 0; i < bulletList.length; i++) {
    // I use The Pythagorean Theorem to get the distance between the center of bullet and boss
    if (
      Math.sqrt(
        (bulletList[i].x - currentboss.x) ** 2 +
        (bulletList[i].y - currentboss.y) ** 2
      ) <
      currentboss.radius + bulletList[i].radius
    ) {
      // remove touched bullet from bullet list
      currentboss.live -= bulletList[i].damage;
      bossLive.value -= bulletList[i].damage;
      bulletList.splice(i, 1);
      // boss live -= 1
      livestatus.innerHTML = `You have ${live} live left.  Boss has ${currentboss.live} live left}`;
      // if first boss die
      if (currentboss.live <= 0 && bossIndex == bossList.length - 1) {
        running = false;
        ctx.clearRect(0, 0, 500, 500);
        canvas.style.backgroundColor = "blue";
        ctx.fillStyle = "Yellow";
        ctx.font = "50px Arial";
        ctx.fillText("You win!", 150, 250);
      } else if (currentboss.live <= 0) {
        livestatus.innerHTML = `You have ${live} live left.`;
        removeBoss();
        bossLive.classList.add("hidden");
        score += 3;
        scoreboard.innerHTML = `Your Score: ${score}`;
        bugSpeed = 3
        createBugs(bugsAmount, bugSpeed);
      }
    }
  }
}

function checkCollisionBossBullet() {
  livestatus.innerHTML = `You have ${live} live left.  Boss has ${currentboss.live} live left}`;
  for (let i = 0; i < bossBulletList.length; i++) {
    if (
      Math.sqrt(
        (bossBulletList[i].x - bugKiller.x) ** 2 +
        (bossBulletList[i].y - bugKiller.y) ** 2
      ) < 40
    ) {
      // remove touched bullet from bullet list
      canvas.style.backgroundColor = "red";
      bossBulletList.splice(i, 1);
      // boss live -= 1
      live--;
      livestatus.innerHTML = `You have ${live} live left.  Boss has ${currentboss.live} live left}`;
    }
  }
}

window.addEventListener("keyup", function (e) {
  if (e.keyCode == 32) {
    createBullet();
  }
});
window.addEventListener("keydown", function (e) {
  if (e.keyCode == 32) {
    enlargeBullet();
  }
});

window.addEventListener("mousemove", function (e) {
  bugKiller.x = 20;
  bugKiller.y = e.y - 30;
});

const liveInput = document.getElementById("live-input");
const bugAmountInput = document.getElementById("bug-amount-input");

const startBtn = document.getElementById("start-btn");
const reStartBtn = document.getElementById("restart-btn");

const cheatCode = document.getElementById("cheat-code");
const cheatCodeSubmit = document.getElementById("cheat-code-submit");
const cheatForm = document.getElementById("cheat-form");

reStartBtn.style.display = "none";

cheatCodeSubmit.addEventListener("click", function () {
  if (cheatCode.value == "cpsc1045") {
    cheatForm.style.display = "block";
  }
});

startBtn.addEventListener("click", function () {
  startBtn.style.display = "none";
  if (liveInput.value != "" && bugAmountInput.value != "") {
    live = liveInput.value;
    bugsAmount = bugAmountInput.value;
  } else {
    live = 5;
    bugsAmount = 5;
  }
  setUp();
});

reStartBtn.addEventListener("click", function () {
  reStartBtn.style.display = "none";
  ctx.clearRect(0, 0, 500, 500);
  window.location.href = window.location.href;
});



let powerUp = false;

function setUp() {
  createBugs(bugsAmount, bugSpeed);
  createCloud();
  scoreboard.innerHTML = `Your Score: ${score}`;
  livestatus.innerHTML = `You have ${live} live left`;
  const myInterval = setInterval(function () {
    // boss mode
    if (running && bossMode) {
      bossLive.classList.remove("hidden");
      ctx.clearRect(0, 0, 500, 500);
      if (currentboss == "") {
        createBoss();
      }
      if (bulletDelay % 20 == 0) {
        createBossBullet();

        if (bulletDelay == 21) {
          bulletDelay == 1;
        }
      }
      bulletDelay++;
      canvas.style.backgroundColor = "aquamarine";

      bulletList.forEach((bullet) => {
        if (powerUp == true) {
          bullet.drawSpecial()
        } else {
          bullet.draw()
        }
      })
      bulletList.forEach(bullet => bullet.move());
      bossBulletList.forEach(bullet => bullet.draw());
      bossBulletList.forEach(bullet => bullet.specialMove());
      // clear the bullet flies out of the screen
      if (bulletList.length > 50) {
        bulletList.shift();
      }

      moveBoss();
      drawBoss();
      countDown();
      checkLive();
      checkCollisionBossBullet();
      checkCollisionBoss();

      drawBugKiller();

      // normal mode
    } else if (running) {
      ctx.clearRect(0, 0, 500, 500);
      createCloud();
      moveCloud();
      if (score === 5 && powerUpArr.length == 0 && powerUp == false) {
        createPowerUp()
      }
      if (powerUpArr.length > 0) {
        powerUpArr[0].move()
        powerUpArr[0].draw()
        checkCollisionPowerUp()
      }
      canvas.style.backgroundColor = "aquamarine";
      bugList.forEach(bug => bug.draw());
      bugList.forEach(bug => bug.move());
      // bulletList.forEach(bullet => bullet.draw());
      bulletList.forEach((bullet) => {
        if (powerUp == true) {
          bullet.drawSpecial()
        } else {
          bullet.draw()
        }
      })
      bulletList.forEach(bullet => bullet.move());
      // clear the bullet flies out of the screen
      if (bulletList.length > 50) {
        bulletList.shift();
      }
      checkLive();
      checkCollision();
      checkCollisionBug()



      // try to restrict the amount of bullets
      if (bulletList.length > 40) {
        bulletIndex = 0;
        bulletList.splice(1, 1);
      }
      drawBugKiller();
      checkScore();
    }
  }, 50);
}
