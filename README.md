# 📊 Dynamic Portfolio Dashboard

A real-time stock portfolio tracking application for Indian markets (NSE/BSE) built with **Next.js**, **TypeScript**, **Tailwind CSS**, and **TanStack Table v8**. Features live stock prices, automatic updates, sector-wise grouping, and comprehensive portfolio analytics.

![Portfolio Dashboard](https://img.shields.io/badge/Next.js-14+-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3+-38B2AC?style=flat-square&logo=tailwind-css)

---

## 🚀 Features

### Core Functionality

- ✅ **Real-time Stock Prices** - Live CMP (Current Market Price) from Yahoo Finance API
- ✅ **Auto-refresh** - Updates every 15 seconds with countdown timer
- ✅ **Manual Refresh** - Button to force immediate update with timer reset
- ✅ **Sector Grouping** - Stocks organized by sector with expand/collapse
- ✅ **Portfolio Analytics** - Investment tracking with gain/loss calculations
- ✅ **Indian Markets** - Support for NSE and BSE exchanges

### Interactive Table (TanStack Table v8)

- 📈 **11 Data Columns**:
  - Particulars (Stock Name + Symbol)
  - Purchase Price
  - Quantity
  - Investment Amount
  - Portfolio Percentage (visual progress bar)
  - Exchange (NSE/BSE)
  - CMP (Current Market Price)
  - Present Value
  - Gain/Loss (₹ + %)
  - P/E Ratio
  - Latest Earnings (EPS)
- 🔄 **Sortable columns** - Click headers to sort
- 🎨 **Color-coded** - Green for gains, Red for losses
- 📱 **Responsive design** - Works on all devices

### Portfolio Summary

- 💰 Total Investment
- 📊 Current Portfolio Value
- 📈 Total Gain/Loss with percentage
- 🕐 Last updated timestamp

### User Experience

- ⚡ Loading states with spinners
- ❌ Graceful error handling
- 🔄 Retry mechanisms
- 🎯 Visual indicators (pulsing live dot)
- 🎨 Clean, modern UI with Tailwind CSS

---

## 🛠️ Tech Stack

### Frontend

- [Next.js 14+](https://nextjs.org/) - React framework with App Router
- [React 18](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [TanStack Table v8](https://tanstack.com/table/v8) - Modern table component

### Backend

- **Next.js API Routes** - Serverless backend
- **Axios** - HTTP client
- **Node-Cache** - Server-side caching (15s TTL)
- **Yahoo Finance Chart API** - Stock price data

---

## 📁 Project Structure

```
portfolio-dashboard/
├── app/
│   ├── api/
│   │   └── stocks/
│   │       └── route.ts          # API endpoint for stock data
│   ├── page.tsx                  # Main dashboard page
│   ├── layout.tsx                # Root layout with ErrorBoundary
│   └── globals.css               # Global styles
│
├── components/
│   ├── PortfolioTable.tsx        # TanStack Table component
│   ├── SectorGroup.tsx           # Sector grouping with summaries
│   ├── PortfolioSummary.tsx      # Summary cards component
│   └── ErrorBoundary.tsx         # Error boundary component
│
├── lib/
│   ├── api/
│   │   └── stockPrice.ts         # Yahoo Finance integration
│   ├── data/
│   │   └── samplePortfolio.ts    # Initial portfolio data
│   ├── types/
│   │   └── portfolio.ts          # TypeScript interfaces
│   └── utils/
│       └── calculation.ts        # Portfolio calculations
│
├── public/                       # Static assets
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── tailwind.config.ts            # Tailwind config
└── README.md                     # This file
```

---

## 🚦 Getting Started

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** or **yarn** or **pnpm**

### Installation

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd portfolio-dashboard
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Run the development server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. **Open your browser**

Navigate to http://localhost:3000

You should see the portfolio dashboard with live data!

## 🔧 Configuration

### Portfolio Data

Edit your portfolio holdings in `lib/data/samplePortfolio.ts`:

```typescript
export const initialPortfolio = [
  {
    particulars: "Reliance Industries",
    symbol: "RELIANCE",
    purchasePrice: 2450,
    quantity: 10,
    exchange: "NSE" as const,
    sector: "Energy",
  },
  // Add more stocks...
];
```

### Mock P/E Ratios & EPS

Update mock fundamental data in `lib/api/stockPrice.ts`:

```typescript
const MOCK_PE_RATIOS: Record<string, number> = {
  RELIANCE: 23.5,
  TCS: 28.3,
  // Add more...
};
```

---

## 📊 How It Works

### Data Flow

```
User Request
    ↓
Next.js Frontend (page.tsx)
    ↓
API Route (/api/stocks)
    ↓
Yahoo Finance Chart API
    ↓
Cache (15 seconds)
    ↓
Response with CMP + Mock P/E
    ↓
Frontend Calculations
    ↓
Render UI with TanStack Table
```

### Key Calculations

| Metric        | Formula                                     |
| ------------- | ------------------------------------------- |
| Investment    | Purchase Price × Quantity                   |
| Present Value | CMP × Quantity                              |
| Gain/Loss     | Present Value - Investment                  |
| Gain/Loss %   | (Gain/Loss / Investment) × 100              |
| Portfolio %   | (Stock Investment / Total Investment) × 100 |

### Auto-Refresh Logic

- 15-second interval automatically fetches fresh data
- Countdown timer shows time until next update
- Manual refresh button resets timer and fetches immediately
- Server-side cache (15s) reduces API calls

---

## 🎨 Components

### PortfolioTable

Interactive table built with TanStack Table v8:

- Sortable columns
- Custom cell renderers for formatting
- Color-coded gain/loss
- Progress bars for portfolio allocation
- Responsive horizontal scroll

### SectorGroup

Expandable sector sections showing:

- Sector name and stock count
- Total investment per sector
- Present value per sector
- Sector-level gain/loss
- Nested portfolio table

### PortfolioSummary

Summary cards displaying:

- Total portfolio metrics
- Color-coded performance
- Last update timestamp
- Real-time status indicator

---

## ⚠️ Known Limitations

### API Constraints

- Uses unofficial Yahoo Finance endpoints - structure may change
- P/E Ratio & EPS are mocked due to unreliable fundamentals API
- Rate limiting handled via caching and sequential requests
- No official API key required (but also no guarantees)

### Workarounds Implemented

| Issue                     | Solution                              |
| ------------------------- | ------------------------------------- |
| Yahoo Finance auth errors | Use chart endpoint (no auth required) |
| P/E ratio API failures    | Mock data with realistic values       |
| Rate limiting             | 15-second cache + sequential fetching |
| Indian stock support      | Use .NS (NSE) and .BO (BSE) suffixes  |

---

## 🚀 Future Enhancements

- Paid API Integration - Switch to Alpha Vantage, Finnhub, or FMP for reliable data
- Charts & Visualizations - Add Recharts for sector allocation pie charts
- CSV Import - Upload holdings from Excel/CSV
- Portfolio History - Track performance over time
- Database Integration - PostgreSQL for multi-user support
- Authentication - User accounts with NextAuth.js
- WebSocket Updates - Replace polling with real-time WebSocket connections
- Mobile App - React Native version

---

## 🐛 Troubleshooting

### Issue: Spinner keeps loading

**Solution:** Check browser console for API errors. Verify:

- Network requests to `/api/stocks` are succeeding
- Yahoo Finance endpoints are accessible
- No CORS errors

### Issue: Stock prices showing as 0

**Solution:**

- Yahoo Finance may be blocking requests
- Check stock symbol format (e.g., RELIANCE.NS for NSE)
- Verify exchange parameter is correct (NSE or BSE)

### Issue: Timer not resetting on manual refresh

**Solution:** Already fixed! The refreshKey state ensures the interval restarts.

---

## 📚 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TanStack Table v8 Docs](https://tanstack.com/table/v8)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Yahoo Finance API Alternatives](https://www.yahoofinanceapi.com/)

---

## 👨‍💻 Author

Built as a case study assignment demonstrating:

- Full-stack development with Next.js
- Real-time data integration
- Modern React patterns
- TypeScript best practices
- API error handling
- UI/UX design with Tailwind CSS

---
