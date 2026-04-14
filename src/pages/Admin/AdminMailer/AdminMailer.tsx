import { NewsletterComposer, TableSubscribers } from '@/components';
import { useAdminSubscribers } from '@/hooks/useSubscribers';

function AdminMailer() {
  const {
    subscribers,
    loading,
    error,
    isSending,
    handleDelete,
    handleSendNewsletter,
  } = useAdminSubscribers();

  return (
    <div className="flex flex-col gap-8 p-8">
      <h1 className="text-2xl font-bold">Admin Mailer</h1>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Compose newsletter</h2>
        <NewsletterComposer
          onSend={handleSendNewsletter}
          isSending={isSending}
        />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Subscribers</h2>
        <TableSubscribers
          items={subscribers}
          loading={loading}
          error={error}
          onDelete={handleDelete}
        />
      </section>
    </div>
  );
}

export default AdminMailer;
