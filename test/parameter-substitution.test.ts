import { describe, expect, it } from 'vitest';
import { formatParameterValue, ParameterType } from '../src/lib/shared-query/index.js';

const timestamp = (value: string) =>
  formatParameterValue({ name: 'ts', paramType: ParameterType.Timestamp, value, isUsed: true });

describe('timestamp parameters', () => {
  it('keeps the wall clock time the user typed, whatever the machine time zone', () => {
    expect(timestamp('2024-01-01 10:00:00')).toBe("TIMESTAMP '2024-01-01 10:00:00'");
    expect(timestamp('2024-01-01T23:30:00')).toBe("TIMESTAMP '2024-01-01 23:30:00'");
  });

  it('reads a bare date as midnight', () => {
    expect(timestamp('2024-01-01')).toBe("TIMESTAMP '2024-01-01 00:00:00'");
  });

  it('rejects values that are not a real calendar time', () => {
    expect(() => timestamp('2024-13-01 10:00:00')).toThrow('Invalid timestamp value');
    expect(() => timestamp('2024-02-30 10:00:00')).toThrow('Invalid timestamp value');
    expect(() => timestamp('2024-01-01 24:00:00')).toThrow('Invalid timestamp value');
    expect(() => timestamp('10:00')).toThrow('Invalid timestamp format');
  });
});
