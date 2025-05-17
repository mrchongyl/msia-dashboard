import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { TrendingUp, Download, DollarSign, BarChart } from 'lucide-react';
import { fetchGdpPerCapita } from '../../services/apiService';
import LineChart from '../visualizations/LineChart';
import Table, { TableColumn } from '../visualizations/Table';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';
import { GdpDataItem, TimeRange } from '../../types/gdpTypes';
import { calculateGdpSummary, formatCurrency } from '../../utils/dataUtils';
import * as ss from 'simple-statistics';
import regression from 'regression';

const GdpTab: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  
  const { data, isLoading, error } = useQuery('gdpPerCapita', fetchGdpPerCapita);
  
  // Filter data based on selected time range
  const getFilteredData = (): GdpDataItem[] => {
    if (!data) return [];
    
    switch(timeRange) {
      case 'last10':
        return data.slice(-10);
      case 'last20':
        return data.slice(-20);
      case 'last30':
        return data.slice(-30);
      case 'since2000':
        return data.filter(item => parseInt(item.year) >= 2000);
      default:
        return data;
    }
  };

  const filteredData = data ? getFilteredData() : [];
  // Calculate summary based on filtered data (not all data)
  const gdpSummary = filteredData.length > 0 ? calculateGdpSummary(filteredData) : null;
  console.log('GDPTab data:', data);
  console.log('GDPTab filteredData:', filteredData);
  console.log('GDPTab isLoading:', isLoading, 'error:', error);
  
  // Generate CSV from data
  const generateCsv = () => {
    if (!data) return;
    
    // Create CSV header and rows
    const headers = ['Year', 'GDP Per Capita (current US$)'];
    const csvRows = [
      headers.join(','),
      ...filteredData.map(item => `${item.year},${item.value}`)
    ];
    
    // Create blob and download link
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
  
    // Create download link and click it
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `malaysia-gdp-per-capita-${timeRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
  const columns: TableColumn<GdpDataItem>[] = [
    { key: 'year', label: 'Year', align: 'left' },
    { key: 'value', label: 'GDP Per Capita', align: 'right', formatter: (v) => formatCurrency(v) },
  ];

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to load GDP data" />;
  
  return (
    <div className="slide-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center">
            <TrendingUp className="mr-2 h-6 w-6 text-blue-500" />
            GDP Per Capita (current US$)
          </h2>
          <p className="text-slate-600 mt-1">
            Annual GDP per capita in current US dollars for Malaysia. <br />
            This dashboard provides insights into Malaysia's GDP per capita measurements from {gdpSummary?.startYear} to {gdpSummary?.endYear}.
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
          <select 
            className="px-3 py-2 rounded border border-slate-300 text-slate-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
          >
            <option value="all">All Time</option>
            <option value="last10">Last 10 Years</option>
            <option value="last20">Last 20 Years</option>
            <option value="last30">Last 30 Years</option>
            <option value="since2000">Since 2000</option>
          </select>
          
          <button 
            onClick={generateCsv}
            className="btn btn-primary flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {gdpSummary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-start">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500">Latest GDP Per Capita</h3>
                <p className="text-2xl font-semibold number-mono text-slate-800">
                  {formatCurrency(gdpSummary.latest)}
                </p>
                <p className="text-xs text-slate-500">Year {gdpSummary.endYear}</p>
              </div>
            </div>
          </div>
          <div className="card p-6">
            <div className="flex items-start">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500">Growth Since {gdpSummary.startYear}</h3>
                <p className="text-2xl font-semibold number-mono text-slate-800">
                  {gdpSummary.growthSince2000.toFixed(2)}%
                </p>
                <p className="text-xs text-slate-500">{gdpSummary.startYear} - {gdpSummary.endYear}</p>
              </div>
            </div>
          </div>
          <div className="card p-6">
            <div className="flex items-start">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <BarChart className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500">Historical Peak</h3>
                <p className="text-2xl font-semibold number-mono text-slate-800">
                  {formatCurrency(gdpSummary.peak.value)}
                </p>
                <p className="text-xs text-slate-500">Year {gdpSummary.peak.year}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chart Section */}
      <div className="card p-6 mb-8">
        <LineChart
          data={chartData}
          label="GDP Per Capita (US$)"
          color="rgb(59, 130, 246)"
          yAxisLabel="GDP Per Capita (US$)"
          valueFormatter={(v) => `$${v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          regressionLine={regressionLine.length > 1 ? {
            data: regressionLine,
            label: 'Regression Line',
            color: 'rgba(59,130,246,0.5)'
          } : undefined}
        />
      </div>

      {/* Statistical Analysis Section */}
      <div className="card p-6 mb-8">
        <h3 className="text-lg font-medium text-slate-800 mb-2">Statistical Analysis</h3>
        <ul className="text-slate-700 text-sm mb-2">
          <li>Mean: {mean !== null ? `$${mean.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '--'}</li>
          <li>Median: {median !== null ? `$${median.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '--'}</li>
          <li>Std Dev: {stddev !== null ? `$${stddev.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '--'}</li>
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

export default GdpTab;