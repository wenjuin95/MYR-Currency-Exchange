export interface RateEntry {
	date: string;
	base: string;
	quote: string;
	rate: number;
}

export interface HistoricalRateData {
	year: number;
	month: number;
	data: RateEntry[];
}

export interface YearMonthPair {
	year: number;
	month: number;
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
