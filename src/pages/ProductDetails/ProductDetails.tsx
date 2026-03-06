import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { productService } from '@/services/productService';

export const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getById(id as string),
    enabled: !!id,
  });

  if (isLoading)
    return <div className="p-10 text-center text-xl">Loading product...</div>;
  if (isError || !product)
    return (
      <div className="p-10 text-center text-red-500">
        Error loading product!
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div className="flex h-[500px] items-center justify-center overflow-hidden rounded-lg bg-gray-200">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="mb-4 text-4xl font-bold">{product.title}</h1>
          <p className="mb-6 text-gray-600">
            {product.description || 'No info available'}
          </p>
          <div className="mb-8 text-2xl font-bold">${product.price}</div>
        </div>
      </div>
    </div>
  );
};
