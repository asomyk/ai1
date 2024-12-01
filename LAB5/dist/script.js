/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/*!*******************!*\
  !*** ./script.ts ***!
  \*******************/


var msg = "Hello!";
alert(msg);
var styles = {
  "Różowy styl": "css/page1.css",
  "Mroczny styl": "css/page2.css",
  "Patelowy styl": "css/page3.css"
};
// Aktualnie załadowany styl
var currentStyle = null;
function switchStyle(styleName) {
  var head = document.querySelector("head");
  if (!head) return;
  var oldLink = document.getElementById("dynamic-style");
  if (oldLink) {
    head.removeChild(oldLink);
  }
  var newLink = document.createElement("link");
  newLink.id = "dynamic-style";
  newLink.rel = "stylesheet";
  newLink.href = styles[styleName];
  head.appendChild(newLink);
  currentStyle = styleName;
}
function generateStyleLinks() {
  var container = document.querySelector(".link");
  if (!container) return;
  container.innerHTML = "";
  var _loop = function _loop(styleName) {
    var link = document.createElement("a");
    link.href = "#";
    link.textContent = styleName;
    link.addEventListener("click", function () {
      return switchStyle(styleName);
    });
    var paragraph = document.createElement("p");
    paragraph.appendChild(link);
    container.appendChild(paragraph);
  };
  for (var styleName in styles) {
    _loop(styleName);
  }
}
// Inicjalizacja
document.addEventListener("DOMContentLoaded", function () {
  generateStyleLinks();
  switchStyle("Różowy styl"); // Domyślny styl
});
/******/ })()
;