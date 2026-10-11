/*
 * Picture Slide — two-eye sliding puzzle (no bars). A dinosaur picture is cut into tiles with one
 * gap; press an arrow to slide the tile next to the gap in that direction, until the picture is whole.
 *
 * Each dinosaur is drawn in two colours: some parts in the weaker eye's colour and the other parts
 * in the stronger eye's colour (dimmed by Strong-eye contrast), so each eye sees only part of it.
 * Tile edges and helper numbers are grey (both eyes). The goal picture is shown on the right. Puzzles 1–3 are 3 × 3, then 4 × 4. There is no way to lose a life: take your time.
 */
var Slide = (function () {
  var K = { LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40 };
  var W = Engine.W, H = Engine.H, FG = Engine.FG, BG = Engine.BG;
  var SIZE = 760, BX = 330, BY = 190;                  // board size and position
  var PX = BX + SIZE + 90, PY = BY + 60, PS = 360;      // goal preview
  var EDGE = '#8a8a8a';

  /* Dinosaurs (original drawings, viewBox 0 0 100 100). fill="A" parts use the weaker eye's colour,
     fill="B" parts the stronger eye's colour, fill="#111" details stay dark. */
  var DINOS = {
    rex: '<path fill="A" d="M6 70Q28 64 40 52Q48 43 58 40L68 26Q72 16 84 17L93 20Q98 23 96 30L92 34L80 35L77 40Q73 47 67 49Q65 60 57 67Q48 74 38 74Q22 75 6 70Z"/>' +
      '<path fill="B" d="M42 68L40 90L50 90L52 70ZM56 64L58 90L68 90L63 61ZM68 46L76 52L73 55L66 50Z"/>' +
      '<path fill="B" d="M24 62L28 54L32 60ZM34 56L39 47L42 54ZM44 49L50 40L52 47ZM56 42L62 33L63 40Z"/>' +
      '<circle fill="#111" cx="86" cy="24" r="2.5"/><path fill="#111" d="M82 32L86 33L84 35Z"/>',
    stego: '<path fill="A" d="M4 70Q18 66 28 58Q46 40 66 52Q76 58 84 59Q93 59 96 64Q93 70 84 70Q60 77 40 75Q22 75 4 70Z"/>' +
      '<path fill="B" d="M28 57L33 39L41 52ZM41 49L49 28L56 46ZM55 47L63 30L68 52ZM67 54L74 41L78 58Z"/>' +
      '<path fill="B" d="M8 68L2 58L13 66ZM14 66L9 55L19 64ZM26 72H33V90H26ZM40 74H47V90H40ZM60 73H67V90H60ZM72 70H79V88H72Z"/>' +
      '<circle fill="#111" cx="89" cy="63" r="2"/>',
    bronto: '<path fill="A" d="M22 64Q24 47 46 47Q62 47 68 55L73 38Q77 18 87 13Q96 11 96 17Q94 22 88 24Q82 30 81 44L79 61Q75 72 60 72H32Q18 72 2 78Q14 69 22 64Z"/>' +
      '<path fill="B" d="M28 70H35V92H28ZM40 70H47V92H40ZM58 70H65V92H58ZM70 66H77V90H70Z"/>' +
      '<circle fill="B" cx="40" cy="56" r="4"/><circle fill="B" cx="52" cy="53" r="3"/><circle fill="B" cx="60" cy="60" r="3.5"/>' +
      '<circle fill="#111" cx="90" cy="16" r="2"/>',
    tri: '<circle fill="B" cx="70" cy="46" r="18"/>' +
      '<path fill="A" d="M6 66Q12 49 32 47H56Q66 49 70 56L72 66Q60 75 40 75Q20 75 6 66Z"/>' +
      '<path fill="A" d="M64 50L90 52Q97 56 93 63L70 66Z"/>' +
      '<path fill="B" d="M78 50L96 37L84 53ZM86 53L99 50L90 57ZM18 70H26V90H18ZM30 72H38V90H30ZM50 72H58V90H50ZM62 68H70V88H62Z"/>' +
      '<circle fill="#111" cx="80" cy="56" r="2.2"/>'
  };
  var PICS = ['rex', 'stego', 'bronto', 'tri'];

  var n, tiles, puzzle, moves, picName, img, imgKey, solvedT, anim;

  /* The picture: a two-colour dinosaur on a ground line and with a sun, so most tiles show something */
  function picture(eyes) {
    var key = picName + eyes.weak + eyes.strong;
    if (key === imgKey) return img;
    imgKey = key;
    var svg = ('<svg xmlns="http://www.w3.org/2000/svg" width="' + SIZE + '" height="' + SIZE + '" viewBox="0 0 100 100">' +
      '<circle fill="B" cx="14" cy="16" r="8"/><path fill="A" d="M0 92H100V96H0Z"/>' +
      '<path fill="B" d="M30 14h14a5 5 0 0 1 0 10H28a4 4 0 0 1 2-10z"/>' + DINOS[picName] + '</svg>')
      .split('fill="A"').join('fill="' + eyes.weak + '"')
      .split('fill="B"').join('fill="' + eyes.strong + '"');
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
    var eyes = Engine.colors(), pic = picture(eyes), ready = pic.complete && pic.naturalWidth > 0;
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
      // Tile edge and helper number: grey, seen by both eyes
      ctx.strokeStyle = EDGE; ctx.lineWidth = 4;
      ctx.strokeRect(p.x + 4, p.y + 4, cs - 8, cs - 8);
      ctx.fillStyle = EDGE; ctx.textAlign = 'left'; ctx.font = 'bold 30px Arial, sans-serif';
      ctx.fillText(String(t + 1), p.x + 16, p.y + 46);
    }
  }

  return { id: 'slide', title: 'Picture Slide', dichoptic: true,
    hint: '◀ ▲ ▼ ▶ slide a tile into the gap  ·  rebuild the dinosaur',
    init: init, update: update, draw: draw, keydown: keydown };
})();
