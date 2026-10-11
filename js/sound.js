/*
 * Light, synthesized audio using the Web Audio API (no sound files):
 *  - smooth background music while a game is playing, with its own theme per game
 *  - soft sound effects for moves, shots, jumps, pickups and menus
 * Music and sound effects can each be turned off in Settings.
 */
var Sound = (function () {
  var MASTER_VOL = 1.3, MUSIC_VOL = 0.6, SFX_VOL = 0.7;

  var ctx = null, master = null, sfxBus = null, chain = null;
  var opts = { music: true, sfx: true };
  var wantMusic = false, gamePaused = false, themeId = 'calm';
  var timer = null, nextTime = 0, step = 0, lastTick = 0;

  function mf(m) { return 440 * Math.pow(2, (m - 69) / 12); }

  /* ---------- music themes ----------
   * Each theme loops four chords, one bar (8 eighth notes) each.
   * chords:   MIDI notes of each chord (root, third, fifth)
   * patterns: arpeggio shapes, indexes into [root, 3rd, 5th, root+8va, 3rd+8va]; -1 = rest
   * arp:      [octave shift, wave, volume, length in eighths]
   * bass:     style ('half' | 'pulse' | 'bounce' | 'walk'), wave, volume
   * pad:      sustained chord volume (0 = none)
   * echo:     amount of soft echo; filter: lowpass cutoff (Hz) for a smooth tone
   */
  var THEMES = {
    // Default: calm and neutral
    calm: {
      bpm: 88, chords: [[60, 64, 67], [57, 60, 64], [53, 57, 60], [55, 59, 62]],
      patterns: [[0, 1, 2, 3, 2, 1, 2, 1], [0, 2, 3, 2, 1, 2, 3, 1]],
      arp: [12, 'sine', 0.08, 1.8], bass: ['half', 'triangle', 0.10], pad: 0.03, echo: 0.12, filter: 2400
    },
    // Shape Blaster: spacey, floating, with a long echo (A minor)
    blaster: {
      bpm: 92, chords: [[57, 60, 64], [53, 57, 60], [52, 55, 60], [55, 59, 62]],
      patterns: [[0, 2, 4, 2, 3, 2, 4, 2], [0, 4, 3, 2, 1, 2, 3, 4]],
      arp: [12, 'triangle', 0.06, 2.5], bass: ['half', 'sine', 0.11], pad: 0.035, echo: 0.32, filter: 2000
    },
    // Lane Racer: steady driving pulse, bright and open (D major)
    racer: {
      bpm: 112, chords: [[62, 66, 69], [59, 62, 66], [55, 59, 62], [57, 61, 64]],
      patterns: [[0, 1, 2, 3, 2, 1, 2, 3], [0, 2, 3, 4, 3, 2, 1, 2]],
      arp: [0, 'triangle', 0.085, 1.2], bass: ['pulse', 'triangle', 0.095], pad: 0.025, echo: 0.15, filter: 2600
    },
    // Hop & Duck: bouncy and playful, short plucks with rests (F major)
    runner: {
      bpm: 104, chords: [[53, 57, 60], [50, 53, 57], [46, 50, 53], [48, 52, 55]],
      patterns: [[0, -1, 2, 1, 3, -1, 2, -1], [0, 2, -1, 3, 4, -1, 3, 2]],
      arp: [12, 'sine', 0.085, 0.9], bass: ['bounce', 'triangle', 0.10], pad: 0.02, echo: 0.12, filter: 2800
    },
    // Snake: slow, calm and focused, long smooth notes (E minor)
    snake: {
      bpm: 78, chords: [[52, 55, 59], [48, 52, 55], [55, 59, 62], [50, 54, 57]],
      patterns: [[0, -1, 2, -1, 3, -1, 2, -1], [0, -1, 3, -1, 4, -1, 2, -1]],
      arp: [12, 'sine', 0.075, 3], bass: ['half', 'sine', 0.10], pad: 0.04, echo: 0.28, filter: 1800
    },
    // Split Stack: steady, thoughtful (C major, low and warm)
    split: {
      bpm: 96, chords: [[48, 52, 55], [45, 48, 52], [41, 45, 48], [43, 47, 50]],
      patterns: [[0, 2, 1, 3, 2, 4, 3, 2], [0, 1, 2, 3, 4, 3, 2, 1]],
      arp: [24, 'triangle', 0.07, 1.4], bass: ['half', 'triangle', 0.11], pad: 0.03, echo: 0.22, filter: 2300
    },
    // Ball & Paddle: bright and bouncy (G major)
    paddle: {
      bpm: 120, chords: [[55, 59, 62], [50, 54, 57], [52, 55, 59], [48, 52, 55]],
      patterns: [[0, 2, 1, 2, 3, 2, 1, 2], [0, 3, 2, 3, 4, 3, 2, 3]],
      arp: [12, 'triangle', 0.075, 1.0], bass: ['pulse', 'triangle', 0.09], pad: 0.02, echo: 0.12, filter: 2700
    },
    // Fruit Catcher: happy and light (A major)
    fruit: {
      bpm: 108, chords: [[57, 61, 64], [50, 54, 57], [52, 56, 59], [57, 61, 64]],
      patterns: [[0, -1, 2, 1, 3, -1, 2, 1], [0, 2, -1, 4, 3, -1, 1, 2]],
      arp: [12, 'sine', 0.085, 0.9], bass: ['bounce', 'triangle', 0.10], pad: 0.02, echo: 0.15, filter: 2800
    },
    // Garden Puzzle: calm and thoughtful, for taking your time (D major)
    garden: {
      bpm: 84, chords: [[50, 54, 57], [55, 59, 62], [47, 50, 54], [52, 55, 59]],
      patterns: [[0, -1, 2, 3, -1, 2, 1, -1], [0, -1, 3, 4, -1, 3, 2, -1]],
      arp: [12, 'sine', 0.08, 2.0], bass: ['half', 'sine', 0.10], pad: 0.035, echo: 0.28, filter: 2000
    },
    // Cheese Chase: playful, sneaky pizzicato over a walking bass (E minor)
    chase: {
      bpm: 104, chords: [[52, 55, 59], [48, 52, 55], [45, 48, 52], [47, 51, 54]],
      patterns: [[0, -1, 2, 1, -1, 3, 2, -1], [0, 2, -1, 3, 4, -1, 2, 1]],
      arp: [12, 'triangle', 0.075, 0.6], bass: ['walk', 'triangle', 0.11], pad: 0.015, echo: 0.16, filter: 2300
    },
    // Maze Mouse: light "tiptoe" feel, staccato notes over a walking bass (G minor)
    maze: {
      bpm: 96, chords: [[55, 58, 62], [51, 55, 58], [48, 51, 55], [50, 54, 57]],
      patterns: [[0, -1, 2, -1, 1, -1, 2, 3], [0, -1, 2, -1, 3, -1, 4, 2]],
      arp: [12, 'triangle', 0.08, 0.7], bass: ['walk', 'triangle', 0.12], pad: 0, echo: 0.18, filter: 2200
    }
  };

  function theme(id) { return THEMES[id] || THEMES.calm; }
  function eighth(th) { return 60 / th.bpm / 2; }

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

  // Schedule step n (one eighth note) of a theme at time t
  function musicStep(c, dest, t, n, id) {
    var th = theme(id), e = eighth(th), s = n % 8;
    var ch = th.chords[Math.floor(n / 8) % th.chords.length];
    var notes = [ch[0], ch[1], ch[2], ch[0] + 12, ch[1] + 12];
    var pat = th.patterns[Math.floor(n / 32) % th.patterns.length];
    var a = th.arp, b = th.bass, root = ch[0] - 12;

    // Arpeggio / melody
    if (pat[s] >= 0) tone(c, dest, t, mf(notes[pat[s]] + a[0]), e * a[3], a[1], a[2], 0, 0.012);

    // Bass line
    if (b[0] === 'half' && (s === 0 || s === 4)) tone(c, dest, t, mf(root), e * 3.6, b[1], b[2], 0, 0.02);
    if (b[0] === 'pulse') tone(c, dest, t, mf(s % 4 === 3 ? root + 7 : root), e * 0.9, b[1], b[2], 0, 0.01);
    if (b[0] === 'bounce' && (s === 0 || s === 3 || s === 4 || s === 6)) {
      tone(c, dest, t, mf(s === 3 || s === 6 ? root + 7 : root), e * 1.4, b[1], b[2], 0, 0.01);
    }
    if (b[0] === 'walk' && s % 2 === 0) {
      tone(c, dest, t, mf(root + [0, 7, 12, 7][s / 2]), e * 0.8, b[1], b[2], 0, 0.01);
    }

    // Sustained pad, once per bar
    if (th.pad && s === 0) {
      for (var i = 0; i < 3; i++) tone(c, dest, t, mf(ch[i]), e * 8, 'sine', th.pad, 0, 0.6);
    }
  }

  // Music signal chain: input -> lowpass (smooth tone) -> out, plus a soft echo
  function makeMusicChain(c, out) {
    var input = c.createGain(); input.gain.value = 0.0001;
    var soften = c.createBiquadFilter(); soften.type = 'lowpass';
    var delay = c.createDelay(2); var fb = c.createGain(); var wet = c.createGain();
    fb.gain.value = 0.3;
    input.connect(soften);
    input.connect(wet); wet.connect(delay); delay.connect(fb); fb.connect(delay); delay.connect(soften);
    soften.connect(out);
    return {
      input: input,
      setTheme: function (id) {
        var th = theme(id);
        soften.frequency.value = th.filter;
        delay.delayTime.value = eighth(th) * 3;   // dotted-quarter echo
        wet.gain.value = th.echo;
      }
    };
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
    chain = makeMusicChain(ctx, master);
    sfxBus = ctx.createGain(); sfxBus.gain.value = SFX_VOL; sfxBus.connect(master);
    return ctx;
  }

  function unlock() { ensure(); }
  ['keydown', 'pointerdown', 'touchstart'].forEach(function (ev) {
    document.addEventListener(ev, unlock, true);
  });

  function scheduleAhead() {
    var e = eighth(theme(themeId));
    while (nextTime < ctx.currentTime + 0.3) {
      musicStep(ctx, chain.input, nextTime, step, themeId);
      nextTime += e;
      step++;
    }
  }

  // Start or stop the music loop to match the current state
  function refresh() {
    var on = wantMusic && !gamePaused && opts.music && ensure();
    var g = chain && chain.input.gain;
    if (on && !timer) {
      var now = ctx.currentTime;
      chain.setTheme(themeId);
      nextTime = now + 0.1;
      g.cancelScheduledValues(now);
      g.setValueAtTime(0.0001, now);
      g.exponentialRampToValueAtTime(MUSIC_VOL, now + 0.8);
      timer = setInterval(scheduleAhead, 50);
      scheduleAhead();
    } else if (!on && timer) {
      clearInterval(timer);
      timer = null;
      g.cancelScheduledValues(ctx.currentTime);
      g.setTargetAtTime(0.0001, ctx.currentTime, 0.08);
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

  // music(true, 'racer') starts that game's theme; music(false) stops
  function music(on, id) {
    id = THEMES[id] ? id : 'calm';
    if (on && (!wantMusic || id !== themeId)) {
      step = 0;                        // a new game starts its tune from the top
      if (timer) { clearInterval(timer); timer = null; }
      themeId = id;
    }
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
    currentTheme: function () { return themeId; },
    // exposed for tests / offline previews
    _musicStep: musicStep, _makeMusicChain: makeMusicChain, _sfxAt: sfxAt,
    _eighth: function (id) { return eighth(theme(id)); }, _THEMES: THEMES, _SFX: SFX
  };
})();
