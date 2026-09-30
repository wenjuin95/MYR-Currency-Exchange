import { YearMonthPair } from "@/lib/types";
import { HelperFunction } from "@/utils/helperFunction";

const baseUrl = import.meta.env.VITE_API_BASE || "/bnm-api/public/exchange-rate";

export class Api {
	static async getAllCountryExchangeRate() {
		try {
			const hour = HelperFunction.getCurrentHour();
			const session = HelperFunction.getCurrentSession(parseInt(hour));
			const res = await fetch(`${baseUrl}?session=${session}&quote=rm`, {
				headers: {
					Accept: "application/vnd.BNM.API.v1+json",
				}
			})

			if (!res.ok) {
				throw new Error(`Fail to fetch exchange rate: ${res.status} ${res.statusText}`)
			}

			const dataList = await res.json()
			const data = JSON.stringify(dataList, null, 2)
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
				const res = await fetch(url, {
					headers: {
						Accept: "application/vnd.BNM.API.v1+json",
					}
				})

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

