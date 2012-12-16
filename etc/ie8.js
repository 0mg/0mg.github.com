if (!Event.prototype.preventDefault) {
  Object.defineProperty(Event.prototype, "preventDefault", {
    get: function() {
      return function() {
        this.returnValue = false;
      }
    }
  });
}
if (!("target" in Event.prototype)) {
  Object.defineProperty(Event.prototype, "target", {
    get: function() {
      return this.srcElement;
    }
  });
}
if (!window.addEventListener) {
  Object.defineProperty(window, "addEventListener", {
    get: function() {
      return function(type, f) {
        return this.attachEvent("on" + type, f);
      };
    }
  });
}
if (!document.addEventListener) {
  Object.defineProperty(document, "addEventListener", {
    get: function() {
      return window.addEventListener;
    }
  });
}
if (!Element.prototype.addEventListener) {
  Object.defineProperty(Element.prototype, "addEventListener", {
    get: function() {
      return window.addEventListener;
    }
  });
}
if (!window.removeEventListener) {
  Object.defineProperty(window, "removeEventListener", {
    get: function() {
      return function(type, f) {
        return this.detachEvent("on" + type, f);
      };
    }
  });
}
if (!document.removeEventListener) {
  Object.defineProperty(document, "removeEventListener", {
    get: function() {
      return window.removeEventListener;
    }
  });
}
if (!Element.prototype.removeEventListener) {
  Object.defineProperty(Element.prototype, "removeEventListener", {
    get: function() {
      return window.removeEventListener;
    }
  });
}
if (!("textContent" in document.createElement("p"))) {
  Object.defineProperty(Element.prototype, "textContent", {
    get: function() { return this.innerText; },
    set: function(s) { return this.innerText = s; }
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
    for (var i = 0, z = this.length; i < z; ++i) {
      f(this[i], i, this);
    }
  };
}
if (!Array.prototype.map) {
  Array.prototype.map = function(f) {
    for (var a = [], i = 0, z = this.length; i < z; ++i) {
      a[i] = f(this[i], i, this);
    }
    return a;
  };
}
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function(v) {
    for (var i = 0, z = this.length; i < z; ++i) {
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
