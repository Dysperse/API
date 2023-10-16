import Router, { NextRouter } from "next/navigation";

export function handleBack(router: NextRouter) {
  if (window.history.length <= 2 && document.referrer === "") {
    router.push("/");
    return;
  }

  // router.
  Router.back();
}
