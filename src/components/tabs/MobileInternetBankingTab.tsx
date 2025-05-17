import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Download, BarChart, Wifi, Smartphone } from 'lucide-react';
import { fetchMobileInternetBanking } from '../../services/apiService';
import LineChart from '../visualizations/LineChart';
import Table, { TableColumn } from '../visualizations/Table';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';
import { MobileInternetBankingItem, TimeRange } from '../../types/gdpTypes';
import { calculateGdpSummary } from '../../utils/dataUtils';
import * as ss from 'simple-statistics';
import regression from 'regression';

const unitOptions = [
  { value: 'XDC', label: 'Domestic Currency (XDC)' },
  { value: 'TRANSACT', label: 'Transactions' },
  { value: '10P3AD', label: 'Per 1,000 Adults' },
  { value: 'PT_GDP', label: 'Percentage of GDP' },
];

const MobileInternetBankingTab: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  const [unitMeasure, setUnitMeasure] = useState<string>('XDC');
  const { data, isLoading, error } = useQuery(['mobileInternetBanking', unitMeasure], () => fetchMobileInternetBanking(unitMeasure));

  // Filter data based on selected time range and selected unit
  const getFilteredData = (): MobileInternetBankingItem[] => {
    if (!data) return [];
    const filteredByUnit = data.filter(item => !('unit' in item) || (item as any).unit === unitMeasure);
    switch (timeRange) {
      case 'last10':
        return filteredByUnit.slice(-10);
      case 'last20':
        return filteredByUnit.slice(-20);
      case 'last30':
        return filteredByUnit.slice(-30);
      case 'since2000':
        return filteredByUnit.filter(item => parseInt(item.year) >= 2000);
      default:
        return filteredByUnit;
    }
  };

  const filteredData = data ? getFilteredData() : [];
  const summary = filteredData.length > 0 ? calculateGdpSummary(filteredData) : null;

  // Statistical analysis
  const values = filteredData.map(d => d.value);
  const mean = values.length ? ss.mean(values) : null;
  const median = values.length ? ss.median(values) : null;
  const stddev = values.length ? ss.standardDeviation(values) : null;
  const regData = filteredData.map(d => [+d.year, d.value]);
  const regResult = regData.length > 1 ? regression.linear(regData) : null;
  const slope = regResult ? regResult.equation[0] : null;
  const intercept = regResult ? regResult.equation[1] : null;
  const r2 = regResult ? regResult.r2 : null;

  // Generate CSV from data
  const generateCsv = () => {
    if (!data) return;
    const headers = ['Year', 'Mobile & Internet Banking'];
    const csvRows = [
      headers.join(','),
      ...filteredData.map(item => `${item.year},${item.value}`)
    ];
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `malaysia-mobile-internet-banking-${timeRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Prepare data for line chart
  const chartData = filteredData.map(item => ({ x: item.year, y: item.value }));

  // Prepare columns for table
  const columns: TableColumn<MobileInternetBankingItem>[] = [
    { key: 'year', label: 'Year', align: 'left' },
    { key: 'value', label: 'Mobile & Internet Banking', align: 'right', formatter: (v) => v.toLocaleString('en-US') },
  ];

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to load Mobile & Internet Banking data" />;

  return (
    <div className="slide-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center">
            <Wifi className="mr-2 h-6 w-6 text-red-500" />
            Mobile & Internet Banking
          </h2>
          <p className="text-slate-600 mt-1">
            Annual Mobile & Internet Banking data for Malaysia.<br />
            This dashboard provides insights into Malaysia's  Annual Mobile & Internet Banking data from {summary?.startYear} to {summary?.endYear}.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
          <select
            className="px-3 py-2 rounded border border-slate-300 text-slate-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
          >
            <option value="all">All Time</option>
            <option value="last10">Last 10 Years</option>
            <option value="last20">Last 20 Years</option>
            <option value="last30">Last 30 Years</option>
            <option value="since2000">Since 2000</option>
          </select>
          <select
            className="px-3 py-2 rounded border border-slate-300 text-slate-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            value={unitMeasure}
            onChange={e => setUnitMeasure(e.target.value)}
          >
            {unitOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <button
            onClick={generateCsv}
            className="btn btn-primary flex items-center bg-red-500 hover:bg-red-600 border-red-500"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-start">
              <div className="rounded-full bg-red-100 p-3 mr-4">
                <Wifi className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500">Latest Value</h3>
                <p className="text-2xl font-semibold number-mono text-slate-800">
                  {summary.latest.toLocaleString('en-US')}
                </p>
                <p className="text-xs text-slate-500">Year {summary.endYear}</p>
              </div>
            </div>
          </div>
          <div className="card p-6">
            <div className="flex items-start">
              <div className="rounded-full bg-red-100 p-3 mr-4">
                <Smartphone className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500">Growth Since {summary.startYear}</h3>
                <p className="text-2xl font-semibold number-mono text-slate-800">
                  {summary.growthSince2000.toFixed(2)}%
                </p>
                <p className="text-xs text-slate-500">{summary.startYear} - {summary.endYear}</p>
              </div>
            </div>
          </div>
          <div className="card p-6">
            <div className="flex items-start">
              <div className="rounded-full bg-red-100 p-3 mr-4">
                <BarChart className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500">Historical Peak</h3>
                <p className="text-2xl font-semibold number-mono text-slate-800">
                  {summary.peak.value.toLocaleString('en-US')}
                </p>
                <p className="text-xs text-slate-500">Year {summary.peak.year}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chart Section */}
      <div className="card p-6 mb-8">
        <LineChart
          data={chartData}
          label="Mobile & Internet Banking"
          color="rgb(239,68,68)"
          yAxisLabel="Mobile & Internet Banking"
          valueFormatter={(v) => v.toLocaleString('en-US', { maximumFractionDigits: 2 })}
        />
      </div>

      {/* Statistical Analysis Section */}
      <div className="card p-6 mb-8">
        <h3 className="text-lg font-medium text-slate-800 mb-2">Statistical Analysis</h3>
        <ul className="text-slate-700 text-sm mb-2">
          <li>Mean: {mean !== null ? mean.toLocaleString('en-US', { maximumFractionDigits: 2 }) : '--'}</li>
          <li>Median: {median !== null ? median.toLocaleString('en-US', { maximumFractionDigits: 2 }) : '--'}</li>
          <li>Std Dev: {stddev !== null ? stddev.toLocaleString('en-US', { maximumFractionDigits: 2 }) : '--'}</li>
          <li>Linear Regression: {slope !== null && intercept !== null ? `y = ${slope.toFixed(4)}x + ${intercept.toFixed(2)}` : '--'} {r2 !== null ? `(R² = ${r2.toFixed(3)})` : ''}</li>
        </ul>
      </div>

      {/* Table Section */}
      <div className="card">
        <Table columns={columns} data={filteredData} />
      </div>
    </div>
  );
};

export default MobileInternetBankingTab;
