/*
 * Garden Puzzle — two-eye drag-and-drop puzzle (no bars). A garden picture is cut into pieces
 * that wait in a tray on the right; drag each piece onto the board, where a faint copy of the
 * picture shows where it goes. A piece dropped in its own place snaps in; anywhere else it
 * goes back to the tray. There are no lives to lose: take your time.
 *
 * Mouse / touch / Magic Remote pointer: drag a piece onto the board.
 * Remote / keyboard: ◀ ▲ ▼ ▶ choose a piece, OK picks it up; ◀ ▲ ▼ ▶ move it over the board,
 * OK drops it (BACK while holding is not needed: a wrong drop keeps the piece in hand).
 *
 * Each garden is drawn in two colours: flowers, fruit and the sun in the weaker eye's colour,
 * leaves, stems, grass and trees in the stronger eye's colour (dimmed by Strong-eye contrast).
 * Piece edges are grey (both eyes). Puzzle 1 has 6 pieces, puzzle 2 has 9, then 12.
 */
var Garden = (function () {
  var K = { LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, ENTER: 13 };
  var FG = Engine.FG;
  var BX = 110, BY = 182, BW = 1080, BH = 810;          // board (4:3, like the pictures)
  var TX = 1250, TY = 182, TW = 560, TH = 810;          // piece tray
  var EDGE = '#8a8a8a';

  /* Gardens (original drawings, viewBox 0 0 120 90). fill="A": weaker eye's colour,
     fill="B": stronger eye's colour, fill="#111": dark details. */
  function tulip(x, y) {
    return '<path fill="B" d="M' + (x - 1.5) + ' ' + y + 'h3v' + (78 - y) + 'h-3z"/>' +
      '<path fill="B" d="M' + x + ' ' + (y + 22) + 'q-11-2-12-12q9 1 12 9zM' + x + ' ' + (y + 16) + 'q10-1 11-11q-9 2-11 8z"/>' +
      '<path fill="A" d="M' + (x - 8) + ' ' + (y - 6) + 'l4 5l4-7l4 7l4-5q1 14-8 15q-9-1-8-15z"/>';
  }
  function berry(x, y) {
    return '<path fill="A" d="M' + x + ' ' + (y - 6) + 'q8-1 7 6q-2 8-7 11q-5-3-7-11q-1-7 7-6z"/>' +
      '<path fill="B" d="M' + (x - 5) + ' ' + (y - 6) + 'l5 3l5-3l-2 4l-3-1l-3 1z"/>' +
      '<circle fill="#111" cx="' + (x - 2) + '" cy="' + (y + 1) + '" r=".8"/><circle fill="#111" cx="' + (x + 2) + '" cy="' + (y + 2) + '" r=".8"/>' +
      '<circle fill="#111" cx="' + x + '" cy="' + (y + 5) + '" r=".8"/>';
  }
  function poppy(x, y) {
    return '<path fill="B" d="M' + (x - 1) + ' ' + y + 'h2v' + (80 - y) + 'h-2z"/>' +
      '<circle fill="A" cx="' + (x - 4) + '" cy="' + y + '" r="5"/><circle fill="A" cx="' + (x + 4) + '" cy="' + y + '" r="5"/>' +
      '<circle fill="A" cx="' + x + '" cy="' + (y - 4) + '" r="5"/><circle fill="A" cx="' + x + '" cy="' + (y + 4) + '" r="5"/>' +
      '<circle fill="#111" cx="' + x + '" cy="' + y + '" r="2.2"/>';
  }
  var SUN = '<circle fill="A" cx="16" cy="15" r="8"/>';
  var GRASS = '<path fill="B" d="M0 80q6-5 10 0q6-5 10 0q6-5 10 0q6-5 10 0q6-5 10 0q6-5 10 0q6-5 10 0q6-5 10 0q6-5 10 0q6-5 10 0q6-5 10 0q6-5 10 0V90H0z"/>';
  var GARDENS = [
    { name: 'Tulips', svg: SUN + '<path fill="B" d="M84 12h18a5 5 0 0 1 0 10H82a5 5 0 0 1 2-10z"/>' +
        '<path fill="A" d="M52 20q4-6 8 0q4-6 8 0q-4 6-8 2q-4 4-8-2z"/>' +
        tulip(18, 44) + tulip(42, 38) + tulip(66, 46) + tulip(90, 36) + tulip(110, 50) + GRASS },
    { name: 'Apple tree', svg: SUN + '<path fill="B" d="M55 50h10v30H55z"/>' +
        '<circle fill="B" cx="60" cy="32" r="22"/><circle fill="B" cx="40" cy="40" r="14"/><circle fill="B" cx="80" cy="40" r="14"/>' +
        '<circle fill="A" cx="50" cy="26" r="4"/><circle fill="A" cx="68" cy="22" r="4"/><circle fill="A" cx="38" cy="42" r="4"/>' +
        '<circle fill="A" cx="60" cy="40" r="4"/><circle fill="A" cx="82" cy="38" r="4"/><circle fill="A" cx="74" cy="50" r="4"/>' +
        '<circle fill="A" cx="24" cy="76" r="4"/><circle fill="A" cx="96" cy="77" r="4"/>' +
        '<path fill="B" d="M100 64h16l-3 14h-10z"/><circle fill="A" cx="104" cy="62" r="3.5"/><circle fill="A" cx="111" cy="62" r="3.5"/>' +
        '<path fill="B" d="M96 12h16a5 5 0 0 1 0 10H94a5 5 0 0 1 2-10z"/>' + GRASS },
    { name: 'Strawberries', svg: SUN + '<path fill="B" d="M70 10h18a5 5 0 0 1 0 10H68a5 5 0 0 1 2-10z"/>' +
        '<path fill="B" d="M8 66q10-22 26-14q-6 18-26 14zM34 52q14-20 28-4q-12 14-28 4zM62 50q18-14 26 6q-16 8-26-6zM88 54q16-16 28 2q-14 12-28-2z"/>' +
        '<path fill="B" d="M2 72h116v8H2z"/>' +
        berry(14, 72) + berry(30, 62) + berry(48, 66) + berry(64, 60) + berry(80, 68) + berry(98, 62) + berry(110, 72) +
        '<path fill="A" d="M42 30q3-5 6 0q3-5 6 0q-3 5-6 2q-3 3-6-2z"/>' + GRASS },
    { name: 'Ladybug', svg: SUN + '<path fill="B" d="M96 10h16a5 5 0 0 1 0 10H94a5 5 0 0 1 2-10z"/>' +
        poppy(14, 50) + poppy(28, 62) + poppy(98, 48) + poppy(108, 62) +
        '<path fill="B" d="M30 66Q34 26 74 24Q96 26 92 46Q84 74 30 66z"/><path fill="#111" d="M34 63L86 32l1 2L35 65z"/>' +
        '<circle fill="A" cx="62" cy="46" r="12"/><circle fill="#111" cx="73" cy="38" r="5"/>' +
        '<path fill="#111" d="M61.2 34.5l1.6 0l-1 23l-1.6 0z"/>' +
        '<circle fill="#111" cx="56" cy="42" r="2.4"/><circle fill="#111" cx="57" cy="51" r="2.4"/>' +
        '<circle fill="#111" cx="67" cy="45" r="2.4"/><circle fill="#111" cx="66" cy="54" r="2"/>' +
        '<path fill="A" d="M44 14q3-5 6 0q3-5 6 0q-3 5-6 2q-3 3-6-2z"/>' + GRASS }
  ];
  var SIZES = [[3, 2], [3, 3], [4, 3]];                   // columns × rows for puzzles 1, 2, 3+

  var puzzle, cols, rows, cw, ch, pieces, placedCount, garden, img, imgKey, solvedT;
  var trayCols, trayRows, slotW, slotH, scale;
  var cursor, boardCell, holding, drag, flash;

  /* The picture, rendered once per garden and colour pair at board size */
  function picture(eyes) {
    var key = garden.name + eyes.weak + eyes.strong;
    if (key === imgKey) return img;
    imgKey = key;
    var svg = ('<svg xmlns="http://www.w3.org/2000/svg" width="' + BW + '" height="' + BH + '" viewBox="0 0 120 90">' +
      garden.svg + '</svg>')
      .split('fill="A"').join('fill="' + eyes.weak + '"')
      .split('fill="B"').join('fill="' + eyes.strong + '"');
    img = new Image();
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    return img;
  }

  function newPuzzle() {
    puzzle++;
    var sz = SIZES[Math.min(puzzle, SIZES.length) - 1];
    cols = sz[0]; rows = sz[1];
    cw = BW / cols; ch = BH / rows;
    garden = GARDENS[(puzzle - 1) % GARDENS.length];
    var n = cols * rows;
    trayCols = n <= 6 ? 2 : 3;
    trayRows = Math.ceil(n / trayCols);
    slotW = TW / trayCols; slotH = TH / trayRows;
    scale = Math.min((slotW - 24) / cw, (slotH - 24) / ch);
    // Pieces get shuffled tray slots; each knows its own place on the board
    var order = [];
    for (var i = 0; i < n; i++) order.push(i);
    for (i = n - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = order[i]; order[i] = order[j]; order[j] = t; }
    pieces = [];
    for (i = 0; i < n; i++) pieces.push({ id: i, slot: order[i], placed: false });
    placedCount = 0; solvedT = 0; holding = null; drag = null; flash = 0;
    cursor = firstLoose(0); boardCell = 0;
  }

  function init() { puzzle = 0; newPuzzle(); }

  /* ---------- geometry ---------- */
  function slotRect(slot) {
    var c = slot % trayCols, r = Math.floor(slot / trayCols);
    var w = cw * scale, h = ch * scale;
    return { x: TX + c * slotW + (slotW - w) / 2, y: TY + r * slotH + (slotH - h) / 2, w: w, h: h };
  }
  function cellRect(id) { return { x: BX + (id % cols) * cw, y: BY + Math.floor(id / cols) * ch, w: cw, h: ch }; }
  function pieceAtSlot(slot) {
    for (var i = 0; i < pieces.length; i++) if (pieces[i].slot === slot && !pieces[i].placed) return pieces[i];
    return null;
  }
  function firstLoose(from) {
    var n = cols * rows;
    for (var k = 0; k < n; k++) if (pieceAtSlot((from + k) % n)) return (from + k) % n;
    return 0;
  }

  /* ---------- placing ---------- */
  function drop(p, cell, st) {
    if (cell === p.id) {
      p.placed = true; placedCount++;
      st.score += 10;
      Sound.play('collect');
      if (placedCount === pieces.length) {
        st.score += 100 + 20 * puzzle;
        solvedT = 2.6;
        Sound.play('level');
      }
      return true;
    }
    flash = 0.5;
    Sound.play('tick');
    return false;
  }

  /* ---------- remote / keyboard ---------- */
  function keydown(k, st, repeat) {
    if (solvedT > 0 || drag) return;
    var n = cols * rows;
    if (!holding) {                                   // choosing a piece in the tray
      var c = cursor % trayCols, r = Math.floor(cursor / trayCols), next = cursor;
      if (k === K.ENTER) {
        var p = pieceAtSlot(cursor);
        if (p) { holding = p; Sound.play('select'); }
        return;
      }
      if (k === K.LEFT || k === K.RIGHT) {               // step to the next loose piece that way
        var d = k === K.LEFT ? -1 : 1;
        for (var s = cursor + d; s >= 0 && s < n; s += d) if (pieceAtSlot(s)) { next = s; break; }
      }
      if (k === K.UP || k === K.DOWN) {
        var dr = k === K.UP ? -1 : 1;
        for (var rr = r + dr; rr >= 0 && rr < trayRows; rr += dr) {
          var best = -1;
          for (var cc = 0; cc < trayCols; cc++) {
            var sl = rr * trayCols + cc;
            if (sl < n && pieceAtSlot(sl) && (best < 0 || Math.abs(cc - c) < Math.abs(best % trayCols - c))) best = sl;
          }
          if (best >= 0) { next = best; break; }
        }
      }
      if (next !== cursor) { cursor = next; Sound.play('move'); }
      return;
    }
    // holding a piece: move it over the board, OK drops it
    var bc = boardCell % cols, br = Math.floor(boardCell / cols);
    if (k === K.LEFT && bc > 0) bc--;
    if (k === K.RIGHT && bc < cols - 1) bc++;
    if (k === K.UP && br > 0) br--;
    if (k === K.DOWN && br < rows - 1) br++;
    if (k >= K.LEFT && k <= K.DOWN) {
      if (br * cols + bc !== boardCell) { boardCell = br * cols + bc; Sound.play('move'); }
      return;
    }
    if (k === K.ENTER && drop(holding, boardCell, st)) {
      holding = null;
      if (placedCount < pieces.length) cursor = firstLoose(cursor);
    }
  }

  /* ---------- mouse / touch / pointer ---------- */
  function pointer(type, x, y, st) {
    if (solvedT > 0) return;
    if (type === 'down') {
      for (var i = 0; i < pieces.length; i++) {
        var p = pieces[i];
        if (p.placed) continue;
        var r = slotRect(p.slot);
        if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) {
          holding = null;
          // Grab point kept in full-size piece coordinates, so the piece grows under the finger
          drag = { p: p, ox: (x - r.x) / scale, oy: (y - r.y) / scale, x: x, y: y };
          cursor = p.slot;
          Sound.play('select');
          return;
        }
      }
    } else if (type === 'move' && drag) {
      drag.x = x; drag.y = y;
    } else if (type === 'up' && drag) {
      var cx = drag.x - drag.ox + cw / 2, cy = drag.y - drag.oy + ch / 2;   // piece centre
      var p2 = drag.p;
      drag = null;
      if (cx >= BX && cx < BX + BW && cy >= BY && cy < BY + BH) {
        var cell = Math.floor((cy - BY) / ch) * cols + Math.floor((cx - BX) / cw);
        if (drop(p2, cell, st) && placedCount < pieces.length) cursor = firstLoose(cursor);
      }
    }
  }

  function update(dt) {
    if (flash > 0) flash -= dt;
    if (solvedT > 0) { solvedT -= dt; if (solvedT <= 0) newPuzzle(); }
  }

  /* ---------- drawing ---------- */
  function drawPiece(ctx, pic, p, x, y, w, h) {
    var sx = (p.id % cols) * cw, sy = Math.floor(p.id / cols) * ch;
    ctx.fillStyle = '#111';
    ctx.fillRect(x, y, w, h);
    ctx.drawImage(pic, sx, sy, cw, ch, x, y, w, h);
    ctx.strokeStyle = EDGE; ctx.lineWidth = 3;
    ctx.strokeRect(x + 1.5, y + 1.5, w - 3, h - 3);
  }

  function draw(ctx) {
    var eyes = Engine.colors(), pic = picture(eyes), ready = pic.complete && pic.naturalWidth > 0;

    ctx.fillStyle = FG; ctx.textAlign = 'left'; ctx.font = '34px Arial, sans-serif';
    ctx.fillText('Puzzle ' + puzzle + ' · ' + garden.name + ' · ' + placedCount + ' / ' + pieces.length, BX, BY - 22);
    ctx.fillText('Pieces', TX, TY - 22);
    ctx.strokeStyle = FG; ctx.lineWidth = 4;
    ctx.strokeRect(BX - 8, BY - 8, BW + 16, BH + 16);
    ctx.strokeStyle = '#444'; ctx.lineWidth = 3;
    ctx.strokeRect(TX - 8, TY - 8, TW + 16, TH + 16);
    if (!ready) return;

    if (solvedT > 0) {                                  // the whole garden
      ctx.drawImage(pic, BX, BY, BW, BH);
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(BX, BY + BH / 2 - 70, BW, 120);
      ctx.fillStyle = FG; ctx.textAlign = 'center'; ctx.font = 'bold 64px Arial, sans-serif';
      ctx.fillText('Well done!', BX + BW / 2, BY + BH / 2 + 12);
      return;
    }

    // Faint copy of the picture shows where each piece goes, with a grey grid
    ctx.globalAlpha = 0.2;
    ctx.drawImage(pic, BX, BY, BW, BH);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = '#333'; ctx.lineWidth = 2;
    for (var c = 1; c < cols; c++) { ctx.beginPath(); ctx.moveTo(BX + c * cw, BY); ctx.lineTo(BX + c * cw, BY + BH); ctx.stroke(); }
    for (var r = 1; r < rows; r++) { ctx.beginPath(); ctx.moveTo(BX, BY + r * ch); ctx.lineTo(BX + BW, BY + r * ch); ctx.stroke(); }

    var i, p, rc;
    for (i = 0; i < pieces.length; i++) {
      p = pieces[i];
      if (p.placed) { rc = cellRect(p.id); drawPiece(ctx, pic, p, rc.x, rc.y, rc.w, rc.h); }
    }
    // Tray
    for (i = 0; i < pieces.length; i++) {
      p = pieces[i];
      if (p.placed || p === holding || (drag && drag.p === p)) continue;
      rc = slotRect(p.slot);
      drawPiece(ctx, pic, p, rc.x, rc.y, rc.w, rc.h);
    }
    // Remote cursor in the tray
    if (!holding && !drag) {
      rc = slotRect(cursor);
      ctx.strokeStyle = FG; ctx.lineWidth = 5;
      ctx.strokeRect(rc.x - 8, rc.y - 8, rc.w + 16, rc.h + 16);
    }
    // A held piece hovers over the chosen board cell
    if (holding) {
      rc = cellRect(boardCell);
      drawPiece(ctx, pic, holding, rc.x, rc.y, rc.w, rc.h);
      ctx.strokeStyle = flash > 0 ? EDGE : FG; ctx.lineWidth = 6;
      ctx.strokeRect(rc.x, rc.y, rc.w, rc.h);
    }
    // A dragged piece follows the pointer at full size
    if (drag) {
      ctx.globalAlpha = 0.9;
      drawPiece(ctx, pic, drag.p, drag.x - drag.ox, drag.y - drag.oy, cw, ch);
      ctx.globalAlpha = 1;
    }
    if (flash > 0) {
      ctx.fillStyle = FG; ctx.textAlign = 'right'; ctx.font = 'bold 34px Arial, sans-serif';
      ctx.fillText('Not here, try another place', BX + BW, BY - 22);
    }
  }

  return { id: 'garden', title: 'Garden Puzzle', dichoptic: true,
    hint: 'drag a piece onto the board  ·  or ◀ ▲ ▼ ▶ choose, OK pick up / drop',
    init: init, update: update, draw: draw, keydown: keydown, pointer: pointer,
    _gardens: GARDENS,
    _debug: function () {             // for automated tests
      return { puzzle: puzzle, cols: cols, cursor: cursor, holding: holding ? holding.id : -1, placed: placedCount,
        pieces: pieces.map(function (p) { return { id: p.id, slot: p.slot, placed: p.placed, tray: slotRect(p.slot), cell: cellRect(p.id) }; }) };
    } };
})();
