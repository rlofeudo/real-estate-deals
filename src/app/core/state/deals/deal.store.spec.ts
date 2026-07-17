import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DealStore } from './deal.store';

describe('DealStore', () => {
  let store: DealStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'deals', children: [] },
          { path: 'login', children: [] },
        ]),
      ],
    });
    store = TestBed.inject(DealStore);
  });

  it('starts with 30 deals and settles list loading', fakeAsync(() => {
    expect(store.state().deals.length).toBe(30);
    // constructor dispatches listLoadComplete synchronously
    expect(store.listVm().loading).toBe(false);
    expect(store.listVm().items.length).toBe(10);
  }));

  it('filters by name through actions/effects', fakeAsync(() => {
    store.setFilters({
      name: 'Harbor',
      purchasePrice: null,
      priceOperator: 'greater',
    });
    expect(store.listVm().loading).toBe(true);
    tick(200);

    const vm = store.listVm();
    expect(vm.loading).toBe(false);
    expect(vm.total).toBe(1);
    expect(vm.items[0].name).toContain('Harbor');
  }));

  it('filters by purchase price less than', fakeAsync(() => {
    store.setFilters({
      name: '',
      purchasePrice: 3_000_000,
      priceOperator: 'less',
    });
    tick(200);

    expect(
      store.listVm().items.every((d) => d.purchasePrice < 3_000_000)
    ).toBe(true);
  }));

  it('paginates via setPageIndex', fakeAsync(() => {
    store.setPageIndex(1);
    tick(200);
    expect(store.pageIndex()).toBe(1);
    expect(store.listVm().pageIndex).toBe(1);
  }));

  it('clears filters', fakeAsync(() => {
    store.setFilters({
      name: 'Harbor',
      purchasePrice: 1_000_000,
      priceOperator: 'less',
    });
    tick(200);
    store.clearFilters();
    tick(200);

    expect(store.filters()).toEqual({
      name: '',
      purchasePrice: null,
      priceOperator: 'greater',
    });
    expect(store.listVm().total).toBe(30);
  }));

  it('loads a deal for edit', fakeAsync(() => {
    store.loadDeal(1);
    expect(store.formVm().loading).toBe(true);
    tick(150);

    expect(store.formVm().loading).toBe(false);
    expect(store.formVm().deal?.id).toBe(1);
    expect(store.formVm().pageTitle).toBe('Edit deal');
  }));

  it('loads create form', fakeAsync(() => {
    store.loadDeal(null);
    tick(100);
    expect(store.formVm().isEditMode).toBe(false);
    expect(store.formVm().pageTitle).toBe('Add deal');
  }));

  it('handles invalid and missing deal ids', fakeAsync(() => {
    store.loadDeal(Number.NaN);
    expect(store.formVm().error).toBe('Invalid deal id');

    store.loadDeal(9999);
    tick(150);
    expect(store.formVm().error).toBe('Deal 9999 not found');
  }));

  it('creates a deal via saveDeal', fakeAsync(() => {
    store.loadDeal(null);
    tick(100);

    store.saveDeal({
      name: 'Created',
      purchasePrice: 1_000_000,
      address: '1 St',
      noi: 50_000,
    });
    tick(200);

    expect(store.state().deals.length).toBe(31);
    expect(store.state().deals.some((d) => d.name === 'Created')).toBe(true);
  }));

  it('updates a deal via saveDeal', fakeAsync(() => {
    store.loadDeal(1);
    tick(150);

    store.saveDeal({
      name: 'Updated Name',
      purchasePrice: 2_000_000,
      address: '2 St',
      noi: 80_000,
    });
    tick(200);

    expect(store.state().deals.find((d) => d.id === 1)?.name).toBe(
      'Updated Name'
    );
  }));

  it('exposes select() projectors from the base store', () => {
    const dealsCount = store.select((state) => state.deals.length);
    expect(dealsCount()).toBe(30);
  });

  it('fails save when selected deal is missing', fakeAsync(() => {
    store.loadDeal(9999);
    tick(0);

    expect(store.formVm().error).toBe('Deal 9999 not found');
    expect(store.state().selectedDealId).toBe(9999);

    store.saveDeal({
      name: 'Ghost',
      purchasePrice: 1,
      address: 'x',
      noi: 0,
    });
    tick(200);

    expect(store.formVm().error).toBe('Deal 9999 not found');
    expect(store.formVm().saving).toBe(false);
  }));
});
