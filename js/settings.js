/* Persisted user settings (localStorage works inside webOS web apps and browsers). */
var Settings = (function () {
  var KEY = 'asb.settings.v1';

  var DEFAULTS = {
    glasses: 'red-green',      // 'red-green' | 'red-blue'
    orientation: 'vertical',   // 'vertical' | 'horizontal'
    orientRev: 2,
    barSize: 60,               // px per bar
    opacity: 1.0,              // 0.2 – 1.0; full strength keeps each colour pure (no leak to the other eye)
    redColor: '#9b1819',       // default bar red
    greenColor: '#1a9b1c',     // default bar green
    colorRev: 4,
    blueColor: '#0050ff',      // azure-leaning blue: stays blue (not violet) when blended at lower strength
    blueRev: 2,
    weakLens: 'red',           // which lens covers the weaker eye: 'red' or 'other' (green / blue)
    strongContrast: 1.0,       // brightness of what only the stronger eye sees, in two-eye games
    fontSize: 44,
    menuTheme: 'night',        // home menu and story list: 'night' (default) or 'light'
    music: 'on',
    sfx: 'on',
    seenDisclaimer: false
  };

  // Option lists cycled with LEFT/RIGHT. Shades vary because every screen shows colour
  // differently: pick the shade where each eye sees only its own bars through the glasses.
  var OPTIONS = {
    glasses: ['red-green', 'red-blue'],
    orientation: ['vertical', 'horizontal'],
    barSize: [20, 30, 40, 50, 60, 80, 100, 140, 200],
    opacity: [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
    redColor: ['#9b1819', '#aa1819', '#ff0000', '#f00000', '#e00000', '#d00000', '#c00000', '#ff2020', '#ff4040', '#ff0040'],
    greenColor: ['#1a9b1c', '#1aa91c', '#00ff00', '#00f000', '#00e000', '#00d000', '#00c000', '#20ff20', '#40ff40', '#00ff60', '#00ff80'],
    // From azure to pure blue. #0000ff looks violet on many screens once blended, so it is not the default.
    blueColor: ['#0050ff', '#0060ff', '#0070ff', '#0080ff', '#0040ff', '#0030ff', '#0000ff', '#0040e0', '#0050c0'],
    weakLens: ['red', 'other'],
    strongContrast: [1.0, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2],
    fontSize: [32, 38, 44, 52, 60, 72],
    menuTheme: ['night', 'light'],
    music: ['on', 'off'],
    sfx: ['on', 'off']
  };

  var LABELS = {
    glasses: 'Glasses',
    orientation: 'Orientation',
    barSize: 'Bar width',
    opacity: 'Bar strength',
    redColor: 'Red colour',
    greenColor: 'Green colour',
    blueColor: 'Blue colour',
    calibrate: 'Colour test',
    weakLens: 'Weaker eye',
    strongContrast: 'Strong-eye contrast',
    fontSize: 'Text size',
    menuTheme: 'Menu theme',
    music: 'Music',
    sfx: 'Sound effects'
  };

  // Settings shown in the panel: only the shade that matches the chosen glasses.
  function keys(s) {
    return ['glasses', 'orientation', 'barSize', 'opacity', 'redColor',
      s.glasses === 'red-blue' ? 'blueColor' : 'greenColor', 'calibrate',
      'weakLens', 'strongContrast', 'fontSize', 'menuTheme', 'music', 'sfx'];
  }

  // The colour paired with red for the chosen glasses
  function secondColor(s) { return s.glasses === 'red-blue' ? s.blueColor : s.greenColor; }

  // Colours for two-eye (dichoptic) games: the weaker eye's lens colour, and the other
  // colour darkened by the strong-eye contrast setting.
  function eyeColors(s) {
    var second = secondColor(s);
    var weak = s.weakLens === 'red' ? s.redColor : second;
    var strong = s.weakLens === 'red' ? second : s.redColor;
    var n = parseInt(strong.slice(1), 16), k = s.strongContrast;
    var dim = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(function (v) { return Math.round(v * k); });
    return { weak: weak, strong: 'rgb(' + dim.join(',') + ')' };
  }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      var saved = raw ? JSON.parse(raw) : {};
      var out = {};
      for (var k in DEFAULTS) out[k] = (k in saved) ? saved[k] : DEFAULTS[k];
      // Older versions saved #0000ff as the blue default; move those to the new default once
      if ((saved.blueRev || 0) < DEFAULTS.blueRev) { out.blueColor = DEFAULTS.blueColor; out.blueRev = DEFAULTS.blueRev; }
      // Earlier versions defaulted to horizontal bars; switch saved settings to the new default once
      if ((saved.orientRev || 0) < DEFAULTS.orientRev) { out.orientation = DEFAULTS.orientation; out.orientRev = DEFAULTS.orientRev; }
      // Move earlier versions to the default bar colours at full strength, once
      if ((saved.colorRev || 0) < DEFAULTS.colorRev) {
        out.redColor = DEFAULTS.redColor; out.greenColor = DEFAULTS.greenColor;
        out.opacity = DEFAULTS.opacity; out.colorRev = DEFAULTS.colorRev;
      }
      return out;
    } catch (e) {
      return JSON.parse(JSON.stringify(DEFAULTS));
    }
  }

  function save(s) {
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* ignore */ }
  }

  function cycle(s, key, dir) {
    var list = OPTIONS[key];
    if (!list) return;
    var i = list.indexOf(s[key]);
    if (i < 0) i = 0;
    s[key] = list[(i + dir + list.length) % list.length];
    save(s);
  }

  return { load: load, save: save, cycle: cycle, keys: keys, secondColor: secondColor, eyeColors: eyeColors, DEFAULTS: DEFAULTS,
    OPTIONS: OPTIONS, LABELS: LABELS };
})();
