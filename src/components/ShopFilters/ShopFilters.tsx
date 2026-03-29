import { useSearchParams } from 'react-router-dom';

import { CategoryDropdown, Dropdown } from '@/components/Dropdown';
import { useShopCategories } from '@/hooks/useShopCategories';

const PRICE_OPTIONS = [
  { label: 'Under $500', value: '0-500' },
  { label: '$500 - $1000', value: '500-1000' },
  { label: '$1000 - $2000', value: '1000-2000' },
  { label: 'Over $2000', value: '2000+' },
];

const getSelectedCategories = (searchParams: URLSearchParams) => {
  const categories = searchParams
    .getAll('category')
    .flatMap((value) => value.split(','))
    .map((value) => value.trim())
    .filter(Boolean);

  if (categories.length) {
    return categories;
  }

  const legacyCategory = searchParams.get('category');

  return legacyCategory
    ? legacyCategory
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean)
    : [];
};

export function ShopFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: categories = [], isLoading, isError } = useShopCategories();

  const categoryOptions = categories.map((c) => ({
    label: c.title,
    value: String(c.id),
  }));

  const currentCategory = getSelectedCategories(searchParams);
  const isCategoryDisabled =
    isLoading || isError || categoryOptions.length === 0;
  const categoryPlaceholder = isLoading
    ? 'Loading categories...'
    : isError
      ? 'Failed to load categories'
      : categoryOptions.length === 0
        ? 'No categories available'
        : 'All Electronics';
  const selectedCategoryLabels = currentCategory
    .map((v) => categoryOptions.find((o) => o.value === v)?.label)
    .filter(Boolean)
    .join(', ');
  const categoryLabel = selectedCategoryLabels || categoryPlaceholder;

  const handleCategoryChange = (values: { value: string }[]) => {
    const filtered = values.map((v) => v.value).filter(Boolean);

    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);

      next.delete('category');
      filtered.forEach((value) => {
        next.append('category', value);
      });
      next.set('page', '1');

      return next;
    });
  };

  const currentPriceValue =
    searchParams.get('minPrice') && searchParams.get('maxPrice')
      ? `${searchParams.get('minPrice')}-${searchParams.get('maxPrice')}`
      : searchParams.get('minPrice')
        ? `${searchParams.get('minPrice')}+`
        : '';

  const priceLabel = currentPriceValue
    ? (PRICE_OPTIONS.find((o) => o.value === currentPriceValue)?.label ??
      'All Price')
    : 'All Price';
  const handlePriceChange = (values: { value: string }[]) => {
    const value = values[values.length - 1]?.value ?? '';

    setSearchParams((prev) => {
      if (!value) {
        prev.delete('minPrice');
        prev.delete('maxPrice');
      } else if (value === '2000+') {
        prev.set('minPrice', '2000');
        prev.delete('maxPrice');
      } else {
        const [min, max] = value.split('-');
        prev.set('minPrice', min);
        prev.set('maxPrice', max);
      }
      prev.set('page', '1');
      return prev;
    });
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <CategoryDropdown
        label="Categories"
        options={categoryOptions}
        multiple={true}
        onChange={handleCategoryChange}
        placeholder={categoryLabel}
        selectedValues={currentCategory}
        disabled={isCategoryDisabled}
      />
      <Dropdown
        label="Price"
        options={PRICE_OPTIONS}
        multiple={true}
        onChange={handlePriceChange}
        placeholder={priceLabel}
        selectedValues={currentPriceValue ? [currentPriceValue] : []}
      />
    </div>
  );
}
