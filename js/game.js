window.PVR = window.PVR || {};

PVR.Game = {

  canvas: null,
  ctx: null,
  state: 'title',

  position: 0,
  speed: 0,
  playerX: 0,
  steer: 0,

  skyOffset: 0,
  farOffset: 0,
  nearOffset: 0,

  elapsed: 0,
  countdown: 0,
  shakeTimer: 0,
  pedalTimer: 0,

  lastTime: null,

  init: function() {
    PVR.Game.canvas = document.getElementById('game');
    PVR.Game.ctx = PVR.Game.canvas.getContext('2d');
    PVR.Game.canvas.width = PVR.WIDTH;
    PVR.Game.canvas.height = PVR.HEIGHT;

    PVR.Render.init(PVR.Game.ctx);
    PVR.Input.init();

    PVR.Loader.load(function() {
      PVR.Road.buildTrack();
      PVR.Game.startRace();
      PVR.Game.lastTime = PVR.Util.timestamp();
      requestAnimationFrame(PVR.Game.frame);
    });
  },

  frame: function(timestamp) {
    var now = PVR.Util.timestamp();
    var dt = Math.min(1, (now - PVR.Game.lastTime) / 1000);
    PVR.Game.lastTime = now;

    switch (PVR.Game.state) {
      case 'title':
        PVR.Game.updateTitle(dt);
        PVR.Game.renderTitle();
        break;
      case 'countdown':
        PVR.Game.updateCountdown(dt);
        PVR.Game.renderRacing(dt);
        break;
      case 'racing':
        PVR.Game.updateRacing(dt);
        PVR.Game.renderRacing(dt);
        break;
      case 'results':
        PVR.Game.updateResults(dt);
        PVR.Game.renderResults();
        break;
    }

    requestAnimationFrame(PVR.Game.frame);
  },

  // --- TITLE ---

  titleBlink: 0,

  updateTitle: function(dt) {
    PVR.Game.titleBlink += dt;
    if (PVR.Input.isEnter()) {
      PVR.Game.startRace();
    }
  },

  startRace: function() {
    PVR.Game.position = 0;
    PVR.Game.speed = 0;
    PVR.Game.playerX = PVR.LANE.CYCLE_CENTER;
    PVR.Game.steer = 0;
    PVR.Game.elapsed = 0;
    PVR.Game.countdown = PVR.RACE.COUNTDOWN_SECS + 1;
    PVR.Game.shakeTimer = 0;
    PVR.Game.pedalTimer = 0;

    PVR.Game.state = 'countdown';
  },

  renderTitle: function() {
    var ctx = PVR.Game.ctx;
    PVR.Render.clear();

    var grad = ctx.createLinearGradient(0, 0, 0, PVR.HEIGHT);
    grad.addColorStop(0, '#1A237E');
    grad.addColorStop(0.5, '#283593');
    grad.addColorStop(1, '#1565C0');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, PVR.WIDTH, PVR.HEIGHT);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 120px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('PARIS VELO', PVR.WIDTH / 2, 300);

    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 56px monospace';
    ctx.fillText('RUSH', PVR.WIDTH / 2, 380);

    var playerImg = PVR.Assets['player_straight'];
    if (playerImg) {
      var pw = playerImg.width * 0.6;
      var ph = playerImg.height * 0.6;
      ctx.drawImage(playerImg, PVR.WIDTH / 2 - pw / 2, 420, pw, ph);
    }

    if (Math.sin(PVR.Game.titleBlink * 3) > 0) {
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '40px monospace';
      ctx.fillText('PRESS ENTER TO START', PVR.WIDTH / 2, 720);
    }

    ctx.fillStyle = '#90CAF9';
    ctx.font = '28px monospace';
    ctx.fillText('Arrow keys to steer and accelerate', PVR.WIDTH / 2, 840);
    ctx.fillText('Touch: left/right to steer, touch to go', PVR.WIDTH / 2, 890);
  },

  // --- COUNTDOWN ---

  updateCountdown: function(dt) {
    PVR.Game.countdown -= dt;
    if (PVR.Game.countdown <= 0) {
      PVR.Game.state = 'racing';
    }
  },

  // --- RACING ---

  updateRacing: function(dt) {
    var playerSegment = PVR.Road.findSegment(PVR.Game.position + PVR.ROAD.PLAYER_Z);
    var speedPercent = PVR.Game.speed / PVR.SPEED.MAX;
    var dx = dt * 2 * speedPercent;

    PVR.Game.elapsed += dt;

    if (PVR.Game.shakeTimer > 0) {
      PVR.Game.shakeTimer -= dt;
    }

    // steering
    PVR.Game.steer = 0;
    if (PVR.Input.isLeft())  PVR.Game.steer = -1;
    if (PVR.Input.isRight()) PVR.Game.steer = 1;
    PVR.Game.playerX += PVR.Game.steer * dx;

    // centrifugal force
    PVR.Game.playerX -= dx * speedPercent * playerSegment.curve * PVR.SPEED.CENTRIFUGAL;

    // speed
    if (PVR.Input.isAccelerate()) {
      var kmh = PVR.Game.speed / PVR.SPEED.MAX * PVR.SPEED.MAX_KMH;
      var zones = PVR.SPEED.ACCEL_ZONES;
      var zone = zones[zones.length - 1];
      for (var z = 0; z < zones.length; z++) {
        if (kmh < zones[z].upTo) { zone = zones[z]; break; }
      }
      PVR.Game.speed = PVR.Util.accelerate(PVR.Game.speed, PVR.SPEED.BASE_ACCEL * zone.factor, dt);
      PVR.Game.pedalTimer += dt * zone.pedalRate;
    } else if (PVR.Input.isBrake()) {
      PVR.Game.speed = PVR.Util.accelerate(PVR.Game.speed, PVR.SPEED.BRAKE, dt);
    } else {
      PVR.Game.speed = PVR.Util.accelerate(PVR.Game.speed, PVR.SPEED.DECEL, dt);
    }

    // turning speed cap
    if (PVR.Game.steer !== 0) {
      var turnMax = PVR.SPEED.MAX * PVR.SPEED.TURN_MAX_KMH / PVR.SPEED.MAX_KMH;
      if (PVR.Game.speed > turnMax) {
        PVR.Game.speed = PVR.Util.accelerate(PVR.Game.speed, PVR.SPEED.DECEL * 2, dt);
      }
    }

    PVR.Game.playerX = PVR.Util.limit(PVR.Game.playerX, PVR.LANE.LEFT_EDGE - 1.5, PVR.LANE.RIGHT_EDGE + 1.0);
    PVR.Game.speed = PVR.Util.limit(PVR.Game.speed, 0, PVR.SPEED.MAX);

    // advance position
    PVR.Game.position = PVR.Util.increase(PVR.Game.position, dt * PVR.Game.speed, PVR.Road.trackLength);

    // background scroll
    var curveScroll = playerSegment.curve * speedPercent * dt;
    PVR.Game.skyOffset = PVR.Util.increase(PVR.Game.skyOffset, curveScroll * 20, 1600);
    PVR.Game.nearOffset = PVR.Util.increase(PVR.Game.nearOffset, curveScroll * 60, 1600);
  },

  renderRacing: function(dt) {
    var ctx = PVR.Game.ctx;
    PVR.Render.clear();

    var baseSegment = PVR.Road.findSegment(PVR.Game.position);
    var basePercent = PVR.Util.percentRemaining(PVR.Game.position, PVR.ROAD.SEGMENT_LENGTH);
    var playerSegment = PVR.Road.findSegment(PVR.Game.position + PVR.ROAD.PLAYER_Z);
    var playerPercent = PVR.Util.percentRemaining(PVR.Game.position + PVR.ROAD.PLAYER_Z, PVR.ROAD.SEGMENT_LENGTH);
    var playerY = PVR.Util.interpolate(playerSegment.p1.world.y, playerSegment.p2.world.y, playerPercent);

    PVR.Render.background(PVR.Game.skyOffset, PVR.Game.farOffset, PVR.Game.nearOffset);

    var maxy = PVR.HEIGHT;
    var x = 0;
    var dx = -(baseSegment.curve * basePercent);

    var segments = PVR.Road.segments;
    var segCount = segments.length;

    for (var n = 0; n < PVR.ROAD.DRAW_DISTANCE; n++) {
      var segIndex = (baseSegment.index + n) % segCount;
      var segment = segments[segIndex];
      var looped = segIndex < baseSegment.index;

      var camX = PVR.Game.playerX * PVR.ROAD.WIDTH / 2;
      var camY = PVR.ROAD.CAMERA_HEIGHT + playerY;
      var camZ = PVR.Game.position - (looped ? PVR.Road.trackLength : 0);

      PVR.Util.project(segment.p1, camX - x, camY, camZ, PVR.ROAD.CAMERA_DEPTH, PVR.WIDTH, PVR.HEIGHT, PVR.ROAD.WIDTH);
      PVR.Util.project(segment.p2, camX - x - dx, camY, camZ, PVR.ROAD.CAMERA_DEPTH, PVR.WIDTH, PVR.HEIGHT, PVR.ROAD.WIDTH);

      x += dx;
      dx += segment.curve;

      if ((segment.p1.camera.z <= PVR.ROAD.CAMERA_DEPTH) ||
          (segment.p2.screen.y >= segment.p1.screen.y) ||
          (segment.p2.screen.y >= maxy)) {
        continue;
      }

      var fogDensity = 0.00005;
      var fog = PVR.Util.exponentialFog(n / PVR.ROAD.DRAW_DISTANCE, fogDensity);

      PVR.Render.segment(
        segment.p1.screen.x, segment.p1.screen.y, segment.p1.screen.w,
        segment.p2.screen.x, segment.p2.screen.y, segment.p2.screen.w,
        fog, segment.color);

      maxy = segment.p2.screen.y;
    }

    // render road stamps and sprites back-to-front
    var visibleSegments = [];
    for (n = PVR.ROAD.DRAW_DISTANCE - 1; n > 0; n--) {
      var segIdx2 = (baseSegment.index + n) % segCount;
      visibleSegments.push(segments[segIdx2]);
    }
    PVR.Render.drawRoadStamps(visibleSegments);

    PVR.Render.drawRoadsideSprites(visibleSegments);

    var updown = playerY;
    var shake = PVR.Game.shakeTimer > 0 ? 12 : 0;
    var pedalFrame = (PVR.Game.speed > 0 && Math.floor(PVR.Game.pedalTimer) % 2 === 1) ? '_b' : '';
    if (!PVR.DEBUG.HIDE_PLAYER) {
      PVR.Render.player(PVR.Game.speed, PVR.SPEED.MAX, PVR.Game.steer, 0, shake, pedalFrame);
    }

    PVR.Hud.draw(ctx, {
      speed: PVR.Game.speed,
      maxSpeed: PVR.SPEED.MAX,
      elapsed: PVR.Game.elapsed,
      countdown: PVR.Game.state === 'countdown' ? PVR.Game.countdown : 0
    });
  },

  // --- RESULTS ---

  updateResults: function(dt) {
    if (PVR.Input.isEnter()) {
      PVR.Game.state = 'title';
    }
  },

  renderResults: function() {
    var ctx = PVR.Game.ctx;
    PVR.Render.clear();

    var grad = ctx.createLinearGradient(0, 0, 0, PVR.HEIGHT);
    grad.addColorStop(0, '#1A237E');
    grad.addColorStop(1, '#0D47A1');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, PVR.WIDTH, PVR.HEIGHT);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 80px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('COURSE TERMINEE!', PVR.WIDTH / 2, 240);

    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 100px monospace';
    var suffix = 'th';
    var pos = PVR.Game.racePosition;
    if (pos === 1) suffix = 'st';
    else if (pos === 2) suffix = 'nd';
    else if (pos === 3) suffix = 'rd';
    ctx.fillText(pos + suffix + ' place', PVR.WIDTH / 2, 440);

    ctx.fillStyle = '#90CAF9';
    ctx.font = '48px monospace';

    var elapsed = PVR.RACE.DURATION;
    var min = Math.floor(elapsed / 60);
    var sec = elapsed % 60;
    ctx.fillText('Time: ' + min + ':' + (sec < 10 ? '0' : '') + sec, PVR.WIDTH / 2, 580);
    ctx.fillText('Rivals beaten: ' + (PVR.RACE.RIVAL_COUNT - pos + 1), PVR.WIDTH / 2, 660);

    if (pos <= 3) {
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 60px monospace';
      ctx.fillText('MAGNIFIQUE!', PVR.WIDTH / 2, 780);
    }

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '36px monospace';
    ctx.fillText('Press ENTER to race again', PVR.WIDTH / 2, 900);
  }

};

window.addEventListener('DOMContentLoaded', function() {
  PVR.Game.init();
});
