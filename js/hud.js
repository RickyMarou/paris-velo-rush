window.PVR = window.PVR || {};

PVR.Hud = {

  draw: function(ctx, state) {
    ctx.save();

    PVR.Hud.drawSpeed(ctx, state.speed, state.maxSpeed);
    PVR.Hud.drawTimer(ctx, state.timeLeft);
    PVR.Hud.drawPosition(ctx, state.position, state.totalRivals);

    if (state.countdown > 0) {
      PVR.Hud.drawCountdown(ctx, state.countdown);
    }

    ctx.restore();
  },

  drawSpeed: function(ctx, speed, maxSpeed) {
    var kmh = Math.round(speed / maxSpeed * 280);
    var x = 20, y = PVR.HEIGHT - 40;

    ctx.fillStyle = PVR.COLORS.HUD_BG;
    PVR.Hud.roundRect(ctx, x, y - 5, 140, 30, 6);

    ctx.fillStyle = PVR.COLORS.HUD_TEXT;
    ctx.font = 'bold 18px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(kmh + ' km/h', x + 10, y + 16);

    // speed bar
    var barW = 120;
    var pct = Math.min(speed / maxSpeed, 1);
    ctx.fillStyle = '#333';
    PVR.Hud.roundRect(ctx, x + 5, y - 18, barW, 8, 3);
    var barColor = pct > 0.8 ? '#E63946' : pct > 0.5 ? '#FFB347' : '#4CAF50';
    ctx.fillStyle = barColor;
    PVR.Hud.roundRect(ctx, x + 5, y - 18, barW * pct, 8, 3);
  },

  drawTimer: function(ctx, timeLeft) {
    var secs = Math.max(0, Math.ceil(timeLeft));
    var x = PVR.WIDTH / 2, y = 15;

    ctx.fillStyle = PVR.COLORS.HUD_BG;
    PVR.Hud.roundRect(ctx, x - 50, y - 5, 100, 30, 6);

    ctx.fillStyle = secs <= 10 ? '#E63946' : PVR.COLORS.HUD_TEXT;
    ctx.font = 'bold 22px monospace';
    ctx.textAlign = 'center';

    var min = Math.floor(secs / 60);
    var sec = secs % 60;
    var display = min + ':' + (sec < 10 ? '0' : '') + sec;
    ctx.fillText(display, x, y + 18);
  },

  drawPosition: function(ctx, position, total) {
    var x = PVR.WIDTH - 20, y = PVR.HEIGHT - 40;

    ctx.fillStyle = PVR.COLORS.HUD_BG;
    PVR.Hud.roundRect(ctx, x - 120, y - 5, 120, 30, 6);

    ctx.fillStyle = PVR.COLORS.HUD_TEXT;
    ctx.font = 'bold 18px monospace';
    ctx.textAlign = 'right';

    var suffix = 'th';
    if (position === 1) suffix = 'st';
    else if (position === 2) suffix = 'nd';
    else if (position === 3) suffix = 'rd';

    ctx.fillText(position + suffix + ' / ' + (total + 1), x - 10, y + 16);
  },

  drawCountdown: function(ctx, count) {
    var num = Math.ceil(count);
    var text = num > 0 ? '' + num : 'GO!';
    var scale = 1 + (count % 1) * 0.3;

    ctx.save();
    ctx.translate(PVR.WIDTH / 2, PVR.HEIGHT / 2 - 40);
    ctx.scale(scale, scale);

    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.font = 'bold 80px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 2, 2);

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
