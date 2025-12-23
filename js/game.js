// ---------- CANVAS ----------
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

// ---------- MUSIC ----------
const music = document.getElementById("music");
const tracks = [
  "assets/audio/music1.mp3",
  "assets/audio/music2.mp3",
  "assets/audio/music3.mp3"
];
let currentTrack = Math.floor(Math.random() * tracks.length);
music.src = tracks[currentTrack];
music.volume = 0.4;
music.play();

music.onended = () => {
  currentTrack = (currentTrack + 1) % tracks.length;
  music.src = tracks[currentTrack];
  music.play();
};

// ---------- INPUT ----------
const mouse = { x: canvas.width / 2, y: canvas.height / 2 };
window.addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

// ---------- PLAYER SPRITES ----------
const playerFrames = [
  new Image(), // left
  new Image(), // straight
  new Image()  // right
];

playerFrames[0].src = "assets/sprites/player/Kohaku 1.png";
playerFrames[1].src = "assets/sprites/player/Kohaku 2.png";
playerFrames[2].src = "assets/sprites/player/Kohaku 3.png";

// ---------- PLAYER ----------
const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 28,
  angle: 0,
  frameIndex: 1,
  frameTimer: 0
};

// ---------- UPDATE ----------
function update() {
  const dx = mouse.x - player.x;
  const dy = mouse.y - player.y;
  const dist = Math.hypot(dx, dy);

  if (dist > 1) {
    player.x += (dx / dist) * 2;
    player.y += (dy / dist) * 2;
    player.angle = Math.atan2(dy, dx);
  }

  // swim animation: left → straight → right → straight
  player.frameTimer++;
  if (player.frameTimer > 10) {
    player.frameIndex = (player.frameIndex + 1) % 3;
    player.frameTimer = 0;
  }
}

// ---------- DRAW ----------
function drawPlayer() {
  const img = playerFrames[player.frameIndex];
  ctx.save();
  ctx.translate(player.x, player.y);
  ctx.rotate(player.angle);
  ctx.drawImage(
    img,
    -player.size,
    -player.size,
    player.size * 2,
    player.size * 2
  );
  ctx.restore();
}

function drawFog() {
  ctx.fillStyle = "rgba(0,0,0,0.85)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(player.x, player.y, 160, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = "source-over";
}

function draw() {
  ctx.fillStyle = "#0b4f6c";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawPlayer();
  drawFog();
}

// ---------- LOOP ----------
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
