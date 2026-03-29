import { describe, expect, it } from 'vitest';

import { splitFullName } from './string.utils';

describe('utils: splitFullName', () => {
  it('splits the first word into firstName and the rest into lastName', () => {
    expect(splitFullName('John Ronald Reuel')).toEqual({
      firstName: 'John',
      lastName: 'Ronald Reuel',
    });
  });

  it('returns undefined names when value is empty', () => {
    expect(splitFullName('   ')).toEqual({
      firstName: undefined,
      lastName: undefined,
    });
  });
});
