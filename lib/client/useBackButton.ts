import { useEffect } from "react";

/**
 * Overrides the default browser back button
 * @param {Function} callback
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
 * @returns {void}
 */
export const revivalBack = (): void => {
  window.onpopstate = null;
};

/**
 * Custom hook to handle browser back button functionality
 * @param {Function} callback - Function to call when back button is pressed
 * @returns {void}
 */
export const useBackButton = (callback: () => void): void => {
  useEffect(() => {
    neutralizeBack(callback);

    return () => {
      revivalBack();
    };
  }, [callback]);
};
