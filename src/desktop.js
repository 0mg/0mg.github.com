// for IE8
document.createElement("section");
document.createElement("article");
document.createElement("aside");
document.createElement("nav");

// for Mobile
addEventListener("load", function() {
  var e = document.createElement("meta");
  e.name = "viewport";
  e.content = "width=device-width";
  document.head.appendChild(e);
});
