
var finch = require('./');
var assert = require('assert');

describe('node-finch', function() {

  it('should error with no finch available', function() {
    assert.throws(function() {
      finch();
    }, 'Unable to find Finch');
  });

  describe('Connected Tests', function() {

    var device;

    before(function(done) {
      console.log('Please connect your Finch within 10 seconds');
      this.timeout('15s');
      setTimeout(function() {
        device = finch();
        done();
      }, 10 * 1000);
    });

    describe('.led', function() {
      it('should error on wrong args', function() {
        assert.throws(function() {
          device.led(-10, -10, -10);
        });
        assert.throws(function() {
          device.led(255, 255, 256);
        });
        assert.throws(function() {
          device.led();
        });
      });
    });

    describe('.move', function() {
      it('should error on wrong args', function() {
        device.move(0, 0);
      });
      it('should accept shorthand', function() {
        device.move(0, 0);
      });
    });

  });


});