/**
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 */

import { extractOpenGraph } from "@devmehq/open-graph-extractor";

export default {
	async fetch(request, env, _): Promise<Response> {
		const url = await env.KV.get(new URL(request.url).pathname.split("/")[1] || "undefined");

		try {
			if (!url) throw new Error();

			const html = await fetch(url).then((res) => res.text());
			const img = (
				(await extractOpenGraph(html)) as {
					ogImage?: {
						url: string;
						width: string;
						height: string;
						type: string;
					};
				}
			).ogImage;

			return new Response(
				`<html><head>
                <meta property="og:image" name="og:image" content="${img?.url}" />
                <meta property="og:image:type" content="${img?.type}" />
                <meta property="og:image:width" content="${img?.width}" />
                <meta property="og:image:height" content="${img?.height}" />
                </head></html>`,
				{
					headers: {
						Location: url,
					},
					status: 301,
				}
			);
		} catch {
			if (url) return Response.redirect(url, 301);
			else
				return new Response(undefined, {
					status: 404,
				});
		}
	},
} satisfies ExportedHandler<Env>;
