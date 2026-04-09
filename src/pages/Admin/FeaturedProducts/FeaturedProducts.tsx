import { useEffect, useState } from 'react';
import { Loader2, PackageSearch, Plus, Trash2 } from 'lucide-react';

import { AdminPageHeader, Button, SearchInput } from '@/components';
import { NEW_ARRIVALS_LIMIT } from '@/constants';
import { apiClient } from '@/services/api';
import type { Product } from '@/types/product.types';

type FeaturedProductItem = Pick<Product, 'title' | 'price' | 'imageUrl'> & {
  _id: string;
};

interface FeaturedResponse {
  productId: FeaturedProductItem | string;
  type: string;
  position: number;
}
export function FeaturedProducts() {
  const [allProducts, setAllProducts] = useState<FeaturedProductItem[]>([]);
  const [featured, setFeatured] = useState<FeaturedProductItem[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, featuredRes] = await Promise.all([
          apiClient.get<{ items: FeaturedProductItem[] }>(
            '/products?status=active',
          ),
          apiClient.get<FeaturedResponse[]>('/featured-products/new-arrivals'),
        ]);

        if (productsRes && 'items' in productsRes) {
          setAllProducts(productsRes.items);
        } else {
          setAllProducts(Array.isArray(productsRes) ? productsRes : []);
        }

        const extractedProducts = (featuredRes || [])
          .map((item) =>
            typeof item.productId === 'object' ? item.productId : null,
          )
          .filter((p): p is FeaturedProductItem => p !== null);

        setFeatured(extractedProducts);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddProduct = async (product: FeaturedProductItem) => {
    if (featured.length >= NEW_ARRIVALS_LIMIT) return;
    try {
      setIsActionLoading(true);
      await apiClient.post('/featured-products', {
        productId: product._id,
        type: 'new_arrival',
        position: featured.length,
      });

      setFeatured((prev) => [...prev, product]);
      setSearch('');
    } catch (error) {
      console.error('Add error:', error);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleRemoveProduct = async (productId: string) => {
    try {
      setIsActionLoading(true);
      await apiClient.delete(
        `/featured-products/${productId}?type=new_arrival`,
      );

      setFeatured((prev) => prev.filter((p) => p._id !== productId));
    } catch (error) {
      console.error('Remove error:', error);
    } finally {
      setIsActionLoading(false);
    }
  };

  const dropdownResults = (Array.isArray(allProducts) ? allProducts : [])
    .filter(
      (p) =>
        p.title.toLowerCase().includes(search.toLowerCase()) &&
        !featured.some((f) => f._id === p._id),
    )
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-800" />
      </div>
    );
  }

  return (
    <div className="pb-10">
      <AdminPageHeader />

      <div className="px-4 pt-6 md:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-3xl font-bold text-gray-900">
            Manage New Arrivals
          </h2>
          <div
            className={`rounded-full px-3 py-1 text-sm font-bold ${
              featured.length >= NEW_ARRIVALS_LIMIT
                ? 'bg-red-100 text-red-600'
                : 'bg-blue-100 text-blue-800'
            }`}
          >
            {featured.length} / {NEW_ARRIVALS_LIMIT} Items
          </div>
        </div>

        <div className="relative mb-8 rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between font-semibold text-gray-700">
            <span>Add Product to Homepage</span>
            {isActionLoading && (
              <Loader2 className="h-5 w-5 animate-spin text-blue-800" />
            )}
          </div>

          <div className="max-w-md">
            <SearchInput
              value={search}
              onChange={setSearch}
              className={`[&_button]:right-3 [&_button]:!border-none [&_button]:!bg-transparent [&_button]:!shadow-none [&_button]:hover:!bg-gray-100 ${
                featured.length >= NEW_ARRIVALS_LIMIT
                  ? 'cursor-not-allowed opacity-50'
                  : ''
              }`}
              disabled={featured.length >= NEW_ARRIVALS_LIMIT}
            />
          </div>

          {search && featured.length < NEW_ARRIVALS_LIMIT && (
            <div className="absolute right-6 left-6 z-50 mt-2 max-w-md overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl">
              {dropdownResults.length > 0 ? (
                dropdownResults.map((product) => (
                  <button
                    key={product._id}
                    onClick={() => handleAddProduct(product)}
                    className="flex w-full items-center justify-between border-b border-gray-100 p-4 transition-colors last:border-0 hover:bg-gray-50"
                  >
                    <div className="text-left font-medium text-gray-700">
                      {product.title}
                    </div>
                    <Plus className="h-5 w-5 text-blue-800" />
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-gray-400">
                  No active products found
                </div>
              )}
            </div>
          )}
        </div>

        <div className="rounded-lg border border-[#e5e7eb] bg-white shadow-md">
          <div className="border-b border-[#e5e7eb] bg-gray-50 px-6 py-4">
            <span className="text-sm font-bold tracking-wider text-gray-600 uppercase">
              Current Homepage List
            </span>
          </div>

          <div className="divide-y divide-gray-100">
            {featured.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <PackageSearch size={48} className="mb-2 opacity-20" />
                <p>
                  The list is empty. Add products to show them on Home page.
                </p>
              </div>
            ) : (
              featured.map((product) => (
                <div
                  key={product._id}
                  className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-gray-50/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border border-gray-100 bg-gray-50">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-gray-300">
                          <Plus size={16} />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-gray-800">
                        {product.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        ${product.price}
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => handleRemoveProduct(product._id)}
                    className="!p-2 text-gray-400 hover:!border-red-500 hover:!text-red-500"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
