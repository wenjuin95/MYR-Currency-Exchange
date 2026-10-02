// Define what an individual rate entry looks like (e.g., daily rate details)
export interface RateEntry {
	date: string;
	value: number;
	middle_rate: number; // Matches the BNM structure cleanly
}

// Define the data container
export interface MonthlyDataContainer {
	currency_code: string;
	rate: RateEntry[];
}

// Define the final structure for your chart data state
export interface HistoricalRateData {
	year: number;
	month: number;
	data: MonthlyDataContainer;
}

export interface YearMonthPair {
	year: number;
	month: number;
}

export interface DayRate {
	date: string;
	middle_rate: string | number; // Matches the BNM structure cleanly
}

export interface CurrencyChartProps {
	historicalData: HistoricalRateData[];
}

export interface CurrencyWidgetProps {
	defaultCurrency: string;
}

export type Timeframe = "7D" | "1M" | "5M" | "1Y";
export type ViewType = "rates" | "charts"

export interface FormattedCurrency {
	country: string;
	code: string;
	rate: number;
	unit: number;
}

export type VercelRequest = {
	method?: string;
	url?: string;
	headers: Record<string, string | string[] | undefined>;
};

export type VercelResponse = {
	status: (code: number) => VercelResponse;
	setHeader: (name: string, value: string) => VercelResponse;
	json: (body: unknown) => void;
};
