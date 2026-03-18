window.PVR = window.PVR || {};

PVR.Hud = {

  draw: function(ctx, state) {
    ctx.save();

    PVR.Hud.drawSpeed(ctx, state.speed, state.maxSpeed);
    PVR.Hud.drawTimer(ctx, state.elapsed);

    if (state.countdown > 0) {
      PVR.Hud.drawCountdown(ctx, state.countdown);
    }

    ctx.restore();
  },

  drawSpeed: function(ctx, speed, maxSpeed) {
    var kmh = Math.round(speed / maxSpeed * 280);
    var x = 40, y = PVR.HEIGHT - 80;

    ctx.fillStyle = PVR.COLORS.HUD_BG;
    PVR.Hud.roundRect(ctx, x, y - 10, 280, 60, 12);

    ctx.fillStyle = PVR.COLORS.HUD_TEXT;
    ctx.font = 'bold 36px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(kmh + ' km/h', x + 20, y + 32);

    var barW = 240;
    var pct = Math.min(speed / maxSpeed, 1);
    ctx.fillStyle = '#333';
    PVR.Hud.roundRect(ctx, x + 10, y - 36, barW, 16, 6);
    var barColor = pct > 0.8 ? '#E63946' : pct > 0.5 ? '#FFB347' : '#4CAF50';
    ctx.fillStyle = barColor;
    PVR.Hud.roundRect(ctx, x + 10, y - 36, barW * pct, 16, 6);
  },

  drawTimer: function(ctx, elapsed) {
    var secs = Math.floor(elapsed);
    var x = PVR.WIDTH / 2, y = 30;

    ctx.fillStyle = PVR.COLORS.HUD_BG;
    PVR.Hud.roundRect(ctx, x - 100, y - 10, 200, 60, 12);

    ctx.fillStyle = PVR.COLORS.HUD_TEXT;
    ctx.font = 'bold 44px monospace';
    ctx.textAlign = 'center';

    var min = Math.floor(secs / 60);
    var sec = secs % 60;
    var display = min + ':' + (sec < 10 ? '0' : '') + sec;
    ctx.fillText(display, x, y + 36);
  },

  drawCountdown: function(ctx, count) {
    var num = Math.ceil(count);
    var text = num > 0 ? '' + num : 'GO!';
    var scale = 1 + (count % 1) * 0.3;

    ctx.save();
    ctx.translate(PVR.WIDTH / 2, PVR.HEIGHT / 2 - 80);
    ctx.scale(scale, scale);

    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.font = 'bold 160px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 4, 4);

    ctx.fillStyle = num > 0 ? '#FFFFFF' : '#FFD700';
    ctx.fillText(text, 0, 0);

    ctx.restore();
  },

  roundRect: function(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
  }

};
