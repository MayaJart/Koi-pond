const canvas = document.getElementById("pond");
const ctx = canvas.getContext("2d");
const startScreen = document.getElementById("startScreen");
const music = document.getElementById("music");

/* ---------- MUSIC ---------- */
const tracks = [
  "music/music1.mp3",
  "music/music2.mp3",
  "music/music3.mp3"
];

let currentTrack = 0;
let muted = false;

music.onended = () => {
  currentTrack = (currentTrack + 1) % tracks.length;
  music.src = tracks[currentTrack];
  music.play();
};

/* ---------- CANVAS ---------- */
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

/* ---------- INPUT ---------- */
const mouse = { x: canvas.width / 2, y: canvas.height / 2 };
let dashing = false;

window.addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener("mousedown", () => dashing = true);
window.addEventListener("mouseup", () => dashing = false);

window.addEventListener("keydown", e => {
  if (e.key.toLowerCase() === "m") {
    muted = !muted;
    music.muted = muted;
  }
});

/* ---------- GAME STATE ---------- */
let running = false;
let score = 0;
let player;
let fish = [];

/* ---------- START / END ---------- */
function startGame() {
  startScreen.style.display = "none";
  score = 0;

  player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 12
  };

  fish = [];
  for (let i = 0; i < 12; i++) spawnFish();

  currentTrack = Math.floor(Math.random() * tracks.length);
  music.src = tracks[currentTrack];
  music.volume = 0.4;
  music.play();

  running = true;
  loop();
}

function endGame() {
  running = false;
  startScreen.classList.add("fade");

  setTimeout(() => {
    startScreen.classList.remove("fade");
    startScreen.style.display = "flex";
  }, 2000);
}

/* ---------- FISH ---------- */
function spawnFish() {
  fish.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: 8 + Math.random() * 20,
    angle: Math.random() * Math.PI * 2,
    speed: 0.4 + Math.random() * 0.6
  });
}

/* ---------- UPDATE ---------- */
function update() {
  if (!running) return;

  // Player movement
  const dx = mouse.x - player.x;
  const dy = mouse.y - player.y;
  const dist = Math.hypot(dx, dy);
  const speed = dashing ? 4 : 1.8;

  if (dist > 1) {
    player.x += (dx / dist) * speed;
    player.y += (dy / dist) * speed;
  }

  // Fish
  for (let i = fish.length - 1; i >= 0; i--) {
    const f = fish[i];
    f.x += Math.cos(f.angle) * f.speed;
    f.y += Math.sin(f.angle) * f.speed;

    if (Math.random() < 0.01) f.angle += (Math.random() - 0.5);

    if (f.x < 0) f.x = canvas.width;
    if (f.y < 0) f.y = canvas.height;
    if (f.x > canvas.width) f.x = 0;
    if (f.y > canvas.height) f.y = 0;

    const d = Math.hypot(player.x - f.x, player.y - f.y);
    if (d < player.size + f.size) {
      if (player.size > f.size) {
        player.size += 1;
        score++;
        fish.splice(i, 1);
        spawnFish();
      } else {
        endGame();
      }
    }
  }
}

/* ---------- DRAW ---------- */
function draw() {
  ctx.fillStyle = "#0b4f6c";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Dull fish
  ctx.fillStyle = "#4b3b2a";
  fish.forEach(f => {
    ctx.beginPath();
    ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
    ctx.fill();
  });

  // Player koi
  ctx.fillStyle = "#ffefe0";
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
  ctx.fill();
}

/* ---------- LOOP ---------- */
function loop() {
  if (!running) return;
  update();
  draw();
  requestAnimationFrame(loop);
}
