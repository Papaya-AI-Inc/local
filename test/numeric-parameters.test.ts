import { describe, expect, it } from 'vitest';
import { formatParameterValue, ParameterType } from '../src/lib/shared-query/index.js';

const format = (paramType: ParameterType, value: string) =>
  formatParameterValue({ name: 'n', paramType, value, isUsed: true });

describe('numeric parameters', () => {
  it('formats whole numbers', () => {
    expect(format(ParameterType.Int, '42')).toBe('42');
    expect(format(ParameterType.Int, '-7')).toBe('-7');
    expect(format(ParameterType.Long, '9007199254740993')).toBe('9007199254740993');
    expect(format(ParameterType.Double, '1.5')).toBe('1.5');
    expect(format(ParameterType.Double, '-2e3')).toBe('-2000');
  });

  it('rejects values with trailing text instead of truncating them', () => {
    expect(() => format(ParameterType.Int, '12abc')).toThrow('Invalid integer value');
    expect(() => format(ParameterType.Int, '1.9')).toThrow('Invalid integer value');
    expect(() => format(ParameterType.Long, '100 OR 1=1')).toThrow('Invalid integer value');
    expect(() => format(ParameterType.Double, '1.5abc')).toThrow('Invalid double value');
    expect(() => format(ParameterType.Double, 'Infinity')).toThrow('Invalid double value');
    expect(() => format(ParameterType.Double, '   ')).toThrow('Invalid double value');
  });
});
