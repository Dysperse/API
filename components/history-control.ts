/**
 * Overrides the default browser back button
 * @param {any} callback
 * @returns {any}
 */
export const neutralizeBack = (callback: any) => {
  window.history.pushState(null, "", window.location.href);
  window.onpopstate = () => {
    window.history.pushState(null, "", window.location.href);
    callback();
  };
};
export const revivalBack = () => {};
