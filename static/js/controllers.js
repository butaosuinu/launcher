
var angular = require("angular");

var remote = require("remote");
var BrowserWindow = remote.require("browser-window");
var GameManager = remote.require("./lib/GameManager");

var win = BrowserWindow.getFocusedWindow();

angular.module("launcher.controllers", [])
.controller("GameListCtrl", function ($scope, GameList) {
  $scope.games = GameList.map(function (game) {
    game.start = start;
    return game;
  });
  $scope.launched = false;

  function start() {
    console.log(`app_id: ${this.id}`);

    $scope.launched = true;
    GameManager.start(this).then(function (code) {
      console.log("exit code:", code);
    }).catch(function (err) {
      console.error(err);
    }).then(function () {
      console.log("restore");

      $scope.$apply(function () {
        $scope.launched = false;
      });

      // 戻す
      win.restore();
    });

    // 最小化
    win.minimize();
  }
});
