/*
 * Block Drop — falling-blocks puzzle. Move and rotate the falling pieces to fill
 * complete rows; full rows clear. If the stack reaches the top you lose a life
 * and the board is cleared (the score is kept).
 */
var Blocks = (function () {
  var K = { LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, ENTER: 13 };
  var W = Engine.W, FG = Engine.FG, BG = Engine.BG;
  var COLS = 10, ROWS = 20, C = 42;
  var OX = (W - COLS * C) / 2, OY = 170;

  var SHAPES = {
    I: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
    O: [[1, 1], [1, 1]],
    T: [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
    S: [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
    Z: [[1, 1, 0], [0, 1, 1], [0, 0, 0]],
    J: [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
    L: [[0, 0, 1], [1, 1, 1], [0, 0, 0]]
  };
  var LINE_POINTS = [0, 10, 30, 50, 80];

  var board, piece, nextId, bag, fallT, lines, level, dasKey, das, flash;

  function emptyBoard() {
    var b = [];
    for (var y = 0; y < ROWS; y++) { b.push([]); for (var x = 0; x < COLS; x++) b[y].push(0); }
    return b;
  }

  function rotateCW(m) {
    var n = m.length, r = [];
    for (var y = 0; y < n; y++) { r.push([]); for (var x = 0; x < n; x++) r[y].push(m[n - 1 - x][y]); }
    return r;
  }

  function fits(m, px, py) {
    for (var y = 0; y < m.length; y++) {
      for (var x = 0; x < m.length; x++) {
        if (!m[y][x]) continue;
        var bx = px + x, by = py + y;
        if (bx < 0 || bx >= COLS || by >= ROWS) return false;
        if (by >= 0 && board[by][bx]) return false;
      }
    }
    return true;
  }

  // "7-bag": every piece appears once in each set of seven, in random order
  function fromBag() {
    if (!bag.length) {
      bag = Object.keys(SHAPES);
      for (var i = bag.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1)), t = bag[i]; bag[i] = bag[j]; bag[j] = t;
      }
    }
    return bag.pop();
  }

  function spawn(st) {
    var id = nextId;
    nextId = fromBag();
    var m = SHAPES[id];
    piece = { m: m, x: Math.floor((COLS - m.length) / 2), y: id === 'I' ? -1 : 0 };
    if (!fits(piece.m, piece.x, piece.y)) topOut(st);
  }

  function topOut(st) {
    st.lives -= 1;
    Sound.play('hurt');
    board = emptyBoard();
    flash = 0.6;
  }

  function init() {
    board = emptyBoard();
    bag = [];
    lines = 0; level = 1; fallT = 0; dasKey = 0; das = 0; flash = 0;
    nextId = fromBag();
    spawn(null);
  }

  function shift(dir, quiet) {
    if (fits(piece.m, piece.x + dir, piece.y)) {
      piece.x += dir;
      if (!quiet) Sound.play('move');
    }
  }

  function rotatePiece() {
    var r = rotateCW(piece.m);
    var kicks = [0, -1, 1, -2, 2];       // nudge sideways if the rotation hits a wall
    for (var i = 0; i < kicks.length; i++) {
      if (fits(r, piece.x + kicks[i], piece.y)) {
        piece.m = r; piece.x += kicks[i];
        Sound.play('move');
        return;
      }
    }
  }

  function lock(st) {
    var m = piece.m, above = false;
    for (var y = 0; y < m.length; y++) {
      for (var x = 0; x < m.length; x++) {
        if (!m[y][x]) continue;
        var by = piece.y + y;
        if (by < 0) above = true; else board[by][piece.x + x] = 1;
      }
    }
    if (above) { topOut(st); spawn(st); return; }

    var cleared = 0;
    for (var row = ROWS - 1; row >= 0; row--) {
      if (board[row].every(function (c) { return c; })) {
        board.splice(row, 1);
        board.unshift(emptyBoard()[0]);
        cleared++;
        row++;                             // re-check the row that moved down
      }
    }
    if (cleared) {
      st.score += LINE_POINTS[cleared] * level;
      lines += cleared;
      Sound.play(cleared === 4 ? 'power' : 'collect');
      var newLevel = Math.floor(lines / 10) + 1;
      if (newLevel > level) { level = newLevel; Sound.play('level'); }
    } else {
      Sound.play('tick');
    }
    spawn(st);
  }

  function keydown(k, st, repeat) {
    if (repeat) return;                    // held keys are handled in update()
    if (k === K.LEFT || k === K.RIGHT) {
      shift(k === K.LEFT ? -1 : 1);
      dasKey = k; das = 0.17;              // auto-repeat after a short delay
    }
    if (k === K.UP || k === K.ENTER) rotatePiece();
  }

  function update(dt, held, st) {
    if (flash > 0) flash -= dt;

    if (dasKey && held[dasKey]) {
      das -= dt;
      while (das <= 0) { shift(dasKey === K.LEFT ? -1 : 1, true); das += 0.05; }
    } else {
      dasKey = 0;
    }

    var soft = !!held[K.DOWN];
    var interval = soft ? 0.035 : Math.max(0.08, 0.75 - (level - 1) * 0.065);
    fallT += dt;
    while (fallT >= interval) {
      fallT -= interval;
      if (fits(piece.m, piece.x, piece.y + 1)) {
        piece.y++;
        if (soft) st.score += 0.2;
      } else {
        lock(st);
        fallT = 0;
        break;
      }
    }
  }

  function cell(ctx, px, py, size) {
    ctx.fillStyle = FG;
    ctx.fillRect(px + 3, py + 3, size - 6, size - 6);
    ctx.fillStyle = BG;
    ctx.fillRect(px + size * 0.35, py + size * 0.35, size * 0.3, size * 0.3);
  }

  function draw(ctx) {
    // Frame
    ctx.strokeStyle = FG;
    ctx.lineWidth = 6;
    ctx.strokeRect(OX - 8, OY - 8, COLS * C + 16, ROWS * C + 16);

    // Settled blocks
    for (var y = 0; y < ROWS; y++) {
      for (var x = 0; x < COLS; x++) if (board[y][x]) cell(ctx, OX + x * C, OY + y * C, C);
    }

    // Ghost: where the piece will land
    var gy = piece.y;
    while (fits(piece.m, piece.x, gy + 1)) gy++;
    ctx.strokeStyle = 'rgba(242,242,242,0.35)';
    ctx.lineWidth = 3;
    eachCell(piece.m, function (x, y) {
      if (gy + y >= 0) ctx.strokeRect(OX + (piece.x + x) * C + 5, OY + (gy + y) * C + 5, C - 10, C - 10);
    });

    // Falling piece
    eachCell(piece.m, function (x, y) {
      if (piece.y + y >= 0) cell(ctx, OX + (piece.x + x) * C, OY + (piece.y + y) * C, C);
    });

    // Flash when the stack reached the top
    if (flash > 0) {
      ctx.fillStyle = 'rgba(242,242,242,' + (flash * 0.5) + ')';
      ctx.fillRect(OX, OY, COLS * C, ROWS * C);
    }

    // Side panels: lines and level on the left, next piece on the right
    ctx.fillStyle = FG;
    ctx.textAlign = 'right';
    ctx.font = '36px Arial, sans-serif';
    ctx.fillText('Lines', OX - 70, OY + 60);
    ctx.fillText('Level', OX - 70, OY + 200);
    ctx.font = 'bold 64px Arial, sans-serif';
    ctx.fillText(String(lines), OX - 70, OY + 130);
    ctx.fillText(String(level), OX - 70, OY + 270);

    var nx = OX + COLS * C + 70;
    ctx.textAlign = 'left';
    ctx.font = '36px Arial, sans-serif';
    ctx.fillText('Next', nx, OY + 60);
    var nm = SHAPES[nextId], ns = 36;
    eachCell(nm, function (x, y) { cell(ctx, nx + x * ns, OY + 100 + y * ns, ns); });
  }

  function eachCell(m, fn) {
    for (var y = 0; y < m.length; y++) for (var x = 0; x < m.length; x++) if (m[y][x]) fn(x, y);
  }

  return { id: 'blocks', title: 'Block Drop', hint: '◀ ▶ move  ·  ▲ / OK rotate  ·  hold ▼ drop faster',
    init: init, update: update, draw: draw, keydown: keydown };
})();
