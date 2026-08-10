import { F as notFound, h as createFileRoute, m as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as posts } from "./blog-data-DcYz3eWl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/blog._slug-DES9n6s3.js
/**
* Centralized SEO constants and helpers for OFC360.
*
* Usage:
*   import { buildMeta, SITE_URL } from "@/lib/seo";
*   head: () => ({ meta: buildMeta({ title: "...", description: "..." }) })
*/
var SITE_URL = "https://www.ofc360.com";
var SITE_NAME = "OFC360";
var DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;
var TWITTER_HANDLE = "@OFC360";
function buildMeta({ title, description, url, ogType = "website", ogImage = DEFAULT_OG_IMAGE, noindex = false }) {
	const fullUrl = url.startsWith("http") ? url : `${SITE_URL}${url.startsWith("/") ? url : `/${url}`}`;
	const fullOgImage = ogImage.startsWith("http") ? ogImage : `${SITE_URL}${ogImage.startsWith("/") ? ogImage : `/${ogImage}`}`;
	const tags = [
		{ title },
		{
			name: "description",
			content: description
		},
		{
			property: "og:title",
			content: title
		},
		{
			property: "og:description",
			content: description
		},
		{
			property: "og:url",
			content: fullUrl
		},
		{
			property: "og:type",
			content: ogType
		},
		{
			property: "og:image",
			content: fullOgImage
		},
		{
			property: "og:image:width",
			content: "1200"
		},
		{
			property: "og:image:height",
			content: "630"
		},
		{
			property: "og:site_name",
			content: SITE_NAME
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		},
		{
			name: "twitter:site",
			content: TWITTER_HANDLE
		},
		{
			name: "twitter:title",
			content: title
		},
		{
			name: "twitter:description",
			content: description
		},
		{
			name: "twitter:image",
			content: fullOgImage
		}
	];
	if (noindex) tags.push({
		name: "robots",
		content: "noindex, nofollow"
	});
	return tags;
}
function buildCanonical(path) {
	return [{
		rel: "canonical",
		href: path.startsWith("http") ? path : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`
	}];
}
var $$splitComponentImporter = () => import("./blog._slug-DfY4f3h9.mjs");
var $$splitNotFoundComponentImporter = () => import("./blog._slug-D4RDK6gj.mjs");
var Route = createFileRoute("/blog/$slug")({
	loader: ({ params }) => {
		const post = posts.find((p) => p.slug === params.slug);
		if (!post) throw notFound();
		return { post };
	},
	head: ({ loaderData }) => {
		if (!loaderData) return {
			meta: [],
			links: []
		};
		const { post } = loaderData;
		const articleJsonLd = {
			"@context": "https://schema.org",
			"@type": "Article",
			headline: post.title,
			description: post.excerpt,
			author: {
				"@type": "Person",
				name: post.author
			},
			datePublished: post.date,
			publisher: {
				"@type": "Organization",
				name: "EquinoxSphere Technologies",
				logo: {
					"@type": "ImageObject",
					url: `${SITE_URL}/logo.png`
				}
			},
			url: `${SITE_URL}/blog/${post.slug}`
		};
		return {
			meta: buildMeta({
				title: `${post.title} — OFC360 Blog`,
				description: post.excerpt,
				url: `/blog/${post.slug}`,
				ogType: "article"
			}),
			links: buildCanonical(`/blog/${post.slug}`),
			scripts: [{
				type: "application/ld+json",
				children: JSON.stringify(articleJsonLd)
			}]
		};
	},
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { TWITTER_HANDLE as a, SITE_URL as i, Route as n, buildCanonical as o, SITE_NAME as r, buildMeta as s, DEFAULT_OG_IMAGE as t };
