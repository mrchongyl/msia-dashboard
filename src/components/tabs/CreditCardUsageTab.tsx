import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { TrendingUp, Download, CreditCard, BarChart, DollarSign } from 'lucide-react';
import { fetchCreditCardUsage } from '../../services/apiService';
import LineChart from '../visualizations/LineChart';
import Table, { TableColumn } from '../visualizations/Table';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';
import { CreditCardUsageItem, TimeRange } from '../../types/gdpTypes';
import * as ss from 'simple-statistics';
import regression from 'regression';

const unitOptions = [
  { value: 'ACCT', label: 'Number of Accounts' },
  { value: '10P3AD', label: 'Per 10,000 Adults' },
];

function calculateCreditCardSummary(data: CreditCardUsageItem[]) {
  if (!data || data.length === 0) return null;
  const sorted = [...data].sort((a, b) => parseInt(a.year) - parseInt(b.year));
  const startYear = sorted[0].year;
  const endYear = sorted[sorted.length - 1].year;
  const latest = sorted[sorted.length - 1].value;
  const growthSince2000 = (() => {
    const base = sorted.find(item => parseInt(item.year) === 2000);
    if (base) {
      return ((latest - base.value) / base.value) * 100;
    } else {
      return ((latest - sorted[0].value) / sorted[0].value) * 100;
    }
  })();
  const peak = sorted.reduce((max, item) => item.value > max.value ? item : max, sorted[0]);
  return { startYear, endYear, latest, growthSince2000, peak };
}

const CreditCardUsageTab: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  const [unitMeasure, setUnitMeasure] = useState<string>('ACCT');
  const { data, isLoading, error } = useQuery(['creditCardUsage', unitMeasure], () => fetchCreditCardUsage(unitMeasure));

  // Filter data based on selected time range and selected unit
  const getFilteredData = (): CreditCardUsageItem[] => {
    if (!data) return [];
    // Only include items matching the selected unitMeasure (in case API returns multiple units)
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
  // Calculate summary using only filtered data for the selected unit
  const summary = filteredData.length > 0 ? calculateCreditCardSummary(filteredData) : null;

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

  // Prepare data for line chart
  const chartData = filteredData.map(item => ({ x: item.year, y: item.value }));

  // Regression line data
  let regressionLine: { x: string, y: number }[] = [];
  if (regResult && filteredData.length > 1) {
    regressionLine = filteredData.map(item => ({
      x: item.year,
      y: regResult.predict(+item.year)[1]
    }));
  }

  // Prepare columns for table
  const columns: TableColumn<CreditCardUsageItem>[] = [
    { key: 'year', label: 'Year', align: 'left' },
    { key: 'value', label: 'Credit Card Usage', align: 'right', formatter: (v) => v.toLocaleString('en-US') },
  ];

  // Generate CSV from data
  const generateCsv = () => {
    if (!data) return;
    const headers = ['Year', 'Credit Card Usage (Count)'];
    const csvRows = [
      headers.join(','),
      ...filteredData.map(item => `${item.year},${item.value}`)
    ];
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `malaysia-credit-card-usage-${timeRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to load credit card usage data" />;

  return (
    <div className="slide-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center">
            <CreditCard className="mr-2 h-6 w-6 text-green-600" />
            Credit Card Usage (Count)
          </h2>
            <p className="text-slate-600 mt-1">
            Annual number of credit card usage in Malaysia.<br />
            This dashboard provides insights into Malaysia's Annual credit card usage number from {summary?.startYear} to {summary?.endYear}.
            </p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
          <select
            className="px-3 py-2 rounded border border-slate-300 text-slate-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
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
            className="px-3 py-2 rounded border border-slate-300 text-slate-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            value={unitMeasure}
            onChange={e => setUnitMeasure(e.target.value)}
          >
            {unitOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <button
            onClick={generateCsv}
            className="btn btn-primary flex items-center bg-green-600 hover:bg-green-700 border-green-600"
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
              <div className="rounded-full bg-green-100 p-3 mr-4">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500">Latest Usage</h3>
                <p className="text-2xl font-semibold number-mono text-slate-800">
                  {summary.latest.toLocaleString('en-US')}
                </p>
                <p className="text-xs text-slate-500">Year {summary.endYear}</p>
              </div>
            </div>
          </div>
          <div className="card p-6">
            <div className="flex items-start">
              <div className="rounded-full bg-green-100 p-3 mr-4">
                <TrendingUp className="h-6 w-6 text-green-600" />
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
              <div className="rounded-full bg-green-100 p-3 mr-4">
                <BarChart className="h-6 w-6 text-green-600" />
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
          label="Credit Card Usage"
          color="rgb(34,197,94)"
          yAxisLabel="Credit Card Usage"
          valueFormatter={(v) => v.toLocaleString('en-US', { maximumFractionDigits: 2 })}
          regressionLine={regressionLine.length > 1 ? {
            data: regressionLine,
            label: 'Regression Line',
            color: 'rgba(34,197,94,0.5)'
          } : undefined}
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

export default CreditCardUsageTab;
