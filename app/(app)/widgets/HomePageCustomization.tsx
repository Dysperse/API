"use client";
import { cloneElement } from "react";

export function HomePageCustomization({ children }) {
  const trigger = cloneElement(children, {});

  return <>{trigger}</>;
}
