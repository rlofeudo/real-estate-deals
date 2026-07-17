import { Injectable, Signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  catchError,
  delay,
  map,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { createMockDeals } from '../../mocks/deals.mock';
import { Deal, DealFilters } from '../../models/deal.model';
import { DealState, initialDealState } from '../deal.state';
import { Action, Reducer } from '../lib/action';
import { ofType } from '../lib/of-type';
import { SignalStore } from '../lib/signal-store';
import * as DealActions from './deal.actions';
import { dealReducer } from './deal.reducer';
import {
  selectFilters,
  selectFormVm,
  selectListVm,
  selectPageIndex,
} from './deal.selectors';

@Injectable({ providedIn: 'root' })
export class DealStore extends SignalStore<DealState> {
  private nextId = 31;

  protected override readonly reducer: Reducer<DealState> = dealReducer;

  readonly listVm = selectListVm(this.state);
  readonly formVm = selectFormVm(this.state);
  readonly filters: Signal<DealFilters> = selectFilters(this.state);
  readonly pageIndex: Signal<number> = selectPageIndex(this.state);

  constructor(private readonly router: Router) {
    super();
    this.registerEffects();
    // Initial list load spinner settles after first paint delay.
    this.dispatch(DealActions.listLoadComplete());
  }

  protected getInitialState(): DealState {
    return {
      ...initialDealState(createMockDeals()),
      listLoading: true,
    };
  }

  setFilters(filters: DealFilters): void {
    this.dispatch(DealActions.setFilters(filters));
  }

  setPageIndex(pageIndex: number): void {
    this.dispatch(DealActions.setPageIndex(pageIndex));
  }

  clearFilters(): void {
    this.dispatch(DealActions.clearFilters());
  }

  loadDeal(id: number | null): void {
    this.dispatch(DealActions.loadDealRequested(id));
  }

  saveDeal(payload: Omit<Deal, 'id'>): void {
    this.dispatch(DealActions.saveDealRequested(payload));
  }

  private registerEffects(): void {
    this.onAction((actions$) =>
      actions$.pipe(
        ofType(
          DealActions.setFilters,
          DealActions.setPageIndex,
          DealActions.clearFilters
        ),
        switchMap(() =>
          of(DealActions.listLoadComplete()).pipe(delay(200))
        ),
        tap((action) => this.dispatch(action))
      )
    );

    this.onAction((actions$) =>
      actions$.pipe(
        ofType<Action & { payload: number | null }>(
          DealActions.loadDealRequested
        ),
        switchMap(({ payload: id }) => {
          if (id !== null && (Number.isNaN(id) || id < 1)) {
            return of(DealActions.loadDealFailure('Invalid deal id'));
          }

          if (id === null) {
            return of(DealActions.loadDealSuccess(null)).pipe(delay(100));
          }

          return this.findDeal(id).pipe(
            delay(150),
            map((deal) => DealActions.loadDealSuccess(deal)),
            catchError((err: Error) =>
              of(DealActions.loadDealFailure(err.message))
            )
          );
        }),
        tap((action) => this.dispatch(action))
      )
    );

    this.onAction((actions$) =>
      actions$.pipe(
        ofType<Action & { payload: Omit<Deal, 'id'> }>(
          DealActions.saveDealRequested
        ),
        switchMap(({ payload }) => {
          const selectedId = this.state().selectedDealId;

          if (selectedId === null) {
            const created: Deal = { ...payload, id: this.nextId++ };
            return of(DealActions.saveDealSuccess(created)).pipe(delay(200));
          }

          const exists = this.state().deals.some((d) => d.id === selectedId);
          if (!exists) {
            return of(
              DealActions.saveDealFailure(`Deal ${selectedId} not found`)
            ).pipe(delay(150));
          }

          const updated: Deal = { id: selectedId, ...payload };
          return of(DealActions.saveDealSuccess(updated)).pipe(delay(200));
        }),
        tap((action) => this.dispatch(action))
      )
    );

    this.onAction((actions$) =>
      actions$.pipe(
        ofType(DealActions.saveDealSuccess),
        tap(() => {
          void this.router.navigate(['/deals']);
        })
      )
    );
  }

  private findDeal(id: number) {
    const deal = this.state().deals.find((d) => d.id === id);
    if (!deal) {
      return throwError(() => new Error(`Deal ${id} not found`));
    }
    return of({ ...deal });
  }
}
