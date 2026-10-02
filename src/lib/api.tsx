import { YearMonthPair } from "@/lib/types";

const baseUrl = "https://api.frankfurter.dev/v2";

export class Api {
    static async getAllCountryExchangeRate() {
        try {
            // Use v2/rates, base=MYR, and pin the provider to "bnm"
            const res = await fetch(`${baseUrl}/rates?base=MYR&providers=bnm`);

            if (!res.ok) {
                throw new Error(`Fail to fetch exchange rate: ${res.status} ${res.statusText}`);
            }

            // In v2, this returns a flat array of objects:
            // [{ date: "...", base: "MYR", quote: "USD", rate: 0.23, providers: ["BNM"] }, ...]
            const dataList = await res.json();
            return JSON.stringify(dataList, null, 2);
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    static async getHistoricalRates(countryCode: string, targets: YearMonthPair[]) {
        try {
            const fetchPromises = targets.map(async ({ year, month }) => {
                const formattedMonth = String(month).padStart(2, '0');
                const lastDay = new Date(year, month, 0).getDate();

                const startDate = `${year}-${formattedMonth}-01`;
                const endDate = `${year}-${formattedMonth}-${lastDay}`;
                const quote = countryCode.toUpperCase();

                // Request the daily series for this currency and month.
                const params = new URLSearchParams({
                    base: "MYR",
                    quotes: quote,
                    from: startDate,
                    to: endDate,
                    providers: "bnm",
                });
                const url = `${baseUrl}/rates?${params}`;
                const res = await fetch(url);

                if (!res.ok) {
                    return { year, month, data: [] };
                }

                // Returns an array of daily rates for the specified month from BNM
                const data = await res.json();
                return { year, month, data };
            });

            return await Promise.all(fetchPromises);
        } catch (err) {
            console.error(err);
            return null;
        }
    }
}
