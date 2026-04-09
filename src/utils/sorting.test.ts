import { describe, expect, it } from 'vitest';

import { buildSortValue, parseSortValue } from './sorting';

describe('sorting utils', () => {
  describe('buildSortValue', () => {
    it('should build sort value for purchaseCount asc', () => {
      expect(buildSortValue('purchaseCount', 'asc')).toBe('purchaseCount-asc');
    });

    it('should build sort value for purchaseCount desc', () => {
      expect(buildSortValue('purchaseCount', 'desc')).toBe(
        'purchaseCount-desc',
      );
    });

    it('should build sort value for title desc', () => {
      expect(buildSortValue('title', 'desc')).toBe('title-desc');
    });

    it('should return updated-desc as fallback for unsupported combination', () => {
      expect(buildSortValue('updatedAt', 'asc')).toBe('updated-desc');
    });
  });

  describe('parseSortValue', () => {
    it('should parse purchaseCount-asc', () => {
      expect(parseSortValue('purchaseCount-asc')).toEqual({
        sort: 'purchaseCount',
        order: 'asc',
      });
    });

    it('should parse purchaseCount-desc', () => {
      expect(parseSortValue('purchaseCount-desc')).toEqual({
        sort: 'purchaseCount',
        order: 'desc',
      });
    });

    it('should parse updated-desc', () => {
      expect(parseSortValue('updated-desc')).toEqual({
        sort: 'updatedAt',
        order: 'desc',
      });
    });
  });
});
