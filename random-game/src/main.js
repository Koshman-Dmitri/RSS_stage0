const scoreText = document.querySelector('.score-text');
const cvs = document.getElementById('canvas');
const ctx = cvs.getContext('2d');

const road = document.createElement('img');
const car = document.createElement('img');
const scoreBack = document.createElement('img');
const car1_b = document.createElement('img');
const car2_b = document.createElement('img');
const car3_b = document.createElement('img');
const car4_b = document.createElement('img');
const car5_b = document.createElement('img');
const car6_b = document.createElement('img');
const car7_b = document.createElement('img');
const car8_b = document.createElement('img');
const car9_b = document.createElement('img');
const car1_f = document.createElement('img');
const car2_f = document.createElement('img');
const car3_f = document.createElement('img');
const car4_f = document.createElement('img');
const car5_f = document.createElement('img');
const car6_f = document.createElement('img');
const car7_f = document.createElement('img');
const car8_f = document.createElement('img');
const car9_f = document.createElement('img');
road.src = 'assets/background.png';
car.src = 'assets/mainCar.png';
scoreBack.src = 'assets/scoreBackground.png';
car1_b.src = 'assets/car1-b.png';
car2_b.src = 'assets/car2-b.png';
car3_b.src = 'assets/car3-b.png';
car4_b.src = 'assets/car4-b.png';
car5_b.src = 'assets/car5-b.png';
car6_b.src = 'assets/car6-b.png';
car7_b.src = 'assets/car7-b.png';
car8_b.src = 'assets/car8-b.png';
car9_b.src = 'assets/car9-b.png';
car1_f.src = 'assets/car1-f.png';
car2_f.src = 'assets/car2-f.png';
car3_f.src = 'assets/car3-f.png';
car4_f.src = 'assets/car4-f.png';
car5_f.src = 'assets/car5-f.png';
car6_f.src = 'assets/car6-f.png';
car7_f.src = 'assets/car7-f.png';
car8_f.src = 'assets/car8-f.png';
car9_f.src = 'assets/car9-f.png';

// Sound
const introSound = new Audio();
introSound.src = 'assets/audio/intro.mp3';
introSound.setAttribute('loop', 'loop');
introSound.volume = 0.75;
const gameSound = new Audio();
gameSound.src = 'assets/audio/back.mp3';
gameSound.setAttribute('loop', 'loop');
const crashSound = new Audio();
crashSound.src = 'assets/audio/crash.mp3';
let isMute = false;

// Create road
let roadSpeed;
let roadArr;

//Create cars
let carLowSpeed;
let carHighSpeed;
const cars = [car1_b, car2_b, car3_b, car4_b, car5_b, car6_b, car7_b, car8_b, car9_b, car1_f, car2_f, car3_f, car4_f, car5_f, car6_f, car7_f, car8_f, car9_f];
let carsArr;

// Main car position
let xPos;
let yPos;

// Car control
const pressed_keys = [];
document.addEventListener('keydown', e => pressed_keys[e.code] = 1);
document.addEventListener('keyup', e => delete(pressed_keys[e.code]));

setInterval(function() {
  for (let key in pressed_keys) carControl(key)
}, 20);

function carControl(code) {
  if ((code === 'ArrowRight' || code === 'KeyD') && xPos < 570) xPos +=15;
  if ((code === 'ArrowLeft' || code === 'KeyA') && xPos >= 180) xPos -=15;
  if ((code === 'ArrowUp' || code === 'KeyW') && yPos >= 20) yPos -=15;
  if ((code === 'ArrowDown' || code === 'KeyS') && yPos <= 600) yPos +=15;
}

// Render
function draw() {
  const rAF = requestAnimationFrame(draw);

  // Road motion
  for (let i = 0; i < roadArr.length; i += 1) {
    ctx.drawImage(road, roadArr[i].x, roadArr[i].y);
    roadArr[i].y += roadSpeed;
    if (roadArr[i].y === 20) roadArr.push({x: 0, y: -road.height});
  }
  
  // Cars traffic
  for (let i = 0; i < carsArr.length; i += 1) {
    ctx.drawImage(carsArr[i].car, carsArr[i].x, carsArr[i].y);

    // Collision check
    if (carsArr[i].y + cars[0].height >= yPos && carsArr[i].y <= yPos + car.height && xPos <= carsArr[i].x + cars[0].width - 5 && xPos + car.width + 5 >= carsArr[i].x) {
      gameSound.pause();
      crashSound.play();
      introSound.play();
      cancelAnimationFrame(rAF);
      scoreText.textContent = `Your score: ${roadArr[0].y}`;
      document.querySelector('.modal-gameover').classList.add('visible');
      saveResult(roadArr[0].y);
    }

    carsArr[i].y += carsArr[i].speed;
    if ( (carsArr[i].speed === carHighSpeed && carsArr[i].y === 420) || (carsArr[i].speed === carLowSpeed && carsArr[i].y === 210) ) {
      carsArr.push({car: cars[random(0, 17)], y: -240});
      const direction = carsArr[i + 1].car.src.at(-5);
      carsArr[i + 1].x = direction === 'f' ? random(0, 1) === 0 ? 447 : 577 : random(0, 1) === 0 ? 192 : 317;
      carsArr[i + 1].speed = direction === 'f' ? carLowSpeed : carHighSpeed;
    }
  }
  
  // Main car
  ctx.drawImage(car, xPos, yPos);

  // Score
  ctx.drawImage(scoreBack, 0, 740, 190, 60);
  ctx.fillStyle = '#000';
  ctx.font = '24px Verdana';
  ctx.fillText("Score: " + roadArr[0].y, 10, 778);
}

// Choose car random generator
function random(min, max) {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

// First page load
road.onload = () => ctx.drawImage(road, 0, 0);
let isGameStarted = false;

// Menu buttons
const playBtn = document.getElementById('play-btn');
const restartBtn = document.getElementById('restart-btn');
const leaderBtns = document.querySelectorAll('#leader-btn');
const backtBtn = document.getElementById('back-btn');

playBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);
leaderBtns.forEach(btn => btn.addEventListener('click', showLeaderBoard));
backtBtn.addEventListener('click', back);

function startGame() {
  this.closest('.modal').classList.remove('visible');
  introSound.pause();
  gameSound.currentTime = 0;
  gameSound.play();
  roadSpeed = 10;
  carLowSpeed = 15;
  carHighSpeed = 20;
  roadArr = [{x: 0, y: 0}];
  carsArr = [{car: car7_b, x: 192, y: -420, speed: carHighSpeed}];
  xPos = 440;
  yPos = road.height - car.height - 530;
  isGameStarted = true;
  setTimeout(() => draw(), 600);
}

function showLeaderBoard() {
  this.closest('.modal').classList.remove('visible');
  document.querySelector('.modal-leaderBoard').classList.add('visible');
  const ulTop = document.querySelector('.list_top');
  const ulLast = document.querySelector('.list_last');
  ulTop.innerHTML = '';
  ulLast.innerHTML = '';
  const getLastScore = JSON.parse(localStorage.getItem('last-score'));
  const getBestScore = JSON.parse(localStorage.getItem('best-score'));
  getBestScore.reverse().forEach((el, index) => {
    const li = document.createElement('li');
    li.className = 'list__item';
    li.textContent = `${index + 1}. ${el}`;
    ulTop.append(li);
  });
  getLastScore.reverse().forEach((el, index) => {
    const li = document.createElement('li');
    li.className = 'list__item';
    li.textContent = `${index + 1}. ${el}`;
    ulLast.append(li);
  });
  if (getBestScore.length === 0) {
    const li = document.createElement('li');
    li.className = 'list__item';
    li.textContent = `No score so far`;
    ulTop.append(li);
  }
  if (getLastScore.length === 0) {
    const li = document.createElement('li');
    li.className = 'list__item';
    li.textContent = `No score so far`;
    ulLast.append(li);
  }
}

function back() {
  if (isGameStarted) {
    document.querySelector('.modal-gameover').classList.add('visible');
  } else {
    document.querySelector('.modal-start').classList.add('visible');
  }
  document.querySelector('.modal-leaderBoard').classList.remove('visible');
}

document.addEventListener('keydown', (e) => {
  // mute sound
  if (e.code === 'KeyM') {
    const muteIcon = document.querySelector('.mute-icon');
    if (isMute) {
      gameSound.volume = 1;
      crashSound.volume = 1;
      introSound.volume = 0.75;
      muteIcon.classList.remove('muted');
      isMute = false;
    } else {
      gameSound.volume = crashSound.volume = introSound.volume = 0;
      muteIcon.classList.add('muted');
      isMute = true;
    }
    return;
  }
  // restart
  if (document.querySelector('.modal-gameover').classList.contains('visible')) {
    if (e.code === 'KeyR' || e.code === 'Enter') restartBtn.click();
  }
});

// Local storage
if (!localStorage.getItem('best-score')) localStorage.setItem('best-score', '[]');
if (!localStorage.getItem('last-score')) localStorage.setItem('last-score', '[]');

function saveResult(score) {
  const getLastScore = JSON.parse(localStorage.getItem('last-score'));
  getLastScore.push(score);
  if (getLastScore.length > 10) getLastScore.shift();
  localStorage.setItem('last-score', JSON.stringify(getLastScore));

  const getBestScore = JSON.parse(localStorage.getItem('best-score'));
  if (getBestScore.includes(score)) return;
  getBestScore.push(score);
  getBestScore.sort((a, b) => a - b);
  if (getBestScore.length > 10) getBestScore.shift();
  localStorage.setItem('best-score', JSON.stringify(getBestScore));
}
