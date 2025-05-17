import React, { useState } from 'react';
import { GdpDataItem, CreditCardUsageItem, InflationDataItem, CpiDataItem, MobileInternetBankingItem } from '../../types/gdpTypes';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface StackedComparisonChartProps {
  gdpData?: GdpDataItem[];
  creditCardData?: CreditCardUsageItem[];
  inflationData?: InflationDataItem[];
  cpiData?: CpiDataItem[];
  mibData?: MobileInternetBankingItem[];
}

const colorMap = {
  gdp: 'rgb(37, 99, 235)', // blue
  credit: 'rgb(34,197,94)', // green
  inflation: 'rgb(168,85,247)', // purple
  cpi: 'rgb(251,146,60)', // orange
  mib: 'rgb(239,68,68)', // red
};

const metricOptions = [
  { key: 'gdp', label: 'GDP Per Capita' },
  { key: 'credit', label: 'Credit Card Usage' },
  { key: 'inflation', label: 'Inflation Rate (%)' },
  { key: 'cpi', label: 'CPI' },
  { key: 'mib', label: 'Mobile & Internet Banking' },
] as const;
type MetricKey = typeof metricOptions[number]['key'];

const StackedComparisonChart: React.FC<StackedComparisonChartProps> = ({
  gdpData,
  creditCardData,
  inflationData,
  cpiData,
  mibData
}) => {
  // Toggle state for each metric
  const [visible, setVisible] = useState<Record<MetricKey, boolean>>({
    gdp: true,
    credit: false,
    inflation: true,
    cpi: false,
    mib: false,
  });

  // Find all unique years across all datasets
  const allYears = Array.from(new Set([
    ...(gdpData || []).map(d => d.year),
    ...(creditCardData || []).map(d => d.year),
    ...(inflationData || []).map(d => d.year),
    ...(cpiData || []).map(d => d.year),
    ...(mibData || []).map(d => d.year),
  ])).sort((a, b) => parseInt(a) - parseInt(b));

  // Helper to align data by year
  function alignData<T extends { year: string; value: number }>(data: T[] | undefined): (number | null)[] {
    if (!data) return allYears.map(() => null);
    const map = Object.fromEntries(data.map(d => [d.year, d.value]));
    return allYears.map(y => map[y] ?? null);
  }

  const datasets = [
    visible.gdp && gdpData && {
      label: 'GDP Per Capita',
      data: alignData(gdpData),
      borderColor: colorMap.gdp,
      backgroundColor: colorMap.gdp,
      yAxisID: 'y',
      spanGaps: true,
    },
    visible.credit && creditCardData && {
      label: 'Credit Card Usage',
      data: alignData(creditCardData),
      borderColor: colorMap.credit,
      backgroundColor: colorMap.credit,
      yAxisID: 'y1',
      spanGaps: true,
    },
    visible.inflation && inflationData && {
      label: 'Inflation Rate (%)',
      data: alignData(inflationData),
      borderColor: colorMap.inflation,
      backgroundColor: colorMap.inflation,
      yAxisID: 'y2',
      spanGaps: true,
    },
    visible.cpi && cpiData && {
      label: 'CPI',
      data: alignData(cpiData),
      borderColor: colorMap.cpi,
      backgroundColor: colorMap.cpi,
      yAxisID: 'y3',
      spanGaps: true,
    },
    visible.mib && mibData && {
      label: 'Mobile & Internet Banking',
      data: alignData(mibData),
      borderColor: colorMap.mib,
      backgroundColor: colorMap.mib,
      yAxisID: 'y4',
      spanGaps: true,
    },
  ].filter(Boolean);

  const chartData = {
    labels: allYears,
    datasets: datasets as any,
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { font: { weight: 'bold' as const } }
      },
      title: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: visible.gdp,
        position: 'left' as const,
        title: { display: visible.gdp, text: 'GDP Per Capita' },
        grid: { drawOnChartArea: false },
      },
      y1: {
        type: 'linear' as const,
        display: visible.credit,
        position: 'right' as const,
        title: { display: visible.credit, text: 'Credit Card Usage' },
        grid: { drawOnChartArea: false },
      },
      y2: {
        type: 'linear' as const,
        display: visible.inflation,
        position: 'right' as const,
        title: { display: visible.inflation, text: 'Inflation Rate (%)' },
        grid: { drawOnChartArea: false },
      },
      y3: {
        type: 'linear' as const,
        display: visible.cpi,
        position: 'right' as const,
        title: { display: visible.cpi, text: 'CPI' },
        grid: { drawOnChartArea: false },
      },
      y4: {
        type: 'linear' as const,
        display: visible.mib,
        position: 'right' as const,
        title: { display: visible.mib, text: 'Mobile & Internet Banking' },
        grid: { drawOnChartArea: false },
      },
    },
  };

  return (
    <div style={{ width: '100%', minHeight: 400 }}>
      <div className="flex flex-wrap gap-4 mb-4">
        {metricOptions.map(opt => (
          <label key={opt.key} className="flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={visible[opt.key]}
              onChange={() => setVisible(v => ({ ...v, [opt.key]: !v[opt.key] }))}
              className="accent-blue-600 h-4 w-4 rounded"
            />
            {opt.label}
          </label>
        ))}
      </div>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default StackedComparisonChart;
