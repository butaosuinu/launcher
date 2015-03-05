/**
 * vote.js
 *
 */

var request = require("request"),
    url = require("url");

request.defaults({
  json: true
});

module.exports = function () {
  var proxy;

  request.get("http://172.16.4.24:8080/proxy.json", {
    json: true
  }, function (err, res, obj) {
    if (err)
      return console.log(err);

    proxy = url.format({
      protocol: "http",
      auth: obj.user + ":" + obj.pass,
      host: "proxy5.hit.ac.jp:8080"
    });
    console.log(proxy);
  });

  return {
    start: function (data, done) {
      data.secret = "game-launcher-secret::55mince";
      request.post("http://vote.densan.info/start", {
        form: data,
        proxy: proxy
      }, function (err, res, obj) {
        if (err)
          return done && done(err);

        done && done(null, obj);
      });
    },
    vote: function (data, done) {
      data.secret = "game-launcher-secret::55mince";
      request.post("http://vote.densan.info/vote", {
        form: data,
        proxy: proxy
      }, function (err, res, obj) {
        if (err)
          return done && done(err);

        done && done(null, obj);
      });
    }
  };
};
