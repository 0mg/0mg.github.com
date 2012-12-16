addEventListener("load", function() {
  var df = document.createDocumentFragment();
  var head = document.querySelector("head");
  Array.prototype.forEach.call(document.querySelectorAll("style"), function(e) {
    var style = document.createElement("style");
    var sel = ["linear-gradient", "repeating-linear-gradient"].join("|");
    var csstext = e.textContent.
      replace(RegExp(sel, "g"), function(s) {
        return "-webkit-" + s;
      });
    style.textContent = csstext;
    df.appendChild(style);
  });
  head.insertBefore(df, head.firstChild);
});
