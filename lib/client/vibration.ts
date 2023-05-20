export function vibrate(time: number) {
  if ("vibrate" in navigator) {
    // navigator.vibrate() is supported
    navigator.vibrate(time);
  } else {
    // navigator.vibrate() is not supported
    console.log("Vibration not supported");
  }
}
