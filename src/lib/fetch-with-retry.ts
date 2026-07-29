import { SYNC_RETRY_ATTEMPTS } from "@/config/constants";

const REQUEST_TIMEOUT_MS = 8000;

interface FetchWithRetryOptions extends RequestInit {
  readonly retries?: number;
  readonly timeoutMs?: number;
}

/**
 * Fetches with a hard timeout and automatic retry on network failure.
 * Never throws on retry exhaustion for the caller to handle gracefully —
 * throws only the final error so the Repository layer can wrap it into a Result<T>.
 */
export async function fetchWithRetry(
  url: string,
  options: FetchWithRetryOptions = {}
): Promise<Response> {
  const { retries = SYNC_RETRY_ATTEMPTS, timeoutMs = REQUEST_TIMEOUT_MS, ...init } = options;

  let lastError: unknown;

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, { ...init, signal: controller.signal });
      clearTimeout(timeoutId);
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      lastError = error;
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, 400 * attempt));
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Request failed after retries");
}
