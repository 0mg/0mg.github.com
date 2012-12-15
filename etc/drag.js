(function() {
  addEventListener("mousedown", function(e) {
    var tgt = e.target;
    if (tgt.classList.contains("drag_item")) {
      e.preventDefault();
      clickX = e.offsetX || e.layerX;
      clickY = e.offsetY || e.layerY;
      dragtgt = tgt;
      addEventListener("mousemove", ondrag);
    }
  });
  addEventListener("mouseup", function() {
    if (dragtgt) {
      //dragtgt.setAttribute("style", "");
      dragtgt = null;
      removeEventListener("mousemove", ondrag);
    }
  }); 
  var ondrag = function(e) {
    var x = e.pageX - clickX, y = e.pageY - clickY;
    dragtgt.style.position = "fixed";
    dragtgt.style.left = x + "px";
    dragtgt.style.top = y + "px";
  };
  var dragtgt, clickX, clickY;
})();
