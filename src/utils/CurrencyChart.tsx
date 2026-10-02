import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { CurrencyChartProps, RateEntry} from '@/lib/types';

// 1. Register Chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function CurrencyChart({ historicalData }: CurrencyChartProps) {
// read theme color from CSS variables (falls back to defaults for SSR)
	const getThemeColor = (varName: string, fallback: string) => {
		if (typeof window === 'undefined') return fallback;
		const v = getComputedStyle(document.documentElement).getPropertyValue(varName);
		return v ? v.trim() : fallback;
	};

	const themeChartAccent = getThemeColor('--theme-chart-accent', 'rgb(75, 192, 192)');
	const themeChartAccentBg = getThemeColor('--theme-chart-accent-bg', 'rgba(75, 192, 192, 0.5)');

	const hexToRgba = (hex: string, alpha = 1) => {
		// handle rgb() or rgba() passthrough
		if (!hex) return `rgba(75,192,192,${alpha})`;
		hex = hex.trim();
		if (hex.startsWith('rgb')) return hex.replace(/rgb(a)?\(([^)]+)\)/, `rgba($2,${alpha})`);
		if (hex.startsWith('#')) {
			const h = hex.replace('#', '');
			const bigint = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
			const r = (bigint >> 16) & 255;
			const g = (bigint >> 8) & 255;
			const b = bigint & 255;
			return `rgba(${r}, ${g}, ${b}, ${alpha})`;
		}
		return themeChartAccentBg;
	};
// 3. Compute chartData dynamically on the fly using useMemo instead of useEffect + useState
	const chartData = useMemo(() => {
		if (!historicalData || historicalData.length === 0) return null;
		// console.log("Processing chart data from historicalData:", historicalData);

		// Extract labels (Dates) securely
		const labels = historicalData.flatMap((monthObj) =>
			monthObj.data.map((day: RateEntry) => day.date)
		);

		// Extract data points (Rates) securely
		const rates = historicalData.flatMap((monthObj) =>
			monthObj.data.map((day: RateEntry) => (1 / day.rate).toFixed(3))
		);

		return {
			labels: labels,
			datasets: [
				{
					label: 'Exchange Rate',
					data: rates,
					borderColor: themeChartAccent,
					backgroundColor: hexToRgba(themeChartAccent, 0.5),
					tension: 0.2,
				},
			],
		};
	}, [historicalData]); // Re-runs ONLY if historicalData reference updates

	// 4. Customise layout rules (Grid lines, titles, etc.)
	const options = {
		elements: {
			point: {
				radius: 3, // Smaller points for a cleaner look
			},
		},
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: 'top' as const,
			},
		},
		scales: {
			x: {
				offset: true,
				grid: {
					display: false, // Optional: Removes vertical grid lines for a cleaner look
				},
				ticks: {
					autoSkip: true, // Automatically skip some labels if there are too many
					maxTicksLimit: 7,
					maxRotation:0,
					minRotation:0,
				},
			},
			y: {
				ticks: {
					// Formats numbers to look like currency decimals
					callback: (value: number | string) => Number(value).toFixed(3),
				},
			},
		},
	};

	if (!chartData) return <div className="text-sm text-theme-muted">Processing graph...</div>;

	return (
		<div className="relative w-full h-[250px] md:h-[400px]">
			{/* 5. Render the imported Line component */}
			<Line options={options} data={chartData} />
		</div>
	);
}
