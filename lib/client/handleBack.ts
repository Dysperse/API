import { NextRouter } from "next/router";

export function handleBack(router: NextRouter) {
  if (window.history.length <= 2 && document.referrer === "") {
    router.push("/");
    return;
  }

  router.back();
}
