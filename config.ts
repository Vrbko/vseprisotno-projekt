const endpoints = [ 'http://10.0.2.2:8080'];

let activeBaseUrl: string | null = null;

export const getBaseUrl = async (): Promise<string> => {
  if (activeBaseUrl) return activeBaseUrl;

  for (const base of endpoints) {
    try {
      const response = await fetch(`${base}/docs`);
      if (response.ok) {
        activeBaseUrl = base;
        return base;
      }
    } catch (_) {
      // Ignore and try next
    }
  }

  throw new Error('No available API endpoints found.');
};
