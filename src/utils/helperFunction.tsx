import { useState } from "react";
import { Api } from "@/lib/api";
import { currencyToCountry, countryNames, per100UnitCurrencies, use1000units, use100units } from "@/lib/country_code";
import { HistoricalRateData, RateEntry, YearMonthPair, Timeframe, FormattedCurrency } from "@/lib/types"
import * as Flags from "country-flag-icons/react/1x1";

	interface CountryFlagProps {
		currencyCode: string
		className?: string
	}

export class HelperFunction {
	/**
	 * Calculate required months dynamically
	 * @param range Timeframe selected by the user
	 * @return the list of year pair need for the selected timeframe
	 * @note "monthsToGoBack = 2" => prevent 7D at the beginning of the month and there's no data for the current month
	 * @note loop backward form today month to generate the list
	 * @note reverse to have the oldest month first
	*/
	static getRequiredMonths(range: Timeframe): YearMonthPair[] {
		const targets: YearMonthPair[] = [];
		const currentDate = new Date();
		let monthsToGoBack = 1;
		switch (range) {
			case "7D":
				monthsToGoBack = 2;
				break;
			case "1M":
				monthsToGoBack = 2;
				break;
			case "5M":
				monthsToGoBack = 5;
				break;
			case "1Y":
				monthsToGoBack = 12;
				break;
		}
		for (let i = 0; i < monthsToGoBack; i++) {
			const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
			targets.push({
				year: d.getFullYear(),
				month: d.getMonth() + 1,
			});
		}
		return targets.reverse();
	}

	/**
	 * process data for 7 days since data is provice a monthly basic
	 * @param data the list of monthly data provided by the api
	 * @return the list of monthly data with only 7 days if the timeframe is 7D
	 * @note filter out empty month first so we only look at month with real data
	 * @note flatten all the valid month into a single array of daily data, then slice the last 7 days for the chart
	 * @note "....rate.slice(-7)" => take the latest month with data and slice the last 7 days for the chart
	*/
	static processDataFor7D(data: HistoricalRateData[]): HistoricalRateData[] {
		const validMonth = data.filter(monthObj => monthObj.data.length > 0);
		if (validMonth.length === 0) return [];
		const allFlattenedRates = validMonth.flatMap(monthObj => monthObj.data);
		const latest7Days = allFlattenedRates.slice(-7);
		const latestActiveMonth = validMonth[validMonth.length - 1];
		if (latestActiveMonth) {
			return [{
				...latestActiveMonth,
				data: latest7Days,
			}];
		}
		return [];
	}

	/**
	 * Fetch and format into country name, currency and rate for all countries
	 * @return the list of all country with their currency code and exchange rate
	 * @note call the core api function to get the raw data, then loop through and build the clean layout your UI components want
	 * @note use the country code to get the country name from the countryNames mapping file
	 * @note divide 100 because some country have their rate based on 100 unit instead of 1 unit
	 * @note check 100 unit or 1000 unit currency and adjust the rate accordingly for better display
	 * @note invert the MYR-base rate so the UI can display the value of one
	 *       foreign-currency unit in MYR
	*/
	static async getAllCountryCurrencyAndRate(): Promise<FormattedCurrency[]> {
		try {
			const exchangeRateData = await Api.getAllCountryExchangeRate();
			if (!exchangeRateData) return [];

			const exchangeRateList = typeof exchangeRateData === "string"
				? JSON.parse(exchangeRateData)
				: exchangeRateData;

			if (!Array.isArray(exchangeRateList)) {
				return [];
			}

			return exchangeRateList
				.filter((item: RateEntry) => item.quote !== "MYR")
				.map((item: RateEntry) => {
					const code = item.quote || "";
					let middleRate = item.rate ? (1 / item.rate) : 0;

					let targetunit = 1;
					if (use1000units.has(code)) {
						targetunit = 1000;
					} else if (use100units.has(code)) {
						targetunit = 100;
					}
					const finalRate = middleRate * targetunit;

					return {
						country: countryNames[code] || code,
						code: code,
						rate: Number(finalRate.toFixed(4)),
						unit: targetunit
					};
				});
		} catch (err) {
			console.error("Error inside getFormattedExchangeRates processing loop:", err);
			return [];
		}
	}

	/**
	 * Fetch the latest update date for the exchange rates
	 * @return the latest update date in Date format
	 * @note call the core api function to get the raw data, then extract the last_updated field from the meta section
	 * @note parse it into Date format for better display and manipulation in the UI
	*/
	static async getlastetUpdateDate(): Promise<Date | null> {
		try {
			const data = await Api.getAllCountryExchangeRate()
			if (data) {
				const dataList = typeof data === "string"
					? JSON.parse(data)
					: data;

				// Check if it's an array and has at least one item
				if (Array.isArray(dataList) && dataList.length > 0) {
					const updateDate = dataList[0].date;
					return new Date(updateDate);
				}
			}
			return null;
		} catch (err) {
			console.error("Error fetching latest update date:", err);
			return null;
		}
	}

	/**
	 * Get the current hour in Kuala Lumpur timezone
	 * @return the current hour in Kuala Lumpur timezone
	*/
	// static getCurrentHour() {
	// 	const now = new Date();
	// 	const formatter = new Intl.DateTimeFormat('en-MY', {
	// 		timeZone: 'Asia/Kuala_Lumpur',
	// 		hour: '2-digit',
	// 		minute: '2-digit',
	// 		second: '2-digit',
	// 		hour12: false,
	// 	});
	// 	const parts = formatter.formatToParts(now);
	// 	const hour = parts.find(part => part.type === 'hour')?.value || "00";
	// 	return hour;
	// }

	/**
	 * Determine the current session (0900 or 1700) based on the hour in Kuala Lumpur timezone
	 * @param hour the current hour in Kuala Lumpur timezone
	 * @return "0900" if it's between 9am and 5pm, otherwise return "1700"
	*/
	// static getCurrentSession(hour: number) {
	// 	if (hour >= 9 && hour < 12) {
	// 		return "0900";
	// 	} else if (hour >= 12 && hour < 17) {
	// 		return "1200";
	// 	} else {
	// 		return "1700";
	// 	}
	// }

	static handleAmountInput(initialValue: string) {
		const [amount, setAmount] = useState<string>(initialValue);
		const handleAmountChange = (inputValue: string) => {
			const sanitized = inputValue.replace(/[^0-9.]/g, "");
			if (sanitized.split(".").length > 2) {
				return;
			}
			setAmount(sanitized);
		};

		return {
			amount,
			handleAmountChange
		};
	}

	static CountryFlag({currencyCode, className = "w-10, h-10"}: CountryFlagProps) {
		if (currencyCode === "SDR") {
			return (
				<div className={`${className} rounded-full overflow-hidden flex items-center justify-center bg-gray-200`}>
					<img src="/XDR.png" alt="SDR"/>
				</div>
			)
		}
		const countryCode = currencyToCountry[currencyCode];
		if (!countryCode) return <span>🏳️</span>;
		const Flag = Flags[countryCode as keyof typeof Flags];
		if (!Flag) return <span>🏳️</span>;
		return (
			<div className={`${className} rounded-full overflow-hidden`}>
				<Flag className="w-full h-full" />
			</div>
		);
	}
}
