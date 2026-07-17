import { createAction, createPayloadAction } from '../lib/action';
import { Deal, DealFilters } from '../../models/deal.model';

export const setFilters = createPayloadAction<DealFilters>('[Deals] Set Filters');
export const setPageIndex = createPayloadAction<number>('[Deals] Set Page Index');
export const clearFilters = createAction('[Deals] Clear Filters');
export const listLoadComplete = createAction('[Deals] List Load Complete');

export const loadDealRequested = createPayloadAction<number | null>(
  '[Deals] Load Deal Requested'
);
export const loadDealSuccess = createPayloadAction<Deal | null>(
  '[Deals] Load Deal Success'
);
export const loadDealFailure = createPayloadAction<string>(
  '[Deals] Load Deal Failure'
);

export const saveDealRequested = createPayloadAction<Omit<Deal, 'id'>>(
  '[Deals] Save Deal Requested'
);
export const saveDealSuccess = createPayloadAction<Deal>(
  '[Deals] Save Deal Success'
);
export const saveDealFailure = createPayloadAction<string>(
  '[Deals] Save Deal Failure'
);
