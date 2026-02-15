export function formatDate(value: string | number | Date) {
  const date = new Date(value);
  return date.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
}
