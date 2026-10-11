/*
 * Picture Slide — two-eye sliding puzzle (no bars). A picture is cut into tiles with one gap;
 * press an arrow to slide the tile next to the gap in that direction, until the picture is whole.
 *
 * The picture pieces are drawn in the weaker eye's colour; the tile edges and the small helper
 * numbers in the stronger eye's colour (dimmed by Strong-eye contrast). The goal picture is shown
 * on the right. Puzzles 1–3 are 3 × 3, then 4 × 4. There is no way to lose a life: take your time.
 */
var Slide = (function () {
  var K = { LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40 };
  var W = Engine.W, H = Engine.H, FG = Engine.FG, BG = Engine.BG;
  var SIZE = 760, BX = 330, BY = 190;                  // board size and position
  var PX = BX + SIZE + 90, PY = BY + 60, PS = 360;      // goal preview
  var PICS = ['robot', 'penguin', 'sunflower', 'lighthouse', 'cow', 'snail', 'kite', 'cake',
    'camel', 'crocodile', 'tortoise', 'bathtub'];

  var n, tiles, puzzle, moves, picName, img, imgKey, solvedT, anim;

  /* The picture: a story drawing, recoloured for the weaker eye, with a frame so edge tiles show something */
  function picture(color) {
    var key = picName + color;
    if (key === imgKey) return img;
    imgKey = key;
    var svg = STORY_ART[picName]
      .replace('<svg viewBox="0 0 64 64"', '<svg xmlns="http://www.w3.org/2000/svg" width="' + SIZE + '" height="' + SIZE + '" viewBox="0 0 64 64"')
      .split('#f2f2f2').join(color)
      .replace('</svg>', '<rect x="1.5" y="1.5" width="61" height="61" rx="4" fill="none" stroke="' + color + '" stroke-width="1.5"/></svg>');
    img = new Image();
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    return img;
  }

  function solved() {
    for (var i = 0; i < n * n - 1; i++) if (tiles[i] !== i) return false;
    return true;
  }

  function gapPos() { return tiles.indexOf(-1); }

  // Slide the tile next to the gap in the arrow's direction; returns true if a tile moved
  function slide(k, animate) {
    var g = gapPos(), gr = Math.floor(g / n), gc = g % n, r = gr, c = gc;
    if (k === K.LEFT) c = gc + 1;        // the tile right of the gap moves left
    if (k === K.RIGHT) c = gc - 1;
    if (k === K.UP) r = gr + 1;
    if (k === K.DOWN) r = gr - 1;
    if (r < 0 || r >= n || c < 0 || c >= n) return false;
    var from = r * n + c;
    if (animate) anim = { tile: tiles[from], from: from, to: g, t: 0 };
    tiles[g] = tiles[from];
    tiles[from] = -1;
    return true;
  }

  function newPuzzle() {
    puzzle++;
    n = puzzle <= 3 ? 3 : 4;
    picName = PICS[(puzzle - 1) % PICS.length];
    tiles = [];
    for (var i = 0; i < n * n - 1; i++) tiles.push(i);
    tiles.push(-1);
    // Shuffle with random legal moves (always solvable), never undoing the previous move
    var keys = [K.LEFT, K.RIGHT, K.UP, K.DOWN], opposite = {}, last = 0;
    opposite[K.LEFT] = K.RIGHT; opposite[K.RIGHT] = K.LEFT; opposite[K.UP] = K.DOWN; opposite[K.DOWN] = K.UP;
    var count = n * n * 25;
    while (count > 0 || solved()) {
      var k = keys[Math.floor(Math.random() * 4)];
      if (k === opposite[last]) continue;
      if (slide(k, false)) { last = k; count--; }
    }
    moves = 0; solvedT = 0; anim = null;
  }

  function init() { puzzle = 0; newPuzzle(); }

  function keydown(k, st, repeat) {
    if (repeat || solvedT > 0 || anim) return;
    if (!slide(k, true)) return;
    moves++;
    Sound.play('move');
    if (solved()) {
      st.score += Math.max(50, 300 - moves * 2) * (n - 2);
      solvedT = 2.4;
      Sound.play('level');
    }
  }

  function update(dt) {
    if (anim) { anim.t += dt / 0.12; if (anim.t >= 1) anim = null; }
    if (solvedT > 0) { solvedT -= dt; if (solvedT <= 0) newPuzzle(); }
  }

  function cellXY(pos) {
    var cs = SIZE / n;
    return { x: BX + (pos % n) * cs, y: BY + Math.floor(pos / n) * cs };
  }

  function draw(ctx) {
    var eyes = Engine.colors(), pic = picture(eyes.weak), ready = pic.complete && pic.naturalWidth > 0;
    var cs = SIZE / n, src = SIZE / n;

    // Text and frames (both eyes)
    ctx.fillStyle = FG; ctx.textAlign = 'left'; ctx.font = '36px Arial, sans-serif';
    ctx.fillText('Puzzle ' + puzzle, 96, 160);
    ctx.fillText('Moves ' + moves, 96, 210);
    ctx.strokeStyle = FG; ctx.lineWidth = 4;
    ctx.strokeRect(BX - 10, BY - 10, SIZE + 20, SIZE + 20);
    ctx.fillText('Goal', PX, PY - 20);
    ctx.strokeRect(PX - 6, PY - 6, PS + 12, PS + 12);
    if (ready) ctx.drawImage(pic, PX, PY, PS, PS);

    if (solvedT > 0) {                                  // whole picture, no tile edges
      if (ready) ctx.drawImage(pic, BX, BY, SIZE, SIZE);
      ctx.fillStyle = 'rgba(0,0,0,0.65)';
      ctx.fillRect(BX, BY + SIZE / 2 - 70, SIZE, 120);
      ctx.fillStyle = FG; ctx.textAlign = 'center'; ctx.font = 'bold 64px Arial, sans-serif';
      ctx.fillText('Solved in ' + moves + ' moves!', BX + SIZE / 2, BY + SIZE / 2 + 12);
      return;
    }

    for (var pos = 0; pos < tiles.length; pos++) {
      var t = tiles[pos];
      if (t < 0) continue;
      var p = cellXY(pos);
      if (anim && anim.tile === t) {                    // slide smoothly into place
        var a = cellXY(anim.from), e = Math.min(1, anim.t);
        p = { x: a.x + (p.x - a.x) * e, y: a.y + (p.y - a.y) * e };
      }
      if (ready) ctx.drawImage(pic, (t % n) * src, Math.floor(t / n) * src, src, src, p.x + 4, p.y + 4, cs - 8, cs - 8);
      // Tile edge and helper number: stronger eye
      ctx.strokeStyle = eyes.strong; ctx.lineWidth = 5;
      ctx.strokeRect(p.x + 4, p.y + 4, cs - 8, cs - 8);
      ctx.fillStyle = eyes.strong; ctx.textAlign = 'left'; ctx.font = 'bold 34px Arial, sans-serif';
      ctx.fillText(String(t + 1), p.x + 16, p.y + 46);
    }
  }

  return { id: 'slide', title: 'Picture Slide', dichoptic: true,
    hint: '◀ ▲ ▼ ▶ slide a tile into the gap  ·  rebuild the picture',
    init: init, update: update, draw: draw, keydown: keydown };
})();
