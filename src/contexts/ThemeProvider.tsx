import { useEffect } from "react";
import { useTheme } from "../hooks/useTheme";

const getSystemTheme = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme();

  useEffect(() => {
    const root = document.documentElement;

    const appliedTheme = theme === "system" ? getSystemTheme() : theme;

    root.classList.remove("light", "dark");
    root.classList.add(appliedTheme);
  }, [theme]);

  return <>{children}</>;
};
