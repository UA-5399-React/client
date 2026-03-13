import { useSearchParams } from 'react-router-dom';

import { Dropdown } from '@/components/Dropdown';

const CATEGORY_OPTIONS = [
  { label: 'Laptop', value: 'Laptop' },
  { label: 'Apple', value: 'Apple' },
  { label: 'Audio', value: 'Audio' },
];

const PRICE_OPTIONS = [
  { label: 'Under $500', value: '0-500' },
  { label: '$500 - $1000', value: '500-1000' },
  { label: '$1000 - $2000', value: '1000-2000' },
  { label: 'Over $2000', value: '2000+' },
];

export function ShopFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get('category')?.split(',') || [];
  const categoryLabel = currentCategory.length
    ? currentCategory
        .map((v) => CATEGORY_OPTIONS.find((o) => o.value === v)?.label)
        .filter(Boolean)
        .join(', ')
    : 'All Electronics';
  const handleCategoryChange = (values: { value: string }[]) => {
    const filtered = values.map((v) => v.value).filter(Boolean);

    setSearchParams((prev) => {
      if (filtered.length) {
        prev.set('category', filtered.join(','));
      } else {
        prev.delete('category');
      }
      prev.set('page', '1');
      return prev;
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
      <Dropdown
        label="Categories"
        options={CATEGORY_OPTIONS}
        multiple={true}
        onChange={handleCategoryChange}
        placeholder={categoryLabel}
        selectedValues={currentCategory}
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
