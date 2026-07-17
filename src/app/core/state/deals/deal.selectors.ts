import { Signal, computed } from '@angular/core';
import {
  Deal,
  DealFilters,
  PriceFilterOperator,
} from '../../models/deal.model';
import {
  DealFormViewModel,
  DealListViewModel,
  DealState,
} from '../deal.state';

export function selectDeals(state: Signal<DealState>): Signal<Deal[]> {
  return computed(() => state().deals);
}

export function selectFilters(state: Signal<DealState>): Signal<DealFilters> {
  return computed(() => state().filters);
}

export function selectPageIndex(state: Signal<DealState>): Signal<number> {
  return computed(() => state().pageIndex);
}

export function selectListVm(state: Signal<DealState>): Signal<DealListViewModel> {
  return computed(() => {
    const current = state();
    const filtered = applyFilters(current.deals, current.filters);
    const start = current.pageIndex * current.pageSize;
    const items = filtered.slice(start, start + current.pageSize);

    return {
      items,
      total: filtered.length,
      pageIndex: current.pageIndex,
      pageSize: current.pageSize,
      loading: current.listLoading,
      filters: current.filters,
      filterSummary: buildFilterSummary(current.filters),
      nameSearch: current.filters.name.trim(),
      priceFilterActive: current.filters.purchasePrice !== null,
    };
  });
}

export function selectFormVm(state: Signal<DealState>): Signal<DealFormViewModel> {
  return computed(() => {
    const current = state();
    const isEditMode = current.selectedDealId !== null;
    return {
      dealId: current.selectedDealId,
      deal: current.selectedDeal,
      loading: current.formLoading,
      saving: current.formSaving,
      error: current.formError,
      isEditMode,
      pageTitle: isEditMode ? 'Edit deal' : 'Add deal',
    };
  });
}

function buildFilterSummary(filters: DealFilters): string {
  const parts: string[] = [];
  if (filters.name.trim()) {
    parts.push(`name contains "${filters.name.trim()}"`);
  }
  if (filters.purchasePrice !== null) {
    parts.push(
      `price ${filters.priceOperator === 'greater' ? '>' : '<'} $${filters.purchasePrice.toLocaleString()}`
    );
  }
  return parts.length ? parts.join(' · ') : 'Showing all deals';
}

function applyFilters(deals: Deal[], filters: DealFilters): Deal[] {
  const nameQuery = filters.name.trim().toLowerCase();
  const price = filters.purchasePrice;
  const operator: PriceFilterOperator = filters.priceOperator;

  return deals.filter((deal) => {
    const matchesName =
      !nameQuery || deal.name.toLowerCase().includes(nameQuery);

    let matchesPrice = true;
    if (price !== null && !Number.isNaN(price)) {
      matchesPrice =
        operator === 'greater'
          ? deal.purchasePrice > price
          : deal.purchasePrice < price;
    }

    return matchesName && matchesPrice;
  });
}
