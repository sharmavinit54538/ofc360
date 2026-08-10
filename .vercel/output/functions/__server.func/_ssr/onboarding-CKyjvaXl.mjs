import { h as createFileRoute, m as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { Q as stringType, X as objectType } from "../_libs/@ai-sdk/gateway+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/onboarding-CKyjvaXl.js
var $$splitComponentImporter = () => import("./onboarding-DBGjkBnm.mjs");
var Route = createFileRoute("/onboarding")({
	validateSearch: objectType({ token: stringType().optional() }),
	head: () => ({ meta: [{ title: "Onboarding — OFC360" }, {
		name: "robots",
		content: "noindex, nofollow"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
