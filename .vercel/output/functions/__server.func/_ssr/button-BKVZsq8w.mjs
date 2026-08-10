import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { h as Slot, y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/button-BKVZsq8w.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium cursor-pointer transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md",
			destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 hover:shadow-md",
			outline: "border border-input bg-background/80 shadow-xs hover:bg-accent hover:text-accent-foreground hover:border-foreground/20",
			secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
			ghost: "hover:bg-accent/80 hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline",
			success: "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 hover:shadow-md"
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-lg px-3 text-xs",
			lg: "h-10 rounded-lg px-6 text-sm font-semibold",
			icon: "h-9 w-9 rounded-lg"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
//#endregion
export { buttonVariants as n, Button as t };
