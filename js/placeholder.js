window.PVR = window.PVR || {};

PVR.Assets = PVR.Assets || {};

PVR.Placeholder = {

  createCanvas: function(w, h) {
    var c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    return c;
  },

  buildAll: function() {
    PVR.Placeholder.buildPlayerBike();
    PVR.Placeholder.buildRoadside();
    PVR.Placeholder.buildRivals();
    PVR.Placeholder.buildBackgrounds();
  },

  buildPlayerBike: function() {
    var frames = ['straight', 'left1', 'left2', 'right1', 'right2'];
    var leans =  [0, -4, -8, 4, 8];

    for (var i = 0; i < frames.length; i++) {
      var c = PVR.Placeholder.createCanvas(40, 60);
      var ctx = c.getContext('2d');
      var lean = leans[i];

      // wheels
      ctx.fillStyle = '#222';
      ctx.beginPath();
      ctx.arc(20 + lean * 0.3, 55, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(20 + lean * 0.5, 30, 4, 0, Math.PI * 2);
      ctx.fill();

      // frame
      ctx.strokeStyle = '#E63946';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(20 + lean * 0.3, 55);
      ctx.lineTo(20 + lean * 0.5, 30);
      ctx.stroke();

      // rider body
      ctx.fillStyle = '#457B9D';
      ctx.beginPath();
      ctx.ellipse(20 + lean * 0.5, 22, 6, 10, lean * 0.02, 0, Math.PI * 2);
      ctx.fill();

      // rider head
      ctx.fillStyle = '#F1FAEE';
      ctx.beginPath();
      ctx.arc(20 + lean * 0.6, 10, 5, 0, Math.PI * 2);
      ctx.fill();

      // helmet
      ctx.fillStyle = '#E63946';
      ctx.beginPath();
      ctx.arc(20 + lean * 0.6, 8, 5, Math.PI, 0);
      ctx.fill();

      PVR.Assets['player_' + frames[i]] = c;
    }
  },

  buildRoadside: function() {
    PVR.Placeholder.buildTree();
    PVR.Placeholder.buildLamppost();
    PVR.Placeholder.buildBuildingSmall();
    PVR.Placeholder.buildBuildingTall();
    PVR.Placeholder.buildCafe();
    PVR.Placeholder.buildEiffelTower();
    PVR.Placeholder.buildArcTriomphe();
    PVR.Placeholder.buildNotreDame();
  },

  buildTree: function() {
    var c = PVR.Placeholder.createCanvas(40, 80);
    var ctx = c.getContext('2d');
    ctx.fillStyle = '#5D4037';
    ctx.fillRect(17, 45, 6, 35);
    ctx.fillStyle = '#2E7D32';
    ctx.beginPath();
    ctx.arc(20, 30, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#388E3C';
    ctx.beginPath();
    ctx.arc(20, 22, 14, 0, Math.PI * 2);
    ctx.fill();
    PVR.Assets.tree = c;
  },

  buildLamppost: function() {
    var c = PVR.Placeholder.createCanvas(20, 100);
    var ctx = c.getContext('2d');
    ctx.fillStyle = '#37474F';
    ctx.fillRect(8, 15, 4, 85);
    ctx.fillStyle = '#FFD54F';
    ctx.beginPath();
    ctx.arc(10, 12, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFF9C4';
    ctx.beginPath();
    ctx.arc(10, 12, 3, 0, Math.PI * 2);
    ctx.fill();
    PVR.Assets.lamppost = c;
  },

  buildBuildingSmall: function() {
    var c = PVR.Placeholder.createCanvas(60, 80);
    var ctx = c.getContext('2d');
    ctx.fillStyle = '#D7CCC8';
    ctx.fillRect(5, 10, 50, 70);
    ctx.fillStyle = '#795548';
    ctx.fillRect(5, 8, 50, 6);
    ctx.fillStyle = '#90CAF9';
    for (var row = 0; row < 3; row++) {
      for (var col = 0; col < 3; col++) {
        ctx.fillRect(12 + col * 15, 22 + row * 18, 8, 10);
      }
    }
    ctx.fillStyle = '#5D4037';
    ctx.fillRect(22, 60, 16, 20);
    PVR.Assets.building_small = c;
  },

  buildBuildingTall: function() {
    var c = PVR.Placeholder.createCanvas(50, 140);
    var ctx = c.getContext('2d');
    ctx.fillStyle = '#EFEBE9';
    ctx.fillRect(5, 5, 40, 135);
    ctx.fillStyle = '#8D6E63';
    ctx.fillRect(3, 3, 44, 6);
    ctx.fillStyle = '#90CAF9';
    for (var row = 0; row < 7; row++) {
      for (var col = 0; col < 2; col++) {
        ctx.fillRect(12 + col * 18, 15 + row * 17, 10, 10);
      }
    }
    PVR.Assets.building_tall = c;
  },

  buildCafe: function() {
    var c = PVR.Placeholder.createCanvas(70, 50);
    var ctx = c.getContext('2d');
    ctx.fillStyle = '#FFCC80';
    ctx.fillRect(5, 15, 60, 35);
    // awning
    ctx.fillStyle = '#E63946';
    ctx.beginPath();
    ctx.moveTo(0, 15);
    ctx.lineTo(70, 15);
    ctx.lineTo(65, 5);
    ctx.lineTo(5, 5);
    ctx.closePath();
    ctx.fill();
    // awning stripes
    ctx.fillStyle = '#FFFFFF';
    for (var i = 0; i < 4; i++) {
      ctx.fillRect(8 + i * 16, 5, 8, 10);
    }
    PVR.Assets.cafe = c;
  },

  buildEiffelTower: function() {
    var c = PVR.Placeholder.createCanvas(60, 160);
    var ctx = c.getContext('2d');
    ctx.fillStyle = '#5D4037';
    ctx.beginPath();
    ctx.moveTo(30, 0);
    ctx.lineTo(10, 160);
    ctx.lineTo(50, 160);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#795548';
    ctx.fillRect(15, 50, 30, 4);
    ctx.fillRect(18, 100, 24, 4);
    ctx.clearRect(22, 55, 16, 40);
    PVR.Assets.eiffel_tower = c;
  },

  buildArcTriomphe: function() {
    var c = PVR.Placeholder.createCanvas(80, 100);
    var ctx = c.getContext('2d');
    ctx.fillStyle = '#D7CCC8';
    ctx.fillRect(5, 10, 70, 90);
    ctx.fillStyle = '#795548';
    ctx.fillRect(3, 5, 74, 10);
    ctx.clearRect(20, 40, 40, 60);
    ctx.fillStyle = '#BCAAA4';
    ctx.beginPath();
    ctx.arc(40, 40, 20, Math.PI, 0);
    ctx.fill();
    PVR.Assets.arc_triomphe = c;
  },

  buildNotreDame: function() {
    var c = PVR.Placeholder.createCanvas(90, 120);
    var ctx = c.getContext('2d');
    ctx.fillStyle = '#EFEBE9';
    ctx.fillRect(10, 30, 70, 90);
    // towers
    ctx.fillRect(10, 10, 20, 30);
    ctx.fillRect(60, 10, 20, 30);
    // spire
    ctx.fillStyle = '#8D6E63';
    ctx.beginPath();
    ctx.moveTo(45, 0);
    ctx.lineTo(40, 30);
    ctx.lineTo(50, 30);
    ctx.closePath();
    ctx.fill();
    // rose window
    ctx.fillStyle = '#E91E63';
    ctx.beginPath();
    ctx.arc(45, 55, 10, 0, Math.PI * 2);
    ctx.fill();
    // door
    ctx.fillStyle = '#5D4037';
    ctx.fillRect(35, 90, 20, 30);
    PVR.Assets.notre_dame = c;
  },

  buildRivals: function() {
    var rivalColors = [
      { body: '#FF6F00', detail: '#E65100' },
      { body: '#1565C0', detail: '#0D47A1' },
      { body: '#2E7D32', detail: '#1B5E20' },
      { body: '#AD1457', detail: '#880E4F' },
      { body: '#6A1B9A', detail: '#4A148C' },
      { body: '#F9A825', detail: '#F57F17' }
    ];

    for (var i = 0; i < rivalColors.length; i++) {
      var c = PVR.Placeholder.createCanvas(50, 30);
      var ctx = c.getContext('2d');
      var col = rivalColors[i];

      if (i < 3) {
        // scooter
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.arc(10, 25, 5, 0, Math.PI * 2);
        ctx.arc(40, 25, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = col.body;
        ctx.fillRect(8, 10, 34, 14);
        ctx.fillStyle = col.detail;
        ctx.fillRect(8, 8, 10, 6);
      } else if (i < 5) {
        // delivery truck
        ctx.fillStyle = '#333';
        ctx.fillRect(2, 24, 10, 6);
        ctx.fillRect(38, 24, 10, 6);
        ctx.fillStyle = col.body;
        ctx.fillRect(0, 2, 50, 22);
        ctx.fillStyle = '#FFF';
        ctx.fillRect(2, 4, 12, 8);
      } else {
        // tourist on segway
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.arc(15, 25, 5, 0, Math.PI * 2);
        ctx.arc(35, 25, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = col.body;
        ctx.fillRect(18, 5, 14, 18);
        ctx.fillStyle = '#FFDAB9';
        ctx.beginPath();
        ctx.arc(25, 2, 5, 0, Math.PI * 2);
        ctx.fill();
      }

      PVR.Assets['rival_' + i] = c;
    }
  },

  buildBackgrounds: function() {
    // sky
    var sky = PVR.Placeholder.createCanvas(1600, 250);
    var skyCtx = sky.getContext('2d');
    var grad = skyCtx.createLinearGradient(0, 0, 0, 250);
    grad.addColorStop(0, '#1A237E');
    grad.addColorStop(0.4, '#5C6BC0');
    grad.addColorStop(0.7, '#90CAF9');
    grad.addColorStop(1, '#E3F2FD');
    skyCtx.fillStyle = grad;
    skyCtx.fillRect(0, 0, 1600, 250);
    // clouds
    skyCtx.fillStyle = 'rgba(255,255,255,0.7)';
    var cloudPositions = [[100,60],[400,40],[700,70],[1000,50],[1300,80],[200,120],[600,100],[1100,110]];
    for (var ci = 0; ci < cloudPositions.length; ci++) {
      var cx = cloudPositions[ci][0], cy = cloudPositions[ci][1];
      skyCtx.beginPath();
      skyCtx.arc(cx, cy, 25, 0, Math.PI * 2);
      skyCtx.arc(cx + 25, cy - 5, 20, 0, Math.PI * 2);
      skyCtx.arc(cx + 50, cy, 22, 0, Math.PI * 2);
      skyCtx.fill();
    }
    PVR.Assets.bg_sky = sky;

    // far skyline
    var far = PVR.Placeholder.createCanvas(1600, 120);
    var farCtx = far.getContext('2d');
    farCtx.fillStyle = '#78909C';
    var xp = 0;
    while (xp < 1600) {
      var bw = 20 + Math.random() * 40;
      var bh = 30 + Math.random() * 80;
      farCtx.fillRect(xp, 120 - bh, bw, bh);
      if (Math.random() < 0.15) {
        farCtx.fillStyle = '#607D8B';
        farCtx.beginPath();
        farCtx.moveTo(xp + bw / 2, 120 - bh - 20);
        farCtx.lineTo(xp, 120 - bh);
        farCtx.lineTo(xp + bw, 120 - bh);
        farCtx.fill();
        farCtx.fillStyle = '#78909C';
      }
      xp += bw + 2;
    }
    PVR.Assets.bg_far = far;

    // near buildings
    var near = PVR.Placeholder.createCanvas(1600, 150);
    var nearCtx = near.getContext('2d');
    xp = 0;
    while (xp < 1600) {
      var nw = 30 + Math.random() * 60;
      var nh = 60 + Math.random() * 80;
      var hue = Math.random() < 0.5 ? '#BCAAA4' : '#D7CCC8';
      nearCtx.fillStyle = hue;
      nearCtx.fillRect(xp, 150 - nh, nw, nh);
      nearCtx.fillStyle = '#90CAF9';
      for (var wy = 150 - nh + 8; wy < 140; wy += 16) {
        for (var wx = xp + 5; wx < xp + nw - 8; wx += 12) {
          nearCtx.fillRect(wx, wy, 6, 8);
        }
      }
      xp += nw + 3;
    }
    PVR.Assets.bg_near = near;
  }

};
