import { calculateCapRate, formatCapRate } from './deal.model';

describe('cap rate helpers', () => {
  it('calculates cap rate as NOI / purchase price as a percent', () => {
    expect(calculateCapRate(50_000, 1_000_000)).toBe(5);
  });

  it('returns null when purchase price is missing or zero', () => {
    expect(calculateCapRate(50_000, 0)).toBeNull();
    expect(calculateCapRate(50_000, -1)).toBeNull();
  });

  it('formats cap rate for display', () => {
    expect(formatCapRate(5)).toBe('5.00%');
    expect(formatCapRate(null)).toBe('—');
  });
});
