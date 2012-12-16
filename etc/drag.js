(function(d) {
  d.addEventListener("mousedown", function(e) {
    var tgt = e.target;
    if (tgt.classList.contains("drag_item")) {
      e.preventDefault();
      clickX = e.offsetX || (e.layerX | 0);
      clickY = e.offsetY || (e.layerY | 0);
      dragtgt = tgt;
      d.addEventListener("mousemove", ondrag);
    }
  });
  d.addEventListener("mouseup", function() {
    if (dragtgt) {
      //dragtgt.setAttribute("style", "");
      dragtgt = null;
      d.removeEventListener("mousemove", ondrag);
    }
  }); 
  var ondrag = function(e) {
    var x = (e.pageX || e.x) - clickX, y = (e.pageY || e.y) - clickY;
    dragtgt.style.position = "fixed";
    dragtgt.style.left = x + "px";
    dragtgt.style.top = y + "px";
  };
  var dragtgt, clickX, clickY;
})(document);
