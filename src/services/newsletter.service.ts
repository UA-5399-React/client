import { API_BASE_URL } from '@/constants';

export async function subscribeToNewsletter(email: string) {
  const res = await fetch(`${API_BASE_URL}/newsletter/subscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || 'Failed to subscribe');
  }

  return data;
}

export async function unsubscribeFromNewsletter(email: string) {
  const url = new URL(`${API_BASE_URL}/newsletter/unsubscribe`);

  url.searchParams.set('email', email);

  const res = await fetch(url.toString(), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || 'Failed to unsubscribe');
  }

  return data;
}
