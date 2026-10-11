/* Draws alternating red/green (or red/blue) bars using a CSS repeating gradient (cheap on TV GPUs). */
var Bars = (function () {
  function hexToRgba(hex, a) {
    var n = parseInt(hex.slice(1), 16);
    return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  }

  function render(el, s) {
    var r = hexToRgba(s.redColor, s.opacity);
    var g = hexToRgba(Settings.secondColor(s), s.opacity);
    var w = s.barSize;
    var dir = s.orientation === 'vertical' ? '90deg' : '180deg';
    el.style.background =
      'repeating-linear-gradient(' + dir + ',' +
      r + ' 0px,' + r + ' ' + w + 'px,' +
      g + ' ' + w + 'px,' + g + ' ' + (2 * w) + 'px)';
  }

  return { render: render };
})();
