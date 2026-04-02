window.PVR = window.PVR || {};

PVR.WIDTH = 1600;
PVR.HEIGHT = 1000;
PVR.FPS = 60;
PVR.STEP = 1 / PVR.FPS;

PVR.ROAD = {
  LENGTH: 200,
  WIDTH: 660,
  SEGMENT_LENGTH: 200,
  RUMBLE_LENGTH: 3,
  CAMERA_HEIGHT: 1000,
  CAMERA_DEPTH: null,
  FIELD_OF_VIEW: 100,
  DRAW_DISTANCE: 300,
  PLAYER_Z: null
};

PVR.ROAD.CAMERA_DEPTH = 1 / Math.tan((PVR.ROAD.FIELD_OF_VIEW / 2) * Math.PI / 180);
PVR.ROAD.PLAYER_Z = PVR.ROAD.CAMERA_HEIGHT * PVR.ROAD.CAMERA_DEPTH;

PVR.SPEED = {
  MAX: PVR.ROAD.SEGMENT_LENGTH / PVR.STEP,
  BRAKE: null,
  DECEL: null,
  OFF_ROAD: null,
  CENTRIFUGAL: 0.3,
  // 4 acceleration zones: [threshold in km/h, accel factor]
  // accel factor is multiplied by MAX/5 (the base accel rate)
  ACCEL_ZONES: [
    { upTo: 5,  factor: 1.0, pedalRate: 1.5 },  // 0-5 km/h: quick start
    { upTo: 25, factor: 1.0, pedalRate: 4.0 },   // 5-25 km/h: brisk cruising cadence
    { upTo: 30, factor: 0.4, pedalRate: 5.0 },   // 25-30 km/h: fast spinning
    { upTo: 35, factor: 0.15, pedalRate: 6.0 }   // 30-35 km/h: legs going wild
  ],
  MAX_KMH: 35,
  TURN_MAX_KMH: 22
};

PVR.SPEED.BRAKE = -PVR.SPEED.MAX;
PVR.SPEED.DECEL = -PVR.SPEED.MAX / 5;
PVR.SPEED.OFF_ROAD = PVR.SPEED.MAX / 4;
PVR.SPEED.BASE_ACCEL = PVR.SPEED.MAX / 5;

PVR.LANE = {
  LEFT_EDGE:    -1.3,
  DIVIDER:      -0.6,
  RIGHT_EDGE:   +1.0,
  CYCLE_CENTER: -0.95,
  CAR_CENTER:   +0.2,
  RUMBLE_WIDTH:  0.2
};

PVR.COLORS = {
  SKY: '#72D7EE',
  TREE: '#005108',
  FOG: '#005108',

  LIGHT: { road: '#6B6B6B', concrete: '#B0B0B0', rumble: '#FFFFFF', lane: '#6B6B6B' },
  DARK:  { road: '#696969', concrete: '#989898', rumble: '#FFFFFF', lane: '#FFFFFF' },

  START: { road: '#FFFFFF', concrete: '#B0B0B0', rumble: '#FFFFFF', lane: '#FFFFFF' },
  FINISH: { road: '#000000', concrete: '#989898', rumble: '#000000', lane: '#000000' },

  HUD_TEXT: '#FFFFFF',
  HUD_BG: 'rgba(0, 0, 0, 0.6)'
};

PVR.RACE = {
  COUNTDOWN_SECS: 3
};

PVR.CURVE = {
  EASY: 2,
  MEDIUM: 4,
  HARD: 6
};

PVR.HILL = {
  LOW: 20,
  MEDIUM: 40,
  HIGH: 60
};

PVR.BG = {
  SKY_Y: 0,
  SKY_H: 384,
  NEAR_Y: 200,
  NEAR_H: 386
};

PVR.ROAD_STAMP_INTERVAL = 30;

PVR.NPC_CONFIG = {
  SPEED_FACTOR: 0.6,
  HITBOX_WIDTH: 0.4,
  PLAYER_WIDTH: 0.4,
  OVERLAP_PERCENT: 0.8,
  Z_PROXIMITY: 400
};

PVR.DEBUG = {
  HIDE_SPRITES: false,
  HIDE_PLAYER: false
};
