# Malaysia World Bank Dashboard

A modern, Apple-inspired dashboard for visualizing Malaysia's economic data from the World Bank API. This project features GDP per capita visualization with interactive charts and tables.

## Features

- API integration with World Bank Data360
- Interactive data visualization with Chart.js
- Responsive design for all device sizes
- Data table with sorting and pagination
- CSV export functionality
- Time range filtering

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, Chart.js
- **Backend:** Flask API (Python)
- **Data fetching:** Axios, React Query
- **UI Components:** Custom components with Apple-inspired design

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

## Data Source

This dashboard uses the World Bank Data360 API:
- GDP per capita (current US$): https://data360api.worldbank.org/data360/data?DATABASE_ID=WB_WDI&INDICATOR=WB_WDI_NY_GDP_PCAP_CD&REF_AREA=MYS

## License

MIT