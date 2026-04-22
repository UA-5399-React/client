import { useState } from 'react';
import { Download } from 'lucide-react';

import { Button } from '@/components';
import { exportService } from '@/services/exportService';
import { useErrorStore } from '@/store/errorStore';

interface Props {
  orderId: string;
}

export function DownloadOrderButton({ orderId }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const showMessage = useErrorStore((s) => s.show);

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const blob = await exportService.exportOrderPDF(orderId);

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Order-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      showMessage(
        'success',
        'Export Successful',
        'PDF downloaded successfully',
      );
    } catch (error) {
      showMessage(
        'error',
        'Export Failed',
        error instanceof Error ? error.message : 'Failed to download PDF',
      );
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={isLoading}
      className="flex items-center gap-2 border !border-transparent bg-transparent px-4 py-2 text-sm text-[rgb(var(--color-text))] transition-all hover:!border-green-500 hover:!text-green-500 focus:!ring-0 focus:!outline-none"
    >
      {isLoading ? (
        <span className="animate-spin text-sm">◌</span>
      ) : (
        <Download size={18} />
      )}
      {isLoading ? 'Exporting...' : 'Download PDF'}
    </Button>
  );
}
