"use client";

export function useRouterBack(router) {
  if (window.history.length <= 2 && document.referrer === "") {
    router.push("/");
    return;
  }

  router.back();
}
