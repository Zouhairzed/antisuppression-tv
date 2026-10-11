/* Hop & Duck — a cat runs along; jump over blocks, duck under birds, grab stars. */
var Runner = (function () {
  var K = { UP: 38, DOWN: 40, ENTER: 13 };
  var W = Engine.W, H = Engine.H, FG = Engine.FG;
  var GROUND = 840, GRAVITY = 3200, JUMP_V = -1350;

  var cat, vy, onGround, ducking, things, spawnT, speed, runT;

  function init() {
    cat = { x: 340, y: GROUND - 100, w: 130, h: 100 };
    vy = 0; onGround = true; ducking = false;
    things = []; spawnT = 1.5; speed = 620; runT = 0;
  }

  function jump() { if (onGround && !ducking) { vy = JUMP_V; onGround = false; Sound.play('jump'); } }

  function keydown(k) { if (k === K.UP || k === K.ENTER) jump(); }

  function update(dt, held, st) {
    speed = Math.min(1400, 620 + st.time * 10);
    st.score += dt * 5;
    runT += dt;

    ducking = !!held[K.DOWN] && onGround;
    var h = ducking ? 55 : 100;

    if (!onGround) {
      vy += GRAVITY * dt;
      cat.y += vy * dt;
      if (cat.y + h >= GROUND) { cat.y = GROUND - h; vy = 0; onGround = true; }
    } else cat.y = GROUND - h;
    cat.h = h;

    spawnT -= dt;
    if (spawnT <= 0) {
      var r = Math.random();
      if (r < 0.45) things.push({ type: 'block', x: W, y: GROUND - 90, w: 70 + Math.random() * 40, h: 90 });
      else if (r < 0.75) things.push({ type: 'bird', x: W, y: GROUND - 175, w: 110, h: 60, flap: 0 });
      else things.push({ type: 'star', x: W, y: GROUND - 300 + Math.random() * 120, w: 70, h: 70 });
      spawnT = Math.max(0.6, 1.6 - st.time * 0.01) * (0.8 + Math.random() * 0.5);
    }

    for (var i = things.length - 1; i >= 0; i--) {
      var t = things[i];
      t.x -= speed * dt;
      if (t.flap !== undefined) t.flap += dt * 10;
      var box = { x: cat.x + 15, y: cat.y + 10, w: cat.w - 30, h: cat.h - 15 };
      if (Engine.hit(box, t)) {
        things.splice(i, 1);
        if (t.type === 'star') { st.score += 25; Sound.play('collect'); }
        else Engine.damage(st);
      } else if (t.x + t.w < 0) things.splice(i, 1);
    }
  }

  function drawCat(ctx) {
    var x = cat.x, y = cat.y, w = cat.w, h = cat.h;
    ctx.fillRect(x, y + h * 0.3, w * 0.75, h * 0.5);                   // body
    ctx.fillRect(x + w * 0.6, y, w * 0.4, h * 0.55);                   // head
    ctx.beginPath();                                                    // ears
    ctx.moveTo(x + w * 0.62, y); ctx.lineTo(x + w * 0.7, y - 22); ctx.lineTo(x + w * 0.78, y);
    ctx.moveTo(x + w * 0.84, y); ctx.lineTo(x + w * 0.92, y - 22); ctx.lineTo(x + w, y);
    ctx.fill();
    ctx.fillRect(x - 40, y + h * 0.3 - Math.sin(runT * 8) * 10, 45, 10); // tail
    var leg = Math.sin(runT * 18) * 10;                                 // legs
    ctx.fillRect(x + 10 + leg, y + h * 0.8, 14, h * 0.2);
    ctx.fillRect(x + w * 0.55 - leg, y + h * 0.8, 14, h * 0.2);
    ctx.fillStyle = Engine.BG;
    ctx.fillRect(x + w * 0.85, y + h * 0.15, 8, 8);                     // eye
    ctx.fillStyle = FG;
  }

  function drawStar(ctx, t) {
    var cx = t.x + t.w / 2, cy = t.y + t.h / 2, R = t.w / 2, r = R * 0.45;
    ctx.beginPath();
    for (var i = 0; i < 10; i++) {
      var a = -Math.PI / 2 + i * Math.PI / 5, rad = i % 2 ? r : R;
      ctx.lineTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad);
    }
    ctx.closePath(); ctx.fill();
  }

  function drawBird(ctx, t) {
    var wing = Math.sin(t.flap) * 22;
    ctx.fillRect(t.x + 20, t.y + 20, t.w - 40, 26);
    ctx.beginPath();
    ctx.moveTo(t.x + 35, t.y + 25); ctx.lineTo(t.x + 55, t.y - wing); ctx.lineTo(t.x + 75, t.y + 25);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(t.x + 20, t.y + 28); ctx.lineTo(t.x, t.y + 34); ctx.lineTo(t.x + 20, t.y + 42);
    ctx.fill();
  }

  function draw(ctx, st) {
    ctx.fillStyle = FG;
    ctx.fillRect(0, GROUND, W, 6);
    things.forEach(function (t) {
      if (t.type === 'block') ctx.fillRect(t.x, t.y, t.w, t.h);
      else if (t.type === 'bird') drawBird(ctx, t);
      else drawStar(ctx, t);
    });
    if (!Engine.blink(st)) drawCat(ctx);
  }

  return { id: 'runner', title: 'Hop & Duck', hint: '▲ / OK jump  ·  hold ▼ duck',
    init: init, update: update, draw: draw, keydown: keydown };
})();
