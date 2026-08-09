import { F as notFound, h as createFileRoute, m as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as posts } from "./blog-data-DcYz3eWl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/blog._slug-CsVGCCRM.js
var $$splitComponentImporter = () => import("./blog._slug-Kuk5T56A.mjs");
var $$splitNotFoundComponentImporter = () => import("./blog._slug-BR7Rx7Wp.mjs");
var Route = createFileRoute("/blog/$slug")({
	loader: ({ params }) => {
		const post = posts.find((p) => p.slug === params.slug);
		if (!post) throw notFound();
		return { post };
	},
	head: ({ loaderData }) => ({
		meta: loaderData ? [
			{ title: `${loaderData.post.title} — ofc360 Blog` },
			{
				name: "description",
				content: loaderData.post.excerpt
			},
			{
				property: "og:title",
				content: loaderData.post.title
			},
			{
				property: "og:description",
				content: loaderData.post.excerpt
			},
			{
				property: "og:type",
				content: "article"
			},
			{
				property: "og:url",
				content: `/blog/${loaderData.post.slug}`
			}
		] : [],
		links: loaderData ? [{
			rel: "canonical",
			href: `/blog/${loaderData.post.slug}`
		}] : []
	}),
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
