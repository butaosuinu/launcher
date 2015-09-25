/**
 * GameManager.js
 *
 */

var BrowserWindow = require("browser-window");
var cp = require("child_process");
var path = require("path");

var base_path = path.resolve(__dirname, "../");
var launched = false;

// Game or App Start
exports.start = function (game) {
  return new Promise(function (resolve, reject) {
    if (launched) {
      reject("起動中のゲームを終了してください。");
      return;
    }

    if (! game) {
      reject("ゲームが存在しません。");
      return;
    }

    launched = true;

    var pathname = path.join(base_path, game.path);
    var cwd = path.dirname(pathname);

    // Launch!
    if (game.path.slice(-3) === ".nw") {
      // for Web App or Game

      var app_win = new BrowserWindow({
        width: 800,
        height: 800
      });
      // 常に最前面に設定
      app_win.setAlwaysOnTop(true);
      app_win.loadUrl(`file://${pathname}/index.html`);
      app_win.on("closed", function () {
        launched = false;
        resolve(0);
      });
      app_win.on("error", function (err) {
        launched = false;
        console.error(err);
        reject(err.message);
      });
    } else {
      // for Native App or Game

      console.log("start " + pathname);
      cp.exec("start " + pathname, {
        cwd: cwd
      }).on("close", function (code) {
        launched = false;
        resolve(code);
      }).on("error", function (err) {
        launched = false;
        console.error(err);
        reject(err.message);
      });
    }
  });
};
