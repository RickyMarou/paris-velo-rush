window.PVR = window.PVR || {};

PVR.Input = {

  keys: {
    left: false,
    right: false,
    up: false,
    down: false,
    enter: false
  },

  touchState: {
    left: false,
    right: false,
    accelerate: false
  },

  init: function() {
    document.addEventListener('keydown', PVR.Input.onKeyDown);
    document.addEventListener('keyup', PVR.Input.onKeyUp);

    var canvas = document.getElementById('game');
    if (!canvas) return;

    canvas.addEventListener('touchstart', PVR.Input.onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', PVR.Input.onTouchMove, { passive: false });
    canvas.addEventListener('touchend', PVR.Input.onTouchEnd, { passive: false });
    canvas.addEventListener('touchcancel', PVR.Input.onTouchEnd, { passive: false });
  },

  onKeyDown: function(e) {
    switch (e.keyCode) {
      case 37: PVR.Input.keys.left  = true; break;
      case 39: PVR.Input.keys.right = true; break;
      case 38: PVR.Input.keys.up    = true; break;
      case 40: PVR.Input.keys.down  = true; break;
      case 13: PVR.Input.keys.enter = true; break;
    }
  },

  onKeyUp: function(e) {
    switch (e.keyCode) {
      case 37: PVR.Input.keys.left  = false; break;
      case 39: PVR.Input.keys.right = false; break;
      case 38: PVR.Input.keys.up    = false; break;
      case 40: PVR.Input.keys.down  = false; break;
      case 13: PVR.Input.keys.enter = false; break;
    }
  },

  onTouchStart: function(e) {
    e.preventDefault();
    PVR.Input.processTouches(e.touches);
  },

  onTouchMove: function(e) {
    e.preventDefault();
    PVR.Input.processTouches(e.touches);
  },

  onTouchEnd: function(e) {
    e.preventDefault();
    PVR.Input.processTouches(e.touches);
  },

  processTouches: function(touches) {
    PVR.Input.touchState.left = false;
    PVR.Input.touchState.right = false;
    PVR.Input.touchState.accelerate = false;

    var canvas = document.getElementById('game');
    if (!canvas) return;

    var rect = canvas.getBoundingClientRect();
    var thirdWidth = rect.width / 3;

    for (var i = 0; i < touches.length; i++) {
      var x = touches[i].clientX - rect.left;
      PVR.Input.touchState.accelerate = true;

      if (x < thirdWidth) {
        PVR.Input.touchState.left = true;
      } else if (x > thirdWidth * 2) {
        PVR.Input.touchState.right = true;
      }
    }
  },

  isLeft: function() {
    return PVR.Input.keys.left || PVR.Input.touchState.left;
  },

  isRight: function() {
    return PVR.Input.keys.right || PVR.Input.touchState.right;
  },

  isAccelerate: function() {
    return PVR.Input.keys.up || PVR.Input.touchState.accelerate;
  },

  isBrake: function() {
    return PVR.Input.keys.down;
  },

  isEnter: function() {
    return PVR.Input.keys.enter || PVR.Input.touchState.accelerate;
  }

};
