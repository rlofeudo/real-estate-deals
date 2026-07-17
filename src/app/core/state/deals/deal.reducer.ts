import { Deal } from '../../models/deal.model';
import { DEFAULT_FILTERS, DealState } from '../deal.state';
import { Action } from '../lib/action';
import * as DealActions from './deal.actions';

export function dealReducer(state: DealState, action: Action): DealState {
  switch (action.type) {
    case DealActions.setFilters.type: {
      return {
        ...state,
        filters: { ...(action.payload as DealState['filters']) },
        pageIndex: 0,
        listLoading: true,
      };
    }
    case DealActions.setPageIndex.type:
      return {
        ...state,
        pageIndex: action.payload as number,
        listLoading: true,
      };
    case DealActions.clearFilters.type:
      return {
        ...state,
        filters: { ...DEFAULT_FILTERS },
        pageIndex: 0,
        listLoading: true,
      };
    case DealActions.listLoadComplete.type:
      return {
        ...state,
        listLoading: false,
      };
    case DealActions.loadDealRequested.type: {
      const id = action.payload as number | null;
      return {
        ...state,
        formLoading: true,
        formSaving: false,
        formError: null,
        selectedDealId: id,
        selectedDeal: null,
      };
    }
    case DealActions.loadDealSuccess.type:
      return {
        ...state,
        formLoading: false,
        formError: null,
        selectedDeal: action.payload as Deal | null,
      };
    case DealActions.loadDealFailure.type:
      return {
        ...state,
        formLoading: false,
        formError: action.payload as string,
        selectedDeal: null,
      };
    case DealActions.saveDealRequested.type:
      return {
        ...state,
        formSaving: true,
        formError: null,
      };
    case DealActions.saveDealSuccess.type: {
      const saved = action.payload as Deal;
      const index = state.deals.findIndex((d) => d.id === saved.id);
      const deals =
        index >= 0
          ? state.deals.map((d) => (d.id === saved.id ? saved : d))
          : [...state.deals, saved];

      return {
        ...state,
        deals,
        formSaving: false,
        formError: null,
        selectedDeal: saved,
        selectedDealId: saved.id,
      };
    }
    case DealActions.saveDealFailure.type:
      return {
        ...state,
        formSaving: false,
        formError: action.payload as string,
      };
    default:
      return state;
  }
}
