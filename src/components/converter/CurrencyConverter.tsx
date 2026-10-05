import { HelperFunction } from "@/utils/helperFunction";
import { useCurrencyRate } from "@/hooks/useCurrencyRate";
import { currencySymbols } from "@/lib/country_code";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faRightLeft } from "@fortawesome/free-solid-svg-icons";

export default function CurrencyConverter() {
	const { amount, handleAmountChange } = HelperFunction.handleAmountInput("");
	const { selectCountry, setSelectCountry, result, groupedCurrencies, isLoading, isForeignToMyr, toggleDirection } = useCurrencyRate(amount);
	const activeSymbol = currencySymbols[selectCountry] || "";
	const inputSymbol = isForeignToMyr ? activeSymbol : "RM";
    const inputLabel = isForeignToMyr ? selectCountry : "MYR";
    const outputPrefix = isForeignToMyr ? "RM" : (activeSymbol || selectCountry);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-64">
				<FontAwesomeIcon icon={faSpinner} className="animate-spin text-2xl text-theme-muted" />
			</div>
		)
	}

	return (
		// Restricted total width to max-w-md on mobile, stretching to max-w-lg on laptops
		<div className="p-5 max-w-md lg:max-w-lg ml-0 lg:ml-4 w-full transition-all animate-fade-in animation-delay-200">
			<div className="p-5 lg:p-6 bg-theme-muted rounded-xl shadow-sm border border-white mt-6">
				<div className="flex items-center justify-between mb-4">
                    <h2 className="text-base lg:text-lg font-bold text-theme-strong">
                        Currency Converter
                    </h2>

                    {/* Swap Direction Button */}
                    <button
                        type="button"
                        onClick={toggleDirection}
                        className="flex items-center gap-x-1.5 px-3 py-1.5 rounded-lg bg-theme-input hover:bg-theme-muted-10 text-xs font-bold text-theme-strong transition-colors cursor-pointer border border-theme-muted"
                        title="Swap conversion direction"
                    >
                        <FontAwesomeIcon icon={faRightLeft} className="text-xs" />
                        <span>{isForeignToMyr ? `${selectCountry} → MYR` : `MYR → ${selectCountry}`}</span>
                    </button>
                </div>

<div className="flex flex-col gap-y-3">
                    {/* Dropdown Row */}
                    <div className="flex flex-col gap-y-1">
                        <label className="text-[10px] lg:text-xs font-bold text-theme-muted uppercase tracking-wide px-1">
                            Target Currency
                        </label>
                        <select
                            value={selectCountry}
                            onChange={(e) => setSelectCountry(e.target.value)}
                            className="border rounded-lg px-3 py-2 text-sm bg-theme-input text-theme-muted font-bold focus:outline-none w-full cursor-pointer"
                        >
                            {groupedCurrencies.map(group => (
                                <optgroup
                                    key={group.region}
                                    label={group.region}
                                    className="text-theme-strong font-bold"
                                >
                                    {group.currencies.map(currency => (
                                        <option
                                            key={currency.code}
                                            value={currency.code}
                                            className="text-theme-muted"
                                        >
                                            {currency.code} - {currency.country} ({currency.unit.toLocaleString()} Unit)
                                        </option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                    </div>

                    {/* Input Row */}
                    <div className="flex flex-col gap-y-1 mt-1">
                        <label className="text-[10px] lg:text-xs font-bold text-theme-muted uppercase tracking-wide px-1">
                            Amount ({inputLabel})
                        </label>

                        <div className="relative flex items-center">
                            <span className="absolute left-3 text-sm lg:text-base font-bold text-theme-muted pointer-events-none select-none">
                                {inputSymbol}
                            </span>
                            <input
                                type="text"
                                inputMode="decimal"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => handleAmountChange(e.target.value)}
                                className="border rounded-lg pr-3 py-2 text-base lg:text-lg bg-theme-input text-theme-strong w-full focus:outline-none focus:ring-1 pl-12 font-bold"
                            />
                        </div>
                    </div>

                    <div className="text-xs font-bold text-theme-muted px-1 py-1">
                        {isForeignToMyr ? `↓ converts to Malaysian Ringgit (MYR)` : `↓ converts to ${selectCountry}`}
                    </div>

                    {/* Result Block */}
                    <div className="flex items-center justify-between p-3 lg:p-4 bg-theme-muted-10 rounded-xl border border-theme-muted">
                        <span className="text-xs font-bold text-theme-strong uppercase tracking-wider">
                            Total Estimation
                        </span>
                        <span className="text-xl lg:text-2xl font-black text-theme-strong">
                            {outputPrefix} {result}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}