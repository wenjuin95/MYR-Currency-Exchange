import type { VercelRequest, VercelResponse } from "../src/lib/types";

const BNM_API_URL = "https://api.bnm.gov.my";
const DEFAULT_ACCEPT = "application/vnd.BNM.API.v1+json";

export default async function handler(req: VercelRequest, res: VercelResponse) {
	if (req.method !== "GET") {
		return res.status(405).setHeader("Allow", "GET").json({ error: "Method not allowed" });
	}

	if (!req.url) {
		return res.status(400).json({ error: "Missing request URL" });
	}

	try {
		// vercel.json puts the requested BNM path in the "path" query parameter.
		const requestUrl = new URL(req.url, "https://localhost");
		const bnmPath = requestUrl.searchParams.get("path") || "";
		requestUrl.searchParams.delete("path");

		// Forward the path and remaining query parameters to BNM.
		const bnmUrl = `${BNM_API_URL}/${bnmPath}${requestUrl.search}`;
		const acceptHeader = req.headers.accept;
		const accept = Array.isArray(acceptHeader) ? acceptHeader[0] : acceptHeader;
		const bnmResponse = await fetch(bnmUrl, {
			headers: {
				Accept: accept || DEFAULT_ACCEPT,
			},
		});
		const responseBody = await bnmResponse.json();

		return res.status(bnmResponse.status).setHeader(
			"Content-Type",
			bnmResponse.headers.get("content-type") || "application/json",
		).json(responseBody);
	} catch {
		return res.status(502).json({ error: "Unable to reach Bank Negara Malaysia API" });
	}
}
