import { Action } from './action';
import { OperatorFunction, filter } from 'rxjs';

export function ofType<A extends Action = Action>(
  ...allowed: Array<{ type: string } | string>
): OperatorFunction<Action, A> {
  const types = new Set(
    allowed.map((item) => (typeof item === 'string' ? item : item.type))
  );

  return filter((action: Action): action is A => types.has(action.type));
}
