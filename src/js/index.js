const $video = document.getElementById('video');
const $seekbar = document.getElementById('seekbar');
const $progress = document.getElementById('progress');
const $buttons = document.getElementById('buttons');

let interval;
let jump = 5;
let volume = 0.75;

// TODO 1. rewind/forward +/- [1,2,3,4,5] seconds
// TODO 2. volume control
// TODO 3. keyboard events left/right/space

// TODO 4. add 2nd video player

function toggleVideo() {
  if ($video.paused) {
    $video.play();
    interval = interval ?? setInterval(updateProgressBar, 1000 / 30);
  } else {
    $video.pause();
    clearInterval(interval);
    interval = null;
  }
  renderButtons();
}

function updateProgressBar() {
  const { currentTime, duration } = $video;
  const progress = (currentTime / duration) * 100;
  $progress.style.right = `${100 - progress}%`;
}

function renderButtons() {
  $buttons.innerHTML = `
    <button class="video-toggle">${$video.paused ? 'play' : 'pause'}</button>
    <select class="rew-fwd-select">
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5" selected>5</option>
    </select>
    <button class="rwd">R</button>
    <button class="fwd">F</button>
    <input type="range" class="volume" min="0" max="100" step="1" value="${volume * 100}">
  `;
}

function seekWith(sec) {
  $video.currentTime += sec;
  updateProgressBar();
}

function seekBackward() {
  seekWith(-jump);
}

function seekForward() {
  seekWith(jump);
}

function setVolume(newVolume) {
  volume = $video.volume = Math.max(Math.min(newVolume, 1), 0);
  renderButtons()
}

function increaseVolume() {
  setVolume($video.volume + 0.05);
}

function decreaseVolume() {
  setVolume($video.volume - 0.05);
}

$seekbar.onclick = (e) => {
  const { width } = e.target.getBoundingClientRect();
  $video.currentTime = $video.duration * (e.clientX / width);
  updateProgressBar();
}

document.body.addEventListener('click', (e) => {
  const { classList } = e.target;
  if (classList.contains('video-toggle')) toggleVideo();
  if (classList.contains('rwd')) seekBackward();
  if (classList.contains('fwd')) seekForward();
});

document.body.addEventListener('change', (e) => {
  const isSelect = e.target.classList.contains('rew-fwd-select');
  if (isSelect) jump = parseInt(e.target.value);
});

document.body.addEventListener('input', (e) => {
  const isVolume = e.target.classList.contains('volume');

  if (isVolume) {
    volume = parseInt(e.target.value) / 100;
    $video.volume = volume;
  }
});

document.body.addEventListener('keydown', (e) => {
  switch(e.code) {
    case 'ArrowLeft': seekBackward(); break;
    case 'ArrowRight': seekForward(); break;
    case 'ArrowUp': increaseVolume(); break;
    case 'ArrowDown': decreaseVolume(); break;
    case 'Space': toggleVideo(); break;
  }
});

renderButtons();
