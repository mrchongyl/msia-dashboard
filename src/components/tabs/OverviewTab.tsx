import React from 'react';
import { useQuery } from 'react-query';
import { ExternalLink, BarChart, DollarSign, TrendingUp } from 'lucide-react';
import { fetchGdpPerCapita } from '../../services/apiService';
import { GdpDataSummary } from '../../types/gdpTypes';
import { calculateGdpSummary } from '../../utils/dataUtils';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';

const OverviewTab: React.FC = () => {
  const { data, isLoading, error } = useQuery('gdpPerCapita', fetchGdpPerCapita);
  
  // Calculate GDP summary if data is available
  const gdpSummary: GdpDataSummary | null = data ? calculateGdpSummary(data) : null;

  // Calculate average GDP per capita
  const averageGdp = data && data.length > 0
    ? data.reduce((sum, item) => sum + item.value, 0) / data.length
    : null;
  
  // Function to format currency with commas and 2 decimal places
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to load GDP data" />;
  
  return (
    <div className="slide-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">
          Malaysia Economic Overview
        </h2>
        <p className="text-slate-600 max-w-3xl">
          Explore key economic indicators for Malaysia sourced from the World Bank. This dashboard
          provides insights into Malaysia's economic performance over time, with a focus on GDP per capita
          measurements from {gdpSummary?.startYear} to {gdpSummary?.endYear}.
        </p>
      </div>

      {averageGdp !== null && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
        </div>
      )}

      <div className="card p-6">
        <h3 className="text-lg font-medium text-slate-800 mb-4">Available Datasets</h3>
        <ul className="space-y-4">
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