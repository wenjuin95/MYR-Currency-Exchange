import { useState, useEffect } from "react"
import CurrencyRate from "@/components/overview/CurrencyRate"
import SelectionChart from "@/components/overview/SelectionChart"
import { HelperFunction } from "@/utils/helperFunction";
import { ViewType } from "@/lib/types"

export default function Overview() {
	const [activeView, setActiveView] = useState<ViewType>("rates")
	const [updateDate, setUpdateDate] = useState<Date | null>(null)

	useEffect(() => {
		async function updateDate() {
			const lastestDate = await HelperFunction.getlastetUpdateDate();
			setUpdateDate(lastestDate)
		}
		updateDate()
	}, [])


	return (
		<div className="p-5">
			<div className="flex items-center gap-x-4 animate-fade-in animation-delay-300">
				<h2>Exchange Rate Overview</h2>

				{/* update status */}
				<div className="flex items-center gap-x-2 bg-theme-card px-3 py-1.5 rounded-full">
					{updateDate ? (
						<>
							<div className="w-2 h-2 bg-theme-success rounded-full animate-pulse "/>
							<p className="font-semibold text-xs lg:text-sm">
								latest Update from BNM: {updateDate?.getDate()}/{updateDate?.getMonth() !== undefined ? updateDate.getMonth() + 1 : ''}/{updateDate?.getFullYear()}
							</p>
						</>
					):(
						<p className="font-semibold text-sm">Loading...</p>
					)}
				</div>
			</div>

			{/* navigate two views: all country rates vs individual currency charts */}
			<div className="flex gap-1 bg-theme-muted-10 p-1 rounded-lg mt-3 w-fit border border-theme-muted animate-fade-in animation-delay-400">
				<button
					type="button"
					onClick={() => setActiveView("rates")}
					className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${
						activeView === "rates"
							? "bg-theme-strong text-white shadow-sm scale-[1.02]"
							: "text-theme-muted hover:text-theme-strong hover:bg-theme-muted"
					}`}
				>
					All Country Rates
				</button>
				<button
					type="button"
					onClick={() => setActiveView("charts")}
					className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${
						activeView === "charts"
							? "bg-theme-strong text-white shadow-sm scale-[1.02]"
							: "text-theme-muted hover:text-theme-strong hover:bg-theme-muted"
					}`}
				>
					Currency Charts
				</button>
			</div>

			{/* display all country rates or individual currency charts */}
			<div className="mt-6 transition-all duration-300 animate-fade-in animation-delay-500">
				{activeView === "rates" ? (
					<CurrencyRate />
				):(
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl">
						<SelectionChart defaultCurrency="USD" />
						<SelectionChart defaultCurrency="SGD" />
					</div>
				)}
			</div>
		</div>
	)
}
