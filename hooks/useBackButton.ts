let callback: (() => void) | null = null;

export const neutralizeBack = (cb: () => void): void => {
  callback = cb;
  window.onpopstate = handlePopState;
};

export const revivalBack = () => {
  window.onpopstate = null;
  callback = null;
};

function handlePopState() {
  callback && callback();
}
