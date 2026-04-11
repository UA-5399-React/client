// TODO: this utility function is just a placeholder, you can replace it with your own implementation
/**
 * Format a date to a readable string
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

export const formatDateToShort = (date: Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: '2-digit',
  });
};

export function formatCurrentMonthRange() {
  const d = new Date();
  const y = d.getFullYear();
  const m = d.getMonth();
  const last = new Date(y, m + 1, 0).getDate();
  const monthName = d.toLocaleString('en-GB', { month: 'long' });
  return `1 - ${last} ${monthName} ${y}`;
}
