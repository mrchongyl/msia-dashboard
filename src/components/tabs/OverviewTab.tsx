import React from 'react';
import { useQuery } from 'react-query';
import { ExternalLink, BarChart, DollarSign, TrendingUp, CreditCard, Percent, Wifi, CircleDollarSign } from 'lucide-react';
import { fetchGdpPerCapita, fetchCreditCardUsage, fetchInflation, fetchCpi, fetchMobileInternetBanking } from '../../services/apiService';
import { GdpDataSummary } from '../../types/gdpTypes';
import { calculateGdpSummary } from '../../utils/dataUtils';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';
import StackedComparisonChart from '../visualizations/StackedComparisonChart';

const OverviewTab: React.FC = () => {
  // GDP per Capita
  const { data: gdpData, isLoading, error } = useQuery('gdpPerCapita', fetchGdpPerCapita);
  const gdpSummary: GdpDataSummary | null = gdpData ? calculateGdpSummary(gdpData) : null;
  const averageGdp = gdpData && gdpData.length > 0
    ? gdpData.reduce((sum, item) => sum + item.value, 0) / gdpData.length
    : null;
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Inflation (average yearly increase)
  const { data: inflationData } = useQuery('inflation', fetchInflation);
  const avgInflation = inflationData && inflationData.length > 1
    ? (inflationData[inflationData.length - 1].value - inflationData[0].value) / (inflationData.length - 1)
    : null;

  // CPI (average yearly increment)
  const { data: cpiData } = useQuery('cpi', fetchCpi);
  const avgCpi = cpiData && cpiData.length > 1
    ? (cpiData[cpiData.length - 1].value - cpiData[0].value) / (cpiData.length - 1)
    : null;

  // Credit Card Usage (per 1,000 adults)
  const { data: creditCardData } = useQuery(['creditCardUsage', '10P3AD'], () => fetchCreditCardUsage('10P3AD'));
  const creditCard10P3AD = creditCardData?.filter(d => d.unit === '10P3AD') || [];
  const avgCreditCard = creditCard10P3AD.length > 0
    ? creditCard10P3AD.reduce((sum, item) => sum + item.value, 0) / creditCard10P3AD.length
    : null;

  // Mobile & Internet Banking (per 1,000 adults)
  const { data: mibData } = useQuery(['mobileInternetBanking', '10P3AD'], () => fetchMobileInternetBanking('10P3AD'));
  const mib10P3AD = mibData?.filter(d => d.unit === '10P3AD') || [];
  const avgMib = mib10P3AD.length > 0
    ? mib10P3AD.reduce((sum, item) => sum + item.value, 0) / mib10P3AD.length
    : null;

  const [visibleMetrics, setVisibleMetrics] = React.useState([
    'GDP Per Capita',
    'Inflation',
    'CPI',
    'Credit Card Usage',
    'Mobile & Internet Banking',
  ]);

  const allYears = React.useMemo(() => {
    // Collect all years from all datasets, then dedupe and sort
    const years = [
      ...(gdpData?.map(d => d.year) || []),
      ...(inflationData?.map(d => d.year) || []),
      ...(cpiData?.map(d => d.year) || []),
      ...(creditCardData?.map(d => d.year) || []),
      ...(mibData?.map(d => d.year) || []),
    ];
    return Array.from(new Set(years)).sort();
  }, [gdpData, inflationData, cpiData, creditCardData, mibData]);

  const stackedDatasets = [
    {
      label: 'GDP Per Capita',
      color: 'rgb(59, 130, 246)', // blue
      data: gdpData?.map(d => ({ x: d.year, y: d.value })) || [],
      visible: visibleMetrics.includes('GDP Per Capita'),
    },
    {
      label: 'Inflation',
      color: 'rgb(139, 92, 246)', // purple
      data: inflationData?.map(d => ({ x: d.year, y: d.value })) || [],
      visible: visibleMetrics.includes('Inflation'),
    },
    {
      label: 'CPI',
      color: 'rgb(251, 146, 60)', // orange
      data: cpiData?.map(d => ({ x: d.year, y: d.value })) || [],
      visible: visibleMetrics.includes('CPI'),
    },
    {
      label: 'Credit Card Usage',
      color: 'rgb(34, 197, 94)', // green
      data: creditCard10P3AD.map(d => ({ x: d.year, y: d.value })),
      visible: visibleMetrics.includes('Credit Card Usage'),
    },
    {
      label: 'Mobile & Internet Banking',
      color: 'rgb(239, 68, 68)', // red
      data: mib10P3AD.map(d => ({ x: d.year, y: d.value })),
      visible: visibleMetrics.includes('Mobile & Internet Banking'),
    },
  ];

  const handleToggleMetric = (label: string) => {
    setVisibleMetrics(prev =>
      prev.includes(label)
        ? prev.filter(l => l !== label)
        : [...prev, label]
    );
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to load data" />;

  return (
    <div className="slide-in">
      <div className="mb-8 flex flex-col w-full">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">
          Malaysia Economic Overview
        </h2>
        <p className="text-slate-600 w-full">
         Gain insights into Malaysia’s economic landscape through key indicators from the World Bank. This overview page presents data on GDP per capita, inflation trends, and consumer prices, along with the use of financial services such as credit card adoption and mobile or internet banking transactions by commercial banks. Explore the data to understand the economic growth and financial behavior of Malaysia over the years.
        </p>
      </div>


      {averageGdp !== null && (
        <div className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          {/* GDP Card */}
          <div className="card p-6">
            <div className="flex items-start">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500">Average GDP Per Capita</h3>
                <p className="text-2xl font-semibold number-mono text-slate-800">
                  {formatCurrency(averageGdp)}
                </p>
                <p className="text-xs text-slate-500">{gdpSummary?.startYear} - {gdpSummary?.endYear}</p>
              </div>
            </div>
          </div>
          {/* Inflation Card */}
          <div className="card p-6">
            <div className="flex items-start">
              <div className="rounded-full bg-purple-100 p-3 mr-4">
                <Percent className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500">Average Yearly Inflation Increase</h3>
                <p className="text-2xl font-semibold number-mono text-slate-800">
                  {avgInflation !== null ? avgInflation.toFixed(2) + '%' : '--'}
                </p>
                <p className="text-xs text-slate-500">{inflationData?.[0]?.year} - {inflationData?.[inflationData.length-1]?.year}</p>
              </div>
            </div>
          </div>
          {/* CPI Card */}
          <div className="card p-6">
            <div className="flex items-start">
              <div className="rounded-full bg-orange-100 p-3 mr-4">
                <BarChart className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500">Average Yearly CPI Increment</h3>
                <p className="text-2xl font-semibold number-mono text-slate-800">
                  {avgCpi !== null ? avgCpi.toFixed(2) : '--'}
                </p>
                <p className="text-xs text-slate-500">{cpiData?.[0]?.year} - {cpiData?.[cpiData.length-1]?.year}</p>
              </div>
            </div>
          </div>
          {/* Credit Card Usage Card */}
          <div className="card p-6">
            <div className="flex items-start">
              <div className="rounded-full bg-green-100 p-3 mr-4">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500">Average Credit Card Usage / 1,000 Adults</h3>
                <p className="text-2xl font-semibold number-mono text-slate-800">
                  {avgCreditCard !== null ? avgCreditCard.toLocaleString('en-US', { maximumFractionDigits: 2 }) : '--'}
                </p>
                <p className="text-xs text-slate-500">{creditCard10P3AD[0]?.year} - {creditCard10P3AD[creditCard10P3AD.length-1]?.year}</p>
              </div>
            </div>
          </div>
          {/* Mobile & Internet Banking Card */}
          <div className="card p-6">
            <div className="flex items-start">
              <div className="rounded-full bg-red-100 p-3 mr-4">
                <Wifi className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500">Average Mobile & Internet Banking / 1,000 Adults</h3>
                <p className="text-2xl font-semibold number-mono text-slate-800">
                  {avgMib !== null ? avgMib.toLocaleString('en-US', { maximumFractionDigits: 2 }) : '--'}
                </p>
                <p className="text-xs text-slate-500">{mib10P3AD[0]?.year} - {mib10P3AD[mib10P3AD.length-1]?.year}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stacked Comparison Chart Section */}
      <div className="card p-6 mb-8">
        <h3 className="text-lg font-medium text-slate-800 mb-4">Compare Key Economic Metrics</h3>
        <p className="text-slate-600 mb-4 text-sm">Toggle metrics below to compare trends across GDP, inflation, CPI, credit card usage, and mobile/internet banking. Lines are smoothed for clarity.</p>
        <StackedComparisonChart
          datasets={stackedDatasets}
          years={allYears}
          onToggle={handleToggleMetric}
        />
      </div>

      {/* Statistical Insights Card */}
      <div className="card p-6 mb-8">
        <h3 className="text-lg font-medium text-slate-800 mb-2">Statistical Insights</h3>
        <ul className="list-disc pl-6 text-slate-700 text-base space-y-2">
          {gdpData && gdpData.length > 1 && (
            <li>
              GDP per capita grew from <b>{formatCurrency(gdpData[0].value)}</b> in {gdpData[0].year} to <b>{formatCurrency(gdpData[gdpData.length-1].value)}</b> in {gdpData[gdpData.length-1].year}, a total increase of <b>{(((gdpData[gdpData.length-1].value - gdpData[0].value) / gdpData[0].value) * 100).toFixed(1)}%</b>.
            </li>
          )}
          {inflationData && inflationData.length > 1 && (
            <li>
              The average annual inflation rate was <b>{avgInflation !== null ? avgInflation.toFixed(2) + '%': '--'}</b> from {inflationData[0].year} to {inflationData[inflationData.length-1].year}. Highest inflation: <b>{Math.max(...inflationData.map(d => d.value)).toFixed(2)}%</b>.
            </li>
          )}
          {cpiData && cpiData.length > 1 && (
            <li>
              The Consumer Price Index (CPI) increased from <b>{cpiData[0].value.toFixed(2)}</b> in {cpiData[0].year} to <b>{cpiData[cpiData.length-1].value.toFixed(2)}</b> in {cpiData[cpiData.length-1].year}, a total increase of <b>{(((cpiData[cpiData.length-1].value - cpiData[0].value) / cpiData[0].value) * 100).toFixed(1)}%</b>.
            </li>
          )}
          {creditCard10P3AD && creditCard10P3AD.length > 1 && (
            <li>
              Credit card usage <b>per 1,000 adults</b> ranged from <b>{Math.min(...creditCard10P3AD.map(d => d.value)).toFixed(2)}</b> to <b>{Math.max(...creditCard10P3AD.map(d => d.value)).toFixed(2)}</b> over the available years.
            </li>
          )}
          {mib10P3AD && mib10P3AD.length > 1 && (
            <li>
              Mobile & Internet banking usage <b>per 1,000 adults</b> ranged from <b>{Math.min(...mib10P3AD.map(d => d.value)).toFixed(2)}</b> to <b>{Math.max(...mib10P3AD.map(d => d.value)).toFixed(2)}</b> over the available years.
            </li>
          )}
        </ul>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-medium text-slate-800 mb-4">Available Datasets</h3>
        <ul className="space-y-4">
          {/* GDP Per Capita Dataset */}
          <li className="flex items-start">
            <div className="rounded-full bg-blue-100 p-2 mr-3">
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-slate-800">GDP Per Capita (current US$)</h4>
              <p className="text-sm text-slate-600 mb-2">
                Annual gross domestic product per person in current US dollars from {gdpSummary?.startYear} to {gdpSummary?.endYear}.
                <br />
                <span className="text-xs text-slate-500">Frequency: Annual. Last updated: {gdpData?.[gdpData.length-1]?.year || '--'}. {gdpData && gdpData.length > 1 && (gdpData[gdpData.length-1].year - gdpData[0].year + 1 !== gdpData.length ? 'Note: Some years may be missing.' : 'No missing years detected.')}</span>
              </p>
              <a 
                href="https://data360.worldbank.org/en/indicator/WB_WDI_NY_GDP_PCAP_CD" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                View on World Bank <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </div>
          </li>
          {/* Annual Inflation Rate Dataset */}
          <li className="flex items-start">
            <div className="rounded-full bg-purple-100 p-2 mr-3">
              <Percent className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <h4 className="font-medium text-slate-800">Inflation, consumer prices (annual % growth)</h4>
              <p className="text-sm text-slate-600 mb-2">
                Annual inflation rate (CPI, %) from {inflationData?.[0]?.year} to {inflationData?.[inflationData.length-1]?.year}.
                <br />
                <span className="text-xs text-slate-500">Frequency: Annual. Last updated: {inflationData?.[inflationData.length-1]?.year || '--'}. {inflationData && inflationData.length > 1 && (inflationData[inflationData.length-1].year - inflationData[0].year + 1 !== inflationData.length ? 'Note: Some years may be missing.' : 'No missing years detected.')}</span>
              </p>
              <a 
                href="https://data360.worldbank.org/en/indicator/WB_WDI_FP_CPI_TOTL_ZG" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                View on World Bank <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </div>
          </li>
          {/* Consumer Price Index (CPI) Dataset */}
          <li className="flex items-start">
            <div className="rounded-full bg-orange-100 p-2 mr-3">
              <CircleDollarSign className="h-4 w-4 text-orange-600" />
            </div>
            <div>
              <h4 className="font-medium text-slate-800">Consumer price index (2010 = 100)
</h4>
              <p className="text-sm text-slate-600 mb-2">
                Annual Consumer Price Index (CPI) from {cpiData?.[0]?.year} to {cpiData?.[cpiData.length-1]?.year}.
                <br />
                <span className="text-xs text-slate-500">Frequency: Annual. Last updated: {cpiData?.[cpiData.length-1]?.year || '--'}. {cpiData && cpiData.length > 1 && (cpiData[cpiData.length-1].year - cpiData[0].year + 1 !== cpiData.length ? 'Note: Some years may be missing.' : 'No missing years detected.')}</span>
              </p>
              <a 
                href="https://data360.worldbank.org/en/indicator/WB_WDI_FP_CPI_TOTL" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                View on World Bank <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </div>
          </li>
          {/* Credit Card Usage Dataset */}
          <li className="flex items-start">
            <div className="rounded-full bg-green-100 p-2 mr-3">
              <CreditCard className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-slate-800">Use of Financial Services, Credit cards</h4>
              <p className="text-sm text-slate-600 mb-2">
                Annual number of credit card usage from {creditCard10P3AD[0]?.year} to {creditCard10P3AD[creditCard10P3AD.length-1]?.year}.
                <br />
                <span className="text-xs text-slate-500">Frequency: Annual. Last updated: {creditCard10P3AD[creditCard10P3AD.length-1]?.year || '--'}. {creditCard10P3AD && creditCard10P3AD.length > 1 && (creditCard10P3AD[creditCard10P3AD.length-1].year - creditCard10P3AD[0].year + 1 !== creditCard10P3AD.length ? 'Note: Some years may be missing.' : 'No missing years detected.')}</span>
              </p>
              <a 
                href="https://data360.worldbank.org/en/indicator/IMF_FAS_FCCCC" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                View on World Bank <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </div>
          </li>
          {/* Mobile & Internet Banking Dataset */}
          <li className="flex items-start">
            <div className="rounded-full bg-red-100 p-2 mr-3">
              <Wifi className="h-4 w-4 text-red-600" />
            </div>
            <div>
              <h4 className="font-medium text-slate-800">Use of Financial Services, Mobile and internet banking transactions (during the reference year, for commercial banks only)</h4>
              <p className="text-sm text-slate-600 mb-2">
                Annual number of mobile and internet banking transactions from {mib10P3AD[0]?.year} to {mib10P3AD[mib10P3AD.length-1]?.year}.
                <br />
                <span className="text-xs text-slate-500">Frequency: Annual. Last updated: {mib10P3AD[mib10P3AD.length-1]?.year || '--'}. {mib10P3AD && mib10P3AD.length > 1 && (mib10P3AD[mib10P3AD.length-1].year - mib10P3AD[0].year + 1 !== mib10P3AD.length ? 'Note: Some years may be missing.' : 'No missing years detected.')}</span>
              </p>
              <a 
                href="https://data360.worldbank.org/en/indicator/IMF_FAS_FCMIBT?view=trend" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                View on World Bank <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default OverviewTab;