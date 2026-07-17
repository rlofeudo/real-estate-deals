export interface Deal {
  id: number;
  name: string;
  purchasePrice: number;
  address: string;
  noi: number;
}

/** Cap rate as a percentage: (NOI / Purchase Price) * 100. */
export function calculateCapRate(
  noi: number,
  purchasePrice: number
): number | null {
  if (!purchasePrice || purchasePrice <= 0 || Number.isNaN(noi)) {
    return null;
  }
  return (noi / purchasePrice) * 100;
}

export function formatCapRate(capRate: number | null): string {
  if (capRate === null || Number.isNaN(capRate)) {
    return '—';
  }
  return `${capRate.toFixed(2)}%`;
}

export type PriceFilterOperator = 'greater' | 'less';

export interface DealFilters {
  name: string;
  purchasePrice: number | null;
  priceOperator: PriceFilterOperator;
}

export interface DealPage {
  items: Deal[];
  total: number;
  page: number;
  pageSize: number;
}
