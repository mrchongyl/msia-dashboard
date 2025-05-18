import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { TrendingUp, Download, DollarSign, BarChart } from 'lucide-react';
import { fetchGdpPerCapita, ASEAN_COUNTRIES } from '../../services/apiService';
import LineChart from '../visualizations/LineChart';
import Table, { TableColumn } from '../visualizations/Table';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';
import { GdpDataItem, TimeRange } from '../../types/gdpTypes';
import { calculateGdpSummary, formatCurrency } from '../../utils/dataUtils';
import * as ss from 'simple-statistics';
import regression from 'regression';
import Select from 'react-select';

const GdpTab: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  const [selectedCountries, setSelectedCountries] = useState([{ value: 'MYS', label: 'Malaysia' }]);
  // const [showDebug, setShowDebug] = useState(false);

  // Fetch GDP data for all selected countries in parallel
  const countryCodes = selectedCountries.map(c => c.value);
  const { data, isLoading, error } = useQuery(
    ['gdpPerCapitaMulti', countryCodes],
    async () => {
      const results = await Promise.all(
        countryCodes.map(code => fetchGdpPerCapita(code))
      );
      return results;
    },
    { keepPreviousData: true }
  );

  // Prepare chart data for multiple countries
  const chartDataMulti = (data || []).map((countryData, idx) => ({
    label: selectedCountries[idx]?.label || countryCodes[idx],
    data: (countryData || []).map(item => ({ x: item.year, y: item.value })),
    color: [
      'rgb(59,130,246)', // blue
      'rgb(16,185,129)', // green
      'rgb(234,179,8)',  // yellow
      'rgb(239,68,68)',  // red
      'rgb(168,85,247)', // purple
      'rgb(251,191,36)', // orange
      'rgb(52,211,153)', // teal
      'rgb(244,63,94)',  // pink
      'rgb(37,99,235)',  // indigo
      'rgb(251,113,133)' // rose
    ][idx % 10]
  }));

  // Filter all countries' data by timeRange for chart and table
  const filteredDataAllCountries = (data || []).map((countryData = []) => {
    switch(timeRange) {
      case 'last10': return countryData.slice(-10);
      case 'last20': return countryData.slice(-20);
      case 'last30': return countryData.slice(-30);
      case 'since2000': return countryData.filter(item => parseInt(item.year) >= 2000);
      default: return countryData;
    }
  });

  // Show loading or error
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to load GDP data" />;

  // If no data for any country
  if (!data || !data.length || !data[0] || !data[0].length) {
    return (
      <div className="slide-in">
        <div className="p-8 text-center text-slate-500">No GDP data available for the selected country/countries.</div>
      </div>
    );
  }

  // Table and summary/statistics for first country only
  const filteredData = (() => {
    const d = data[0] || [];
    switch(timeRange) {
      case 'last10': return d.slice(-10);
      case 'last20': return d.slice(-20);
      case 'last30': return d.slice(-30);
      case 'since2000': return d.filter(item => parseInt(item.year) >= 2000);
      default: return d;
    }
  })();
  const gdpSummary = filteredData.length > 0 ? calculateGdpSummary(filteredData) : null;
  const values = filteredData.map(d => d.value);
  const mean = values.length ? ss.mean(values) : null;
  const median = values.length ? ss.median(values) : null;
  const stddev = values.length ? ss.standardDeviation(values) : null;
  const regData = filteredData.map(d => [+d.year, d.value]);
  const regResult = regData.length > 1 ? regression.linear(regData) : null;
  const slope = regResult ? regResult.equation[0] : null;
  const intercept = regResult ? regResult.equation[1] : null;
  const r2 = regResult ? regResult.r2 : null;

  // Prepare columns for table
  const columns: TableColumn<GdpDataItem>[] = [
    { key: 'year', label: 'Year', align: 'left' },
    { key: 'value', label: 'GDP Per Capita', align: 'right', formatter: (v) => formatCurrency(v) },
  ];

  // Generate CSV for all selected countries
  const generateCsv = () => {
    if (!data || !selectedCountries.length) return;
    // Build a year-indexed map for each country
    const yearSet = new Set<string>();
    (data || []).forEach(countryData => (countryData || []).forEach(item => yearSet.add(item.year)));
    const years = Array.from(yearSet).sort();
    // CSV header: Year, Country1, Country2, ...
    const headers = ['Year', ...selectedCountries.map(c => c.label)];
    const csvRows = [headers.join(',')];
    years.forEach(year => {
      const row = [year];
      data.forEach((countryData) => {
        const found = (countryData || []).find(item => item.year === year);
        row.push(found ? String(found.value) : '');
      });
      csvRows.push(row.join(','));
    });
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const fileName = `gdp-per-capita-comparison-${selectedCountries.map(c => c.value).join('-')}.csv`;
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="slide-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center">
            <TrendingUp className="mr-2 h-6 w-6 text-blue-500" />
            GDP Per Capita (current US$)
          </h2>
          <p className="text-slate-600 mt-1">
            Compare GDP per capita trends for selected ASEAN countries.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-wrap gap-2 items-center">
          <div style={{ minWidth: 220 }}>
            <Select
              isMulti
              options={ASEAN_COUNTRIES.map(c => ({ value: c.code, label: c.name, isDisabled: c.code === 'MYS' }))}
              value={selectedCountries}
              onChange={opts => {
                // Always include Malaysia in the selection
                const malaysia = { value: 'MYS', label: 'Malaysia' };
                const filtered = Array.isArray(opts) ? opts.filter(opt => opt.value !== 'MYS') : [];
                setSelectedCountries([malaysia, ...filtered]);
              }}
              classNamePrefix="react-select"
              placeholder="Select countries..."
              isOptionDisabled={option => option.value === 'MYS'}
            />
          </div>
          <select
            className="px-3 py-2 rounded border border-slate-300 text-slate-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={timeRange}
            onChange={e => setTimeRange(e.target.value as TimeRange)}
          >
            <option value="all">All Time</option>
            <option value="last10">Last 10 Years</option>
            <option value="last20">Last 20 Years</option>
            <option value="last30">Last 30 Years</option>
            <option value="since2000">Since 2000</option>
          </select>
          <button
            onClick={generateCsv}
            className="btn btn-primary flex items-center bg-blue-600 hover:bg-blue-700 border-blue-600"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Chart Section */}
      <div className="card p-6 mb-8">
        {selectedCountries.length === 1 && selectedCountries[0].value === 'MYS' ? (
          <LineChart
            data={filteredData.map(item => ({ x: item.year, y: item.value }))}
            label="GDP Per Capita (US$)"
            color="rgb(59,130,246)"
            yAxisLabel="GDP Per Capita (US$)"
            valueFormatter={(v) => `$${v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            regressionLine={regResult && filteredData.length > 1 ? {
              data: filteredData.map(item => ({ x: item.year, y: regResult.predict(+item.year)[1] })),
              label: 'Regression Line',
              color: 'rgba(59,130,246,0.5)'
            } : undefined}
          />
        ) : (
          <LineChart
            data={filteredDataAllCountries.map((countryData, idx) => ({
              label: selectedCountries[idx]?.label || countryCodes[idx],
              data: (countryData || []).map(item => ({ x: item.year, y: item.value })),
              color: [
                'rgb(59,130,246)',
                'rgb(16,185,129)',
                'rgb(234,179,8)',
                'rgb(239,68,68)',
                'rgb(168,85,247)',
                'rgb(251,191,36)',
                'rgb(52,211,153)',
                'rgb(244,63,94)',
                'rgb(37,99,235)',
                'rgb(251,113,133)'
              ][idx % 10]
            }))}
            label="GDP Per Capita (US$)"
            multi
            yAxisLabel="GDP Per Capita (US$)"
            valueFormatter={(v) => `$${v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          />
        )}
      </div>

      {/* Malaysian GDP Summary Section */}
      {gdpSummary && (
        <>
          <h3 className="text-xl font-semibold text-slate-800 mb-4">Malaysia GDP Summary</h3>
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
        </>
      )}

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
        <Table
          columns={[
            { key: 'year', label: 'Year', align: 'left' },
            ...selectedCountries.map((c) => ({
              key: c.value,
              label: c.label,
              align: 'right',
              formatter: (v: number) => formatCurrency(v)
            }))
          ]}
          data={(() => {
            // Build a year-indexed map for each country
            const yearSet = new Set<string>();
            filteredDataAllCountries.forEach(countryData => (countryData || []).forEach(item => yearSet.add(item.year)));
            const years = Array.from(yearSet).sort();
            return years.map(year => {
              const row: any = { year };
              filteredDataAllCountries.forEach((countryData, idx) => {
                const found = (countryData || []).find(item => item.year === year);
                row[selectedCountries[idx]?.value] = found ? found.value : null;
              });
              return row;
            });
          })()}
        />
      </div>
    </div>
  );
};

export default GdpTab;