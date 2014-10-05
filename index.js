
/**
 * Module Dependencies
 */

var HID = require('node-hid');
var _   = require('underscore');

/**
 * Finds a Finch connected to USB
 * @return {Device}   If undefined, no Finch has been found
 */
function findFinch() {

  var devices = HID.devices();
  var device =_.find(devices, {
    vendorId: 9044,
    productId: 4369
  });

  if(!device) {
    throw new Error('Unable to find Finch. Is he plugged in?');
  }

  try {
    device = new HID.HID(device.path);
  } catch (e) {
    throw new Error('Connection Error: ' + e);
  }

  return device;
}


/**
 * Finch
 */
var Finch = function() {
  if(this instanceof Finch === false) return new Finch();
  this.device = findFinch();
  return this;
};

/**
 * Set Finch's LED Colour
 * @param  {Number} r [0-255]
 * @param  {Number} g [0-255]
 * @param  {Number} b [0-255]
 * @return {Boolean}  Successfully written to stream
 */
Finch.prototype.led = function(r, g, b) {
  if((r < 0 || r > 255) || (g < 0 || g > 255) || (b < 0 || b > 255)) {
    throw new Error('Invalid led args');
  }
  return this.device.write([0x4f, r, g, b]);
};

/**
 * Update Finch's Motor Velocities
 * @param  {Number} leftDirection  [0|1] 0=forwards, 1=backwards
 * @param  {Number} leftSpeed      [0-255] 0=stop, 255=fast
 * @param  {Number} rightDirection [0|1] 0=forwards, 1=backwards
 * @param  {Number} rightSpeed     [0-255] 0=stop, 255=fast
 * @return {Boolean}                Successfully written to stream
 */
Finch.prototype.move = function(leftDirection, leftSpeed, rightDirection, rightSpeed) {
  if((leftDirection < 0 || leftDirection > 1) || rightDirection < 0 || rightDirection > 1) {
    throw new Error('Invalid move args');
  }
  if((leftSpeed < 0 || leftSpeed > 255) || rightSpeed < 0 || rightSpeed > 255) {
    throw new Error('Invalid move args');
  }
  return this.device.write([0x77, leftDirection, leftSpeed, rightDirection, rightSpeed]);
};

// Finch.prototype.buzzer = function(r, g, b) {
//   if((r < 0 || r > 255) || (g < 0 || g > 255) || (b < 0 || b > 255)) {
//     throw new Error('Invalid buzzer args');
//   }
//   this.device.write([0x4f, r, g, b]);
// };

/**
 * Check Finch's Temperature
 * @param  {Function} cb (err, degreesCelcius)
 * @return {Boolean}      Successfully written to stream
 */
Finch.prototype.temperature = function(cb) {
  this.device.write([0x84]);
  this.device.read(function(buf) {
    // TODO: Parse buf
    // TODO: Convert to Celcius
    cb(err, buf);
  });
};

Finch.prototype.light = function(cb) {
  return this.device.write([0x76]);
  this.device.read(function(err, buf) {
    // TODO: Parse buf
    cb(err, buf);
  });
};

Finch.prototype.accelerometer = function(cb) {
  return this.device.write([0x65]);
  this.device.read(function(err, buf) {
    // TODO: Parse buf
    cb(err, buf);
  });
};

Finch.prototype.obstacles = function(cb) {
  return this.device.write([0x73]);
  this.device.read(function(err, buf) {
    // TODO: Parse buf
    cb(err, buf);
  });
};

module.exports = Finch;