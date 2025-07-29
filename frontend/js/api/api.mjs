/**
 * Fetches data from the API and returns the JSON response.
 * @param {string} url - The URL to fetch data from.
 * @param {Object} [options={}] - Optional fetch options.
 * @returns {Promise<Object>} - A promise that resolves to the JSON response.
 */
export async function apiFetch(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`API Error, ${response.status}`);
  }
  return response.json();
}
