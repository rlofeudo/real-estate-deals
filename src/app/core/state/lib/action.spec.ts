import { firstValueFrom, of } from 'rxjs';
import { createAction, createPayloadAction } from './action';
import { ofType } from './of-type';

describe('state lib', () => {
  it('createAction builds empty and payload actions', () => {
    const ping = createAction('[Test] Ping');
    const setValue = createPayloadAction<number>('[Test] Set Value');

    expect(ping.type).toBe('[Test] Ping');
    expect(ping()).toEqual({ type: '[Test] Ping', payload: undefined });
    expect(setValue(3)).toEqual({ type: '[Test] Set Value', payload: 3 });
  });

  it('ofType filters matching actions by creator or type string', async () => {
    const ping = createAction('[Test] Ping');
    const pong = createAction('[Test] Pong');

    const byCreator = await firstValueFrom(
      of(ping(), pong(), ping()).pipe(ofType(ping))
    );
    expect(byCreator.type).toBe('[Test] Ping');

    const byString = await firstValueFrom(
      of(ping(), pong()).pipe(ofType('[Test] Pong'))
    );
    expect(byString.type).toBe('[Test] Pong');
  });
});
