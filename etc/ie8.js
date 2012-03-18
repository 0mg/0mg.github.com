if (!Event.prototype.preventDefault) {
  Event.prototype.preventDefault = function() {
    this.returnValue = false;
  };
}
if (!window.addEventListener) {
  window.addEventListener = function(type, f) {
    return this.attachEvent("on" + type, f);
  };
}
if (!document.addEventListener) {
  document.addEventListener = window.addEventListener;
}
if (!Element.prototype.addEventListener) {
  Element.prototype.addEventListener = window.addEventListener;
}
if (!("textContent" in document.createElement("p"))) {
  Object.defineProperty(Element.prototype, "textContent", {
    get: function() {
      return this.innerText;
    },
    set: function(s) {
      return this.innerText = s;
    }
  });
}
if (!document.createElement("p").classList) {
  Object.defineProperty(Element.prototype, "classList", {
    get: function() {
      var it = this;
      var classes = it.className.replace(/\s+/g, " ").replace(/^ +| +$/g, "");
      return {
        contains: function(s) {
          return (" " + classes + " ").indexOf(" " + s + " ") >= 0;
        },
        add: function(s) {
          if (!this.contains(s)) it.className += " " + s;
        },
        remove: function(s) {
          if (this.contains(s)) {
            it.className = (" " + classes + " ").
              replace(RegExp(" " + s + "(?= )", "g"), "").
              replace(/^ +| +$/g, "");
          }
        },
        toString: function() {
          return it.className;
        }
      };
    }
  });
}
if (!Array.prototype.forEach) {
  Array.prototype.forEach = function(f) {
    for (var i = 0; i < this.length; ++i) {
      f(this[i], i, this);
    }
  };
}
if (!Array.prototype.map) {
  Array.prototype.map = function(f) {
    var a = [];
    for (var i = 0; i < this.length; ++i) {
      a[i] = f(this[i], i, this);
    }
    return a;
  };
}
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function(v) {
    for (var i = 0; i < this.length; ++i) {
      if (this[i] === v) return i;
    }
    return -1;
  };
}
if (!Object.getOwnPropertyNames) {
  Object.getOwnPropertyNames = function() { return []; };
}
if (!window.console) {
  console = {log:function(){}};
}
