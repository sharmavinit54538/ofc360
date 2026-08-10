import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ThemeProvider-6IpgR288.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ThemeContext = (0, import_react.createContext)({
	theme: "dark",
	themeMode: "dark",
	setTheme: () => {},
	setThemeMode: () => {},
	toggle: () => {}
});
function getSavedMode() {
	if (typeof window === "undefined") return "system";
	try {
		const stored = localStorage.getItem("theme");
		if (stored === "dark" || stored === "light") return stored;
		return "system";
	} catch {
		return "system";
	}
}
function resolveTheme(mode) {
	if (mode === "dark" || mode === "light") return mode;
	if (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
	return "light";
}
function ThemeProvider({ children }) {
	const [themeMode, setThemeModeState] = (0, import_react.useState)(getSavedMode);
	const [theme, setThemeState] = (0, import_react.useState)(() => resolveTheme(getSavedMode()));
	const applyTheme = (mode) => {
		const activeTheme = resolveTheme(mode);
		setThemeModeState(mode);
		setThemeState(activeTheme);
		if (typeof window !== "undefined") {
			document.documentElement.classList.toggle("dark", activeTheme === "dark");
			try {
				if (mode === "system") localStorage.removeItem("theme");
				else localStorage.setItem("theme", mode);
			} catch (e) {
				console.error("Failed to update theme in localStorage:", e);
			}
		}
	};
	(0, import_react.useEffect)(() => {
		applyTheme(getSavedMode());
	}, []);
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		const handleSystemChange = () => {
			if (getSavedMode() === "system") applyTheme("system");
		};
		mediaQuery.addEventListener("change", handleSystemChange);
		return () => mediaQuery.removeEventListener("change", handleSystemChange);
	}, []);
	const toggle = () => {
		applyTheme(theme === "dark" ? "light" : "dark");
	};
	const setTheme = (newTheme) => {
		applyTheme(newTheme);
	};
	const setThemeMode = (mode) => {
		applyTheme(mode);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeContext.Provider, {
		value: {
			theme,
			themeMode,
			setTheme,
			setThemeMode,
			toggle
		},
		children
	});
}
var useTheme = () => (0, import_react.useContext)(ThemeContext);
//#endregion
export { useTheme as n, ThemeProvider as t };
