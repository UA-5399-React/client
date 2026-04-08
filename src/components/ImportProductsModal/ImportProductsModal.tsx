import { useRef, useState } from 'react';
import clsx from 'clsx';
import { AlertCircle, CheckCircle2, Loader2, Upload, X } from 'lucide-react';

import { Button } from '@/components/Button';
import { useImportProducts } from '@/hooks/useImportProducts';

interface ImportProductsModalProps {
  onClose: () => void;
}

const ACCEPTED_EXTENSIONS = ['.xlsx', '.csv'];

export function ImportProductsModal({ onClose }: ImportProductsModalProps) {
  const { importProducts, loading, error, result, reset, validateFile } =
    useImportProducts();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const handleClose = () => {
    if (loading) return;
    reset();
    onClose();
  };

  const handleFile = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setFileError(validationError);
      return;
    }
    setFileError(null);
    void importProducts(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // reset input so the same file can be re-selected after reset
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleReset = () => {
    reset();
    setFileError(null);
  };

  const isIdle = !loading && !error && !result;
  const isLoading = loading;
  const hasResult = !loading && !error && result !== null;
  const hasError = !loading && error !== null && result === null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="Import products"
    >
      <div
        className="flex w-full max-w-[560px] flex-col rounded-lg bg-[rgb(var(--color-bg-sec))] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-[rgb(var(--color-text))]">
            Import Products
          </h2>
          <button
            onClick={handleClose}
            disabled={isLoading}
            aria-label="Close modal"
            className="text-muted hover:text-[rgb(var(--color-text))] disabled:opacity-40"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* ── Idle: drop zone ── */}
          {isIdle && (
            <>
              <div
                role="button"
                tabIndex={0}
                aria-label="File upload area"
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) =>
                  e.key === 'Enter' && fileInputRef.current?.click()
                }
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={clsx(
                  'flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed px-6 py-10 transition-colors',
                  dragOver
                    ? 'border-blue-500 bg-blue-500/5'
                    : 'border-gray-300 bg-gray-50 hover:border-blue-500 hover:bg-blue-500/5',
                )}
              >
                <Upload className="text-muted h-10 w-10" />
                <div className="text-center">
                  <p className="font-medium text-[rgb(var(--color-text))]">
                    Drag &amp; drop your file here
                  </p>
                  <p className="text-muted mt-1 text-sm">or click to browse</p>
                </div>
                <p className="text-muted text-xs">
                  Accepted: {ACCEPTED_EXTENSIONS.join(', ')} · Max 10 MB
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_EXTENSIONS.join(',')}
                className="hidden"
                onChange={handleInputChange}
                aria-label="File input"
              />

              {fileError && (
                <p
                  role="alert"
                  className="mt-3 flex items-center gap-2 text-sm text-red-600"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {fileError}
                </p>
              )}
            </>
          )}

          {/* ── Loading ── */}
          {isLoading && (
            <div className="flex flex-col items-center gap-4 py-6">
              <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
              <p className="font-medium text-[rgb(var(--color-text))]">
                Importing…
              </p>
              <p className="text-muted text-sm">
                Please wait while the file is being processed
              </p>
            </div>
          )}

          {/* ── Error (network / server) ── */}
          {hasError && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-lg border border-red-600 bg-red-600/10 p-4 text-red-600"
            >
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="font-medium">Import failed</p>
                <p className="mt-1 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* ── Result ── */}
          {hasResult && result && (
            <div className="flex flex-col gap-4">
              {/* Success row */}
              <div
                role="status"
                className="flex items-center gap-3 rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-green-500"
              >
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <p className="font-medium">
                  {result.imported}{' '}
                  {result.imported === 1 ? 'product' : 'products'} imported
                  successfully
                </p>
              </div>

              {/* Failed rows */}
              {result.failed.length > 0 && (
                <div className="rounded-lg border border-orange-500/30 bg-orange-500/10 p-4">
                  <p className="flex items-center gap-2 font-medium text-orange-500">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {result.failed.length}{' '}
                    {result.failed.length === 1 ? 'row' : 'rows'} had errors
                  </p>
                  <ul
                    className="mt-3 max-h-[200px] overflow-y-auto"
                    aria-label="Import errors"
                  >
                    {result.failed.map(({ row, reason }) => (
                      <li
                        key={row}
                        className="border-t border-orange-500/20 py-1.5 text-sm text-orange-500 first:border-t-0"
                      >
                        <span className="font-mono font-semibold">
                          Row {row}:
                        </span>{' '}
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {!isLoading && (
          <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
            {(hasError || hasResult) && (
              <Button
                onClick={handleReset}
                className="border border-gray-300 bg-transparent text-[rgb(var(--color-text))] hover:border-blue-500 hover:text-blue-500"
              >
                Import another file
              </Button>
            )}
            <Button
              onClick={handleClose}
              className="bg-blue-800 text-white hover:bg-transparent hover:text-blue-800"
              variant="primary"
            >
              {hasResult ? 'Done' : 'Cancel'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
