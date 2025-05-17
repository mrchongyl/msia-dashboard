import React from 'react';
import { useQuery } from 'react-query';
import { ExternalLink, BarChart, DollarSign, TrendingUp, CreditCard, Percent, Wifi } from 'lucide-react';
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

  // Credit Card Usage (per 1,000 adults)
  const { data: creditCardData } = useQuery(['creditCardUsage', '10P3AD'], () => fetchCreditCardUsage('10P3AD'));
  const avgCreditCard = creditCardData && creditCardData.length > 0
    ? creditCardData.reduce((sum, item) => sum + item.value, 0) / creditCardData.length
    : null;

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

  // Mobile & Internet Banking (per 1,000 adults)
  const { data: mibData } = useQuery(['mobileInternetBanking', '10P3AD'], () => fetchMobileInternetBanking('10P3AD'));
  const avgMib = mibData && mibData.length > 0
    ? mibData.reduce((sum, item) => sum + item.value, 0) / mibData.length
    : null;

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to load data" />;

  return (
    <div className="slide-in">
      <div className="mb-8 flex flex-col w-full">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">
          Malaysia Economic Overview
        </h2>
        <p className="text-slate-600 w-full">
         Gain insights into Malaysia’s economic landscape through key indicators from the World Bank. This dashboard presents data on GDP per capita, inflation trends, and consumer prices, along with the use of financial services such as credit card adoption and mobile or internet banking transactions by commercial banks. Explore the data to understand the economic growth and financial behavior of Malaysia over the years.
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
          {/* Credit Card Usage Card */}
          <div className="card p-6">
            <div className="flex items-start">
              <div className="rounded-full bg-green-100 p-3 mr-4">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500">Avg Credit Card Usage / 1,000 Adults</h3>
                <p className="text-2xl font-semibold number-mono text-slate-800">
                  {avgCreditCard !== null ? avgCreditCard.toLocaleString('en-US', { maximumFractionDigits: 2 }) : '--'}
                </p>
                <p className="text-xs text-slate-500">{creditCardData?.[0]?.year} - {creditCardData?.[creditCardData.length-1]?.year}</p>
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
                <h3 className="text-sm font-medium text-slate-500">Avg Yearly Inflation Increase</h3>
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
                <h3 className="text-sm font-medium text-slate-500">Avg Yearly CPI Increment</h3>
                <p className="text-2xl font-semibold number-mono text-slate-800">
                  {avgCpi !== null ? avgCpi.toFixed(2) : '--'}
                </p>
                <p className="text-xs text-slate-500">{cpiData?.[0]?.year} - {cpiData?.[cpiData.length-1]?.year}</p>
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
                <h3 className="text-sm font-medium text-slate-500">Avg Mobile & Internet Banking / 1,000 Adults</h3>
                <p className="text-2xl font-semibold number-mono text-slate-800">
                  {avgMib !== null ? avgMib.toLocaleString('en-US', { maximumFractionDigits: 2 }) : '--'}
                </p>
                <p className="text-xs text-slate-500">{mibData?.[0]?.year} - {mibData?.[mibData.length-1]?.year}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stacked/Comparison Chart Section */}
      <div className="card p-6 mb-8">
        <h3 className="text-lg font-medium text-slate-800 mb-4">Compare Key Economic Indicators</h3>
        <StackedComparisonChart
          gdpData={gdpData}
          creditCardData={creditCardData}
          inflationData={inflationData}
          cpiData={cpiData}
          mibData={mibData}
        />
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
              </p>
              <a 
                href="https://data.worldbank.org/indicator/NY.GDP.PCAP.CD?locations=MY" 
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
            <div className="rounded-full bg-blue-100 p-2 mr-3">
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-slate-800">GDP Per Capita (current US$)</h4>
              <p className="text-sm text-slate-600 mb-2">
                Annual gross domestic product per person in current US dollars from {gdpSummary?.startYear} to {gdpSummary?.endYear}.
              </p>
              <a 
                href="https://data.worldbank.org/indicator/NY.GDP.PCAP.CD?locations=MY" 
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