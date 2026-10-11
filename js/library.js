/*
 * Story list: a grid of tiles with each story's drawing, title and language.
 * Shown without bars (like the home menu); the story itself opens under the bars.
 */
var Library = (function () {
  var KEY = { LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, ENTER: 13, BACK: 461 };
  var COLS = 5;
  var LANG = { en: 'English', fr: 'Français', ar: 'العربية' };
  var root, focus = 0, onPick, onBack, bound = false;

  function render() {
    var html = '<h1>Choose a story</h1><ul class="lib-grid">';
    STORIES.forEach(function (st, i) {
      var lang = st.lang || 'en';
      html += '<li data-i="' + i + '" class="' + (i === focus ? 'focused' : '') + '">' +
        '<span class="lib-icon">' + (STORY_ART[st.icon] || '') + '</span>' +
        '<span class="lib-title" dir="' + (lang === 'ar' ? 'rtl' : 'ltr') + '">' + st.title + '</span>' +
        '<span class="lib-lang">' + LANG[lang] + '</span></li>';
    });
    html += '</ul><p class="hint">◀ ▲ ▼ ▶ choose · OK read · BACK menu</p>';
    root.innerHTML = html;
  }

  function key(k) {
    var n = STORIES.length, f = focus;
    if (k === KEY.LEFT) f = Math.max(0, f - 1);
    if (k === KEY.RIGHT) f = Math.min(n - 1, f + 1);
    if (k === KEY.UP && f - COLS >= 0) f -= COLS;
    if (k === KEY.DOWN) f = Math.min(n - 1, f + COLS);
    if (f !== focus) { focus = f; Sound.play('nav'); render(); return; }
    if (k === KEY.ENTER) { Sound.play('select'); onPick(focus); return; }
    if (k === KEY.BACK) onBack();
  }

  function open(container, startIdx, pick, back) {
    root = container; focus = startIdx || 0; onPick = pick; onBack = back;
    if (!bound) {                       // mouse, touch and Magic Remote pointer
      bound = true;
      root.addEventListener('click', function (e) {
        var li = e.target;
        while (li && li !== root && li.tagName !== 'LI') li = li.parentNode;
        if (!li || li === root) return;
        focus = +li.getAttribute('data-i');
        Sound.play('select');
        onPick(focus);
      });
    }
    render();
  }

  return { open: open, key: key };
})();
