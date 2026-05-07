import { useState } from 'react';
import { Download } from 'lucide-react';

import { Button } from '@/components';
import { EXPORT_TYPES, type ExportType } from '@/constants';
import {
  type ExportOrdersParams,
  type ExportProductsParams,
  exportService,
} from '@/services/exportService';
import { useErrorStore } from '@/store/errorStore';
import type { ProductsFilters } from '@/types/filters';

interface ExportButtonProductsProps {
  type: Extract<ExportType, 'products'>;
  filters?: ProductsFilters;
  search?: string;
}

interface ExportButtonOrdersProps {
  type: Extract<ExportType, 'orders'>;
  status?: string;
}

type ExportButtonProps = ExportButtonProductsProps | ExportButtonOrdersProps;

export function ExportButton(props: ExportButtonProps) {
  const { type } = props;
  const [isLoading, setIsLoading] = useState(false);
  const showMessage = useErrorStore((s) => s.show);

  const handleExport = async () => {
    setIsLoading(true);
    try {
      const isProducts = type === EXPORT_TYPES.PRODUCTS;
      const fileName = isProducts ? 'products_export' : 'orders_export';

      let blob: Blob;
      if (isProducts) {
        const p = props as ExportButtonProductsProps;
        const params: ExportProductsParams = {};
        if (p.filters) {
          if (p.filters.status) params.status = p.filters.status;
          if (p.filters.categories.length > 0)
            params.category = p.filters.categories;
          if (p.filters.minPrice) params.minPrice = p.filters.minPrice;
          if (p.filters.maxPrice) params.maxPrice = p.filters.maxPrice;
          if (p.filters.dateFrom) params.dateFrom = p.filters.dateFrom;
          if (p.filters.dateTo) params.dateTo = p.filters.dateTo;
          if (p.filters.dateField) params.dateField = p.filters.dateField;
        }
        if (p.search) params.search = p.search;
        blob = await exportService.exportProducts(params);
      } else {
        const p = props as ExportButtonOrdersProps;
        const params: ExportOrdersParams = {};
        if (p.status) params.status = p.status;
        blob = await exportService.exportOrders(params);
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${fileName}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      showMessage(
        'success',
        'Export Successful',
        `${type.charAt(0).toUpperCase() + type.slice(1)} exported successfully`,
      );
    } catch (error) {
      showMessage(
        'error',
        'Export Failed',
        `Failed to export ${type}. Please try again.`,
      );
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleExport}
      disabled={isLoading}
      className="ml-3 flex items-center gap-2 border border-gray-300 bg-transparent text-[rgb(var(--color-text))] hover:border-blue-500 hover:text-blue-500"
    >
      {isLoading ? (
        <span className="animate-spin">◌</span>
      ) : (
        <Download size={18} />
      )}
      {isLoading
        ? 'Exporting...'
        : `Export ${type === EXPORT_TYPES.PRODUCTS ? 'Products' : 'Orders'}`}
    </Button>
  );
}
