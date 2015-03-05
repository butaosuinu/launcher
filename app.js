/**
 * Lancher Server
 *
 */

var express = require("express.io"),
    redis = require("redis"),
    routes = require("./routes"),
    models = require("./models"),
    path = require("path");

// connect DB & load models
var db = models();

// setup express
var app = express().http().io();
app.configure(function () {
  app.disable("x-powered-by");
  app.set("express", express);
  app.set("db", db);
  // production setting
  process.env.PORT = 61029;
  app.set("port", process.env.PORT || 3000);

  // parser settings
  app.use(express.bodyParser());

  // logger
  app.use(express.logger("dev"));
  app.use(express.errorHandler());

  // for XHR
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
  });

  // routings
  app.use(express.static(path.resolve(__dirname, "static")));
  app.use(app.router);

  // RedisStore Settings
  app.io.set("store", new express.io.RedisStore({
    redisPub: redis.createClient(),
    redisSub: redis.createClient(),
    redisClient: redis.createClient()
  }));
});

// Start Server
app.listen(app.get("port"), function () {
  console.log("Server: \033[032mstart\033[m");
});

// Routes
routes.call(app);
