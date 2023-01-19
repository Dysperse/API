/**
 * Overrides the default browser back button
 * @param {any} callback
 * @returns {void}
 */
export const neutralizeBack = (callback: () => void): void => {
  window.history.pushState(null, "", window.location.href);
  window.onpopstate = () => {
    window.history.pushState(null, "", window.location.href);
    callback();
  };
};

/**
 * Restores the default browser back button
 * @returns {any}
 */
export const revivalBack = (): void => {
  window.onpopstate = null;
};
