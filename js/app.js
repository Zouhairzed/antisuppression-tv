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
  var reader = $('reader'), canvas = $('game'), gameHint = $('game-hint'), calibEl = $('calib'), libraryEl = $('library');

  // Home menu in two rows: reading and games with bars; two-eye reading and games (no bars).
  // Settings opens from the ⋮ button at the top right (menuFocus = SETTINGS_FOCUS).
  var BAR_GAMES = [Blaster, Racer, Runner, Snake, Maze];
  var EYE_GAMES = [SplitStack, Paddle, Fruit, Slide, CheeseChase];
  function gameItem(g) {
    return { label: g.title, icon: MENU_ART[g.id].icon, sub: MENU_ART[g.id].tag, action: function () { startGame(g); } };
  }
  var MENU = [
    { label: 'Reading', icon: MENU_ART.reading.icon, sub: STORIES.length + ' stories', action: function () { openLibrary('bars'); } }
  ].concat(BAR_GAMES.map(gameItem), [
    { label: 'Two-eye Reading', icon: MENU_ART.reading2.icon, sub: MENU_ART.reading2.tag, action: function () { openLibrary('eyes'); } }
  ], EYE_GAMES.map(gameItem));
  var MENU_ROWS = [
    { title: 'Reading and games with bars', items: [0, 1, 2, 3, 4, 5] },
    { title: 'Two-eye reading and games · no bars', items: [6, 7, 8, 9, 10, 11] }
  ];
  var SETTINGS_FOCUS = -1, lastCol = 0;
  var moreBtn = $('menu-more');
  // Reading mode: 'bars' (white text under the bars) or 'eyes' (no bars; each word in one eye's colour)
  var readingMode = 'bars';
  function menuRowOf(i) {
    for (var r = 0; r < MENU_ROWS.length; r++) {
      var c = MENU_ROWS[r].items.indexOf(i);
      if (c >= 0) return { r: r, c: c };
    }
    return { r: 0, c: 0 };
  }

  var screen = 'menu';
  var menuFocus = 0, setFocus = 0, scrollY = 0;
  var setKeys = Settings.keys(s);

  var storyIdx = 0;
  var LANG_NAMES = { en: 'English', fr: 'Français', ar: 'العربية' };

  /* ---------- rendering ---------- */

  function renderMenu() {
    moreBtn.classList.toggle('focused', menuFocus === SETTINGS_FOCUS);
    menuList.innerHTML = MENU_ROWS.map(function (row) {
      return '<li class="menu-head">' + row.title + '</li>' + row.items.map(function (i) {
        var m = MENU[i];
        return '<li data-i="' + i + '" class="' + (i === menuFocus ? 'focused' : '') + '"><span class="icon">' + m.icon +
          '</span><span class="label">' + m.label + '</span><span class="sub">' + m.sub + '</span></li>';
      }).join('');
    }).join('');
  }

  /* Two-eye reading: words take turns between the weaker eye's colour and the stronger eye's
     colour (the Red and Green / Blue colours from Settings), so both eyes are needed to read a line. */
  var wordN = 0;
  function eyeWords(text) {
    if (readingMode !== 'eyes') return text;
    var eyes = Settings.eyeColors(s);
    return text.split(' ').map(function (w) {
      return '<span style="color:' + (wordN++ % 2 ? eyes.strong : eyes.weak) + '">' + w + '</span>';
    }).join(' ');
  }

  function renderText() {
    textEl.style.fontSize = s.fontSize + 'px';
    var st = STORIES[storyIdx];
    var ar = st.lang === 'ar';
    wordN = 0;
    textEl.setAttribute('dir', ar ? 'rtl' : 'ltr');
    textEl.setAttribute('lang', st.lang || 'en');
    textEl.className = readingMode === 'eyes' ? 'two-eye' : '';
    textEl.innerHTML =
      '<h2 class="story-title"><span class="story-icon">' + (STORY_ART[st.icon] || '') + '</span>' + eyeWords(st.title) + '</h2>' +
      st.paragraphs.map(function (p) { return '<p>' + eyeWords(p) + '</p>'; }).join('') +
      '<p class="story-end" dir="ltr">◀ ▶ story ' + (storyIdx + 1) + ' of ' + STORIES.length +
      '  ·  ' + LANG_NAMES[st.lang || 'en'] + '</p>';
  }

  function changeStory(dir) {
    storyIdx = (storyIdx + dir + STORIES.length) % STORIES.length;
    Sound.play('page');
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
      if (k === 'calibrate') v = 'press OK';
      if (k === 'weakLens') v = 'behind ' + (v === 'red' ? 'red' : (s.glasses === 'red-blue' ? 'blue' : 'green')) + ' lens';
      if (k === 'strongContrast') v = Math.round(v * 100) + '%';
      return '<li class="' + (i === setFocus ? 'focused' : '') + '"><span>' +
        Settings.LABELS[k] + '</span><span class="value">' + v + '</span></li>';
    }).join('');
  }

  function apply() {
    Bars.render(barsEl, s);
    Engine.setColors(Settings.eyeColors(s));
    Sound.configure({ music: s.music === 'on', sfx: s.sfx === 'on' });
    renderText();
    if (panelOpen()) renderPanel();
  }

  /* ---------- screens ---------- */

  function show(name) {
    screen = name;
    updateBars();
    menuEl.classList.toggle('hidden', name !== 'menu');
    reader.classList.toggle('hidden', name !== 'reader');
    libraryEl.classList.toggle('hidden', name !== 'library');
    canvas.classList.toggle('hidden', name !== 'game');
    calibEl.classList.toggle('hidden', name !== 'calib');
    gameHint.classList.toggle('hidden', name !== 'game');
    if (name !== 'game') Engine.stop();
    if (name === 'menu') renderMenu();
  }

  var currentGame = null;
  function startGame(g) {
    currentGame = g;
    show('game');
    gameHint.textContent = g.hint + '  ·  YELLOW pause  ·  BLUE settings  ·  BACK menu';
    Engine.start(canvas, g);
  }

  function panelOpen() { return !panel.classList.contains('hidden'); }
  function openPanel() { Engine.pause(true); panel.classList.remove('hidden'); renderPanel(); updateBars(); }
  function closePanel() { panel.classList.add('hidden'); updateBars(); }

  // Bars stay off the home menu, but show while Settings is open so changes can be previewed
  function updateBars() {
    var plain = screen === 'menu' || screen === 'library';
    // Two-eye games draw their own colours for each eye, so the bars are not used there
    var twoEye = (screen === 'game' && currentGame && currentGame.dichoptic) || (screen === 'reader' && readingMode === 'eyes');
    barsEl.classList.toggle('hidden', (plain && !panelOpen()) || screen === 'calib' || twoEye);
  }

  // Story list (no bars); picking a story opens it in the reader
  function openLibrary(mode) {
    if (mode) readingMode = mode;
    show('library');
    Library.open(libraryEl, storyIdx, readingMode === 'eyes' ? 'Two-eye reading · choose a story' : 'Choose a story', function (i) {
      storyIdx = i;
      renderText();
      scrollY = 0;
      scroll(0);
      show('reader');
    }, function () { show('menu'); });
  }

  // Colour test & picker. Opened from Settings; returns to Settings when done.
  var beforeCalib = 'menu';
  function openCalib() {
    beforeCalib = screen === 'game' ? 'menu' : screen;   // a running game is ended
    closePanel();
    show('calib');
    Calibrate.open(calibEl, s, function () {
      apply();
      show(beforeCalib);
      openPanel();
    });
  }

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
        Sound.play('select');
      }
      return;
    }

    if (screen === 'calib') { Calibrate.key(k); return; }

    if (panelOpen()) {
      if (k === KEY.ENTER && setKeys[setFocus] === 'calibrate') { openCalib(); return; }
      if (k === KEY.ENTER || k === KEY.BACK || k === KEY.BLUE) { closePanel(); return; }
      if (k === KEY.UP) setFocus = (setFocus - 1 + setKeys.length) % setKeys.length;
      if (k === KEY.DOWN) setFocus = (setFocus + 1) % setKeys.length;
      if (k === KEY.LEFT) Settings.cycle(s, setKeys[setFocus], -1);
      if (k === KEY.RIGHT) Settings.cycle(s, setKeys[setFocus], 1);
      apply();
      if (k >= KEY.LEFT && k <= KEY.DOWN) Sound.play('nav');
      return;
    }

    if (k === KEY.BLUE) { openPanel(); return; }

    if (screen === 'library') { Library.key(k); return; }

    if (screen === 'menu') {
      // Rows of tiles: LEFT/RIGHT move within a row, UP/DOWN move between rows;
      // UP from the first row reaches the ⋮ settings button at the top right
      if (menuFocus === SETTINGS_FOCUS) {
        if (k === KEY.DOWN) menuFocus = MENU_ROWS[0].items[Math.min(lastCol, MENU_ROWS[0].items.length - 1)];
      } else {
        var pos = menuRowOf(menuFocus), row = MENU_ROWS[pos.r].items;
        if (k === KEY.LEFT) menuFocus = row[(pos.c - 1 + row.length) % row.length];
        if (k === KEY.RIGHT) menuFocus = row[(pos.c + 1) % row.length];
        if (k === KEY.UP && pos.r === 0) { lastCol = pos.c; menuFocus = SETTINGS_FOCUS; }
        else if (k === KEY.UP || k === KEY.DOWN) {
          var next = MENU_ROWS[Math.min(MENU_ROWS.length - 1, Math.max(0, pos.r + (k === KEY.DOWN ? 1 : -1)))].items;
          menuFocus = next[Math.min(pos.c, next.length - 1)];
        }
      }
      if (k >= KEY.LEFT && k <= KEY.DOWN) Sound.play('nav');
      if (k === KEY.ENTER) {
        Sound.play('select');
        if (menuFocus === SETTINGS_FOCUS) openPanel(); else MENU[menuFocus].action();
        return;
      }
      if (k === KEY.BACK && window.webOS && webOS.platformBack) webOS.platformBack();
      renderMenu();
      return;
    }

    if (screen === 'reader') {
      if (k === KEY.BACK) { openLibrary(); return; }
      if (k === KEY.ENTER) { openPanel(); return; }
      if (k === KEY.DOWN) scroll(120);
      if (k === KEY.UP) scroll(-120);
      if (k === KEY.LEFT) changeStory(-1);
      if (k === KEY.RIGHT) changeStory(1);
      if (k === KEY.RED && readingMode === 'bars') { Settings.cycle(s, 'orientation', 1); apply(); }
      if (k === KEY.GREEN && readingMode === 'bars') { Settings.cycle(s, 'barSize', 1); apply(); }
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

  // The ⋮ button never keeps keyboard focus, so OK / Enter is always handled by the key handler
  moreBtn.addEventListener('mousedown', function (e) { e.preventDefault(); });
  moreBtn.addEventListener('click', function () { moreBtn.blur(); Sound.play('select'); openPanel(); });

  apply();
  show('menu');
  if (!s.seenDisclaimer) disclaimer.classList.remove('hidden');
})();
