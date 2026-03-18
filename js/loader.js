window.PVR = window.PVR || {};

PVR.Loader = {

  spriteMap: {
    'player_straight': 'assets/sprites/player_straight.png',
    'player_left1':    'assets/sprites/player_left1.png',
    'player_left2':    'assets/sprites/player_left2.png',
    'player_right1':   'assets/sprites/player_right1.png',
    'player_right2':   'assets/sprites/player_right2.png',
    'rival_bike':      'assets/sprites/rival_bike.png',
    'rival_scooter':   'assets/sprites/rival_scooter.png',
    'rival_pedestrian':'assets/sprites/rival_pedestrian.png',
    'rival_truck':     'assets/sprites/rival_truck.png',
    'tree_1':          'assets/sprites/tree_1.png',
    'tree_2':          'assets/sprites/tree_2.png',
    'lamppost':        'assets/sprites/lamppost.png',
    'building_1':      'assets/sprites/building_1.png',
    'building_2':      'assets/sprites/building_2.png',
    'building_3':      'assets/sprites/building_3.png',
    'building_4':      'assets/sprites/building_4.png',
    'cafe':            'assets/sprites/cafe.png',
    'eiffel_tower':    'assets/sprites/eiffel_tower.png',
    'arc_triomphe':    'assets/sprites/arc_triomphe.png',
    'baguette_stand':  'assets/sprites/baguette_stand.png',
    'newspaper_kiosk': 'assets/sprites/newspaper_kiosk.png',
    'velib_station':   'assets/sprites/velib_station.png',
    'pigeon':          'assets/sprites/pigeon.png',
    'trash_bin':       'assets/sprites/trash_bin.png',
    'bollard':         'assets/sprites/bollard.png',
    'bg_sky':          'assets/backgrounds/bg_sky.png',
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
