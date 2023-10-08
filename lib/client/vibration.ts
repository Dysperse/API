export function vibrate(time: number) {
  if ("vibrate" in navigator) {
    // navigator.vibrate() is supported
    navigator.vibrate(time);
  }
}
