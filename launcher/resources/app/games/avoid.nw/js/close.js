/**
 * node-webkit の終了を AppJS へ通知するための close.js
 */

// node-webkit
var gui = require("nw.gui");
var win = gui.Window.get();

// close event
win.on("close", function () {
  // send close request
  var xhr = new XMLHttpRequest();
  xhr.open("DELETE", "http://127.0.0.1:8888/game");
  xhr.onload = function (res) {
    console.log("close: " + res);
    win.close(true);
  };
  xhr.send(null);
});
