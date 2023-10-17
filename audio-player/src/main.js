const audio = document.querySelector('audio');
const currentTime = document.querySelector('.current-time');
const trackTime = document.querySelector('.track-time');
const btnPrev = document.querySelector('.button_backward');
const btnPlay = document.querySelector('.button_play');
const btnNext = document.querySelector('.button_forward');
const boombox = document.querySelectorAll('.boombox');
const trackTitle = document.querySelector('.track-title');
const trackAuthor = document.querySelector('.track-author');
const trackImg = document.querySelector('.track-image');
const background = document.querySelector('.background');
const progressBar = document.querySelector('.custom-range');

let isPlay = false;
let isMute = false;
let trackNum = 0;
const songs = [
  {
    name: 'Demons',
    author: 'Aviva',
    audioSrc: 'assets/music/Aviva - Demons.mp3',
    imgSrc: 'assets/images/Aviva - Demons.jpg',
  },
  {
    name: 'I cry',
    author: 'Florida',
    audioSrc: 'assets/music/Flo Rida - I Cry.mp3',
    imgSrc: 'assets/images/Flo Rida - I Cry.jpg',
  },
  {
    name: 'Keep It Mello',
    author: 'Marshmello',
    audioSrc: 'assets/music/Marshmello - Keep It Mello.mp3',
    imgSrc: 'assets/images/Marshmello - Keep It Mello.jpg',
  },
  {
    name: 'Happier',
    author: 'Marshmello & Bastille',
    audioSrc: 'assets/music/Marshmello & Bastille - Happier.mp3',
    imgSrc: 'assets/images/Marshmello & Bastille - Happier.jpg',
  },
  {
    name: 'Borderline',
    author: 'Tove Lo',
    audioSrc: 'assets/music/Tove Lo - Borderline.mp3',
    imgSrc: 'assets/images/Tove Lo - Borderline.jpg', 
  },
];

audio.addEventListener('loadedmetadata', () => {
  trackTime.textContent = getTime(audio.duration);
});

progressBar.addEventListener('input', () => {
  audio.currentTime = progressBar.value / progressBar.max * audio.duration;
  updateControlPanel();
});

btnPlay.addEventListener('click', audioPlay);
btnNext.addEventListener('click', nextSong);
btnPrev.addEventListener('click', prevSong);
boombox.forEach(b => b.addEventListener('click', muteSound));

getSong();
// Update time interval and progress bar
setInterval(() => {
  updateControlPanel();
  if (audio.currentTime === audio.duration) nextSong();
}, 500);

function getTime(time) {
  const seconds = Math.floor(time % 60);
  const minutes = Math.floor(time / 60);
  const secToReturn = Math.floor(time % 60) < 10 ? `0${seconds}` : `${seconds}`;
  return `${minutes}:${secToReturn}`;
}

function audioPlay() {
  const svg = btnPlay.querySelector('svg use');
  if (isPlay) {
    isPlay = false;
    svg.href.baseVal = 'assets/icons/sprite.svg#icon-play';
    boombox.forEach(b => b.classList.remove('active'));
    audio.pause();
  } else {
    isPlay = true;
    svg.href.baseVal = 'assets/icons/sprite.svg#icon-pause';
    if (!isMute) boombox.forEach(b => b.classList.add('active'));
    audio.play();
  }
}

function nextSong() {
  trackNum += 1;
  if (trackNum >= songs.length) trackNum = 0;
  getSong();
  if (isPlay) audio.play();
}

function prevSong() {
  trackNum -= 1;
  if (trackNum < 0) trackNum = songs.length - 1;
  getSong();
  if (isPlay) audio.play();
}

function muteSound() {
  if (isMute) {
    audio.muted = false;
    isMute = false;
    if (isPlay) boombox.forEach(b => b.classList.add('active'));
    boombox.forEach(b => b.classList.remove('mute'));
  } else {
    audio.muted = true;
    isMute = true;
    boombox.forEach(b => b.classList.remove('active'));
    boombox.forEach(b => b.classList.add('mute'));
  }
}

function getSong() {
  audio.src = songs[trackNum].audioSrc;
  trackImg.src = songs[trackNum].imgSrc;
  trackTitle.textContent = songs[trackNum].name;
  trackAuthor.textContent = songs[trackNum].author;
  background.src = songs[trackNum].imgSrc;
}

function updateControlPanel() {
  progressBar.value = audio.currentTime / audio.duration * 100;
  progressBar.style.background = `linear-gradient(90deg, rgba(255,127,80,0.8) 0%, yellow ${progressBar.value}%, #fff ${progressBar.value}%, white 100%)`;
  currentTime.textContent = getTime(audio.currentTime);
}