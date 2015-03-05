/**
 * App Launcher
 */

var app = require("appjs"),
    hogan = require("hogan.js"),
    express = require("express"),
    games = require("../games/settings.json"),
    cp = require("child_process"),
    path = require("path"),
    fs = require("fs");

var basePath = path.resolve(__dirname, "../");

// error catch
process.on("uncaughtException", function(err) {
  window.console.log("Caught exception: " + err);
});

// index route
var template = hogan.compile(fs.readFileSync(path.resolve(__dirname, "content/index.html"), "utf8")),
    model = Object.keys(games).map(function (key) {
      var game = games[key];
      game.id = key;
      return game;
    }),
    index = template.render({games: model});

app.router.get("/", function (req, res) {
  res.end(index);
});

// static route
app.serveFilesFrom(path.resolve(__dirname, "content"));
app.serveFilesFrom(path.resolve(__dirname, "../games"));

// start?game=name
var appFlag = false;

// close web app
var expressApp = express();
expressApp.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});
expressApp.delete("/game", function (req, res) {
  gameClose(0);
  res.send("ok");
});
expressApp.listen(8888, "127.0.0.1");

// start game
app.router.get("/start", function (req, res) {
  if (appFlag)
    return res.end({status: "ng", error: "起動中のゲームを終了してください。"});

  var game = games[req.params.game];

  if (! game)
    return res.end({status: "ng", error: "ゲームが存在しません。"});

  appFlag = true;

  var pathname = path.join(basePath, game.path),
      cwd = path.dirname(pathname);

  // ゲーム起動
  if (game.path.slice(-3) === ".nw") {
    pathname = path.resolve(__dirname, "nw/nw.exe") + " " + pathname;
    cwd = null;
  }

  cp.exec("start " + pathname, {
    cwd: cwd
  }).on("close", function (code) {
    if (game.path.slice(-3) !== ".nw") {
      gameClose(code);
    }
  });

  // 最小化
  window.frame.minimize();

  res.end({status: "ゲーム起動中…", app: game});
});

// game 終了処理
function gameClose(code) {
  var event = new window.Event("appclose");
  event.returnCode = code;
  window.dispatchEvent(event);
  // 最小化から戻る
  window.frame.maximize();
  appFlag = false;
}

var window = app.createWindow({
  width  : 960,
  height : 680,
  icons  : path.resolve(__dirname, "content/icons"),
  resizable: false,
  disableSecurity: false
});

window.on("create", function(){
  console.log("Window Created");
  window.frame.show();
  window.frame.maximize();
});

window.on("ready", function(){
  console.log("Window Ready");
  window.process = process;
  window.module = module;

  // developer tools
  window.addEventListener("keydown", function (e) {
    if (e.keyIdentifier === "F12")
      window.frame.openDevTools();
  });

  // disable context menu
  window.document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
  });
});

window.on("close", function(){
  console.log("Window Closed");
});
