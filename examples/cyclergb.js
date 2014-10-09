
var finch = require('../')();

var i = 1;

setInterval(function() {

  finch.led(i === 1 ? 255 : 0, i === 2 ? 255 : 0, i === 3 ? 255 : 0);

  i++;
  if(i === 4) {
    i = 1;
  }

}, 1000);

