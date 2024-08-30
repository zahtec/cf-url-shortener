/**
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 */

export default {
	async fetch(request, env, _): Promise<Response> {
		const url = await env.KV.get(new URL(request.url).pathname.split("/")[1] || "undefined");

		return new Response(undefined, {
			headers: {
				Location: url ?? "",
			},
			status: url ? 301 : 404,
		});
	},
} satisfies ExportedHandler<Env>;
