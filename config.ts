const endpoints = ['http://164.8.205.36:8080', 'http://192.168.1.80:8080'];

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
