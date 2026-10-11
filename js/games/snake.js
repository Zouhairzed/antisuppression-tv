/* Snake — steer the snake to eat food and grow; don't hit the walls or yourself. */
var Snake = (function () {
  var K = { LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40 };
  var W = Engine.W, FG = Engine.FG;
  var CELL = 60, COLS = 30, ROWS = 14;
  var OX = (W - CELL * COLS) / 2, OY = 150;

  var DIRS = {};
  DIRS[K.LEFT] = { x: -1, y: 0 }; DIRS[K.RIGHT] = { x: 1, y: 0 };
  DIRS[K.UP] = { x: 0, y: -1 }; DIRS[K.DOWN] = { x: 0, y: 1 };

  var body, dir, queue, food, stepT, freeze, eaten;

  function resetSnake() {
    body = [{ x: 8, y: 7 }, { x: 7, y: 7 }, { x: 6, y: 7 }];
    dir = DIRS[K.RIGHT];
    queue = [];
    stepT = 0;
  }

  function placeFood() {
    var free;
    do {
      free = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
    } while (body.some(function (b) { return b.x === free.x && b.y === free.y; }));
    food = free;
  }

  function init() {
    eaten = 0; freeze = 0.8;
    resetSnake();
    placeFood();
  }

  function keydown(k) {
    var d = DIRS[k];
    if (!d) return;
    var last = queue.length ? queue[queue.length - 1] : dir;
    if (d.x === -last.x && d.y === -last.y) return; // no reversing
    if (d === last) return;
    if (queue.length < 3) { queue.push(d); Sound.play('move'); }
  }

  function crash(st) {
    st.lives -= 1;
    freeze = 1.2;
    Sound.play('hurt');
    resetSnake();
  }

  function update(dt, held, st) {
    if (freeze > 0) { freeze -= dt; return; }
    var interval = Math.max(0.065, 0.14 - eaten * 0.003);
    stepT += dt;
    while (stepT >= interval) {
      stepT -= interval;
      if (queue.length) dir = queue.shift();
      var head = { x: body[0].x + dir.x, y: body[0].y + dir.y };
      var hitWall = head.x < 0 || head.y < 0 || head.x >= COLS || head.y >= ROWS;
      var willGrow = head.x === food.x && head.y === food.y;
      var bodyCheck = willGrow ? body : body.slice(0, -1);
      var hitSelf = bodyCheck.some(function (b) { return b.x === head.x && b.y === head.y; });
      if (hitWall || hitSelf) { crash(st); return; }
      body.unshift(head);
      if (willGrow) { eaten++; st.score += 10; placeFood(); Sound.play('collect'); }
      else body.pop();
    }
  }

  function draw(ctx, st) {
    ctx.strokeStyle = FG;
    ctx.lineWidth = 6;
    ctx.strokeRect(OX - 8, OY - 8, CELL * COLS + 16, CELL * ROWS + 16);

    ctx.fillStyle = FG;
    // Food
    ctx.beginPath();
    ctx.arc(OX + food.x * CELL + CELL / 2, OY + food.y * CELL + CELL / 2 + 3, CELL * 0.36, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(OX + food.x * CELL + CELL / 2 - 3, OY + food.y * CELL + 4, 6, 12); // stem

    // Snake (blinks while frozen after a crash)
    if (freeze > 0 && Math.floor(freeze * 8) % 2 === 0 && st.score + eaten > 0) return;
    body.forEach(function (b, i) {
      var pad = i === 0 ? 3 : 7;
      ctx.fillRect(OX + b.x * CELL + pad, OY + b.y * CELL + pad, CELL - 2 * pad, CELL - 2 * pad);
    });
    var h = body[0];
    ctx.fillStyle = Engine.BG;
    var cx = OX + h.x * CELL + CELL / 2, cy = OY + h.y * CELL + CELL / 2;
    var ex = dir.y !== 0 ? 12 : 0, ey = dir.x !== 0 ? 12 : 0;
    var fx = dir.x * 10, fy = dir.y * 10;
    ctx.fillRect(cx + fx - ex - 5, cy + fy - ey - 5, 10, 10);
    ctx.fillRect(cx + fx + ex - 5, cy + fy + ey - 5, 10, 10);
    ctx.fillStyle = FG;
  }

  return { id: 'snake', title: 'Snake', hint: '◀ ▲ ▼ ▶ steer',
    init: init, update: update, draw: draw, keydown: keydown };
})();
