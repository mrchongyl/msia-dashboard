# ASEAN World Bank Dashboard

A modern, Apple-inspired dashboard for visualizing ASEAN's economic data from the World Bank API. This project features visualization with interactive charts and tables for economics data.

## Features

- API integration with World Bank Data360
- Interactive data visualization with Chart.js
- Compare GDP, inflation, CPI, credit card usage, and mobile/internet banking
- Responsive design for all device sizes
- Data table with sorting and pagination
- CSV export functionality
- Time range filtering
- Summary statistics and regression analysis

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, Chart.js
- **Backend:** Flask API (Python)
- **Data fetching:** Axios, React Query
- **UI Components:** Tailwind CSS styled in Apple-inspired design

## Getting Started

### Prerequisites

- Node.js (v14+)
- Python (v3.8+)

### Installation

1. Install frontend dependencies:

```bash
npm install
```

2. Install backend dependencies:

```bash
cd api
pip install -r requirements.txt
```

### Running the Application

1. Start the Flask backend:

```bash
npm run api
```

2. In a new terminal, start the React frontend:

```bash
npm run dev
```

3. Open your browser and navigate to the URL shown in your terminal (typically http://localhost:5173)

## Project Structure

- `/src` - React frontend code
  - `/components` - UI components
  - `/services` - API service functions
  - `/types` - TypeScript type definitions
  - `/utils` - Utility functions
- `/api` - Flask backend code

## API Endpoints

- `GET /api/gdp-per-capita` - Fetch GDP per capita data for Malaysia
- `GET /api/inflation` - Fetch annual inflation rate (CPI, %)
- `GET /api/cpi` - Fetch Consumer Price Index (CPI) data
- `GET /api/credit-card-usage?unit=10P3AD` - Fetch credit card usage per 1,000 adults
- `GET /api/mobile-internet-banking?unit=10P3AD` - Fetch mobile & internet banking usage per 1,000 adults

## Data Sources

This dashboard uses the World Bank Data360 API:
- GDP per capita (current US$): https://data360api.worldbank.org/data360/data?DATABASE_ID=WB_WDI&INDICATOR=WB_WDI_NY_GDP_PCAP_CD&REF_AREA=MYS
- Inflation, consumer prices (annual % growth): https://data360api.worldbank.org/data360/data?DATABASE_ID=WB_WDI&INDICATOR=WB_WDI_FP_CPI_TOTL_ZG&REF_AREA=MYS
- Consumer price index (2010 = 100): https://data360api.worldbank.org/data360/data?DATABASE_ID=WB_WDI&INDICATOR=WB_WDI_FP_CPI_TOTL&REF_AREA=MYS
- Use of Financial Services, Credit cards: https://data360api.worldbank.org/data360/data?DATABASE_ID=IMF_FAS&INDICATOR=IMF_FAS_FCCCC&REF_AREA=MYS
- Use of Financial Services, Mobile and internet banking: https://data360api.worldbank.org/data360/data?DATABASE_ID=IMF_FAS&INDICATOR=IMF_FAS_FCMIBT&REF_AREA=MYS

## Statistical Analysis

- The dashboard provides mean, median, standard deviation, and linear regression (trend line and R²) for each metric.

## License

MIT