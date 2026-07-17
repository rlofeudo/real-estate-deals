export type ActionType = string;

export interface Action<T extends ActionType = ActionType, P = unknown> {
  readonly type: T;
  readonly payload: P;
}

export type EmptyActionCreator = (() => Action<string, void>) & {
  type: string;
};

export type PayloadActionCreator<P> = ((payload: P) => Action<string, P>) & {
  type: string;
};

export function createAction(type: string): EmptyActionCreator {
  const creator = (() =>
    ({
      type,
      payload: undefined,
    }) as Action<string, void>) as EmptyActionCreator;
  creator.type = type;
  return creator;
}

export function createPayloadAction<P>(type: string): PayloadActionCreator<P> {
  const creator = ((payload: P) =>
    ({
      type,
      payload,
    }) as Action<string, P>) as PayloadActionCreator<P>;
  creator.type = type;
  return creator;
}

export type Reducer<S> = (state: S, action: Action) => S;
