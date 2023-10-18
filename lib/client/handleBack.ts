"use client";

export function handleBack(router) {
  if (window.history.length <= 2 && document.referrer === "") {
    router.push("/");
    return;
  }

  router.back();
}
