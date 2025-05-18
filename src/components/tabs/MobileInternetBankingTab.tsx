import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Download, BarChart, Wifi, Smartphone } from 'lucide-react';
import { fetchMobileInternetBanking, ASEAN_COUNTRIES } from '../../services/apiService';
import LineChart from '../visualizations/LineChart';
import Table, { TableColumn } from '../visualizations/Table';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';
import { MobileInternetBankingItem, TimeRange } from '../../types/gdpTypes';
import { calculateGdpSummary } from '../../utils/dataUtils';
import * as ss from 'simple-statistics';
import regression from 'regression';
import Select from 'react-select';

const unitOptions = [
  { value: '10P3AD', label: 'Per 1,000 Adults' },
  { value: 'XDC', label: 'Domestic Currency (XDC)' },
  { value: 'TRANSACT', label: 'Transactions' },
  { value: 'PT_GDP', label: 'Percentage of GDP' },
];

const MobileInternetBankingTab: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  const [selectedCountries, setSelectedCountries] = useState([{ value: 'MYS', label: 'Malaysia' }]);
  const [unitMeasure, setUnitMeasure] = useState<string>('10P3AD');
  const countryCodes = selectedCountries.map(c => c.value);
  const { data, isLoading, error } = useQuery(
    ['mobileInternetBankingMulti', countryCodes, unitMeasure],
    async () => {
      const results = await Promise.all(
        countryCodes.map(code => fetchMobileInternetBanking(unitMeasure, code))
      );
      // Filter by unitMeasure for each country (in case API returns mixed units)
      return results.map(countryData => (countryData || []).filter(item => !('unit' in item) || item.unit === unitMeasure));
    },
    { keepPreviousData: true }
  );

  // Filter all countries' data by timeRange for chart and table, then filter by unit
  const filteredDataAllCountries = (data || []).map((countryData = []) => {
    let filtered = [];
    switch (timeRange) {
      case 'last5': filtered = countryData.slice(-5); break;
      case 'last10': filtered = countryData.slice(-10); break;
      default: filtered = countryData;
    }
    // Always filter by unit after timeRange
    return filtered.filter(item => !('unit' in item) || item.unit === unitMeasure);
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to load Mobile & Internet Banking data" />;
  if (!data || !data.length || !data[0] || !data[0].length) {
    return (
      <div className="slide-in">
        <div className="p-8 text-center text-slate-500">No Mobile & Internet Banking data available for the selected country/countries.</div>
      </div>
    );
  }

  const filteredData = (() => {
    const d = data[0] || [];
    switch (timeRange) {
      case 'last5': return d.slice(-5);
      case 'last10': return d.slice(-10);
      default: return d;
    }
  })();

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
    if (!data || !selectedCountries.length) return;
    const yearSet = new Set<string>();
    (data || []).forEach(countryData => (countryData || []).forEach(item => yearSet.add(item.year)));
    const years = Array.from(yearSet).sort();
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
    const fileName = `mobile-internet-banking-comparison-${selectedCountries.map(c => c.value).join('-')}.csv`;
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Prepare columns for table
  const columns: TableColumn<MobileInternetBankingItem>[] = [
    { key: 'year', label: 'Year', align: 'left' },
    { key: 'value', label: 'Mobile & Internet Banking', align: 'right', formatter: (v) => v.toLocaleString('en-US') },
  ];

  return (
    <div className="slide-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center">
            <Wifi className="mr-2 h-6 w-6 text-red-500" />
            Use of Financial Services, Mobile and internet banking transactions
          </h2>
          <p className="text-slate-600 mt-1">
            Compare Annual Mobile & Internet Banking data for ASEAN countries.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-wrap gap-2 items-center">
          <div style={{ minWidth: 220 }}>
            <Select
              isMulti
              isSearchable={true}
              options={ASEAN_COUNTRIES.map(c => ({ value: c.code, label: c.name, isDisabled: c.code === 'MYS' }))}
              value={selectedCountries}
              onChange={opts => {
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
            className="px-3 py-2 rounded border border-slate-300 text-slate-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            value={timeRange}
            onChange={e => setTimeRange(e.target.value as TimeRange)}
          >
            <option value="all">All Time</option>
            <option value="last5">Last 5 Years</option>
            <option value="last10">Last 10 Years</option>
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

      {/* Chart Section */}
      <div className="card p-6 mb-8">
        {selectedCountries.length === 1 && selectedCountries[0].value === 'MYS' ? (
          <LineChart
            data={filteredData.map(item => ({ x: item.year, y: item.value }))}
            label="Mobile & Internet Banking"
            color="rgb(239,68,68)"
            yAxisLabel="Mobile & Internet Banking"
            valueFormatter={(v) => v.toLocaleString('en-US', { maximumFractionDigits: 2 })}
            regressionLine={regResult && filteredData.length > 1 ? {
              data: filteredData.map(item => ({ x: item.year, y: regResult.predict(+item.year)[1] })),
              label: 'Regression Line',
              color: 'rgba(239,68,68,0.5)'
            } : undefined}
          />
        ) : (
          <LineChart
            data={filteredDataAllCountries.map((countryData, idx) => ({
              label: selectedCountries[idx]?.label || countryCodes[idx],
              data: (countryData || []).map(item => ({ x: item.year, y: item.value })),
              color: [
                'rgb(239,68,68)', // red
                'rgb(59,130,246)', // blue
                'rgb(168,85,247)', // purple
                'rgb(251,191,36)', // orange
                'rgb(16,185,129)', // green
                'rgb(234,179,8)',  // yellow
                'rgb(52,211,153)', // teal
                'rgb(244,63,94)',  // pink
                'rgb(37,99,235)',  // indigo
                'rgb(251,113,133)' // rose
              ][idx % 10]
            }))}
            label="Mobile & Internet Banking"
            multi
            yAxisLabel="Mobile & Internet Banking"
            valueFormatter={(v) => v.toLocaleString('en-US', { maximumFractionDigits: 2 })}
          />
        )}
      </div>

      {/* Summary Section - moved below chart with title */}
      {summary && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-slate-800 mb-4">Malaysia Mobile & Internet Banking Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        </div>
      )}

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
        <Table
          columns={[
            { key: 'year', label: 'Year', align: 'left' },
            ...selectedCountries.map((c) => ({
              key: c.value,
              label: c.label,
              align: 'right' as 'right',
              formatter: (v: number) => v !== null && v !== undefined ? v.toLocaleString('en-US') : ''
            }))
          ]}
          data={(() => {
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

export default MobileInternetBankingTab;
