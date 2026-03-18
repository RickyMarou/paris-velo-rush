window.PVR = window.PVR || {};

PVR.Road = {

  segments: [],
  trackLength: null,

  resetSegments: function() {
    PVR.Road.segments = [];
  },

  lastY: function() {
    var segs = PVR.Road.segments;
    return (segs.length === 0) ? 0 : segs[segs.length - 1].p2.world.y;
  },

  addSegment: function(curve, y) {
    var n = PVR.Road.segments.length;
    PVR.Road.segments.push({
      index: n,
      p1: { world: { y: PVR.Road.lastY(), z: n * PVR.ROAD.SEGMENT_LENGTH },     camera: {}, screen: {} },
      p2: { world: { y: y,                 z: (n + 1) * PVR.ROAD.SEGMENT_LENGTH }, camera: {}, screen: {} },
      curve: curve,
      sprites: [],
      color: Math.floor(n / PVR.ROAD.RUMBLE_LENGTH) % 2 ? PVR.COLORS.DARK : PVR.COLORS.LIGHT
    });
  },

  addStraight: function(num) {
    num = num || PVR.ROAD.LENGTH;
    PVR.Road.addRoad(num, num, num, 0, 0);
  },

  addCurve: function(num, curve, height) {
    num = num || PVR.ROAD.LENGTH;
    curve = curve || 0;
    height = height || 0;
    PVR.Road.addRoad(num, num, num, curve, height);
  },

  addHill: function(num, height) {
    num = num || PVR.ROAD.LENGTH;
    height = height || 0;
    PVR.Road.addRoad(num, num, num, 0, height);
  },

  addSCurves: function() {
    PVR.Road.addRoad(PVR.ROAD.LENGTH, PVR.ROAD.LENGTH, PVR.ROAD.LENGTH, -PVR.CURVE.EASY, PVR.HILL.LOW);
    PVR.Road.addRoad(PVR.ROAD.LENGTH, PVR.ROAD.LENGTH, PVR.ROAD.LENGTH, PVR.CURVE.MEDIUM, PVR.HILL.MEDIUM);
    PVR.Road.addRoad(PVR.ROAD.LENGTH, PVR.ROAD.LENGTH, PVR.ROAD.LENGTH, PVR.CURVE.EASY, -PVR.HILL.LOW);
    PVR.Road.addRoad(PVR.ROAD.LENGTH, PVR.ROAD.LENGTH, PVR.ROAD.LENGTH, -PVR.CURVE.EASY, PVR.HILL.MEDIUM);
  },

  addRoad: function(enter, hold, leave, curve, y) {
    var startY = PVR.Road.lastY();
    var endY = startY + (y * PVR.ROAD.SEGMENT_LENGTH);
    var total = enter + hold + leave;

    for (var n = 0; n < enter; n++) {
      PVR.Road.addSegment(PVR.Util.easeIn(0, curve, n / enter), PVR.Util.easeInOut(startY, endY, n / total));
    }
    for (n = 0; n < hold; n++) {
      PVR.Road.addSegment(curve, PVR.Util.easeInOut(startY, endY, (enter + n) / total));
    }
    for (n = 0; n < leave; n++) {
      PVR.Road.addSegment(PVR.Util.easeInOut(curve, 0, n / leave), PVR.Util.easeInOut(startY, endY, (enter + hold + n) / total));
    }
  },

  findSegment: function(z) {
    return PVR.Road.segments[Math.floor(z / PVR.ROAD.SEGMENT_LENGTH) % PVR.Road.segments.length];
  },

  addSprite: function(n, sprite, offset) {
    var segs = PVR.Road.segments;
    if (n < segs.length) {
      segs[n].sprites.push({ source: sprite, offset: offset });
    }
  },

  buildTrack: function() {
    PVR.Road.resetSegments();

    PVR.Road.addStraight(25);
    PVR.Road.addCurve(PVR.ROAD.LENGTH, PVR.CURVE.MEDIUM, PVR.HILL.LOW);
    PVR.Road.addHill(PVR.ROAD.LENGTH, PVR.HILL.HIGH);
    PVR.Road.addStraight(50);
    PVR.Road.addCurve(PVR.ROAD.LENGTH, -PVR.CURVE.HARD, PVR.HILL.MEDIUM);
    PVR.Road.addSCurves();
    PVR.Road.addStraight(PVR.ROAD.LENGTH);
    PVR.Road.addCurve(PVR.ROAD.LENGTH, PVR.CURVE.EASY, -PVR.HILL.MEDIUM);
    PVR.Road.addHill(PVR.ROAD.LENGTH, PVR.HILL.HIGH);
    PVR.Road.addCurve(PVR.ROAD.LENGTH, -PVR.CURVE.MEDIUM, 0);
    PVR.Road.addStraight(200);

    PVR.Road.trackLength = PVR.Road.segments.length * PVR.ROAD.SEGMENT_LENGTH;

    PVR.Road.addRoadsideSprites();
  },

  addRoadsideSprites: function() {
    var segs = PVR.Road.segments;
    var trees = ['tree_1', 'tree_2'];
    var buildings = ['building_1', 'building_2', 'building_3', 'building_4'];
    var props = ['cafe', 'baguette_stand', 'newspaper_kiosk', 'velib_station'];
    var small = ['lamppost', 'trash_bin', 'bollard', 'pigeon'];

    for (var n = 10; n < segs.length; n += 5) {
      var side = (n % 2 === 0) ? 0.7 : -0.7;
      var spriteKey;
      var r = Math.random();

      if (r < 0.25) spriteKey = PVR.Util.randomChoice(trees);
      else if (r < 0.40) spriteKey = PVR.Util.randomChoice(small);
      else if (r < 0.60) spriteKey = PVR.Util.randomChoice(buildings);
      else if (r < 0.80) spriteKey = PVR.Util.randomChoice(props);
      else spriteKey = PVR.Util.randomChoice(trees);

      PVR.Road.addSprite(n, spriteKey, side + (Math.random() - 0.5) * 0.2);
    }

    for (n = 20; n < segs.length; n += 80) {
      var landmarkSide = (n % 4 === 0) ? 1.2 : -1.2;
      var landmarks = ['eiffel_tower', 'arc_triomphe'];
      PVR.Road.addSprite(n, PVR.Util.randomChoice(landmarks), landmarkSide);
    }
  }

};
