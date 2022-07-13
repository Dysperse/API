function testSameOrigin(url) {
  var loc = window.location,
    a = document.createElement("a");

  a.href = url;

  return (
    a.hostname == loc.hostname &&
    a.port == loc.port &&
    a.protocol == loc.protocol
  );
}

export const neutralizeBack = (callback: any) => {
  window.history.pushState(null, "", window.location.href);
  window.onpopstate = () => {
    window.history.pushState(null, "", window.location.href);
    callback();
  };
};
export const revivalBack = () => {};
