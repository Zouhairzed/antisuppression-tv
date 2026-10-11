/*
 * Fruit Catcher — two-eye game. Fruit and bugs fall in the weaker eye's colour; the basket
 * is drawn in the stronger eye's colour. Catch the fruit, avoid the bugs: telling them apart
 * makes the weaker eye look closely, not just notice movement.
 */
var Fruit = (function () {
  var K = { LEFT: 37, RIGHT: 39 };
  var W = Engine.W, H = Engine.H, FG = Engine.FG, BG = Engine.BG;
  var L = 120, R = W - 120, GROUND = H - 70;
  var KINDS = ['apple', 'pear', 'cherries', 'banana', 'bug'];

  var basket, items, spawnT, fallSpeed, caught, combo;

  function init() {
    basket = { x: W / 2 - 120, y: GROUND - 110, w: 240, h: 100 };
    items = []; spawnT = 0.8; fallSpeed = 230; caught = 0; combo = 0;
  }

  function update(dt, held, st) {
    var sp = 1100;
    if (held[K.LEFT]) basket.x -= sp * dt;
    if (held[K.RIGHT]) basket.x += sp * dt;
    basket.x = Math.max(L, Math.min(R - basket.w, basket.x));

    fallSpeed = Math.min(620, 230 + st.time * 4);
    spawnT -= dt;
    if (spawnT <= 0) {
      var bugChance = Math.min(0.35, 0.15 + st.time / 400);
      var kind = Math.random() < bugChance ? 'bug' : KINDS[Math.floor(Math.random() * 4)];
      items.push({ kind: kind, x: L + 60 + Math.random() * (R - L - 120), y: 150, spin: Math.random() * 6,
        v: fallSpeed * (0.85 + Math.random() * 0.3) });
      spawnT = Math.max(0.45, 1.1 - st.time / 120);
    }

    for (var i = items.length - 1; i >= 0; i--) {
      var it = items[i];
      it.y += it.v * dt;
      it.spin += dt * (it.kind === 'bug' ? 6 : 1.5);
      var inBasket = it.y + 30 >= basket.y + 10 && it.y < basket.y + 50 && it.x > basket.x + 10 && it.x < basket.x + basket.w - 10;
      if (inBasket) {
        items.splice(i, 1);
        if (it.kind === 'bug') { combo = 0; Engine.damage(st); }
        else { caught++; combo++; st.score += 10 + Math.min(combo, 10) * 2; Sound.play('collect'); }
      } else if (it.y > GROUND) {
        items.splice(i, 1);
        if (it.kind !== 'bug') combo = 0;
      }
    }
  }

  /* ---------- drawings (all in one colour; details cut out in background colour) ---------- */
  function apple(ctx, x, y, c) {
    ctx.fillStyle = c;
    ctx.beginPath(); ctx.arc(x - 12, y + 4, 26, 0, Math.PI * 2); ctx.arc(x + 12, y + 4, 26, 0, Math.PI * 2); ctx.fill();
    ctx.fillRect(x - 3, y - 34, 6, 16);
    ctx.beginPath(); ctx.ellipse(x + 14, y - 28, 14, 7, -0.5, 0, Math.PI * 2); ctx.fill();
  }
  function pear(ctx, x, y, c) {
    ctx.fillStyle = c;
    ctx.beginPath(); ctx.arc(x, y + 12, 28, 0, Math.PI * 2); ctx.arc(x, y - 14, 17, 0, Math.PI * 2); ctx.fill();
    ctx.fillRect(x - 3, y - 42, 6, 14);
  }
  function cherries(ctx, x, y, c) {
    ctx.fillStyle = c; ctx.strokeStyle = c; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(x - 16, y + 8); ctx.quadraticCurveTo(x - 6, y - 26, x + 6, y - 36);
    ctx.moveTo(x + 18, y + 8); ctx.quadraticCurveTo(x + 14, y - 20, x + 6, y - 36); ctx.stroke();
    ctx.beginPath(); ctx.arc(x - 16, y + 18, 17, 0, Math.PI * 2); ctx.arc(x + 18, y + 18, 17, 0, Math.PI * 2); ctx.fill();
  }
  function banana(ctx, x, y, c) {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.moveTo(x - 40, y - 14);
    ctx.quadraticCurveTo(x, y + 44, x + 42, y - 18);
    ctx.quadraticCurveTo(x, y + 18, x - 40, y - 14);
    ctx.fill();
    ctx.fillRect(x + 36, y - 26, 8, 10);
  }
  function bug(ctx, x, y, c, spin) {
    ctx.strokeStyle = c; ctx.lineWidth = 5; ctx.fillStyle = c;
    var wig = Math.sin(spin) * 6;
    ctx.beginPath();
    for (var i = -1; i <= 1; i++) {        // six wiggling legs
      ctx.moveTo(x - 14, y + i * 12); ctx.lineTo(x - 36, y + i * 16 + wig);
      ctx.moveTo(x + 14, y + i * 12); ctx.lineTo(x + 36, y + i * 16 - wig);
    }
    ctx.moveTo(x - 6, y - 28); ctx.lineTo(x - 14, y - 44); ctx.moveTo(x + 6, y - 28); ctx.lineTo(x + 14, y - 44);
    ctx.stroke();
    ctx.beginPath(); ctx.ellipse(x, y + 4, 20, 26, 0, 0, Math.PI * 2); ctx.arc(x, y - 24, 11, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = BG;                    // shell line and spots
    ctx.fillRect(x - 2, y - 16, 4, 44);
    ctx.beginPath(); ctx.arc(x - 9, y, 4, 0, Math.PI * 2); ctx.arc(x + 9, y + 10, 4, 0, Math.PI * 2); ctx.fill();
  }

  function draw(ctx, st) {
    var eyes = Engine.colors();
    ctx.fillStyle = FG;                    // ground (both eyes)
    ctx.fillRect(L, GROUND, R - L, 6);
    ctx.textAlign = 'left'; ctx.font = '36px Arial, sans-serif';
    ctx.fillText('Caught ' + caught + (combo > 1 ? '   ·   combo x' + Math.min(combo, 10) : ''), 96, 160);

    items.forEach(function (it) {          // weaker eye
      var c = eyes.weak;
      if (it.kind === 'apple') apple(ctx, it.x, it.y, c);
      else if (it.kind === 'pear') pear(ctx, it.x, it.y, c);
      else if (it.kind === 'cherries') cherries(ctx, it.x, it.y, c);
      else if (it.kind === 'banana') banana(ctx, it.x, it.y, c);
      else bug(ctx, it.x, it.y, c, it.spin);
    });

    if (!Engine.blink(st)) {               // basket: stronger eye
      var b = basket, c2 = eyes.strong;
      ctx.fillStyle = c2;
      ctx.beginPath();
      ctx.moveTo(b.x, b.y + 20); ctx.lineTo(b.x + b.w, b.y + 20);
      ctx.lineTo(b.x + b.w - 26, b.y + b.h); ctx.lineTo(b.x + 26, b.y + b.h); ctx.closePath(); ctx.fill();
      ctx.fillRect(b.x - 8, b.y + 8, b.w + 16, 16);
      ctx.fillStyle = BG;                  // woven pattern
      for (var i = 1; i < 6; i++) ctx.fillRect(b.x + 18 + i * (b.w - 36) / 6 - 3, b.y + 34, 6, b.h - 42);
      ctx.fillRect(b.x + 30, b.y + 56, b.w - 60, 6);
    }
  }

  return { id: 'fruit', title: 'Fruit Catcher', dichoptic: true,
    hint: '◀ ▶ move the basket  ·  catch the fruit, not the bugs',
    init: init, update: update, draw: draw };
})();
