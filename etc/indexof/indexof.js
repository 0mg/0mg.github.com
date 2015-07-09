"use strict";
//
// IE8
//
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
if (!("textContent" in document.createElement("p"))) {
  Object.defineProperty(Element.prototype, "textContent", {
    get: function() { return this.innerText; },
    set: function(s) { return this.innerText = s; }
  });
}
if (!Array.prototype.forEach) {
  Array.prototype.forEach = function(f) {
    for (var i = 0, z = this.length; i < z; ++i) {
      f(this[i], i, this);
    }
  };
}
//
// JSONP
//
var getJSONP = (function() {
  var hash = {};
  hash.de = {
    __: "_",
    _s: "/",
    _d: ".",
    _c: ":",
    _m: "-"
  };
  hash.en = (function(src) {
    var dst = {};
    for (var i in src) {
      dst[src[i]] = i;
    }
    return dst;
  })(hash.de);
  hash.make = function makeHash(url) {
    return url.replace(/./g, function(c) {
      return hash.en[c] || c;
    });
  };
  return function getJSONP(url, callback) {
    var script = document.createElement("script");
    var scriptParent = document.querySelector("head");
    var cbName = hash.make(url);
    script.src = url + "?callback=" + cbName;
    window[cbName] = function(json) {
      callback(json);
      scriptParent.removeChild(script);
      window[cbName] = null;
    };
    scriptParent.appendChild(script);
  };
})();
//
// make data by URL
//
function getURLKeys(page_url) {
  var keys;
  var ctx = page_url.match(getURLKeys.re);
  if (ctx) {
    keys = {
      repo: ctx[1],
      user: ctx[2],
      path: ctx[3] || ""
    };
  } else {
    keys = null;
  }
  return keys;
}
getURLKeys.re = /^https?:\/\/(([-a-zA-Z0-9]+)\.github\.com)(\/.+?)?\/?$/;
function getPageURL(api_url) {
  var prefix = "https://github.com/";
  var ctx = api_url.slice(prefix.length);
  var dirs = ctx.split("/");

  var user = dirs[0];
  var pageroot = dirs[1];
  var gittype = dirs[2];
  var branch = dirs[3];
  var pagepath = "/" + dirs.slice(4).join("/");
  var page_url = "http://" + pageroot + pagepath +
    (gittype === "tree" ? "/" : "");
  return page_url;
}
//
// JSON => HTMLElements
//
function htmlifyFile(file) {
  var isdir = file.type === "dir";
  var page_url = getPageURL(file.html_url);
  var li = document.createElement("li");
  var a = document.createElement("a");
  li.className = "gitfile " + file.type;
  a.href = (isdir ? "?" : "") + page_url;
  a.textContent = file.name + (isdir ? "/" : "");
  li.appendChild(a);
  return li;
}
//
// main()
//
function onGotJSON(json) {
  var hpmax = json.meta["X-RateLimit-Limit"];
  var hp = json.meta["X-RateLimit-Remaining"];
  var keys;
  if (hp > 0) {
    [].forEach.call(json.data, function(o) {
      main.appendChild(htmlifyFile(o));
    });
  } else {
    keys = getURLKeys(location.search.slice(1));
    location.href = "https://github.com/" + keys.user + "/" +
      keys.repo + "/tree/master" + keys.path;
  }
  document.getElementById("meta").textContent =
    "\u2665API REST: " + hp + "/" + hpmax;
  document.getElementById("json").textContent = JSON.stringify(json);
}
addEventListener("load", function() {
  var api_url;
  var q = location.search.slice(1) || location.protocol + "//" + location.host;
  var keys = getURLKeys(q);
  var nd = {
    title: document.createElement("h1"),
    meta: document.createElement("div"),
    main: document.createElement("ul"),
    json: document.createElement("textarea")
  };
  for (var i in nd) {
    nd[i].id = i;
    document.body.appendChild(nd[i]);
  }
  if (keys) {
    api_url = "https://api.github.com/repos/" + keys.user +
      "/" + keys.repo + "/contents" + keys.path;
    getJSONP(api_url, onGotJSON);
    document.getElementById("meta").textContent = "loading..";
    document.getElementById("title").textContent =
      document.title = "Index of " + keys.repo + keys.path;
  } else {
    document.getElementById("meta").textContent =
      "location.search must be ?" + getURLKeys.re;
  }
}, true);
//
// redirect to location.href + "?" + location.href
//
if (location.search === "") {
  location.replace(location.href + "?" +
    location.href.replace(/^(https?:\/\/[-a-zA-Z0-9]+\.github\.)com/, "$1io")
  );
}
