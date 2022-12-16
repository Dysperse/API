window.addEventListener("load", () => {
  setTimeout(() => {
    history.pushState(null, null, location.href);
    window.onpopstate = function () {
      history.go(1);
    };
  }, 2000);
});

document.addEventListener("DOMContentLoaded", (event) => {
  // we can move only if we are not in a browser's tab
  let isBrowser = matchMedia("(display-mode: browser)").matches;
  if (!isBrowser) {
    window.moveTo(16, 16);
    window.resizeTo(800, 600);
  }
});
