"use client";

export const recentlyAccessed = {
  set: (t) => localStorage.setItem("recentlyAccessedTasks", JSON.stringify(t)),
  get: () => {
    try {
      const d = JSON.parse(
        localStorage.getItem("recentlyAccessedTasks") || "{}"
      );
      return d;
    } catch (e) {
      return {};
    }
  },
  clear: () => localStorage.removeItem("recentlyAccessedTasks"),
};
