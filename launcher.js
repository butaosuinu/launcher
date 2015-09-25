/**
 * electron bootstrap
 * Densan Launcher v3
 */

var app = require("app");
var dialog = require("dialog");
var BrowserWindow = require("browser-window");

require("crash-reporter").start();

var mainWindow = null;

app.on("window-all-closed", function () {
  app.quit();
});

app.on("ready", function () {
  mainWindow = new BrowserWindow({
    width: 960,
    height: 680
  });

  // メニューバーを隠す
  mainWindow.setAutoHideMenuBar(true);
  mainWindow.loadUrl(`file://${__dirname}/static/index.html`);

  // 閉じる前の警告
  var close_selected = false;
  mainWindow.on("close", function (e) {
    if (close_selected) {
      return;
    }

    var res = dialog.showMessageBox(mainWindow, {
      type: "question",
      message: "閉じちゃうの？",
      detail: "ねぇ、本当に閉じるつもりなの？？",
      buttons: ["キャンセル", "閉じる"]
    });

    if (res === 0) {
      e.preventDefault();
    } else {
      close_selected = true;
      console.log("close selected");
      app.quit();
    }
  });

  mainWindow.on("closed", function () {
    mainWindow = null;
  });
});
