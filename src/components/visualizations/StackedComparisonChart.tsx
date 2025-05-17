import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export interface StackedComparisonChartProps {
  datasets: Array<{
    label: string;
    color: string;
    data: { x: string | number; y: number }[];
    visible: boolean;
  }>;
  years: string[];
  onToggle: (label: string) => void;
}

const StackedComparisonChart: React.FC<StackedComparisonChartProps> = ({ datasets, years, onToggle }) => {
  const yAxesConfig = [
    {
      id: 'gdp',
      position: 'left',
      color: 'rgb(59, 130, 246)',
      label: 'GDP Per Capita',
      match: (label: string) => label === 'GDP Per Capita',
      ticks: { callback: (v: number) => v.toLocaleString('en-US', { maximumFractionDigits: 0 }) },
    },
    {
      id: 'inflation',
      position: 'right',
      color: 'rgb(139, 92, 246)',
      label: 'Inflation',
      match: (label: string) => label === 'Inflation',
      grid: { drawOnChartArea: false },
      ticks: { callback: (v: number) => v.toFixed(2) + '%' },
    },
    {
      id: 'cpi',
      position: 'right',
      color: 'rgb(251, 146, 60)',
      label: 'CPI',
      match: (label: string) => label === 'CPI',
      grid: { drawOnChartArea: false },
      ticks: { callback: (v: number) => v.toFixed(2) },
    },
    {
      id: 'credit',
      position: 'right',
      color: 'rgb(34, 197, 94)',
      label: 'Credit Card Usage',
      match: (label: string) => label === 'Credit Card Usage',
      grid: { drawOnChartArea: false },
      ticks: { callback: (v: number) => v.toLocaleString('en-US', { maximumFractionDigits: 0 }) },
    },
    {
      id: 'mib',
      position: 'right',
      color: 'rgb(239, 68, 68)',
      label: 'Mobile & Internet Banking',
      match: (label: string) => label === 'Mobile & Internet Banking',
      grid: { drawOnChartArea: false },
      ticks: { callback: (v: number) => v.toLocaleString('en-US', { maximumFractionDigits: 0 }) },
    },
  ];

  const chartData = React.useMemo(() => ({
    labels: years,
    datasets: datasets.filter(ds => ds.visible).map(ds => {
      const axis = yAxesConfig.find(ax => ax.match(ds.label));
      return {
        label: ds.label,
        data: years.map(year => {
          const found = ds.data.find(d => d.x === year);
          return found ? found.y : null;
        }),
        borderColor: ds.color,
        backgroundColor: ds.color.replace('rgb', 'rgba').replace(')', ', 0.1)'),
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 5,
        pointBackgroundColor: ds.color,
        pointHoverBackgroundColor: ds.color,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        yAxisID: axis ? axis.id : 'gdp',
      };
    })
  }), [datasets, years]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica',
            size: 12,
            weight: 'bold',
          },
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        titleFont: {
          family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica',
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica',
          size: 13,
        },
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          font: {
            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica',
          },
        },
      },
      ...yAxesConfig.reduce((acc, axis) => {
        acc[axis.id] = {
          type: 'linear',
          display: datasets.some(ds => ds.visible && axis.match(ds.label)),
          position: axis.position,
          grid: axis.grid,
          ticks: {
            ...axis.ticks,
            color: axis.color,
            font: {
              family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica',
              weight: 'bold',
            },
          },
          title: { display: false },
        };
        return acc;
      }, {} as any),
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    animation: {
      duration: 1000,
    },
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 mb-2">
        {datasets.map(ds => (
          <button
            key={ds.label}
            className={`px-3 py-1 rounded-full border text-xs font-semibold transition-colors ${ds.visible ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'}`}
            style={{ borderColor: ds.color, color: ds.visible ? '#fff' : ds.color, backgroundColor: ds.visible ? ds.color : undefined }}
            onClick={() => onToggle(ds.label)}
          >
            {ds.label}
          </button>
        ))}
      </div>
      <div className="w-full h-96">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default StackedComparisonChart;
