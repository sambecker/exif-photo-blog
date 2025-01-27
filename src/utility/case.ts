/**
 * Converts a string to camelCase
 */
function camelCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
}

/**
 * Recursively converts object keys to camelCase
 */
export function camelcaseKeys<T extends Record<string, any>>(
  obj: T,
  options: { deep?: boolean } = {}
): T {
  const result: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    const camelKey = camelCase(key);
    
    if (options.deep && value && typeof value === 'object' && !Array.isArray(value)) {
      result[camelKey] = camelcaseKeys(value, options);
    } else {
      result[camelKey] = value;
    }
  }

  return result as T;
} 