/* Persisted user settings (localStorage works inside webOS web apps). */
var Settings = (function () {
  var KEY = 'asb.settings.v1';

  var DEFAULTS = {
    orientation: 'horizontal', // 'horizontal' | 'vertical'
    barSize: 60,               // px per bar
    opacity: 0.6,              // 0.1 – 1.0
    redColor: '#ff0000',
    greenColor: '#00ff00',
    fontSize: 44,
    seenDisclaimer: false
  };

  // Option lists cycled with LEFT/RIGHT on the remote
  var OPTIONS = {
    orientation: ['horizontal', 'vertical'],
    barSize: [20, 30, 40, 50, 60, 80, 100, 140, 200],
    opacity: [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
    redColor: ['#ff0000', '#e00000', '#c00000', '#ff3030'],
    greenColor: ['#00ff00', '#00e000', '#00c000', '#00ff80', '#00ffff'],
    fontSize: [32, 38, 44, 52, 60, 72]
  };

  var LABELS = {
    orientation: 'Orientation',
    barSize: 'Bar width',
    opacity: 'Bar strength',
    redColor: 'Red shade',
    greenColor: 'Green shade',
    fontSize: 'Text size'
  };

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

  return { load: load, save: save, cycle: cycle, OPTIONS: OPTIONS, LABELS: LABELS };
})();
