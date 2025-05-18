export interface EconomicData {
  country: string;
  year: number;
  value: number;
}

export interface EconomicDataResponse {
  data: EconomicData[];
  source: string;
}

// Types for World Bank data

export type TimeRange = 'all' | 'last5' | 'last10' | 'last20' | 'last30' | 'since2000';

export interface GdpDataItem {
  year: string;
  value: number;
}

export interface GdpDataSummary {
  startYear: string;
  endYear: string;
  latest: number;
  peak: {
    year: string;
    value: number;
  };
  growthSince2000: number;
}

export type CreditCardUsageItem = {
  year: string;
  value: number;
};

export interface MobileInternetBankingItem {
  year: string;
  value: number;
  unit?: string;
}

export interface InflationDataItem {
  year: string;
  value: number;
}

export interface CpiDataItem {
  year: string;
  value: number;
}

// Raw World Bank API response type
export interface WorldBankApiResponse {
  data: {
    OBS_VALUE: string;
    DATABASE_ID: string;
    INDICATOR: string;
    REF_AREA: string;
    TIME_PERIOD: string;
  }[];
}