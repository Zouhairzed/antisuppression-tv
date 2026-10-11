/*
 * Find the Sneak — a group of owls wander around. One of them is the sneak: every few
 * seconds it glances sideways while the others look straight ahead. Move the spotlight
 * with the arrows and press OK on the sneak before time runs out. Each round adds owls,
 * shortens the glance, and (from round 3) the other owls start blinking to distract you.
 * A good exercise for visual attention: the owls are split by the bars like everything else.
 */
var Sneak = (function () {
  var K = { LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, ENTER: 13 };
  var W = Engine.W, H = Engine.H, FG = Engine.FG, BG = Engine.BG;
  var AREA = { x: 130, y: 200, w: W - 260, h: H - 340 };
  var R = 46, CURSOR_SPEED = 760;

  var owls, sneak, cur, round, timeLeft, roundTime, tellT, tellOn, reveal, revealMsg, banner;

  function rand(a, b) { return a + Math.random() * (b - a); }

  function makeOwl() {
    var a = rand(0, Math.PI * 2), sp = rand(35, 55) + round * 6;
    return { x: 0, y: 0, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
      blinkT: rand(1, 4), blink: 0, look: 0, wrong: 0 };
  }

  function newRound() {
    round++;
    var n = Math.min(14, 4 + round * 2);
    owls = [];
    for (var i = 0; i < n; i++) {
      var o = makeOwl(), tries = 0;
      do {
        o.x = rand(AREA.x + R, AREA.x + AREA.w - R);
        o.y = rand(AREA.y + R, AREA.y + AREA.h - R);
        tries++;
      } while (tries < 60 && owls.some(function (p) { return Math.hypot(p.x - o.x, p.y - o.y) < R * 2.6; }));
      owls.push(o);
    }
    sneak = owls[Math.floor(Math.random() * n)];
    roundTime = Math.max(10, 22 - round);
    timeLeft = roundTime;
    tellT = rand(0.8, 1.6);
    tellOn = 0;
    reveal = 0;
    banner = 1.4;
  }

  function init() {
    round = 0;
    cur = { x: W / 2, y: AREA.y + AREA.h / 2 };
    newRound();
  }

  function nearest() {
    var best = null, bd = R * 1.8;
    owls.forEach(function (o) {
      var d = Math.hypot(o.x - cur.x, o.y - cur.y);
      if (d < bd) { bd = d; best = o; }
    });
    return best;
  }

  function keydown(k, st, repeat) {
    if (repeat || k !== K.ENTER || reveal > 0) return;
    var o = nearest();
    if (!o) return;
    if (o === sneak) {
      st.score += 50 + Math.ceil(timeLeft) * 5;
      Sound.play('collect');
      reveal = 1.4; revealMsg = 'Got it!';
    } else {
      o.wrong = 1;
      Engine.damage(st);
    }
  }

  function update(dt, held, st) {
    if (banner > 0) banner -= dt;

    if (reveal > 0) {                     // short pause showing the sneak, then next round
      reveal -= dt;
      if (reveal <= 0) { if (revealMsg === 'Got it!' && round % 3 === 0) Sound.play('level'); newRound(); }
      return;
    }

    // Spotlight
    if (held[K.LEFT]) cur.x -= CURSOR_SPEED * dt;
    if (held[K.RIGHT]) cur.x += CURSOR_SPEED * dt;
    if (held[K.UP]) cur.y -= CURSOR_SPEED * dt;
    if (held[K.DOWN]) cur.y += CURSOR_SPEED * dt;
    cur.x = Math.max(AREA.x, Math.min(AREA.x + AREA.w, cur.x));
    cur.y = Math.max(AREA.y, Math.min(AREA.y + AREA.h, cur.y));

    // Timer
    timeLeft -= dt;
    if (timeLeft <= 0) {
      Engine.damage(st);
      reveal = 1.6; revealMsg = 'It was this one!';
      return;
    }

    // The sneak's sideways glance
    tellT -= dt;
    if (tellOn > 0) {
      tellOn -= dt;
      if (tellOn <= 0) { sneak.look = 0; tellT = rand(1.4, 2.8); }
    } else if (tellT <= 0) {
      tellOn = Math.max(0.35, 0.95 - round * 0.06);
      sneak.look = Math.random() < 0.5 ? -1 : 1;
    }

    owls.forEach(function (o) {
      // Wander and bounce off the edges
      o.x += o.vx * dt; o.y += o.vy * dt;
      if (o.x < AREA.x + R || o.x > AREA.x + AREA.w - R) { o.vx = -o.vx; o.x = Math.max(AREA.x + R, Math.min(AREA.x + AREA.w - R, o.x)); }
      if (o.y < AREA.y + R || o.y > AREA.y + AREA.h - R) { o.vy = -o.vy; o.y = Math.max(AREA.y + R, Math.min(AREA.y + AREA.h - R, o.y)); }
      if (Math.random() < dt * 0.3) { var a = rand(0, Math.PI * 2), sp = Math.hypot(o.vx, o.vy); o.vx = Math.cos(a) * sp; o.vy = Math.sin(a) * sp; }
      if (o.wrong > 0) o.wrong -= dt;
      // Distractions: from round 3, every owl blinks now and then (blinking is not the clue)
      if (round >= 3) {
        o.blinkT -= dt;
        if (o.blink > 0) o.blink -= dt;
        else if (o.blinkT <= 0) { o.blink = 0.18; o.blinkT = rand(1.5, 4); }
      }
    });

    // Keep owls from piling up on each other
    for (var i = 0; i < owls.length; i++) {
      for (var j = i + 1; j < owls.length; j++) {
        var a = owls[i], b = owls[j], dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy);
        if (d > 0 && d < R * 2.2) {
          var push = (R * 2.2 - d) / 2, ux = dx / d, uy = dy / d;
          a.x -= ux * push; a.y -= uy * push; b.x += ux * push; b.y += uy * push;
        }
      }
    }
  }

  function drawOwl(ctx, o) {
    var x = o.x, y = o.y;
    ctx.fillStyle = FG;
    // ear tufts
    ctx.beginPath();
    ctx.moveTo(x - R * 0.75, y - R * 0.55); ctx.lineTo(x - R * 0.62, y - R * 1.15); ctx.lineTo(x - R * 0.3, y - R * 0.8);
    ctx.moveTo(x + R * 0.75, y - R * 0.55); ctx.lineTo(x + R * 0.62, y - R * 1.15); ctx.lineTo(x + R * 0.3, y - R * 0.8);
    ctx.fill();
    // body
    ctx.beginPath(); ctx.ellipse(x, y, R * 0.85, R, 0, 0, Math.PI * 2); ctx.fill();
    // feet
    ctx.beginPath(); ctx.ellipse(x - R * 0.3, y + R * 1.0, R * 0.2, R * 0.1, 0, 0, Math.PI * 2);
    ctx.ellipse(x + R * 0.3, y + R * 1.0, R * 0.2, R * 0.1, 0, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = BG;
    var ey = y - R * 0.28, ex = R * 0.36, er = R * 0.3;
    if (o.blink > 0) {
      ctx.fillRect(x - ex - er, ey - 3, er * 2, 6);
      ctx.fillRect(x + ex - er, ey - 3, er * 2, 6);
    } else {
      ctx.beginPath(); ctx.arc(x - ex, ey, er, 0, Math.PI * 2); ctx.arc(x + ex, ey, er, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = FG;
      var px = o.look * er * 0.5;
      ctx.beginPath(); ctx.arc(x - ex + px, ey, er * 0.42, 0, Math.PI * 2); ctx.arc(x + ex + px, ey, er * 0.42, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = BG;
    }
    // beak and chest pattern
    ctx.beginPath(); ctx.moveTo(x - R * 0.1, y - R * 0.05); ctx.lineTo(x + R * 0.1, y - R * 0.05); ctx.lineTo(x, y + R * 0.15); ctx.fill();
    ctx.strokeStyle = BG; ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - R * 0.3, y + R * 0.35); ctx.lineTo(x - R * 0.18, y + R * 0.47); ctx.lineTo(x - R * 0.06, y + R * 0.35);
    ctx.moveTo(x + R * 0.06, y + R * 0.35); ctx.lineTo(x + R * 0.18, y + R * 0.47); ctx.lineTo(x + R * 0.3, y + R * 0.35);
    ctx.moveTo(x - R * 0.12, y + R * 0.6); ctx.lineTo(x, y + R * 0.72); ctx.lineTo(x + R * 0.12, y + R * 0.6);
    ctx.stroke();

    // wrong guess: a cross over the owl
    if (o.wrong > 0) {
      ctx.lineWidth = 10;
      ctx.beginPath(); ctx.moveTo(x - R * 0.6, y - R * 0.6); ctx.lineTo(x + R * 0.6, y + R * 0.6);
      ctx.moveTo(x + R * 0.6, y - R * 0.6); ctx.lineTo(x - R * 0.6, y + R * 0.6); ctx.stroke();
    }
  }

  function draw(ctx) {
    // Round and timer
    ctx.fillStyle = FG;
    ctx.textAlign = 'left';
    ctx.font = '36px Arial, sans-serif';
    ctx.fillText('Round ' + round, 96, 160);
    var bw = 600, bx = W / 2 - bw / 2;
    ctx.strokeStyle = FG; ctx.lineWidth = 3;
    ctx.strokeRect(bx, 140, bw, 18);
    ctx.fillRect(bx + 4, 144, Math.max(0, (bw - 8) * timeLeft / roundTime), 10);

    owls.forEach(function (o) { drawOwl(ctx, o); });

    if (reveal > 0) {
      ctx.strokeStyle = FG; ctx.lineWidth = 8;
      ctx.beginPath(); ctx.arc(sneak.x, sneak.y, R * 1.55, 0, Math.PI * 2); ctx.stroke();
      ctx.textAlign = 'center'; ctx.font = 'bold 56px Arial, sans-serif';
      ctx.fillText(revealMsg, W / 2, AREA.y + AREA.h + 70);
    } else {
      // Spotlight and the owl it would pick
      var o = nearest();
      ctx.strokeStyle = FG; ctx.lineWidth = 4;
      ctx.setLineDash([14, 10]);
      ctx.beginPath(); ctx.arc(cur.x, cur.y, R * 1.45, 0, Math.PI * 2); ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath(); ctx.moveTo(cur.x - 14, cur.y); ctx.lineTo(cur.x + 14, cur.y); ctx.moveTo(cur.x, cur.y - 14); ctx.lineTo(cur.x, cur.y + 14); ctx.stroke();
      if (o) { ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(o.x, o.y, R * 1.3, 0, Math.PI * 2); ctx.stroke(); }
    }

    if (banner > 0 && reveal <= 0) {
      ctx.textAlign = 'center'; ctx.font = 'bold 48px Arial, sans-serif'; ctx.fillStyle = FG;
      ctx.fillText('Round ' + round + ': ' + owls.length + ' owls. Which one keeps looking sideways?', W / 2, AREA.y + AREA.h + 70);
    }
  }

  return { id: 'sneak', title: 'Find the Sneak', hint: '◀ ▲ ▼ ▶ move the spotlight  ·  OK catch the sneak',
    init: init, update: update, draw: draw, keydown: keydown };
})();
