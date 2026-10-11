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
    reading2: {
      tag: 'words for each eye',
      icon: svg('<g fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M32 15c-6-4-14-5-23-4v37c9-1 17 0 23 4 6-4 14-5 23-4V11c-9-1-17 0-23 4zM32 15v37"/></g>' +
        '<rect x="13" y="19" width="13" height="5" rx="2"/><rect x="38" y="19" width="13" height="5" rx="2"/>' +
        '<g fill="none" stroke="currentColor" stroke-width="2.5"><rect x="13.5" y="28.5" width="12" height="4" rx="2"/>' +
        '<rect x="38.5" y="28.5" width="12" height="4" rx="2"/></g>' +
        '<rect x="13" y="37" width="13" height="5" rx="2"/><rect x="38" y="37" width="13" height="5" rx="2"/>')
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
    split: {
      tag: 'blocks for both eyes',
      icon: svg('<g fill="none" stroke="currentColor" stroke-width="3"><rect x="14" y="5" width="11" height="11" rx="2"/>' +
        '<rect x="26.5" y="5" width="11" height="11" rx="2"/><rect x="39" y="5" width="11" height="11" rx="2"/>' +
        '<rect x="26.5" y="17.5" width="11" height="11" rx="2"/></g>' +
        '<rect x="6" y="46" width="12" height="12" rx="2"/><rect x="19" y="46" width="12" height="12" rx="2"/>' +
        '<rect x="45" y="46" width="12" height="12" rx="2"/><rect x="6" y="33" width="12" height="12" rx="2"/>' +
        '<rect x="45" y="33" width="12" height="12" rx="2"/><rect x="32" y="46" width="12" height="12" rx="2"/>')
    },
    paddle: {
      tag: 'bounce and break',
      icon: svg('<rect x="6" y="6" width="15" height="8" rx="1"/><rect x="24.5" y="6" width="15" height="8" rx="1"/>' +
        '<rect x="43" y="6" width="15" height="8" rx="1"/><rect x="6" y="17" width="15" height="8" rx="1"/>' +
        '<rect x="43" y="17" width="15" height="8" rx="1"/><circle cx="36" cy="38" r="5"/>' +
        '<rect x="16" y="52" width="30" height="6" rx="3"/>')
    },
    fruit: {
      tag: 'catch fruit, not bugs',
      icon: svg('<circle cx="26" cy="18" r="9"/><circle cx="36" cy="18" r="9"/><rect x="30" y="2" width="3" height="8"/>' +
        '<path d="M6 36h52l-7 22H13z"/><path d="M4 33h56v5H4z"/>' +
        '<path d="M20 41v13M28 41v13M36 41v13M44 41v13" stroke="#111" stroke-width="3"/>')
    },
    chase: {
      tag: 'a maze for both eyes',
      icon: svg('<g fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M8 8h48v48H8zM8 22h18M40 8v16M24 22v20M24 42h18"/></g>' +
        '<path d="M44 40l10 4-10 4z"/><circle cx="16" cy="48" r="5"/>')
    },
    garden: {
      tag: 'drag the pieces',
      icon: svg('<path d="M31 34h3v24h-3z"/><path d="M32 50q-12-1-14-12q11 1 14 9zM33 46q11-1 13-11q-10 2-13 8z"/>' +
        '<path d="M22 12l5 6l5-9l5 9l5-6q2 18-10 19q-12-1-10-19z"/>' +
        '<rect x="6" y="56" width="52" height="4" rx="2"/>' +
        '<path d="M46 14h12v12H46z" fill="none" stroke="currentColor" stroke-width="3" stroke-dasharray="4 3"/>')
    },
    settings: {
      tag: 'glasses, eyes, sound',
      icon: svg('<path d="M10 16h44M10 32h44M10 48h44"/>' +
        '<circle cx="22" cy="16" r="6" fill="currentColor"/><circle cx="42" cy="32" r="6" fill="currentColor"/>' +
        '<circle cx="28" cy="48" r="6" fill="currentColor"/>',
        'fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"')
    }
  };
})();
