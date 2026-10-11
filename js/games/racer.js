/* Lane Racer — switch lanes to dodge traffic on an endless road. */
var Racer = (function () {
  var K = { LEFT: 37, RIGHT: 39 };
  var W = Engine.W, H = Engine.H, FG = Engine.FG;
  var LANE_W = 220, LANES = 3;
  var ROAD_X = W / 2 - (LANE_W * LANES) / 2;
  var CAR_W = 120, CAR_H = 190;

  var car, lane, obstacles, speed, rowT, stripeOff;

  function laneX(l) { return ROAD_X + l * LANE_W + (LANE_W - CAR_W) / 2; }

  function init() {
    lane = 1;
    car = { x: laneX(1), y: H - 260, w: CAR_W, h: CAR_H };
    obstacles = []; speed = 520; rowT = 1.2; stripeOff = 0;
  }

  function keydown(k) {
    if (k === K.LEFT && lane > 0) { lane--; Sound.play('move'); }
    if (k === K.RIGHT && lane < LANES - 1) { lane++; Sound.play('move'); }
  }

  function update(dt, held, st) {
    speed = Math.min(1500, 520 + st.time * 14);
    st.score += speed * dt / 60;
    stripeOff = (stripeOff + speed * dt) % 160;

    // Smooth lane change
    var tx = laneX(lane);
    car.x += (tx - car.x) * Math.min(1, dt * 14);

    rowT -= dt;
    if (rowT <= 0) {
      // Block one or two lanes, never all three
      var free = Math.floor(Math.random() * LANES);
      var blockBoth = Math.random() < Math.min(0.6, st.time / 90);
      var blocked = [];
      for (var l = 0; l < LANES; l++) if (l !== free) blocked.push(l);
      if (!blockBoth) blocked = [blocked[Math.floor(Math.random() * blocked.length)]];
      blocked.forEach(function (l) {
        obstacles.push({ x: laneX(l), y: -CAR_H, w: CAR_W, h: CAR_H, kind: Math.random() < 0.3 ? 1 : 0 });
      });
      rowT = Math.max(0.55, 520 / speed * 1.4);
    }

    for (var i = obstacles.length - 1; i >= 0; i--) {
      var o = obstacles[i];
      o.y += speed * dt;
      if (Engine.hit({ x: car.x + 10, y: car.y + 10, w: car.w - 20, h: car.h - 20 }, o)) {
        obstacles.splice(i, 1); Engine.damage(st);
      } else if (o.y > H) obstacles.splice(i, 1);
    }
  }

  function drawCar(ctx, c, front) {
    ctx.fillRect(c.x + 10, c.y, c.w - 20, c.h);                // body
    ctx.fillRect(c.x, c.y + 25, 14, 45); ctx.fillRect(c.x + c.w - 14, c.y + 25, 14, 45);         // wheels
    ctx.fillRect(c.x, c.y + c.h - 70, 14, 45); ctx.fillRect(c.x + c.w - 14, c.y + c.h - 70, 14, 45);
    ctx.fillStyle = Engine.BG;
    ctx.fillRect(c.x + 26, c.y + (front ? 40 : c.h - 80), c.w - 52, 40); // windscreen
    ctx.fillStyle = FG;
  }

  function draw(ctx, st) {
    ctx.fillStyle = FG;
    ctx.fillRect(ROAD_X - 12, 0, 12, H);
    ctx.fillRect(ROAD_X + LANE_W * LANES, 0, 12, H);
    for (var l = 1; l < LANES; l++) {
      for (var y = -160 + stripeOff; y < H; y += 160) ctx.fillRect(ROAD_X + l * LANE_W - 5, y, 10, 80);
    }
    obstacles.forEach(function (o) {
      if (o.kind === 1) { // cone
        ctx.beginPath();
        ctx.moveTo(o.x + o.w / 2, o.y + 30); ctx.lineTo(o.x + o.w - 15, o.y + o.h - 30);
        ctx.lineTo(o.x + 15, o.y + o.h - 30); ctx.closePath(); ctx.fill();
      } else drawCar(ctx, o, false);
    });
    if (!Engine.blink(st)) drawCar(ctx, car, true);
  }

  return { id: 'racer', title: 'Lane Racer', hint: '◀ ▶ change lane',
    init: init, update: update, draw: draw, keydown: keydown };
})();
