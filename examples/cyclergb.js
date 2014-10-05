
var finch = require('../')();

function red() {
  finch.led(255, 0, 0);
  setTimeout(green, 1000);
}

function green() {
  finch.led(0, 255, 0);
  setTimeout(blue, 1000);
}

function blue() {
  finch.led(0, 0, 255);
  setTimeout(red, 1000);
}

red();
