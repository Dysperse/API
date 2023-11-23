"use client";

import { NoSsr } from "@mui/material";
import airQuality from "./tasks/Layout/widgets/airQuality.json";
import { Home } from "./widgets/Home";
import HomePageLoading from "./widgets/loading";

export function getAirQualityInfo(index) {
  const result = airQuality.find(
    (category) => index >= category.index.min && index <= category.index.max
  );

  return result || null; // Return null if no matching category is found
}

export function hslToHex([h, s, l]) {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0"); // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export default function Page() {
  return (
    <NoSsr fallback={<HomePageLoading />}>
      <Home />
    </NoSsr>
  );
}
