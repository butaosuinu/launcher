/**
 * main.js
 *
 */

var games = {
  escape: {
    name: "脱出ゲーム"
  },
  avoid: {
    name: "Avoid Game"
  },
  shooting: {
    name: "SHOOTING GAME"
  },
  naguru: {
    name: "ナグル&オチモンズ"
  },
  yugeki: {
    name: "電算遊撃"
  }
};

$(function () {
  google.setOnLoadCallback(function () {
    var barChart = new google.visualization.ColumnChart($("#bar-chart")[0]);

    function drawChart(data) {
      console.log(data);

      var ranking = [["game", "score"]];
      ranking = ranking.concat(data.ranking.map(function (data) {
        return [games[data.game].name, Number(data.score)];
      }));

      console.log(ranking);

      var data = google.visualization.arrayToDataTable(ranking);

      barChart.draw(data, {
        title: "リアルタイムランキング",
        animation: {
          duration: 1000,
          easing: "out"
        }
      });
    }

    var socket = io.connect(location.href);
    socket.on("connect", function () {
      console.log("connected!");

      // init data
      socket.emit("init", function (data) {
        drawChart(data);
      });

      // update data
      socket.on("broadcast", function (data) {
        drawChart(data);
      });
    });
  });
});
