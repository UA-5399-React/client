import { useRef, useState } from 'react';
import { Eye, Send } from 'lucide-react';

import { Button, ConfirmModal } from '..';
import { EditorToolbar } from './EditorToolbar';
import { NewsletterPreview } from './NewsletterPreview';
import { buildNewsletterTemplate } from './newsletterTemplate';

interface NewsletterComposerProps {
  onSend: (subject: string, body: string) => Promise<void>;
  isSending: boolean;
}

export function NewsletterComposer({
  onSend,
  isSending,
}: NewsletterComposerProps) {
  const [subject, setSubject] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const [bodyHtml, setBodyHtml] = useState('');

  const getBody = () => editorRef.current?.innerHTML ?? '';

  const handleInsertLink = () => {
    const url = prompt('Enter URL:');
    if (url) document.execCommand('createLink', false, url);
  };

  const handleSend = async () => {
    const body = getBody();
    const html = buildNewsletterTemplate(subject, body);
    await onSend(subject, html);
    setSubject('');
    setBodyText('');
    if (editorRef.current) editorRef.current.innerHTML = '';
  };

  const isEmpty = !subject.trim() || !bodyText.trim();

  return (
    <div className="rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
      <div className="border-b border-[#e5e7eb] px-4 py-3">
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full border-0 bg-transparent text-base text-[#2C2C2C] outline-none placeholder:text-[#8A92A6]"
        />
      </div>

      <EditorToolbar onInsertLink={handleInsertLink} />

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        data-placeholder="Write your newsletter..."
        onInput={() => {
          setBodyText(editorRef.current?.innerText ?? '');
          setBodyHtml(editorRef.current?.innerHTML ?? '');
        }}
        className="min-h-60 p-4 text-base text-[#2C2C2C] outline-none empty:before:text-[#8A92A6] empty:before:content-[attr(data-placeholder)]"
      />

      <div className="flex justify-end gap-3 border-t border-[#e5e7eb] px-4 py-3">
        <Button
          type="button"
          onClick={() => setShowPreview(true)}
          disabled={isEmpty}
          className="flex items-center gap-2 bg-[#F3F4F6] text-[#5E6366] hover:bg-[#e5e7eb]"
        >
          <Eye className="h-4 w-4" />
          Preview
        </Button>
        <Button
          type="button"
          onClick={() => setShowConfirm(true)}
          disabled={isEmpty || isSending}
          className="flex items-center gap-2 bg-[#437EF7] text-white hover:bg-[#2C5FE4]"
        >
          <Send className="h-4 w-4" />
          {isSending ? 'Sending...' : 'Send newsletter'}
        </Button>
      </div>

      {showPreview && (
        <NewsletterPreview
          subject={subject}
          body={bodyHtml}
          onClose={() => setShowPreview(false)}
        />
      )}

      {showConfirm && (
        <ConfirmModal
          title="Send newsletter"
          description={`Are you sure you want to send "${subject}" to all active subscribers?`}
          confirmText="Send"
          cancelText="Cancel"
          onConfirm={() => {
            setShowConfirm(false);
            handleSend();
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}
