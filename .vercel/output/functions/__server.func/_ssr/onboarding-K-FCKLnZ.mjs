import { h as createFileRoute, m as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { Q as stringType, X as objectType } from "../_libs/@ai-sdk/gateway+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/onboarding-K-FCKLnZ.js
var $$splitComponentImporter = () => import("./onboarding-BUOis8nQ.mjs");
var Route = createFileRoute("/onboarding")({
	validateSearch: objectType({ token: stringType().optional() }),
	head: () => ({ meta: [{ title: "Onboarding — ofc360" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
