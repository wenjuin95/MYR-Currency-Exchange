type VercelRequest = {
	method?: string;
	url?: string;
	headers: Record<string, string | string[] | undefined>;
};

type VercelResponse = {
	status: (code: number) => VercelResponse;
	setHeader: (name: string, value: string) => VercelResponse;
	json: (body: unknown) => void;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
	if (req.method !== "GET") {
		return res.status(405).setHeader("Allow", "GET").json({ error: "Method not allowed" });
	}

	const requestUrl = new URL(req.url || "/", "https://localhost");
	const upstreamPath = requestUrl.searchParams.get("path") || "";
	requestUrl.searchParams.delete("path");
	const upstreamUrl = `https://api.bnm.gov.my/${upstreamPath}${requestUrl.search}`;

	try {
		const acceptHeader = req.headers.accept;
		const accept = Array.isArray(acceptHeader) ? acceptHeader[0] : acceptHeader;
		const upstreamResponse = await fetch(upstreamUrl, {
			headers: {
				Accept: accept || "application/vnd.BNM.API.v1+json",
			},
		});
		const body = await upstreamResponse.json();

		res.status(upstreamResponse.status).setHeader(
			"Content-Type",
			upstreamResponse.headers.get("content-type") || "application/json",
		).json(body);
	} catch {
		res.status(502).json({ error: "Unable to reach Bank Negara Malaysia API" });
	}
}