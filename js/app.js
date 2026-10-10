/* Main controller: remote-control navigation, reading text, settings panel. */
(function () {
  // LG remote key codes
  var KEY = {
    LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, ENTER: 13,
    BACK: 461, RED: 403, GREEN: 404, YELLOW: 405, BLUE: 406
  };

  var s = Settings.load();
  var barsEl = document.getElementById('bars');
  var textEl = document.getElementById('text');
  var panel = document.getElementById('panel');
  var list = document.getElementById('settings');
  var disclaimer = document.getElementById('disclaimer');

  var keys = Object.keys(Settings.LABELS);
  var focus = 0;
  var scrollY = 0;

  // Placeholder reading content — replace with bundled public-domain texts.
  var SAMPLE = [
    'Reading with red-green bars encourages both eyes to work together. Each eye, behind its coloured filter, sees only some of the bars, so the brain must combine input from both eyes to read every line.',
    'Use the arrow keys to scroll. Press OK to open settings and adjust bar width, strength and colours to match your glasses.',
    'Follow the session length and schedule recommended by your eye-care provider.'
  ];

  function renderText() {
    textEl.style.fontSize = s.fontSize + 'px';
    textEl.innerHTML = SAMPLE.map(function (p) { return '<p>' + p + '</p>'; }).join('');
  }

  function renderPanel() {
    list.innerHTML = keys.map(function (k, i) {
      var v = s[k];
      if (k === 'opacity') v = Math.round(v * 100) + '%';
      if (k === 'barSize' || k === 'fontSize') v = v + ' px';
      return '<li class="' + (i === focus ? 'focused' : '') + '"><span>' +
        Settings.LABELS[k] + '</span><span class="value">' + v + '</span></li>';
    }).join('');
  }

  function apply() {
    Bars.render(barsEl, s);
    renderText();
    if (!panel.classList.contains('hidden')) renderPanel();
  }

  function scroll(dy) {
    var max = Math.max(0, textEl.scrollHeight - 972);
    scrollY = Math.min(max, Math.max(0, scrollY + dy));
    textEl.style.transform = 'translateY(' + (-scrollY) + 'px)';
  }

  document.addEventListener('keydown', function (e) {
    var k = e.keyCode;

    if (!disclaimer.classList.contains('hidden')) {
      if (k === KEY.ENTER) {
        disclaimer.classList.add('hidden');
        s.seenDisclaimer = true;
        Settings.save(s);
      }
      return;
    }

    var panelOpen = !panel.classList.contains('hidden');

    if (k === KEY.ENTER) {
      panel.classList.toggle('hidden');
      if (!panelOpen) renderPanel();
      return;
    }

    if (k === KEY.BACK) {
      if (panelOpen) { panel.classList.add('hidden'); e.preventDefault(); return; }
      if (window.webOS && webOS.platformBack) webOS.platformBack();
      return;
    }

    if (panelOpen) {
      if (k === KEY.UP) focus = (focus - 1 + keys.length) % keys.length;
      if (k === KEY.DOWN) focus = (focus + 1) % keys.length;
      if (k === KEY.LEFT) Settings.cycle(s, keys[focus], -1);
      if (k === KEY.RIGHT) Settings.cycle(s, keys[focus], 1);
      apply();
      return;
    }

    // Reading mode shortcuts
    if (k === KEY.DOWN) scroll(120);
    if (k === KEY.UP) scroll(-120);
    if (k === KEY.RED) { Settings.cycle(s, 'orientation', 1); apply(); }
    if (k === KEY.GREEN) { Settings.cycle(s, 'barSize', 1); apply(); }
  });

  apply();
  if (!s.seenDisclaimer) disclaimer.classList.remove('hidden');
})();
