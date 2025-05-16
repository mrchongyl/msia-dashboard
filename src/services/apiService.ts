import axios from 'axios';
import { GdpDataItem } from '../types/gdpTypes';

// API base URL - points to our Flask backend
const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Fetches GDP per capita data from the API
 * @returns {Promise<GdpDataItem[]>} Array of GDP data items
 */
export const fetchGdpPerCapita = async (): Promise<GdpDataItem[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/gdp-per-capita`);
    console.log('API raw response:', response.data);
    
    // Extract the data from the response
    const rawData = Array.isArray(response.data.data?.value) ? response.data.data.value : [];
    
    // Transform the data into our format
    const formattedData: GdpDataItem[] = rawData.map((item: any) => ({
      year: item.TIME_PERIOD,
      value: parseFloat(item.OBS_VALUE),
    }));
    
    // Sort by year ascending
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

export const fetchCreditCardUsage = async (unitMeasure?: string): Promise<CreditCardUsageItem[]> => {
  try {
    const params: any = {};
    if (unitMeasure) params.unit_measure = unitMeasure;
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

export const fetchInflation = async (): Promise<InflationDataItem[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/inflation`);
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

export const fetchCpi = async (): Promise<CpiDataItem[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cpi`);
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