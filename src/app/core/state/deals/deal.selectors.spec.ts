import { signal } from '@angular/core';
import { createMockDeals } from '../../mocks/deals.mock';
import { initialDealState } from '../deal.state';
import {
  selectDeals,
  selectFilters,
  selectFormVm,
  selectListVm,
  selectPageIndex,
} from './deal.selectors';

describe('deal selectors', () => {
  it('builds list and form view models', () => {
    const state = signal(initialDealState(createMockDeals()));

    expect(selectDeals(state)().length).toBe(30);
    expect(selectPageIndex(state)()).toBe(0);
    expect(selectFilters(state)().priceOperator).toBe('greater');
    expect(selectListVm(state)().items.length).toBe(10);
    expect(selectListVm(state)().filterSummary).toBe('Showing all deals');

    state.update((current) => ({
      ...current,
      selectedDealId: 1,
      selectedDeal: current.deals[0],
      filters: {
        name: 'Harbor',
        purchasePrice: 5_000_000,
        priceOperator: 'greater',
      },
    }));

    const list = selectListVm(state)();
    expect(list.nameSearch).toBe('Harbor');
    expect(list.priceFilterActive).toBe(true);
    expect(list.filterSummary).toContain('price >');

    const form = selectFormVm(state)();
    expect(form.isEditMode).toBe(true);
    expect(form.pageTitle).toBe('Edit deal');
  });

  it('applies less-than price filter in listVm', () => {
    const state = signal({
      ...initialDealState(createMockDeals()),
      filters: {
        name: '',
        purchasePrice: 3_000_000,
        priceOperator: 'less' as const,
      },
    });

    const list = selectListVm(state)();
    expect(list.items.every((d) => d.purchasePrice < 3_000_000)).toBe(true);
    expect(list.filterSummary).toContain('price <');
  });

  it('ignores NaN purchase prices in filters', () => {
    const state = signal({
      ...initialDealState(createMockDeals()),
      filters: {
        name: '',
        purchasePrice: Number.NaN,
        priceOperator: 'greater' as const,
      },
    });

    expect(selectListVm(state)().total).toBe(30);
  });
});
