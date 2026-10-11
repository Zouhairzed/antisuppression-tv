/* Shape Blaster — move the cannon, shoot falling shapes before they land. */
var Blaster = (function () {
  var K = { LEFT: 37, RIGHT: 39, ENTER: 13, UP: 38 };
  var W = Engine.W, H = Engine.H, FG = Engine.FG;
  var GROUND = H - 70;

  var p, bullets, shapes, spawnT, cool;

  function init() {
    p = { x: W / 2 - 60, y: GROUND - 90, w: 120, h: 90 };
    bullets = []; shapes = []; spawnT = 1; cool = 0;
  }

  function fire() {
    if (cool > 0) return;
    bullets.push({ x: p.x + p.w / 2 - 6, y: p.y - 40, w: 12, h: 36 });
    cool = 0.22;
  }

  function update(dt, held, st) {
    var speed = 950;
    if (held[K.LEFT]) p.x -= speed * dt;
    if (held[K.RIGHT]) p.x += speed * dt;
    p.x = Math.max(96, Math.min(W - 96 - p.w, p.x));

    cool -= dt;
    if (held[K.ENTER] || held[K.UP]) fire();

    spawnT -= dt;
    if (spawnT <= 0) {
      var size = 70 + Math.random() * 50;
      shapes.push({
        x: 120 + Math.random() * (W - 240 - size), y: 140, w: size, h: size,
        kind: Math.floor(Math.random() * 3), vy: 110 + st.time * 3 + Math.random() * 60,
        rot: 0, vr: (Math.random() - 0.5) * 2
      });
      spawnT = Math.max(0.45, 1.5 - st.time * 0.015);
    }

    bullets.forEach(function (b) { b.y -= 1400 * dt; });
    shapes.forEach(function (s) { s.y += s.vy * dt; s.rot += s.vr * dt; });

    for (var i = shapes.length - 1; i >= 0; i--) {
      var s = shapes[i];
      for (var j = bullets.length - 1; j >= 0; j--) {
        if (Engine.hit(s, bullets[j])) {
          shapes.splice(i, 1); bullets.splice(j, 1);
          st.score += 10;
          s = null; break;
        }
      }
      if (s && s.y + s.h >= GROUND) { shapes.splice(i, 1); Engine.damage(st); }
    }
    bullets = bullets.filter(function (b) { return b.y > 120; });
  }

  function drawShape(ctx, s) {
    ctx.save();
    ctx.translate(s.x + s.w / 2, s.y + s.h / 2);
    ctx.rotate(s.rot);
    ctx.beginPath();
    var r = s.w / 2;
    if (s.kind === 0) ctx.arc(0, 0, r, 0, Math.PI * 2);
    else if (s.kind === 1) ctx.rect(-r, -r, s.w, s.w);
    else { ctx.moveTo(0, -r); ctx.lineTo(r, r); ctx.lineTo(-r, r); ctx.closePath(); }
    ctx.fill();
    ctx.restore();
  }

  function draw(ctx, st) {
    ctx.fillStyle = FG;
    ctx.fillRect(0, GROUND, W, 6);
    shapes.forEach(function (s) { drawShape(ctx, s); });
    bullets.forEach(function (b) { ctx.fillRect(b.x, b.y, b.w, b.h); });
    if (!Engine.blink(st)) {
      ctx.fillRect(p.x, p.y + 40, p.w, p.h - 40);           // base
      ctx.beginPath(); ctx.arc(p.x + p.w / 2, p.y + 40, 40, Math.PI, 0); ctx.fill(); // dome
      ctx.fillRect(p.x + p.w / 2 - 10, p.y - 30, 20, 50);   // barrel
    }
  }

  return { id: 'blaster', title: 'Shape Blaster', hint: '◀ ▶ move  ·  hold OK fire',
    init: init, update: update, draw: draw };
})();
