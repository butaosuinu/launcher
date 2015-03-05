/**
 * ui.js
 *
 */

// 通信失敗分のログ保存
function save(game, point) {
  var p = localStorage.getItem(game) || 0;
  localStorage.setItem(game, p + point);
  console.log("point: " + localStorage.getItem(game));
}

$(function () {
  var $content = $("#content"),
      $app = $content.find(".apps"),
      $field = $content.find(".field"),
      $judge = $content.find(".judge"),
      $title = $("#app-title");

  var appname;

  $app.find("dl").click(function () {
    appname = $(this).attr("data-appname");

    $.getJSON("/start?game=" + appname, function (res) {
      if (res.error)
        return alert(res.error);

      console.log(res);

      $app.hide();
      $field.show();

      $title.text(res.app.name);
    });
  });

  window.addEventListener("appclose", function (e) {
    console.log("return code: " + e.returnCode);
    $field.hide();
    $judge.show();
  });

  $judge.find("button").click(function () {
    var judge = $(this).hasClass("like");

    $.ajax({
      url: "/vote",
      method: "get",
      data: {
        judge: judge,
        game: appname
      },
      dataType: "json"
    }).done(function (res) {
      if (res.error)
        return console.error(res.error);

      console.log(res);
    }).fail(function () {
      console.log("通信失敗");
      save(appname, judge ? 1 : -1);
    });

    $judge.hide();
    $app.show();
    $title.text("");
  });
});
