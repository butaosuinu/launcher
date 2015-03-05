/**
 * Routes
 *
 */

module.exports = function () {
  var app = this,
      db = app.get("db");

  // display
  app.get("/api", function (req, res) {
    db.history.get(function (err, logs) {
      if (err)
        console.log(err);

      db.ranking.get(function (err, ranking) {
        if (err)
          console.log(err);

        db.playing.get(function (err, playing) {
          if (err)
            console.log(err);

          res.send({
            logs: logs,
            ranking: ranking,
            playing: playing
          });
        });
      });
    });
  });

  // start
  app.post("/start", function (req, res) {
    if (! req.body.game)
      return res.send(400);

    if (req.body.secret !== "game-launcher-secret::55mince")
      return res.send(400);

    var params = {
      game: req.body.game
    };

    db.playing.add(params, function (err) {
      if (err)
        return res.send(500);

      res.send({status: "ok"});
    });
  });

  // vote
  app.post("/vote", function (req, res) {
    if (! req.body.game || req.body.judge == null)
      return res.send(400);

    if (req.body.secret !== "game-launcher-secret::55mince")
      return res.send(400);

    var params = {
      game: req.body.game,
      judge: req.body.judge === true || req.body.judge === "true" ? 1 : -1
    };

    db.history.set(params, function (err) {
      db.ranking.set(params, function (err) {
        db.playing.remove(params, function (err) {
          req.io.route("broadcast");
        });
      });
    });
  });

  // init data
  app.io.route("init", function (req) {
    db.history.get(function (err, logs) {
      if (err)
        console.log(err);

      db.ranking.get(function (err, ranking) {
        if (err)
          console.log(err);

        db.playing.get(function (err, playing) {
          if (err)
            console.log(err);

          req.io.respond({
            logs: logs,
            ranking: ranking,
            playing: playing
          });
        });
      });
    });
  });

  // broadcast
  app.io.route("broadcast", function (req) {
    db.history.get(function (err, logs) {
      if (err)
        console.log(err);

      db.ranking.get(function (err, ranking) {
        if (err)
          console.log(err);

        db.playing.get(function (err, playing) {
          if (err)
            console.log(err);

          app.io.broadcast("broadcast", {
            logs: logs,
            ranking: ranking,
            playing: playing
          });

          req.io.respond({
            status: "ok"
          });
        });
      });
    });
  });
};
