import { YearMonthPair } from "@/lib/types";
import { HelperFunction } from "@/utils/helperFunction";

const baseUrl = import.meta.env.VITE_API_BASE || "";
const MIN_REQUEST_INTERVAL_MS = 300;
const ALL_RATES_CACHE_TTL_MS = 5 * 60 * 1000;

let requestQueue = Promise.resolve();
let lastRequestAt = 0;
let allRatesCache: { data: string; expiresAt: number } | null = null;

// limit the number of requests to the API to avoid rate limiting issues
function enqueueRequest<T>(request: () => Promise<T>): Promise<T> {
	const queuedRequest = requestQueue.then(async () => {
		const waitTime = MIN_REQUEST_INTERVAL_MS - (Date.now() - lastRequestAt);
		if (waitTime > 0) {
			await new Promise(resolve => setTimeout(resolve, waitTime));
		}

		lastRequestAt = Date.now();
		return request();
	});

	requestQueue = queuedRequest.then(() => undefined, () => undefined);
	return queuedRequest;
}

export class Api {
	static async getAllCountryExchangeRate() {
		try {
			if (allRatesCache && allRatesCache.expiresAt > Date.now()) {
				return allRatesCache.data;
			}

			const hour = HelperFunction.getCurrentHour();
			const session = HelperFunction.getCurrentSession(parseInt(hour));
			const res = await enqueueRequest(() => fetch(`${baseUrl}?session=${session}&quote=rm`, {
				headers: {
					Accept: "application/vnd.BNM.API.v1+json",
				}
			}));

			if (!res.ok) {
				throw new Error(`Fail to fetch exchange rate: ${res.status} ${res.statusText}`)
			}

			const dataList = await res.json()
			const data = JSON.stringify(dataList, null, 2)
			allRatesCache = {
				data,
				expiresAt: Date.now() + ALL_RATES_CACHE_TTL_MS,
			};
			// console.log("api data: ", data)
			return data
		} catch (err) {
			console.error(err)
			return null
		}
	}

	static async getHistoricalRates(countryCode: string, targets: YearMonthPair[]) {
		try {
			const hour = HelperFunction.getCurrentHour();
			const session = HelperFunction.getCurrentSession(parseInt(hour));
			const fetchPromises = targets.map(async ({ year, month }) => {
				const url = `${baseUrl}/${countryCode}/year/${year}/month/${month}?session=${session}&quote=rm`
				const res = await enqueueRequest(() => fetch(url, {
					headers: {
						Accept: "application/vnd.BNM.API.v1+json",
					}
				}));

				if (!res.ok) {
					return { year, month, data: { rate: [] } }
				}

				const data = await res.json()
				return { year, month, data: data.data }
			});

			return await Promise.all(fetchPromises);
		} catch (err) {
			console.error(err)
			return null
		}
	}
}

