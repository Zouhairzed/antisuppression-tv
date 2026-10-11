/*
 * Menu tile artwork: an icon and a short tagline for each menu item.
 * Icons are simple line/solid drawings in the current text colour.
 */
var MENU_ART = (function () {
  function svg(body, extra) {
    return '<svg viewBox="0 0 64 64" aria-hidden="true" ' + (extra || 'fill="currentColor"') + '>' + body + '</svg>';
  }
  return {
    reading: {
      tag: 'stories',
      icon: svg('<path d="M32 15c-6-4-14-5-23-4v37c9-1 17 0 23 4 6-4 14-5 23-4V11c-9-1-17 0-23 4z"/>' +
        '<path d="M32 15v37M15 22h10M15 30h10M39 22h10M39 30h10"/>',
        'fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"')
    },
    blaster: {
      tag: 'shoot falling shapes',
      icon: svg('<rect x="14" y="46" width="36" height="12" rx="2"/><path d="M20 46a12 12 0 0 1 24 0z"/>' +
        '<rect x="29" y="22" width="6" height="18" rx="2"/><path d="M47 5l8 13H39z"/>' +
        '<rect x="9" y="7" width="12" height="12" rx="1" transform="rotate(20 15 13)"/>')
    },
    racer: {
      tag: 'dodge the traffic',
      icon: svg('<path fill-rule="evenodd" d="M27 5h10a7 7 0 0 1 7 7v40a7 7 0 0 1-7 7H27a7 7 0 0 1-7-7V12a7 7 0 0 1 7-7zm-1 12v9h12v-9z"/>' +
        '<rect x="14" y="13" width="5" height="12" rx="2"/><rect x="45" y="13" width="5" height="12" rx="2"/>' +
        '<rect x="14" y="40" width="5" height="12" rx="2"/><rect x="45" y="40" width="5" height="12" rx="2"/>')
    },
    runner: {
      tag: 'jump and duck',
      icon: svg('<rect x="12" y="28" width="30" height="15" rx="6"/>' +
        '<path d="M36 18l3-9 5 7h4l5-7 3 9v11a7 7 0 0 1-7 7h-6a7 7 0 0 1-7-7z"/>' +
        '<rect x="15" y="41" width="6" height="15" rx="2"/><rect x="33" y="41" width="6" height="15" rx="2"/>' +
        '<path d="M13 33C5 31 3 23 7 16" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>')
    },
    snake: {
      tag: 'eat and grow',
      icon: svg('<path d="M8 52h22V32h16" fill="none" stroke="currentColor" stroke-width="9" stroke-linejoin="round"/>' +
        '<rect x="42" y="25" width="14" height="14" rx="3"/><circle cx="50" cy="12" r="6"/>')
    },
    maze: {
      tag: 'escape the cats',
      icon: svg('<path d="M8 8h48v48H8zM8 22h18M40 8v16M24 22v20M24 42h18M42 34h14M42 34v8"/>' +
        '<circle cx="15" cy="48" r="4" fill="currentColor" stroke="none"/>',
        'fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"')
    },
    blocks: {
      tag: 'fill the lines',
      icon: svg('<rect x="13" y="5" width="12" height="12" rx="2"/><rect x="26" y="5" width="12" height="12" rx="2"/>' +
        '<rect x="39" y="5" width="12" height="12" rx="2"/><rect x="26" y="18" width="12" height="12" rx="2"/>' +
        '<rect x="6" y="46" width="12" height="12" rx="2"/><rect x="19" y="46" width="12" height="12" rx="2"/>' +
        '<rect x="45" y="46" width="12" height="12" rx="2"/><rect x="6" y="33" width="12" height="12" rx="2"/>' +
        '<rect x="45" y="33" width="12" height="12" rx="2"/><rect x="32" y="46" width="12" height="12" rx="2"/>')
    },
    sneak: {
      tag: 'catch the sneaky owl',
      icon: svg('<path d="M14 22l2-14 10 9zM50 22l-2-14-10 9z"/><ellipse cx="32" cy="36" rx="20" ry="24"/>' +
        '<circle cx="24" cy="30" r="7" fill="#111"/><circle cx="40" cy="30" r="7" fill="#111"/>' +
        '<circle cx="27" cy="30" r="3"/><circle cx="43" cy="30" r="3"/><path d="M29 38h6l-3 5z" fill="#111"/>')
    },
    settings: {
      tag: 'glasses, bars, sound',
      icon: svg('<path d="M10 16h44M10 32h44M10 48h44"/>' +
        '<circle cx="22" cy="16" r="6" fill="currentColor"/><circle cx="42" cy="32" r="6" fill="currentColor"/>' +
        '<circle cx="28" cy="48" r="6" fill="currentColor"/>',
        'fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"')
    }
  };
})();
