
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
    faCloudSun,
    faLocationDot,
    faRotate,
    faSmog,
    faSun,
    faCloudRain,
    faCloudShowersHeavy,
    faCloudBolt,
    faTemperatureHalf,
} from "@fortawesome/free-solid-svg-icons";
import {
    cities,
    conditions,
    getWeather,
    getTemperatureLabel,
    getAqiLabel,
    CityKey,
    WeatherData
} from "@/lib/weatherApi";

function getConditionIcon(code: number): IconDefinition {
    if (code === 0 || code === 1) return faSun;
    if (code === 2 || code === 3) return faCloudSun;
    if (code >= 45 && code <= 48) return faSmog;
    if (code >= 51 && code <= 61) return faCloudRain;
    if (code >= 63 && code <= 82) return faCloudShowersHeavy;
    if (code >= 95 && code <= 99) return faCloudBolt;
    return faCloudSun;
}

export default function Weather() {
    const [city, setCity] = useState<CityKey>("subang-jaya");
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);
        setError(false);

        getWeather(city, controller.signal)
            .then(setWeather)
            .catch((requestError: Error) => {
                if (requestError.name !== "AbortError") setError(true);
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false);
            });

        return () => controller.abort();
    }, [city]);

    const selectedCity = cities[city];

    return (
        <section
            >
                <div className="container relative z-10 mx-auto px-6 lg:px-0">
                    <div className="glass-strong rounded-3xl border border-primary/20 bg-primary/10 p-6 glow-border animate-fade-in lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
                        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between lg:flex-col">
                            <div>
                                <h2 id="weather-heading" className="mt-2 text-2xl md:text-3xl font-bold">Weather Forecast</h2>
                                <p className="mt-2 text-sm text-muted-foreground">Live conditions from Open-Meteo</p>
                            </div>
                            <label className="flex items-center gap-3 text-sm font-medium" htmlFor="weather-city">
                                <FontAwesomeIcon icon={faLocationDot} className="text-primary" style={{ stroke: 'black', strokeWidth: 10 }} />
                                <select
                                    id="weather-city"
                                    value={city}
                                    onChange={(event) => setCity(event.target.value as CityKey)}
                                    className="border rounded-lg px-3 py-2 text-sm bg-theme-input text-theme-muted font-bold focus:outline-none w-full cursor-pointer"
                                >
                                    {Object.entries(cities).map(([value, item]) => (
                                        <option key={value} value={value}>{item.label}</option>
                                    ))}
                                </select>
                            </label>
                        </div>

                        {loading && !weather ? (
                            <div className="mt-8 flex min-h-32 items-center justify-center text-sm text-muted-foreground" role="status">
                                <FontAwesomeIcon icon={faRotate} spin className="mr-3 text-primary" /> Loading current conditions...
                            </div>
                        ) : error || !weather ? (
                            <div className="mt-8 flex min-h-32 items-center justify-center text-sm text-muted-foreground text-center" role="alert">
                                Weather data is temporarily unavailable. Please try again shortly.
                            </div>
                        ) : (
                            <div className="mt-8 grid gap-4 md:grid-cols-3 lg:grid-cols-3">
                                <div className="rounded-2xl border border-border/70 bg-primary/10 p-5">
                                    <div className="flex items-center gap-4">
                                        <FontAwesomeIcon icon={getConditionIcon(weather.code)} style={{ stroke: 'black', strokeWidth: 10 }} className="text-4xl" />
                                        <div>
                                            <p className="text-4xl font-bold">{weather.temperature}°C</p>
                                            <p className="text-sm text-muted-foreground">{conditions[weather.code] || "Current conditions"}</p>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">{selectedCity.label}</p>
                                </div>
                                <div className="rounded-2xl border border-border/70 bg-primary/10 p-5">
                                    <FontAwesomeIcon icon={faTemperatureHalf} className="text-primary" style={{ stroke: 'black', strokeWidth: 10 }} />
                                    <p className="mt-4 text-2xl font-bold">{weather.temperature}°</p>
                                    <p className="text-sm text-muted-foreground">{getTemperatureLabel(weather.temperature)}</p>
                                </div>
                                <div className="rounded-2xl border border-border/70 bg-primary/10 p-5">
                                    <FontAwesomeIcon icon={faSmog} className="text-primary" style={{ stroke: 'black', strokeWidth: 10 }} />
                                    <p className="mt-4 text-2xl font-bold">{weather.aqi}</p>
                                    <p className="text-sm text-muted-foreground">AQI · {getAqiLabel(weather.aqi)}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
    );
}
