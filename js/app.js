/* Main controller: screens (menu / reader / game), remote navigation, settings panel. */
(function () {
  // LG remote key codes
  var KEY = {
    LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, ENTER: 13,
    BACK: 461, RED: 403, GREEN: 404, YELLOW: 405, BLUE: 406
  };

  // Desktop-browser testing: Esc/Backspace = BACK, R/G/Y/B = colour keys
  var DESKTOP = { 27: KEY.BACK, 8: KEY.BACK, 82: KEY.RED, 71: KEY.GREEN, 89: KEY.YELLOW, 66: KEY.BLUE };
  function code(e) { return DESKTOP[e.keyCode] || e.keyCode; }

  var s = Settings.load();
  var $ = function (id) { return document.getElementById(id); };
  var barsEl = $('bars'), textEl = $('text'), panel = $('panel'), list = $('settings');
  var disclaimer = $('disclaimer'), menuEl = $('menu'), menuList = $('menu-list');
  var reader = $('reader'), canvas = $('game'), gameHint = $('game-hint');

  var GAMES = [Blaster, Racer, Runner, Snake, Maze];
  var MENU = [
    { label: 'Reading', sub: STORIES.length + ' stories', action: function () { show('reader'); } }
  ].concat(GAMES.map(function (g) {
    return { label: g.title, sub: 'game', action: function () { startGame(g); } };
  })).concat([
    { label: 'Settings', sub: 'glasses & bars', action: function () { openPanel(); } }
  ]);

  var screen = 'menu';
  var menuFocus = 0, setFocus = 0, scrollY = 0;
  var setKeys = Settings.keys(s);

  var storyIdx = 0;

  /* ---------- rendering ---------- */

  function renderMenu() {
    menuList.innerHTML = MENU.map(function (m, i) {
      return '<li class="' + (i === menuFocus ? 'focused' : '') + '"><span>' + m.label +
        '</span><span class="sub">' + m.sub + '</span></li>';
    }).join('');
  }

  function renderText() {
    textEl.style.fontSize = s.fontSize + 'px';
    var st = STORIES[storyIdx];
    textEl.innerHTML =
      '<h2 class="story-title">' + st.title + '</h2>' +
      st.paragraphs.map(function (p) { return '<p>' + p + '</p>'; }).join('') +
      '<p class="story-end">◀ ▶ story ' + (storyIdx + 1) + ' of ' + STORIES.length + '</p>';
  }

  function changeStory(dir) {
    storyIdx = (storyIdx + dir + STORIES.length) % STORIES.length;
    renderText();
    scrollY = 0;
    scroll(0);
  }

  function renderPanel() {
    setKeys = Settings.keys(s);
    if (setFocus >= setKeys.length) setFocus = setKeys.length - 1;
    list.innerHTML = setKeys.map(function (k, i) {
      var v = s[k];
      if (k === 'opacity') v = Math.round(v * 100) + '%';
      if (k === 'barSize' || k === 'fontSize') v = v + ' px';
      if (k === 'glasses') v = v === 'red-blue' ? 'red / blue' : 'red / green';
      if (/Color$/.test(k)) v = '<i class="swatch" style="background:' + v + '"></i>' + v;
      return '<li class="' + (i === setFocus ? 'focused' : '') + '"><span>' +
        Settings.LABELS[k] + '</span><span class="value">' + v + '</span></li>';
    }).join('');
  }

  function apply() {
    Bars.render(barsEl, s);
    renderText();
    if (panelOpen()) renderPanel();
  }

  /* ---------- screens ---------- */

  function show(name) {
    screen = name;
    updateBars();
    menuEl.classList.toggle('hidden', name !== 'menu');
    reader.classList.toggle('hidden', name !== 'reader');
    canvas.classList.toggle('hidden', name !== 'game');
    gameHint.classList.toggle('hidden', name !== 'game');
    if (name !== 'game') Engine.stop();
    if (name === 'menu') renderMenu();
  }

  function startGame(g) {
    show('game');
    gameHint.textContent = g.hint + '  ·  YELLOW pause  ·  BLUE settings  ·  BACK menu';
    Engine.start(canvas, g);
  }

  function panelOpen() { return !panel.classList.contains('hidden'); }
  function openPanel() { Engine.pause(true); panel.classList.remove('hidden'); renderPanel(); updateBars(); }
  function closePanel() { panel.classList.add('hidden'); updateBars(); }

  // Bars stay off the home menu, but show while Settings is open so changes can be previewed
  function updateBars() { barsEl.classList.toggle('hidden', screen === 'menu' && !panelOpen()); }

  function scroll(dy) {
    var max = Math.max(0, textEl.scrollHeight - 972);
    scrollY = Math.min(max, Math.max(0, scrollY + dy));
    textEl.style.transform = 'translateY(' + (-scrollY) + 'px)';
  }

  /* ---------- input ---------- */

  document.addEventListener('keydown', function (e) {
    var k = code(e);
    if (k === KEY.BACK || (k >= 37 && k <= 40)) e.preventDefault();

    if (!disclaimer.classList.contains('hidden')) {
      if (k === KEY.ENTER) {
        disclaimer.classList.add('hidden');
        s.seenDisclaimer = true;
        Settings.save(s);
      }
      return;
    }

    if (panelOpen()) {
      if (k === KEY.ENTER || k === KEY.BACK || k === KEY.BLUE) { closePanel(); return; }
      if (k === KEY.UP) setFocus = (setFocus - 1 + setKeys.length) % setKeys.length;
      if (k === KEY.DOWN) setFocus = (setFocus + 1) % setKeys.length;
      if (k === KEY.LEFT) Settings.cycle(s, setKeys[setFocus], -1);
      if (k === KEY.RIGHT) Settings.cycle(s, setKeys[setFocus], 1);
      apply();
      return;
    }

    if (k === KEY.BLUE) { openPanel(); return; }

    if (screen === 'menu') {
      if (k === KEY.UP) menuFocus = (menuFocus - 1 + MENU.length) % MENU.length;
      if (k === KEY.DOWN) menuFocus = (menuFocus + 1) % MENU.length;
      if (k === KEY.ENTER) { MENU[menuFocus].action(); return; }
      if (k === KEY.BACK && window.webOS && webOS.platformBack) webOS.platformBack();
      renderMenu();
      return;
    }

    if (screen === 'reader') {
      if (k === KEY.BACK) { show('menu'); return; }
      if (k === KEY.ENTER) { openPanel(); return; }
      if (k === KEY.DOWN) scroll(120);
      if (k === KEY.UP) scroll(-120);
      if (k === KEY.LEFT) changeStory(-1);
      if (k === KEY.RIGHT) changeStory(1);
      if (k === KEY.RED) { Settings.cycle(s, 'orientation', 1); apply(); }
      if (k === KEY.GREEN) { Settings.cycle(s, 'barSize', 1); apply(); }
      return;
    }

    if (screen === 'game') {
      if (k === KEY.BACK) { show('menu'); return; }
      Engine.keydown(k);
    }
  });

  document.addEventListener('keyup', function (e) { Engine.keyup(code(e)); });

  // Pause games when the app goes to the background
  document.addEventListener('visibilitychange', function () { if (document.hidden) Engine.pause(true); });

  apply();
  show('menu');
  if (!s.seenDisclaimer) disclaimer.classList.remove('hidden');
})();
