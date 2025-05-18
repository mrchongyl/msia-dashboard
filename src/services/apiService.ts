import axios from 'axios';
import { GdpDataItem } from '../types/gdpTypes';

// API base URL - points to our Flask backend
const API_BASE_URL = 'http://localhost:5000/api';

// List of ASEAN country codes and names
export const ASEAN_COUNTRIES = [
  { code: 'BRN', name: 'Brunei' },
  { code: 'KHM', name: 'Cambodia' },
  { code: 'IDN', name: 'Indonesia' },
  { code: 'LAO', name: 'Laos' },
  { code: 'MYS', name: 'Malaysia' },
  { code: 'MMR', name: 'Myanmar' },
  { code: 'PHL', name: 'Philippines' },
  { code: 'SGP', name: 'Singapore' },
  { code: 'THA', name: 'Thailand' },
  { code: 'VNM', name: 'Vietnam' },
];

/**
 * Fetches GDP per capita data for a given country from the API
 * @param countryCode ISO3 country code (e.g., 'MYS')
 * @returns {Promise<GdpDataItem[]>} Array of GDP data items
 */
export const fetchGdpPerCapita = async (countryCode: string = 'MYS'): Promise<GdpDataItem[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/gdp-per-capita`, { params: { country: countryCode } });
    console.log('API raw response:', response.data);
    // Robustly extract the data array
    let rawData: any[] = [];
    if (Array.isArray(response.data.data)) {
      rawData = response.data.data;
    } else if (response.data.data && Array.isArray(response.data.data.value)) {
      rawData = response.data.data.value;
    } else if (Array.isArray(response.data.data?.data)) {
      rawData = response.data.data.data;
    }
    const formattedData: GdpDataItem[] = rawData
      .filter((item: any) => item.OBS_VALUE !== null && item.OBS_VALUE !== undefined && !isNaN(Number(item.OBS_VALUE)))
      .map((item: any) => ({
        year: item.TIME_PERIOD,
        value: parseFloat(item.OBS_VALUE),
      }));
    return formattedData.sort((a, b) => parseInt(a.year) - parseInt(b.year));
  } catch (error) {
    console.error('Error fetching GDP data:', error);
    throw error;
  }
};

export interface CreditCardUsageItem {
  year: string;
  value: number;
  unit?: string;
}

export const fetchCreditCardUsage = async (unitMeasure?: string, countryCode: string = 'MYS'): Promise<CreditCardUsageItem[]> => {
  try {
    const params: any = {};
    if (unitMeasure) params.unit_measure = unitMeasure;
    if (countryCode) params.country = countryCode;
    const response = await axios.get(`${API_BASE_URL}/credit-card-usage`, { params });
    const rawData = Array.isArray(response.data.data?.value)
      ? response.data.data.value
      : Array.isArray(response.data.data)
        ? response.data.data
        : [];
    const formattedData: CreditCardUsageItem[] = rawData
      .filter((item: any) => item.OBS_VALUE !== null && item.OBS_VALUE !== undefined && !isNaN(Number(item.OBS_VALUE)))
      .map((item: any) => ({
        year: item.TIME_PERIOD,
        value: parseFloat(item.OBS_VALUE),
        unit: item.UNIT_MEASURE
      }));
    return formattedData.sort((a, b) => parseInt(a.year) - parseInt(b.year));
  } catch (error) {
    console.error('Error fetching credit card usage data:', error);
    throw error;
  }
};

export interface InflationDataItem {
  year: string;
  value: number;
}

export const fetchInflation = async (countryCode: string = 'MYS'): Promise<InflationDataItem[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/inflation`, { params: { country: countryCode } });
    const rawData = Array.isArray(response.data.data?.value)
      ? response.data.data.value
      : Array.isArray(response.data.data)
        ? response.data.data
        : [];
    const formattedData: InflationDataItem[] = rawData
      .filter((item: any) => item.OBS_VALUE !== null && item.OBS_VALUE !== undefined && !isNaN(Number(item.OBS_VALUE)))
      .map((item: any) => ({
        year: item.TIME_PERIOD,
        value: parseFloat(item.OBS_VALUE)
      }));
    return formattedData.sort((a, b) => parseInt(a.year) - parseInt(b.year));
  } catch (error) {
    console.error('Error fetching inflation data:', error);
    throw error;
  }
};

export interface CpiDataItem {
  year: string;
  value: number;
}

export const fetchCpi = async (countryCode: string = 'MYS'): Promise<CpiDataItem[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cpi`, { params: { country: countryCode } });
    const rawData = Array.isArray(response.data.data?.value)
      ? response.data.data.value
      : Array.isArray(response.data.data)
        ? response.data.data
        : [];
    const formattedData: CpiDataItem[] = rawData
      .filter((item: any) => item.OBS_VALUE !== null && item.OBS_VALUE !== undefined && !isNaN(Number(item.OBS_VALUE)))
      .map((item: any) => ({
        year: item.TIME_PERIOD,
        value: parseFloat(item.OBS_VALUE)
      }));
    return formattedData.sort((a, b) => parseInt(a.year) - parseInt(b.year));
  } catch (error) {
    console.error('Error fetching CPI data:', error);
    throw error;
  }
};

export interface MobileInternetBankingItem {
  year: string;
  value: number;
  unit?: string;
}

export const fetchMobileInternetBanking = async (unitMeasure?: string, countryCode: string = 'MYS'): Promise<MobileInternetBankingItem[]> => {
  try {
    const params: any = {};
    if (unitMeasure) params.unit_measure = unitMeasure;
    if (countryCode) params.country = countryCode;
    const response = await axios.get(`${API_BASE_URL}/mobile-internet-banking`, { params });
    const rawData = Array.isArray(response.data.data?.value)
      ? response.data.data.value
      : Array.isArray(response.data.data)
        ? response.data.data
        : [];
    const formattedData: MobileInternetBankingItem[] = rawData
      .filter((item: any) => item.OBS_VALUE !== null && item.OBS_VALUE !== undefined && !isNaN(Number(item.OBS_VALUE)))
      .map((item: any) => ({
        year: item.TIME_PERIOD,
        value: parseFloat(item.OBS_VALUE),
        unit: item.UNIT_MEASURE
      }));
    return formattedData.sort((a, b) => parseInt(a.year) - parseInt(b.year));
  } catch (error) {
    console.error('Error fetching mobile & internet banking data:', error);
    throw error;
  }
};