window.addEventListener("load", () => {
  setTimeout(() => {
    history.pushState(null, null, location.href);
    window.onpopstate = function () {
      history.go(1);
    };
  }, 2000);
});

document.addEventListener("DOMContentLoaded", () => {
  // we can move only if we are not in a browser's tab
  let isBrowser = matchMedia("(display-mode: browser)").matches;
  if (!isBrowser) {
    window.resizeTo(1000, 800);
    const width = document.documentElement.clientWidth;
    const height = document.documentElement.clientHeight;
    window.moveTo(
      (screen.availWidth - width) / 2,
      (screen.availHeight - height) / 2
    );
  }
});
