// add site navigation link
window.addEventListener("load", function() {
  var nav = document.createElement("nav");
  nav.style.display = "block";
  nav.style.position = "fixed";
  nav.style.right = "0";
  nav.style.bottom = "0";
  nav.style.padding = "0.3ex";
  nav.style.opacity = "0.5";
  var a = document.createElement("a");
  a.style.background = "white";
  a.style.color = "blue";
  a.href = "/";
  a.textContent = "home";
  nav.appendChild(a);
  document.body.appendChild(nav);
});
