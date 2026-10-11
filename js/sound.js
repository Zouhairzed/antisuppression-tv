/*
 * Light, synthesized audio using the Web Audio API (no sound files):
 *  - gentle background music while a game is playing
 *  - soft sound effects for moves, shots, jumps, pickups and menus
 * Music and sound effects can each be turned off in Settings.
 */
var Sound = (function () {
  var MASTER_VOL = 1.3, MUSIC_VOL = 0.6, SFX_VOL = 0.7;

  var ctx = null, master = null, musicBus = null, sfxBus = null;
  var opts = { music: true, sfx: true };
  var wantMusic = false, gamePaused = false;
  var timer = null, nextTime = 0, step = 0, lastTick = 0;

  /* ---------- music: a calm C - Am - F - G loop at 88 BPM ---------- */
  var EIGHTH = 60 / 88 / 2;
  var CHORDS = [[60, 64, 67], [57, 60, 64], [53, 57, 60], [55, 59, 62]];   // MIDI notes
  var PATTERNS = [[0, 1, 2, 3, 2, 1, 2, 1], [0, 2, 3, 2, 1, 2, 3, 1]];     // arpeggio shapes

  function mf(m) { return 440 * Math.pow(2, (m - 69) / 12); }

  // One soft note: quick (or slow, for pads) fade-in, exponential fade-out
  function tone(c, dest, t, freq, dur, type, vol, slideTo, attack) {
    var o = c.createOscillator(), g = c.createGain();
    var a = Math.min(attack || 0.008, dur * 0.5);
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g);
    g.connect(dest);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  // Schedule music step n (one eighth note) at time t
  function musicStep(c, dest, t, n) {
    var s = n % 8;
    var ch = CHORDS[Math.floor(n / 8) % 4];
    var notes = [ch[0], ch[1], ch[2], ch[0] + 12];
    var pat = PATTERNS[Math.floor(n / 32) % 2];
    tone(c, dest, t, mf(notes[pat[s]] + 12), EIGHTH * 1.8, 'sine', 0.08);                  // arpeggio
    if (s === 0 || s === 4) tone(c, dest, t, mf(ch[0] - 12), EIGHTH * 3.6, 'triangle', 0.10, 0, 0.02); // bass
    if (s === 0) {
      for (var i = 0; i < 3; i++) tone(c, dest, t, mf(ch[i]), EIGHTH * 8, 'sine', 0.03, 0, 0.6);     // pad
    }
  }

  /* ---------- sound effects: [freq, duration, wave, volume, slideTo, delay] ---------- */
  var SFX = {
    nav:      [[660, 0.06, 'sine', 0.18]],
    select:   [[523, 0.08, 'sine', 0.2], [784, 0.12, 'sine', 0.2, 0, 0.07]],
    page:     [[587, 0.08, 'sine', 0.15, 698]],
    move:     [[440, 0.05, 'triangle', 0.15]],
    tick:     [[1047, 0.035, 'sine', 0.06]],
    shoot:    [[880, 0.09, 'triangle', 0.12, 440]],
    pop:      [[520, 0.12, 'sine', 0.22, 1040]],
    jump:     [[330, 0.16, 'sine', 0.2, 660]],
    collect:  [[784, 0.08, 'sine', 0.18], [1175, 0.14, 'sine', 0.18, 0, 0.07]],
    power:    [[523, 0.07, 'sine', 0.16], [659, 0.07, 'sine', 0.16, 0, 0.07],
               [784, 0.07, 'sine', 0.16, 0, 0.14], [1047, 0.18, 'sine', 0.16, 0, 0.21]],
    hurt:     [[262, 0.28, 'triangle', 0.22, 131]],
    level:    [[523, 0.09, 'sine', 0.16], [659, 0.09, 'sine', 0.16, 0, 0.09], [784, 0.09, 'sine', 0.16, 0, 0.18],
               [1047, 0.09, 'sine', 0.16, 0, 0.27], [1319, 0.25, 'sine', 0.16, 0, 0.36]],
    gameover: [[392, 0.22, 'triangle', 0.18, 0, 0.25], [330, 0.22, 'triangle', 0.18, 0, 0.47],
               [262, 0.45, 'triangle', 0.18, 0, 0.69]]
  };

  function sfxAt(c, dest, name, t) {
    var notes = SFX[name] || [];
    for (var i = 0; i < notes.length; i++) {
      var n = notes[i];
      tone(c, dest, t + (n[5] || 0), n[0], n[1], n[2], n[3], n[4]);
    }
  }

  /* ---------- audio context (created on the first key press, tap or click) ---------- */
  function ensure() {
    if (ctx) {
      if (ctx.state === 'suspended' && ctx.resume) ctx.resume();
      return ctx;
    }
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try { ctx = new AC(); } catch (e) { return null; }
    master = ctx.createGain(); master.gain.value = MASTER_VOL; master.connect(ctx.destination);
    var soften = ctx.createBiquadFilter(); soften.type = 'lowpass'; soften.frequency.value = 2400;
    soften.connect(master);
    musicBus = ctx.createGain(); musicBus.gain.value = 0.0001; musicBus.connect(soften);
    sfxBus = ctx.createGain(); sfxBus.gain.value = SFX_VOL; sfxBus.connect(master);
    return ctx;
  }

  function unlock() { ensure(); }
  ['keydown', 'pointerdown', 'touchstart'].forEach(function (ev) {
    document.addEventListener(ev, unlock, true);
  });

  function scheduleAhead() {
    while (nextTime < ctx.currentTime + 0.3) {
      musicStep(ctx, musicBus, nextTime, step);
      nextTime += EIGHTH;
      step++;
    }
  }

  // Start or stop the music loop to match the current state
  function refresh() {
    var on = wantMusic && !gamePaused && opts.music && ensure();
    if (on && !timer) {
      var now = ctx.currentTime;
      nextTime = now + 0.1;
      musicBus.gain.cancelScheduledValues(now);
      musicBus.gain.setValueAtTime(0.0001, now);
      musicBus.gain.exponentialRampToValueAtTime(MUSIC_VOL, now + 0.8);
      timer = setInterval(scheduleAhead, 50);
      scheduleAhead();
    } else if (!on && timer) {
      clearInterval(timer);
      timer = null;
      if (ctx) {
        musicBus.gain.cancelScheduledValues(ctx.currentTime);
        musicBus.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.08);
      }
    }
  }

  /* ---------- public API ---------- */
  function play(name) {
    if (!opts.sfx || !ensure()) return;
    var now = ctx.currentTime;
    if (name === 'tick') {             // very frequent (maze crumbs): limit the rate
      if (now - lastTick < 0.06) return;
      lastTick = now;
    }
    sfxAt(ctx, sfxBus, name, now + 0.005);
  }

  function music(on) {
    if (on && !wantMusic) step = 0;    // a new game starts the tune from the top
    wantMusic = on;
    gamePaused = false;
    refresh();
  }

  function setPaused(p) {
    if (p === gamePaused) return;
    gamePaused = p;
    refresh();
  }

  function configure(o) {
    opts.music = !!o.music;
    opts.sfx = !!o.sfx;
    refresh();
  }

  return {
    play: play, music: music, setPaused: setPaused, configure: configure,
    isMusicPlaying: function () { return !!timer; },
    // exposed for tests / offline previews
    _musicStep: musicStep, _sfxAt: sfxAt, _EIGHTH: EIGHTH, _SFX: SFX
  };
})();
