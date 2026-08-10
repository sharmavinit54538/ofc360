import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Theme = "dark" | "light";
export type ThemeMode = "dark" | "light" | "system";

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  setTheme: (theme: Theme) => void;
  setThemeMode: (mode: ThemeMode) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  themeMode: "dark",
  setTheme: () => {},
  setThemeMode: () => {},
  toggle: () => {},
});

function getSavedMode(): ThemeMode {
  if (typeof window === "undefined") return "system";
  try {
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || stored === "light") return stored;
    return "system";
  } catch {
    return "system";
  }
}

function resolveTheme(mode: ThemeMode): Theme {
  if (mode === "dark" || mode === "light") return mode;
  if (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(getSavedMode);
  const [theme, setThemeState] = useState<Theme>(() => resolveTheme(getSavedMode()));

  const applyTheme = (mode: ThemeMode) => {
    const activeTheme = resolveTheme(mode);
    setThemeModeState(mode);
    setThemeState(activeTheme);

    if (typeof window !== "undefined") {
      const root = document.documentElement;
      root.classList.toggle("dark", activeTheme === "dark");

      try {
        if (mode === "system") {
          localStorage.removeItem("theme");
        } else {
          localStorage.setItem("theme", mode);
        }
      } catch (e) {
        console.error("Failed to update theme in localStorage:", e);
      }
    }
  };

  useEffect(() => {
    const initialMode = getSavedMode();
    applyTheme(initialMode);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemChange = () => {
      if (getSavedMode() === "system") {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleSystemChange);
    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, []);

  const toggle = () => {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
  };

  const setTheme = (newTheme: Theme) => {
    applyTheme(newTheme);
  };

  const setThemeMode = (mode: ThemeMode) => {
    applyTheme(mode);
  };

  return (
    <ThemeContext.Provider value={{ theme, themeMode, setTheme, setThemeMode, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
