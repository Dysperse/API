export function debounce(func: (...args: any[]) => void, delay: number) {
  let timeout;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

export let openSpotlight = () => {};

export default function Spotlight() {
  return <></>;
}
