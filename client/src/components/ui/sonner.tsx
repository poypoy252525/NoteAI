import { useEffect, useMemo, useRef, useState } from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

function useDarkClassTheme(): "light" | "dark" {
  const [isDark, setIsDark] = useState<boolean>(() =>
    typeof document !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : false
  );

  const observerRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    const root = document.documentElement;

    const update = () => {
      setIsDark(root.classList.contains("dark"));
    };

    // Initial sync
    update();

    // Watch for class changes on <html>
    observerRef.current = new MutationObserver(update);
    observerRef.current.observe(root, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Also listen to storage events (in case theme toggled in another tab)
    const onStorage = (e: StorageEvent) => {
      if (e.key === "theme") update();
    };
    window.addEventListener("storage", onStorage);

    return () => {
      observerRef.current?.disconnect();
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return isDark ? "dark" : "light";
}

const Toaster = ({ ...props }: ToasterProps) => {
  const theme = useDarkClassTheme();

  const style = useMemo(
    () =>
      ({
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)",
      } as React.CSSProperties),
    []
  );

  return (
    <Sonner theme={theme} className="toaster group" style={style} {...props} />
  );
};

export { Toaster };
