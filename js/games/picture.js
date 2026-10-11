/*
 * Hidden Picture — two-eye game. A shape is hidden in a field of dots. The dots are split
 * into patches: some patches are drawn for the weaker eye, the rest for the stronger eye,
 * so each eye alone sees only broken pieces; together they show the whole shape.
 * Pick the matching shape from three choices. Later rounds add more background dots.
 */
var Picture = (function () {
  var K = { LEFT: 37, RIGHT: 39, ENTER: 13 };
  var W = Engine.W, H = Engine.H, FG = Engine.FG, BG = Engine.BG;
  var FW = 1000, FH = 640, FX = (W - FW) / 2, FY = 150;
  var STEP = 18, PATCH = 3;                // dot spacing, patch size (in dots)

  /* Shapes, drawn on an offscreen canvas centred at (0,0) at size ~460 px */
  var SHAPES = {
    circle: function (c) { c.beginPath(); c.arc(0, 0, 220, 0, Math.PI * 2); c.fill(); },
    square: function (c) { c.fillRect(-200, -200, 400, 400); },
    triangle: function (c) { c.beginPath(); c.moveTo(0, -230); c.lineTo(240, 200); c.lineTo(-240, 200); c.closePath(); c.fill(); },
    star: function (c) {
      c.beginPath();
      for (var i = 0; i < 10; i++) {
        var a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 100 : 240;
        c.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      c.closePath(); c.fill();
    },
    heart: function (c) {
      c.beginPath(); c.moveTo(0, 210);
      c.bezierCurveTo(-300, 20, -170, -230, 0, -90);
      c.bezierCurveTo(170, -230, 300, 20, 0, 210); c.fill();
    },
    moon: function (c) {                  // crescent: the big circle minus an offset circle
      c.save();
      c.beginPath(); c.arc(0, 0, 220, 0, Math.PI * 2); c.clip();
      c.beginPath(); c.rect(-240, -240, 480, 480); c.arc(100, -50, 190, 0, Math.PI * 2); c.fill('evenodd');
      c.restore();
    },
    house: function (c) {
      c.beginPath(); c.moveTo(0, -230); c.lineTo(240, -20); c.lineTo(-240, -20); c.closePath(); c.fill();
      c.fillRect(-170, -30, 340, 240);
    },
    fish: function (c) {
      c.beginPath(); c.ellipse(-30, 0, 170, 110, 0, 0, Math.PI * 2); c.fill();
      c.beginPath(); c.moveTo(110, 0); c.lineTo(240, -110); c.lineTo(240, 110); c.closePath(); c.fill();
    },
    arrow: function (c) {
      c.fillRect(-220, -60, 260, 120);
      c.beginPath(); c.moveTo(20, -170); c.lineTo(230, 0); c.lineTo(20, 170); c.closePath(); c.fill();
    },
    cross: function (c) { c.fillRect(-70, -220, 140, 440); c.fillRect(-220, -70, 440, 140); }
  };
  var NAMES = { circle: 'Circle', square: 'Square', triangle: 'Triangle', star: 'Star', heart: 'Heart',
    moon: 'Moon', house: 'House', fish: 'Fish', arrow: 'Arrow', cross: 'Cross' };
  var KEYS = Object.keys(SHAPES);

  var round, answer, choices, pick, dots, result, resultT, mask;

  function sampleMask(name) {
    var cv = document.createElement('canvas');
    cv.width = FW; cv.height = FH;
    var c = cv.getContext('2d');
    c.fillStyle = '#fff';
    c.translate(FW / 2, FH / 2);
    if (name === 'arrow' && Math.random() < 0.5) c.rotate(Math.PI);   // left or right
    SHAPES[name](c);
    return c.getImageData(0, 0, FW, FH).data;
  }

  function newRound() {
    round++;
    answer = KEYS[Math.floor(Math.random() * KEYS.length)];
    choices = [answer];
    while (choices.length < 3) {
      var k = KEYS[Math.floor(Math.random() * KEYS.length)];
      if (choices.indexOf(k) < 0) choices.push(k);
    }
    choices.sort(function () { return Math.random() - 0.5; });
    pick = 1;
    result = null; resultT = 0;

    mask = sampleMask(answer);
    var noise = Math.min(0.32, 0.06 + round * 0.025);    // background dots grow each round
    var cols = Math.floor(FW / STEP), rows = Math.floor(FH / STEP);
    var patchEye = {};
    dots = [];
    for (var gy = 0; gy < rows; gy++) {
      for (var gx = 0; gx < cols; gx++) {
        var x = gx * STEP + STEP / 2 + (Math.random() - 0.5) * 8;
        var y = gy * STEP + STEP / 2 + (Math.random() - 0.5) * 8;
        var px = Math.max(0, Math.min(FW - 1, Math.round(x))), py = Math.max(0, Math.min(FH - 1, Math.round(y)));
        var inside = mask[(py * FW + px) * 4 + 3] > 128;
        if (inside ? Math.random() < 0.8 : Math.random() < noise) {
          var pk = Math.floor(gx / PATCH) + ',' + Math.floor(gy / PATCH);
          if (!(pk in patchEye)) patchEye[pk] = Math.random() < 0.5 ? 'weak' : 'strong';
          dots.push({ x: FX + x, y: FY + y, eye: patchEye[pk] });
        }
      }
    }
  }

  function init() { round = 0; newRound(); }

  function keydown(k, st, repeat) {
    if (repeat || result) return;
    if (k === K.LEFT) { pick = (pick + 2) % 3; Sound.play('nav'); }
    if (k === K.RIGHT) { pick = (pick + 1) % 3; Sound.play('nav'); }
    if (k === K.ENTER) {
      if (choices[pick] === answer) {
        result = 'right'; st.score += 20 + round * 2; Sound.play('collect');
      } else {
        result = 'wrong'; Engine.damage(st);
      }
      resultT = result === 'right' ? 1.0 : 2.0;
    }
  }

  function update(dt) {
    if (result) {
      resultT -= dt;
      if (resultT <= 0) newRound();
    }
  }

  function drawChoice(ctx, i) {
    var bw = 360, bh = 150, gap = 40, x0 = W / 2 - (3 * bw + 2 * gap) / 2, x = x0 + i * (bw + gap), y = FY + FH + 36;
    var focused = i === pick;
    ctx.strokeStyle = FG; ctx.lineWidth = focused ? 8 : 3;
    ctx.strokeRect(x, y, bw, bh);
    // small white icon of the shape (both eyes)
    ctx.save();
    ctx.translate(x + 80, y + bh / 2); ctx.scale(0.22, 0.22);
    ctx.fillStyle = FG;
    SHAPES[choices[i]](ctx);
    ctx.restore();
    ctx.fillStyle = FG; ctx.textAlign = 'left'; ctx.font = (focused ? 'bold ' : '') + '44px Arial, sans-serif';
    ctx.fillText(NAMES[choices[i]], x + 150, y + bh / 2 + 16);
  }

  function draw(ctx) {
    var eyes = Engine.colors();
    ctx.fillStyle = FG; ctx.textAlign = 'left'; ctx.font = '36px Arial, sans-serif';
    ctx.fillText('Picture ' + round, 96, 160);
    ctx.strokeStyle = FG; ctx.lineWidth = 3;                    // frame (both eyes)
    ctx.strokeRect(FX - 10, FY - 10, FW + 20, FH + 20);

    dots.forEach(function (d) {
      ctx.fillStyle = d.eye === 'weak' ? eyes.weak : eyes.strong;
      ctx.fillRect(d.x - 5, d.y - 5, 10, 10);
    });

    if (result) {                           // show the answer in white for both eyes
      ctx.save(); ctx.globalAlpha = 0.35; ctx.fillStyle = FG;
      ctx.translate(FX + FW / 2, FY + FH / 2);
      SHAPES[answer](ctx);
      ctx.restore();
      ctx.fillStyle = FG; ctx.textAlign = 'center'; ctx.font = 'bold 64px Arial, sans-serif';
      ctx.fillText(result === 'right' ? 'Yes, a ' + NAMES[answer].toLowerCase() + '!' : 'It was a ' + NAMES[answer].toLowerCase(), W / 2, FY + 70);
    }
    for (var i = 0; i < 3; i++) drawChoice(ctx, i);
  }

  return { id: 'picture', title: 'Hidden Picture', dichoptic: true,
    hint: '◀ ▶ choose the shape  ·  OK answer',
    init: init, update: update, draw: draw, keydown: keydown };
})();
