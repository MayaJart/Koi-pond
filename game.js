const canvas = document.getElementById("pond");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

// ----- Score -----
let score = 0;
let highScore = Number(localStorage.getItem("highScore") || 0);
document.getElementById("high").textContent = highScore;

setInterval(() => {
  score++;
  document.getElementById("score").textContent = score;
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
    document.getElementById("high").textContent = highScore;
  }
}, 1000);

// ----- Mouse influence -----
const mouse = { x: canvas.width / 2, y: canvas.height / 2 };
window.addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

// ----- Fish -----
const fishCount = 8;
const fish = [];

for (let i = 0; i < fishCount; i++) {
  fish.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    angle: Math.random() * Math.PI * 2,
    speed: 0.4 + Math.random() * 0.6,
    size: 10 + Math.random() * 6
  });
}

function updateFish(f) {
  // gentle drift
  f.angle += (Math.random() - 0.5) * 0.02;

  // slight mouse attraction
  const dx = mouse.x - f.x;
  const dy = mouse.y - f.y;
  const dist = Math.hypot(dx, dy);
  if (dist < 200) {
    const target = Math.atan2(dy, dx);
    f.angle += (target - f.angle) * 0.002;
  }

  f.x += Math.cos(f.angle) * f.speed;
  f.y += Math.sin(f.angle) * f.speed;

  // wrap edges
  if (f.x < -20) f.x = canvas.width + 20;
  if (f.y < -20) f.y = canvas.height + 20;
  if (f.x > canvas.width + 20) f.x = -20;
  if (f.y > canvas.height + 20) f.y = -20;
}

function drawFish(f) {
  ctx.save();
  ctx.translate(f.x, f.y);
  ctx.rotate(f.angle);
  ctx.fillStyle = "#ffefe0";
  ctx.beginPath();
  ctx.ellipse(0, 0, f.size * 1.6, f.size, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// ----- Water -----
let t = 0;
function drawWater() {
  const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
  g.addColorStop(0, "#1bb6d8");
  g.addColorStop(1, "#0b4f6c");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.globalAlpha = 0.25;
  ctx.strokeStyle = "rgba(255,255,255,0.5)";
  ctx.lineWidth = 1;
  for (let y = 0; y < canvas.height; y += 40) {
    ctx.beginPath();
    for (let x = 0; x <= canvas.width; x += 20) {
      const wave = Math.sin(x * 0.02 + t) * 4;
      ctx.lineTo(x, y + wave);
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

// ----- Loop -----
function loop() {
  t += 0.01;
  drawWater();
  fish.forEach(updateFish);
  fish.forEach(drawFish);
  requestAnimationFrame(loop);
}
loop();
