import { useMutation, useQuery } from '@apollo/client/react';

import {
  DELETE_SUBSCRIBER,
  GET_SUBSCRIBERS,
  SEND_NEWSLETTER,
} from '@/services/newsletterSubscribersService';
import type { NewsletterSubscriber } from '@/types/newsletterSubscriber.types';

interface GetSubscribersData {
  getSubscribers: NewsletterSubscriber[];
}

export function useAdminSubscribers() {
  const { data, loading, error } = useQuery<GetSubscribersData>(
    GET_SUBSCRIBERS,
    {
      fetchPolicy: 'cache-and-network',
    },
  );

  const [deleteSubscriber] = useMutation(DELETE_SUBSCRIBER);

  const handleDelete = async (email: string) => {
    try {
      await deleteSubscriber({
        variables: { email },
        refetchQueries: [{ query: GET_SUBSCRIBERS }],
        awaitRefetchQueries: true,
      });
    } catch (mutationError) {
      console.error('Failed to delete subscriber:', mutationError);
    }
  };

  const [sendNewsletterMutation, { loading: isSending }] =
    useMutation(SEND_NEWSLETTER);

  const handleSendNewsletter = async (subject: string, text: string) => {
    try {
      await sendNewsletterMutation({
        variables: { input: { subject, text } },
      });
    } catch (err) {
      console.error('Failed to send newsletter:', err);
    }
  };

  return {
    subscribers: data?.getSubscribers ?? [],
    loading,
    error,
    isSending,
    handleDelete,
    handleSendNewsletter,
  };
}
