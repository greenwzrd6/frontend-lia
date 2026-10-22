/** Base URL of the .NET backend, read from the VITE_API_URL env variable. */
export const API_URL = import.meta.env.VITE_API_URL as string;
/** Base URL of the external TOJ API, read from the VITE_TOJ_API_URL env variable. */
export const TOJ_API_URL = import.meta.env.VITE_TOJ_API_URL as string;

/**
 * Fetches `${API_URL}${path}` and returns the parsed JSON response.
 *
 * Throws an Error with the status and response body when the response is not
 * ok. Returns undefined for 204 No Content or an empty response body.
 */
export async function apiRequest<T>(
    path: string,
    options?: RequestInit
): Promise<T> {
    const response = await fetch(
        `${API_URL}${path}`,
        options
    );

if (!response.ok) {
    const errorBody = await response.text();

    throw new Error(
        `API request failed: ${response.status} - ${errorBody}`
    );
}
    if (response.status === 204) {
        return undefined as T;
    }

    const responseString = await response.text();

    if (responseString === "") {
        return undefined as T;
    }

    return JSON.parse(responseString) as T;
}

/**
 * Fetches `path` as an absolute URL (no base prefix) and returns parsed JSON.
 *
 * Mirrors {@link apiRequest}'s error handling: throws on non-ok responses and
 * returns undefined for 204 or empty bodies.
 */
export async function apiRequestToj<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(path, options);

  if (!response.ok) {
    const errorBody = await response.text();

    throw new Error(
      `API request failed: ${response.status} - ${errorBody}`
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const responseString = await response.text();

  if (responseString === "") {
    return undefined as T;
  }

  return JSON.parse(responseString) as T;
}