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

    var gx1 = 0, gy1 = y2, gx2 = PVR.WIDTH, gy2 = y1;
    ctx.fillStyle = color.concrete;
    ctx.fillRect(gx1, gy1, gx2, gy2 - gy1);

    PVR.Render.polygon(ctx, x1 - w1 * 1.2, y1, x1 - w1, y1, x2 - w2, y2, x2 - w2 * 1.2, y2, color.rumble);
    PVR.Render.polygon(ctx, x1 + w1, y1, x1 + w1 * 1.2, y1, x2 + w2 * 1.2, y2, x2 + w2, y2, color.rumble);
    PVR.Render.polygon(ctx, x1 - w1, y1, x1 + w1, y1, x2 + w2, y2, x2 - w2, y2, color.road);

    if (fog < 1) {
      ctx.fillStyle = 'rgba(0, 81, 8, ' + (1 - fog) + ')';
      ctx.fillRect(0, y2, PVR.WIDTH, y1 - y2);
    }
  },

  roadStamp: function(img, x1, y1, w1, x2, y2, w2) {
    if (!img) return;
    var ctx = PVR.Render.ctx;
    var cx = (x1 + x2) / 2;
    var segH = y1 - y2;
    if (segH < 1) return;
    // width = fraction of road, height = segment height (perspective-squashed)
    var dw = (w1 + w2) * 0.4;
    var dh = segH * 3;
    var cy = y1 - dh / 2;
    ctx.globalAlpha = 0.9;
    ctx.drawImage(img, cx - dw / 2, cy, dw, dh);
    ctx.globalAlpha = 1.0;
  },

  chevron: function(x1, y1, w1, x2, y2, w2) {
    var ctx = PVR.Render.ctx;
    var segH = y1 - y2;
    if (segH < 1) return;

    // the chevron spans this segment — perspective is built into the
    // segment coords: y1/w1 = near (bottom, wider), y2/w2 = far (top, narrower)
    var arm1 = w1 * 0.35;
    var arm2 = w2 * 0.35;
    var thick = segH * 0.35;

    // interpolate x positions at 25%, 50%, 75% of the segment
    var x25 = PVR.Util.interpolate(x1, x2, 0.25);
    var y25 = PVR.Util.interpolate(y1, y2, 0.25);
    var w25 = PVR.Util.interpolate(w1, w2, 0.25) * 0.35;

    var x50 = PVR.Util.interpolate(x1, x2, 0.5);
    var y50 = PVR.Util.interpolate(y1, y2, 0.5);
    var w50 = PVR.Util.interpolate(w1, w2, 0.5) * 0.35;

    var x75 = PVR.Util.interpolate(x1, x2, 0.75);
    var y75 = PVR.Util.interpolate(y1, y2, 0.75);
    var w75 = PVR.Util.interpolate(w1, w2, 0.75) * 0.35;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';

    // lower V: tip at 50%, arms at near (y1)
    ctx.beginPath();
    ctx.moveTo(x50, y50);
    ctx.lineTo(x1 - arm1, y1);
    ctx.lineTo(x25 - w25, y25);
    ctx.lineTo(x50, y50 + thick);
    ctx.lineTo(x25 + w25, y25);
    ctx.lineTo(x1 + arm1, y1);
    ctx.closePath();
    ctx.fill();

    // upper V: tip at far (y2), arms at 50%
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x50 - w50, y50);
    ctx.lineTo(x75 - w75, y75);
    ctx.lineTo(x2, y2 + thick);
    ctx.lineTo(x75 + w75, y75);
    ctx.lineTo(x50 + w50, y50);
    ctx.closePath();
    ctx.fill();
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

  sprite: function(roadX, roadY, roadW, spriteKey, offset, clipY, scale) {
    var img = PVR.Assets[spriteKey];
    if (!img) return;

    var spriteW = img.width;
    var spriteH = img.height;
    var spriteScale = scale * PVR.ROAD.WIDTH;
    var destW = spriteW * spriteScale;
    var destH = spriteH * spriteScale;
    var destX = roadX + (roadW * offset) - destW / 2;
    var destY = roadY - destH;

    var clipH = clipY ? Math.max(0, destY + destH - clipY) : 0;
    if (clipH >= destH) return;

    var ctx = PVR.Render.ctx;
    ctx.drawImage(img,
      0, 0, spriteW, spriteH - (spriteH * clipH / destH),
      destX, destY, destW, destH - clipH);
  },

  player: function(speed, maxSpeed, steer, updown, shake) {
    var spriteKey = 'player_straight';
    if (steer < -0.02) spriteKey = steer < -0.5 ? 'player_left2' : 'player_left1';
    else if (steer > 0.02) spriteKey = steer > 0.5 ? 'player_right2' : 'player_right1';

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
