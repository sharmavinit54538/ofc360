import "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
var badgeVariants = cva("inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
	variants: { variant: {
		default: "border-transparent bg-primary/15 text-primary border-primary/20",
		secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
		destructive: "border-transparent bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/20",
		outline: "border-border text-foreground bg-background/50",
		success: "border-transparent bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
		warning: "border-transparent bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/20",
		info: "border-transparent bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/20"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
//#endregion
export { Badge as t };
