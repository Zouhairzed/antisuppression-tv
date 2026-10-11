/*
 * Small drawings for the reading stories, shown next to each title and in the story list.
 * Drawn in white (and dark #111 for details) so the bars split them like everything else.
 */
var STORY_ART = (function () {
  var W = '#f2f2f2', D = '#111';
  function svg(body) { return '<svg viewBox="0 0 64 64" aria-hidden="true">' + body + '</svg>'; }
  var S = 'fill="none" stroke="' + W + '" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"';
  var F = 'fill="' + W + '"', FD = 'fill="' + D + '"';
  var SD = 'fill="none" stroke="' + D + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"';

  return {
    lighthouse: svg('<path ' + F + ' d="M24 58l4-36h8l4 36z"/><rect ' + S + ' x="25" y="12" width="14" height="10"/>' +
      '<path ' + F + ' d="M22 12l10-8 10 8z"/><path ' + SD + ' d="M26 36h12M25 46h14"/>' +
      '<path ' + S + ' d="M43 15l13-5M43 19l13 4M21 15L8 10M21 19L8 23M12 58h40"/>'),
    tortoise: svg('<path ' + F + ' d="M8 46a24 22 0 0 1 46 0z"/><path ' + SD + ' d="M18 46l6-14h14l6 14M24 32l7-8 7 8"/>' +
      '<circle ' + F + ' cx="57" cy="41" r="6"/><rect ' + F + ' x="14" y="45" width="8" height="9" rx="3"/>' +
      '<rect ' + F + ' x="38" y="45" width="8" height="9" rx="3"/>' +
      '<path ' + F + ' d="M12 6l2 5 5 1-4 3 1 5-4-3-4 3 1-5-4-3 5-1z"/>'),
    kite: svg('<path ' + F + ' d="M32 4l18 20-18 20-18-20z"/><path ' + SD + ' d="M32 4v40M14 24h36"/>' +
      '<path ' + S + ' d="M32 44c-6 5 6 8 0 13"/><path ' + F + ' d="M24 49l6 2-6 3zM40 55l-6 2 6 3z"/>'),
    bread: svg('<path ' + F + ' d="M6 42c0-20 52-20 52 0v10a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4z"/>' +
      '<path ' + SD + ' d="M18 30l6 8M29 27l6 9M40 29l6 8"/>'),
    windows: svg('<rect ' + S + ' x="5" y="12" width="23" height="36" rx="2"/><path ' + S + ' d="M16.5 12v36M5 30h23"/>' +
      '<rect ' + S + ' x="36" y="12" width="23" height="36" rx="2"/><path ' + S + ' d="M47.5 12v36M36 30h23"/>' +
      '<path ' + S + ' d="M3 54h58"/>'),
    snail: svg('<circle ' + F + ' cx="36" cy="32" r="17"/>' +
      '<path ' + SD + ' d="M36 32a3 3 0 1 1 3 3 7 7 0 1 1 4-8 11 11 0 1 1-17 9"/>' +
      '<path ' + F + ' d="M6 50h50a4 4 0 0 1-4 6H10a6 6 0 0 1-6-6V40a5 5 0 0 1 10 0v10z"/>' +
      '<path ' + S + ' d="M7 36l-3-10M12 36l2-10"/><circle ' + F + ' cx="4" cy="25" r="3"/><circle ' + F + ' cx="14" cy="25" r="3"/>'),
    clock: svg('<circle ' + S + ' cx="32" cy="34" r="24"/><path ' + S + ' d="M32 34V20M32 34l10 6"/>' +
      '<circle ' + F + ' cx="32" cy="34" r="3"/><path ' + S + ' d="M32 13v3M32 52v3M11 34h3M50 34h3M22 4l-6 6M42 4l6 6"/>'),
    sunflower: svg('<g ' + F + '><ellipse cx="32" cy="10" rx="5" ry="8"/><ellipse cx="32" cy="38" rx="5" ry="8"/>' +
      '<ellipse cx="18" cy="24" rx="8" ry="5"/><ellipse cx="46" cy="24" rx="8" ry="5"/>' +
      '<ellipse cx="22" cy="14" rx="5" ry="8" transform="rotate(-45 22 14)"/><ellipse cx="42" cy="14" rx="5" ry="8" transform="rotate(45 42 14)"/>' +
      '<ellipse cx="22" cy="34" rx="5" ry="8" transform="rotate(45 22 34)"/><ellipse cx="42" cy="34" rx="5" ry="8" transform="rotate(-45 42 34)"/></g>' +
      '<circle ' + FD + ' stroke="' + W + '" stroke-width="3" cx="32" cy="24" r="8"/><path ' + S + ' d="M32 46v16"/>' +
      '<path ' + F + ' d="M32 56c-4-8-12-8-16-6 4 6 10 8 16 6z"/>'),
    sock: svg('<path ' + F + ' d="M24 4h18v30c0 12-6 20-16 22-9 2-17-2-18-9s5-12 12-12l4-1z"/>' +
      '<path ' + FD + ' d="M24 10h18v5H24zM24 20h18v5H24z"/><circle ' + FD + ' cx="16" cy="45" r="2"/><circle ' + FD + ' cx="23" cy="46" r="2"/>'),
    cake: svg('<rect ' + F + ' x="8" y="34" width="48" height="22" rx="3"/><path ' + SD + ' d="M10 42c5 4 9 4 13 0s9-4 13 0 9 4 13 0 5-2 5-2"/>' +
      '<rect ' + F + ' x="16" y="20" width="5" height="14" rx="1"/><rect ' + F + ' x="30" y="20" width="5" height="14" rx="1"/>' +
      '<rect ' + F + ' x="44" y="20" width="5" height="14" rx="1"/><path ' + F + ' d="M18.5 8c3 4 3 7 0 9-3-2-3-5 0-9zM32.5 8c3 4 3 7 0 9-3-2-3-5 0-9zM46.5 8c3 4 3 7 0 9-3-2-3-5 0-9z"/>'),
    robot: svg('<path ' + S + ' d="M32 12V5"/><circle ' + F + ' cx="32" cy="4" r="3"/><rect ' + F + ' x="18" y="12" width="28" height="20" rx="5"/>' +
      '<circle ' + FD + ' cx="26" cy="22" r="3.5"/><circle ' + FD + ' cx="38" cy="22" r="3.5"/><rect ' + F + ' x="16" y="35" width="32" height="20" rx="4"/>' +
      '<rect ' + FD + ' x="24" y="40" width="16" height="6" rx="2"/><path ' + S + ' d="M16 40l-8-8M48 40l8-8M24 55v6M40 55v6"/>'),
    bathtub: svg('<path ' + F + ' d="M4 32h56v6c0 9-7 14-15 14H19C11 52 4 47 4 38z"/><path ' + S + ' d="M14 52l-3 7M50 52l3 7M10 32V14a5 5 0 0 1 10 0"/>' +
      '<circle ' + S + ' cx="30" cy="20" r="5"/><circle ' + S + ' cx="44" cy="14" r="6"/><circle ' + S + ' cx="47" cy="27" r="3"/>'),
    crocodile: svg('<path ' + F + ' d="M2 34l44-8c8-1 14 3 16 8-2 4-8 7-16 6H2z"/><path ' + F + ' d="M14 30l4-6 4 5zM24 28l4-6 4 5z"/>' +
      '<circle ' + F + ' cx="44" cy="24" r="6"/><circle ' + FD + ' cx="45" cy="23" r="2.5"/>' +
      '<path ' + SD + ' d="M8 35l4 3 4-3 4 3 4-3 4 3 4-3 4 3 4-3"/><circle ' + FD + ' cx="57" cy="31" r="1.5"/>' +
      '<path ' + S + ' d="M2 52c6-4 10-4 16 0s10 4 16 0 10-4 16 0 8 4 12 2"/>'),
    cow: svg('<path ' + S + ' d="M20 18C16 14 14 8 16 4M44 18c4-4 6-10 4-14"/>' +
      '<ellipse ' + F + ' cx="10" cy="26" rx="8" ry="4" transform="rotate(20 10 26)"/><ellipse ' + F + ' cx="54" cy="26" rx="8" ry="4" transform="rotate(-20 54 26)"/>' +
      '<ellipse ' + F + ' cx="32" cy="32" rx="16" ry="18"/><path ' + FD + ' d="M36 18c6 0 8 5 5 8s-8 1-8-3 1-5 3-5z"/>' +
      '<circle ' + FD + ' cx="25" cy="30" r="3"/><circle ' + FD + ' cx="39" cy="30" r="3"/>' +
      '<ellipse ' + FD + ' stroke="' + W + '" stroke-width="3" cx="32" cy="47" rx="13" ry="9"/><circle ' + F + ' cx="27" cy="47" r="2.5"/><circle ' + F + ' cx="37" cy="47" r="2.5"/>'),
    cloud: svg('<path ' + F + ' d="M16 42a10 10 0 0 1 2-20 14 14 0 0 1 26-4 11 11 0 0 1 6 24z"/>' +
      '<path ' + SD + ' d="M22 26l7 3M42 26l-7 3M26 37c3-3 9-3 12 0"/><circle ' + FD + ' cx="26" cy="31" r="2"/><circle ' + FD + ' cx="38" cy="31" r="2"/>' +
      '<path ' + F + ' d="M20 48c3 4 3 7 0 8-3-1-3-4 0-8zM32 50c3 4 3 7 0 8-3-1-3-4 0-8zM44 48c3 4 3 7 0 8-3-1-3-4 0-8z"/>'),
    penguin: svg('<ellipse ' + F + ' cx="32" cy="32" rx="16" ry="24"/><ellipse fill="none" stroke="' + D + '" stroke-width="3" cx="32" cy="38" rx="9" ry="14"/>' +
      '<circle ' + FD + ' cx="26" cy="20" r="2.5"/><circle ' + FD + ' cx="38" cy="20" r="2.5"/><path ' + FD + ' d="M28 25h8l-4 5z"/>' +
      '<ellipse ' + F + ' cx="14" cy="36" rx="4" ry="11" transform="rotate(20 14 36)"/><ellipse ' + F + ' cx="50" cy="36" rx="4" ry="11" transform="rotate(-20 50 36)"/>' +
      '<path ' + F + ' d="M20 56h10l-4 6zM34 56h10l-6 6z"/>'),
    camel: svg('<path ' + F + ' d="M8 40c0-10 6-16 11-9 4-10 12-10 16 1h11l4-15c1-3 6-4 9-2l1 5h-5l-5 20H8z"/>' +
      '<path ' + F + ' d="M10 40h5v18h-5zM18 40h5v18h-5zM36 40h5v18h-5zM44 40h5v18h-5z"/><path ' + S + ' d="M8 36c-3 2-4 6-3 9"/>' +
      '<path ' + S + ' d="M2 60h60"/>'),
    olive: svg('<path ' + F + ' d="M29 60c1-10-4-14-2-24h10c2 10-3 14-2 24z"/><circle ' + F + ' cx="22" cy="24" r="13"/>' +
      '<circle ' + F + ' cx="42" cy="22" r="13"/><circle ' + F + ' cx="32" cy="14" r="11"/>' +
      '<ellipse ' + FD + ' cx="18" cy="26" rx="2.5" ry="3.5"/><ellipse ' + FD + ' cx="30" cy="18" rx="2.5" ry="3.5"/>' +
      '<ellipse ' + FD + ' cx="44" cy="26" rx="2.5" ry="3.5"/><ellipse ' + FD + ' cx="38" cy="14" rx="2.5" ry="3.5"/>'),
    door: svg('<path ' + S + ' d="M14 60V26a18 18 0 0 1 36 0v34z"/><path ' + S + ' d="M20 60V28a12 12 0 0 1 24 0v32"/>' +
      '<g ' + F + '><circle cx="24" cy="36" r="2"/><circle cx="40" cy="36" r="2"/><circle cx="24" cy="48" r="2"/><circle cx="40" cy="48" r="2"/>' +
      '<circle cx="32" cy="24" r="2"/></g><circle ' + S + ' cx="36" cy="42" r="3"/><path ' + S + ' d="M6 60h52"/>')
  };
})();
