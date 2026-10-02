import Header from "@/components/header/Header"
import Weather from "@/components/weather/Weather"
import CurrencyConverter from "@/components/converter/CurrencyConverter"
import Overview from "@/components/overview/Overview"
import Footer from "@/components/footer/Footer"
import { useCurrencyData } from "@/hooks/useCurrencyData";
import ServiceUnavailable from "@/components/serviceUnavailable/ServiceUnavailable";

function App() {
	const { Error } = useCurrencyData();

	if (Error) {
		return <ServiceUnavailable/>;
	}

	return (
		<div className="flex flex-col gap-y-5">
			<Header />
			<Weather />
			<CurrencyConverter />
			<Overview />
			<Footer />
		</div>
	)
}

export default App
