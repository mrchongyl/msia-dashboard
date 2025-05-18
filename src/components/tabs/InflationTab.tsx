import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { TrendingUp, Download, BarChart, Percent } from 'lucide-react';
import { fetchInflation, ASEAN_COUNTRIES } from '../../services/apiService';
import LineChart from '../visualizations/LineChart';
import Table from '../visualizations/Table';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';
import { InflationDataItem, TimeRange } from '../../types/gdpTypes';
import * as ss from 'simple-statistics';
import regression from 'regression';
import Select from 'react-select';

function calculateInflationSummary(data: InflationDataItem[]) {
  if (!data || data.length === 0) return null;
  const sorted = [...data].sort((a, b) => parseInt(a.year) - parseInt(b.year));
  const startYear = sorted[0].year;
  const endYear = sorted[sorted.length - 1].year;
  const latest = sorted[sorted.length - 1].value;
  const growthSince2000 = (() => {
    const base = sorted.find(item => parseInt(item.year) === 2000);
    if (base) {
      return latest - base.value;
    } else {
      return latest - sorted[0].value;
    }
  })();
  const peak = sorted.reduce((max, item) => item.value > max.value ? item : max, sorted[0]);
  return { startYear, endYear, latest, growthSince2000, peak };
}

const InflationTab: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  const [selectedCountries, setSelectedCountries] = useState([{ value: 'MYS', label: 'Malaysia' }]);

  // Fetch inflation data for all selected countries in parallel
  const countryCodes = selectedCountries.map(c => c.value);
  const { data, isLoading, error } = useQuery(
    ['inflationMulti', countryCodes],
    async () => {
      const results = await Promise.all(
        countryCodes.map(code => fetchInflation(code))
      );
      return results;
    },
    { keepPreviousData: true }
  );

  // Filter all countries' data by timeRange for chart and table
  const filteredDataAllCountries = (data || []).map((countryData = []) => {
    switch (timeRange) {
      case 'last10': return countryData.slice(-10);
      case 'last20': return countryData.slice(-20);
      case 'last30': return countryData.slice(-30);
      case 'since2000': return countryData.filter(item => parseInt(item.year) >= 2000);
      default: return countryData;
    }
  });

  // Defensive: show loading or error
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to load inflation data" />;

  // Defensive: if no data for any country
  if (!data || !data.length || !data[0] || !data[0].length) {
    return (
      <div className="slide-in">
        <div className="p-8 text-center text-slate-500">No inflation data available for the selected country/countries.</div>
      </div>
    );
  }

  // Table and summary/statistics for first country only
  const filteredData = (() => {
    const d = data[0] || [];
    switch (timeRange) {
      case 'last10': return d.slice(-10);
      case 'last20': return d.slice(-20);
      case 'last30': return d.slice(-30);
      case 'since2000': return d.filter(item => parseInt(item.year) >= 2000);
      default: return d;
    }
  })();
  const summary = filteredData.length > 0 ? calculateInflationSummary(filteredData) : null;
  const values = filteredData.map(d => d.value);
  const mean = values.length ? ss.mean(values) : null;
  const median = values.length ? ss.median(values) : null;
  const stddev = values.length ? ss.standardDeviation(values) : null;
  const regData = filteredData.map(d => [+d.year, d.value]);
  const regResult = regData.length > 1 ? regression.linear(regData) : null;
  const slope = regResult ? regResult.equation[0] : null;
  const intercept = regResult ? regResult.equation[1] : null;
  const r2 = regResult ? regResult.r2 : null;

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
    const fileName = `inflation-comparison-${selectedCountries.map(c => c.value).join('-')}.csv`;
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
            <Percent className="mr-2 h-6 w-6 text-purple-600" />
            Inflation, consumer prices (annual % growth)
          </h2>
          <p className="text-slate-600 mt-1">
            Compare inflation trends for selected ASEAN countries.
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
            className="px-3 py-2 rounded border border-slate-300 text-slate-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
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
            className="btn btn-primary flex items-center bg-purple-600 hover:bg-purple-700 border-purple-600"
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
            label="Inflation Rate (%)"
            color="rgb(168,85,247)"
            yAxisLabel="Inflation Rate (%)"
            valueFormatter={(v) => v.toFixed(2) + '%'}
            regressionLine={regResult && filteredData.length > 1 ? {
              data: filteredData.map(item => ({ x: item.year, y: regResult.predict(+item.year)[1] })),
              label: 'Regression Line',
              color: 'rgba(168,85,247,0.5)'
            } : undefined}
          />
        ) : (
          <LineChart
            data={filteredDataAllCountries.map((countryData, idx) => ({
              label: selectedCountries[idx]?.label || countryCodes[idx],
              data: (countryData || []).map(item => ({ x: item.year, y: item.value })),
              color: [
                'rgb(168,85,247)', // purple
                'rgb(59,130,246)', // blue
                'rgb(234,179,8)',  // yellow
                'rgb(239,68,68)',  // red
                'rgb(251,191,36)', // orange
                'rgb(52,211,153)', // teal
                'rgb(244,63,94)',  // pink
                'rgb(37,99,235)',  // indigo
                'rgb(251,113,133)' // rose
              ][idx % 10]
            }))}
            label="Inflation Rate (%)"
            multi
            yAxisLabel="Inflation Rate (%)"
            valueFormatter={(v) => v.toFixed(2) + '%'}
          />
        )}
      </div>

      {/* Malaysia Inflation Summary Section */}
      {summary && (
        <>
          <h3 className="text-xl font-semibold text-slate-800 mb-4">Malaysia Inflation Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card p-6">
              <div className="flex items-start">
                <div className="rounded-full bg-purple-100 p-3 mr-4">
                  <Percent className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-500">Latest Inflation Rate</h3>
                  <p className="text-2xl font-semibold number-mono text-slate-800">
                    {summary.latest.toFixed(2)}%
                  </p>
                  <p className="text-xs text-slate-500">Year {summary.endYear}</p>
                </div>
              </div>
            </div>
            <div className="card p-6">
              <div className="flex items-start">
                <div className="rounded-full bg-purple-100 p-3 mr-4">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
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
                <div className="rounded-full bg-purple-100 p-3 mr-4">
                  <BarChart className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-500">Historical Peak</h3>
                  <p className="text-2xl font-semibold number-mono text-slate-800">
                    {summary.peak.value.toFixed(2)}%
                  </p>
                  <p className="text-xs text-slate-500">Year {summary.peak.year}</p>
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
          <li>Mean: {mean !== null ? mean.toFixed(2) + '%' : '--'}</li>
          <li>Median: {median !== null ? median.toFixed(2) + '%' : '--'}</li>
          <li>Std Dev: {stddev !== null ? stddev.toFixed(2) + '%' : '--'}</li>
          <li>Linear Regression: {slope !== null && intercept !== null ? `y = ${slope.toFixed(4)}x + ${intercept.toFixed(2)}` : '--'} {r2 !== null ? `(R² = ${r2.toFixed(3)})` : ''}</li>
        </ul>
      </div>

      {/* Table Section (all selected countries) */}
      <div className="card">
        <Table
          columns={[
            { key: 'year', label: 'Year', align: 'left' as const },
            ...selectedCountries.map((c) => ({
              key: c.value,
              label: c.label,
              align: 'right' as const,
              formatter: (v: number) => v !== null && v !== undefined ? v.toFixed(2) + '%' : ''
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

export default InflationTab;
