export function sanitizeMemberTypeDescription(input: string): string {
  // Simple HTML tag stripping using regex. Removes any content between < and >.
  // Trim whitespace and return plain text.
  if (!input) return '';
  return input.replace(/<[^>]*>/g, '').trim();
}
