
/**
 * Module Dependencies
 */

var HID = require('node-hid');
var _   = require('underscore');

/**
 * Constants
 */

var DEVICE_VENDOR = 0x2354;
var DEVICE_PRODUCT = 0x1111;

var BYTE_LED = 'O'.charCodeAt(0);
var BYTE_MOTOR = 'M'.charCodeAt(0);
var BYTE_BUZZER = 'B'.charCodeAt(0);
var BYTE_TEMPERATURE = 'T'.charCodeAt(0);
var BYTE_LIGHT = 'L'.charCodeAt(0);
var BYTE_ACCELEROMETER = 'A'.charCodeAt(0);
var BYTE_OBSTACLE = 'I'.charCodeAt(0);
var BYTE_STOP = 'X'.charCodeAt(0);
var BYTE_RESET = 'R'.charCodeAt(0);
var BYTE_CONNECT_TEST = 'z'.charCodeAt(0);

/**
 * Finds a Finch connected to USB
 * @return {Device}   If undefined, no Finch has been found
 */
function findFinch() {

  var devices = HID.devices();
  var device =_.find(devices, {
    vendorId: DEVICE_VENDOR,
    productId: DEVICE_PRODUCT
  });

  if(!device) {
    throw new Error('Unable to find Finch. Is he plugged in?');
  }

  try {
    device = new HID.HID(device.path);
  } catch (e) {
    throw new Error('Connection Error: ' + e);
  }

  device.on('data', function(d) {
    console.log('data:', d);
  });

  process.on('exit', function() {
    device.close();
  });

  return device;
}


/**
 * Finch
 */
var Finch = function() {
  if(this instanceof Finch === false) { return new Finch(); }
  this.device = findFinch();
  return this;
};

/**
 * Pad and send a Finch command
 * @param  {Array} bufArray integer or hex values
 * @return {Boolean}          correctly written
 */
Finch.prototype._send = function(bufArray) {
  // Pad array (should be 9 bytes)
  if(bufArray.length < 9) {
    for (var i = bufArray.length; i < 9; i++) {
      bufArray.push(0);
    }
  }

  // Send buffer
  return this.device.write(bufArray);
};


/**
 * Complete Functionality
 */

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
  return this._send([BYTE_LED, r, g, b]);
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
  return this.device._send([BYTE_MOTOR, leftDirection, leftSpeed, rightDirection, rightSpeed]);
};

/**
 * Make Finch Cycle Colours
 */
Finch.prototype.setIdleMode = function() {
  return this._send([BYTE_RESET]);
};

/**
 * Turns off Motor and LED
 * @return {Boolean} Command sent
 */
Finch.prototype.turnOffMotorAndLEDs = function() {
  return this._send([BYTE_STOP]);
};


/**
 * Incomplete Functionality
 */

/**
 * Turn the buzzer on
 * @param  {Number} msec Miliseconds to run
 * @param  {Number} freq Buzz Frequency
 * @return {Boolean} successful write
 */
Finch.prototype.buzzer = function(msec, freq) {
  return this._send(BYTE_BUZZER, msec >> 8, msec, freq >> 8, freq);
};

/**
 * Check Finch's Temperature
 * @param  {Function} cb (err, degreesCelcius)
 * @return {Boolean}      Successfully written to stream
 */
Finch.prototype.temperature = function(cb) {
  this.device.once('data', function(buf) {
    cb(null, (buf[0]-127)/2.4 + 25);
  });
  this._send([BYTE_TEMPERATURE]);
};

Finch.prototype.light = function(cb) {
  this.device.write([BYTE_LIGHT]);
  this.device.read(function(err, buf) {
    // TODO: Parse buf
    cb(err, buf);
  });
};

Finch.prototype.accelerometer = function(cb) {
  this.device.write([BYTE_ACCELEROMETER]);
  this.device.read(function(err, buf) {
    // TODO: Parse buf
    cb(err, buf);
  });
};

Finch.prototype.obstacles = function(cb) {
  this.device.write([BYTE_OBSTACLE]);
  this.device.read(function(err, buf) {
    // TODO: Parse buf
    cb(err, buf);
  });
};

Finch.prototype._connectionTest = function() {
  this._send([BYTE_CONNECT_TEST]);
};



module.exports = Finch;