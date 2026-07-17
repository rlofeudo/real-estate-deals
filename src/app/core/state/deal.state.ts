import { Deal, DealFilters, DealPage } from '../models/deal.model';

export interface DealState {
  deals: Deal[];
  filters: DealFilters;
  pageIndex: number;
  pageSize: number;
  listLoading: boolean;
  formLoading: boolean;
  formSaving: boolean;
  formError: string | null;
  selectedDealId: number | null;
  selectedDeal: Deal | null;
}

export interface DealListViewModel {
  items: Deal[];
  total: number;
  pageIndex: number;
  pageSize: number;
  loading: boolean;
  filters: DealFilters;
  filterSummary: string;
  nameSearch: string;
  priceFilterActive: boolean;
}

export interface DealFormViewModel {
  dealId: number | null;
  deal: Deal | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  isEditMode: boolean;
  pageTitle: string;
}

export const DEFAULT_FILTERS: DealFilters = {
  name: '',
  purchasePrice: null,
  priceOperator: 'greater',
};

export const initialDealState = (deals: Deal[]): DealState => ({
  deals,
  filters: { ...DEFAULT_FILTERS },
  pageIndex: 0,
  pageSize: 10,
  listLoading: false,
  formLoading: false,
  formSaving: false,
  formError: null,
  selectedDealId: null,
  selectedDeal: null,
});

export type DealPageResult = DealPage;
