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
    var buildings = ['building_1', 'building_2', 'building_3', 'building_4'];
    var cafes = ['building_1', 'building_3'];
    var baseOffset = 2.0;
    var leftExtra = Math.abs(PVR.LANE.LEFT_EDGE) - 1.0;
    var jitter = 0.8;
    var tableSpacing = 3;

    for (var n = 10; n < segs.length; n += 20) {
      var rightBuilding = PVR.Util.randomChoice(buildings);
      var leftBuilding = PVR.Util.randomChoice(buildings);
      var rightOffset = baseOffset + Math.random() * jitter;
      var leftOffset = baseOffset + leftExtra + Math.random() * jitter;

      PVR.Road.addSprite(n, rightBuilding, rightOffset);
      PVR.Road.addSprite(n, leftBuilding, -leftOffset);

      if (cafes.indexOf(rightBuilding) >= 0) {
        var rightTables = 1 + Math.floor(Math.random() * 3);
        for (var t = 0; t < rightTables; t++) {
          var tableSeg = n + (t + 1) * tableSpacing;
          if (tableSeg < segs.length) {
            PVR.Road.addSprite(tableSeg, 'cafe', rightOffset);
          }
        }
      }

      if (cafes.indexOf(leftBuilding) >= 0) {
        var leftTables = 1 + Math.floor(Math.random() * 3);
        for (var u = 0; u < leftTables; u++) {
          var tableSeg = n + (u + 1) * tableSpacing;
          if (tableSeg < segs.length) {
            PVR.Road.addSprite(tableSeg, 'cafe', -leftOffset);
          }
        }
      }
    }
  }

};
