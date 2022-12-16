window.addEventListener("load", () => {
  setTimeout(() => {
    history.pushState(null, null, location.href);
    window.onpopstate = function () {
      history.go(1);
    };
  }, 2000);
});

document.addEventListener("focus", function (e) {
  e.preventDefault();
});
