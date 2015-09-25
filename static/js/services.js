
var remote = require("remote");

var angular = require("angular");
var games = remote.require("./games/settings.json");

angular.module("launcher.services", [])
.factory("GameList", function () {
  var list = Object.keys(games).map(function (key) {
    var game = games[key];
    game.id = key;
    return game;
  });

  return list;
});
