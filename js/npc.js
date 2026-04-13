window.PVR = window.PVR || {};

PVR.NPC = {

  list: [],

  signedDistance: function(fromZ, toZ, trackLength) {
    var dz = toZ - fromZ;
    if (dz < -trackLength / 2) dz += trackLength;
    if (dz > trackLength / 2) dz -= trackLength;
    return dz;
  },

  reset: function() {
    PVR.NPC.list = [];
  },

  spawnRival: function(z) {
    PVR.NPC.list.push({
      sprite: 'rival_bike',
      offset: PVR.LANE.CYCLE_CENTER,
      z: z,
      speed: PVR.SPEED.MAX * PVR.NPC_CONFIG.SPEED_FACTOR,
      w: PVR.NPC_CONFIG.HITBOX_WIDTH
    });
  },

  update: function(dt, trackLength) {
    for (var i = 0; i < PVR.NPC.list.length; i++) {
      var npc = PVR.NPC.list[i];
      npc.z = PVR.Util.increase(npc.z, dt * npc.speed, trackLength);
    }
  },

  findOnSegment: function(segIndex) {
    var segCount = PVR.Road.segments.length;
    for (var i = 0; i < PVR.NPC.list.length; i++) {
      var npc = PVR.NPC.list[i];
      var npcSeg = Math.floor(npc.z / PVR.ROAD.SEGMENT_LENGTH) % segCount;
      if (npcSeg === segIndex) return npc;
    }
    return null;
  },

  checkCollision: function(playerZ, playerX, trackLength) {
    var cfg = PVR.NPC_CONFIG;
    for (var i = 0; i < PVR.NPC.list.length; i++) {
      var npc = PVR.NPC.list[i];
      var dz = Math.abs(PVR.NPC.signedDistance(playerZ, npc.z, trackLength));

      if (dz < cfg.Z_PROXIMITY) {
        if (PVR.Util.overlap(playerX, cfg.PLAYER_WIDTH, npc.offset + cfg.HITBOX_X, npc.w, cfg.OVERLAP_PERCENT)) {
          return npc;
        }
      }
    }
    return null;
  },

  findBlockingNpc: function(playerZ, playerX, trackLength) {
    var cfg = PVR.NPC_CONFIG;
    var closestNpc = null;
    var closestGap = Infinity;

    for (var i = 0; i < PVR.NPC.list.length; i++) {
      var npc = PVR.NPC.list[i];
      if (!PVR.Util.overlap(playerX, cfg.PLAYER_WIDTH, npc.offset + cfg.HITBOX_X, npc.w, cfg.OVERLAP_PERCENT)) {
        continue;
      }

      var gap = PVR.NPC.signedDistance(playerZ, npc.z, trackLength);
      if (gap >= 0 && gap <= cfg.Z_PROXIMITY && gap < closestGap) {
        closestGap = gap;
        closestNpc = npc;
      }
    }

    return closestNpc;
  }

};
