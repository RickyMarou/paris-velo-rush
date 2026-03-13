window.PVR = window.PVR || {};

PVR.Loader = {

  spriteMap: {
    'player_straight': 'assets/sprites/player_straight.png',
    'player_left1':    'assets/sprites/player_left1.png',
    'player_left2':    'assets/sprites/player_left2.png',
    'player_right1':   'assets/sprites/player_right1.png',
    'player_right2':   'assets/sprites/player_right2.png',
    'tree':            'assets/sprites/tree.png',
    'lamppost':        'assets/sprites/lamppost.png',
    'building_small':  'assets/sprites/building_small.png',
    'building_tall':   'assets/sprites/building_tall.png',
    'cafe':            'assets/sprites/cafe.png',
    'eiffel_tower':    'assets/sprites/eiffel_tower.png',
    'arc_triomphe':    'assets/sprites/arc_triomphe.png',
    'notre_dame':      'assets/sprites/notre_dame.png',
    'bg_sky':          'assets/backgrounds/bg_sky.png',
    'bg_far':          'assets/backgrounds/bg_far.png',
    'bg_near':         'assets/backgrounds/bg_near.png'
  },

  load: function(callback) {
    PVR.Placeholder.buildAll();

    var keys = Object.keys(PVR.Loader.spriteMap);
    var remaining = keys.length;

    if (remaining === 0) {
      callback();
      return;
    }

    var done = function() {
      remaining--;
      if (remaining <= 0) callback();
    };

    for (var i = 0; i < keys.length; i++) {
      (function(key) {
        var img = new Image();
        img.onload = function() {
          PVR.Assets[key] = img;
          done();
        };
        img.onerror = done;
        img.src = PVR.Loader.spriteMap[key];
      })(keys[i]);
    }

    setTimeout(callback, 2000);
  }

};
