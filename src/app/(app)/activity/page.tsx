"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ActivityRoute() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/archive?tab=activity");
  }, [router]);

  return null;
}
