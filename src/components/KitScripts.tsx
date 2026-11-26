"use client";

import { useEffect } from "react";

export function KitScripts() {
  useEffect(() => {
    const html = document.documentElement;
    html.classList.add("m-enter", "mo-js");

    const loadScript = (src: string, isModule: boolean) =>
      new Promise<void>((resolve) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        const s = document.createElement("script");
        s.src = src;
        if (isModule) s.type = "module";
        s.onload = () => resolve();
        s.onerror = () => resolve();
        document.body.appendChild(s);
      });

    let cancelled = false;
    (async () => {
      await loadScript("/assets/backgrounds/backgrounds.js", false);
      if (cancelled) return;
      await Promise.all([
        loadScript("/assets/system.js", true),
        loadScript("/assets/motion/motion.js", true),
        loadScript("/assets/layout/layout.js", true),
        loadScript("/assets/diagrams/mount.js", true),
      ]);
      html.classList.add("m-enter-done", "mo-safe");
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
