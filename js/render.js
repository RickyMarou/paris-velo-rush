window.PVR = window.PVR || {};

PVR.Render = {

  ctx: null,

  init: function(ctx) {
    PVR.Render.ctx = ctx;
  },

  clear: function() {
    PVR.Render.ctx.clearRect(0, 0, PVR.WIDTH, PVR.HEIGHT);
  },

  background: function(skyOffset, farOffset, nearOffset) {
    var ctx = PVR.Render.ctx;

    ctx.fillStyle = PVR.COLORS.LIGHT.concrete;
    ctx.fillRect(0, 0, PVR.WIDTH, PVR.HEIGHT);

    PVR.Render.drawParallaxLayer(PVR.Assets.bg_sky, skyOffset, PVR.BG.SKY_Y, PVR.WIDTH, PVR.BG.SKY_H);
    PVR.Render.drawParallaxLayer(PVR.Assets.bg_near, nearOffset, PVR.BG.NEAR_Y, PVR.WIDTH, PVR.BG.NEAR_H);
  },

  drawParallaxLayer: function(img, offset, y, w, h) {
    if (!img) return;
    var ctx = PVR.Render.ctx;
    var imgW = img.width || 1600;
    var imgH = img.height || h;

    var sourceX = ((offset % imgW) + imgW) % imgW;

    var firstSlice = imgW - sourceX;
    if (firstSlice > w) firstSlice = w;

    ctx.drawImage(img, sourceX, 0, firstSlice * (imgW / w), imgH, 0, y, firstSlice, h);

    if (firstSlice < w) {
      ctx.drawImage(img, 0, 0, (w - firstSlice) * (imgW / w), imgH, firstSlice, y, w - firstSlice, h);
    }
  },

  segment: function(x1, y1, w1, x2, y2, w2, fog, color) {
    var ctx = PVR.Render.ctx;
    var L = PVR.LANE;

    // concrete background
    ctx.fillStyle = color.concrete;
    ctx.fillRect(0, y2, PVR.WIDTH, y1 - y2);

    // left rumble strip
    var lrOut = L.LEFT_EDGE - L.RUMBLE_WIDTH;
    var lrIn = L.LEFT_EDGE;
    PVR.Render.polygon(ctx,
      x1 + w1 * lrOut, y1, x1 + w1 * lrIn, y1,
      x2 + w2 * lrIn, y2, x2 + w2 * lrOut, y2, color.rumble);

    // right rumble strip
    var rrIn = L.RIGHT_EDGE;
    var rrOut = L.RIGHT_EDGE + L.RUMBLE_WIDTH;
    PVR.Render.polygon(ctx,
      x1 + w1 * rrIn, y1, x1 + w1 * rrOut, y1,
      x2 + w2 * rrOut, y2, x2 + w2 * rrIn, y2, color.rumble);

    // road surface
    PVR.Render.polygon(ctx,
      x1 + w1 * L.LEFT_EDGE, y1, x1 + w1 * L.RIGHT_EDGE, y1,
      x2 + w2 * L.RIGHT_EDGE, y2, x2 + w2 * L.LEFT_EDGE, y2, color.road);

    // lane divider (dashed via alternating LIGHT/DARK lane color)
    var dW = 0.04;
    var d = L.DIVIDER;
    PVR.Render.polygon(ctx,
      x1 + w1 * (d - dW), y1, x1 + w1 * (d + dW), y1,
      x2 + w2 * (d + dW), y2, x2 + w2 * (d - dW), y2, color.lane);

    if (fog < 1) {
      ctx.fillStyle = 'rgba(0, 81, 8, ' + (1 - fog) + ')';
      ctx.fillRect(0, y2, PVR.WIDTH, y1 - y2);
    }
  },

  drawRoadStamps: function(segments) {
    for (var i = segments.length - 1; i >= 0; i--) {
      var seg = segments[i];
      if (seg.index % PVR.ROAD_STAMP_INTERVAL === 0) {
        PVR.Render.roadStamp(PVR.Assets.road_marking, seg);
      }
    }
  },

  roadStamp: function(img, seg) {
    if (!img) return;
    var x1 = seg.p1.screen.x, y1 = seg.p1.screen.y, w1 = seg.p1.screen.w;
    var x2 = seg.p2.screen.x, y2 = seg.p2.screen.y, w2 = seg.p2.screen.w;
    var ctx = PVR.Render.ctx;
    var segH = y1 - y2;
    if (segH < 1) return;

    var cc = PVR.LANE.CYCLE_CENTER;
    var cx = ((x1 + w1 * cc) + (x2 + w2 * cc)) / 2;

    var cycleWidth = PVR.LANE.DIVIDER - PVR.LANE.LEFT_EDGE;
    var dw = (w1 + w2) * 0.5 * cycleWidth * 0.7;
    var dh = segH * 4;
    var cy = y1 - dh / 2;
    ctx.globalAlpha = 0.9;
    ctx.drawImage(img, cx - dw / 2, cy, dw, dh);
    ctx.globalAlpha = 1.0;
  },

  polygon: function(ctx, x1, y1, x2, y2, x3, y3, x4, y4, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x4, y4);
    ctx.closePath();
    ctx.fill();
  },

  staticScene: function(segments, cameraX, cameraY, cameraZ) {
    var ctx = PVR.Render.ctx;

    ctx.fillStyle = PVR.COLORS.LIGHT.concrete;
    ctx.fillRect(0, 0, PVR.WIDTH, PVR.HEIGHT);

    ctx.fillStyle = '#B0D4E8';
    ctx.fillRect(0, 0, PVR.WIDTH, PVR.HEIGHT / 2);

    var maxy = PVR.HEIGHT;
    for (var i = 0; i < segments.length; i++) {
      var seg = segments[i];

      PVR.Util.project(seg.p1, cameraX, cameraY, cameraZ, PVR.ROAD.CAMERA_DEPTH, PVR.WIDTH, PVR.HEIGHT, PVR.ROAD.WIDTH);
      PVR.Util.project(seg.p2, cameraX, cameraY, cameraZ, PVR.ROAD.CAMERA_DEPTH, PVR.WIDTH, PVR.HEIGHT, PVR.ROAD.WIDTH);

      if (seg.p1.camera.z <= PVR.ROAD.CAMERA_DEPTH) continue;
      if (seg.p2.screen.y >= seg.p1.screen.y) continue;
      if (seg.p2.screen.y >= maxy) continue;

      PVR.Render.segment(
        seg.p1.screen.x, seg.p1.screen.y, seg.p1.screen.w,
        seg.p2.screen.x, seg.p2.screen.y, seg.p2.screen.w,
        1, seg.color);

      maxy = seg.p2.screen.y;
    }

    var backToFront = segments.slice().reverse();
    PVR.Render.drawRoadsideSprites(backToFront);
  },

  drawRoadsideSprites: function(segments) {
    for (var n = 0; n < segments.length; n++) {
      var seg = segments[n];
      if (PVR.DEBUG.HIDE_SPRITES) continue;
      for (var s = 0; s < seg.sprites.length; s++) {
        var sp = seg.sprites[s];
        PVR.Render.sprite(seg.p1.screen.x, seg.p1.screen.y, seg.p1.screen.w, sp.source, sp.offset);
      }
    }
  },

  sprite: function(roadX, roadY, roadW, spriteKey, offset) {
    var img = PVR.Assets[spriteKey];
    if (!img) return;

    var spriteW = img.width;
    var spriteH = img.height;
    var pixelsPerUnit = roadW / (PVR.ROAD.WIDTH / 2);
    var destW = spriteW * pixelsPerUnit;
    var destH = spriteH * pixelsPerUnit;
    var destX = roadX + (roadW * offset) - destW / 2;
    var destY = roadY - destH;

    PVR.Render.ctx.drawImage(img, 0, 0, spriteW, spriteH, destX, destY, destW, destH);
  },

  player: function(speed, maxSpeed, steer, updown, shake, pedalFrame) {
    var spriteKey = 'player_straight';
    if (steer < -0.02) spriteKey = 'player_left2';
    else if (steer > 0.02) spriteKey = 'player_right2';
    if (pedalFrame) spriteKey += pedalFrame;

    var img = PVR.Assets[spriteKey];
    if (!img) return;

    var speedPercent = speed / maxSpeed;
    var bounce = (1.5 * Math.random() * speedPercent * PVR.HEIGHT / 1000) * (Math.random() > 0.5 ? 1 : -1);
    var spriteScale = 0.75;
    var destW = img.width * spriteScale;
    var destH = img.height * spriteScale;
    var destX = PVR.WIDTH / 2 - destW / 2;
    var destY = PVR.HEIGHT - destH - 5 + bounce + (updown || 0);

    var shakeX = shake ? (Math.random() - 0.5) * shake * 2 : 0;
    var shakeY = shake ? (Math.random() - 0.5) * shake * 2 : 0;

    PVR.Render.ctx.drawImage(img, 0, 0, img.width, img.height,
      destX + shakeX, destY + shakeY, destW, destH);

    if (speedPercent > 0.8) {
      PVR.Render.speedLines(speedPercent);
    }
  },

  speedLines: function(speedPercent) {
    var ctx = PVR.Render.ctx;
    var alpha = (speedPercent - 0.8) * 5;
    ctx.strokeStyle = 'rgba(255, 255, 255, ' + (alpha * 0.3) + ')';
    ctx.lineWidth = 1;
    for (var i = 0; i < 8; i++) {
      var sx = Math.random() * PVR.WIDTH;
      var sy = PVR.HEIGHT * 0.6 + Math.random() * PVR.HEIGHT * 0.3;
      var len = 20 + Math.random() * 40;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + (sx > PVR.WIDTH / 2 ? 1 : -1) * len * 0.3, sy + len);
      ctx.stroke();
    }
  },

  fog: function(x, y, width, height, fogAmount) {
    if (fogAmount < 1) {
      PVR.Render.ctx.fillStyle = 'rgba(0, 81, 8, ' + (1 - fogAmount) + ')';
      PVR.Render.ctx.fillRect(x, y, width, height);
    }
  }

};
