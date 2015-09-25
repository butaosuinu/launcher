/**
 * ui.js for UI Thread
 * Densan Launcher v3
 */

var angular = require("angular");
var jQuery = require("jquery");
var $ = jQuery;

require("./js/controllers");
require("./js/services");

angular.module("launcher", ["launcher.controllers", "launcher.services"])
.run(function () {

}).config(function () {

});
