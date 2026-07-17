import { DestroyRef, Injectable, Signal, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, Subject } from 'rxjs';
import { Action, Reducer } from './action';

@Injectable()
export abstract class SignalStore<S extends object> {
  private readonly destroyRef = inject(DestroyRef);
  private readonly stateSignal = signal(this.getInitialState());
  private readonly actionsSubject = new Subject<Action>();

  /** Full state signal (readonly). */
  readonly state: Signal<S> = this.stateSignal.asReadonly();

  /** Stream of dispatched actions for effects. */
  readonly actions$: Observable<Action> = this.actionsSubject.asObservable();

  protected abstract getInitialState(): S;
  protected abstract reducer: Reducer<S>;

  dispatch(action: Action): void {
    this.stateSignal.update((current) => this.reducer(current, action));
    this.actionsSubject.next(action);
  }

  select<R>(projector: (state: S) => R): Signal<R> {
    return computed(() => projector(this.stateSignal()));
  }

  protected onAction(
    effectFactory: (actions$: Observable<Action>) => Observable<unknown>
  ): void {
    effectFactory(this.actions$)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
