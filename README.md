# Malaysia Currency Exchange Rate

A lightweight, ad-free currency exchange web application tailored specifically for the Malaysian market. It uses the Frankfurter API to provide daily foreign-exchange reference rates while keeping the experience focused on converting currencies to and from Malaysian Ringgit (MYR).

🔗 **Live Demo:** https://myr-currency-exchange.vercel.app

---

## Problem
- **Overcomplicated Interfaces:** Most currency converters are built for a global audience, forcing users to wade through hundreds of irrelevant currency pairs just to find what they need.
- **Lack of Local Focus:** As someone living in Malaysia, my primary need is simply converting other currencies back to Malaysian Ringgit (MYR). Generic tools don't prioritize this, making the workflow slow and inefficient.
- **Reliance on Global Middlemen:** Platforms often use third-party global aggregators rather than primary sources, leading to data latency and a lack of official regulatory backing for local market tracking.
- **Cluttered and Restricted UX:** compromise the user experience with intrusive advertisements.

---

## Solution
- **MYR-Centric Conversion:**  The interface is explicitly tailored for the Malaysian market, eliminating unnecessary complexity by focusing entirely on converting foreign currencies directly to and from MYR.
- **Authoritative Accuracy:**  Leverages the primary local regulatory source to guarantee official, real-time Malaysian Ringgit exchange rates.
- **Clean, Ad-Free UI:**      Provides a streamlined, lightweight interface designed intentionally to deliver critical financial data quickly and without any distracting advertisement components.

---

## Data Source

This application uses the Frankfurter API for exchange-rate data.

Frankfurter is a free and open-source API for foreign-exchange rates. Its exchange-rate data is based on Bank Negara Malaysia reference rates, which are published on business days.

The application uses the API for:
- Latest exchange rates
- Currency conversion
- Historical exchange rates
- Historical date-range data
- Supported currency information

> Note: Frankfurter provides daily reference exchange rates rather than real-time market prices. The rates should therefore be considered reference rates and may differ from rates offered by banks, payment providers, or currency exchanges.

---

## Tech Stack
| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | **React (TypeScript)** | Ensures type-safe component architecture and predictable state management. |
| **Tool** | **Vite** | Provides near-instantaneous Hot Module Replacement (HMR) and optimized production builds. |
| **Styling & UI** | **TailwindCSS** | Facilitates rapid, utility-first responsive design without bloated CSS stylesheets. |
| **Data Visualization** | **Chart.js, react-chartjs-2** | Renders performant, responsive canvas charts for historical trend analysis. |
| **Design Elements** | **FontAwesome, country-flag-icons** | Delivers scalable vector icons and localized, lightweight SVG flags. |

## Architecture & Implementation

### API, Components, and Hooks
- **API Handling:** Frankfurter API requests are encapsulated in the application's API/data layer, keeping external data fetching separate from UI components.
- **Hooks:** Custom hooks manage state, perform calculations, and format data using `useMemo` to minimize unnecessary re-renders. 
- **Components:** The UI is modularized into discrete functional components (`Converter`, `Overview`, `Header`), promoting maintainability and clear responsibilities.

---

### Currency Conversion
- Fetches the latest available exchange rates from Frankfurter.
- Uses MYR as the primary currency for the Malaysian-focused conversion experience.
- Supports conversion between supported currencies.
- Automatically calculates the converted value based on the selected currencies and exchange rate.
- Updates the conversion result reactively when the amount or currency selection changes.

<img src="public/Convert.png" width="50%" alt="Currency Conversion Preview" />

---

### All Country Rates
- Retrieves supported currencies and their latest reference rates through Frankfurter.
- Normalizes the API response into a format suitable for the application's UI.
- Maps currency codes to readable currency and country information.
- Organizes the available currencies into a user-friendly list.

<img src="public/Country%20Rate.png" width="70%" alt="Country Rates Preview" />

---

### Historical Exchange Rates & Charting

Frankfurter provides historical exchange-rate data through its date-based API endpoints, allowing the application to retrieve rates for specific dates or date ranges.

The application:
- Requests historical exchange-rate data for the selected currency pair.
- Processes the returned date/value pairs into chart-friendly data.
- Dynamically determines the requested historical period.
- Displays exchange-rate movements using Chart.js.
- Uses the processed data to visualize short-term trends such as a rolling 7-day period.

This approach keeps historical data retrieval separate from the charting component while allowing the chart to react dynamically to the selected currencies and timeframe.

<img src="public/Chart.png" width="70%" alt="Historical Charts Preview" />

---

## Setup Guide

### Prerequisites
- Node.js
- npm

### 1. Clone the repository
```bash
git clone https://github.com/wenjuin95/Currency-Exchange.git
cd Currency-Exchange
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the website
```bash
npm run dev
```

### 4. Open Application
Open:
```bash
http://localhost:5173
```
If port 5173 is already in use, check the terminal output to see which port Vite selected.
