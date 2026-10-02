
export type CityKey =
	| "subang-jaya"
	| "kuala-lumpur"
	| "kuantan"
	| "ipoh"
	| "penang"
	| "kedah"
	| "kelantan"
	| "melaka"
	| "kota-kinabalu"
	| "kuching";

export interface City {
	label: string;
	latitude: number;
	longitude: number;
}

export interface WeatherData {
	temperature: number;
	code: number;
	aqi: number;
}

export const cities: Record<CityKey, City> = {
	"subang-jaya": { label: "Subang Jaya", latitude: 3.0438, longitude: 101.5806 },
	"kuala-lumpur": { label: "Kuala Lumpur", latitude: 3.139, longitude: 101.687 },
	"kuantan": { label: "Kuantan", latitude: 3.8077, longitude: 103.3260 },
	"ipoh": { label: "Ipoh", latitude: 4.5975, longitude: 101.0901 },
	"penang": { label: "Penang", latitude: 5.4065, longitude: 100.2559 },
	"kedah": { label: "Kedah", latitude: 5.8098, longitude: 100.6715 },
	"kelantan": { label: "Kelantan", latitude: 5.4021, longitude: 102.0636 },
	"melaka": { label: "Melaka", latitude: 2.3294, longitude: 102.2881 },
	"kota-kinabalu": { label: "Kota Kinabalu", latitude: 5.9804, longitude: 116.0735 },
	"kuching": { label: "Kuching", latitude: 1.5533, longitude: 110.3592 },
};

export const conditions: Record<number, string> = {
	0: "Clear sky",
	1: "Mainly clear",
	2: "Partly cloudy",
	3: "Overcast",
	45: "Fog",
	48: "Fog",
	51: "Light drizzle",
	53: "Drizzle",
	55: "Heavy drizzle",
	61: "Light rain",
	63: "Rain",
	65: "Heavy rain",
	80: "Showers",
	81: "Showers",
	82: "Violent showers",
	95: "Thunderstorm",
	96: "Thunderstorm",
	99: "Thunderstorm",
};

export function getAqiLabel(aqi: number): string {
	if (aqi <= 50) return "Good";
	if (aqi <= 100) return "Moderate";
	if (aqi <= 150) return "Sensitive groups";
	if (aqi <= 200) return "Unhealthy";
	if (aqi <= 300) return "Very unhealthy";
	return "Hazardous";
}

export function getTemperatureLabel(temp: number): string {
	if (temp <= 0) return "Damn Freezing";
	if (temp <= 10) return "So Cold";
	if (temp <= 20) return "Feel Cool"; // fixed typo "Fell" -> "Feel"
	if (temp <= 30) return "Feel Warm";
	if (temp <= 40) return "So Hot Sia";
	return "Scorching";
}

export async function getWeather(cityKey: CityKey, signal?: AbortSignal): Promise<WeatherData> {
	const city = cities[cityKey];
	const params = `latitude=${city.latitude}&longitude=${city.longitude}&timezone=Asia%2FKuala_Lumpur`;

	const [weatherResponse, airResponse] = await Promise.all([
		fetch(`https://api.open-meteo.com/v1/forecast?${params}&current=temperature_2m,relative_humidity_2m,weather_code`, { signal }),
		fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?${params}&current=us_aqi`, { signal }),
	]);

	if (!weatherResponse.ok || !airResponse.ok) throw new Error("Weather data unavailable");

	const weather = await weatherResponse.json();
	const air = await airResponse.json();
	const temperature = Math.round(weather.current.temperature_2m);
	const aqi = Math.round(air.current.us_aqi);

	return {
		temperature,
		code: weather.current.weather_code,
		aqi,
	};
}
