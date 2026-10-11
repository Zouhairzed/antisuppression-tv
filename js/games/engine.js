/*
 * Tiny game engine shared by all games.
 * Games are drawn in light neutral tones on a dark background so the
 * red/green bar overlay splits every object between the two eyes —
 * the player needs both eyes to see each object completely.
 */
var Engine = (function () {
  var W = 1920, H = 1080;
  var BG = '#111111';
  var FG = '#f2f2f2';

  var KEY = { ENTER: 13, PAUSE: 19, PLAY: 415, YELLOW: 405 };

  var ctx, game, raf = null, last = 0, held = {}, state;
  // Colours for two-eye games: what only the weaker eye sees, and what only the stronger eye sees
  var eyes = { weak: '#9b1819', strong: '#1a9b1c' };

  function loadBest(id) {
    try { return parseInt(localStorage.getItem('asb.best.' + id), 10) || 0; } catch (e) { return 0; }
  }
  function saveBest(id, v) {
    try { localStorage.setItem('asb.best.' + id, String(v)); } catch (e) { /* ignore */ }
  }

  function reset() {
    state = { score: 0, lives: 3, time: 0, over: false, paused: false, best: loadBest(game.id), invuln: 0 };
    game.init(state);
    Sound.music(true, game.id);   // each game has its own theme
  }

  /* Mouse, touch and Magic Remote pointer, for games that have a pointer(type, x, y, state)
     handler. Positions are converted to the 1920 × 1080 game space (the web version scales it). */
  var bound = null;
  function bindPointer(canvas) {
    if (bound === canvas) return;
    bound = canvas;
    function send(type, cx, cy) {
      if (!game || !game.pointer || state.over || state.paused) return false;
      var r = canvas.getBoundingClientRect();
      game.pointer(type, (cx - r.left) * W / r.width, (cy - r.top) * H / r.height, state);
      return true;
    }
    canvas.addEventListener('mousedown', function (e) { send('down', e.clientX, e.clientY); });
    window.addEventListener('mousemove', function (e) { send('move', e.clientX, e.clientY); });
    window.addEventListener('mouseup', function (e) { send('up', e.clientX, e.clientY); });
    canvas.addEventListener('touchstart', function (e) {
      if (send('down', e.touches[0].clientX, e.touches[0].clientY)) e.preventDefault();
    });
    canvas.addEventListener('touchmove', function (e) {
      if (send('move', e.touches[0].clientX, e.touches[0].clientY)) e.preventDefault();
    });
    canvas.addEventListener('touchend', function (e) {
      if (send('up', e.changedTouches[0].clientX, e.changedTouches[0].clientY)) e.preventDefault();
    });
  }

  function start(canvas, g) {
    stop();
    bindPointer(canvas);
    ctx = canvas.getContext('2d');
    game = g;
    held = {};
    reset();
    last = performance.now();
    raf = requestAnimationFrame(loop);
  }

  function stop() {
    if (raf) cancelAnimationFrame(raf);
    raf = null;
    game = null;
    Sound.music(false);
  }

  function end() {
    state.over = true;
    var s = Math.floor(state.score);
    if (s > state.best) { state.best = s; saveBest(game.id, s); }
    Sound.music(false);
    Sound.play('gameover');
  }

  function loop(t) {
    if (!game) return;
    var dt = Math.min(0.05, (t - last) / 1000);
    last = t;
    Sound.setPaused(state.paused);

    if (!state.over && !state.paused) {
      state.time += dt;
      if (state.invuln > 0) state.invuln -= dt;
      game.update(dt, held, state);
      if (state.lives <= 0) end();
    }

    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, W, H);
    game.draw(ctx, state);
    drawHud();
    if (state.over) overlay('Game over', 'Score ' + Math.floor(state.score) + '   ·   Best ' + state.best, 'OK play again  ·  BACK menu');
    else if (state.paused) overlay('Paused', '', 'OK / YELLOW resume  ·  BACK menu');

    raf = requestAnimationFrame(loop);
  }

  function drawHud() {
    ctx.fillStyle = FG;
    ctx.font = 'bold 44px Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Score ' + Math.floor(state.score), 96, 100);
    ctx.textAlign = 'center';
    var m = Math.floor(state.time / 60), s = Math.floor(state.time % 60);
    ctx.fillText(m + ':' + (s < 10 ? '0' : '') + s, W / 2, 100);
    ctx.textAlign = 'right';
    var hearts = '';
    for (var i = 0; i < state.lives; i++) hearts += '♥ ';
    ctx.fillText(hearts, W - 96, 100);
  }

  function overlay(title, sub, hint) {
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = FG;
    ctx.textAlign = 'center';
    ctx.font = 'bold 110px Arial, sans-serif';
    ctx.fillText(title, W / 2, H / 2 - 40);
    ctx.font = '50px Arial, sans-serif';
    if (sub) ctx.fillText(sub, W / 2, H / 2 + 50);
    ctx.font = '36px Arial, sans-serif';
    ctx.fillText(hint, W / 2, H / 2 + 140);
  }

  function pause(p) { if (state && !state.over) state.paused = p; }

  function keydown(k) {
    if (!game) return;
    if (state.over) { if (k === KEY.ENTER) reset(); return; }
    if (k === KEY.YELLOW || k === KEY.PAUSE || k === KEY.PLAY) { state.paused = !state.paused; return; }
    if (state.paused) { if (k === KEY.ENTER) state.paused = false; return; }
    var repeat = !!held[k];
    held[k] = true;
    if (game.keydown) game.keydown(k, state, repeat);
  }

  function keyup(k) { held[k] = false; }

  // Shared helpers for games
  function hit(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }
  function damage(state) {
    if (state.invuln > 0) return false;
    state.lives -= 1;
    state.invuln = 1.5;
    Sound.play('hurt');
    return true;
  }
  function blink(state) { return state.invuln > 0 && Math.floor(state.invuln * 10) % 2 === 0; }

  return {
    W: W, H: H, FG: FG, BG: BG,
    start: start, stop: stop, pause: pause, keydown: keydown, keyup: keyup,
    hit: hit, damage: damage, blink: blink,
    setColors: function (c) { eyes = c; }, colors: function () { return eyes; },
    isRunning: function () { return !!game; }
  };
})();
