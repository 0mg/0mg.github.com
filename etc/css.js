window.addEventListener && addEventListener("load", function() {
  var convertCSS = function(cssText) {
    var style = document.createElement("style");
    var sel = ["linear-gradient", "repeating-linear-gradient"].join("|");
    var newCSSText = cssText.replace(RegExp(sel, "g"), function(s) {
      return "-webkit-" + s;
    });
    style.textContent = newCSSText;
    document.head.appendChild(style);
  };
  convertCSS.byURL = function(url) {
    var it = this;
    var xhr = new XMLHttpRequest;
    xhr.open("get", url, true);
    xhr.addEventListener("load", function() {
      it(xhr.responseText);
    });
    xhr.send(null);
    return null;
  };
  [].forEach.call(document.styleSheets, function(css) {
    if (css.href) {
      convertCSS.byURL(css.href);
    } else {
      convertCSS(css.ownerNode.textContent);
    }
  });
}, true);
