/**
 * ui.js
 *
 */

$(function () {
  var $content = $("#content"),
      $app = $content.find(".apps"),
      $field = $content.find(".field"),
      $title = $("#app-title");

  $app.find("dl").click(function () {
    var appname = $(this).attr("data-appname");

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
    $app.show();
    $title.text("");
  });
});
