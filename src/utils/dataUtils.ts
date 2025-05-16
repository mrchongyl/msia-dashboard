import { GdpDataItem, GdpDataSummary } from '../types/gdpTypes';

/**
 * Calculates summary statistics for GDP data
 * @param data Array of GDP data items
 * @returns Summary statistics for the GDP data
 */
export const calculateGdpSummary = (data: GdpDataItem[]): GdpDataSummary => {
  // Sort data by year
  const sortedData = [...data].sort((a, b) => parseInt(a.year) - parseInt(b.year));
  
  // Get start and end years
  const startYear = sortedData[0]?.year || '';
  const endYear = sortedData[sortedData.length - 1]?.year || '';
  
  // Get the latest value
  const latest = sortedData[sortedData.length - 1]?.value || 0;
  
  // Find the peak value
  const peak = sortedData.reduce(
    (max, item) => (item.value > max.value ? { year: item.year, value: item.value } : max),
    { year: '', value: 0 }
  );
  
  // Calculate growth since 2000
  const dataFrom2000 = sortedData.filter(item => parseInt(item.year) >= 2000);
  let growthSince2000 = 0;
  
  if (dataFrom2000.length >= 2) {
    const valueIn2000 = dataFrom2000[0].value;
    const latestValue = dataFrom2000[dataFrom2000.length - 1].value;
    
    if (valueIn2000 > 0) {
      growthSince2000 = ((latestValue - valueIn2000) / valueIn2000) * 100;
    }
  }
  
  return {
    startYear,
    endYear,
    latest,
    peak,
    growthSince2000,
  };
};

/**
 * Formats a number as currency (USD)
 * @param value The number to format
 * @returns Formatted currency string
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};