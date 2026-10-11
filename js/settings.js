/* Persisted user settings (localStorage works inside webOS web apps and browsers). */
var Settings = (function () {
  var KEY = 'asb.settings.v1';

  var DEFAULTS = {
    glasses: 'red-green',      // 'red-green' | 'red-blue'
    orientation: 'horizontal', // 'horizontal' | 'vertical'
    barSize: 60,               // px per bar
    opacity: 0.6,              // 0.1 – 1.0
    redColor: '#ff0000',
    greenColor: '#00ff00',
    blueColor: '#0000ff',
    fontSize: 44,
    seenDisclaimer: false
  };

  // Option lists cycled with LEFT/RIGHT. Shades vary because every screen shows colour
  // differently: pick the shade where each eye sees only its own bars through the glasses.
  var OPTIONS = {
    glasses: ['red-green', 'red-blue'],
    orientation: ['horizontal', 'vertical'],
    barSize: [20, 30, 40, 50, 60, 80, 100, 140, 200],
    opacity: [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
    redColor: ['#ff0000', '#f00000', '#e00000', '#d00000', '#c00000', '#ff2020', '#ff4040', '#ff0040'],
    greenColor: ['#00ff00', '#00f000', '#00e000', '#00d000', '#00c000', '#20ff20', '#40ff40', '#00ff60', '#00ff80'],
    blueColor: ['#0000ff', '#0000e0', '#0000c0', '#2020ff', '#4040ff', '#0040ff', '#0060ff', '#0080ff', '#00a0ff'],
    fontSize: [32, 38, 44, 52, 60, 72]
  };

  var LABELS = {
    glasses: 'Glasses',
    orientation: 'Orientation',
    barSize: 'Bar width',
    opacity: 'Bar strength',
    redColor: 'Red shade',
    greenColor: 'Green shade',
    blueColor: 'Blue shade',
    fontSize: 'Text size'
  };

  // Settings shown in the panel: only the shade that matches the chosen glasses.
  function keys(s) {
    return ['glasses', 'orientation', 'barSize', 'opacity', 'redColor',
      s.glasses === 'red-blue' ? 'blueColor' : 'greenColor', 'fontSize'];
  }

  // The colour paired with red for the chosen glasses
  function secondColor(s) { return s.glasses === 'red-blue' ? s.blueColor : s.greenColor; }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      var saved = raw ? JSON.parse(raw) : {};
      var out = {};
      for (var k in DEFAULTS) out[k] = (k in saved) ? saved[k] : DEFAULTS[k];
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
    var i = list.indexOf(s[key]);
    if (i < 0) i = 0;
    s[key] = list[(i + dir + list.length) % list.length];
    save(s);
  }

  return { load: load, save: save, cycle: cycle, keys: keys, secondColor: secondColor,
    OPTIONS: OPTIONS, LABELS: LABELS };
})();
