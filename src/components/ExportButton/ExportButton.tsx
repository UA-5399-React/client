import { useState } from 'react';
import { Download } from 'lucide-react';

import { Button } from '@/components';
import { EXPORT_TYPES, type ExportType } from '@/constants';
import { exportService } from '@/services/exportService';
import { useErrorStore } from '@/store/errorStore';

interface ExportButtonProps {
  type: ExportType;
}

export function ExportButton({ type }: ExportButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const showMessage = useErrorStore((s) => s.show);

  const handleExport = async () => {
    setIsLoading(true);
    try {
      const isProducts = type === EXPORT_TYPES.PRODUCTS;
      const fileName = isProducts ? 'products_export' : 'orders_export';
      const onExport = isProducts
        ? exportService.exportProducts
        : exportService.exportOrders;

      const blob = await onExport();

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
