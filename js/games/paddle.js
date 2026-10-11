/*
 * Ball & Paddle — two-eye game. The ball and the bricks are drawn in the weaker eye's
 * colour; the paddle in the stronger eye's colour. Keeping the ball in play needs both
 * eyes on every hit. Walls and score are white (seen by both eyes).
 */
var Paddle = (function () {
  var K = { LEFT: 37, RIGHT: 39, ENTER: 13, UP: 38 };
  var W = Engine.W, H = Engine.H, FG = Engine.FG, BG = Engine.BG;
  var L = 120, R = W - 120, T = 140, PADDLE_Y = H - 120;
  var COLS = 8, ROWS = 4, BW = 180, BH = 44, GAP = 16;
  var BX = (W - (COLS * BW + (COLS - 1) * GAP)) / 2, BY = 210;

  var pad, ball, bricks, level, speed, served, serveT;

  function buildBricks() {
    bricks = [];
    for (var r = 0; r < ROWS; r++) {
      for (var c = 0; c < COLS; c++) bricks.push({ x: BX + c * (BW + GAP), y: BY + r * (BH + GAP), w: BW, h: BH });
    }
  }

  function resetBall() {
    served = false;
    serveT = 1.2;                        // serves by itself after a moment (or press OK)
    ball = { x: pad.x + pad.w / 2, y: PADDLE_Y - 20, r: 18, vx: 0, vy: 0 };
  }

  function serve() {
    if (served) return;
    served = true;
    var a = (-60 + Math.random() * 30) * Math.PI / 180;   // up and slightly to one side
    if (Math.random() < 0.5) a = -Math.PI - a;
    ball.vx = Math.cos(a) * speed; ball.vy = -Math.abs(Math.sin(a) * speed);
    Sound.play('shoot');
  }

  function init() {
    level = 1; speed = 620;
    pad = { x: W / 2 - 130, y: PADDLE_Y, w: 260, h: 26 };
    buildBricks();
    resetBall();
  }

  function keydown(k, st, repeat) {
    if (!repeat && (k === K.ENTER || k === K.UP)) serve();
  }

  function update(dt, held, st) {
    var sp = 1150;
    if (held[K.LEFT]) pad.x -= sp * dt;
    if (held[K.RIGHT]) pad.x += sp * dt;
    pad.x = Math.max(L, Math.min(R - pad.w, pad.x));

    if (!served) {
      ball.x = pad.x + pad.w / 2; ball.y = PADDLE_Y - ball.r - 2;
      serveT -= dt;
      if (serveT <= 0) serve();
      return;
    }

    // Move in small steps so a fast ball cannot pass through a brick
    var steps = Math.ceil(Math.hypot(ball.vx, ball.vy) * dt / 10);
    for (var s = 0; s < steps; s++) {
      ball.x += ball.vx * dt / steps;
      ball.y += ball.vy * dt / steps;

      if (ball.x - ball.r < L) { ball.x = L + ball.r; ball.vx = Math.abs(ball.vx); Sound.play('tick'); }
      if (ball.x + ball.r > R) { ball.x = R - ball.r; ball.vx = -Math.abs(ball.vx); Sound.play('tick'); }
      if (ball.y - ball.r < T) { ball.y = T + ball.r; ball.vy = Math.abs(ball.vy); Sound.play('tick'); }

      // Paddle: the bounce angle depends on where the ball hits it
      if (ball.vy > 0 && ball.y + ball.r >= pad.y && ball.y + ball.r <= pad.y + pad.h + 20 &&
          ball.x >= pad.x - ball.r && ball.x <= pad.x + pad.w + ball.r) {
        var off = (ball.x - (pad.x + pad.w / 2)) / (pad.w / 2);       // -1 .. 1
        var ang = (-90 + off * 60) * Math.PI / 180;
        var v = Math.hypot(ball.vx, ball.vy);
        ball.vx = Math.cos(ang) * v; ball.vy = Math.sin(ang) * v;
        ball.y = pad.y - ball.r;
        st.score += 1;
        Sound.play('move');
      }

      // Bricks
      for (var i = 0; i < bricks.length; i++) {
        var b = bricks[i];
        var nx = Math.max(b.x, Math.min(ball.x, b.x + b.w)), ny = Math.max(b.y, Math.min(ball.y, b.y + b.h));
        if (Math.hypot(ball.x - nx, ball.y - ny) <= ball.r) {
          bricks.splice(i, 1);
          if (nx === b.x || nx === b.x + b.w) ball.vx = -ball.vx; else ball.vy = -ball.vy;
          st.score += 10;
          Sound.play('pop');
          break;
        }
      }
    }

    if (!bricks.length) {                  // level cleared: faster ball, new bricks
      level++; speed = Math.min(1100, speed * 1.1);
      st.score += 100;
      Sound.play('level');
      buildBricks(); resetBall();
      return;
    }

    if (ball.y - ball.r > H) {             // missed
      Engine.damage(st);
      resetBall();
    }
  }

  function draw(ctx, st) {
    var eyes = Engine.colors();
    // Walls (both eyes)
    ctx.strokeStyle = FG; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(L - 3, H); ctx.lineTo(L - 3, T - 3); ctx.lineTo(R + 3, T - 3); ctx.lineTo(R + 3, H); ctx.stroke();
    ctx.fillStyle = FG; ctx.textAlign = 'left'; ctx.font = '36px Arial, sans-serif';
    ctx.fillText('Level ' + level, L + 10, T + 46);

    // Bricks and ball: weaker eye
    ctx.fillStyle = eyes.weak;
    bricks.forEach(function (b) { ctx.fillRect(b.x, b.y, b.w, b.h); });
    ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2); ctx.fill();

    // Paddle: stronger eye
    if (!Engine.blink(st)) {
      ctx.fillStyle = eyes.strong;
      ctx.fillRect(pad.x, pad.y, pad.w, pad.h);
    }
  }

  return { id: 'paddle', title: 'Ball & Paddle', dichoptic: true,
    hint: '◀ ▶ move the paddle  ·  OK serve',
    init: init, update: update, draw: draw, keydown: keydown };
})();
