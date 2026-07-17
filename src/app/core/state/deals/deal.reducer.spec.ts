import { createMockDeals } from '../../mocks/deals.mock';
import { DEFAULT_FILTERS, initialDealState } from '../deal.state';
import * as DealActions from './deal.actions';
import { dealReducer } from './deal.reducer';

describe('dealReducer', () => {
  const base = initialDealState(createMockDeals());

  it('sets filters and resets page', () => {
    const state = dealReducer(
      { ...base, pageIndex: 2 },
      DealActions.setFilters({
        name: 'Harbor',
        purchasePrice: null,
        priceOperator: 'greater',
      })
    );

    expect(state.filters.name).toBe('Harbor');
    expect(state.pageIndex).toBe(0);
    expect(state.listLoading).toBe(true);
  });

  it('sets page index', () => {
    const state = dealReducer(base, DealActions.setPageIndex(2));
    expect(state.pageIndex).toBe(2);
    expect(state.listLoading).toBe(true);
  });

  it('clears filters', () => {
    const state = dealReducer(
      {
        ...base,
        filters: { name: 'X', purchasePrice: 1, priceOperator: 'less' },
        pageIndex: 3,
      },
      DealActions.clearFilters()
    );
    expect(state.filters).toEqual(DEFAULT_FILTERS);
    expect(state.pageIndex).toBe(0);
  });

  it('completes list loading', () => {
    const state = dealReducer(
      { ...base, listLoading: true },
      DealActions.listLoadComplete()
    );
    expect(state.listLoading).toBe(false);
  });

  it('handles load deal request/success/failure', () => {
    const requested = dealReducer(base, DealActions.loadDealRequested(1));
    expect(requested.formLoading).toBe(true);
    expect(requested.selectedDealId).toBe(1);

    const deal = base.deals[0];
    const success = dealReducer(requested, DealActions.loadDealSuccess(deal));
    expect(success.formLoading).toBe(false);
    expect(success.selectedDeal).toEqual(deal);

    const failure = dealReducer(
      requested,
      DealActions.loadDealFailure('missing')
    );
    expect(failure.formError).toBe('missing');
    expect(failure.selectedDeal).toBeNull();
    expect(failure.selectedDealId).toBe(1);
  });

  it('handles save create and update', () => {
    const created = {
      id: 99,
      name: 'New',
      purchasePrice: 1,
      address: 'a',
      noi: 1,
    };
    const afterCreate = dealReducer(
      { ...base, formSaving: true },
      DealActions.saveDealSuccess(created)
    );
    expect(afterCreate.deals).toHaveLength(31);
    expect(afterCreate.formSaving).toBe(false);

    const updated = { ...created, name: 'Updated' };
    const afterUpdate = dealReducer(
      afterCreate,
      DealActions.saveDealSuccess(updated)
    );
    expect(afterUpdate.deals.find((d) => d.id === 99)?.name).toBe('Updated');
  });

  it('handles save request and failure', () => {
    const requested = dealReducer(base, DealActions.saveDealRequested({
      name: 'x',
      purchasePrice: 1,
      address: 'a',
      noi: 0,
    }));
    expect(requested.formSaving).toBe(true);

    const failed = dealReducer(
      requested,
      DealActions.saveDealFailure('nope')
    );
    expect(failed.formSaving).toBe(false);
    expect(failed.formError).toBe('nope');
  });

  it('returns state for unknown actions', () => {
    expect(dealReducer(base, { type: '[Unknown]', payload: undefined })).toBe(
      base
    );
  });
});
