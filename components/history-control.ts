export const neutralizeBack = (callback: any) => {
  window.history.pushState(null, "", window.location.href);
  window.onpopstate = () => {
    window.history.pushState(null, "", window.location.href);
    callback();
  };
};
export const revivalBack = () => {
  (window as any).onpopstate = undefined;
  window.history.pushState(null, "", window.location.href);
};
