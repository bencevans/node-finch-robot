# finch-robot

![](http://f.cl.ly/items/0708452q3i0C3t2n381T/f_sm.jpg)

A library for controlling [Finch Robots](http://www.finchrobot.com/) with Node.JS.

**This library is no longer maintained. Unfortunatly I don't have access to a Finch now.**

## Usage

node-finch-robot uses the [node-hid](https://github.com/node-hid/node-hid) library to communicate with the USB device. node-hid requires system level dependencies in order to control the USB device. On Linux you'll need `libudev-dev` or for Ubuntu versions missing libusb.h, you'll need `libusb-1.0-0-dev`. Now require the module and initialise an instance.

Ubuntu Users: `sudo apt-get install -y libusb-1.0-0-dev`


```js
var finch = require('finch-robot');
var device = finch();
```

If there's an issue finding or connecting to the device an error will be thrown by the second line.

After you have a device successfully initialised you can issue the Finch commands...

### LEDs

```js
device.led(r, g, b)
```

* r, g, b = [0-255] - Red, Green, Blue

### Moving

```js
device.move(leftDirection, leftSpeed, rightDirection, rightSpeed)
device.move(leftSpeed, rightSpeed) // Direction assumed forward
```

* leftDirection/rightDirection = [0|1] - 0 is forward, 1 is backwards
* leftSpeed/rightSpeed = [0-255] - 0 is stopped, 255 is fast


### Turn off Motors and LEDs

```js
device.turnOffMotorAndLEDs()
```

### Enter Idle Mode

This will make the Finch's LED colour cycle.

```
device.setIdleMode()
```


## TODO

**These commands are either not implemented or not working quite yet.**

### Buzzer

TODO

### Temperature

```js
device.temperature(callback)
```

### Light

```js
device.light(callback)
```

### Accelerometer

```js
device.accelerometer(callback)
```

## Development Resources

* [GitHub Page](http://github.com/bencevans/node-finch-robot)
* [Finch USB Protocol](http://www.finchrobot.com/usb-protocol)
* [Ruby Implementation](https://github.com/JARodrick/finch_ruby)
* [Go Implementation](https://github.com/agnivade/GoFinch)

## Licence

MIT
