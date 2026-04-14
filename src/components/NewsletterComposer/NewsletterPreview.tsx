import { X } from 'lucide-react';

import { buildNewsletterTemplate } from './newsletterTemplate';

interface NewsletterPreviewProps {
  subject: string;
  body: string;
  onClose: () => void;
}

export function NewsletterPreview({
  subject,
  body,
  onClose,
}: NewsletterPreviewProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="flex h-[80vh] w-full max-w-2xl flex-col rounded-lg bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#e5e7eb] px-6 py-4">
          <div>
            <p className="text-xs text-[#8A92A6]">Preview</p>
            <p className="font-semibold text-[#2C2C2C]">
              {subject || 'No subject'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-[#8A92A6] hover:bg-[#F3F4F6] hover:text-[#2C2C2C]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <iframe
            srcDoc={buildNewsletterTemplate(subject, body)}
            className="h-full w-full border-none"
            title="Email preview"
            sandbox="allow-same-origin"
          />
        </div>
      </div>
    </div>
  );
}
