var dom = {
  id: function id(id) { return document.getElementById(id); },
  q: function q(s) { return document.querySelector(s); },
  qs: function qs(s) { return document.querySelectorAll(s); },
  ce: function ce(s) { return document.createElement(s); },
  ct: function ct(s) { return document.createTextNode(s); },
  cf: function cf() { return document.createDocumentFragment(); }
};
