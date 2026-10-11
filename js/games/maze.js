/*
 * Maze Mouse and Cheese Chase — guide the mouse through the maze eating crumbs while cats
 * chase it. Big cheese makes the cats scared for a few seconds so the mouse can chase them back.
 *
 * Cheese Chase is the two-eye version (no bars), with its own maze: the mouse, crumbs and cheese
 * are drawn in the weaker eye's colour, the walls and cats in the stronger eye's colour.
 */
function makeMaze(opts) {
  var K = { LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40 };
  var W = Engine.W, FG = Engine.FG, BG = Engine.BG;
  var WALL = '#9a9a9a';

  var MAP = opts.map || [
    '#########################',
    '#o..........#..........o#',
    '#.###.#####.#.#####.###.#',
    '#.......................#',
    '#.###.#.#########.#.###.#',
    '#.....#.....#.....#.....#',
    '#####.#####.#.#####.#####',
    '#.........C...C.........#',
    '#####.#.#########.#.#####',
    '#.....#.....P.....#.....#',
    '#.###.#####.#.#####.###.#',
    '#o..#.......#.......#..o#',
    '###.#.#.#########.#.#.###',
    '#.......................#',
    '#########################'
  ];
  var COLS = MAP[0].length, ROWS = MAP.length;
  var T = 56;
  var OX = (W - T * COLS) / 2, OY = 150;

  var DIRS = {};
  DIRS[K.LEFT] = { x: -1, y: 0 }; DIRS[K.RIGHT] = { x: 1, y: 0 };
  DIRS[K.UP] = { x: 0, y: -1 }; DIRS[K.DOWN] = { x: 0, y: 1 };
  var ALL = [DIRS[K.LEFT], DIRS[K.RIGHT], DIRS[K.UP], DIRS[K.DOWN]];

  var grid, crumbsLeft, mouse, cats, scared, freeze, level, startP, startC;
  var C_WALL = WALL, C_FOOD = FG, C_MOUSE = FG, C_CAT = FG;   // set per frame in draw()

  function open(x, y) { return y >= 0 && y < ROWS && x >= 0 && x < COLS && grid[y][x] !== '#'; }

  function actor(x, y, speed) {
    return { x: x, y: y, px: x, py: y, dir: { x: 0, y: 0 }, t: 0, speed: speed };
  }

  function loadMaze() {
    grid = []; crumbsLeft = 0; startC = [];
    MAP.forEach(function (row, y) {
      grid.push(row.split(''));
      row.split('').forEach(function (ch, x) {
        if (ch === 'P') { startP = { x: x, y: y }; grid[y][x] = ' '; }
        if (ch === 'C') { startC.push({ x: x, y: y }); grid[y][x] = '.'; }
        if (grid[y][x] === '.' || grid[y][x] === 'o') crumbsLeft++;
      });
    });
  }

  function resetActors() {
    var catSpeed = Math.min(6.2, 3.6 + level * 0.4);
    mouse = actor(startP.x, startP.y, 6);
    mouse.want = DIRS[K.LEFT];
    cats = startC.map(function (c, i) {
      var a = actor(c.x, c.y, catSpeed);
      a.home = c; a.smart = i === 0 ? 0.85 : 0.55; a.eaten = 0;
      return a;
    });
    scared = 0;
    freeze = 1.2;
  }

  function init() {
    level = 0;
    loadMaze();
    resetActors();
  }

  function keydown(k) { if (DIRS[k]) mouse.want = DIRS[k]; }

  // Move an actor one tile when its step timer fills; returns true on each new tile.
  function stepActor(a, dt, choose) {
    a.t += dt * a.speed;
    if (a.t < 1) return false;
    a.t -= 1;
    a.px = a.x; a.py = a.y;
    choose(a);
    if (open(a.x + a.dir.x, a.y + a.dir.y)) { a.x += a.dir.x; a.y += a.dir.y; }
    else a.t = 0;
    return true;
  }

  function chooseMouse(a) {
    if (open(a.x + a.want.x, a.y + a.want.y)) a.dir = a.want;
  }

  function chooseCat(a) {
    var opts = ALL.filter(function (d) {
      return open(a.x + d.x, a.y + d.y) && !(d.x === -a.dir.x && d.y === -a.dir.y);
    });
    if (!opts.length) opts = ALL.filter(function (d) { return open(a.x + d.x, a.y + d.y); });
    var fleeing = scared > 0 && !a.eaten;
    var tx = a.eaten ? a.home.x : mouse.x, ty = a.eaten ? a.home.y : mouse.y;
    if (a.eaten || Math.random() < (fleeing ? 0.8 : a.smart)) {
      opts.sort(function (p, q) {
        var dp = Math.abs(a.x + p.x - tx) + Math.abs(a.y + p.y - ty);
        var dq = Math.abs(a.x + q.x - tx) + Math.abs(a.y + q.y - ty);
        return fleeing ? dq - dp : dp - dq;
      });
      a.dir = opts[0];
    } else {
      a.dir = opts[Math.floor(Math.random() * opts.length)];
    }
  }

  function meets(c) {
    if (c.x === mouse.x && c.y === mouse.y) return true;
    return c.px === mouse.x && c.py === mouse.y && c.x === mouse.px && c.y === mouse.py;
  }

  function update(dt, held, st) {
    if (freeze > 0) { freeze -= dt; return; }
    if (scared > 0) scared -= dt;

    if (stepActor(mouse, dt, chooseMouse)) {
      var ch = grid[mouse.y][mouse.x];
      if (ch === '.') { grid[mouse.y][mouse.x] = ' '; crumbsLeft--; st.score += 1; Sound.play('tick'); }
      if (ch === 'o') {
        grid[mouse.y][mouse.x] = ' '; crumbsLeft--; st.score += 5;
        scared = 7;
        Sound.play('power');
        cats.forEach(function (c) { c.dir = { x: -c.dir.x, y: -c.dir.y }; });
      }
    }

    cats.forEach(function (c) {
      var base = c.eaten ? 9 : (scared > 0 ? 2.6 : Math.min(6.2, 3.6 + level * 0.4));
      c.speed = base;
      stepActor(c, dt, chooseCat);
      if (c.eaten && c.x === c.home.x && c.y === c.home.y) c.eaten = 0;
    });

    for (var i = 0; i < cats.length; i++) {
      var c = cats[i];
      if (c.eaten || !meets(c)) continue;
      if (scared > 0) { c.eaten = 1; st.score += 50; Sound.play('collect'); }
      else { st.lives -= 1; Sound.play('hurt'); resetActors(); return; }
    }

    if (crumbsLeft <= 0) {
      st.score += 100;
      level++;
      Sound.play('level');
      loadMaze();
      resetActors();
    }
  }

  function pos(a) {
    var f = Math.min(1, a.t);
    var moved = a.x !== a.px || a.y !== a.py;
    var x = moved ? a.px + (a.x - a.px) * f : a.x;
    var y = moved ? a.py + (a.y - a.py) * f : a.y;
    return { x: OX + x * T + T / 2, y: OY + y * T + T / 2 };
  }

  function drawMouse(ctx) {
    var p = pos(mouse), d = mouse.dir.x || mouse.dir.y ? mouse.dir : mouse.want;
    var ang = Math.atan2(d.y, d.x);
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(ang);
    ctx.fillStyle = C_MOUSE;
    ctx.beginPath(); ctx.ellipse(-2, 0, 20, 14, 0, 0, Math.PI * 2); ctx.fill();   // body
    ctx.beginPath(); ctx.moveTo(14, -9); ctx.lineTo(27, 0); ctx.lineTo(14, 9); ctx.fill(); // snout
    ctx.beginPath(); ctx.arc(6, -14, 8, 0, Math.PI * 2); ctx.arc(6, 14, 8, 0, Math.PI * 2); ctx.fill(); // ears
    ctx.strokeStyle = C_MOUSE; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-20, 0); ctx.quadraticCurveTo(-30, 10, -27, 18); ctx.stroke(); // tail
    ctx.fillStyle = BG;
    ctx.beginPath(); ctx.arc(14, -5, 3, 0, Math.PI * 2); ctx.arc(14, 5, 3, 0, Math.PI * 2); ctx.fill(); // eyes
    ctx.restore();
  }

  function drawCat(ctx, c) {
    var p = pos(c);
    var flash = scared > 0 && scared < 2 && Math.floor(scared * 6) % 2 === 0;
    var hollow = (scared > 0 && !c.eaten) && !flash;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.fillStyle = C_CAT; ctx.strokeStyle = C_CAT; ctx.lineWidth = 4;
    if (c.eaten) { // only eyes travel home
      ctx.beginPath(); ctx.arc(-8, -2, 6, 0, Math.PI * 2); ctx.arc(8, -2, 6, 0, Math.PI * 2); ctx.fill();
      ctx.restore(); return;
    }
    ctx.beginPath();
    ctx.moveTo(-22, 22); ctx.lineTo(-22, -6);
    ctx.lineTo(-20, -24); ctx.lineTo(-8, -14);   // left ear
    ctx.lineTo(8, -14); ctx.lineTo(20, -24);     // right ear
    ctx.lineTo(22, -6); ctx.lineTo(22, 22);
    ctx.closePath();
    if (hollow) ctx.stroke(); else ctx.fill();
    if (!hollow) {
      ctx.fillStyle = BG;
      ctx.fillRect(-12, -4, 7, 9); ctx.fillRect(5, -4, 7, 9);  // eyes
      ctx.fillRect(-3, 8, 6, 4);                               // nose
    }
    ctx.restore();
  }

  function draw(ctx, st) {
    var eyes = opts.dichoptic ? Engine.colors() : null;
    C_WALL = eyes ? eyes.strong : WALL; C_CAT = eyes ? eyes.strong : FG;
    C_FOOD = eyes ? eyes.weak : FG; C_MOUSE = eyes ? eyes.weak : FG;
    for (var y = 0; y < ROWS; y++) {
      for (var x = 0; x < COLS; x++) {
        var ch = grid[y][x], px = OX + x * T, py = OY + y * T;
        if (ch === '#') {
          ctx.fillStyle = C_WALL;
          ctx.fillRect(px + 4, py + 4, T - 8, T - 8);
          if (open(x + 1, y) === false && x + 1 < COLS) ctx.fillRect(px + T - 4, py + 4, 8, T - 8);
          if (open(x, y + 1) === false && y + 1 < ROWS) ctx.fillRect(px + 4, py + T - 4, T - 8, 8);
        } else if (ch === '.') {
          ctx.fillStyle = C_FOOD;
          ctx.fillRect(px + T / 2 - 5, py + T / 2 - 5, 10, 10);
        } else if (ch === 'o') { // cheese wedge
          ctx.fillStyle = C_FOOD;
          ctx.beginPath();
          ctx.moveTo(px + 10, py + T - 14); ctx.lineTo(px + T - 10, py + T - 14); ctx.lineTo(px + T - 10, py + 14);
          ctx.closePath(); ctx.fill();
        }
      }
    }
    cats.forEach(function (c) { drawCat(ctx, c); });
    if (!(freeze > 0 && Math.floor(freeze * 8) % 2 === 0 && st.time > 1.5)) drawMouse(ctx);
    if (level > 0) {
      ctx.fillStyle = FG; ctx.font = 'bold 44px Arial, sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('Level ' + (level + 1), 520, 100);
    }
  }

  return { id: opts.id, title: opts.title, dichoptic: !!opts.dichoptic,
    hint: '◀ ▲ ▼ ▶ move  ·  big cheese scares the cats',
    init: init, update: update, draw: draw, keydown: keydown,
    _map: MAP };
}

var Maze = makeMaze({ id: 'maze', title: 'Maze Mouse' });

var CheeseChase = makeMaze({ id: 'chase', title: 'Cheese Chase', dichoptic: true, map: [
  '#########################',
  '#o.........#.#.........o#',
  '#.##.####..#.#..####.##.#',
  '#.#......#.....#......#.#',
  '#.#.####.#.###.#.####.#.#',
  '#...#..........C....#...#',
  '###.#.###.##.##.###.#.###',
  '#.......#...P...#.......#',
  '###.#.###.##.##.###.#.###',
  '#...#....C..........#...#',
  '#.#.####.#.###.#.####.#.#',
  '#.#......#.....#......#.#',
  '#.##.####..#.#..####.##.#',
  '#o.........#.#.........o#',
  '#########################'
] });
