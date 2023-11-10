"use client";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export default function Modal() {
  const router = useRouter();

  const onDismiss = useCallback(() => {
    router.back();
  }, [router]);

  return <></>;
}
