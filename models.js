/**
 * Models
 *
 */

var redis = require("redis");

module.exports = function () {
  var client = redis.createClient();
  client.on("error", function (err) {
    console.error("Error: " + err);
  });
  client.on("connect", function () {
/*
    // init history
    client.rpush("history", JSON.stringify({
      game: "dass",
      judge: -1,
      timestamp: Date.now()
    }));
    client.rpush("history", JSON.stringify({
      game: "sstu",
      judge: 1,
      timestamp: Date.now()
    }));

    // init ranking
    client.zadd("ranking", 32, "dass", 60, "sstu");
*/
  });

  var models = {};

  models.playing = {
    add: function (data, done) {
      client.zincrby("playing", 1, data.game, function (err, reply) {
        if (err)
          return done(err);

        done(null, reply);
      });
    },
    remove: function (data, done) {
      client.zincrby("playing", -1, data.game, function (err, reply) {
        if (err)
          return done(err);

        done(null, reply);
      });
    },
    get: function (done) {
      client.zrange("playing", 0, -1, "WITHSCORES", function (err, reply) {
        if (err)
          return done(err);

        var playing = {};

        for (var i = 0, l = reply.length; i < l; i += 2) {
          playing[reply[i]] = reply[i + 1];
        }

        done(null, playing);
      });
    }
  };

  models.history = {
    set: function (data, done) {
      client.rpush("history", JSON.stringify({
        game: data.game,
        judge: data.judge,
        timestamp: Date.now()
      }), function (err, reply) {
        if (err)
          return done(err);

        done(null, reply);
      });
    },
    get: function (done) {
      client.lrange("history", 0, -1, function (err, reply) {
        if (err)
          return done(err);

        done(null, reply);
      });
    }
  };

  models.ranking = {
    set: function (data, done) {
      client.zincrby("ranking", data.judge, data.game, function (err, reply) {
        if (err)
          return done(err);

        done(null, reply);
      });
    },
    get: function (done) {
      client.zrange("ranking", 0, -1, "WITHSCORES", function (err, reply) {
        if (err)
          return done(err);

        var ranking = [];

        for (var i = 0, l = reply.length; i < l; i += 2) {
          ranking.push({
            game: reply[i],
            score: reply[i + 1]
          });
        }

        done(null, ranking);
      });
    }
  };

  return models;
};
