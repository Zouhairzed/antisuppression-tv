/*
 * Colour test & picker: tune the bar colours to your glasses and your screen.
 *
 * Each test shows a white cat seen through a square of one bar colour, drawn exactly
 * the way the app draws things under that bar. Looking through the OPPOSITE lens only,
 * the cat should disappear (that eye must not see this colour). Adjust the colour with
 * the R / G / B sliders until it does.
 */
var Calibrate = (function () {
  var KEY = { LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, ENTER: 13, BACK: 461 };
  var STEP = 5;

  var CAT = '<svg class="calib-cat" viewBox="0 0 200 200" aria-hidden="true">' +
    '<path d="M150 172c40-6 44-58 14-70" fill="none" stroke="#f2f2f2" stroke-width="16" stroke-linecap="round"/>' +
    '<ellipse cx="96" cy="140" rx="56" ry="50" fill="#f2f2f2"/>' +
    '<circle cx="100" cy="72" r="40" fill="#f2f2f2"/>' +
    '<path d="M64 52l6-40 26 26zM136 52l-6-40-26 26z" fill="#f2f2f2"/>' +
    '<ellipse cx="74" cy="186" rx="18" ry="10" fill="#f2f2f2"/><ellipse cx="118" cy="186" rx="18" ry="10" fill="#f2f2f2"/>' +
    '<ellipse cx="86" cy="70" rx="5" ry="8" fill="#111"/><ellipse cx="114" cy="70" rx="5" ry="8" fill="#111"/>' +
    '</svg>';

  var root, s, onDone, focus = 0, items = [], tests = [], drag = null, bound = false;

  function hexToRgb(h) {
    var n = parseInt(h.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function rgbToHex(c) {
    return '#' + c.map(function (v) { var h = v.toString(16); return h.length < 2 ? '0' + h : h; }).join('');
  }
  function rgba(hex, a) { var c = hexToRgb(hex); return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }

  function lensName(key) { return key === 'redColor' ? 'red' : key === 'blueColor' ? 'blue' : 'green'; }

  function makeTests() {
    var second = s.glasses === 'red-blue' ? 'blueColor' : 'greenColor';
    return [
      { key: second, title: (second === 'blueColor' ? 'Blue' : 'Green') + ' bars', other: 'redColor' },
      { key: 'redColor', title: 'Red bars', other: second }
    ];
  }

  function build() {
    tests = makeTests();
    items = [];
    var html = '<h1>Colour test</h1>' +
      '<p class="calib-intro">Put on your glasses. In each test, close one eye and adjust the colour until the cat ' +
      'disappears for the other eye. Turn off any night or eye-comfort mode on your screen first.</p>' +
      '<div class="calib-tests">';
    tests.forEach(function (t, ti) {
      html += '<div class="calib-test">' +
        '<div class="calib-square">' + CAT + '<div class="calib-filter" data-t="' + ti + '"></div></div>' +
        '<div class="calib-side"><h2>' + t.title + '</h2>' +
        '<p class="calib-how">Close the eye behind the <b>' + lensName(t.key) + '</b> lens. Looking through the <b>' +
        lensName(t.other) + '</b> lens only, adjust until the cat disappears.</p>' +
        '<div class="calib-swatch-row"><label class="calib-swatch" data-t="' + ti + '">' +
        '<input type="color" data-t="' + ti + '" tabindex="-1"></label><span class="calib-hex" data-t="' + ti + '"></span></div>';
      ['R', 'G', 'B'].forEach(function (name, ch) {
        items.push({ type: 'slider', t: ti, ch: ch });
        html += '<div class="calib-row calib-slider" data-i="' + (items.length - 1) + '"><span class="calib-ch">' + name +
          '</span><div class="calib-track"><div class="calib-fill"></div></div><span class="calib-val"></span></div>';
      });
      items.push({ type: 'button', act: 'reset', t: ti });
      html += '<div class="calib-row calib-btn" data-i="' + (items.length - 1) + '">Reset to default</div>';
      html += '</div></div>';
    });
    html += '</div><div class="calib-actions">';
    items.push({ type: 'button', act: 'reference' });
    html += '<div class="calib-row calib-btn" data-i="' + (items.length - 1) + '">Use reference colours</div>';
    items.push({ type: 'button', act: 'done' });
    html += '<div class="calib-row calib-btn calib-done" data-i="' + (items.length - 1) + '">Done</div></div>' +
      '<p class="hint">▲▼ choose · ◀▶ adjust · OK select · BACK done</p>';
    root.innerHTML = html;
    attachPointer();
  }

  function render() {
    tests.forEach(function (t, ti) {
      var hex = s[t.key];
      root.querySelector('.calib-filter[data-t="' + ti + '"]').style.background = rgba(hex, s.opacity);
      root.querySelector('.calib-swatch[data-t="' + ti + '"]').style.background = hex;
      root.querySelector('.calib-hex[data-t="' + ti + '"]').textContent = hex.toUpperCase();
      root.querySelector('input[data-t="' + ti + '"]').value = hex;
    });
    items.forEach(function (it, i) {
      var el = root.querySelector('[data-i="' + i + '"]');
      el.classList.toggle('focused', i === focus);
      if (it.type === 'slider') {
        var v = hexToRgb(s[tests[it.t].key])[it.ch];
        el.querySelector('.calib-fill').style.width = (v / 255 * 100) + '%';
        el.querySelector('.calib-fill').style.background = ['#e33', '#3c3', '#38f'][it.ch];
        el.querySelector('.calib-val').textContent = v;
      }
    });
  }

  function setChannel(it, v) {
    var key = tests[it.t].key, c = hexToRgb(s[key]);
    c[it.ch] = Math.max(0, Math.min(255, Math.round(v)));
    s[key] = rgbToHex(c);
    Settings.save(s);
    render();
  }

  function act(it) {
    if (it.act === 'reset') s[tests[it.t].key] = Settings.DEFAULTS[tests[it.t].key];
    if (it.act === 'reference') {
      s.redColor = Settings.DEFAULTS.redColor;
      s.greenColor = Settings.DEFAULTS.greenColor;
      s.blueColor = Settings.DEFAULTS.blueColor;
    }
    Settings.save(s);
    Sound.play('select');
    if (it.act === 'done') { close(); return; }
    render();
  }

  function close() {
    Settings.save(s);
    if (onDone) onDone();
  }

  // Keyboard / remote. Returns nothing; the caller routes all keys here while the test is open.
  function key(k) {
    var it = items[focus];
    if (k === KEY.BACK) { close(); return; }
    if (k === KEY.UP || k === KEY.DOWN) {
      focus = (focus + (k === KEY.DOWN ? 1 : -1) + items.length) % items.length;
      Sound.play('nav');
      render();
      return;
    }
    if ((k === KEY.LEFT || k === KEY.RIGHT) && it.type === 'slider') {
      var c = hexToRgb(s[tests[it.t].key])[it.ch];
      setChannel(it, c + (k === KEY.RIGHT ? STEP : -STEP));
      Sound.play('tick');
      return;
    }
    if (k === KEY.ENTER) {
      if (it.type === 'button') act(it);
      else { focus = Math.min(items.length - 1, focus + 1); render(); }
    }
  }

  // Mouse, touch and the LG Magic Remote pointer
  function attachPointer() {
    function valueAt(track, x) {
      var r = track.getBoundingClientRect();
      return (x - r.left) / r.width * 255;
    }
    Array.prototype.forEach.call(root.querySelectorAll('.calib-slider'), function (el) {
      var i = +el.getAttribute('data-i'), track = el.querySelector('.calib-track');
      el.addEventListener('pointerdown', function (e) {
        focus = i; drag = { it: items[i], track: track };
        setChannel(items[i], valueAt(track, e.clientX));
        e.preventDefault();
      });
    });
    if (!bound) {                       // container-level listeners: attach once
      bound = true;
      root.addEventListener('pointermove', function (e) { if (drag) setChannel(drag.it, valueAt(drag.track, e.clientX)); });
      document.addEventListener('pointerup', function () { drag = null; });
    }
    Array.prototype.forEach.call(root.querySelectorAll('.calib-btn'), function (el) {
      el.addEventListener('click', function () { focus = +el.getAttribute('data-i'); act(items[focus]); });
    });
    Array.prototype.forEach.call(root.querySelectorAll('input[type="color"]'), function (inp) {
      inp.addEventListener('input', function () {
        s[tests[+inp.getAttribute('data-t')].key] = inp.value;
        Settings.save(s);
        render();
      });
    });
  }

  function open(container, settings, done) {
    root = container; s = settings; onDone = done; focus = 0;
    build();
    render();
  }

  return { open: open, key: key };
})();
