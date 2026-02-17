/**
 * Runtime polyfill for process.env to ensure Internet Identity configuration
 * is available even when build-time environment variables are not set.
 * 
 * This polyfill provides a safe fallback to the production Internet Identity
 * provider URL when process.env.II_URL is not configured.
 */

// Ensure globalThis.process exists
if (typeof globalThis.process === 'undefined') {
  (globalThis as any).process = {};
}

// Ensure globalThis.process.env exists
if (typeof globalThis.process.env === 'undefined') {
  (globalThis as any).process.env = {};
}

// Set II_URL from import.meta.env or use production fallback
if (!globalThis.process.env.II_URL) {
  const metaEnvUrl = (import.meta as any).env?.VITE_II_URL || (import.meta as any).env?.II_URL;
  
  // Use meta env if available, otherwise fallback to production II URL
  globalThis.process.env.II_URL = metaEnvUrl || 'https://identity.ic0.app';
}

// Export for verification (optional)
export const II_URL = globalThis.process.env.II_URL;
